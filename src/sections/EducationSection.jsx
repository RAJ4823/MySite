import { Typography, Divider, Chip, Box } from '@mui/material';
import Timeline from '../components/Timeline';
import { EDUCATION_DATA } from '../data/education';

const EducationSection = () => {
  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Education</Typography>
      <Timeline 
        items={EDUCATION_DATA}
        renderItem={(edu) => (
          <>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{edu.school}</Typography>
            <Typography variant="body2" color="text.secondary">
              {edu.location} — {edu.duration}
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{edu.degree}</Typography>
            {edu.achievements && edu.achievements.map((achievement, index) => (
              <Chip 
                key={index} 
                label={achievement} 
                size="small" 
                sx={{ 
                  mr: 1, 
                  mb: 1,
                }}
              />
            ))}
          </>
        )}
      />
    </>
  );
};

export default EducationSection;
