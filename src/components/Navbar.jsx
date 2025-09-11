import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const pages = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  // { label: 'Education', id: 'education' },
  { label: 'Experience', id: 'experience' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
];

export default function Navbar({ overlay = false, onBack, onOpenSolar }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const go = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      // Update URL with hash
      if (window.history.pushState) {
        const newUrl = `${window.location.pathname}${window.location.search}#${id}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
      } else {
        window.location.hash = `#${id}`;
      }
      // Smooth scroll to element
      el.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  }, []);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuCloseAndGo = (id) => {
    setAnchorEl(null);
    if (id) go(id);
  };

  return (
    <AppBar position="sticky" color="transparent" sx={{ backdropFilter: 'blur(10px)', bgcolor: 'rgba(18,18,26,0.6)', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          {/* Logo - always left */}
          <div onClick={() => go('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="/images/logo/purple_logo.png"
              alt="Logo"
              sx={{
                height: { xs: 56, sm: 72, md: 80 },
                margin: { xs: '-6px', sm: '-8px', md: '-10px' },
                cursor: 'pointer',
                filter: 'contrast(1) saturate(4)',
                '&:hover': {
                  opacity: 0.8,
                  transition: 'opacity 0.2s ease-in-out',
                },
              }}
            />
          </div>
          {/* Spacer to push actions to right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop nav buttons */}
          {!overlay && (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {pages.map((p) => (
                <Button key={p.id} color="inherit" onClick={() => go(p.id)} sx={{ fontWeight: 600 }}>
                  {p.label}
                </Button>
              ))}
              {onOpenSolar && (
                <Button variant="contained" color="secondary" onClick={onOpenSolar} sx={{ fontWeight: 700, ml: 1 }}>
                  View Solar System
                </Button>
              )}
            </Box>
          )}

          {/* Mobile menu icon + simple Menu popup */}
          {!overlay && (
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                color="inherit"
                aria-label={menuOpen ? 'close navigation menu' : 'open navigation menu'}
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="nav-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                MenuListProps={{ dense: true }}
              >
                {pages.map((p) => (
                  <MenuItem key={p.id} onClick={() => handleMenuCloseAndGo(p.id)}>
                    {p.label}
                  </MenuItem>
                ))}
                {onOpenSolar && (
                  <Box sx={{ px: 1.5, py: 1 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => { setAnchorEl(null); onOpenSolar?.(); }}
                      fullWidth
                      sx={{ fontWeight: 700 }}
                    >
                      View Solar System
                    </Button>
                  </Box>
                )}
              </Menu>
            </Box>
          )}

          {/* Overlay back button (always right) */}
          {overlay && (
            <Button variant="contained" color="secondary" onClick={onBack} sx={{ fontWeight: 700 }}>
              Back to main page
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
