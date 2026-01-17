import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import MouseIcon from '@mui/icons-material/Mouse';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { trackEvent } from '../utils/analytics';

export default function SolarSystemGuide({ open, onClose, showCloseButton = true }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (open) {
            trackEvent('solar_guide_open');
        }
    }, [open]);

    if (!open) return null;

    const handleClose = () => {
        trackEvent('solar_guide_close');
        onClose();
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                inset: 0,
                zIndex: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(2,2,6,0.05)',
                p: 2,
            }}
            onClick={showCloseButton ? undefined : handleClose}
        >
            <Box
                sx={{
                    position: 'relative',
                    maxWidth: 500,
                    width: '100%',
                    p: { xs: 2, md: 3 },
                    borderRadius: 2,
                    bgcolor: 'rgba(16,14,24,0.95)',
                    border: '1px solid rgba(124,58,237,0.4)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 20px 60px rgba(124,58,237,0.3)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #9F67F6 0%, #7C3AED 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        How to Interact?
                    </Typography>

                    {showCloseButton && (
                        <IconButton
                            onClick={handleClose}
                            sx={{
                                color: 'rgba(255,255,255,0.7)',
                                '&:hover': {
                                    bgcolor: 'rgba(124,58,237,0.2)',
                                    color: 'white',
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    )}
                </Box>


                {/* Instructions */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Rotate */}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: 'rgba(124,58,237,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: 56,
                                height: 56,
                            }}
                        >
                            {isMobile ? (
                                <TouchAppIcon sx={{ fontSize: 28, color: 'primary.light' }} />
                            ) : (
                                <MouseIcon sx={{ fontSize: 28, color: 'primary.light' }} />
                            )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Rotate View
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {isMobile
                                    ? 'Touch and drag to rotate the view around the solar system'
                                    : 'Click and drag to rotate the view around the solar system'}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Zoom */}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: 'rgba(124,58,237,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: 56,
                                height: 56,
                                gap: 0.5,
                            }}
                        >
                            <ZoomInIcon sx={{ fontSize: 20, color: 'primary.light' }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Zoom In/Out
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {isMobile
                                    ? 'Pinch with two fingers to zoom in and out'
                                    : 'Use mouse wheel or trackpad scroll to zoom in and out'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Got it button */}
                {!showCloseButton && (
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        onClick={handleClose}
                        sx={{
                            mt: 4,
                            fontWeight: 700,
                            py: 1.5,
                            boxShadow: '0 8px 20px rgba(124,58,237,0.4)',
                        }}
                    >
                        Got it!
                    </Button>
                )}
            </Box>
        </Box>
    );
}
