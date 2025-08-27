import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { CP_PROFILES_DATA } from '../data/cpProfiles';

const colors = {
  LeetCode: '#F89F1B',
  Codechef: '#AA48FF',
  Codeforce: '#1F8ACB',
  HackerRank: '#00EA64',
  CodingNinjas: '#F36D33',
};

export default function CPProfiles() {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '1rem', fontWeight: 600 }}>Competitive Profiles</Typography>
      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
        {CP_PROFILES_DATA.map((p) => {
          const color = colors[p.name] || '#B794F4';
          return (
            <Chip
              key={p.name}
              component="a"
              href={p.link}
              target="_blank"
              rel="noopener"
              clickable
              label={p.name}
              sx={{
                color,
                borderColor: color,
                borderWidth: 1,
                borderStyle: 'solid',
                bgcolor: 'rgba(0,0,0,0.2)',
                '&:hover': {
                  boxShadow: `0 0 0 4px ${color}33`,
                  transform: 'translateY(-1px)'
                },
                transition: 'all .2s ease'
              }}
              variant="outlined"
              size="small"
            />
          );
        })}
      </Stack>
    </Box>
  );
}
