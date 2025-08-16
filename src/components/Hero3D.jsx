import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, Stars } from '@react-three/drei';
import Box from '@mui/material/Box';

function FloatingShapes() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-1.2, 0.4, 0]}>
          <icosahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#7C3AED" metalness={0.4} roughness={0.2} />
        </mesh>
      </Float>
      <Float speed={1.2} rotationIntensity={1} floatIntensity={1.5}>
        <mesh position={[1.1, -0.2, 0]}>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#B794F4" metalness={0.2} roughness={0.4} />
        </mesh>
      </Float>
    </>
  );
}

export default function Hero3D() {
  return (
    <Box sx={{ height: 360, borderRadius: 3, overflow: 'hidden', bgcolor: 'rgba(124, 58, 237, 0.06)', border: '1px solid', borderColor: 'divider' }}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1} />
        <Stars radius={30} depth={50} count={1500} factor={4} saturation={0} fade speed={0.8} />
        <FloatingShapes />
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </Box>
  );
}
