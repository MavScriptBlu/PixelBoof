/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useStore} from '../../lib/store'
import './Panel.css'

/*
 * A modal that displays a privacy and terms of use disclaimer.
 * It is shown to the user on their first visit before they can use the app,
 * and its acceptance is stored in localStorage.
 */
export default function Disclaimer() {
  const {acceptDisclaimer} = useStore.getState()

  return (
    <div
      className="panel-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
    >
      <div className="panel">
        <h2 id="disclaimer-title">Privacy & Terms of Use</h2>
        <div className="panel-steps">
          <div className="panel-step">
            <span className="icon">no_photography</span>
            <p>
              <strong>Your photos are not saved or stored.</strong> All
              processing happens in your browser and images are deleted when you
              close the page.
            </p>
          </div>
          <div className="panel-step">
            <span className="icon">smart_toy</span>
            <p>
              <strong>This is a technology demo.</strong> The AI may generate
              unexpected or inaccurate images.
            </p>
          </div>
          <div className="panel-step">
            <span className="icon">verified_user</span>
            <p>
              By continuing, you agree to use this app responsibly and at your
              own risk.
            </p>
          </div>
        </div>
        <button className="button" onClick={acceptDisclaimer}>
          Accept & Continue
        </button>
      </div>
    </div>
  )
}
