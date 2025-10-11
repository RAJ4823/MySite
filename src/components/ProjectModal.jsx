import { memo, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// Optimized image component with lazy loading
const LazyImage = memo(({ src, alt }) => (
  <Box sx={{ 
    position: 'relative', 
    width: '100%', 
    aspectRatio: '16 / 9',
    background: 'linear-gradient(135deg,#2a2345,#14121f)',
    borderRadius: 1,
    overflow: 'hidden',
    marginTop: 1
  }}>
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        background: 'rgba(0,0,0,0.2)',
        transition: 'opacity 0.3s ease-in-out',
        opacity: 0,
      }}
      onLoad={(e) => {
        e.target.style.opacity = 1;
      }}
      onError={(e) => { 
        e.target.style.display = 'none';
      }}
    />
  </Box>
));

// Styled components for better performance
const StyledDialog = styled(Dialog)({
  '& .MuiDialog-container': {
    backdropFilter: 'blur(6px)',
    backgroundColor: 'rgba(2,2,6,0.6)',
    '& .MuiPaper-root': {
      background: 'radial-gradient(1200px 600px at 10% -10%, rgba(85,70,180,0.15), transparent), rgba(10,10,16,0.96)',
      backdropFilter: 'blur(8px)',
      borderRadius: 15,
      border: '1px solid rgba(120,120,255,0.2)',
      boxShadow: '0 10px 40px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.03)',
      animation: 'fadeIn 0.2s ease-out forwards',
      '&.MuiDialog-paper': {
        margin: 12,
        width: 'min(94vw, 760px)',
        maxHeight: 'calc(100% - 24px)',
      },
      // Force near-full width on small screens
      '@media (max-width:600px)': {
        '&.MuiDialog-paper': {
          margin: 8,
          width: 'calc(100vw - 16px)',
          maxWidth: 'unset',
        },
      },
    },
  },
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes fadeOut': {
    '0%': { opacity: 1, transform: 'translateY(0)' },
    '100%': { opacity: 0, transform: 'translateY(20px)' },
  },
});

const ProjectModal = memo(({ open, onClose, projectKey, project }) => {
  const dialogRef = useRef(null);
  const isClosing = useRef(false);

  useEffect(() => {
    if (open) {
      isClosing.current = false;
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        if (!isClosing.current) {
          document.body.style.overflow = 'auto';
        }
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  if (!project) return null;
  const imgSrc = `${import.meta.env.VITE_BASE_URL || '/'}images/portfolio/${projectKey}.jpg`;

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      isClosing.current = true;
      const dialog = dialogRef.current?.querySelector('.MuiDialog-paper');
      if (dialog) {
        dialog.style.animation = 'fadeOut 0.2s forwards';
      }
      setTimeout(() => {
        onClose();
      }, 200);
    } else {
      onClose();
    }
  };

  return (
    <StyledDialog
      ref={dialogRef}
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullWidth
      transitionDuration={200}
      disableScrollLock={false}
      className="modal-content"
    >
      <DialogTitle sx={{ pr: 6, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.3 }}>{project.title}</Typography>
        <IconButton 
          onClick={(e) => {
            isClosing.current = true;
            const dialog = dialogRef.current?.querySelector('.MuiDialog-paper');
            if (dialog) {
              dialog.style.animation = 'fadeOut 0.2s forwards';
            }
            setTimeout(() => {
              onClose();
            }, 200);
          }} 
          sx={{ position: 'absolute', right: 8, top: 8 }} 
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 0.5 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 2.5,
          pt: 0.5,
          '& > *': {
            minWidth: 0, // Prevent flex items from overflowing
          }
        }}>
          <Box sx={{ flex: 2, minWidth: 0, flexShrink: 0 }}>
            <LazyImage src={imgSrc} alt={project.title} />
            <Button 
              href={project.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              variant="contained" 
              color="primary"
              sx={{ mt: 2.5, fontWeight: 700, boxShadow: '0 8px 20px rgba(106,90,205,0.35)' }}
            >
              Visit Project
            </Button>
          </Box>
          <Box sx={{ flex: 2, minWidth: 0 }}>
            <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              Category
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
              {project.category}
            </Typography>

            <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              Date
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
              {project.date}
            </Typography>

            <Typography variant="overline" color="primary.light" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              Description
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ mb: 1, lineHeight: 1.8, whiteSpace: 'pre-line', textAlign: 'justify' }}>
              {project.description}
            </Typography>

          </Box>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
});

export default ProjectModal;
