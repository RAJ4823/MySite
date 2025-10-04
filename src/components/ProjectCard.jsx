import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function ProjectCard({ projectKey, project, onOpen }) {
  const imgSrc = `${import.meta.env.VITE_BASE_URL || '/'}images/portfolio/${projectKey}.jpg`;
  return (
    <Card
      variant="outlined"
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', md: '350px', lg: '300px' },
        height: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'rgba(255,255,255,0.03)',
        borderColor: 'rgba(255,255,255,0.08)',
        transition: 'transform 300ms ease, box-shadow 300ms ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 10px 30px rgba(124,58,237,0.25)'
        }
      }}
    >
      <CardActionArea onClick={() => onOpen && onOpen(projectKey)}>
        <Box sx={{ height: 160, overflow: 'hidden', position: 'relative', background: 'linear-gradient(135deg,#2a2345,#14121f)' }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img src={imgSrc} onError={(e) => { e.currentTarget.style.display = 'none'; }} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.5))' }} />
        </Box>
        <CardContent sx={{ bgcolor: 'rgba(16,14,24,0.45)', backdropFilter: 'blur(6px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Typography variant="overline" color="text.secondary">{project.category}</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{project.title}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>{project.shortDescription}</Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button href={project.url} target="_blank" rel="noopener" variant="text">Visit</Button>
        <Tooltip title="Quick view">
          <IconButton onClick={() => onOpen && onOpen(projectKey)} size="small" color="primary">
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
