/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useStore} from '../../lib/store'
import imageData from '../../lib/imageData'
import modes from '../../lib/modes'
import './PhotoThumbnail.css'

/*
 * Renders a single photo thumbnail in the gallery grid.
 * It displays the generated image, an emoji representing its mode,
 * and a button to delete it.
 *
 * @param {object} props - The component props.
 * @param {object} props.photo - The photo object to display.
 * @param {function(): void} props.onClick - Callback function when the thumbnail is clicked.
 */
export default function PhotoThumbnail({photo, onClick}) {
  const {deletePhoto} = useStore.getState()
  const {id, mode, isBusy} = photo

  const handleDelete = e => {
    e.stopPropagation() // Prevent triggering the onClick for the parent.
    deletePhoto(id)
  }

  return (
    <li className={isBusy ? 'isBusy' : ''}>
      <button
        className="circleBtn deleteBtn"
        onClick={handleDelete}
        aria-label="Delete photo"
      >
        <span className="icon">delete</span>
      </button>
      <button className="photo" onClick={onClick} disabled={isBusy}>
        <img
          src={isBusy ? imageData.inputs[id] : imageData.outputs[id]}
          draggable={false}
          alt={`Generated image in ${modes[mode]?.name || 'custom'} style`}
        />
        <p className="emoji">{mode === 'custom' ? '✏️' : modes[mode]?.emoji}</p>
      </button>
    </li>
  )
}
