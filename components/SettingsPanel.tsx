import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';

export default function SettingsPanel() {
  const [name, setName] = React.useState('Riley Carter');
  const [email, setEmail] = React.useState('riley@email.com');
  const [notifyEmail, setNotifyEmail] = React.useState(true);
  const [notifySms, setNotifySms] = React.useState(false);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Settings
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Profile
        </Typography>
        <Stack spacing={2}>
          <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <Button variant="contained" sx={{ width: 120 }} onClick={() => alert('Profile saved')}>
            Save
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Notifications
        </Typography>
        <Stack spacing={1}>
          <FormControlLabel
            control={<Switch checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} />}
            label="Email notifications"
          />
          <FormControlLabel
            control={<Switch checked={notifySms} onChange={(e) => setNotifySms(e.target.checked)} />}
            label="SMS notifications"
          />
        </Stack>
      </Paper>
    </Box>
  );
}
