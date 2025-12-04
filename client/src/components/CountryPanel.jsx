import { useEffect, useState } from 'react'
import axios from 'axios'
import FactsList from './FactsList.jsx'
import FactForm from './FactForm.jsx'
import './CountryPanel.css'

const API_BASE = 'http://localhost:4000' || 'https://worldfunfacts.onrender.com'

/**
 * CountryPanel Component
 * ---------------------------------------------------------------
 * Displays detailed information about the currently selected country.
 * Supports:
 *  - Fetching country info from REST Countries API
 *  - Fetching community-added fun facts from backend
 *  - Submitting new facts (user-generated)
 *  - Voting + deletion on community facts
 *  - Generating AI-powered fun facts
 *  - Side-panel UI with flag, stats, facts, and AI section
 */
export default function CountryPanel({ selected, onClose }) {

  /** Fetch states */
  const [loading, setLoading] = useState(true)
  const [info, setInfo] = useState(null)
  const [facts, setFacts] = useState([])
  const [error, setError] = useState(null)

  /** AI fact states */
  const [aiFacts, setAiFacts] = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(null)

  const code = selected?.code

  /**
   * load()
   * Fetches:
   *   1. Country info from REST Countries API
   *   2. Community fun facts from your backend
   */
  const load = async () => {
    setLoading(true)
    setError(null)

    try {
      const [rest, myfacts] = await Promise.all([
        axios.get(`https://restcountries.com/v3.1/alpha/${code}`),
        axios.get(`${API_BASE}/api/facts/${code}`)
      ])

      if (!rest.data?.[0]) throw new Error("Country not found")

      setInfo(rest.data[0])
      setFacts(myfacts.data ?? [])
    } catch (e) {
      console.error(e)
      setError("Failed to load country info")
      setInfo(null)
      setFacts([])
    } finally {
      setLoading(false)
    }
  }

  /** Load data whenever selected country changes */
  useEffect(() => {
    if (code) load()
  }, [code])

  /** Extract formatted values */
  const flag = info?.flags?.png || info?.flags?.svg
  const name = info?.name?.common || selected?.name || code
  const capital = Array.isArray(info?.capital) ? info.capital[0] : info?.capital
  const region = info?.region
  const population = info?.population?.toLocaleString()
  const area = info?.area?.toLocaleString()
  const languages = info?.languages ? Object.values(info.languages).join(", ") : null
  const borders = info?.borders?.join(", ") || null

  /**
   * addFact(text)
   * Adds new user-submitted fact to the backend database.
   */
  async function addFact(text) {
    try {
      const payload = { countryCode: code, countryName: name, factText: text }
      const { data } = await axios.post(`${API_BASE}/api/facts`, payload)
      setFacts(f => [data, ...f])
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * upvote(id)
   * Sends an upvote request for a fact and updates UI.
   */
  async function upvote(id) {
    try {
      const { data } = await axios.put(`${API_BASE}/api/facts/${id}/upvote`)
      setFacts(f => f.map(x => x._id === id ? data : x))
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * remove(id)
   * Deletes a fact from backend and removes it from UI.
   */
  async function remove(id) {
    try {
      await axios.delete(`${API_BASE}/api/facts/${id}`)
      setFacts(f => f.filter(x => x._id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * generateAiFact()
   * Requests 5 AI-generated fun facts from backend.
   */
  async function generateAiFact() {
    setAiLoading(true)
    setAiError(null)
    setAiFacts([])

    try {
      const { data } = await axios.post(`${API_BASE}/api/ai/facts`, {
        country: name,
      })

      const all = data.facts || []
      if (all.length === 0) throw new Error("No AI facts returned")

      setAiFacts(all)
    } catch (err) {
      console.error(err)
      setAiError("Failed to generate AI facts.")
    } finally {
      setAiLoading(false)
    }
  }

  /** Loading / Error UI */
  if (loading) return <div className="cp-loading">Loading country info...</div>
  if (error) return <div className="cp-error">{error}</div>

  /** Stats list to render */
  const stats = [
    { label: "Capital", value: capital },
    { label: "Region", value: region },
    { label: "Population", value: population },
    { label: "Area", value: area ? `${area} km²` : null },
    { label: "Languages", value: languages },
    { label: "Borders", value: borders },
  ].filter(stat => stat.value)

  /**
   * -----------------------------------------------------------
   * Render: Side Panel UI
   * -----------------------------------------------------------
   */
  return (
    <div className="cp-sidepanel">

      {/* Close button */}
      <button className="cp-close" onClick={onClose}>X</button>

      {/* Flag */}
      {flag && <img className="cp-flag" src={flag} alt={`${name} flag`} />}

      {/* Country Name */}
      <h1 className="cp-name">
        {name} <span className="cp-code">({code})</span>
      </h1>

      {/* Country Stats */}
      <div className="cp-stats">
        {stats.map(stat => (
          <div key={stat.label} className="cp-stat-card">
            <div className="cp-stat-label">{stat.label}</div>
            <div className="cp-stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* AI Facts Section */}
      <div className="cp-ai-section">
        <h3>AI-Generated Fun Facts</h3>

        {aiLoading && <p>Generating...</p>}
        {aiError && <p className="cp-error">{aiError}</p>}

        {aiFacts.length > 0 && (
          <div className="cp-ai-fact-list">
            {aiFacts.map((f, i) => (
              <div key={i} className="cp-ai-fact-box">
                <p>{f.fact}</p>
                <button onClick={() => addFact(f.fact)}>
                  Save to Community Facts
                </button>
              </div>
            ))}
          </div>
        )}

        <button className="cp-ai-btn" onClick={generateAiFact} disabled={aiLoading}>
          {aiLoading ? "Generating..." : "Generate 5 AI Facts ✨"}
        </button>
      </div>

      {/* Add Fact Form */}
      <div className="cp-fact-form">
        <FactForm onSubmit={addFact} />
      </div>

      {/* Community Facts */}
      <div className="cp-facts-list">
        <h3>Community Facts</h3>
        {facts.length > 0 ? (
          <FactsList facts={facts} onUpvote={upvote} onDelete={remove} />
        ) : (
          <p>No facts added yet.</p>
        )}
      </div>

    </div>
  )
}
