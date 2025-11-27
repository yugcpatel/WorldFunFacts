// import { useState, useMemo, useEffect } from 'react'
// import { AnimatePresence, motion } from 'framer-motion'
// import Globe from './components/Globe.jsx'
// import CountryPanel from './components/CountryPanel.jsx'


// export default function App() {
//   const [selected, setSelected] = useState(null) // { code, name, latlng }
//   const [autoRotate, setAutoRotate] = useState(true)

//   // Handle ESC to close panel
//   useEffect(() => {
//     const onKey = (e) => { if (e.key === 'Escape') setSelected(null) }
//     window.addEventListener('keydown', onKey)
//     return () => window.removeEventListener('keydown', onKey)
//   }, [])

//   return (
//     <div style={{ height: '100%' }}>
//       <div className="header">
//         <h1>🌍 World Fun Facts</h1>
//         <div className="hint">Drag to rotate · Scroll to zoom · Click a country marker</div>
//         <div style={{ flex: 1 }} />
//         <button className="ghost" onClick={() => setAutoRotate(a => !a)}>
//           {autoRotate ? 'Pause Auto-Rotate' : 'Resume Auto-Rotate'}
//         </button>
//       </div>

//       <Globe onSelectCountry={setSelected} autoRotate={autoRotate} />

//       <AnimatePresence>
//         {selected && (
//           <motion.div
//             className="panel"
//             initial={{ x: 420, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             exit={{ x: 420, opacity: 0 }}
//             transition={{ type: 'spring', stiffness: 220, damping: 22 }}
//           >
//             <CountryPanel selected={selected} onClose={() => setSelected(null)} />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="footer">
//         Built with React Three Fiber + Express + MongoDB · REST Countries for country info
//       </div>
//     </div>
//   )
// } VIRSON 0


import { useState, useMemo, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Globe from './Globe.jsx'
import CountryPanel from './CountryPanel.jsx'
import axios from 'axios'
import { Link } from "react-router-dom";


export default function App() {
  const [selected, setSelected] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)

  // SEARCH SYSTEM
  const [search, setSearch] = useState("")
  const [allCountries, setAllCountries] = useState([])
  const [results, setResults] = useState([])

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all?fields=cca2,name,latlng")
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

  // Filter countries live
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

  // ESC close panel
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div style={{ height: '100%' }}>
      <div className="header">
        <h1>🌍 World Fun Facts</h1>
        <Link to="/docs" className="docs-link">Docs</Link>

        <div className="search-box">
          <input
            placeholder="Search country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
        <button className="ghost" onClick={() => setAutoRotate(a => !a)}>
          {autoRotate ? 'Pause Auto-Rotate' : 'Resume Auto-Rotate'}
        </button>
      </div>

      <Globe onSelectCountry={setSelected} autoRotate={autoRotate} />

      <AnimatePresence>
        {selected && (
          <motion.div
            className="panel"
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          >
            <CountryPanel selected={selected} onClose={() => setSelected(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="footer">
        Built with React Three Fiber + Express + MongoDB · REST Countries for info
      </div>
    </div>
  )
}
