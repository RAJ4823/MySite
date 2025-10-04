import { Box, Grid, Typography } from '@mui/material';
import { PROJECTS_DATA } from '../data/projects';
import ProjectCard from '../components/ProjectCard';

const ProjectsSection = ({ onProjectOpen }) => {
  const entries = Object.entries(PROJECTS_DATA);
  const projects = entries.slice(0, 6);

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Featured Projects</Typography>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(auto-fill, minmax(280px, 1fr))',
          lg: 'repeat(auto-fill, minmax(300px, 1fr))' 
        },
        gap: 3,
        width: '100%',
        '& > *:first-of-type': {
          justifySelf: 'flex-start',
        },
        '& > *:last-child': {
          justifySelf: 'flex-end',
        },
        '& > *:not(:first-of-type):not(:last-child)': {
          justifySelf: 'center',
          '@media (min-width: 1200px)': {
            justifySelf: 'center',
            margin: '0 auto',
          },
        },
      }}>
        {projects.map(([key, project]) => 
          project.display && (
            <ProjectCard 
              key={key}
              projectKey={key} 
              project={project} 
              onOpen={onProjectOpen}
            />
          )
        )}
      </Box>
    </>
  );
};

export default ProjectsSection;
