import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import { useMemo, useState, useCallback } from 'react';
import { TECH_STACK } from '../data/techStack';

function TechCard({ name, color, iconify }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const handleMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPos({ x, y });
  }, []);

  const style = useMemo(() => {
    const w = 96, h = 96;
    const cx = w / 2, cy = h / 2;
    const dx = (pos.x - cx) / cx; // -1..1
    const dy = (pos.y - cy) / cy; // -1..1
    const rotateX = (hover ? -dy * 10 : 0).toFixed(2);
    const rotateY = (hover ? dx * 12 : 0).toFixed(2);
    const lightX = Math.max(0, Math.min(w, pos.x || cx));
    const lightY = Math.max(0, Math.min(h, pos.y || cy));
    return {
      transform: `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      background: `radial-gradient(180px at ${lightX}px ${lightY}px, ${color}40, transparent 60%)`,
    };
  }, [pos.x, pos.y, hover, color]);

  return (
    <Tooltip title={name} arrow>
      <Box
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={handleMove}
        onTouchStart={() => setHover(true)}
        onTouchEnd={() => setHover(false)}
        sx={{
          width: { xs: 60, md: 80 },
          height: { xs: 60, md: 80 },
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'rgba(124,58,237,0.35)',
          bgcolor: 'rgba(16,14,24,0.6)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 10px 30px rgba(124,58,237,0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          cursor: 'pointer',
          transition: 'transform .15s ease',
          ...style,
        }}
      >
        {iconify ? (
          // Iconify SVG via CDN (broad coverage for tech logos)
          <img
            src={`https://api.iconify.design/${iconify}.svg`}
            alt={name}
            width='70%'
            height='70%'
            style={{ display: 'block', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.35))' }}
            loading="lazy"
            onError={(e) => { e.currentTarget.style.opacity = '0.6'; }}
          />
        ) : (
          <Box sx={{ fontSize: 34 }}>?</Box>
        )}
      </Box>
    </Tooltip>
  );
}

export default function TechStack() {
  return (
    <Box sx={{
      mt: 1,
      mx: 'auto',
      display: "flex",
      justifyContent: { xs: 'space-around', sm: 'left' },
      alignItems: "center",
      flexWrap: "wrap",
      gap: 2,
    }} >
      {TECH_STACK.map((t) => (
        <TechCard key={t.key} name={t.name} color={t.color} iconify={t.iconify} />
      ))}
    </Box>
  );
}
