import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function ProjectModal({ open, onClose, projectKey, project }) {
  if (!project) return null;
  const imgSrc = `/images/portfolio/${projectKey}.jpg`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { bgcolor: 'rgba(10,10,16,0.96)', backdropFilter: 'blur(6px)' } }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(2,2,6,0.6)'
          }
        }
      }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{project.title}</Typography>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1, minHeight: 260, background: 'linear-gradient(135deg,#2a2345,#14121f)', borderRadius: 2, overflow: 'hidden' }}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img
              src={imgSrc}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="overline" color="text.secondary">{project.category} • {project.date}</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>{project.description}</Typography>
            <Button href={project.url} target="_blank" rel="noopener" sx={{ mt: 2 }} variant="contained">Visit Project</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
