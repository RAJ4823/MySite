import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import { initGA, startEngagementTracking, initClickTracking, trackPageView } from './analytics';

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

  useEffect(() => {
    initGA();
    startEngagementTracking();
    initClickTracking();
  }, []);

  useEffect(() => {
    trackPageView();
  }, [location]);

  return (
    <>
      <ScrollToHashElement />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
