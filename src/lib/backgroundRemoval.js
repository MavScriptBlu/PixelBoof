/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// The solid background color we ask Gemini to generate on, and then key out.
// Chroma green is the standard choice here — it's rare in character art and
// gives clean separation from skin tones, unlike black (too many sticker
// colors/shadows are near-black and would get eaten by the key).
export const CHROMA_KEY_COLOR = {r: 0, g: 255, b: 0}
export const CHROMA_KEY_HEX = '#00FF00'

/**
 * Samples small patches from each corner of the image and returns their
 * average color. This lets us detect whatever background color the AI
 * actually generated — which isn't always the exact chroma green we asked for.
 *
 * @param {Uint8ClampedArray} data - Raw pixel data (RGBA, flat array)
 * @param {number} width
 * @param {number} height
 * @returns {{r:number, g:number, b:number}}
 */
function detectBackgroundColor(data, width, height) {
  const patch = 8 // sample an 8×8 block from each corner
  const samples = []

  for (let y = 0; y < patch; y++) {
    for (let x = 0; x < patch; x++) {
      const coords = [
        [x, y],                            // top-left
        [width - 1 - x, y],               // top-right
        [x, height - 1 - y],              // bottom-left
        [width - 1 - x, height - 1 - y]   // bottom-right
      ]
      for (const [cx, cy] of coords) {
        const i = (cy * width + cx) * 4
        samples.push({r: data[i], g: data[i + 1], b: data[i + 2]})
      }
    }
  }

  const sum = samples.reduce(
    (acc, s) => ({r: acc.r + s.r, g: acc.g + s.g, b: acc.b + s.b}),
    {r: 0, g: 0, b: 0}
  )
  const n = samples.length
  return {
    r: Math.round(sum.r / n),
    g: Math.round(sum.g / n),
    b: Math.round(sum.b / n)
  }
}

/**
 * Returns the Euclidean distance between two RGB colors.
 * Max possible distance (black→white) is ~441.
 */
function colorDistance(a, b) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2)
}

/*
 * Strips a solid chroma-key background out of a generated image, turning it
 * into a transparent PNG.
 *
 * Strategy:
 *  1. Sample the four corners to detect what background color the AI actually
 *     generated (it's often close to but not exactly #00FF00).
 *  2. If the detected color is reasonably close to our expected chroma key,
 *     use the detected color as the key — this handles AI "drift" where the
 *     background comes out as lime green instead of pure green.
 *  3. If the corners look wildly different from chroma green (the AI ignored
 *     the background instruction entirely), fall back to the expected key color
 *     — it may not remove much, but it won't eat the character either.
 *
 * For each pixel, this measures its color distance from the key color:
 *  - close to the key  → fully transparent
 *  - far from the key  → left untouched (fully opaque)
 *  - in between        → alpha fades smoothly across that band
 *
 * @param {string} base64 - The source image as a base64 data URL.
 * @param {{r:number,g:number,b:number}} [keyColor] - Override key color (optional).
 * @returns {Promise<string>} A base64 PNG data URL with the background transparent.
 */
export function removeChromaKeyBackground(base64, keyColor = null) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d', {willReadFrequently: true})
      ctx.drawImage(img, 0, 0)

      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = frame.data

      // --- Detect actual background color from corners ---
      const detected = detectBackgroundColor(data, canvas.width, canvas.height)
      const distFromExpected = colorDistance(detected, CHROMA_KEY_COLOR)

      // If detected color is within ~100 of expected chroma green, use it
      // (handles AI drift — e.g. #33FF00 instead of #00FF00).
      // If corners look totally different (>180 distance), the AI probably
      // generated a real background; fall back to expected key so we don't
      // accidentally remove parts of the character.
      const activeKey = keyColor
        ?? (distFromExpected < 180 ? detected : CHROMA_KEY_COLOR)

      console.debug(
        '[bgRemoval] detected bg:', detected,
        '| dist from expected green:', Math.round(distFromExpected),
        '| using key:', activeKey
      )

      const INNER = 60  // distance below this = fully transparent
      const OUTER = 130 // distance above this = fully opaque

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        const distance = Math.sqrt(
          (r - activeKey.r) ** 2 + (g - activeKey.g) ** 2 + (b - activeKey.b) ** 2
        )

        if (distance <= INNER) {
          data[i + 3] = 0
        } else if (distance < OUTER) {
          const fade = (distance - INNER) / (OUTER - INNER)
          data[i + 3] = Math.round(data[i + 3] * fade)
        }
        // else: distance >= OUTER → leave alpha as-is (fully opaque)
      }

      ctx.putImageData(frame, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () =>
      reject(new Error('Could not load image for background removal.'))
    img.src = base64
  })
}
