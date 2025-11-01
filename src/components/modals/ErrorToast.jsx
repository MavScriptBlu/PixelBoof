/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useEffect} from 'react'
import {useStore} from '../../lib/store'
import './ErrorToast.css'

/*
 * An error toast modal that displays an error message from the global state.
 * It automatically disappears after a few seconds.
 */
export default function ErrorToast() {
  const errorMessage = useStore.useErrorMessage()
  const setErrorMessage = useStore.useSetErrorMessage()

  // Effect to set a timer for automatically dismissing the toast.
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      // Clean up the timer if the component unmounts or the message changes.
      return () => clearTimeout(timer)
    }
  }, [errorMessage, setErrorMessage])

  if (!errorMessage) {
    return null
  }

  return (
    <div className="error-toast" role="alert" aria-live="assertive">
      <p>{errorMessage}</p>
      <button onClick={() => setErrorMessage(null)} aria-label="Dismiss error">
        <span className="icon">close</span>
      </button>
    </div>
  )
}
