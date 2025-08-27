import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Section from '../components/Section';
import SkillBar from '../components/SkillBar';
import ProjectCard from '../components/ProjectCard';
import Background3D from '../components/Background3D';
import ProjectModal from '../components/ProjectModal';
import FeaturedProfile from '../components/FeaturedProfile';
import SocialProfiles from '../components/SocialProfiles';
import CPProfiles from '../components/CPProfiles';
import ScrollHint from '../components/ScrollHint';
import CPAchievements from '../components/CPAchievements';
import Interests from '../components/Interests';
import TechStack from '../components/TechStack';
import EducationTimeline from '../components/EducationTimeline';
import ExperienceTimeline from '../components/ExperienceTimeline';

import { ABOUT_ME_DATA } from '../data/about';
import { EDUCATION_DATA } from '../data/education';
import { EXPERIENCE_DATA } from '../data/experience';
import { SKILLS_DATA } from '../data/skills';
import { PROJECTS_DATA } from '../data/projects';

export default function Home() {
  const entries = Object.entries(PROJECTS_DATA);
  const projects = entries.slice(0, 6);
  const [openKey, setOpenKey] = useState(null);
  const [solarOpen, setSolarOpen] = useState(false);
  const selected = openKey ? PROJECTS_DATA[openKey] : null;

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Passive background solar system */}
      <Background3D mode="background" />
      {/* Interactive overlay when opened */}
      {solarOpen && (
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 60 }}>
          {/* Keep navbar visible in overlay with only a back button */}
          <Navbar
            overlay
            onBack={() => {
              setSolarOpen(false);
              // Give OrbitControls a moment to emit final change, then signal background to re-apply
              setTimeout(() => window.dispatchEvent(new CustomEvent('solar_cam_updated')), 50);
            }}
          />
          <Background3D mode="interactive" />
        </Box>
      )}
      <Box sx={{ position: 'relative', zIndex: 1, filter: openKey || solarOpen ? 'blur(4px)' : 'none', transition: 'filter .25s ease' }}>
        <Navbar onOpenSolar={() => setSolarOpen(true)} />

      <Section id="home" glass={false}>
        <Box sx={{ minHeight: { xs: '92vh', md: 'calc(100vh - 80px)' }, display: 'flex', alignItems: 'center' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="overline" color="text.secondary">Welcome</Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.1 }}>Raj Patel</Typography>
            <Typography variant="h5" sx={{ mt: 1, color: 'primary.light' }}>A Full-Stack Software Developer</Typography>
            <Typography sx={{ mt: 2, opacity: 0.9 }}>{ABOUT_ME_DATA.introduction[0]}</Typography>
          </Grid>
        </Grid>
        </Box>
        <ScrollHint />
      </Section>
      {/* View Solar System button moved into Navbar */}

      <Section id="about">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>About Me</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'stretch' }}>
          {/* Left: Image */}
          <Box sx={{ flexGrow: 0, flexShrink: 0, flexBasis: { xs: '100%', sm: 340 }, maxWidth: { xs: '100%', sm: 380 } }}>
            <FeaturedProfile />
          </Box>
          {/* Right: Intro then Personal Info below */}
          <Box sx={{ flexBasis: { xs: '100%', sm: 'auto' }, flexGrow: 1, minWidth: 0 }}>
            <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '1rem', fontWeight: 600 }}>Hello...</Typography>
            <Box>
              {ABOUT_ME_DATA.introduction.map((p, i) => (
                <Typography key={i} sx={{ mb: 1.2 }}>{p}</Typography>
              ))}
            </Box>
            <Box sx={{ mt: 2 }}>
              {ABOUT_ME_DATA.personalInfo.map((row) => (
                <Box key={row.label} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                  <KeyboardArrowRightRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, mr: 1 }}>{row.label}:</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>{row.value}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 2 }}>
              <SocialProfiles />
            </Box>
            <Box sx={{ mt: 2 }}>
              <CPProfiles />
            </Box>
          </Box>
        </Stack>

        {/* Full-width: Achievements and Interests to fill horizontally */}

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, mt: 2 }}>Interests</Typography>
          <Interests />
        </Box>
      </Section>

      <Section id="education">
        <EducationTimeline />
      </Section>

      <Section id="experience">
        <ExperienceTimeline />
      </Section>

      <Section id="skills">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Skills</Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Tech Skills</Typography>
          <Grid container justifyContent="space-between">
            <Grid item xs={12} md={6} lg={6} width="48%">
              {SKILLS_DATA.slice(0, Math.ceil(SKILLS_DATA.length / 2)).map((s) => (
                <SkillBar key={s.skill} label={s.skill} value={s.percentage} />
              ))}
            </Grid>
            <Grid item xs={12} md={6} lg={6} width="48%">
              {SKILLS_DATA.slice(Math.ceil(SKILLS_DATA.length / 2)).map((s) => (
                <SkillBar key={s.skill} label={s.skill} value={s.percentage} />
              ))}
            </Grid>
          </Grid>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Tech Stack</Typography>
          <TechStack />
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>CP Achievements</Typography>
          <CPAchievements />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Soft Skills</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {['Leadership', 'Problem-Solving', 'Teamwork', 'Creativity', 'Attention to Details', 'Adaptability'].map((s) => (
              <Paper
                key={s}
                variant="outlined"
                sx={{
                  px: 1.25,
                  py: 0.75,
                  borderColor: 'rgba(124,58,237,0.35)',
                  bgcolor: 'rgba(16,14,24,0.45)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body1" sx={{ opacity: 0.9 }}>{s}</Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Section>

      <Section id="projects">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Featured Projects</Typography>
        <Grid container spacing={3} justifyContent="space-between">
          {projects.map(([key, p]) => (
            <Grid item key={key} xs={12} sm={6} md={3} lg={3}>
              <ProjectCard projectKey={key} project={p} onOpen={(k) => setOpenKey(k)} />
            </Grid>
          ))}
        </Grid>
      </Section>

      <Footer />

      <ProjectModal open={!!openKey} onClose={() => setOpenKey(null)} projectKey={openKey} project={selected} />
      </Box>
    </Box>
  );
}
