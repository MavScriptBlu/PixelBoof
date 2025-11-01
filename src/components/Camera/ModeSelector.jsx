/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useState, useCallback} from 'react'
import {useStore} from '../../lib/store'
import modes from '../../lib/modes'
import './ModeSelector.css'

/*
 * A tooltip component to display information about a hovered mode.
 * @param {object} props - The component props.
 * @param {object} props.hoveredMode - The mode object to display info for.
 * @param {{top: number, left: number}} props.position - The position for the tooltip.
 */
function Tooltip({hoveredMode, position}) {
  if (!hoveredMode) return null

  let text
  if (hoveredMode.key === 'random') {
    text = 'CHOOSE A RANDOM STYLE'
  } else if (hoveredMode.key === 'custom') {
    text = 'WRITE YOUR OWN PROMPT'
  } else {
    text = hoveredMode.name.toUpperCase()
  }

  return (
    <div
      className="tooltip"
      role="tooltip"
      style={{
        top: position.top,
        left: position.left,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <p>{text}</p>
    </div>
  )
}

/*
 * Renders the horizontal list of selectable creative modes (lenses).
 * It allows the user to switch between different AI generation styles.
 */
export default function ModeSelector() {
  const activeMode = useStore.useActiveMode()
  const {setMode} = useStore.getState()
  const [hoveredMode, setHoveredMode] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({top: 0, left: 0})

  /*
   * Handles mouse hover over a mode button to show its tooltip.
   */
  const handleModeHover = useCallback((modeInfo, event) => {
    if (!modeInfo) {
      setHoveredMode(null)
      return
    }

    setHoveredMode(modeInfo)

    // Position the tooltip above the hovered button.
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      top: rect.top,
      left: rect.left + rect.width / 2
    })
  }, [])

  return (
    <>
      <ul className="modeSelector">
        <li
          key="random"
          onMouseEnter={e => handleModeHover({key: 'random', name: 'Random'}, e)}
          onMouseLeave={() => handleModeHover(null)}
        >
          <button
            className={activeMode === 'random' ? 'active' : ''}
            onClick={() => setMode('random')}
            aria-pressed={activeMode === 'random'}
          >
            {activeMode === 'random' && (
              <span className="selector-caret">&gt;</span>
            )}
            <span>❓</span> <span>Random</span>
          </button>
        </li>
        {Object.entries(modes).map(([key, {name, emoji, prompt}]) => (
          <li
            key={key}
            onMouseEnter={e => handleModeHover({key, prompt, name}, e)}
            onMouseLeave={() => handleModeHover(null)}
          >
            <button
              onClick={() => setMode(key)}
              className={key === activeMode ? 'active' : ''}
              aria-pressed={key === activeMode}
            >
              {key === activeMode && <span className="selector-caret">&gt;</span>}
              <span>{emoji}</span> <span>{name}</span>
            </button>
          </li>
        ))}
      </ul>
      <Tooltip hoveredMode={hoveredMode} position={tooltipPosition} />
    </>
  )
}