/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useStore} from '../../lib/store'
import imageData from '../../lib/imageData'
import modes from '../../lib/modes'
import './StickerQueueModal.css'

/*
 * A modal for managing the sticker queue. It displays all the photos
 * the user has saved and provides options to download them all as a ZIP
 * or clear the queue.
 *
 * @param {object} props - The component props.
 * @param {function(): void} props.onClose - Callback to close the modal.
 */
export default function StickerQueueModal({onClose}) {
  const photos = useStore.usePhotos()
  const stickerQueue = useStore.useStickerQueue()
  const stickerQueueDownloading = useStore.useStickerQueueDownloading()
  const {
    removeFromStickerQueue,
    clearStickerQueue,
    downloadStickerQueue
  } = useStore.getState()

  return (
    <div
      className="sticker-queue-panel"
      onClick={e => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sticker-queue-title"
    >
      <header className="sticker-queue-header">
        <h2 id="sticker-queue-title">Sticker Queue</h2>
        <div className="sticker-queue-actions">
          <button
            className="button downloadAllBtn"
            onClick={downloadStickerQueue}
            disabled={stickerQueueDownloading || stickerQueue.length === 0}
          >
            <span className="icon">download</span>
            {stickerQueueDownloading
              ? 'ZIPPING...'
              : `DOWNLOAD ALL (${stickerQueue.length})`}
          </button>
          <button
            className="button clearQueueBtn"
            onClick={clearStickerQueue}
            disabled={stickerQueue.length === 0}
          >
            <span className="icon">delete_sweep</span>
            CLEAR
          </button>
        </div>
        <button
          className="circleBtn"
          onClick={onClose}
          aria-label="Close sticker queue"
        >
          <span className="icon">close</span>
        </button>
      </header>
      <div className="sticker-queue-content">
        {stickerQueue.length > 0 ? (
          <ul>
            {stickerQueue.map(id => {
              const photo = photos.find(p => p.id === id)
              if (!photo) return null
              return (
                <li key={id}>
                  <button
                    className="circleBtn deleteBtn"
                    onClick={() => removeFromStickerQueue(id)}
                    aria-label="Remove from queue"
                  >
                    <span className="icon">delete</span>
                  </button>
                  <div className="photo">
                    <img
                      src={imageData.outputs[id]}
                      draggable={false}
                      alt="Sticker"
                    />
                    <p className="emoji">
                      {photo.mode === 'custom'
                        ? '✏️'
                        : modes[photo.mode].emoji}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="empty-gallery">
            <span className="icon">inventory</span>
            <p>The sticker queue is empty.</p>
            <p>Click "Save for Sticker" on a photo to add it here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
