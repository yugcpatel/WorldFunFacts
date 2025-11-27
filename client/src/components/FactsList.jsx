import './CountryPanel.css'

/**
 * FactsList Component
 * ---------------------------------------------------------------
 * Displays a list of community-submitted fun facts for a country.
 *
 * Features:
 *  - Shows each fact with timestamp, upvote button, and delete button
 *  - Allows users to upvote or remove facts through parent handlers
 *  - Displays message when no facts exist yet
 *
 * Props:
 *  - facts: Array of fact objects
 *  - onUpvote(id): triggers when user clicks the upvote button
 *  - onDelete(id): triggers when user clicks the delete button
 */
export default function FactsList({ facts, onUpvote, onDelete }) {

  /** If there are no facts, show a placeholder message */
  if (!facts?.length) {
    return (
      <div style={{ color: '#96a0c2' }}>
        No fun facts yet. Be the first to add one!
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {facts.map(f => (
        <div className="fact" key={f._id}>

          {/* Header: Upvote + Timestamp + Delete */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

            {/* Upvote Button */}
            <button onClick={() => onUpvote(f._id)}>
              ▲ {f.upvotes ?? 0}
            </button>

            {/* Created Timestamp */}
            <div style={{ color: '#96a0c2', fontSize: '.8rem' }}>
              {new Date(f.createdAt || f.created_at).toLocaleString()}
            </div>

            {/* Flexible spacer */}
            <div style={{ flex: 1 }} />

            {/* Delete Button */}
            <button className="danger" onClick={() => onDelete(f._id)}>
              Delete
            </button>
          </div>

          {/* Fact Text */}
          <div style={{ marginTop: 6, lineHeight: 1.4 }}>
            {f.factText}
          </div>
        </div>
      ))}
    </div>
  )
}
