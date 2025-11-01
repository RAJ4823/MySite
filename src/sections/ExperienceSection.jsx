import { Typography, Divider, Grid, Box } from '@mui/material';
import Timeline from '../components/Timeline';
import { EXPERIENCE_DATA } from '../data/experience';

const ExperienceBox = ({ exp }) => {
  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 0.5,
      }}>
        <Typography variant="h6" color="primary.light" sx={{ fontWeight: 800 }}>
          {exp.company}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'left', sm: 'right' }, ml: { sm: 'auto' } }}>
          {exp.location}
        </Typography>
      </Box>

      <Divider sx={{ my: 0.8 }} />

      {exp.roles?.map((role, index) => (
        <div key={index}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'baseline' },
            gap: 0.5,
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontStyle: 'italic' }}>
              {role?.role}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'left', sm: 'right' }, ml: { sm: 'auto' }, mb: { xs: 0.5, sm: 0 } }}>
              {role?.duration}
            </Typography>
          </Box>
          {role?.responsibilities && Array.isArray(role?.responsibilities) && role?.responsibilities.length > 0 && (
            <ul style={{ marginTop: 4, paddingLeft: 18 }}>
              {role?.responsibilities.map((responsibility, index) => (
                <li key={index}>
                  <Typography variant="body2">{responsibility}</Typography>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </>
  )
}

const ExperienceSection = () => {
  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Experience</Typography>
      <Timeline
        items={EXPERIENCE_DATA}
        renderItem={(exp) => (
          <ExperienceBox exp={exp} key={exp.company} />
        )}
      />
    </>
  );
};

export default ExperienceSection;
