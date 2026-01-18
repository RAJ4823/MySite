import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { keyframes, useMediaQuery } from '@mui/system';
import { trackEvent } from '../utils/analytics';
import { FEATURED_PROJECT } from '../data/featuredProject';

// Subtle float animation
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;

// Glow pulse animation
const glowPulse = (color) => keyframes`
  0%, 100% { box-shadow: 0 0 15px ${color}4D, 0 4px 20px rgba(0, 0, 0, 0.3); }
  50% { box-shadow: 0 0 25px ${color}66, 0 6px 25px rgba(0, 0, 0, 0.4); }
`;

// Shine effect
const shineAnimation = keyframes`
  0% { left: -100%; }
  100% { left: 200%; }
`;

export default function FeaturedProjectNotification() {
    const [isVisible, setIsVisible] = useState(true);
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));
    // Return null if no featured project data exists
    if (!FEATURED_PROJECT || !FEATURED_PROJECT.key || !FEATURED_PROJECT.title) {
        return null;
    }

    const { title, tagline, description, url, logo, accentColor } = FEATURED_PROJECT;

    const handleClick = () => {
        trackEvent('featured_project_click', { project: FEATURED_PROJECT.key, location: 'home_notification' });
        window.open(url, '_blank', 'noopener');
    };

    const handleClose = (e) => {
        e.stopPropagation();
        trackEvent('featured_project_dismiss', { project: FEATURED_PROJECT.key });
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <Box
            onClick={handleClick}
            sx={{
                position: 'absolute',
                // Mobile: top center | Desktop: right side
                left: 'auto',
                right: { xs: 0, md: 24 },
                top: { xs: 12, md: 'auto' },
                transform: 'translateX(-50%)',
                // Responsive width
                width: { xs: '100%', sm: 280, md: 280 },
                cursor: 'pointer',
                zIndex: 10,
                animation: `${floatAnimation} 4s ease-in-out infinite, ${glowPulse(accentColor)} 3s ease-in-out infinite`,
                borderRadius: 1.5,
                overflow: 'hidden',
                background: 'linear-gradient(145deg, rgba(30, 25, 35, 0.75), rgba(20, 18, 25, 0.75))',
                border: `1px solid ${accentColor}4D`,
                backdropFilter: 'blur(12px)',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                '&:hover': {
                    transform: { xs: 'translateX(-50%) scale(1.02)', md: 'scale(1.02)' },
                    borderColor: `${accentColor}99`,
                    '& .shine-effect': {
                        animation: `${shineAnimation} 0.8s ease-in-out`,
                    },
                },
                // Top accent line
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: { xs: 2, md: 3 },
                    background: `linear-gradient(90deg, ${accentColor}, ${accentColor}CC, ${accentColor})`,
                },
            }}
        >
            {/* Shine effect overlay */}
            <Box
                className="shine-effect"
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                    transform: 'skewX(-20deg)',
                    pointerEvents: 'none',
                }}
            />

            {/* Close button */}
            <IconButton
                onClick={handleClose}
                size="small"
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 2,
                    color: 'rgba(255,255,255,0.5)',
                    bgcolor: 'rgba(0,0,0,0.3)',
                    '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'rgba(255,255,255,0.8)',
                    },
                    width: 24,
                    height: 24,
                }}
            >
                <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>

            {/* Badge */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 0.75,
                    bgcolor: accentColor,
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 40,
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        color: '#fff',
                        lineHeight: 1,
                    }}
                >
                    {isMobile ? 'CHECKOUT MY LATEST PROJECT' : 'NEW'}
                </Typography>
            </Box>


            {/* Content */}
            <Box sx={{ p: 2, pt: { xs: 2, sm: 2.5 } }}>
                {/* Logo - Hidden on mobile */}
                {logo && (
                    <Box
                        sx={{
                            display: { xs: 'none', sm: 'flex' },
                            width: '100%',
                            mb: 1.5,
                            borderRadius: 1,
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #2a2a2a, #1a1a1a)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <img
                            src={`${import.meta.env.VITE_BASE_URL || '/'}${logo}`}
                            alt={`${title} Logo`}
                            loading="lazy"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                            }}
                        />
                    </Box>
                )}

                {/* Tagline */}
                {tagline && (
                    <Typography
                        variant="overline"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            color: accentColor,
                            fontSize: '0.65rem',
                            letterSpacing: 1.5,
                            mb: 0.5,
                            mt: { xs: 3, sm: 0 },
                        }}
                    >
                        {tagline}
                    </Typography>
                )}

                {/* Title */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        color: '#fff',
                        mb: { xs: 0, sm: 0.5 },
                        mt: { xs: 2.5, sm: 0 },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    {title}
                    <OpenInNewIcon sx={{ fontSize: 14, opacity: 0.6 }} />
                </Typography>

                {/* Description - Hidden on mobile */}
                {description && (
                    <Typography
                        variant="body2"
                        sx={{
                            display: 'block',
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '0.8rem',
                            lineHeight: 1.4,
                        }}
                    >
                        {description}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
