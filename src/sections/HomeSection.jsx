import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ScrollHint from '../components/ScrollHint';
import FeaturedProjectNotification from '../components/FeaturedProjectNotification';

export default function HomeSection() {
  return (
    <Box sx={{
      minHeight: { xs: '92vh', md: 'calc(100vh - 80px)' },
      display: 'flex',
      alignItems: 'center',
      position: 'relative'
    }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h6" color="text.secondary">Hello, I am</Typography>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 800, lineHeight: 1.1 }}>Raj Patel</Typography>
          <Typography variant="h5" component="h2" sx={{ mt: 1, color: 'primary.light' }}>A Full-Stack Software Developer</Typography>
        </Grid>
      </Grid>
      <FeaturedProjectNotification />
      <ScrollHint />
    </Box>
  );
}
