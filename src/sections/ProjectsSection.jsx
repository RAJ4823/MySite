import { Box, Grid, Typography } from '@mui/material';
import { PROJECTS_DATA } from '../data/projects';
import ProjectCard from '../components/ProjectCard';

const ProjectsSection = ({ onProjectOpen }) => {
  const entries = Object.entries(PROJECTS_DATA);
  const projects = entries.slice(0, 6);

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Featured Projects</Typography>
      <Grid container spacing={3} justifyContent="space-around">
        {projects.map(([key, project]) => (
          <Grid item key={key} xs={12} sm={6} md={3} lg={3}>
            <ProjectCard 
              projectKey={key} 
              project={project} 
              onOpen={onProjectOpen} 
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ProjectsSection;
