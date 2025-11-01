/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useStore} from '../../lib/store'
import imageData from '../../lib/imageData'
import './PhotoBar.css'

/*
 * Displays a horizontal bar of the most recently taken photos.
 * This provides quick access to view the latest creations from the camera view.
 *
 * @param {object} props - The component props.
 * @param {function(string): void} props.onPhotoClick - Callback to handle clicking a photo thumbnail.
 */
export default function PhotoBar({onPhotoClick}) {
  const photos = useStore.usePhotos()

  if (photos.length === 0) {
    return null
  }

  return (
    <div className="photo-bar">
      <ul>
        {photos.slice(0, 6).map(({id, isBusy}) => (
          <li className={isBusy ? 'isBusy' : ''} key={id}>
            <button
              onClick={() => onPhotoClick(id)}
              disabled={isBusy}
              aria-label={`View photo ${id}`}
            >
              <img
                src={isBusy ? imageData.inputs[id] : imageData.outputs[id]}
                draggable={false}
                alt="thumbnail"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
