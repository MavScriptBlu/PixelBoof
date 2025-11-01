/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useStore} from '../../lib/store'
import './ZoomControls.css'

/*
 * Renders the vertical zoom slider control for the camera view.
 * This is typically shown only on desktop devices.
 */
export default function ZoomControls() {
  const zoomValue = useStore.useZoom()
  const setZoom = useStore.useSetZoom()

  return (
    <div className="zoom-container">
      <span className="icon">zoom_out</span>
      <input
        type="range"
        className="zoom-slider"
        min="1"
        max="3"
        step="0.1"
        value={zoomValue}
        onChange={e => setZoom(parseFloat(e.target.value))}
        aria-label="Zoom control"
      />
      <span className="icon">zoom_in</span>
    </div>
  )
}
