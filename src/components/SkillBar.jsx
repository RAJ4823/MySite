import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function SkillBar({ label, value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start({ width: `${value}%` });
  }, [inView, value, controls]);

  return (
    <Box sx={{ mb: 2 }} ref={ref}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{label}</Typography>
        <Typography variant="body2" color="text.secondary">{value}%</Typography>
      </Box>
      <Box sx={{ height: 8, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.07)', overflow: 'hidden', position: 'relative' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={controls}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #7C3AED, #B794F4)' }}
        />
      </Box>
    </Box>
  );
}
