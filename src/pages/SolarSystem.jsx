import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import SolarSystemGuide from '../components/SolarSystemGuide';
import useSEO from '../hooks/useSEO';
import { trackEvent } from '../utils/analytics';
import { solarAudio } from '../utils/audioManager';

const STORAGE_KEY = 'hasSeenSolarSystemGuide';

export default function SolarSystem() {
    const [showGuide, setShowGuide] = useState(false);

    useSEO({
        title: '3D Solar System',
        description: 'Explore an interactive 3D solar system visualization.',
        canonical: '/solar-system',
    });

    // Check if user has seen the guide before
    useEffect(() => {
        const hasSeenGuide = localStorage.getItem(STORAGE_KEY);
        if (!hasSeenGuide) {
            // Show guide after a short delay for better UX
            const timer = setTimeout(() => {
                setShowGuide(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, []);

    // Handle music playback - music should already be playing from navbar click
    // Just ensure it's playing and stop on unmount
    useEffect(() => {
        // Ensure music is playing (in case user navigated directly via URL)
        solarAudio.play();

        return () => {
            // Stop music when leaving the page
            solarAudio.stop();
        };
    }, []);

    const handleCloseGuide = () => {
        setShowGuide(false);
        localStorage.setItem(STORAGE_KEY, 'true');
        trackEvent('solar_guide_completed');
    };

    const handleOpenGuide = () => {
        setShowGuide(true);
        trackEvent('solar_guide_reopened');
    };

    return (
        <>
            <Box sx={{ position: 'fixed', inset: 0, zIndex: 100, height: 'fit-content' }}>
                <Navbar variant="solar" onGuideClick={handleOpenGuide} />
            </Box>

            {/* Interaction Guide Modal */}
            <SolarSystemGuide
                open={showGuide}
                onClose={handleCloseGuide}
                showCloseButton={localStorage.getItem(STORAGE_KEY) === 'true'}
            />
        </>
    );
}
