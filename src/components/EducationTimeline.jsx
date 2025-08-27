import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { EDUCATION_DATA } from '../data/education';

export default function EducationTimeline() {
  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Education</Typography>
      <Box sx={{ position: 'relative', pl: { xs: 5, md: 7 }, '--tl-x': '22px', '--dot-size': '14px' }}>
        <Box sx={{ position: 'absolute', left: 'var(--tl-x)', top: 0, bottom: 0, width: 2, bgcolor: 'rgba(124,58,237,0.4)', zIndex: 1 }} />
        {EDUCATION_DATA.map((ed) => (
          <Box key={ed.school} sx={{ position: 'relative', mb: 3 }}>
            <Box sx={{ position: 'absolute', left: 'var(--tl-x)', transform: { lg: 'translateX(-445%)', md: 'translateX(-445%)', xs: 'translateX(-325%)' }, top: 6, width: 'var(--dot-size)', height: 'var(--dot-size)', borderRadius: '50%', bgcolor: '#7C3AED', boxShadow: '0 0 0 4px rgba(124,58,237,0.25)', zIndex: 2 }} />
            <Paper variant="outlined" sx={{ p: 2, ml: 2, borderColor: 'rgba(124,58,237,0.35)', boxShadow: '0 10px 30px rgba(124,58,237,0.15)', bgcolor: 'rgba(16,14,24,0.45)', backdropFilter: 'blur(6px)', position: 'relative', zIndex: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{ed.school}</Typography>
              <Typography variant="body2" color="text.secondary">{ed.location} — {ed.duration}</Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{ed.degree}</Typography>
              {ed.achievements.map((a) => (
                <Chip key={a} label={a} size="small" sx={{ mr: 1, mb: 1 }} />
              ))}
            </Paper>
          </Box>
        ))}
      </Box>
    </>
  );
}
