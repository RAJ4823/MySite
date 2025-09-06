import { Chip } from '@mui/material';

const ColorChip = ({ 
  label, 
  color = 'text.primary', 
  icon = null, 
  href = null,
  onClick = null,
  variant = 'outlined',
  size = 'medium',
  component = 'div',
  target = undefined,
  rel = undefined,
  clickable = false,
  ...rest
}) => {
  return (
    <Chip
      label={label}
      icon={icon}
      onClick={onClick}
      href={href}
      variant={variant}
      size={size}
      component={component}
      target={target}
      rel={rel}
      clickable={clickable || !!href}
      sx={{
        color: color,
        fontWeight: href ? 400 : 600,
        fontSize: href ? '0.75rem' : '0.8rem',
        padding: '2px 4px',
        margin: '0px',
        borderColor: `${color}40`,
        backgroundColor: `${color}10`,
        transition: 'all 0.2s ease',
        cursor: (href || clickable) ? 'pointer' : 'default',
        '&:hover': {
          backgroundColor: `${color}20`,
          boxShadow: `0 0 0 2px ${color}33`,
          transform: 'translateY(-2px)',
        },
        '& .MuiChip-icon': {
          color: color,
        },
      }}
      {...rest}
    />
  );
};

export default ColorChip;
