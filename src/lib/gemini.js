/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {GoogleGenAI, Modality} from '@google/genai'
import {limitFunction} from 'p-limit'

// --- CONFIGURATION --- //

const timeoutMs = 123_333 // Max time for a single API request.
const maxRetries = 5 // Max number of retries on failure.
const baseDelay = 3_000 // Base delay for exponential backoff.
const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_API_KEY})

/**
 * A rate-limited and resilient wrapper around the Google GenAI API call.
 * This handles the communication with the Gemini model for image generation.
 *
 * - Uses `p-limit` to ensure only one API request is active at a time, preventing rate-limiting issues.
 * - Implements a timeout to prevent requests from hanging indefinitely.
 * - Implements an exponential backoff retry mechanism for transient network or API errors.
 *
 * @param {object} params - The parameters for the generation request.
 * @param {string} params.model - The generative model to use (e.g., 'gemini-2.5-flash-image').
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
        const modelPromise = ai.models.generateContent(
          {
            model,
            config: {responseModalities: [Modality.IMAGE]},
            contents: {parts}
          },
          {signal}
        )

        const response = await Promise.race([modelPromise, timeoutPromise])

        // Validate the response and extract the generated image data.
        if (!response.candidates || response.candidates.length === 0) {
          throw new Error('No candidates in response')
        }

        const inlineDataPart = response.candidates[0].content.parts.find(
          p => p.inlineData
        )
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

        // If this was the last attempt, re-throw the error to be caught by the caller.
        if (attempt === maxRetries - 1) {
          throw error
        }

        // Wait before retrying, with an exponentially increasing delay.
        const delay = baseDelay * 2 ** attempt
        console.warn(
          `Attempt ${attempt + 1} failed, retrying after ${delay}ms...`
        )
        await new Promise(res => setTimeout(res, delay))
      }
    }
  },
  {concurrency: 1} // Limit to 1 concurrent request to the API.
)
