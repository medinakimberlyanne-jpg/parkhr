import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';

const statusDefinitions = {
  total: { label: 'TOTAL SPACE', color: 'common.white', background: '#0b3b8a' },
  available: { label: 'Available', color: 'common.white', background: '#f3c32c' },
  occupied: { label: 'Occupied', color: 'common.white', background: '#d32f2f' },
  reservation: { label: 'Reservation', color: 'common.white', background: '#0e2f73' },
};

const createSlots = () =>
  Array.from({ length: 60 }, (_, index) => {
    const id = index + 1;
    const code = `S${id}`;
    let status: keyof typeof statusDefinitions = 'available';

    if ([2, 3, 4, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 19, 20, 23, 24, 25, 27, 28, 29, 30, 33, 34, 35, 36, 38, 39, 44, 47, 51, 53, 54, 55, 56, 57, 58, 59, 60].includes(id)) {
      status = 'occupied';
    } else if ([1, 5, 6, 13, 18, 21, 22, 26, 31, 32, 37, 40, 41, 42, 43, 45, 46, 48, 49, 50, 52].includes(id)) {
      status = 'available';
    } else {
      status = 'reservation';
    }

    return { id, code, status };
  });

export default function ReservationPanel() {
  const slots = useMemo(() => createSlots(), []);

  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        borderRadius: 4,
        p: { xs: 3, md: 4 },
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', width: '100%' }}
        >
          {[
            { value: '60', ...statusDefinitions.total },
            { value: '60', ...statusDefinitions.available },
            { value: '30', ...statusDefinitions.occupied },
            { value: '60', ...statusDefinitions.reservation },
          ].map((item) => (
            <Box
              key={item.label}
              sx={{
                flex: 1,
                minWidth: 140,
                px: 3,
                py: 2.5,
                borderRadius: 3,
                bgcolor: item.background,
                color: item.color,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
                {item.value}
              </Typography>
              <Typography variant="button" sx={{ mt: 1, letterSpacing: 1, opacity: 0.9 }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
          <Button size="large" variant="contained" sx={{ bgcolor: '#0b3b8a', color: 'common.white', px: 4, py: 1.75, textTransform: 'none' }}>
            ADD VEHICLE
          </Button>
          <Button size="large" variant="contained" sx={{ bgcolor: '#0b3b8a', color: 'common.white', px: 4, py: 1.75, textTransform: 'none' }}>
            MANAGE RATES
          </Button>
        </Stack>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <TextField
            placeholder="search"
            variant="filled"
            size="small"
            InputProps={{
              disableUnderline: true,
              sx: {
                borderRadius: 2,
                bgcolor: '#e6e6e6',
                px: 2,
                py: 1,
                '& .MuiFilledInput-input': {
                  px: 0,
                },
              },
            }}
            sx={{ width: { xs: '100%', sm: 280 }, maxWidth: 360 }}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(5, minmax(0, 1fr))',
              sm: 'repeat(10, minmax(0, 1fr))',
            },
            gap: 1,
          }}
        >
          {slots.map((slot) => {
            const def = statusDefinitions[slot.status];
            return (
              <Box
                key={slot.id}
                sx={{
                  borderRadius: 1,
                  px: 1,
                  py: 1.25,
                  bgcolor: def.background,
                  color: def.color,
                  fontWeight: 700,
                  fontSize: 12,
                  textAlign: 'center',
                  boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08)',
                }}
              >
                {slot.code}
              </Box>
            );
          })}
        </Box>
      </Stack>
    </Paper>
  );
}
