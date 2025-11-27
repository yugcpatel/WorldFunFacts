// import { useEffect, useMemo, useState } from 'react'
// import axios from 'axios'
// import FactsList from './FactsList.jsx'
// import FactForm from './FactForm.jsx'

// const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

// export default function CountryPanel({ selected, onClose }) {
//   const [loading, setLoading] = useState(true)
//   const [info, setInfo] = useState(null) // rest countries data
//   const [facts, setFacts] = useState([])

//   const code = selected?.code

//   const load = async () => {
//     setLoading(true)
//     try {
//       const [rest, myfacts] = await Promise.all([
//         axios.get(`https://restcountries.com/v3.1/alpha/${code}`),
//         axios.get(`${API_BASE}/api/facts/${code}`)
//       ])
//       setInfo(rest.data?.[0] ?? null)
//       setFacts(myfacts.data ?? [])
//     } catch (e) {
//       console.error(e)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => { if (code) load() }, [code])

//   const flag = info?.flags?.png || info?.flags?.svg
//   const name = info?.name?.common || selected?.name || code
//   const capital = Array.isArray(info?.capital) ? info.capital[0] : info?.capital
//   const region = info?.region
//   const population = info?.population?.toLocaleString()

//   async function addFact(text) {
//     const payload = { countryCode: code, countryName: name, factText: text }
//     const { data } = await axios.post(`${API_BASE}/api/facts`, payload)
//     setFacts(f => [data, ...f])
//   }

//   async function upvote(id) {
//     const { data } = await axios.put(`${API_BASE}/api/facts/${id}/upvote`)
//     setFacts(f => f.map(x => x._id === id ? data : x))
//   }

//   async function remove(id) {
//     await axios.delete(`${API_BASE}/api/facts/${id}`)
//     setFacts(f => f.filter(x => x._id !== id))
//   }

//   return (
//     <div>
//       <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
//         <img className="flag" src={flag} alt="" />
//         <div style={{ flex: 1 }}>
//           <h2>{name} <span style={{ color: '#96a0c2', fontSize: '.9rem' }}>({code})</span></h2>
//           {capital && <div>Capital: <b>{capital}</b></div>}
//           {region && <div>Region: <b>{region}</b></div>}
//           {population && <div>Population: <b>{population}</b></div>}
//         </div>
//         <button className="ghost" onClick={onClose}>Close</button>
//       </div>

//       <hr style={{ borderColor: 'rgba(255,255,255,.08)' }} />

//       <FactForm onSubmit={addFact} />

//       <div style={{ height: 12 }} />

//       <FactsList facts={facts} onUpvote={upvote} onDelete={remove} />
//     </div>
//   )
// } VIRSON 01


// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import FactsList from './FactsList.jsx'
// import FactForm from './FactForm.jsx'

// const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

// export default function CountryPanel({ selected, onClose }) {
//   const [loading, setLoading] = useState(true)
//   const [info, setInfo] = useState(null)
//   const [facts, setFacts] = useState([])

//   const code = selected?.code

//   const load = async () => {
//     setLoading(true)
//     try {
//       const [rest, myfacts] = await Promise.all([
//         axios.get(`https://restcountries.com/v3.1/alpha/${code}`),
//         axios.get(`${API_BASE}/api/facts/${code}`)
//       ])
//       setInfo(rest.data?.[0] ?? null)
//       setFacts(myfacts.data ?? [])
//     } catch (e) {
//       console.error(e)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => { if (code) load() }, [code])

//   const flag = info?.flags?.png || info?.flags?.svg
//   const name = info?.name?.common || selected?.name || code
//   const capital = Array.isArray(info?.capital) ? info.capital[0] : info?.capital
//   const region = info?.region
//   const population = info?.population?.toLocaleString()
//   const area = info?.area?.toLocaleString()
//   const languages = info?.languages ? Object.values(info.languages).join(', ') : null
//   const borders = info?.borders?.join(', ') || null

//   async function addFact(text) {
//     const payload = { countryCode: code, countryName: name, factText: text }
//     const { data } = await axios.post(`${API_BASE}/api/facts`, payload)
//     setFacts(f => [data, ...f])
//   }

//   async function upvote(id) {
//     const { data } = await axios.put(`${API_BASE}/api/facts/${id}/upvote`)
//     setFacts(f => f.map(x => x._id === id ? data : x))
//   }

//   async function remove(id) {
//     await axios.delete(`${API_BASE}/api/facts/${id}`)
//     setFacts(f => f.filter(x => x._id !== id))
//   }

//   if (loading) {
//     return (
//       <div className="text-center py-20 animate-pulse text-gray-300">
//         Loading country info...
//       </div>
//     )
//   }

//   return (
//     <div className="p-4 animate-fadeIn relative">

//       {/* CLOSE BUTTON */}
//       <button
//         onClick={onClose}
//         className="
//           absolute right-3 top-3
//           bg-red-500/30 hover:bg-red-500/50
//           text-red-200 px-3 py-1
//           rounded-lg border border-red-500/40
//           transition-all duration-300
//           hover:scale-110
//           backdrop-blur
//         "
//       >
//         ✕
//       </button>

//       {/* HEADER CARD */}
//       <div className="
//         flex gap-4 items-center mb-6 
//         p-4 rounded-xl 
//         bg-white/5 backdrop-blur 
//         shadow-lg shadow-black/20 
//         border border-white/10
//         transition-all duration-300
//         hover:shadow-xl hover:-translate-y-1
//       ">

//         {/* SMALLER FLAG */}
//         <img
//           className="w-14 h-10 object-cover rounded shadow-md 
//                      hover:scale-105 transition-transform duration-300"
//           src={flag}
//           alt=""
//         />

//         <div className="flex-1">
//           <h2 className="text-xl font-bold">
//             {name}
//             <span className="text-gray-400 text-sm ml-1">
//               ({code})
//             </span>
//           </h2>

//           {/* <div className="mt-1 text-gray-300 space-y-1 text-sm">
//             {capital && <div>Capital: <span className="font-semibold text-white">{capital}</span></div>}
//             {region && <div>Region: <span className="font-semibold text-white">{region}</span></div>}
//             {population && <div>Population: <span className="font-semibold text-white">{population}</span></div>}
//             {area && <div>Area: <span className="font-semibold text-white">{area} km²</span></div>}
//             {languages && <div>Languages: <span className="font-semibold text-white">{languages}</span></div>}
//             {borders && <div>Bordering: <span className="font-semibold text-white">{borders}</span></div>}
//           </div> */}


//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">

//             {capital && (
//               <div className="
//                 bg-white/5 border border-white/10 
//                 p-3 rounded-lg shadow-md shadow-black/20 
//                 transition-all duration-300
//                 hover:-translate-y-1 hover:shadow-xl
//               ">
//                 <div className="text-gray-400 text-xs">Capital</div>
//                 <div className="font-semibold text-white">{capital}</div>
//               </div>
//             )}

//             {region && (
//               <div className="
//                 bg-white/5 border border-white/10 
//                 p-3 rounded-lg shadow-md shadow-black/20 
//                 transition-all duration-300
//                 hover:-translate-y-1 hover:shadow-xl
//               ">
//                 <div className="text-gray-400 text-xs">Region</div>
//                 <div className="font-semibold text-white">{region}</div>
//               </div>
//             )}

//             {population && (
//               <div className="
//                 bg-white/5 border border-white/10 
//                 p-3 rounded-lg shadow-md shadow-black/20 
//                 transition-all duration-300
//                 hover:-translate-y-1 hover:shadow-xl
//               ">
//                 <div className="text-gray-400 text-xs">Population</div>
//                 <div className="font-semibold text-white">{population}</div>
//               </div>
//             )}

//             {area && (
//               <div className="
//                 bg-white/5 border border-white/10 
//                 p-3 rounded-lg shadow-md shadow-black/20 
//                 transition-all duration-300
//                 hover:-translate-y-1 hover:shadow-xl
//               ">
//                 <div className="text-gray-400 text-xs">Area</div>
//                 <div className="font-semibold text-white">{area} km²</div>
//               </div>
//             )}

//             {languages && (
//               <div className="
//                 bg-white/5 border border-white/10 
//                 p-3 rounded-lg shadow-md shadow-black/20 
//                 transition-all duration-300
//                 hover:-translate-y-1 hover:shadow-xl
//               ">
//                 <div className="text-gray-400 text-xs">Languages</div>
//                 <div className="font-semibold text-white">{languages}</div>
//               </div>
//             )}

//             {borders && (
//               <div className="
//                 bg-white/5 border border-white/10 
//                 p-3 rounded-lg shadow-md shadow-black/20 
//                 transition-all duration-300
//                 hover:-translate-y-1 hover:shadow-xl
//               ">
//                 <div className="text-gray-400 text-xs">Bordering</div>
//                 <div className="font-semibold text-white">{borders}</div>
//               </div>
//             )}

//           </div>

//         </div>
//       </div>

//       {/* FACT BOX WRAPPER */}
//       <div className="
//         bg-white/5 border border-white/10 
//         p-4 rounded-xl shadow-md shadow-black/20 mb-6
//         hover:shadow-lg hover:-translate-y-1 
//         transition-all duration-300
//       ">
//         <h3 className="font-semibold text-lg mb-2 text-white">
//           Add a Fun Fact
//         </h3>
//         <FactForm onSubmit={addFact} />
//       </div>

//       {/* FACTS LIST BOX */}
//       <div className="
//         bg-white/5 border border-white/10 
//         p-4 rounded-xl shadow-md shadow-black/20
//         transition-all duration-300
//         hover:shadow-lg hover:-translate-y-1
//       ">
//         <h3 className="text-lg font-semibold text-white mb-3">
//           Community Facts
//         </h3>
//         <FactsList facts={facts} onUpvote={upvote} onDelete={remove} />
//       </div>

//     </div>
//   )
// } VIRSON 01


// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import FactsList from './FactsList.jsx'
// import FactForm from './FactForm.jsx'

// const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

// export default function CountryPanel({ selected, onClose }) {
//   const [loading, setLoading] = useState(true)
//   const [info, setInfo] = useState(null)
//   const [facts, setFacts] = useState([])

//   const code = selected?.code

//   const load = async () => {
//     setLoading(true)
//     try {
//       const [rest, myfacts] = await Promise.all([
//         axios.get(`https://restcountries.com/v3.1/alpha/${code}`),
//         axios.get(`${API_BASE}/api/facts/${code}`)
//       ])
//       setInfo(rest.data?.[0] ?? null)
//       setFacts(myfacts.data ?? [])
//     } catch (e) {
//       console.error(e)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => { if (code) load() }, [code])

//   const flag = info?.flags?.png || info?.flags?.svg
//   const name = info?.name?.common || selected?.name || code
//   const capital = Array.isArray(info?.capital) ? info.capital[0] : info?.capital
//   const region = info?.region
//   const population = info?.population?.toLocaleString()
//   const area = info?.area?.toLocaleString()
//   const languages = info?.languages ? Object.values(info.languages).join(', ') : null
//   const borders = info?.borders?.join(', ') || null

//   async function addFact(text) {
//     const payload = { countryCode: code, countryName: name, factText: text }
//     const { data } = await axios.post(`${API_BASE}/api/facts`, payload)
//     setFacts(f => [data, ...f])
//   }

//   async function upvote(id) {
//     const { data } = await axios.put(`${API_BASE}/api/facts/${id}/upvote`)
//     setFacts(f => f.map(x => x._id === id ? data : x))
//   }

//   async function remove(id) {
//     await axios.delete(`${API_BASE}/api/facts/${id}`)
//     setFacts(f => f.filter(x => x._id !== id))
//   }

//   if (loading) {
//     return (
//       <div className="text-center py-24 animate-pulse text-gray-300">
//         Loading country info...
//       </div>
//     )
//   }

//   return (
//     <div className="relative p-4 animate-fadeIn max-w-3xl mx-auto">
//       {/* floating close */}
//       <button
//         onClick={onClose}
//         aria-label="Close panel"
//         className="
//           absolute right-3 top-3 z-30
//           bg-sky-400/90 text-slate-900
//           w-9 h-9 rounded-lg flex items-center justify-center
//           shadow-lg border border-sky-600/30
//           hover:scale-110 transform transition
//         "
//       >
//         ✕
//       </button>

//       {/* header card */}
//       <div className="flex gap-4 items-center p-4 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-800/50 border border-white/6 shadow-xl">
//         {/* smaller flag */}
//         <div className="flex-shrink-0">
//           <img
//             src={flag}
//             alt={`${name} flag`}
//             className="w-24 h-16 object-cover rounded-md shadow-inner border border-white/8"
//           />
//         </div>

//         <div className="flex-1">
//           <h1 className="text-2xl font-extrabold text-white">{name}
//             <span className="text-sky-300 text-sm ml-2">({code})</span>
//           </h1>
//           <p className="mt-1 text-sm text-slate-300">Quick country overview</p>

//           {/* FACT CARDS GRID (drop-in replacement for your old block) */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">

//             {capital && (
//               <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-white shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
//                 <p className="text-xs opacity-60">Capital</p>
//                 <p className="font-semibold">{capital}</p>
//               </div>
//             )}

//             {region && (
//               <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-white shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
//                 <p className="text-xs opacity-60">Region</p>
//                 <p className="font-semibold">{region}</p>
//               </div>
//             )}

//             {population && (
//               <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-white shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
//                 <p className="text-xs opacity-60">Population</p>
//                 <p className="font-semibold">{population}</p>
//               </div>
//             )}

//             {area && (
//               <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-white shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
//                 <p className="text-xs opacity-60">Area</p>
//                 <p className="font-semibold">{area} km²</p>
//               </div>
//             )}

//             {languages && (
//               <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-white shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
//                 <p className="text-xs opacity-60">Languages</p>
//                 <p className="font-semibold">{languages}</p>
//               </div>
//             )}

//             {borders && (
//               <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-white shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
//                 <p className="text-xs opacity-60">Bordering Countries</p>
//                 <p className="font-semibold">{borders}</p>
//               </div>
//             )}

//           </div>

//         </div>
//       </div>

//       {/* Add fact */}
//       <div className="mt-6 bg-white/4 border border-white/6 p-4 rounded-xl shadow-md">
//         <h3 className="text-lg font-semibold text-white mb-2">Add a Fun Fact</h3>
//         <FactForm onSubmit={addFact} />
//       </div>

//       {/* Community facts */}
//       <div className="mt-6 bg-white/4 border border-white/6 p-4 rounded-xl shadow-md">
//         <h3 className="text-lg font-semibold text-white mb-4">Community Facts</h3>
//         <FactsList facts={facts} onUpvote={upvote} onDelete={remove} />
//       </div>
//     </div>
//   )
// } vIRSON 02




// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import FactsList from './FactsList.jsx'
// import FactForm from './FactForm.jsx'

// const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

// export default function CountryPanel({ selected, onClose }) {
//   const [loading, setLoading] = useState(true)
//   const [info, setInfo] = useState(null)
//   const [facts, setFacts] = useState([])

//   const code = selected?.code

//   const load = async () => {
//     setLoading(true)
//     try {
//       const [rest, myfacts] = await Promise.all([
//         axios.get(`https://restcountries.com/v3.1/alpha/${code}`),
//         axios.get(`${API_BASE}/api/facts/${code}`)
//       ])
//       setInfo(rest.data?.[0] ?? null)
//       setFacts(myfacts.data ?? [])
//     } catch (e) {
//       console.error(e)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => { if (code) load() }, [code])

//   const flag = info?.flags?.png || info?.flags?.svg
//   const name = info?.name?.common || selected?.name || code
//   const capital = Array.isArray(info?.capital) ? info.capital[0] : info?.capital
//   const region = info?.region
//   const population = info?.population?.toLocaleString()
//   const area = info?.area?.toLocaleString()
//   const languages = info?.languages ? Object.values(info.languages).join(', ') : null
//   const borders = info?.borders?.join(', ') || null

//   async function addFact(text) {
//     const payload = { countryCode: code, countryName: name, factText: text }
//     const { data } = await axios.post(`${API_BASE}/api/facts`, payload)
//     setFacts(f => [data, ...f])
//   }

//   async function upvote(id) {
//     const { data } = await axios.put(`${API_BASE}/api/facts/${id}/upvote`)
//     setFacts(f => f.map(x => x._id === id ? data : x))
//   }

//   async function remove(id) {
//     await axios.delete(`${API_BASE}/api/facts/${id}`)
//     setFacts(f => f.filter(x => x._id !== id))
//   }

//   if (loading) {
//     return (
//       <div className="text-center py-24 animate-pulse text-gray-300">
//         Loading country info...
//       </div>
//     )
//   }

//   return (
//     <div className="relative p-6 max-w-2xl mx-auto animate-fadeIn">

//       {/* Close Button */}
//       <button
//         onClick={onClose}
//         className="absolute -top-3 -right-3 bg-sky-400 text-black w-9 h-9 rounded-lg flex items-center justify-center
//         hover:scale-110 transition shadow-lg"
//       >
//         ✕
//       </button>

//       {/* Card Container */}
//       <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-2xl shadow-xl">

//         {/* Flag */}
//         <div className="flex justify-center">
//           <img
//             src={flag}
//             alt={`${name} flag`}
//             className="w-40 h-28 object-cover rounded-lg shadow border border-white/10"
//           />
//         </div>

//         {/* Name */}
//         <h1 className="text-3xl font-bold text-white mt-4 text-center">
//           {name}
//           <span className="text-sky-300 text-lg ml-2">({code})</span>
//         </h1>

//         {/* Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

//           {capital && (
//             <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-white 
//             hover:-translate-y-1 hover:shadow-xl transition">
//               <p className="text-xs opacity-60">Capital</p>
//               <p className="font-semibold">{capital}</p>
//             </div>
//           )}

//           {region && (
//             <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-white 
//             hover:-translate-y-1 hover:shadow-xl transition">
//               <p className="text-xs opacity-60">Region</p>
//               <p className="font-semibold">{region}</p>
//             </div>
//           )}

//           {population && (
//             <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-white 
//             hover:-translate-y-1 hover:shadow-xl transition">
//               <p className="text-xs opacity-60">Population</p>
//               <p className="font-semibold">{population}</p>
//             </div>
//           )}

//           {area && (
//             <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-white 
//             hover:-translate-y-1 hover:shadow-xl transition">
//               <p className="text-xs opacity-60">Area</p>
//               <p className="font-semibold">{area} km²</p>
//             </div>
//           )}

//           {languages && (
//             <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-white 
//             hover:-translate-y-1 hover:shadow-xl transition">
//               <p className="text-xs opacity-60">Languages</p>
//               <p className="font-semibold">{languages}</p>
//             </div>
//           )}

//           {borders && (
//             <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-white 
//             hover:-translate-y-1 hover:shadow-xl transition">
//               <p className="text-xs opacity-60">Bordering Countries</p>
//               <p className="font-semibold">{borders}</p>
//             </div>
//           )}

//         </div>

//         {/* Add Fact */}
//         <div className="mt-6 bg-white/5 border border-white/10 p-4 rounded-xl">
//           <h3 className="text-lg font-semibold text-white mb-2">Add a Fun Fact</h3>
//           <FactForm onSubmit={addFact} />
//         </div>

//         {/* Facts */}
//         <div className="mt-6 bg-white/5 border border-white/10 p-4 rounded-xl">
//           <h3 className="text-lg font-semibold text-white mb-4">Community Facts</h3>
//           <FactsList facts={facts} onUpvote={upvote} onDelete={remove} />
//         </div>

//       </div>
//     </div>
//   )
// } VIRSON 03



// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import FactsList from './FactsList.jsx'
// import FactForm from './FactForm.jsx'
// import './CountryPanel.css'

// const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

// export default function CountryPanel({ selected, onClose }) {
//   const [loading, setLoading] = useState(true)
//   const [info, setInfo] = useState(null)
//   const [facts, setFacts] = useState([])
//   const [error, setError] = useState(null)

//   const code = selected?.code

//   const load = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const [rest, myfacts] = await Promise.all([
//         axios.get(`https://restcountries.com/v3.1/alpha/${code}`),
//         axios.get(`${API_BASE}/api/facts/${code}`)
//       ])
//       if (!rest.data?.[0]) throw new Error('Country not found')
//       setInfo(rest.data[0])
//       setFacts(myfacts.data ?? [])
//     } catch (e) {
//       console.error(e)
//       setError('Failed to load country info')
//       setInfo(null)
//       setFacts([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (code) load()
//   }, [code])

//   const flag = info?.flags?.png || info?.flags?.svg
//   const name = info?.name?.common || selected?.name || code
//   const capital = Array.isArray(info?.capital) ? info.capital[0] : info?.capital
//   const region = info?.region
//   const population = info?.population?.toLocaleString()
//   const area = info?.area?.toLocaleString()
//   const languages = info?.languages ? Object.values(info.languages).join(', ') : null
//   const borders = info?.borders?.join(', ') || null

//   async function addFact(text) {
//     try {
//       const payload = { countryCode: code, countryName: name, factText: text }
//       const { data } = await axios.post(`${API_BASE}/api/facts`, payload)
//       setFacts(f => [data, ...f])
//     } catch (e) {
//       console.error(e)
//     }
//   }

//   async function upvote(id) {
//     try {
//       const { data } = await axios.put(`${API_BASE}/api/facts/${id}/upvote`)
//       setFacts(f => f.map(x => x._id === id ? data : x))
//     } catch (e) {
//       console.error(e)
//     }
//   }

//   async function remove(id) {
//     try {
//       await axios.delete(`${API_BASE}/api/facts/${id}`)
//       setFacts(f => f.filter(x => x._id !== id))
//     } catch (e) {
//       console.error(e)
//     }
//   }

//   if (loading) return <div className="cp-loading">Loading country info...</div>
//   if (error) return <div className="cp-error">{error}</div>

//   const stats = [
//     { label: 'Capital', value: capital },
//     { label: 'Region', value: region },
//     { label: 'Population', value: population },
//     { label: 'Area', value: area ? `${area} km²` : null },
//     { label: 'Languages', value: languages },
//     { label: 'Borders', value: borders },
//   ].filter(stat => stat.value)

//   return (
//     <div className="cp-overlay">
//       <div className="cp-panel">
//         <button className="cp-close" onClick={onClose}>X</button>

//         {flag && <img className="cp-flag" src={flag} alt={`${name} flag`} />}

//         <h1 className="cp-name">{name} <span className="cp-code">({code})</span></h1>

//         <div className="cp-stats">
//           {stats.map(stat => (
//             <div key={stat.label} className="cp-stat-card">
//               <div className="cp-stat-label">{stat.label}</div>
//               <div className="cp-stat-value">{stat.value}</div>
//             </div>
//           ))}
//         </div>

//         <div className="cp-fact-form">
//           {/* <h3>Add a Fun Fact</h3> */}
//           <FactForm onSubmit={addFact} />
//         </div>

//         <div className="cp-facts-list">
//           <h3>Community Facts</h3>
//           {facts.length > 0 ? (
//             <FactsList facts={facts} onUpvote={upvote} onDelete={remove} />
//           ) : (
//             <p>No facts added yet.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// } VIRSON 04




// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import FactsList from './FactsList.jsx'
// import FactForm from './FactForm.jsx'
// import './CountryPanel.css'

// const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

// export default function CountryPanel({ selected, onClose }) {
//   const [loading, setLoading] = useState(true)
//   const [info, setInfo] = useState(null)
//   const [facts, setFacts] = useState([])
//   const [error, setError] = useState(null)

//   const code = selected?.code

//   const load = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const [rest, myfacts] = await Promise.all([
//         axios.get(`https://restcountries.com/v3.1/alpha/${code}`),
//         axios.get(`${API_BASE}/api/facts/${code}`)
//       ])
//       if (!rest.data?.[0]) throw new Error('Country not found')
//       setInfo(rest.data[0])
//       setFacts(myfacts.data ?? [])
//     } catch (e) {
//       console.error(e)
//       setError('Failed to load country info')
//       setInfo(null)
//       setFacts([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (code) load()
//   }, [code])

//   const flag = info?.flags?.png || info?.flags?.svg
//   const name = info?.name?.common || selected?.name || code
//   const capital = Array.isArray(info?.capital) ? info.capital[0] : info?.capital
//   const region = info?.region
//   const population = info?.population?.toLocaleString()
//   const area = info?.area?.toLocaleString()
//   const languages = info?.languages ? Object.values(info.languages).join(', ') : null
//   const borders = info?.borders?.join(', ') || null

//   async function addFact(text) {
//     try {
//       const payload = { countryCode: code, countryName: name, factText: text }
//       const { data } = await axios.post(`${API_BASE}/api/facts`, payload)
//       setFacts(f => [data, ...f])
//     } catch (e) {
//       console.error(e)
//     }
//   }

//   async function upvote(id) {
//     try {
//       const { data } = await axios.put(`${API_BASE}/api/facts/${id}/upvote`)
//       setFacts(f => f.map(x => x._id === id ? data : x))
//     } catch (e) {
//       console.error(e)
//     }
//   }

//   async function remove(id) {
//     try {
//       await axios.delete(`${API_BASE}/api/facts/${id}`)
//       setFacts(f => f.filter(x => x._id !== id))
//     } catch (e) {
//       console.error(e)
//     }
//   }

//   if (loading) return <div className="cp-loading">Loading country info...</div>
//   if (error) return <div className="cp-error">{error}</div>

//   const stats = [
//     { label: 'Capital', value: capital },
//     { label: 'Region', value: region },
//     { label: 'Population', value: population },
//     { label: 'Area', value: area ? `${area} km²` : null },
//     { label: 'Languages', value: languages },
//     { label: 'Borders', value: borders },
//   ].filter(stat => stat.value)

//   return (
//     <div className="cp-sidepanel">
//       <button className="cp-close" onClick={onClose}>X</button>

//       {flag && <img className="cp-flag" src={flag} alt={`${name} flag`} />}

//       <h1 className="cp-name">{name} <span className="cp-code">({code})</span></h1>

//       <div className="cp-stats">
//         {stats.map(stat => (
//           <div key={stat.label} className="cp-stat-card">
//             <div className="cp-stat-label">{stat.label}</div>
//             <div className="cp-stat-value">{stat.value}</div>
//           </div>
//         ))}
//       </div>

//       <div className="cp-fact-form">
//         <FactForm onSubmit={addFact} />
//       </div>

//       <div className="cp-facts-list">
//         <h3>Community Facts</h3>
//         {facts.length > 0 ? (
//           <FactsList facts={facts} onUpvote={upvote} onDelete={remove} />
//         ) : (
//           <p>No facts added yet.</p>
//         )}
//       </div>
//     </div>
//   )
// } VIRSON 05


import { useEffect, useState } from 'react'
import axios from 'axios'
import FactsList from './FactsList.jsx'
import FactForm from './FactForm.jsx'
import './CountryPanel.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function CountryPanel({ selected, onClose }) {
  const [loading, setLoading] = useState(true)
  const [info, setInfo] = useState(null)
  const [facts, setFacts] = useState([])
  const [error, setError] = useState(null)

  // NEW: AI fact states
  const [aiFacts, setAiFacts] = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(null)

  const code = selected?.code

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [rest, myfacts] = await Promise.all([
        axios.get(`https://restcountries.com/v3.1/alpha/${code}`),
        axios.get(`${API_BASE}/api/facts/${code}`)
      ])
      if (!rest.data?.[0]) throw new Error('Country not found')
      setInfo(rest.data[0])
      setFacts(myfacts.data ?? [])
    } catch (e) {
      console.error(e)
      setError('Failed to load country info')
      setInfo(null)
      setFacts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (code) load()
  }, [code])

  const flag = info?.flags?.png || info?.flags?.svg
  const name = info?.name?.common || selected?.name || code

  const capital = Array.isArray(info?.capital) ? info.capital[0] : info?.capital
  const region = info?.region
  const population = info?.population?.toLocaleString()
  const area = info?.area?.toLocaleString()
  const languages = info?.languages ? Object.values(info.languages).join(', ') : null
  const borders = info?.borders?.join(', ') || null

  async function addFact(text) {
    try {
      const payload = { countryCode: code, countryName: name, factText: text }
      const { data } = await axios.post(`${API_BASE}/api/facts`, payload)
      setFacts(f => [data, ...f])
    } catch (e) {
      console.error(e)
    }
  }

  async function upvote(id) {
    try {
      const { data } = await axios.put(`${API_BASE}/api/facts/${id}/upvote`)
      setFacts(f => f.map(x => x._id === id ? data : x))
    } catch (e) { console.error(e) }
  }

  async function remove(id) {
    try {
      await axios.delete(`${API_BASE}/api/facts/${id}`)
      setFacts(f => f.filter(x => x._id !== id))
    } catch (e) { console.error(e) }
  }

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



  if (loading) return <div className="cp-loading">Loading country info...</div>
  if (error) return <div className="cp-error">{error}</div>

  const stats = [
    { label: 'Capital', value: capital },
    { label: 'Region', value: region },
    { label: 'Population', value: population },
    { label: 'Area', value: area ? `${area} km²` : null },
    { label: 'Languages', value: languages },
    { label: 'Borders', value: borders },
  ].filter(stat => stat.value)

  return (
    <div className="cp-sidepanel">
      <button className="cp-close" onClick={onClose}>X</button>

      {flag && <img className="cp-flag" src={flag} alt={`${name} flag`} />}

      <h1 className="cp-name">
        {name} <span className="cp-code">({code})</span>
      </h1>

      <div className="cp-stats">
        {stats.map(stat => (
          <div key={stat.label} className="cp-stat-card">
            <div className="cp-stat-label">{stat.label}</div>
            <div className="cp-stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="cp-ai-section">
        <h3>AI-Generated Fun Facts</h3>

        {aiLoading && <p>Generating...</p>}
        {aiError && <p className="cp-error">{aiError}</p>}

        {aiFacts.length > 0 && (
          <div className="cp-ai-fact-list">
            {aiFacts.map((f, i) => (
              <div key={i} className="cp-ai-fact-box">
                <p>{f.fact}</p>
                <button onClick={() => addFact(f.fact)}>Save to Community Facts</button>
              </div>
            ))}
          </div>
        )}

        <button className="cp-ai-btn" onClick={generateAiFact} disabled={aiLoading}>
          {aiLoading ? "Generating..." : "Generate 5 AI Facts ✨"}
        </button>
      </div>


      <div className="cp-fact-form">
        <FactForm onSubmit={addFact} />
      </div>

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
