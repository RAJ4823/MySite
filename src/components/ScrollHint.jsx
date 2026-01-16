import { useEffect, useState, useCallback, useRef } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Typography } from '@mui/material';
import { trackEvent } from '../utils/analytics';

const SCROLL_THRESHOLD = 100; // Pixels to scroll before hiding the hint
const FIRST_VISIT_DELAY = 10000; // 10 seconds for first visit
const SUBSEQUENT_VISIT_DELAY = 30000; // 30 seconds for subsequent visits
const STORAGE_KEY = 'hasSeenScrollHint';

export default function ScrollHint() {
  const [isVisible, setIsVisible] = useState(false);
  const scrollTimeout = useRef(null);

  const scrollToAbout = useCallback(() => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsVisible(false);
    trackEvent('scroll_hint_click', { section: 'home' });
  }, []);

  useEffect(() => {
    // Check if user has seen the hint before
    const hasSeenHint = localStorage.getItem(STORAGE_KEY) === 'true';
    const delay = hasSeenHint ? SUBSEQUENT_VISIT_DELAY : FIRST_VISIT_DELAY;

    // Set timeout to show the hint
    scrollTimeout.current = setTimeout(() => {
      setIsVisible(true);
      localStorage.setItem(STORAGE_KEY, 'true');
    }, delay);

    const handleScroll = () => {
      // Hide the hint when user scrolls down past the threshold
      if (window.scrollY > SCROLL_THRESHOLD) {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  if (!isVisible) return null;


  return (
    <Box
      component="div"
      onClick={scrollToAbout}
      sx={{
        position: 'absolute',
        bottom: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100000,
        cursor: 'pointer',
        padding: '8px 16px',
        backgroundColor: 'rgba(30, 30, 30, 0.3)',
        borderRadius: '24px',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '150px',
        '&:hover': {
          backgroundColor: 'rgba(50, 50, 50, 0.5)',
          transform: 'translateX(-50%) translateY(-2px)',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1px',
          color: 'rgba(255,255,255)',
          cursor: 'pointer',
          animation: 'floatY 1.6s ease-in-out infinite',
          width: '100%',
          height: '100%'
        }}
      >
        <Typography variant="overline" sx={{ lineHeight: 1 }}>Scroll down</Typography>
        <KeyboardArrowDownIcon sx={{ fontSize: '1.5rem' }} />
      </Box>
      <style>{`
        @keyframes floatY { 
          0%, 100% { transform: translateY(-2px); } 
          50% { transform: translateY(2px); } 
        }
      `}</style>
    </Box>
  );
}
