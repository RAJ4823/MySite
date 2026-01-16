import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { trackEvent } from '../utils/analytics';

// Section navigation items for home page
const homeSections = [
  { label: 'About', id: 'about' },
  { label: 'Experience', id: 'experience' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
];

/**
 * Unified Navbar component with optional secondary section navigation
 * @param {string} variant - 'home' | 'solar' | 'blogs' | 'blogDetail'
 */
export default function Navbar({ variant = 'home' }) {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  // Auto-detect variant based on route if not specified
  const getVariant = () => {
    if (variant !== 'home') return variant;
    if (location.pathname === '/solar-system') return 'solar';
    if (location.pathname.startsWith('/blogs/') && location.pathname !== '/blogs') return 'blogDetail';
    if (location.pathname === '/blogs') return 'blogs';
    return 'home';
  };

  const currentVariant = getVariant();
  const isHome = currentVariant === 'home';

  const scrollTo = useCallback((id) => {
    trackEvent('nav_click', { section: 'navbar', label: id });
    const el = document.getElementById(id);
    if (el) {
      if (window.history.pushState) {
        const newUrl = `${window.location.pathname}${window.location.search}#${id}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
      } else {
        window.location.hash = `#${id}`;
      }
      el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }, []);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleMenuCloseAndGo = (id) => {
    setAnchorEl(null);
    if (id) scrollTo(id);
  };

  // Render back button for non-home variants
  const renderBackButton = () => {
    if (currentVariant === 'solar' || currentVariant === 'blogs') {
      return (
        <>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackIcon />}
            color="inherit"
            sx={{
              fontWeight: 600,
              '&:hover': {
                color: 'primary.light',
                bgcolor: 'rgba(124,58,237,0.1)',
              },
            }}
            onClick={() => trackEvent('nav_click', { section: 'navbar', label: 'back_home' })}
          >
            Home
          </Button>
        </>
      );
    }
    if (currentVariant === 'blogDetail') {
      return (
        <>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            component={Link}
            to="/blogs"
            startIcon={<ArrowBackIcon />}
            color="inherit"
            sx={{
              fontWeight: 600,
              '&:hover': {
                color: 'primary.light',
                bgcolor: 'rgba(124,58,237,0.1)',
              },
            }}
            onClick={() => trackEvent('nav_click', { section: 'navbar', label: 'back_blogs' })}
          >
            All Blogs
          </Button>
        </>
      );
    }
    return null;
  };

  // Render main nav (Blogs, Solar System) - right side
  const renderMainNav = () => (
    <>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
        {homeSections.map((p) => (
          <Button
            key={p.id}
            color="inherit"
            size="small"
            href={`#${p.id}`}
            onClick={(e) => { e.preventDefault(); scrollTo(p.id); }}
            sx={{
              fontWeight: 500,
              fontSize: '0.9rem',
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.light',
                bgcolor: 'rgba(124,58,237,0.1)',
              },
            }}
          >
            {p.label}
          </Button>
        ))}
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {/* Desktop: Blogs & Solar System */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, md: 1 } }}>
        <Button
          component={Link}
          to="/blogs"
          color="inherit"
          sx={{
            fontWeight: 600,
            '&:hover': {
              color: 'primary.light',
              bgcolor: 'rgba(124,58,237,0.1)',
            },
          }}
          onClick={() => trackEvent('nav_click', { section: 'navbar', label: 'blogs' })}
        >
          Blogs
        </Button>
        <Button
          component={Link}
          to="/solar-system"
          color="inherit"
          sx={{
            fontWeight: 600,
            '&:hover': {
              color: 'primary.light',
              bgcolor: 'rgba(124,58,237,0.1)',
            },
          }}
          onClick={() => trackEvent('nav_click', { section: 'navbar', label: 'solar_system' })}
        >
          Solar System
        </Button>
      </Box>

      {/* Mobile: Menu for sections */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 0.5 }}>
        <IconButton
          size="small"
          color="inherit"
          aria-label={menuOpen ? 'close menu' : 'open menu'}
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="nav-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          keepMounted
          MenuListProps={{ dense: true }}
        >
          {homeSections.map((p) => (
            <MenuItem key={p.id} onClick={() => handleMenuCloseAndGo(p.id)} sx={{
              fontWeight: 500,
              fontSize: '0.9rem',
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.light',
              }
            }}>
              {p.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </>
  );

  return (
    <AppBar
      position="sticky"
      color="transparent"
      sx={{
        backdropFilter: 'blur(10px)',
        bgcolor: 'rgba(18,18,26,0.6)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Main navbar */}
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: { xs: 1, md: 2 }, minHeight: { xs: 56, md: 64 } }}>
          {/* Logo - always links to home */}
          <Link
            to="/"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            onClick={() => trackEvent('nav_click', { section: 'navbar', label: 'logo' })}
          >
            <Box
              component="img"
              src={`${import.meta.env.VITE_BASE_URL || '/'}images/logo/purple_logo.png`}
              alt="Logo"
              sx={{
                height: { xs: 48, sm: 60, md: 70 },
                margin: { xs: '-4px', sm: '-6px', md: '-8px' },
                cursor: 'pointer',
                filter: 'contrast(1) saturate(4)',
                '&:hover': {
                  opacity: 0.8,
                  transition: 'opacity 0.2s ease-in-out',
                },
              }}
            />
          </Link>

          {/* Navigation based on variant */}
          {isHome ? renderMainNav() : renderBackButton()}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
