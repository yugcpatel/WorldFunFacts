import './CountryPanel.css'

export default function FactsList({ facts, onUpvote, onDelete }) {
  if (!facts?.length) {
    return <div style={{ color: '#96a0c2' }}>No fun facts yet. Be the first to add one!</div>
  }
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {facts.map(f => (
        <div className="fact" key={f._id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => onUpvote(f._id)}>▲ {f.upvotes ?? 0}</button>
            <div style={{ color: '#96a0c2', fontSize: '.8rem' }}>
              {new Date(f.createdAt || f.created_at).toLocaleString()}
            </div>
            <div style={{ flex: 1 }} />
            <button className="danger" onClick={() => onDelete(f._id)}>Delete</button>
          </div>
          <div style={{ marginTop: 6, lineHeight: 1.4 }}>{f.factText}</div>
        </div>
      ))}
    </div>
  )
}
