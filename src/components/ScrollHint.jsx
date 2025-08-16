import { useEffect, useRef, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ScrollHint() {
  const [show, setShow] = useState(false);
  const lastScroll = useRef(typeof window !== 'undefined' ? window.scrollY : 0);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 2500);
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastScroll.current) > 10 || y > 40) setShow(false);
      lastScroll.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  if (!show) return null;

  const handleClick = () => {
    const about = document.getElementById('about');
    if (about) about.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Box onClick={handleClick} sx={{
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      mt: 4
    }}>
      <Box sx={{
        position: 'absolute',
        bottom: -12,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        color: 'rgba(255,255,255,0.8)',
        cursor: 'pointer',
        animation: 'floatY 1.6s ease-in-out infinite',
        zIndex: 2
      }}>
        <Typography variant="body2">Scroll down</Typography>
        <KeyboardArrowDownIcon />
      </Box>
      <style>{`
        @keyframes floatY { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(6px);} }
      `}</style>
    </Box>
  );
}
