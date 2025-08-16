import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';

export default function Section({ id, children, maxWidth = 'lg', disableGutters = false }) {
  return (
    <Box id={id} sx={{ py: { xs: 6, md: 10 }, scrollMarginTop: { xs: 64, md: 80 } }}>
      <Container maxWidth={maxWidth} disableGutters={disableGutters}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
          {children}
        </motion.div>
      </Container>
    </Box>
  );
}
