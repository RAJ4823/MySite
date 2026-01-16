import { Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import HomeIcon from '@mui/icons-material/Home';
import PublicIcon from '@mui/icons-material/Public';
import ArticleIcon from '@mui/icons-material/Article';
import Navbar from '../components/Navbar';
import useSEO from '../hooks/useSEO';

export default function NotFound() {
    const location = useLocation();

    useSEO({
        title: '404 - Lost in Space',
        description: 'The page you are looking for does not exist or is still being discovered.',
        noindex: true,
    });

    return (
        <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
            <Navbar />

            <Container maxWidth="md" sx={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                py: 4,
            }}>
                {/* 404 Number with glow effect */}
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: { xs: '5rem', md: '8rem' },
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #9F67F6 0%, #7C3AED 50%, #5B21B6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 40px rgba(124,58,237,0.5)',
                        mb: 1,
                    }}
                >
                    404
                </Typography>

                {/* Title */}
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                        fontSize: { xs: '1.5rem', md: '2.5rem' },
                    }}
                >
                    Lost in Space
                </Typography>

                {/* Description */}
                <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 2, maxWidth: 500 }}
                >
                    The destination you're looking for doesn't exist or is still being discovered by our space explorers.
                </Typography>

                {/* Show attempted path */}
                <Box
                    sx={{
                        px: 3,
                        py: 1.5,
                        mb: 4,
                        borderRadius: 2,
                        bgcolor: 'rgba(124,58,237,0.3)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(124,58,237,0.3)',
                        maxWidth: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{ mb: 0.5 }}
                    >
                        Attempted route:
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: 'monospace',
                            wordBreak: 'break-all',
                        }}
                    >
                        {location.pathname}
                    </Typography>
                </Box>

                {/* Navigation Buttons */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        mt: 5
                    }}
                >
                    <Button
                        component={Link}
                        to="/"
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<HomeIcon />}
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontWeight: 700,
                            borderRadius: 2,
                            borderWidth: 2,
                            '&:hover': {
                                borderWidth: 2,
                            },
                        }}
                    >
                        Back to Home
                    </Button>

                    <Button
                        component={Link}
                        to="/solar-system"
                        variant="outlined"
                        color="secondary"
                        size="large"
                        startIcon={<PublicIcon />}
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontWeight: 700,
                            borderRadius: 2,
                            borderWidth: 2,
                            '&:hover': {
                                borderWidth: 2,
                            },
                        }}
                    >
                        Explore Solar System
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
