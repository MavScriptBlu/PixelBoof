/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useStore} from '../../lib/store'
import themes from '../../lib/themes'
import './ThemeSelector.css'

/*
 * Full-screen theme picker shown after onboarding every session.
 * Lets the user select which category of sticker styles they want
 * before stepping up to the camera.
 */
export default function ThemeSelector() {
  const {selectTheme} = useStore.getState()

  return (
    <div className="theme-selector-overlay">
      <div className="theme-selector-panel">
        <div className="theme-selector-header">
          <h1 className="theme-selector-title">SELECT YOUR THEME</h1>
          <p className="theme-selector-subtitle">
            Choose a vibe — you can switch anytime from the camera
          </p>
        </div>

        <div className="theme-selector-grid">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              className="theme-card"
              onClick={() => selectTheme(key)}
              aria-label={`Select ${theme.name} theme`}
            >
              <span className="theme-card-emoji">{theme.emoji}</span>
              <span className="theme-card-name">{theme.name}</span>
              <span className="theme-card-desc">{theme.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
