import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { useEffect, useMemo, useRef, useState } from 'react';

// Candidate image names in public/profile (existing files)
const candidates = ['me0.png','me1.png','me2.png','me3.png'];

export default function FeaturedProfile() {
  const [idx, setIdx] = useState(0);
  const available = useMemo(() => candidates.slice(0, 8), []);
  const imgList = available.slice(0, 3);
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => setIdx((i) => (i + 1) % imgList.length), 60000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [imgList.length]);

  const next = () => setIdx((i) => (i + 1) % imgList.length);

  const src = `/profile/${imgList[idx]}`;

  return (
    <Box sx={{
      p: 3,
      borderRadius: 2,
      bgcolor: 'rgba(255,255,255,0.02)',
      border: '1px solid',
      borderColor: 'rgba(124,58,237,0.25)',
      boxShadow: '0 10px 30px rgba(124,58,237,0.15)',
      textAlign: 'center'
    }}>
      <Typography variant="overline" color="text.secondary">Featured</Typography>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: 'primary.light' }}>Profile</Typography>
      <Box sx={{
        display: 'inline-block',
        bgcolor: 'rgba(16,14,24,0.45)',
        backdropFilter: 'blur(6px)',
        borderRadius: 2,
      }}>
        <Avatar
          src={src}
          onClick={next}
          onError={(e) => { e.currentTarget.src = ''; }}
          sx={{ 
            width: 300, 
            height: 400, 
            m: '0 auto', 
            cursor: 'pointer', 
            boxShadow: '0 10px 30px rgba(124,58,237,0.35)', 
            border: '2px solid rgba(183,148,244,0.5)', 
            transition: 'transform .3s ease', 
            '&:hover': { transform: 'scale(1.05)' }, 
            borderRadius: 2 
          }}
        >R</Avatar>
      </Box>
    </Box>
  );
}
