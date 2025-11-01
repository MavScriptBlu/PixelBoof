/*
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import './CustomPrompt.css'

/*
 * Renders the textarea for users to input their own custom prompts for the AI.
 * This is only displayed when the 'custom' mode is active.
 *
 * @param {object} props - The component props.
 * @param {string} props.value - The current value of the textarea.
 * @param {function(string): void} props.onChange - Callback function to update the value.
 */
export default function CustomPrompt({value, onChange}) {
  return (
    <div className="custom-prompt-container">
      <textarea
        placeholder="Turn the person in the image into a pixel art cat wearing a wizard hat..."
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={2}
        aria-label="Custom prompt for image generation"
      ></textarea>
    </div>
  )
}
