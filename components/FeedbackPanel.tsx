import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const sampleFeedback = [
  { id: 1, name: 'Alice', message: 'Great UI, easy to use.' },
  { id: 2, name: 'Bob', message: 'Please add more payment options.' },
];

export default function FeedbackPanel() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [list, setList] = React.useState(sampleFeedback);
  const [open, setOpen] = React.useState(false);

  const handleSubmit = () => {
    if (!message) return setOpen(true);
    const entry = { id: Date.now(), name: name || 'Anonymous', message };
    setList((prev) => [entry, ...prev]);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Feedback
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Stack spacing={2}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField label="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Recent feedback
        </Typography>
        <List>
          {list.map((f) => (
            <ListItem key={f.id} alignItems="flex-start">
              <ListItemText primary={f.name} secondary={f.message} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert severity="warning">Please enter a message before submitting.</Alert>
      </Snackbar>
    </Box>
  );
}
