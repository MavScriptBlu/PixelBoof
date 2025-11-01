/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useState} from 'react'
import {useStore} from '../../lib/store'
import imageData from '../../lib/imageData'
import Share from '../common/Share'
import './FocusedPhotoModal.css'

/*
 * Helper function to calculate the distance between two touch points for pinch-zoom.
 * @param {TouchList} touches - The list of touches from a touch event.
 * @returns {number} The distance between the first two touches.
 */
const getDistance = touches => {
  const [touch1, touch2] = touches
  return Math.sqrt(
    Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
  )
}

/*
 * A modal for displaying a single, focused photo. It allows users to zoom,
 * pan, download, share, or add the photo to the sticker queue.
 * @param {object} props - The component props.
 * @param {string} props.photoId - The ID of the photo to display.
 * @param {function(): void} props.onClose - Callback to close the modal.
 */
export default function FocusedPhotoModal({photoId, onClose}) {
  const stickerQueue = useStore.useStickerQueue()
  const {addToStickerQueue} = useStore.getState()

  const [zoom, setZoom] = useState(1)
  const [transformOrigin, setTransformOrigin] = useState('center center')
  let pinchStartZoom = 1
  let initialPinchDist = 0


  /*
   * Triggers a browser download for the currently focused image.
   */
  const downloadImage = () => {
    const a = document.createElement('a')
    a.href = imageData.outputs[photoId]
    a.download = `pixelbooth-${photoId}.png`
    a.click()
    onClose()
  }



  // --- INTERACTION HANDLERS FOR MOUSE & TOUCH --- //

  const handleWheel = e => {
    e.preventDefault()
    setZoom(prevZoom => {
      const newZoom = prevZoom - e.deltaY * 0.01
      return Math.max(1, Math.min(newZoom, 5)) // Clamp zoom level
    })
  }

  const handleMouseMove = e => {
    const {left, top, width, height} = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setTransformOrigin(`${x}% ${y}%`)
  }

  const handleMouseLeave = () => {
    setTransformOrigin('center center')
  }

  const handleTouchStart = e => {
    if (e.touches.length === 2) {
      initialPinchDist = getDistance(e.touches)
      pinchStartZoom = zoom
    }
  }

  const handleTouchMove = e => {
    if (e.touches.length === 2) {
      const newDist = getDistance(e.touches)
      const scale = newDist / initialPinchDist
      const newZoom = pinchStartZoom * scale
      setZoom(Math.max(1, Math.min(newZoom, 5))) // Clamp zoom level
    }
  }

  const isInStickerQueue = stickerQueue.includes(photoId)

  return (
    <div className="modal-container" onClick={e => e.stopPropagation()}>
      <div
        className="focusedPhoto"
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <img
          src={imageData.outputs[photoId]}
          alt="Focused"
          draggable={false}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: transformOrigin
          }}
        />
      </div>
      <button className="circleBtn" onClick={onClose} aria-label="Close modal">
        <span className="icon">close</span>
      </button>
      <div className="focused-actions">
        <button
          className="button stickerButton"
          onClick={() => addToStickerQueue(photoId)}
          disabled={isInStickerQueue}
        >
          <span className="icon">label</span>
          {isInStickerQueue ? 'Saved' : 'Save for Sticker'}
        </button>
        <Share
          url={imageData.outputs[photoId]}
          fileName={`pixelbooth-${photoId}.png`}
          onShared={onClose}
        />
        <button className="button downloadButton" onClick={downloadImage}>
          Download
        </button>
      </div>
    </div>
  )
}
