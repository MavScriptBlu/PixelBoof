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
import imageData from './imageData'
import gen from './gemini'

const model = 'gemini-2.5-flash-image'
const modeKeys = Object.keys(modes)

// A consistent suffix added to all prompts to guide the AI into generating a sticker-like image.
const stickerPromptSuffix =
  'The final image should be a die-cut sticker of the character with a thick white border, isolated on a flat black background, with no drop shadow.'


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
    stickerQueue: [], // An array of photo IDs saved for batch download.
    stickerQueueDownloading: false, // Flag indicating if the sticker queue zip is being generated.
    errorMessage: null, // A string for displaying global error messages.

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
     * If not, it sets the `showTutorial` state to true.
     */
    checkTutorial: () => {
      const tutorialDismissed = localStorage.getItem(
        'pixelBoothTutorialDismissed'
      )
      if (!tutorialDismissed) {
        set({showTutorial: true})
      }
    },

    /*
     * Persists the tutorial dismissal in localStorage and hides the tutorial.
     */
    dismissTutorial: () => {
      localStorage.setItem('pixelBoothTutorialDismissed', 'true')
      set({showTutorial: false})
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
      const {activeMode} = get()
      imageData.inputs[id] = b64 // Store input image temporarily

      // Determine the effective mode, handling the 'random' lens option.
      const modeKeysWithoutCustom = modeKeys.filter(key => key !== 'custom')
      const effectiveMode =
        activeMode === 'random'
          ? shuffle(modeKeysWithoutCustom)[0]
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

        // Store the output image and update the photo's state to not busy.
        imageData.outputs[id] = result
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
    }
  }))
)


export const useStore = createSelectorHooks(useStoreBase);
// Initialize the app when the module is first loaded.
useStore.getState().init()
