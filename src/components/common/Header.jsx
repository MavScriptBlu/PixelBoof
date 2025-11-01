/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useStore} from '../../lib/store'
import './Header.css'

/*
 * Renders the main application header, including the title and the button
 * to toggle between Camera and Gallery views.
 */
export default function Header() {
  const currentView = useStore.useCurrentView()
  const setView = useStore.useSetView()

  const handleToggle = () => {
    setView(currentView === 'camera' ? 'gallery' : 'camera')
  }

  const isCameraView = currentView === 'camera'

  return (
    <header className="app-header">
      <h1>PIXEL BOOF</h1>
      <button
        className="viewToggle"
        onClick={handleToggle}
        title={
          isCameraView ? 'Switch to Gallery View' : 'Switch to Camera View'
        }
      >
        <span className="icon">
          {isCameraView ? 'gallery_thumbnails' : 'photo_camera'}
        </span>
        <p>{isCameraView ? 'Gallery' : 'Camera'}</p>
      </button>
    </header>
  )
}
