import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';

// Section with optional glass background wrapper to improve readability over 3D background
export default function Section({
  id,
  children,
  maxWidth = 'lg',
  disableGutters = false,
  glass = true,
  contentSx = {},
}) {
  return (
    <Box id={id} sx={{ py: { xs: 3, md: 5 }, scrollMarginTop: { xs: 64, md: 80 } }}>
      <Container maxWidth={maxWidth} disableGutters={disableGutters}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              ...(glass
                ? {
                    p: { xs: 2, md: 3 },
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'rgba(124,58,237,0.35)',
                    bgcolor: 'rgba(16,14,24,0.45)',
                    boxShadow: '0 10px 30px rgba(124,58,237,0.15)',
                    backdropFilter: { xs: 'blur(4px)', md: 'blur(6px)' },
                  }
                : {}),
              ...contentSx,
            }}
          >
            {children}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
