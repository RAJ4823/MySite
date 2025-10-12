import { Typography, Divider, Box } from '@mui/material';
import Timeline from '../components/Timeline';
import { EDUCATION_DATA } from '../data/education';


const EducationBox = ({ edu }) => {
  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 0.5,
      }}>
        <Typography variant="h6" color="primary.light" sx={{ fontWeight: 800 }}>
          {edu.school}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'left', md: 'right' }, ml: { md: 'auto' } }}>
          {edu.location}
        </Typography>
      </Box>
      <Divider sx={{ my: 0.8 }} />
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'baseline' },
        gap: 0.5,
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontStyle: 'italic' }}>
          {edu.degree}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'left', md: 'right' }, ml: { md: 'auto' }, mb: { xs: 0.5, md: 0 } }}>
          {edu.duration}
        </Typography>
      </Box>
      {edu.achievements && Array.isArray(edu.achievements) && edu.achievements.length > 0 && (
        <ul style={{ marginTop: 4, paddingLeft: 18 }}>
          {edu.achievements.map((achievement, index) => (
            <li key={index}>
              <Typography variant="body2">{achievement}</Typography>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

const EducationSection = () => {
  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Education</Typography>
      <Timeline
        items={EDUCATION_DATA}
        renderItem={(edu) => (
          <EducationBox edu={edu} key={edu.school} />
        )}
      />
    </>
  );
};

export default EducationSection;
