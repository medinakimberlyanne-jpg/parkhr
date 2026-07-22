import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AppAppBar from '../../components/AppAppBar';
import ReservationPanel from '../../components/ReservationPanel';
import AppTheme from '../../theme/AppTheme';

export default function ParkingSpacesPage(props: { disableCustomTheme?: boolean }) {
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
            'radial-gradient(circle at top right, rgba(59, 130, 246, 0.14), transparent 32%), linear-gradient(180deg, #f7fbff 0%, #f6fff9 50%, #ffffff 100%)',
        }}
      >
        <Stack spacing={4} sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 5,
              border: '1px solid rgba(15, 23, 42, 0.08)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(236,253,245,0.92) 100%)',
            }}
          >
            <Stack spacing={2.5}>
              <Chip
                label="Real-time parking availability"
                color="primary"
                variant="outlined"
                sx={{ alignSelf: 'flex-start', borderRadius: 999 }}
              />
              <Typography variant="h2" sx={{ maxWidth: 760, fontWeight: 900, letterSpacing: '-0.04em' }}>
                Find the best slot before you arrive.
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 720, fontWeight: 400 }}>
                Explore available bays by zone, price, and parking features. Select any open slot to launch the reservation process immediately.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button href="/reservation" variant="contained" sx={{ textTransform: 'none', borderRadius: 999, px: 3, py: 1.25 }}>
                  Open full reservation portal
                </Button>
                <Button href="/history" variant="outlined" sx={{ textTransform: 'none', borderRadius: 999, px: 3, py: 1.25 }}>
                  Review booking history
                </Button>
              </Stack>
            </Stack>
          </Paper>

          <ReservationPanel
            compact
            title="Choose your slot"
            subtitle="Available spaces are clickable and immediately load into the reservation form. Admin-only rate and vehicle controls are removed from this customer view."
          />
        </Stack>
      </Box>
    </AppTheme>
  );
}
