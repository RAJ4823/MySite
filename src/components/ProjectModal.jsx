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
    height: '100%',
    minHeight: 260,
    background: 'linear-gradient(135deg,#2a2345,#14121f)',
    borderRadius: 2,
    overflow: 'hidden'
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
        objectFit: 'cover',
        transition: 'opacity 0.3s ease-in-out',
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
      background: 'rgba(10,10,16,0.96)',
      backdropFilter: 'blur(6px)',
      animation: 'fadeIn 0.2s ease-out forwards',
      '&.MuiDialog-paper': {
        margin: 16,
        maxHeight: 'calc(100% - 32px)',
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
      maxWidth="md"
      fullWidth
      transitionDuration={200}
      disableScrollLock={false}
      className="modal-content"
    >
      <DialogTitle sx={{ pr: 6, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{project.title}</Typography>
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
      <DialogContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 3,
          pt: 1,
          '& > *': {
            minWidth: 0, // Prevent flex items from overflowing
          }
        }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <LazyImage src={imgSrc} alt={project.title} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="overline" color="text.secondary">
              {project.category} • {project.date}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, lineHeight: 1.6, textAlign: 'justify' }}>
              {project.description}
            </Typography>
            <Button 
              href={project.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              variant="contained" 
              sx={{ mt: 2.5 }}
            >
              Visit Project
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
});

export default ProjectModal;
