import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import './CountryPanel.css'

// Convert lat/lon to 3D position on sphere radius r
function latLonToVec3(lat, lon, r = 1.02) {
  const phi = (90 - lat) * (Math.PI/180)
  const theta = (lon + 180) * (Math.PI/180)
  const x = -r * Math.sin(phi) * Math.cos(theta)
  const z =  r * Math.sin(phi) * Math.sin(theta)
  const y =  r * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

function CountryMarkers({ onSelectCountry }) {
  const groupRef = useRef()
  const [countries, setCountries] = useState([]) // { cca2, name, latlng }
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const mouse = useMemo(() => new THREE.Vector2(), [])
  const { camera, gl, scene } = useThree()

  useEffect(() => {
    // Pull once from REST Countries for cca2/name/latlng (centroids)
    // We use these latlng as marker positions.
    const fetchAll = async () => {
      const { data } = await axios.get('https://restcountries.com/v3.1/all?fields=cca2,name,latlng')
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

  // Build sprite markers
  const sprites = useMemo(() => {
    const g = new THREE.SphereGeometry(0.008, 6, 6)
    const mat = new THREE.MeshBasicMaterial({ color: '#a3ffb2' })
    return countries.map((c) => {
      const pos = latLonToVec3(c.latlng.lat, c.latlng.lon, 1.02)
      return { ...c, pos, g, mat }
    })
  }, [countries])

  // Click picking
  useEffect(() => {
    const onClick = (e) => {
      const rect = gl.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const meshes = groupRef.current?.children ?? []
      const hits = raycaster.intersectObjects(meshes, true)
      if (hits.length > 0) {
        const mesh = hits[0].object
        const data = mesh.userData?.country
        if (data) {
          // console.log('Clicked country:', data)
          onSelectCountry({ code: data.code, name: data.name, latlng: data.latlng })
        }
      }
    }
    gl.domElement.addEventListener('click', onClick)
    return () => gl.domElement.removeEventListener('click', onClick)
  }, [camera, gl, onSelectCountry, raycaster, mouse])

  return (
    <group ref={groupRef}>
      {sprites.map((c, idx) => (
        <mesh key={idx} position={c.pos} geometry={c.g} material={c.mat} userData={{ country: c }} />
      ))}
    </group>
  )
}

function AutoRotate({ enabled }) {
  useFrame(({ camera }) => {
    if (!enabled) return
    camera.position.applyAxisAngle(new THREE.Vector3(0,1,0), 0.0004)
    camera.lookAt(0,0,0)
  })
  return null
}

export default function Globe({ onSelectCountry, autoRotate }) {
  return (
    <Canvas camera={{ position: [0, 0, 2.8], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <Stars radius={100} depth={50} factor={4} saturation={0} />
      <AutoRotate enabled={autoRotate} />

      {/* Earth */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial color={'#1a265a'} emissive={'#0b1020'} shininess={5} />
      </mesh>

      {/* Country centroid markers */}
      <CountryMarkers onSelectCountry={onSelectCountry} />

      <OrbitControls enablePan={false} />
    </Canvas>
  )
}
