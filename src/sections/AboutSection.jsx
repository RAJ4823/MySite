import { Box, Stack, Typography } from '@mui/material';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import MovieRoundedIcon from '@mui/icons-material/MovieRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import FunctionsRoundedIcon from '@mui/icons-material/FunctionsRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import FeaturedProfile from '../components/FeaturedProfile';
import { ABOUT_ME_DATA } from '../data/about';
import { SOCIAL_PROFILES_DATA } from '../data/socialProfiles';
import { CP_PROFILES_DATA } from '../data/cpProfiles';
import { INTERESTS_DATA } from '../data/interests';
import ColorChip from '../components/ColorChip';

const MaterilUIIcons = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  Twitter: TwitterIcon,
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
};

const InterestIcons = {
  'Tech': StarBorderRoundedIcon,
  'Movies & Webseries': MovieRoundedIcon,
  'Astronomy': RocketLaunchRoundedIcon,
  'Gaming': SportsEsportsRoundedIcon,
  'Problem Solving': FunctionsRoundedIcon,
  'Designing': PaletteRoundedIcon,
};

export default function AboutSection() {
  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>About Me</Typography>
      <Stack direction={{ sm: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', md: 'stretch' }}>
        {/* Left: Image */}
        <Box sx={{ flexGrow: 0, flexShrink: 0, flexBasis: { xs: '100%', md: 380 }, width: { xs: '100%', md: 380 } }}>
          <FeaturedProfile />
        </Box>
        {/* Right: Intro then Personal Info below */}
        <Box sx={{ flexBasis: { xs: '100%', md: 'auto' }, flexGrow: 1, minWidth: 0 }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '1rem', fontWeight: 600 }}>Hello...</Typography>
          <Box>
            {ABOUT_ME_DATA.introduction.map((p, i) => (
              <Typography key={i} sx={{ mb: 1.2, textAlign: 'justify' }}>{p}</Typography>
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
        </Box>
      </Stack>

      <Box sx={{ mt: 2 }}>
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '1rem', fontWeight: 600 }}>Social Profiles</Typography>
        <Box>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
            {SOCIAL_PROFILES_DATA.map((s) => {
              const Icon = MaterilUIIcons[s.name] || OpenInNewIcon;
              return (
                <ColorChip
                  key={s.name}
                  label={s.name}
                  color={s.color}
                  icon={<Icon />}
                  component="a"
                  href={s.link}
                  target="_blank"
                  rel="noopener"
                  clickable
                />
              );
            })}
          </Stack>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '1rem', fontWeight: 600 }}>CP Profiles</Typography>
        <Box>
          <Stack direction="row" sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
            {CP_PROFILES_DATA.map((cp) => (
              <ColorChip
                key={cp.name}
                label={cp.name}
                color={cp.color}
                href={cp.link}
                icon={<OpenInNewIcon />}
                size="small"
                component="a"
                target="_blank"
                rel="noopener"
                clickable
              />
            ))}
          </Stack>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '1rem', fontWeight: 600 }}>Interests</Typography>
        <Box>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
            {INTERESTS_DATA.map((i) => {
              const Icon = InterestIcons[i.name] || StarBorderRoundedIcon;
              return (
                <ColorChip
                  key={i.name}
                  label={i.name}
                  color={i.color}
                  icon={<Icon />}
                  size="medium"
                  variant="filled"
                />
              );
            })}
          </Stack>
        </Box>
      </Box>
    </>
  );
}
