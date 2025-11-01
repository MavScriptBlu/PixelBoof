/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useStore} from '../../lib/store'
import PhotoThumbnail from './PhotoThumbnail'
import './GalleryView.css'

/*
 * Renders the gallery view, which displays all generated photos in a grid.
 * It also includes controls for accessing the sticker queue.
 *
 * @param {object} props - The component props.
 * @param {function(string): void} props.onPhotoClick - Callback to handle clicking a photo thumbnail.
 * @param {function(): void} props.onShowStickerQueue - Callback to open the sticker queue modal.
 */
export default function GalleryView({onPhotoClick, onShowStickerQueue}) {
  const photos = useStore.usePhotos()
  const stickerQueue = useStore.useStickerQueue()

  return (
    <div className="gallery">
      <header className="galleryHeader">
        <h2>Gallery</h2>
        <div className="gallery-actions">
          {stickerQueue.length > 0 && (
            <button
              className="button stickerQueueBtn"
              onClick={onShowStickerQueue}
            >
              <span className="icon">inventory</span>
              Sticker Queue ({stickerQueue.length})
            </button>
          )}
        </div>
      </header>

      {photos.length > 0 ? (
        <ul>
          {photos.map(photo => (
            <PhotoThumbnail
              key={photo.id}
              photo={photo}
              onClick={() => onPhotoClick(photo.id)}
            />
          ))}
        </ul>
      ) : (
        <div className="empty-gallery">
          <span className="icon">photo_library</span>
          <p>Your gallery is empty.</p>
          <p>Switch to the camera and snap some photos!</p>
        </div>
      )}
    </div>
  )
}
