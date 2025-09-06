import { Typography, Divider, Grid } from '@mui/material';
import Timeline from '../components/Timeline';
import { EXPERIENCE_DATA } from '../data/experience';

const ExperienceSection = () => {
  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Experience</Typography>
      <Timeline 
        items={EXPERIENCE_DATA}
        renderItem={(exp) => (
          <>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{exp.company}</Typography>
            <Divider sx={{ my: 1.5 }} />
            <Grid container spacing={2}>
              {exp.roles.map((role, index) => (
                <Grid item key={index} xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{role.role}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {role.location} — {role.duration}
                  </Typography>
                  <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                    {role.responsibilities.map((res, i) => (
                      <li key={i}>
                        <Typography variant="body2">{res}</Typography>
                      </li>
                    ))}
                  </ul>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      />
    </>
  );
};

export default ExperienceSection;
