import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import SolarSystem from './pages/SolarSystem';
import NotFound from './pages/NotFound';
import Background3D from './components/Background3D';
import { initGA, startEngagementTracking, initClickTracking, trackPageView } from './utils/analytics';

function ScrollToHashElement() {
  const location = useLocation();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Remove invalid hash from URL without page reload
      const cleanUrl = window.location.pathname + window.location.search;
      window.history.replaceState(null, '', cleanUrl);
    }
  }, [location]);

  return null;
}

export default function App() {
  const location = useLocation();
  const isSolarSystem = location.pathname === '/solar-system';

  useEffect(() => {
    initGA();
    startEngagementTracking();
    initClickTracking();
  }, []);

  useEffect(() => {
    trackPageView();
  }, [location]);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Persistent solar system background - skip for solar-system page which has its own */}
      <Background3D mode={isSolarSystem ? 'interactive' : 'background'} />

      {/* Page content layer */}
      <Box sx={{ position: 'relative', zIndex: isSolarSystem ? 'auto' : 1 }}>
        <ScrollToHashElement />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/solar-system" element={<SolarSystem />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
  );
}
