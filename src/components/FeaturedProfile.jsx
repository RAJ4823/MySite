import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { useEffect, useMemo, useRef, useState } from 'react';

// Candidate image names in public/profile (existing files)
const candidates = ['me0.png', 'me1.png', 'me2.png', 'me3.png'];

export default function FeaturedProfile() {
  const [idx, setIdx] = useState(0);
  const available = useMemo(() => candidates.slice(0, 8), []);
  const imgList = available.slice(0, 3);

  const next = () => setIdx((i) => (i + 1) % imgList.length);

  const src = `/images/profile/${imgList[idx]}`;

  return (
    <Box sx={{
      p: 3,
      textAlign: 'center',
      width: { xs: '100%', lg: 'min-content' },
    }}>
      <Box sx={{
        width: { xs: '100%', lg: 'min-content' },
        display: 'inline-block',
        bgcolor: 'rgba(16,14,24,0.45)',
        backdropFilter: 'blur(6px)',
        borderRadius: 1,
        boxShadow: '0 10px 30px rgba(124,58,237,0.35)',
        border: '2px solid rgba(183,148,244,0.5)',
        transition: 'transform .3s ease',
        '&:hover': { transform: 'scale(1.05)' },
      }}>
        <Avatar
          src={src}
          onClick={next}
          onError={(e) => { e.currentTarget.src = ''; }}
          sx={{
            width: { xs: 'max-content' },
            height: { xs: 300, sm: 350, md: 380, lg: 400 },
            m: '0 auto',
            cursor: 'pointer',
            borderRadius: 0
          }}
        >R</Avatar>
      </Box>
    </Box>
  );
}
