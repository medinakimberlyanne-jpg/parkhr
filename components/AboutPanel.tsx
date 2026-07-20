import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function AboutPanel() {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        About
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ParkHR — Parking lot management and reservation system.
        </Typography>
        <Stack spacing={1}>
          <List dense>
            <ListItem>
              <ListItemText primary="Version" secondary="0.1.0" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Environment" secondary={process.env.NODE_ENV || 'development'} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Backend" secondary="Express + MongoDB (optional local server)" />
            </ListItem>
          </List>
        </Stack>
      </Paper>
    </Box>
  );
}
