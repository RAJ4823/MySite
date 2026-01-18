import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectModal from '../components/ProjectModal';
import { solarAudio } from '../utils/audioManager';

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
import useSEO from '../hooks/useSEO';

export default function Home() {
  const [openKey, setOpenKey] = useState(null);
  const selected = openKey ? PROJECTS_DATA[openKey] : null;

  useSEO({
    description: "Hi, I'm Raj Patel – a passionate Full Stack Software Developer. Explore my portfolio showcasing web development projects, blogs, skills, and experience.",
    canonical: '/',
    keywords: [
      'Raj Patel', 'iamraj', 'iamraj.dev', 'rajpatel', 'raj patel developer', 'raj patel portfolio',
      'raj patel india', 'raj patel yubi', 'full stack developer', 'software engineer', 'web developer',
      'react developer', 'javascript developer', 'frontend developer', 'backend developer', 'MERN stack',
      'portfolio website', 'hire developer', 'freelance developer', 'iamraj.com', 'rajpatel.com', 'SuperChess',
      'superchess.iamraj.dev'
    ],
  });

  // Preload solar system audio on home page mount
  useEffect(() => {
    solarAudio.initialize();
  }, []);

  // Blur when modal is open
  const blurStyle = {
    position: 'relative',
    zIndex: 1,
    transform: 'translateZ(0)',
    willChange: 'transform',
    transition: 'filter 0.2s ease-out, transform 0.2s ease-out',
    filter: openKey ? 'blur(4px)' : 'none',
    pointerEvents: openKey ? 'none' : 'auto',
    '& *': {
      pointerEvents: openKey ? 'none' : 'auto',
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={blurStyle}>
        <Navbar variant="home" />

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
            const content = document.querySelector('.modal-content');
            if (content) content.style.animation = 'fadeOut 0.2s forwards';
            setTimeout(() => setOpenKey(null), 200);
          }}
          projectKey={openKey}
          project={selected}
        />
      </Box>
    </Box>
  );
}

