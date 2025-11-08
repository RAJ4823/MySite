import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useEffect, useRef, useState } from 'react';
import { CP_ACHIEVEMENTS_DATA } from '../data/cpAchievements';
import { trackEvent } from '../analytics';

function useInView(options) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
      }
    }, options);
    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);
  return [ref, inView];
}

function CountUp({ end, start, duration = 1200, color }) {
  const [val, setVal] = useState(0);
  const [done, setDone] = useState(false);
  const startRef = useRef(0);
  useEffect(() => {
    if (!start || done) return;
    let raf;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min(1, (ts - startRef.current) / duration);
      const n = Math.round(end * ease(p));
      setVal(n);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDone(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, duration, end, done]);
  return (
    <Typography variant="h4" sx={{ fontWeight: 800, my: 0.5, color }}>{val}</Typography>
  );
}

export default function CPAchievements() {
  const [rootRef, inView] = useInView({ threshold: 0.35 });
  return (
    <Grid container spacing={3} justifyContent="space-around" ref={rootRef}>
      {CP_ACHIEVEMENTS_DATA.map((a) => (
        <Grid item key={a.name} xs={12} sm={12} md={6} width={{ md: '22%', xs: '46%' }}>
          <Link href={a.link} target="_blank" rel="noopener" underline="none" sx={{ display: 'block', height: '100%' }} onClick={() => trackEvent('cp_achievement_click', { name: a.name, url: a.link })}>
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                textAlign: 'center',
                borderColor: 'rgba(124,58,237,0.35)',
                bgcolor: 'rgba(16,14,24,0.45)',
                backdropFilter: 'blur(6px)',
                transition: 'transform .2s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 30px rgba(124,58,237,0.2)' }
              }}
            >
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>{a.name}</Typography>
              <CountUp end={a.rank} start={inView} color={a.color} />
              <Typography variant="caption" color="text.secondary">{a.description}</Typography>
            </Paper>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}
