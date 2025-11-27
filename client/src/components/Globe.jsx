/**
 * Globe.jsx
 * ---------------------------------------------------------------
 * This file renders the interactive 3D globe used in the World Fun Facts app.
 * It includes:
 *  - Earth sphere with a realistic texture
 *  - Auto camera rotation
 *  - Clickable country marker dots (lat/lon → 3D points)
 *  - Raycasting to detect which country is clicked
 *  - OrbitControls for user navigation
 */

import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import './CountryPanel.css'
import earthTexture from './../assets/earth.jpg'

/**
 * Converts latitude/longitude into a 3D coordinate on a sphere.
 * Used for positioning country markers accurately on the globe.
 */
function latLonToVec3(lat, lon, r = 1.02) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  )
}

/**
 * CountryMarkers
 * ----------------------------------------------------------
 * - Downloads all countries with lat/lon coordinates
 * - Converts them into sphere marker positions
 * - Renders each country as a tiny sphere on the globe
 * - Uses raycasting to detect clicks on markers
 * - Sends selected country info back to parent component
 */
function CountryMarkers({ onSelectCountry }) {
  const groupRef = useRef()
  const [countries, setCountries] = useState([])

  // Raycasting system
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const mouse = useMemo(() => new THREE.Vector2(), [])
  const { camera, gl } = useThree()

  /** Load country positions (one-time fetch) */
  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await axios.get(
        'https://restcountries.com/v3.1/all?fields=cca2,name,latlng'
      )

      const mapped = data
        .filter(c => Array.isArray(c.latlng))
        .map(c => ({
          code: c.cca2,
          name: c.name?.common ?? c.cca2,
          latlng: { lat: c.latlng[0], lon: c.latlng[1] }
        }))

      setCountries(mapped)
    }

    fetchAll().catch(console.error)
  }, [])

  /** Convert country lat/lon → 3D marker objects */
  const sprites = useMemo(() => {
    const g = new THREE.SphereGeometry(0.008, 6, 6)
    const mat = new THREE.MeshBasicMaterial({ color: '#00ffa6' })

    return countries.map(c => ({
      ...c,
      pos: latLonToVec3(c.latlng.lat, c.latlng.lon, 1.02),
      g,
      mat
    }))
  }, [countries])

  /** Detect marker clicks using raycaster */
  useEffect(() => {
    const onClick = (e) => {
      const rect = gl.domElement.getBoundingClientRect()

      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)

      const hits = raycaster.intersectObjects(groupRef.current?.children ?? [])
      if (hits.length === 0) return

      const data = hits[0].object.userData?.country
      if (data) onSelectCountry(data)
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
 * AutoRotate
 * ----------------------------------------------------------
 * Smoothly rotates the camera around the Earth when enabled.
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
 * Globe (MAIN COMPONENT)
 * ----------------------------------------------------------
 * - Loads Earth texture using THREE.TextureLoader
 * - Renders sphere (64×64 segments = smooth globe)
 * - Adds stars background + lighting + interaction controls
 * - Hosts CountryMarkers + AutoRotate components
 */
export default function Globe({ onSelectCountry, autoRotate }) {

  // Load the Earth texture image
  const texture = useLoader(THREE.TextureLoader, earthTexture)

  return (
    <Canvas camera={{ position: [0, 0, 2.8], fov: 45 }}>

      {/* Ambient + directional lighting for realism */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />

      {/* Background starfield for depth */}
      <Stars radius={100} depth={50} factor={4} saturation={0} />

      {/* Passive rotation */}
      <AutoRotate enabled={autoRotate} />

      {/* Earth sphere (64 segments = smooth surface) */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial map={texture} shininess={10} />
      </mesh>

      {/* Interactive country markers */}
      <CountryMarkers onSelectCountry={onSelectCountry} />

      {/* User controls (panning disabled) */}
      <OrbitControls enablePan={false} />
    </Canvas>
  )
}
