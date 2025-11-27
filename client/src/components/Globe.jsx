import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import './CountryPanel.css'
import earthTexture from './../assets/earth.jpg'

/**
 * Converts latitude/longitude into a 3D position on a sphere.
 * This function ensures every country's marker appears at the
 * correct geographical location on the globe surface.
 *
 * lat  → latitude  (-90 to +90)
 * lon  → longitude (-180 to +180)
 * r    → sphere radius (slightly > 1 so markers float above map)
 */
function latLonToVec3(lat, lon, r = 1.02) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x = -r * Math.sin(phi) * Math.cos(theta)
  const z = r * Math.sin(phi) * Math.sin(theta)
  const y = r * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

/**
 * CountryMarkers Component
 * ---------------------------------------------------------------
 * Responsibilities:
 *  - Fetch list of countries + their coordinates (lat/lon)
 *  - Convert coordinates to 3D positions using latLonToVec3()
 *  - Draw tiny marker spheres at each country location
 *  - Use a raycaster to detect which marker was clicked
 *  - Send the clicked country back to parent (Globe)
 *
 * Note:
 * Markers use a small sphere geometry and basic green material.
 * UserData is used to attach country info to each mesh.
 */
function CountryMarkers({ onSelectCountry }) {
  const groupRef = useRef()

  // Holds all countries fetched from REST Countries API
  const [countries, setCountries] = useState([])

  // Raycasting utilities used for click detection
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const mouse = useMemo(() => new THREE.Vector2(), [])
  const { camera, gl } = useThree()

  /**
   * Fetch all countries only once (lat/lon + names)
   * This provides marker positions for the entire globe.
   */
  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await axios.get(
        'https://restcountries.com/v3.1/all?fields=cca2,name,latlng'
      )

      const mapped = data
        .filter(c => Array.isArray(c.latlng) && c.latlng.length === 2)
        .map(c => ({
          code: c.cca2,
          name: c.name?.common ?? c.cca2,
          latlng: { lat: c.latlng[0], lon: c.latlng[1] }
        }))

      setCountries(mapped)
    }

    fetchAll().catch(console.error)
  }, [])

  /**
   * Convert every country's lat/lon into a marker mesh object.
   * This uses memoization to avoid recalculations each render.
   */
  const sprites = useMemo(() => {
    const g = new THREE.SphereGeometry(0.008, 6, 6) // marker size & detail
    const mat = new THREE.MeshBasicMaterial({ color: '#00ffa6' }) // marker color

    return countries.map((c) => ({
      ...c,
      pos: latLonToVec3(c.latlng.lat, c.latlng.lon, 1.02),
      g,
      mat
    }))
  }, [countries])

  /**
   * Detect which country marker was clicked using raycasting.
   * Converts mouse click → ray → intersects marker mesh.
   */
  useEffect(() => {
    const onClick = (e) => {
      const rect = gl.domElement.getBoundingClientRect()

      // Convert click to normalized device coordinates (-1 to +1)
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      // Cast a ray into the scene
      raycaster.setFromCamera(mouse, camera)

      // Check intersection with all marker meshes
      const meshes = groupRef.current?.children ?? []
      const hits = raycaster.intersectObjects(meshes, true)

      if (hits.length > 0) {
        const mesh = hits[0].object
        const data = mesh.userData?.country

        // Notify parent which country was selected
        if (data) {
          onSelectCountry({
            code: data.code,
            name: data.name,
            latlng: data.latlng
          })
        }
      }
    }

    gl.domElement.addEventListener('click', onClick)
    return () => gl.domElement.removeEventListener('click', onClick)
  }, [camera, gl, onSelectCountry, mouse, raycaster])

  return (
    <group ref={groupRef}>
      {sprites.map((c, idx) => (
        <mesh
          key={idx}
          geometry={c.g}
          material={c.mat}
          position={c.pos}
          userData={{ country: c }}
        />
      ))}
    </group>
  )
}

/**
 * AutoRotate Component
 * -------------------------------------------------------------
 * Applies a very small rotation to the camera around the globe,
 * creating a smooth idle rotation effect.
 * Turns on/off using the `enabled` prop.
 */
function AutoRotate({ enabled }) {
  useFrame(({ camera }) => {
    if (!enabled) return
    camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.0004)
    camera.lookAt(0, 0, 0)
  })
  return null
}

/**
 * Globe Component (Main Export)
 * ---------------------------------------------------------------
 * Renders:
 *  - Earth globe with texture
 *  - Light sources
 *  - Starfield background
 *  - Camera rotation (optional)
 *  - Country markers
 *  - Orbit controls for zoom/rotate
 *
 * Notes:
 *  - Sphere uses 64x64 segments to keep the globe smooth.
 *  - `useLoader` loads the texture from /assets.
 */
export default function Globe({ onSelectCountry, autoRotate }) {

  // Load Earth texture file
  const texture = useLoader(THREE.TextureLoader, earthTexture)

  return (
    <Canvas camera={{ position: [0, 0, 2.8], fov: 45 }}>

      {/* Lighting to illuminate the texture */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />

      {/* Background stars for visual depth */}
      <Stars radius={100} depth={50} factor={4} saturation={0} />

      {/* Smooth idle rotation */}
      <AutoRotate enabled={autoRotate} />

      {/* Earth sphere with wrapped texture */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial map={texture} shininess={10} />
      </mesh>

      {/* All clickable country markers */}
      <CountryMarkers onSelectCountry={onSelectCountry} />

      {/* User camera controls */}
      <OrbitControls enablePan={false} />
    </Canvas>
  )
}
