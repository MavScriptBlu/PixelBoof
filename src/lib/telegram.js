/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const TELEGRAM_BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME

/*
 * Resizes a base64 image so its longest side is exactly 512px (Telegram's static
 * sticker spec), keeping aspect ratio and transparency, and outputs PNG.
 */
export function formatStickerImage(base64) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const scale = 512 / Math.max(img.width, img.height)
      const width = Math.round(img.width * scale)
      const height = Math.round(img.height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('Could not load image for sticker formatting.'))
    img.src = base64
  })
}

/*
 * Dynamically loads Telegram's Login Widget script into the given container element.
 * `data-request-access="write"` asks the user's permission for the bot to act on
 * their behalf, so they don't have to separately go find the bot and hit Start.
 *
 * @param {HTMLElement} containerEl - Empty element to render the widget button into.
 * @param {function(object): void} onAuth - Called with Telegram's user/auth payload on success.
 */
export function renderTelegramLoginWidget(containerEl, onAuth) {
  if (!TELEGRAM_BOT_USERNAME) {
    console.error(
      'VITE_TELEGRAM_BOT_USERNAME is not set — Telegram login widget cannot render.'
    )
    return
  }

  // Telegram's widget invokes this global function by name once login succeeds.
  window.onTelegramAuth = userData => onAuth(userData)

  const script = document.createElement('script')
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.async = true
  script.setAttribute('data-telegram-login', TELEGRAM_BOT_USERNAME)
  script.setAttribute('data-size', 'medium')
  script.setAttribute('data-radius', '8')
  script.setAttribute('data-request-access', 'write')
  script.setAttribute('data-onauth', 'onTelegramAuth(user)')

  containerEl.innerHTML = ''
  containerEl.appendChild(script)
}

async function postJson(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
  const data = await res.json()
  if (!res.ok || !data.ok) {
    throw new Error(data.error || 'Telegram request failed.')
  }
  return data
}

/*
 * Asks our backend to verify a Telegram login payload. Used right after the
 * widget fires, so we don't store bogus/forged auth data client-side.
 */
export function verifyTelegramLogin(authData) {
  return postJson('/api/telegram/verify', {authData})
}

/*
 * Creates a brand-new personal Telegram sticker pack containing this one sticker.
 * Only call this the FIRST time a user exports — after that, use addStickerToPack.
 */
export async function createStickerPack({authData, title, stickerBase64, emoji}) {
  const formatted = await formatStickerImage(stickerBase64)
  return postJson('/api/telegram/create-set', {
    authData,
    title,
    stickerDataUrl: formatted,
    emoji
  })
}

/*
 * Adds another sticker to a pack that was already created via createStickerPack.
 */
export async function addStickerToPack({authData, packName, stickerBase64, emoji}) {
  const formatted = await formatStickerImage(stickerBase64)
  return postJson('/api/telegram/add-sticker', {
    authData,
    packName,
    stickerDataUrl: formatted,
    emoji
  })
}
