"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useFBO } from "@react-three/drei"
import { EffectComposer, Bloom, N8AO } from "@react-three/postprocessing"
import * as THREE from "three"

// NOTE: The shader code remains unchanged as it controls the particle's
// fluid motion and color, which we want to preserve.

// Custom shader material for the fluid effect
const simulationMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D uCurrentPosition;
    uniform sampler2D uOriginalPosition;
    uniform float uTime;
    uniform float uCurl;
    uniform float uSpeed;

    vec3 snoise(vec3 uv) {
      uv.x += uTime * 0.01;
      float s = sin(uv.z * 2.1) * 0.2 + cos(uv.y * 3.2) * 0.3 + sin(uv.x * 2.2) * 0.2;
      float c = cos(uv.z * 2.1) * 0.2 + sin(uv.y * 3.2) * 0.3 + cos(uv.x * 2.2) * 0.2;
      float s2 = sin(uv.y * 1.1) * 0.2 + cos(uv.x * 2.2) * 0.3 + sin(uv.z * 1.2) * 0.2;
      float c2 = cos(uv.y * 1.1) * 0.2 + sin(uv.x * 2.2) * 0.3 + cos(uv.z * 1.2) * 0.2;
      return vec3(s, c, s2 * c2) * uCurl;
    }

    void main() {
      vec3 currentPos = texture2D(uCurrentPosition, vUv).xyz;
      vec3 originalPos = texture2D(uOriginalPosition, vUv).xyz;
      vec3 noise = snoise(currentPos * 0.1);
      currentPos += noise * uSpeed;
      gl_FragColor = vec4(currentPos, 1.0);
    }
  `,
  uniforms: {
    uCurrentPosition: { value: null },
    uOriginalPosition: { value: null },
    uTime: { value: 0 },
    uCurl: { value: 1.5 },
    uSpeed: { value: 0.01 },
  },
})

const renderMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    uniform sampler2D uPosition;
    uniform float uTime;
    varying vec3 vColor;

    void main() {
      vec3 pos = texture2D(uPosition, position.xy).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = 1.5;
      vColor = normalize(pos) * 0.5 + 0.5;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    void main() {
      gl_FragColor = vec4(vColor, 1.0);
    }
  `,
  uniforms: {
    uPosition: { value: null },
    uTime: { value: 0 },
  },
})

/**
 * This component sets up and runs the particle simulation for a given geometry.
 */
function ParticleSystem({ geometry }: { geometry: THREE.BufferGeometry }) {
  const size = 256 // Reduced size for better performance with two systems
  const pointsRef = useRef<THREE.Points>(null!)
  const { gl } = useThree()

  const fbo1 = useFBO(size, size, { type: THREE.FloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter })
  const fbo2 = useFBO(size, size, { type: THREE.FloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter })

  const { originalPositionTexture, particlePositions } = useMemo(() => {
    const particles = new Float32Array(size * size * 4)
    const positions = geometry.attributes.position.array
    for (let i = 0; i < size * size; i++) {
      const i4 = i * 4
      const p_i = (i * 3) % positions.length
      particles[i4 + 0] = positions[p_i + 0]
      particles[i4 + 1] = positions[p_i + 1]
      particles[i4 + 2] = positions[p_i + 2]
      particles[i4 + 3] = 1.0
    }

    const originalPositionTexture = new THREE.DataTexture(particles, size, size, THREE.RGBAFormat, THREE.FloatType)
    originalPositionTexture.needsUpdate = true

    const tempScene = new THREE.Scene()
    const tempCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const tempMaterial = new THREE.MeshBasicMaterial({ map: originalPositionTexture })
    const tempMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), tempMaterial)
    tempScene.add(tempMesh)
    gl.setRenderTarget(fbo1)
    gl.render(tempScene, tempCamera)
    gl.setRenderTarget(null)

    const particlePositions = new Float32Array(size * size * 3)
    for (let i = 0; i < size * size; i++) {
      const i3 = i * 3
      particlePositions[i3 + 0] = (i % size) / size
      particlePositions[i3 + 1] = Math.floor(i / size) / size
      particlePositions[i3 + 2] = 0
    }

    return { originalPositionTexture, particlePositions }
  }, [size, gl, fbo1, geometry])

  useFrame((state) => {
    const { gl, clock } = state
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    
    simulationMaterial.uniforms.uCurrentPosition.value = fbo1.texture
    simulationMaterial.uniforms.uOriginalPosition.value = originalPositionTexture
    simulationMaterial.uniforms.uTime.value = clock.elapsedTime
    
    const simulationMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simulationMaterial)
    scene.add(simulationMesh)
    
    gl.setRenderTarget(fbo2)
    gl.render(scene, camera)
    gl.setRenderTarget(null)

    const temp = fbo1.texture
    fbo1.texture = fbo2.texture
    fbo2.texture = temp

    renderMaterial.uniforms.uPosition.value = fbo1.texture
    renderMaterial.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={size * size}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <primitive object={renderMaterial} attach="material" />
    </points>
  )
}

export function Scene() {
  const ring1Ref = useRef<THREE.Group>(null!)
  const ring2Ref = useRef<THREE.Group>(null!)

  // Create the two torus geometries, keeping the original thickness (0.3)
  const ring1Geom = useMemo(() => new THREE.TorusGeometry(1.2, 0.3, 32, 200), [])
  const ring2Geom = useMemo(() => new THREE.TorusGeometry(1.2, 0.3, 32, 200), [])

  // This is the main animation loop
  useFrame(() => {
    if (ring1Ref.current && ring2Ref.current) {
      // Rotate the first ring on its own axis (like a bicycle tire)
      ring1Ref.current.rotation.z += 0.002
      // Rotate the second ring on its own axis
      ring2Ref.current.rotation.x += 0.002

      // Add a slow overall tumble to the whole group for more dynamism
      ring1Ref.current.parent!.rotation.y += 0.0005
      ring1Ref.current.parent!.rotation.x += 0.0002
    }
  })

  return (
    <>
      <group>
        {/* First Ring - positioned left */}
        <group ref={ring1Ref} position={[-0.7, 0, 0]}>
          <ParticleSystem geometry={ring1Geom} />
        </group>
        {/* Second Ring - positioned right and rotated to interlace */}
        <group ref={ring2Ref} position={[0.7, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ParticleSystem geometry={ring2Geom} />
        </group>
      </group>
      <EffectComposer>
        <Bloom intensity={0.6} luminanceThreshold={0.1} luminanceSmoothing={0.9} height={1024} />
        <N8AO quality="high" aoRadius={0.5} intensity={1.5} color="black" />
      </EffectComposer>
    </>
  )
}
