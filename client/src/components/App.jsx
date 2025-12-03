import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Globe from './Globe.jsx'
import CountryPanel from './CountryPanel.jsx'
import axios from 'axios'
import { Link } from "react-router-dom";


/**
 * App Component
 * -----------------------------------------------------
 * Main application wrapper that:
 *  - Renders the rotating 3D globe
 *  - Manages selected country state
 *  - Handles the auto-rotate toggle
 *  - Implements the live country search system
 *  - Shows the country info panel using animation
 */
export default function App() {

  /** Selected country → opens the right-side panel */
  const [selected, setSelected] = useState(null)

  /** Controls whether the globe rotates automatically */
  const [autoRotate, setAutoRotate] = useState(true)

  /** Search system state */
  const [search, setSearch] = useState("")
  const [allCountries, setAllCountries] = useState([])
  const [results, setResults] = useState([])

  /**
   * Fetch all countries (code, name, lat/lon) for the search system.
   * Runs once on page load.
   */
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all?fields=cca2,name,latlng")
      .then(res => {
        const mapped = res.data
          .filter(c => Array.isArray(c.latlng))
          .map(c => ({
            code: c.cca2,
            name: c.name.common,
            latlng: { lat: c.latlng[0], lon: c.latlng[1] }
          }))
        setAllCountries(mapped)
      })
  }, [])

  /**
   * Filters countries as user types in the search bar.
   * Shows up to 8 matching country names.
   */
  useEffect(() => {
    if (search.trim() === "") {
      setResults([])
      return
    }

    const s = search.toLowerCase()
    const filtered = allCountries.filter(c =>
      c.name.toLowerCase().includes(s)
    )

    setResults(filtered.slice(0, 8))
  }, [search, allCountries])

  /**
   * Allows closing the country panel using the ESC key.
   */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])


  /** -----------------------------------------------
   *  Render UI
   *  -----------------------------------------------
   */
  return (
    <div style={{ height: '100%' }}>
      {/* Header Section */}
      <div className="header">
        <h1>🌍 World Fun Facts</h1>

        {/* Link to documentation page */}
        <Link to="/docs" className="docs-link">Documentation</Link>

        {/* Search Box */}
        <div className="search-box">
          <input
            placeholder="Search country...(e.g. Canada)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Live dropdown results */}
          {results.length > 0 && (
            <div className="search-results">
              {results.map((c, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelected(c)
                    setSearch("")
                    setResults([])
                  }}
                >
                  {c.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1 }} />

        {/* Auto-rotate toggle button */}
        <button
          className="ghost"
          onClick={() => setAutoRotate(a => !a)}
        >
          {autoRotate ? 'Pause Auto-Rotate' : 'Resume Auto-Rotate'}
        </button>
      </div>

      {/* 3D Globe Component */}
      <Globe
        onSelectCountry={setSelected}
        autoRotate={autoRotate}
      />

      {/* Animated Country Panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="panel"
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          >
            <CountryPanel
              selected={selected}
              onClose={() => setSelected(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="footer">
        Built with React Three Fiber + Express + MongoDB · REST Countries for info
      </div>
    </div>
  )
}
