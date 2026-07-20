"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import InputLabel from '@mui/material/InputLabel';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';

export default function ApplicantPage() {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [availableDate, setAvailableDate] = React.useState<Dayjs | null>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setResumeFile(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const payload = {
      firstName,
      lastName,
      email,
      phone,
      availableDate: availableDate?.format('YYYY-MM-DD') ?? null,
      resumeName: resumeFile?.name ?? null,
    };

    try {
      const res = await fetch('/api/applicants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.error || res.statusText);
      }

      setSnackbarSeverity('success');
      setSnackbarMessage('Application Submitted! Please for your schedule');
      setSnackbarOpen(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setAvailableDate(null);
      setResumeFile(null);
    } catch (err) {
      console.error('Submit applicant error:', err);
      setSnackbarSeverity('error');
      setSnackbarMessage('Submission failed. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        py: 10,
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 40px 120px rgba(15, 23, 42, 0.08)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Stack spacing={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                  Apply for Job
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520, mx: 'auto' }}>
                  Complete your application for the role below. Upload your resume and choose the date you can start.
                </Typography>
              </Box>

              <Box
                sx={{
                  borderRadius: 3,
                  bgcolor: 'grey.50',
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Senior Parking Operations Specialist
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Lead the coordination of parking lot operations, manage customer reservations,
                  oversee vehicle entry and exit, and ensure a safe and efficient parking experience.
                  We’re looking for a detail-oriented professional who can deliver excellent customer service.
                </Typography>
              </Box>

              <Box component="form" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <Box
                    sx={{
                      display: 'grid',
                      gap: { xs: 2, sm: 3 },
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    }}
                  >
                    <TextField
                      label="First name"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      sx={{ flexGrow: 1 }}
                      required
                    />
                    <TextField
                      label="Last name"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      sx={{ flexGrow: 1 }}
                      required
                    />
                  </Box>

                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    fullWidth
                    required
                  />

                  <TextField
                    label="Phone number"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    fullWidth
                    required
                  />

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Available date"
                      placeholder="YYYY.MM.DD"
                      value={availableDate}
                      onChange={(date) => setAvailableDate(date)}
                      inputFormat="YYYY.MM.DD"
                      disableMaskedInput
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 24,
                              backgroundColor: 'background.paper',
                              border: '1px solid rgba(56, 137, 255, 0.28)',
                              '&:hover fieldset': {
                                borderColor: 'primary.main',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                                borderWidth: 2,
                              },
                            },
                            '& .MuiInputBase-input': {
                              padding: '14px 16px',
                            },
                          },
                        },
                        popper: {
                          sx: {
                            '& .MuiPaper-root': {
                              borderRadius: 24,
                              border: '1px solid rgba(56, 137, 255, 0.28)',
                              boxShadow: '0 24px 48px rgba(56, 137, 255, 0.12)',
                              overflow: 'hidden',
                              minWidth: 320,
                            },
                            '& .MuiPickersCalendarHeader-root': {
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              px: 3,
                              pt: 3,
                              pb: 1.5,
                            },
                            '& .MuiPickersCalendarHeader-label': {
                              fontSize: '1rem',
                              fontWeight: 700,
                            },
                            '& .MuiPickersCalendarHeader-switchViewButton': {
                              display: 'none',
                            },
                            '& .MuiPickersCalendarHeader-iconButton': {
                              color: 'primary.main',
                              border: '1px solid rgba(56, 137, 255, 0.22)',
                              backgroundColor: 'rgba(56, 137, 255, 0.08)',
                              borderRadius: '50%',
                              width: 36,
                              height: 36,
                              '&:hover': {
                                backgroundColor: 'rgba(56, 137, 255, 0.16)',
                              },
                            },
                            '& .MuiPickersDay-root': {
                              borderRadius: '50%',
                              width: 40,
                              height: 40,
                              margin: 3,
                              color: 'text.primary',
                            },
                            '& .MuiPickersDay-root.Mui-selected': {
                              backgroundColor: 'primary.main',
                              color: 'common.white',
                              boxShadow: 'none',
                            },
                            '& .MuiPickersDay-root.Mui-selected:hover': {
                              backgroundColor: 'primary.dark',
                            },
                            '& .MuiPickersDay-dayWithMargin': {
                              width: 40,
                              height: 40,
                            },
                            '& .MuiDayCalendar-weekDayLabel': {
                              color: 'text.secondary',
                              fontWeight: 700,
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>

                  <Box>
                    <InputLabel htmlFor="resume-upload" sx={{ mb: 1, display: 'block' }}>
                      Upload resume
                    </InputLabel>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{
                        justifyContent: 'space-between',
                        borderRadius: 3,
                        py: 1.5,
                        textTransform: 'none',
                      }}
                    >
                      {resumeFile?.name ?? 'Choose file'}
                      <input
                        hidden
                        id="resume-upload"
                        type="file"
                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleResumeChange}
                      />
                    </Button>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{ py: 1.75, fontWeight: 700, borderRadius: 3 }}
                  >
                    {isSubmitting ? 'Submitting…' : 'Apply'}
                  </Button>

                  <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    open={snackbarOpen}
                    autoHideDuration={5000}
                    onClose={handleSnackbarClose}
                  >
                    <Alert
                      onClose={handleSnackbarClose}
                      severity={snackbarSeverity}
                      sx={{ width: '100%' }}
                    >
                      {snackbarMessage}
                    </Alert>
                  </Snackbar>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
