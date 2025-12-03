import { useState } from 'react'
import './CountryPanel.css'

/**
 * FactForm Component
 * ---------------------------------------------------------------
 * A reusable form that allows users to submit a new fun fact.
 *
 * Features:
 *  - Validates fact length (10–500 characters)
 *  - Displays error messages
 *  - Shows a loading state while submitting
 *  - Clears form after successful submission
 *
 * Props:
 *  - onSubmit(text): async function passed from parent (CountryPanel)
 *    to store the fact in the backend.
 */
export default function FactForm({ onSubmit }) {

  /** Text input */
  const [text, setText] = useState('')

  /** Error messages (validation or submit failure) */
  const [error, setError] = useState(null)

  /** Busy state (to disable button + show loading) */
  const [busy, setBusy] = useState(false)

  /**
   * handle()
   * -------------------------------------------------------------
   * Handles form submission:
   *  - Validates input
   *  - Calls parent onSubmit() to save the fact
   *  - Resets the form on success
   */
  const handle = async (e) => {
    e.preventDefault()

    const t = text.trim()

    // Basic validation
    if (t.length < 10) {
      setError('Please write at least 10 characters.')
      return
    }
    if (t.length > 500) {
      setError('Max 500 characters.')
      return
    }

    setBusy(true)
    setError(null)

    try {
      await onSubmit(t)
      setText('')  // clear textarea on success
    } catch (e) {
      setError('Failed to add fact.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="fact-form" onSubmit={handle}>
      <label>Add a fun fact</label>

      {/* User input */}
      <textarea
        placeholder="Something surprising, delightful, or educational about this country…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Error message */}
      {error && (
        <div style={{ color: '#ff6b6b', marginTop: 6 }}>
          {error}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button type="submit" disabled={busy}>
          {busy ? 'Adding…' : 'Add Fact'}
        </button>

        {/* Clear button */}
        <button
          type="button"
          className="ghost"
          onClick={() => setText('')}
        >
          Clear
        </button>
      </div>
    </form>
  )
}
