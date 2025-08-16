import { createTheme } from '@mui/material/styles';

// Dark theme with purple accents
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C3AED', // purple
      light: '#9F67F6',
      dark: '#5B21B6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#B794F4',
    },
    background: {
      default: '#0B0B12', // near-black
      paper: '#12121A',
    },
    text: {
      primary: '#EDEDF7',
      secondary: '#ACACBE',
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: `Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"`,
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
});

export default theme;
