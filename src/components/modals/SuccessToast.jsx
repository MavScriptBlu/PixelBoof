/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useEffect} from 'react'
import {useStore} from '../../lib/store'
import './SuccessToast.css'

/*
 * A non-blocking success notification that auto-dismisses after 5 seconds.
 * Reads from the global `successMessage` store field and clears itself via
 * `setSuccessMessage(null)`.
 */
export default function SuccessToast() {
  const successMessage = useStore.useSuccessMessage()
  const setSuccessMessage = useStore.useSetSuccessMessage()

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, setSuccessMessage])

  if (!successMessage) return null

  return (
    <div className="success-toast" role="status" aria-live="polite">
      <p>{successMessage}</p>
      <button onClick={() => setSuccessMessage(null)} aria-label="Dismiss">
        <span className="icon">close</span>
      </button>
    </div>
  )
}
