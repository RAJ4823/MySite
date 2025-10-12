import { Box, Typography, Paper, Divider, Grid } from '@mui/material';
import PropTypes from 'prop-types';

const Timeline = ({ items, renderItem }) => {
  return (
    <Box sx={{ 
      position: 'relative', 
      pl: { xs: 5, md: 7 },
      '--left-x': {lg: '22px', md: '22px', xs: '12px'}, 
      '--dot-size': {lg: '14px', md: '12px', xs: '10px'}, 
      '--translate-x': {lg: 'translateX(-445%)', md: 'translateX(-510%)', xs: 'translateX(-442%)'},
    }}>
      <Box sx={{ position: 'absolute', left: 'var(--left-x)', top: 0, bottom: 0, width: {lg: '2px', md: '2px', xs: '1.2px'}, bgcolor: 'rgba(124,58,237,0.4)', zIndex: 1 }} />
      {items.map((item, index) => (
        <Box key={index} sx={{ position: 'relative', mb: 3 }}>
          <Box sx={{ 
            position: 'absolute', 
            left: 'var(--left-x)', 
            transform: 'var(--translate-x)', 
            top: 6, 
            width: 'var(--dot-size)', 
            height: 'var(--dot-size)', 
            borderRadius: '50%', 
            bgcolor: '#7C3AED', 
            boxShadow: '0 0 0 4px rgba(124,58,237,0.25)', 
            zIndex: 2 
          }} />
          <Paper 
            variant="outlined" 
            sx={{ 
              px: 2,
              pt: 1,
              pb: 0,
              ml: {lg: 2, md: 1, xs: 0}, 
              borderColor: 'rgba(124,58,237,0.35)', 
              boxShadow: '0 10px 30px rgba(124,58,237,0.15)', 
              bgcolor: 'rgba(16,14,24,0.45)', 
              backdropFilter: 'blur(6px)', 
              position: 'relative', 
              zIndex: 0 
            }}
          >
            {renderItem(item, index)}
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

Timeline.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired
};

export default Timeline;
