import { Box, Container } from '@mui/material';
import { HomePage } from '@/pages/home/ui/HomePage';

export function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
      <Container maxWidth="xl">
        <HomePage />
      </Container>
    </Box>
  );
}
