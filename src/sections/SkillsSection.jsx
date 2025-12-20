import { Box, Typography, Grid } from '@mui/material';
import { TECH_SKILLS_DATA, SOFT_SKILLS_DATA } from '../data/skills';
import SkillBar from '../components/SkillBar';
import TechStack from '../components/TechStack';
import CPAchievements from '../components/CPAchievements';
import ColorChip from '../components/ColorChip';

const SkillsSection = () => {
  return (
    <>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 800, mb: 2 }}>Skills</Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="overline" color="text.primary" sx={{ display: 'block', mb: 0.5, fontSize: '1.2rem', fontWeight: 600 }}>Soft Skills</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {SOFT_SKILLS_DATA.map((s) => (
            <ColorChip
              key={s.skill}
              label={s.skill}
              color={s.color}
              variant="filled"
              size="medium"
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="overline" color="text.primary" sx={{ display: 'block', mb: 0.5, fontSize: '1.2rem', fontWeight: 600 }}>Tech Skills</Typography>
        <Grid container justifyContent="space-between">
          <Grid item xs={12} md={6} lg={6} width={{ md: '48%', xs: '100%' }}>
            {TECH_SKILLS_DATA.slice(0, Math.ceil(TECH_SKILLS_DATA.length / 2)).map((s) => (
              <SkillBar key={s.skill} label={s.skill} value={s.percentage} />
            ))}
          </Grid>
          <Grid item xs={12} md={6} lg={6} width={{ md: '48%', xs: '100%' }}>
            {TECH_SKILLS_DATA.slice(Math.ceil(TECH_SKILLS_DATA.length / 2)).map((s) => (
              <SkillBar key={s.skill} label={s.skill} value={s.percentage} />
            ))}
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="overline" color="text.primary" sx={{ display: 'block', mb: 0.5, fontSize: '1.2rem', fontWeight: 600 }}>Tech Stack</Typography>
        <TechStack />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="overline" color="text.primary" sx={{ display: 'block', mb: 0.5, fontSize: '1.2rem', fontWeight: 600 }}>CP Achievements</Typography>
        <CPAchievements />
      </Box>


    </>
  );
};

export default SkillsSection;
