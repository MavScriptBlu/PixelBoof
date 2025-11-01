/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useState, useCallback, useEffect} from 'react'
import {useStore} from '../lib/store'
import Header from './common/Header'
import CameraView from './Camera/CameraView'
import GalleryView from './Gallery/GalleryView'
import Disclaimer from './modals/Disclaimer'
import Tutorial from './modals/Tutorial'
import ErrorToast from './modals/ErrorToast'
import FocusedPhotoModal from './modals/FocusedPhotoModal'
import StickerQueueModal from './modals/StickerQueueModal'
import './App.css'

/*
 * The main application component. It acts as the root container, controls
 * the display of different views (Camera, Gallery and modals) based on the
 * application's state.
 */
export default function App() {
  // --- STATE MANAGEMENT --- //
  const currentView = useStore.useCurrentView()
  const showDisclaimer = useStore.useShowDisclaimer()
  const showTutorial = useStore.useShowTutorial()

  // Local state for UI concerns that don't need to be global.
  const [focusedId, setFocusedId] = useState(null)
  const [showStickerQueue, setShowStickerQueue] = useState(false)


  // --- DERIVED STATE --- //
  const isModalOpen = !!focusedId || showStickerQueue


  // --- CALLBACKS & EVENT HANDLERS --- //
  /*
   * Closes any active modal view.
   */
  const closeModal = useCallback(() => {
    setFocusedId(null)
    setShowStickerQueue(false)
  }, [])

  /*
   * Handles clicks on photos, which triggers the focused photo modal.
   * @param {string} id The ID of the photo to focus on.
   */
  const handlePhotoClick = useCallback(id => {
    setFocusedId(id)
  }, [])

  /*
   * Opens the sticker queue modal.
   */
  const handleShowStickerQueue = useCallback(() => {
    setShowStickerQueue(true)
  }, [])

  /*
   * Effect to handle 'Escape' key press for closing modals.
   */
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen, closeModal])


  // --- RENDER --- //
  return (
    <main>
      {/* Global Modals & Toasts */}
      {showDisclaimer && <Disclaimer />}
      {showTutorial && <Tutorial />}
      <ErrorToast />

      {/* Main App Layout */}
      <Header />
      <div className="app-content">
        {isModalOpen && <div className="modal-overlay" onClick={closeModal} />}

        {/* Focused Photo Modal */}
        {focusedId && (
          <FocusedPhotoModal photoId={focusedId} onClose={closeModal} />
        )}

        {/* Sticker Queue Modal */}
        {showStickerQueue && <StickerQueueModal onClose={closeModal} />}

        {/* Conditional rendering of Camera or Gallery view */}
        {currentView === 'camera' ? (
          <CameraView onPhotoClick={handlePhotoClick} />
        ) : (
          <GalleryView
            onPhotoClick={handlePhotoClick}
            onShowStickerQueue={handleShowStickerQueue}
          />
        )}
      </div>
    </main>
  )
}
