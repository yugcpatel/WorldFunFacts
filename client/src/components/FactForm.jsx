import { useState } from 'react'
import './CountryPanel.css'

export default function FactForm({ onSubmit }) {
  const [text, setText] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    const t = text.trim()
    if (t.length < 10) { setError('Please write at least 10 characters.'); return }
    if (t.length > 500) { setError('Max 500 characters.'); return }
    setBusy(true); 
    setError(null)
    try {
      await onSubmit(t)
      setText('')
    } catch (e) {
      setError('Failed to add fact.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="fact-form" onSubmit={handle}>
      <label>Add a fun fact</label>
      <textarea
        placeholder="Something surprising, delightful, or educational about this country…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {error && <div style={{ color: '#ff6b6b', marginTop: 6 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button type="submit" disabled={busy}>{busy ? 'Adding…' : 'Add Fact'}</button>
        <button type="button" className="ghost" onClick={() => setText('')}>Clear</button>
      </div>
    </form>
  )
}
