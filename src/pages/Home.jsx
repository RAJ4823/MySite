import { useState } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Background3D from '../components/Background3D';
import ProjectModal from '../components/ProjectModal';

import { PROJECTS_DATA } from '../data/projects';

// Import Sections
import Section from '../components/Section';
import { 
  HomeSection, 
  AboutSection, 
  EducationSection, 
  ExperienceSection,
  SkillsSection,
  ProjectsSection
} from '../sections';
import ScrollHint from '../components/ScrollHint';


export default function Home() {
  const entries = Object.entries(PROJECTS_DATA);
  const projects = entries.slice(0, 6);
  const [openKey, setOpenKey] = useState(null);
  const [solarOpen, setSolarOpen] = useState(false);
  const selected = openKey ? PROJECTS_DATA[openKey] : null;

  // Optimize blur performance by using transform and will-change
  const blurStyle = {
    position: 'relative',
    zIndex: 1,
    transform: 'translateZ(0)', // Create a new layer for GPU acceleration
    willChange: 'transform', // Hint browser about the upcoming transform
    transition: 'filter 0.2s ease-out, transform 0.2s ease-out',
    filter: openKey || solarOpen ? 'blur(4px)' : 'none',
    // Disable hover effects when modal is open for better performance
    pointerEvents: openKey || solarOpen ? 'none' : 'auto',
    '& *': {
      pointerEvents: openKey || solarOpen ? 'none' : 'auto',
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Passive background solar system */}
      <Background3D mode="background" />
      {/* Interactive overlay when opened */}
      {solarOpen && (
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 60, transform: 'translateZ(0)' }}>
          <Navbar
            overlay
            onBack={() => {
              setSolarOpen(false);
              setTimeout(() => window.dispatchEvent(new CustomEvent('solar_cam_updated')), 50);
            }}
          />
          <Background3D mode="interactive" />
        </Box>
      )}
      <Box sx={blurStyle}>
        <Navbar onOpenSolar={() => setSolarOpen(true)} />

      <Section id="home" glass={false}>
        <HomeSection />
      </Section>

      <Section id="about">
        <AboutSection />
      </Section>

      <Section id="education">
        <EducationSection />
      </Section>

      <Section id="experience">
        <ExperienceSection />
      </Section>

      <Section id="skills">
        <SkillsSection />
      </Section>

      <Section id="projects">
        <ProjectsSection onProjectOpen={setOpenKey} />
      </Section>

      <Footer />

      <ProjectModal 
        open={!!openKey} 
        onClose={() => {
          // Start the close animation
          const content = document.querySelector('.modal-content');
          if (content) content.style.animation = 'fadeOut 0.2s forwards';
          
          // Wait for animation to complete before unmounting
          setTimeout(() => {
            setOpenKey(null);
          }, 200);
        }} 
        projectKey={openKey} 
        project={selected} 
      />
      </Box>
    </Box>
  );
}
