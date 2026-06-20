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

/*
 * Strips a solid chroma-key background out of a generated image, turning it
 * into a transparent PNG.
 *
 * For each pixel, this measures its color distance from the key color:
 *  - close to the key  -> fully transparent
 *  - far from the key  -> left untouched (fully opaque)
 *  - in between        -> alpha fades smoothly across that band
 * That middle band is what keeps edges looking soft instead of jagged, and
 * avoids a hard green/magenta fringe around the cutout.
 *
 * @param {string} base64 - The source image as a base64 data URL.
 * @param {{r:number,g:number,b:number}} [keyColor] - The background color to remove.
 * @returns {Promise<string>} A base64 PNG data URL with the background made transparent.
 */
export function removeChromaKeyBackground(base64, keyColor = CHROMA_KEY_COLOR) {
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

      const INNER = 60 // distance below this = fully transparent
      const OUTER = 130 // distance above this = fully opaque

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        const distance = Math.sqrt(
          (r - keyColor.r) ** 2 + (g - keyColor.g) ** 2 + (b - keyColor.b) ** 2
        )

        if (distance <= INNER) {
          data[i + 3] = 0
        } else if (distance < OUTER) {
          const fade = (distance - INNER) / (OUTER - INNER)
          data[i + 3] = Math.round(data[i + 3] * fade)
        }
        // else: distance >= OUTER, leave alpha as-is (fully opaque)
      }

      ctx.putImageData(frame, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () =>
      reject(new Error('Could not load image for background removal.'))
    img.src = base64
  })
}
