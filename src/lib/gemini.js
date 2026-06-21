/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {GoogleGenAI} from '@google/genai'
import {limitFunction} from 'p-limit'

// --- CONFIGURATION --- //

const timeoutMs = 123_333 // Max time for a single API request.
const maxRetries = 5 // Max number of retries on failure.
const baseDelay = 3_000 // Base delay for exponential backoff.
// Image generation models and responseModalities live on v1beta, not v1.
// The v1 stable API does not recognize the responseModalities field in
// GenerationConfig — it's a v1beta-only feature, so we must stay on v1beta.
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  apiVersion: 'v1beta'
})

/**
 * A rate-limited and resilient wrapper around the Google GenAI API call.
 * This handles the communication with the Gemini model for image generation.
 *
 * - Uses `p-limit` to ensure only one API request is active at a time, preventing rate-limiting issues.
 * - Implements a timeout to prevent requests from hanging indefinitely.
 * - Implements an exponential backoff retry mechanism for transient network or API errors.
 *
 * @param {object} params - The parameters for the generation request.
 * @param {string} params.model - The generative model to use.
 * @param {string} params.prompt - The text prompt to guide the image generation.
 * @param {string} [params.inputFile] - The base64-encoded input image from the user's camera.
 * @param {AbortSignal} [params.signal] - An optional AbortSignal to cancel the request.
 * @returns {Promise<string|undefined>} A promise that resolves to the base64-encoded output image string, or undefined if aborted.
 */

export default limitFunction(
  async ({model, prompt, inputFile, signal}) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Race the API call against a timeout promise.
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), timeoutMs)
        )

        // Construct the request payload parts (image and text).
        const parts = []
        if (inputFile) {
          parts.push({
            inlineData: {
              data: inputFile.split(',')[1], // Remove the 'data:image/jpeg;base64,' prefix
              mimeType: 'image/jpeg'
            }
          })
        }
        parts.push({text: prompt})

        // Make the API call to the Gemini model.
        // NOTE: responseModalities must include both 'TEXT' and 'IMAGE' for the
        // image model — passing only ['IMAGE'] causes generation to fail.
        const modelPromise = ai.models.generateContent(
          {
            model,
            config: {responseModalities: ['TEXT', 'IMAGE']},
            contents: parts
          },
          {signal}
        )

        const response = await Promise.race([modelPromise, timeoutPromise])

        // Log prompt-level block if present (happens before any candidate is generated)
        if (response.promptFeedback?.blockReason) {
          console.error('[Gemini] Prompt blocked:', response.promptFeedback.blockReason)
          throw new Error(`Prompt blocked: ${response.promptFeedback.blockReason}`)
        }

        // Validate the response and extract the generated image data.
        if (!response.candidates || response.candidates.length === 0) {
          throw new Error('No candidates in response')
        }

        const candidate = response.candidates[0]

        // Safety blocks return a candidate with finishReason='SAFETY' but no content.
        // Logging the safetyRatings here helps diagnose which category tripped.
        if (!candidate.content) {
          const reason = candidate.finishReason ?? 'unknown'
          const ratings = candidate.safetyRatings
            ? JSON.stringify(candidate.safetyRatings)
            : 'none'
          console.error(
            `[Gemini] Content blocked on attempt ${attempt + 1}.`,
            `finishReason: ${reason}`,
            `safetyRatings: ${ratings}`
          )
          throw new Error(`Content blocked by safety filter (${reason})`)
        }

        const inlineDataPart = candidate.content.parts.find(p => p.inlineData)
        if (!inlineDataPart) {
          throw new Error('No inline data found in response')
        }

        // Return the successfully generated image data.
        return 'data:image/png;base64,' + inlineDataPart.inlineData.data
      } catch (error) {
        // If the request was deliberately aborted by the user, stop immediately.
        if (signal?.aborted || error.name === 'AbortError') {
          return
        }

        // Log detailed error info so we can diagnose API failures (400s, etc.)
        const errDetails = error?.errorDetails ?? error?.status ?? error?.statusText ?? ''
        console.error(
          'Attempt ' + (attempt + 1) + ' error [' + (error?.status ?? error?.name) + ']:',
          error?.message,
          errDetails ? JSON.stringify(errDetails) : ''
        )

        // If this was the last attempt, re-throw the error to be caught by the caller.
        if (attempt === maxRetries - 1) {
          throw error
        }

        // Wait before retrying, with an exponentially increasing delay.
        const delay = baseDelay * 2 ** attempt
        console.warn('Retrying after ' + delay + 'ms...')
        await new Promise(res => setTimeout(res, delay))
      }
    }
  },
  {concurrency: 1} // Limit to 1 concurrent request to the API.
)
