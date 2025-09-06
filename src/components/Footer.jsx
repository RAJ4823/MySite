import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Container maxWidth="lg" sx={{ py: 6, opacity: 0.8 }}>
      <Typography variant="body2" color="text.secondary" align="center">
        © MySite {new Date().getFullYear()} — Raj Patel 
      </Typography>
    </Container>
  );
}
