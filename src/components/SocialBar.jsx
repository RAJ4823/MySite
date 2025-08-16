import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Typography from '@mui/material/Typography';
import { SOCIAL_PROFILES_DATA } from '../data/socialProfiles';

const iconMap = {
  GitHub: { Comp: GitHubIcon, color: '#C3D1F8' },
  LinkedIn: { Comp: LinkedInIcon, color: '#0A66C2' },
  Twitter: { Comp: TwitterIcon, color: '#1DA1F2' },
  Facebook: { Comp: FacebookIcon, color: '#1877F2' },
  Instagram: { Comp: InstagramIcon, color: '#E4405F' },
};

export default function SocialBar() {
  return (
    <div>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Social Profiles</Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
        {SOCIAL_PROFILES_DATA.map((s) => {
          const entry = iconMap[s.name] || { Comp: OpenInNewIcon, color: '#B794F4' };
          const Icon = entry.Comp;
          return (
            <Tooltip key={s.name} title={s.name}>
              <IconButton
                component="a"
                href={s.link}
                target="_blank"
                rel="noopener"
                sx={{
                  color: entry.color,
                  border: '1px solid rgba(255,255,255,0.12)',
                  '&:hover': { boxShadow: `0 0 0 4px rgba(124,58,237,0.2)`, transform: 'translateY(-2px)' },
                  transition: 'all .2s ease'
                }}
              >
                <Icon fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        })}
      </Stack>
    </div>
  );
}
