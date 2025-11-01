/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useStore} from '../../lib/store'
import './Panel.css'

/*
 * A modal that displays a welcome message and a brief tutorial
 * for first-time users. Its visibility is controlled by the `showTutorial`
 * state in the global store.
 */
export default function Tutorial() {
  const {dismissTutorial} = useStore.getState()

  return (
    <div
      className="panel-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
    >
      <div className="panel">
        <h2 id="tutorial-title">WELCOME TO PIXEL BOOF!</h2>
        <div className="panel-steps">
          <div className="panel-step">
            <span className="icon">style</span>
            <p>1. PICK A STYLE FROM THE MENU.</p>
          </div>
          <div className="panel-step">
            <span className="icon">camera</span>
            <p>2. SNAP A PHOTO WITH THE SHUTTER.</p>
          </div>
          <div className="panel-step">
            <span className="icon">burst_mode</span>
            <p>3. SEE YOUR CREATION IN THE GALLERY!</p>
          </div>
        </div>
        <button className="button" onClick={dismissTutorial}>
          GOT IT!
        </button>
      </div>
    </div>
  )
}
