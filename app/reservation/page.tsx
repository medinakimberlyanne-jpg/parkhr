import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AppAppBar from '../../components/AppAppBar';
import ReservationPanel from '../../components/ReservationPanel';
import AppTheme from '../../theme/AppTheme';

export default function ReservationPage(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Box
        sx={{
          minHeight: '100vh',
          pt: { xs: 14, md: 18 },
          pb: 8,
          px: { xs: 2, md: 4 },
          background:
            'radial-gradient(circle at top, rgba(20, 184, 166, 0.16), transparent 30%), linear-gradient(180deg, #f8fffd 0%, #eef4ff 48%, #ffffff 100%)',
        }}
      >
        <Stack spacing={4} sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
          <Stack spacing={2}>
            <Chip
              label="Customer reservation portal"
              color="primary"
              variant="outlined"
              sx={{ alignSelf: 'flex-start', borderRadius: 999 }}
            />
            <Typography variant="h2" sx={{ maxWidth: 820, fontWeight: 900, letterSpacing: '-0.04em' }}>
              Reserve a clean, secure parking slot in a few taps.
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 760, fontWeight: 400 }}>
              Browse live availability, compare slot features, and manage your active booking without calling support or waiting in line.
            </Typography>
          </Stack>

          <ReservationPanel />
        </Stack>
      </Box>
    </AppTheme>
  );
}
