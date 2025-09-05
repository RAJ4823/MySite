import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useCallback } from 'react';
import Box from '@mui/material/Box';

const pages = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  // { label: 'Education', id: 'education' },
  { label: 'Experience', id: 'experience' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
];

export default function Navbar({ overlay = false, onBack, onOpenSolar }) {
  const go = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      // Update URL without page reload
      window.history.pushState({}, '', `#${id}`);
      // Smooth scroll to element
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }, []);
  return (
    <AppBar position="sticky" color="transparent" sx={{ backdropFilter: 'blur(10px)', bgcolor: 'rgba(18,18,26,0.6)', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          {!overlay && (
            <IconButton size="large" edge="start" color="inherit" sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}
          <div onClick={() => go('home')} style={{ cursor: 'pointer', flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="/mylogo/purple_logo.png"
              alt="Logo"
              sx={{
                height: 80,
                margin: '-10px',
                cursor: 'pointer',
                filter: 'contrast(1.2) brightness(1.2)',
                '&:hover': {
                  opacity: 0.8,
                  transition: 'opacity 0.2s ease-in-out',
                  filter: 'contrast(1.5) brightness(1.5)',
                },
              }}
            />
          </div>
          {!overlay && pages.map((p) => (
            <Button key={p.id} color="inherit" onClick={() => go(p.id)} sx={{ fontWeight: 600 }}>
              {p.label}
            </Button>
          ))}
          {!overlay && onOpenSolar && (
            <Button variant="contained" color="secondary" onClick={onOpenSolar} sx={{ fontWeight: 700, ml: 1 }}>
              View Solar System
            </Button>
          )}
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
