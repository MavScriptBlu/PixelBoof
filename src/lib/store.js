/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import JSZip from 'jszip'
import shuffle from 'lodash.shuffle'

import modes from './modes'
import themes from './themes'
import imageData from './imageData'
import gen from './gemini'
import {createStickerPack, addStickerToPack, verifyTelegramLogin} from './telegram'
import {exportForSignal} from './signal'
import {removeChromaKeyBackground, CHROMA_KEY_HEX} from './backgroundRemoval'

const model = 'gemini-2.5-flash-image'
const modeKeys = Object.keys(modes)

// A consistent suffix added to all prompts to guide the AI into generating a sticker-like image.
// Background is a solid chroma-key color (not black) so we can cleanly cut it to
// transparency afterward — see backgroundRemoval.js.
const stickerPromptSuffix = `The final image should be a die-cut sticker of the character with a thick white border, isolated on a flat solid background of color ${CHROMA_KEY_HEX} (pure chroma key green), with no drop shadow. The background must be a single flat, uniform color with no gradients, texture, or shading.`


/*
 * Creates the base Zustand store for global application state.
 * - `immer` middleware is used to allow for direct, immutable state updates.
 * - `createSelectors` wrapper automatically generates hooks for each state property (e.g., useStore.photos()).
 * - The store contains both state variables and all actions that modify the state.
 */
const useStoreBase = create(
  immer((set, get) => ({
    // --- INITIAL STATE --- //
    didInit: false, // Flag to prevent re-initialization on hot reloads.
    photos: [], // Array of photo objects {id, mode, isBusy}.
    activeMode: Object.keys(modes)[0], // The currently selected style mode.
    currentView: 'camera', // The current view ('camera' or 'gallery').
    zoom: 1, // The zoom level for the camera view.
    showTutorial: false, // Whether to display the initial tutorial modal.
    showDisclaimer: false, // Whether to display the disclaimer modal.
    showThemeSelector: false, // Whether to display the theme picker (shown every session after onboarding).
    activeTheme: 'gaming', // The currently selected theme key from themes.js.
    stickerQueue: [], // An array of photo IDs saved for batch download.
    stickerQueueDownloading: false, // Flag indicating if the sticker queue zip is being generated.
    errorMessage: null, // A string for displaying global error messages.
    successMessage: null, // A string for displaying global success messages (e.g. "pack created!").

    // Telegram export state. `telegramAuth` is the verified login payload from the
    // widget; `telegramPackName` is the user's single PixelBoof sticker pack on
    // Telegram, created lazily on first export and reused for every export after.
    telegramAuth: JSON.parse(localStorage.getItem('pixelBoothTelegramAuth') || 'null'),
    telegramPackName: localStorage.getItem('pixelBoothTelegramPackName') || null,
    telegramExporting: false,
    signalExporting: false,

    // --- ACTIONS --- //

    /*
     * Initializes the app on first load by checking for disclaimer/tutorial status.
     * Prevents re-initialization.
     */
    init: () => {
      if (get().didInit) {
        return
      }

      const disclaimerAccepted = localStorage.getItem(
        'pixelBoothDisclaimerAccepted'
      )
      if (!disclaimerAccepted) {
        set({showDisclaimer: true})
      } else {
        get().checkTutorial()
      }
      set({didInit: true})
    },

    /*
     * Checks if the user has previously dismissed the tutorial.
     * If not, shows the tutorial. If they have, jumps straight to
     * the theme selector (which always shows every session).
     */
    checkTutorial: () => {
      const tutorialDismissed = localStorage.getItem(
        'pixelBoothTutorialDismissed'
      )
      if (!tutorialDismissed) {
        set({showTutorial: true})
      } else {
        set({showThemeSelector: true})
      }
    },

    /*
     * Persists the tutorial dismissal in localStorage, hides the tutorial,
     * and opens the theme selector.
     */
    dismissTutorial: () => {
      localStorage.setItem('pixelBoothTutorialDismissed', 'true')
      set({showTutorial: false, showThemeSelector: true})
    },

    /*
     * Called when the user picks a theme from the ThemeSelector screen.
     * Sets the active theme, hides the selector, and resets activeMode
     * to the first non-custom mode in the chosen theme.
     * @param {string} key - A theme key from themes.js (e.g. 'gaming', 'pride').
     */
    selectTheme: key => {
      const themeModes = themes[key]?.modes || []
      const firstMode = themeModes.find(m => m !== 'custom') || themeModes[0] || Object.keys(modes)[0]
      set({activeTheme: key, showThemeSelector: false, activeMode: firstMode})
    },

    /*
     * Persists the disclaimer acceptance in localStorage, hides the disclaimer,
     * and then checks if the tutorial should be shown.
     */
    acceptDisclaimer: () => {
      localStorage.setItem('pixelBoothDisclaimerAccepted', 'true')
      set({showDisclaimer: false})
      get().checkTutorial()
    },

    /*
     * Core function to generate a photo.
     * @param {string} b64 - The base64 encoded JPEG from the canvas.
     * @param {string|null} customPrompt - The user-provided prompt, if in 'custom' mode.
     */
    snapPhoto: async (b64, customPrompt) => {
      const id = crypto.randomUUID()
      const {activeMode, activeTheme} = get()
      imageData.inputs[id] = b64 // Store input image temporarily

      // Determine the effective mode, handling the 'random' lens option.
      // Random only picks from the current theme's modes so the result
      // stays on-theme (e.g. random in Pride won't land on a gaming mode).
      const themeModeKeys = themes[activeTheme]?.modes || modeKeys
      const randomPool = themeModeKeys.filter(key => key !== 'custom' && key !== 'random')
      const effectiveMode =
        activeMode === 'random'
          ? shuffle(randomPool)[0]
          : activeMode

      // Add a new photo object to the store in a "busy" state.
      set(state => {
        state.photos.unshift({id, mode: effectiveMode, isBusy: true})
      })

      try {
        // Construct the prompt based on the effective mode.
        let promptText
        if (effectiveMode === 'custom') {
          if (!customPrompt?.trim()) {
            get().setErrorMessage('Custom prompt cannot be empty.')
            // Clean up if prompt is invalid.
            set(state => {
              state.photos = state.photos.filter(p => p.id !== id)
            })
            delete imageData.inputs[id]
            return
          }
          promptText = customPrompt
        } else {
          promptText = modes[effectiveMode].prompt
        }

        // Call the generative model.
        const result = await gen({
          model,
          prompt: `${promptText} ${stickerPromptSuffix}`,
          inputFile: b64
        })

        if (!result) {
          throw new Error('Image generation failed or was aborted.')
        }

        // Strip the chroma-key background out so the sticker has a real
        // transparent background instead of a solid color block.
        const transparent = await removeChromaKeyBackground(result)

        // Store the output image and update the photo's state to not busy.
        imageData.outputs[id] = transparent
        set(state => {
          const photo = state.photos.find(p => p.id === id)
          if (photo) {
            photo.isBusy = false
          }
        })
      } catch (error) {
        console.error('Photo generation failed:', error)
        get().setErrorMessage('Oh no! The pixels got crossed. Please try again.')
        get().deletePhoto(id) // Clean up on failure.
      }
    },

    /*
     * Deletes a photo from the store and its associated image data.
     * @param {string} id - The ID of the photo to delete.
     */
    deletePhoto: id => {
      set(state => {
        state.photos = state.photos.filter(photo => photo.id !== id)
        // Also remove it from the sticker queue if it's there.
        state.stickerQueue = state.stickerQueue.filter(
          stickerId => stickerId !== id
        )
      })

      // Clean up the in-memory image data.
      delete imageData.inputs[id]
      delete imageData.outputs[id]
    },

    // --- STATE SETTERS --- //

    setMode: mode => set({activeMode: mode}),
    setView: view => set({currentView: view}),
    setZoom: zoom => set({zoom: zoom}),
    setErrorMessage: message => set({errorMessage: message}),
    setSuccessMessage: message => set({successMessage: message}),

    // --- STICKER QUEUE ACTIONS --- //

    addToStickerQueue: id => {
      set(state => {
        if (!state.stickerQueue.includes(id)) {
          state.stickerQueue.push(id)
        }
      })
    },

    removeFromStickerQueue: id => {
      set(state => {
        state.stickerQueue = state.stickerQueue.filter(
          stickerId => stickerId !== id
        )
      })
    },

    clearStickerQueue: () => {
      set({stickerQueue: []})
    },

    /*
     * Downloads all images in the sticker queue as a single ZIP file.
     */
    downloadStickerQueue: async () => {
      const {stickerQueue} = get()
      if (stickerQueue.length === 0) return

      set({stickerQueueDownloading: true})

      try {
        const zip = new JSZip()
        // Fetch each image, convert it to a blob, and add it to the zip file.
        for (const id of stickerQueue) {
          const b64 = imageData.outputs[id]
          if (b64) {
            const response = await fetch(b64)
            const blob = await response.blob()
            zip.file(`pixelbooth-sticker-${id}.png`, blob)
          }
        }

        // Generate the zip file and trigger a download.
        const content = await zip.generateAsync({type: 'blob'})
        const url = URL.createObjectURL(content)
        const a = document.createElement('a')
        a.href = url
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        a.download = `pixelbooth-stickers-${timestamp}.zip`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Error creating sticker zip:', error)
        get().setErrorMessage('Could not create sticker zip file.')
      } finally {
        set({stickerQueueDownloading: false})
      }
    },

    // --- TELEGRAM EXPORT ACTIONS --- //

    /*
     * Called once the Telegram Login Widget fires. Re-verifies the login server-side
     * (never trust client data) before persisting it.
     */
    handleTelegramAuth: async authData => {
      try {
        const {user} = await verifyTelegramLogin(authData)
        localStorage.setItem('pixelBoothTelegramAuth', JSON.stringify(authData))
        set({telegramAuth: authData})
        get().setSuccessMessage(`Connected to Telegram as ${user.first_name}!`)
      } catch (error) {
        console.error('Telegram login verification failed:', error)
        get().setErrorMessage('Could not verify Telegram login. Please try again.')
      }
    },

    logoutTelegram: () => {
      localStorage.removeItem('pixelBoothTelegramAuth')
      localStorage.removeItem('pixelBoothTelegramPackName')
      set({telegramAuth: null, telegramPackName: null})
    },

    /*
     * Exports a photo to the user's personal Telegram sticker pack — creating the
     * pack on the first export, and adding to it on every export after that.
     * @param {string} photoId - The ID of the photo to export.
     */
    exportToTelegram: async photoId => {
      const {telegramAuth, telegramPackName} = get()
      if (!telegramAuth) {
        get().setErrorMessage('Connect your Telegram account first.')
        return
      }

      const photo = get().photos.find(p => p.id === photoId)
      const stickerBase64 = imageData.outputs[photoId]
      if (!stickerBase64) return

      const emoji = photo?.mode === 'custom' ? '✏️' : modes[photo?.mode]?.emoji
      set({telegramExporting: true})

      try {
        if (telegramPackName) {
          const result = await addStickerToPack({
            authData: telegramAuth,
            packName: telegramPackName,
            stickerBase64,
            emoji
          })
          get().setSuccessMessage('Added to your Telegram sticker pack!')
          return result
        } else {
          const result = await createStickerPack({
            authData: telegramAuth,
            title: 'My PixelBoof Stickers',
            stickerBase64,
            emoji
          })
          localStorage.setItem('pixelBoothTelegramPackName', result.packName)
          set({telegramPackName: result.packName})
          get().setSuccessMessage('Your Telegram sticker pack is ready!')
          return result
        }
      } catch (error) {
        console.error('Telegram export failed:', error)
        get().setErrorMessage(error.message || 'Could not export to Telegram.')
      } finally {
        set({telegramExporting: false})
      }
    },

    // --- SIGNAL EXPORT ACTIONS --- 