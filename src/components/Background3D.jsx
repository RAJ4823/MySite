import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Line, OrbitControls, useTexture } from '@react-three/drei';
import { useRef, useMemo, useEffect, useLayoutEffect, useState, Suspense } from 'react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import {
  DEFAULT_CAM,
  DEFAULT_TARGET,
  PLANET_TEXTURES,
  EXTRA_TEXTURES,
  SUN,
  STARS as STARS_CONST,
  PLANET_MATERIAL,
  PLANETS_DEF,
  ORBIT_LAYOUT,
  AXIAL_TILT_DEG,
  AXIAL_RATES,
  SATURN_RING,
  MOON,
  ASTEROID_BELT,
  COMETS as COMETS_CONST,
  LIGHTS,
  CAMERA,
  ORBIT_CONTROLS,
  BLOOM as BLOOM_CONST,
  speedFromAU,
} from '../data/solarSystem';

// Shared defaults are imported from data/solarSystem

function Comets({ small = true, center = DEFAULT_TARGET, count = COMETS_CONST.count }) {
  const group = useRef();
  // Random orbital elements for each comet (Keplerian ellipses around the Sun)
  const comets = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const a = COMETS_CONST.semiMajorAxis[0] + Math.random() * (COMETS_CONST.semiMajorAxis[1] - COMETS_CONST.semiMajorAxis[0]);
      const e = COMETS_CONST.eccentricity[0] + Math.random() * (COMETS_CONST.eccentricity[1] - COMETS_CONST.eccentricity[0]);
      const inc = (Math.random() * (COMETS_CONST.inclinationDeg[1] - COMETS_CONST.inclinationDeg[0]) + COMETS_CONST.inclinationDeg[0]) * Math.PI / 180;
      const raan = Math.random() * Math.PI * 2;  // longitude of ascending node
      const argp = Math.random() * Math.PI * 2;  // argument of periapsis
      const M0 = Math.random() * Math.PI * 2;    // mean anomaly at t=0
      const n = COMETS_CONST.meanMotionK / Math.pow(a, 1.5);
      const size = small
        ? COMETS_CONST.sizeSmall[0] + Math.random() * (COMETS_CONST.sizeSmall[1] - COMETS_CONST.sizeSmall[0])
        : COMETS_CONST.sizeLarge[0] + Math.random() * (COMETS_CONST.sizeLarge[1] - COMETS_CONST.sizeLarge[0]);
      // Precompute rotation matrix from perifocal to inertial (Rz(raan) Rx(inc) Rz(argp))
      const cosO = Math.cos(raan), sinO = Math.sin(raan);
      const cosi = Math.cos(inc),  sini = Math.sin(inc);
      const cosw = Math.cos(argp), sinw = Math.sin(argp);
      const R11 =  cosO*cosw - sinO*sinw*cosi;
      const R12 = -cosO*sinw - sinO*cosw*cosi;
      const R13 =  sinO*sini;
      const R21 =  sinO*cosw + cosO*sinw*cosi;
      const R22 = -sinO*sinw + cosO*cosw*cosi;
      const R23 = -cosO*sini;
      const R31 =  sinw*sini;
      const R32 =  cosw*sini;
      const R33 =  cosi;
      arr.push({ a, e, inc, raan, argp, M0, n, size, R:[R11,R12,R13,R21,R22,R23,R31,R32,R33] });
    }
    return arr;
  }, [count, small]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((m, i) => {
      const c = comets[i];
      if (!c) return;
      // Mean anomaly and eccentric anomaly (Newton-Raphson)
      const M = c.M0 + c.n * t;
      let E = M; // initial guess
      for (let k = 0; k < 4; k++) {
        const f = E - c.e * Math.sin(E) - M;
        const fp = 1 - c.e * Math.cos(E);
        E -= f / Math.max(1e-5, fp);
      }
      // True anomaly and radius
      const cosE = Math.cos(E), sinE = Math.sin(E);
      const r = c.a * (1 - c.e * cosE);
      const nu = Math.atan2(Math.sqrt(1 - c.e*c.e) * sinE, cosE - c.e);
      // Position in perifocal frame
      const xp = r * Math.cos(nu);
      const yp = r * Math.sin(nu);
      // Rotate to inertial
      const R = c.R;
      const x = R[0]*xp + R[1]*yp + center[0];
      const y = R[3]*xp + R[4]*yp + center[1];
      const z = R[6]*xp + R[7]*yp + center[2];
      m.position.set(x, y, z);
      // Tail should point away from the Sun (radial from Sun to comet)
      const vx = x - center[0], vy = y - center[1], vz = z - center[2];
      const len = Math.hypot(vx, vy, vz) || 1;
      const nx = vx/len, ny = vy/len, nz = vz/len;
      // Set nucleus rotation slowly
      m.children[0].rotation.y += 0.6 * delta;
      // Point cone tail
      const cone = m.children[1];
      if (cone) {
        const dir = new THREE.Vector3(nx, ny, nz);
        const quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); // default cone points +Y
        cone.setRotationFromQuaternion(quat);
        // Place the cone so its base sits at the nucleus: shift by half height along local +Y (now aligned with dir)
        const h2 = (c.size * 12) * 0.5;
        cone.position.set(dir.x * h2, dir.y * h2, dir.z * h2);
      }
    });
  });

  return (
    <group ref={group}>
      {comets.map((c, i) => (
        <group key={i}>
          {/* Nucleus */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[c.size, 10, 10]} />
            <meshStandardMaterial color="#dfefff" emissive="#9ec8ff" emissiveIntensity={0.6} roughness={0.6} metalness={0.0} />
          </mesh>
          {/* Simple translucent tail (positioned dynamically each frame) */}
          <mesh>
            <coneGeometry args={[c.size * COMETS_CONST.tail.baseRadiusFactor, c.size * COMETS_CONST.tail.lengthFactor, 12, 1, true]} />
            <meshBasicMaterial color={COMETS_CONST.tail.color} transparent opacity={COMETS_CONST.tail.opacity} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function AsteroidBelt({ center, inner = ASTEROID_BELT.defaultInner, outer = ASTEROID_BELT.defaultOuter, count = ASTEROID_BELT.defaultCount }) {
  const group = useRef();

  // Small pool of JS-generated textures to randomize asteroid appearance without heavy assets
  const texturePool = useMemo(() => {
    const makeTexture = (hueBase) => {
      const canv = document.createElement('canvas');
      canv.width = 128; canv.height = 128;
      const ctx = canv.getContext('2d');
      // base fill
      ctx.fillStyle = `hsl(${hueBase}, 15%, 35%)`;
      ctx.fillRect(0, 0, 128, 128);
      // speckles
      for (let i = 0; i < 350; i++) {
        const x = Math.random() * 128;
        const y = Math.random() * 128;
        const r = Math.random() * 1.8 + 0.3;
        const light = 25 + Math.random() * 40; // 25–65%
        ctx.fillStyle = `hsla(${hueBase + (Math.random()*10-5)}, 12%, ${light}%, ${0.7 + Math.random()*0.3})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      const tex = new THREE.CanvasTexture(canv);
      if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace; else tex.encoding = THREE.sRGBEncoding;
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.anisotropy = 4;
      return tex;
    };
    // A few hues: gray, brown, reddish, bluish-gray
    return [makeTexture(20), makeTexture(30), makeTexture(15), makeTexture(10), makeTexture(5), makeTexture(0)];
  }, []);

  const asteroids = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const r = inner + Math.random() * (outer - inner);
      const a = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * ASTEROID_BELT.beltThickness; // slight belt thickness
      const size = ASTEROID_BELT.sizeRange[0] + Math.random() * (ASTEROID_BELT.sizeRange[1] - ASTEROID_BELT.sizeRange[0]);
      const speed = ASTEROID_BELT.speedRange[0] + Math.random() * (ASTEROID_BELT.speedRange[1] - ASTEROID_BELT.speedRange[0]); // slow drift
      const mat = Math.floor(Math.random() * texturePool.length);
      const rough = 0.75 + Math.random() * 0.2; // 0.75–0.95
      const metal = 0.02 + Math.random() * 0.06; // 0.02–0.08
      const tint = ASTEROID_BELT.tintLightness[0] + Math.floor(Math.random() * (ASTEROID_BELT.tintLightness[1] - ASTEROID_BELT.tintLightness[0]));
      // micro rotation wobble params
      const spinX = ASTEROID_BELT.spin.x[0] + Math.random() * (ASTEROID_BELT.spin.x[1] - ASTEROID_BELT.spin.x[0]);
      const spinY = ASTEROID_BELT.spin.y[0] + Math.random() * (ASTEROID_BELT.spin.y[1] - ASTEROID_BELT.spin.y[0]);
      const wobbleAmp = ASTEROID_BELT.wobble.amp[0] + Math.random() * (ASTEROID_BELT.wobble.amp[1] - ASTEROID_BELT.wobble.amp[0]);
      const wobbleFreq = ASTEROID_BELT.wobble.freq[0] + Math.random() * (ASTEROID_BELT.wobble.freq[1] - ASTEROID_BELT.wobble.freq[0]);
      const wobblePhase = Math.random() * Math.PI * 2;
      arr.push({ r, a, y, size, speed, mat, rough, metal, tint, spinX, spinY, wobbleAmp, wobbleFreq, wobblePhase });
    }
    return arr;
  }, [inner, outer, count, texturePool]);
  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((m, i) => {
      const it = asteroids[i];
      const ang = it.a + t * it.speed * 0.05;
      m.position.set(
        center[0] + Math.cos(ang) * it.r,
        center[1] + it.y,
        center[2] + Math.sin(ang) * it.r
      );
      // base spin with micro wobble
      m.rotation.x += it.spinX * delta + Math.sin(t * it.wobbleFreq * Math.PI * 2 + it.wobblePhase) * it.wobbleAmp * 0.5;
      m.rotation.y += it.spinY * delta + Math.cos(t * it.wobbleFreq * Math.PI * 2 + it.wobblePhase) * it.wobbleAmp * 0.35;
    });
  });
  return (
    <group ref={group}>
      {asteroids.map((it, i) => (
        <mesh key={i} position={[center[0], center[1] + it.y, center[2]]} castShadow receiveShadow>
          <icosahedronGeometry args={[it.size, 0]} />
          <meshStandardMaterial
            map={texturePool[it.mat]}
            color={`hsl(20, 10%, ${it.tint}%)`}
            roughness={it.rough}
            metalness={it.metal}
          />
        </mesh>
      ))}
    </group>
  );
}

function SolarSystem({ useTextures = false, showEquators = false }) {
  // Single solar system, slightly to the right
  const center = DEFAULT_TARGET;

  // Planet textures from local public folder (medium quality recommended: 1k–2k)
  const tex = useTextures ? useTexture(PLANET_TEXTURES) : {};
  // Extra textures (optional): sun, moon, milky way background
  const extra = useTextures ? useTexture(EXTRA_TEXTURES) : {};

  // Improve texture clarity on oblique angles (AF) and color space. No-op when textures disabled.
  const { gl } = useThree();
  useEffect(() => {
    if (!useTextures) return;
    try {
      const max = Math.min(8, gl?.capabilities?.getMaxAnisotropy?.() || 0);
      const all = [...Object.values(tex), ...Object.values(extra)];
      all.forEach((t) => {
        if (!t) return;
        if (max) t.anisotropy = max;
        if ('colorSpace' in t) t.colorSpace = THREE.SRGBColorSpace; else if ('encoding' in t) t.encoding = THREE.sRGBEncoding;
      });
      // Saturn ring texture: shader handles mapping, so keep neutral texture settings
      if (tex.saturnRing) {
        tex.saturnRing.center.set(0.5, 0.5);
        tex.saturnRing.rotation = 0;
        tex.saturnRing.wrapS = THREE.ClampToEdgeWrapping;
        tex.saturnRing.wrapT = THREE.ClampToEdgeWrapping;
        tex.saturnRing.repeat.set(1, 1);
        tex.saturnRing.offset.set(0, 0);
        tex.saturnRing.minFilter = THREE.LinearFilter;
        tex.saturnRing.magFilter = THREE.LinearFilter;
        tex.saturnRing.generateMipmaps = false;
        tex.saturnRing.premultiplyAlpha = true;
        if ('format' in tex.saturnRing) tex.saturnRing.format = THREE.RGBAFormat;
        tex.saturnRing.flipY = false;
        tex.saturnRing.needsUpdate = true;
      }
    } catch {}
  }, [useTextures, gl, tex, extra]);

  // Compute realistic orbit distances using compressed sqrt(AU) scaling + collision-safe clearances.
  // This ensures no visual overlap even when a planet (esp. Saturn with rings) is closest to the Sun.
  const planets = useMemo(() => {
    const defs = PLANETS_DEF;
    const base = ORBIT_LAYOUT.base;
    const scale = ORBIT_LAYOUT.scale;
    const buffer = ORBIT_LAYOUT.buffer;

    // Initial radii from sqrt(AU)
    const initial = defs.map(d => base + scale * Math.sqrt(d.AU));

    // Clearance per planet: own radius; Saturn uses outer ring radius for safety
    const clearance = defs.map(d => d.name === 'Saturn' ? d.r * ORBIT_LAYOUT.outerRingScale : d.r);

    // Enforce non-overlap
    const radii = [...initial];
    let prevOuter = radii[0] + clearance[0];
    for (let i = 1; i < radii.length; i++) {
      const desiredInner = prevOuter + buffer;
      const currentInner = radii[i] - clearance[i];
      if (currentInner < desiredInner) {
        radii[i] = desiredInner + clearance[i];
      }
      prevOuter = radii[i] + clearance[i];
    }

    // Speeds normalized to Earth
    const speeds = speedFromAU(defs.map(d => d.AU));

    return defs.map((d, i) => ({
      name: d.name,
      color: d.color,
      r: d.r,
      orbitR: Number(radii[i].toFixed(2)),
      speed: speeds[i],
      phase: i * 0.2,
      ring: !!d.ring,
    }));
  }, []);

  // Derive asteroid belt bounds from Mars and Jupiter to avoid collisions
  const belt = useMemo(() => {
    const mars = planets.find(p => p.name === 'Mars');
    const jup = planets.find(p => p.name === 'Jupiter');
    if (!mars || !jup) return { inner: 1.7, outer: 2.1, count: 420 };
    const margin = 0.12; // empty space beyond each planet's radius
    let inner = mars.orbitR + mars.r + margin;
    let outer = jup.orbitR - jup.r - margin;
    // Ensure a minimum belt width
    if (outer - inner < 0.25) outer = inner + 0.25;
    // Size asteroid count by width for visual density
    const width = Math.max(outer - inner, 0.25);
    const count = Math.round(300 + width * 250);
    return { inner: Number(inner.toFixed(2)), outer: Number(outer.toFixed(2)), count };
  }, [planets]);

  // Per-planet material tuning
  const matParams = useMemo(() => PLANET_MATERIAL, []);

  // Axial tilt (obliquity) in degrees for each planet
  const tiltDeg = useMemo(() => AXIAL_TILT_DEG, []);

  const planetRefs = useRef([]); // refs for planet groups (so rings follow)
  const planetMeshRefs = useRef([]); // refs for planet meshes to self-rotate
  const moonOrbitRef = useRef(); // Earth's moon orbit group

  // Axial rotation rates (rad/s)
  const axialRates = AXIAL_RATES;

  // Precompute circular orbit points for rendering orbit lines (in XZ plane)
  const makeCircle = (radius) => {
    const pts = [];
    const steps = ORBIT_LAYOUT.orbitLineSteps;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      // xz circle; keep y at 0 for top-down view
      pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
    }
    return pts;
  };

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = delta;
    planetRefs.current.forEach((grp, i) => {
      if (!grp) return;
      const p = planets[i];
      const ang = t * p.speed + p.phase;
      const x = center[0] + Math.cos(ang) * p.orbitR;
      const z = center[2] + Math.sin(ang) * p.orbitR;
      grp.position.set(x, center[1], z);
    });
    // planet self-rotation
    planetMeshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const name = planets[i]?.name;
      const rate = axialRates[name] ?? 0.5;
      mesh.rotation.y += rate * dt;
    });
    // Earth's Moon orbit rotation
    if (moonOrbitRef.current) {
      moonOrbitRef.current.rotation.y = t * 3.0;
    }
  });

  return (
    <group>
      {/* Milky Way sky (if provided); renders behind everything */}
      {extra?.milkyway && (
        <mesh scale={-1} position={[center[0], center[1], center[2]]}>
          <sphereGeometry args={[80, 32, 32]} />
          <meshBasicMaterial map={extra.milkyway} side={THREE.BackSide} />
        </mesh>
      )}
      {/* Sun at the system center (slightly right) */}
      <mesh position={[center[0], center[1], center[2]]} castShadow receiveShadow>
        <sphereGeometry args={[SUN.radius, 32, 32]} />
        {/* Use emissive map if available for subtle surface detail */}
        {extra?.sun ? (
          <meshStandardMaterial
            map={extra.sun}
            emissive={SUN.emissiveColor}
            emissiveMap={extra.sun}
            emissiveIntensity={SUN.emissiveIntensity}
            color={SUN.color}
          />
        ) : (
          <meshStandardMaterial emissive={SUN.emissiveColor} emissiveIntensity={SUN.emissiveIntensity * 0.9} color="#ffcc55" />
        )}
      </mesh>
      {/* Strong point light at the Sun for highlights */}
      <pointLight position={[center[0], center[1], center[2]]} intensity={SUN.pointLight.intensity} distance={SUN.pointLight.distance} decay={SUN.pointLight.decay} />

      {/* Orbits and planets */}
      {planets.map((p, i) => (
        <group key={p.name}>
          <Line
            points={makeCircle(p.orbitR).map(([x,y,z]) => [x + center[0], y + center[1], z + center[2]])}
            color="#8e9ad6"
            lineWidth={1}
            transparent
            opacity={0.45}
            dashed
            dashSize={0.2}
            gapSize={0.15}
          />
          <group ref={(el) => (planetRefs.current[i] = el)}>
            {/* Tilt group to apply realistic axial tilt; child mesh spins around tilted axis */}
            <group rotation={[(tiltDeg[p.name] || 0) * Math.PI / 180, 0, 0]}>
              <mesh ref={(el) => (planetMeshRefs.current[i] = el)} castShadow receiveShadow>
                <sphereGeometry args={[p.r, 24, 24]} />
                {useTextures ? (
                  <meshStandardMaterial
                  {...(matParams[p.name] || { roughness: 0.7, metalness: 0.05 })}
                  map={
                    p.name === 'Mercury' ? tex.mercury :
                    p.name === 'Venus' ? tex.venus :
                    p.name === 'Earth' ? tex.earth :
                    p.name === 'Mars' ? tex.mars :
                    p.name === 'Jupiter' ? tex.jupiter :
                    p.name === 'Saturn' ? tex.saturn :
                    p.name === 'Uranus' ? tex.uranus :
                    p.name === 'Neptune' ? tex.neptune : null
                  }
                />
              ) : (
                <meshStandardMaterial
                  color={p.color}
                  {...(matParams[p.name] || { roughness: 0.7, metalness: 0.05 })}
                />
              )}
              </mesh>
              {showEquators && (
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[p.r * 1.02, p.r * 1.05, 64]} />
                  <meshBasicMaterial color="#ffffff" opacity={0.18} transparent />
                </mesh>
              )}
              {/* Earth's Moon inside Earth's tilt group so it follows the tilted axis */}
              {p.name === 'Earth' && (
                <group ref={moonOrbitRef}>
                  <mesh position={[p.r * 2.2, 0, 0]} castShadow receiveShadow>
                    <sphereGeometry args={[0.035, 16, 16]} />
                    {extra?.moon ? (
                      <meshStandardMaterial map={extra.moon} metalness={0.05} roughness={0.9} />
                    ) : (
                      <meshStandardMaterial color="#d0d0d0" metalness={0.05} roughness={0.9} />
                    )}
                  </mesh>
                </group>
              )}
              {p.ring && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0001, 0]} receiveShadow renderOrder={2}>
                  {(() => {
                    const inner = p.r * SATURN_RING.innerFactor;
                    const outer = p.r * SATURN_RING.outerFactor;
                    return (
                      <>
                        <ringGeometry args={[inner, outer, 256]} />
                        {useTextures ? (
                          <shaderMaterial
                            key={`${p.name}-ring-shader`}
                            transparent
                            depthWrite={false}
                            side={THREE.DoubleSide}
                            polygonOffset
                            polygonOffsetFactor={-2}
                            polygonOffsetUnits={-2}
                            uniforms={{
                              uTex: { value: tex.saturnRing },
                              uInner: { value: inner },
                              uOuter: { value: outer },
                              uSwap: { value: tex?.saturnRing?.image && tex.saturnRing.image.height > tex.saturnRing.image.width ? 1.0 : 0.0 },
                            }}
                            vertexShader={`
                              precision mediump float;
                              uniform float uInner;
                              uniform float uOuter;
                              varying vec3 vLocalPos;
                              void main() {
                                vLocalPos = position;
                                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                              }
                            `}
                            fragmentShader={`
                              precision mediump float;
                              uniform sampler2D uTex;
                              uniform float uInner;
                              uniform float uOuter;
                              uniform float uSwap; // 1.0 means swap axes
                              varying vec3 vLocalPos;
                              void main() {
                                float r = length(vLocalPos.xy);
                                float t = (r - uInner) / max(uOuter - uInner, 1e-6);
                                if (t < 0.0 || t > 1.0) discard;
                                vec2 uv = mix(vec2(t, 0.5), vec2(0.5, t), step(0.5, uSwap));
                                vec4 col = texture2D(uTex, uv);
                                if (col.a < 0.01) discard;
                                gl_FragColor = col;
                              }
                            `}
                          />
                        ) : (
                          <meshStandardMaterial color="#d7c8a5" opacity={0.6} transparent side={THREE.DoubleSide} />
                        )}
                      </>
                    );
                  })()}
                </mesh>
              )}
            </group>
          </group>
        </group>
      ))}
      {/* Asteroid belt between Mars and Jupiter, derived from orbits */}
      <AsteroidBelt center={center} inner={belt.inner} outer={belt.outer} count={belt.count} />
    </group>
  );
}

function ParallaxCamera() {
  const { camera } = useThree();
  useEffect(() => {
    // If we have a saved camera state (from interactive), don't override it with parallax.
    const saved = localStorage.getItem('solar_cam_state');
    let active = !saved;
    const onScroll = () => {
      if (!active) return;
      const y = window.scrollY || 0;
      camera.position.z = 3 + Math.min(2, y / 800);
    };
    const onMove = (e) => {
      if (!active) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      camera.position.x = 3.2 + nx * 0.2;
      camera.position.y = 7.0 + ny * 0.2;
    };
    const disableParallax = () => { active = false; };
    window.addEventListener('scroll', onScroll);
    window.addEventListener('mousemove', onMove);
    // When background applies a saved camera, disable parallax adjustments
    window.addEventListener('background3d:setBase', disableParallax);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('background3d:setBase', disableParallax);
    };
  }, [camera]);
  return null;
}

function ApplySavedCameraInteractive({ controlsRef }) {
  const { camera } = useThree();
  useLayoutEffect(() => {
    let raf;
    const apply = () => {
      try {
        const raw = localStorage.getItem('solar_cam_state');
        let pos = DEFAULT_CAM, target = DEFAULT_TARGET;
        if (raw) {
          const data = JSON.parse(raw);
          if (Array.isArray(data.pos) && data.pos.length === 3) pos = data.pos;
          if (Array.isArray(data.target) && data.target.length === 3) target = data.target;
        }
        camera.position.set(pos[0], pos[1], pos[2]);
        if (controlsRef?.current) {
          controlsRef.current.target.set(target[0], target[1], target[2]);
          controlsRef.current.update();
        } else {
          camera.lookAt(target[0], target[1], target[2]);
          // Try again next frame until controls ready to sync target exactly
          raf = requestAnimationFrame(apply);
        }
      } catch {}
    };
    apply();
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [camera, controlsRef]);
  return null;
}

function CameraStateSync({ controlsRef }) {
  const { camera } = useThree();
  const lastPos = useRef([Infinity, Infinity, Infinity]);
  const lastTarget = useRef([Infinity, Infinity, Infinity]);
  const lastTime = useRef(0);
  useEffect(() => {
    // Initial save on mount
    try {
      const pos = camera.position;
      const tgt = controlsRef?.current?.target;
      const data = { pos: [pos.x, pos.y, pos.z], target: tgt ? [tgt.x, tgt.y, tgt.z] : [2.8, 0, -4] };
      localStorage.setItem('solar_cam_state', JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('solar_cam_updated'));
      lastPos.current = data.pos;
      lastTarget.current = data.target;
    } catch {}
    return () => {
      // Final save on unmount
      try {
        const pos = camera.position;
        const tgt = controlsRef?.current?.target;
        const data = { pos: [pos.x, pos.y, pos.z], target: tgt ? [tgt.x, tgt.y, tgt.z] : [2.8, 0, -4] };
        localStorage.setItem('solar_cam_state', JSON.stringify(data));
        window.dispatchEvent(new CustomEvent('solar_cam_updated'));
      } catch {}
    };
  }, [camera, controlsRef]);
  // Per-frame check with throttle so we don't depend on ref-ready event binding
  useFrame((state) => {
    const now = state.clock.elapsedTime;
    if (now - lastTime.current < 0.1) return; // ~10 fps throttle
    lastTime.current = now;
    const p = camera.position;
    const t = controlsRef?.current?.target;
    const pos = [p.x, p.y, p.z];
    const target = t ? [t.x, t.y, t.z] : lastTarget.current;
    const changed =
      Math.hypot(pos[0] - lastPos.current[0], pos[1] - lastPos.current[1], pos[2] - lastPos.current[2]) > 1e-3 ||
      (target && Math.hypot(target[0] - lastTarget.current[0], target[1] - lastTarget.current[1], target[2] - lastTarget.current[2]) > 1e-3);
    if (!changed) return;
    try {
      localStorage.setItem('solar_cam_state', JSON.stringify({ pos, target }));
      window.dispatchEvent(new CustomEvent('solar_cam_updated'));
      lastPos.current = pos;
      lastTarget.current = target;
    } catch {}
  });
  return null;
}

function ApplySavedCamera() {
  const { camera, invalidate } = useThree();
  useLayoutEffect(() => {
    const apply = () => {
      try {
        const raw = localStorage.getItem('solar_cam_state');
        if (!raw) {
          // Apply sensible defaults on first load
          camera.position.set(DEFAULT_CAM[0], DEFAULT_CAM[1], DEFAULT_CAM[2]);
          camera.lookAt(DEFAULT_TARGET[0], DEFAULT_TARGET[1], DEFAULT_TARGET[2]);
        } else {
          const data = JSON.parse(raw);
          if (Array.isArray(data.pos) && data.pos.length === 3) {
            camera.position.set(data.pos[0], data.pos[1], data.pos[2]);
          }
          if (Array.isArray(data.target) && data.target.length === 3) {
            camera.lookAt(data.target[0], data.target[1], data.target[2]);
          }
        }
        camera.updateProjectionMatrix();
        // Ensure a render occurs after applying
        if (invalidate) invalidate();
        window.dispatchEvent(new CustomEvent('background3d:setBase'));
        // Re-apply on next tick as well to cover late unmount saves
        setTimeout(() => {
          try {
            const raw2 = localStorage.getItem('solar_cam_state');
            if (!raw2) {
              camera.position.set(DEFAULT_CAM[0], DEFAULT_CAM[1], DEFAULT_CAM[2]);
              camera.lookAt(DEFAULT_TARGET[0], DEFAULT_TARGET[1], DEFAULT_TARGET[2]);
            } else {
              const data2 = JSON.parse(raw2);
              if (Array.isArray(data2.pos) && data2.pos.length === 3) {
                camera.position.set(data2.pos[0], data2.pos[1], data2.pos[2]);
              }
              if (Array.isArray(data2.target) && data2.target.length === 3) {
                camera.lookAt(data2.target[0], data2.target[1], data2.target[2]);
              }
            }
            camera.updateProjectionMatrix();
            if (invalidate) invalidate();
          } catch {}
        }, 0);
      } catch {}
    };
    // Apply on mount and on any updates dispatched from interactive view
    apply();
    const onUpdate = () => apply();
    window.addEventListener('solar_cam_updated', onUpdate);
    return () => window.removeEventListener('solar_cam_updated', onUpdate);
  }, [camera]);
  return null;
}

export default function Background3D({ mode = 'background' }) {
  const controlsRef = useRef();
  const [texturesReady, setTexturesReady] = useState(false);

  // Preload all texture assets; render flat first, then switch to textures when all are loaded
  useEffect(() => {
    let canceled = false;
    const required = [
      '/textures/planets/mercury.jpg',
      '/textures/planets/venus.jpg',
      '/textures/planets/earth.jpg',
      '/textures/planets/mars.jpg',
      '/textures/planets/jupiter.jpg',
      '/textures/planets/saturn.jpg',
      '/textures/planets/uranus.jpg',
      '/textures/planets/neptune.jpg',
      '/textures/planets/saturn_ring.png',
    ];
    const optional = ['/textures/sun.jpg', '/textures/moon.jpg', '/textures/milkyway.jpg'];
    const loadImage = (src) => new Promise((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(true);
      im.onerror = () => reject(new Error('fail ' + src));
      im.src = src;
    });
    // Load required planet textures. Optional extras don't block readiness.
    Promise.all(required.map(loadImage))
      .then(() => { if (!canceled) setTexturesReady(true); })
      .catch(() => { if (!canceled) setTexturesReady(false); });
    // Fire optional loads but ignore outcome
    optional.forEach((u) => loadImage(u).catch(() => {}));
    return () => { canceled = true; };
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: mode === 'interactive' ? 50 : 0, pointerEvents: mode === 'interactive' ? 'auto' : 'none' }}>
      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        gl={{ physicallyCorrectLights: true }}
        camera={{ position: DEFAULT_CAM, fov: CAMERA.fov }}
      >
        {/* Always-visible scene elements */}
        <color attach="background" args={["#0B0B12"]} />
        <hemisphereLight args={[LIGHTS.hemi.sky, LIGHTS.hemi.ground, LIGHTS.hemi.intensity]} />
        <ambientLight intensity={LIGHTS.ambient.intensity} />
        <directionalLight
          position={LIGHTS.dir.position}
          intensity={LIGHTS.dir.intensity}
          castShadow
          shadow-mapSize-width={LIGHTS.dir.shadow.mapSize}
          shadow-mapSize-height={LIGHTS.dir.shadow.mapSize}
          shadow-bias={LIGHTS.dir.shadow.bias}
        />
        <Stars radius={STARS_CONST.radius} depth={STARS_CONST.depth} count={STARS_CONST.count} factor={STARS_CONST.factor} saturation={STARS_CONST.saturation} fade={STARS_CONST.fade} speed={STARS_CONST.speed} />
        <Comets small={mode !== 'interactive'} />
        {mode === 'background' && <ApplySavedCamera />}
        {/* Load textured planets lazily; show non-textured until all images preloaded */}
        {mode === 'interactive' ? (
          <Suspense fallback={<SolarSystem useTextures={false} showEquators={false} />}>
            <SolarSystem useTextures={texturesReady} showEquators={false} />
          </Suspense>
        ) : (
          <SolarSystem useTextures={texturesReady} showEquators={false} />
        )}
        {mode === 'interactive' && <ApplySavedCameraInteractive controlsRef={controlsRef} />}
        {mode === 'interactive' && (
          <OrbitControls ref={controlsRef} makeDefault target={ORBIT_CONTROLS.target} enablePan={ORBIT_CONTROLS.enablePan} enableDamping dampingFactor={ORBIT_CONTROLS.dampingFactor} rotateSpeed={ORBIT_CONTROLS.rotateSpeed} zoomSpeed={ORBIT_CONTROLS.zoomSpeed} minDistance={ORBIT_CONTROLS.minDistance} maxDistance={ORBIT_CONTROLS.maxDistance} minPolarAngle={ORBIT_CONTROLS.minPolarAngle} maxPolarAngle={ORBIT_CONTROLS.maxPolarAngle} />
        )}
        {mode === 'interactive' && <CameraStateSync controlsRef={controlsRef} />}
        <EffectComposer>
          <Bloom
            intensity={mode === 'interactive' ? BLOOM_CONST.intensityInteractive : BLOOM_CONST.intensityBackground}
            luminanceThreshold={BLOOM_CONST.luminanceThreshold}
            luminanceSmoothing={BLOOM_CONST.luminanceSmoothing}
            mipmapBlur
            radius={BLOOM_CONST.radius}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
