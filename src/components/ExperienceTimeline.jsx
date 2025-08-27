import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { EXPERIENCE_DATA } from '../data/experience';

export default function ExperienceTimeline() {
  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Experience</Typography>
      <Box sx={{ position: 'relative', pl: { xs: 5, md: 7 }, '--tl-x': '22px', '--dot-size': '14px' }}>
        <Box sx={{ position: 'absolute', left: 'var(--tl-x)', top: 0, bottom: 0, width: 2, bgcolor: 'rgba(124,58,237,0.4)', zIndex: 1 }} />
        {EXPERIENCE_DATA.map((exp) => (
          <Box key={exp.company} sx={{ position: 'relative', mb: 3 }}>
            <Box sx={{ position: 'absolute', left: 'var(--tl-x)', transform: 'translateX(-50%)', top: 6, width: 'var(--dot-size)', height: 'var(--dot-size)', borderRadius: '50%', bgcolor: '#7C3AED', boxShadow: '0 0 0 4px rgba(124,58,237,0.25)', zIndex: 2 }} />
            <Paper variant="outlined" sx={{ p: 2, ml: 2, borderColor: 'rgba(124,58,237,0.35)', boxShadow: '0 10px 30px rgba(124,58,237,0.15)', bgcolor: 'rgba(16,14,24,0.45)', backdropFilter: 'blur(6px)', position: 'relative', zIndex: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{exp.company}</Typography>
              <Divider sx={{ my: 1.5 }} />
              <Grid container spacing={2}>
                {exp.roles.map((r) => (
                  <Grid item key={r.role} xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{r.role}</Typography>
                    <Typography variant="body2" color="text.secondary">{r.location} — {r.duration}</Typography>
                    <ul style={{ marginTop: 8 }}>
                      {r.responsibilities.map((res) => (
                        <li key={res}><Typography variant="body2">{res}</Typography></li>
                      ))}
                    </ul>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        ))}
      </Box>
    </>
  );
}
