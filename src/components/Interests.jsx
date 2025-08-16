import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import MovieRoundedIcon from '@mui/icons-material/MovieRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import FunctionsRoundedIcon from '@mui/icons-material/FunctionsRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import { INTERESTS_DATA } from '../data/interests';

const IconMap = {
  'Tech': StarBorderRoundedIcon,
  'Movies & Webseries': MovieRoundedIcon,
  'Astronomy': RocketLaunchRoundedIcon,
  'Gaming': SportsEsportsRoundedIcon,
  'Problem Solving': FunctionsRoundedIcon,
  'Designing': PaletteRoundedIcon,
};

export default function Interests() {
  return (
    <Grid container spacing={2} justifyContent="space-between">
      {INTERESTS_DATA.map((i) => {
        const Icon = IconMap[i.name] || StarBorderRoundedIcon;
        return (
          <Grid item key={i.name} xs={12} sm={6} md={3} lg={3} width="30%">
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                textAlign: 'center',
                borderColor: 'rgba(124,58,237,0.35)',
                bgcolor: 'rgba(16,14,24,0.35)',
                backdropFilter: 'blur(4px)',
                width: '100%'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Icon sx={{ color: i.color }} fontSize="small" />
                <Typography variant="body2" sx={{ color: i.color, fontWeight: 700 }}>{i.name}</Typography>
              </Box>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}
