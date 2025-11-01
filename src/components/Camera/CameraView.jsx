/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useState, useEffect, useRef, useCallback} from 'react'
import {useStore} from '../../lib/store'
import ModeSelector from './ModeSelector'
import CustomPrompt from './CustomPrompt'
import PhotoBar from './PhotoBar'
import ZoomControls from './ZoomControls'
import './CameraView.css'

// Create a reusable canvas for image processing to avoid re-creating it on every render.
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')


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
 * Renders the main camera view, including the video feed, controls,
 * and photo capture functionality.
 * @param {object} props - The component props.
 * @param {function(string): void} props.onPhotoClick - Callback to handle clicking a photo thumbnail.
 */
export default function CameraView({onPhotoClick}) {
  const zoom = useStore.useZoom()
  const activeMode = useStore.useActiveMode()
  const showTutorial = useStore.useShowTutorial()
  const showDisclaimer = useStore.useShowDisclaimer()
  const {setZoom, snapPhoto} = useStore.getState()

  const [videoActive, setVideoActive] = useState(false)
  const [didInitVideo, setDidInitVideo] = useState(false)
  const [didJustSnap, setDidJustSnap] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const pinchStartZoomRef = useRef(1)
  const initialPinchDistRef = useRef(0)


  /*
   * Stops the video stream and releases the camera.
   */
  const stopVideo = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      setVideoActive(false)
    }
  }, [])


  /*
   * Starts the video stream from the user's webcam.
   */
  const startVideo = useCallback(async () => {
    setDidInitVideo(true)
    if (streamRef.current) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {width: {ideal: 1920}, height: {ideal: 1080}},
        audio: false,
        facingMode: {ideal: 'user'}
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setVideoActive(true)

      // Configure the canvas to be a square based on the smaller dimension of the video stream.
      const {width, height} = stream.getVideoTracks()[0].getSettings()
      const squareSize = Math.min(width, height)
      canvas.width = squareSize
      canvas.height = squareSize
    } catch (error) {
      console.error('Failed to get user media', error)
    }
  }, [])


  /*
   * Effect to manage the video stream based on component visibility and modal states.
   */
  useEffect(() => {
    if (didInitVideo && !showDisclaimer && !showTutorial) {
      startVideo()
    }
  }, [didInitVideo, startVideo, showDisclaimer, showTutorial])


  /*
   * Effect to ensure the video stream is stopped when the component unmounts. (app close or view changed to gallery)
   */
  useEffect(() => {
    return () => stopVideo()
  }, [stopVideo])


  /*
   * Captures a frame from the video, sends it for processing, and creates a photo.
   */
  const takePhoto = () => {
    const video = videoRef.current
    if (!video) return

    const {videoWidth, videoHeight} = video

    // Calculate source dimensions for a centered, square crop from the video feed, considering zoom.
    const squareSize = canvas.width
    const sourceSize = Math.min(videoWidth, videoHeight) / zoom
    const sourceX = (videoWidth - sourceSize) / 2
    const sourceY = (videoHeight - sourceSize) / 2

    // Draw the mirrored and cropped video frame onto the canvas.
    ctx.clearRect(0, 0, squareSize, squareSize)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(-1, 1) // Mirror horizontally

    ctx.drawImage(
      video,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      -squareSize,
      0,
      squareSize,
      squareSize
    )

    snapPhoto(
      canvas.toDataURL('image/jpeg'),
      activeMode === 'custom' ? customPrompt : null
    )

    // Trigger the flash effect.
    setDidJustSnap(true)
    setTimeout(() => setDidJustSnap(false), 1000)
  }


  // --- TOUCH HANDLERS FOR PINCH-ZOOM --- //
  
  const handleVideoTouchStart = e => {
    if (e.touches.length === 2) {
      initialPinchDistRef.current = getDistance(e.touches)
      pinchStartZoomRef.current = zoom
    }
  }

  const handleVideoTouchMove = e => {
    if (e.touches.length === 2) {
      e.preventDefault() // Prevent page scroll
      const newDist = getDistance(e.touches)
      const scale = newDist / initialPinchDistRef.current
      const newZoom = pinchStartZoomRef.current * scale
      setZoom(Math.max(1, Math.min(newZoom, 3))) // Clamp zoom level
    }
  }

  return (
    <div className="camera-view-container">
      <div
        className="video"
        onTouchStart={handleVideoTouchStart}
        onTouchMove={handleVideoTouchMove}
      >
        <video
          ref={videoRef}
          muted
          autoPlay
          playsInline
          disablePictureInPicture="true"
          style={{
            transform: `rotateY(180deg) scale(${zoom})`
          }}
        />
        {didJustSnap && <div className="flash" />}
        {!videoActive && (
          <button
            className="startButton"
            onClick={() => setDidInitVideo(true)}
          >
            <h1>PIXEL BOOF</h1>
            <p>{didInitVideo ? 'LOADING...' : 'PRESS START'}</p>
          </button>
        )}
        {videoActive && <ZoomControls />}
      </div>

      {videoActive && (
        <div className="camera-footer">
          <div className="selectorsContainer">
            <ModeSelector />
          </div>

          {activeMode === 'custom' && (
            <CustomPrompt value={customPrompt} onChange={setCustomPrompt} />
          )}

          <button onClick={takePhoto} className="shutter">
            <span className="icon">camera</span>
          </button>

          <PhotoBar onPhotoClick={onPhotoClick} />
        </div>
      )}
    </div>
  )
}