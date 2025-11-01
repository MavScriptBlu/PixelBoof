/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useState, useEffect} from 'react'

/*
 * A component that provides a native sharing button using the Web Share API.
 * It intelligently renders itself only if the user's browser supports sharing files.
 *
 * @param {object} props - The component props.
 * @param {string} props.url - The URL of the image to share (can be a data URL).
 * @param {string} props.fileName - The name to give the shared file.
 * @param {function} [props.onShared] - A callback function to execute after a successful share action.
 */
export default function Share({url, fileName, onShared}) {
  const [canShare, setCanShare] = useState(false)

  // On component mount, check if the browser supports the Web Share API for files.
  useEffect(() => {
    if (navigator.share && typeof navigator.canShare === 'function') {
      // The `canShare` check requires a dummy file to see if file sharing is possible.
      const dummyFile = new File([''], 'dummy.txt', {type: 'text/plain'})
      if (navigator.canShare({files: [dummyFile]})) {
        setCanShare(true)
      }
    }
  }, [])


  /*
   * Fetches the image data, creates a File object, and triggers the native share dialog.
   */
  const handleShare = async () => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const file = new File([blob], fileName, {type: blob.type})

      await navigator.share({
        title: 'Pixel Booth Creation',
        text: 'Check out this image I made with Pixel Booth!',
        files: [file]
      })
      if (onShared) onShared()
    } catch (error) {
      // Ignore 'AbortError' which occurs if the user cancels the share dialog.
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error)
      }
    }
  }

  // Do not render the button if the browser doesn't support this feature.
  if (!canShare) {
    return null
  }

  return (
    <button
      className="button shareButton"
      onClick={handleShare}
      title="Share image"
    >
      <span className="icon">share</span>
    </button>
  )
}
