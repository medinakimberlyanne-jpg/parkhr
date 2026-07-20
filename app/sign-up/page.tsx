"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function SignUpPage() {
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('');

  async function fileToBase64(file: File): Promise<string> {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const form = new FormData(e.currentTarget as HTMLFormElement);
      const payload: Record<string, any> = {};
      for (const [key, value] of form.entries()) {
        if (key === 'picture') {
          const file = value as File;
          if (file && file.size) {
            payload.pictureName = file.name;
            payload.pictureBase64 = await fileToBase64(file);
          }
        } else {
          payload[key] = value;
        }
      }

      const res = await fetch(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error('Server returned non-JSON response: ' + (text ? text.substring(0, 100) : '<empty>'));
      }

      if (res.ok) setMessage('Sign-up saved (id: ' + (data.insertedId || '') + ')');
      else {
        const err = data.error || res.statusText;
        setMessage('Error: ' + err);
        if (res.status === 409) {
          setSnackbarMsg('Email already in use');
          setSnackbarOpen(true);
        }
      }
    } catch (err: any) {
      setMessage('Error: ' + (err?.message || String(err)));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
          }}
        >
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Create your account
          </Typography>
          <Typography
            component="p"
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Sign up for access to your dashboard, onboarding tools, and team management.
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="First name"
                  name="firstName"
                  autoComplete="given-name"
                />
                <TextField
                  fullWidth
                  label="Last name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Stack>
              <TextField
                fullWidth
                label="Username"
                name="username"
                autoComplete="username"
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
              />
              <TextField
                fullWidth
                label="Plate number"
                name="plateNumber"
                autoComplete="license-plate"
              />
              <TextField
                fullWidth
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
              />
              <TextField
                fullWidth
                label="Driver license"
                name="driverLicense"
                autoComplete="off"
              />
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ textTransform: 'none' }}
              >
                Upload picture
                <input hidden accept="image/*" type="file" name="picture" />
              </Button>
              {/* <FormControlLabel
                control={<Checkbox color="primary" />}
                label="I agree to the terms and privacy policy"
              /> */}
            </Stack>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={submitting}>
              {submitting ? 'Signing up…' : 'Sign Up'}
            </Button>
            {message && (
              <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1 }}>
                {message}
              </Typography>
            )}
            <Typography variant="body2" align="center" color="text.secondary">
              Already have an account? Log in instead.
            </Typography>
          </Box>
        </Paper>
      </Container>
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="warning">{snackbarMsg}</Alert>
      </Snackbar>
    </Box>
  );
}
