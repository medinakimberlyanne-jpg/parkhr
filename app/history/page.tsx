import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AppAppBar from '../../components/AppAppBar';
import HistoryPanel from '../../components/HistoryPanel';
import AppTheme from '../../theme/AppTheme';

export default function HistoryPage(props: { disableCustomTheme?: boolean }) {
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
            'radial-gradient(circle at top left, rgba(29, 78, 216, 0.12), transparent 30%), linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)',
        }}
      >
        <Stack spacing={4} sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 5,
              border: '1px solid rgba(15, 23, 42, 0.08)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(239,246,255,0.94) 100%)',
            }}
          >
            <Stack spacing={2}>
              <Chip
                label="Customer activity"
                color="primary"
                variant="outlined"
                sx={{ alignSelf: 'flex-start', borderRadius: 999 }}
              />
              <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em' }}>
                Track every booking and visit.
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 760, fontWeight: 400 }}>
                View recent reservations, slot usage, and completed parking sessions in a single clean history view.
              </Typography>
            </Stack>
          </Paper>

          <HistoryPanel />
        </Stack>
      </Box>
    </AppTheme>
  );
}
