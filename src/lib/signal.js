/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {formatStickerImage} from './telegram'

/*
 * Signal doesn't publish a public API for third parties to create sticker packs
 * on a user's behalf — the only official way is Signal's own desktop Sticker Pack
 * Maker. So PixelBoof's job here is just to format the image to Signal's spec and
 * hand it off as cleanly as possible: native share sheet on mobile (so it lands
 * straight in the Signal app), or a plain download as a fallback on desktop.
 *
 * @param {string} base64 - The sticker's base64 image data.
 * @param {string} [fileName] - File name to use for the share/download.
 * @returns {Promise<{method: 'share'|'download'|'cancelled'}>}
 */
export async function exportForSignal(base64, fileName = 'pixelboof-sticker.png') {
  const formatted = await formatStickerImage(base64)

  if (navigator.share && typeof navigator.canShare === 'function') {
    try {
      const response = await fetch(formatted)
      const blob = await response.blob()
      const file = new File([blob], fileName, {type: blob.type})

      if (navigator.canShare({files: [file]})) {
        await navigator.share({
          title: 'PixelBoof Sticker',
          text: 'Open this in Signal to add it to one of your sticker packs!',
          files: [file]
        })
        return {method: 'share'}
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return {method: 'cancelled'}
      }
      console.warn('Signal share failed, falling back to download.', error)
    }
  }

  // Fallback for browsers without file-sharing support (most desktops).
  const a = document.createElement('a')
  a.href = formatted
  a.download = fileName
  a.click()
  return {method: 'download'}
}
