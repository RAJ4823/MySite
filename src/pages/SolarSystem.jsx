import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import useSEO from '../hooks/useSEO';

export default function SolarSystem() {
    useSEO({
        title: '3D Solar System',
        description: 'Explore an interactive 3D solar system visualization.',
        canonical: '/solar-system',
    });

    return (
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 100, height: 'fit-content' }}>
            <Navbar variant="solar" />
        </Box>
    );
}
