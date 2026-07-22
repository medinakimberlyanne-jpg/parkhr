import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ReservationPanel from '../ReservationPanel';
import HistoryPanel from '../HistoryPanel';
import SettingsPanel from '../SettingsPanel';
import AboutPanel from '../AboutPanel';
import FeedbackPanel from '../FeedbackPanel';
import PaymentPanel from '../PaymentPanel';
import AdminUserStaffManagement from './AdminUserStaffManagement';

interface AdminDashboardContentProps {
  section: string;
}

const sectionMap: Record<string, ReactNode> = {
  Home: (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Admin Home Dashboard
      </Typography>
      <Typography color="text.secondary">
        Welcome back! Use the sidebar to navigate between the admin modules.
      </Typography>
    </Paper>
  ),
  Reservation: (
    <Stack spacing={3}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Reservation Center
        </Typography>
        <Typography color="text.secondary">
          Manage reservations and check available parking zones here.
        </Typography>
      </Paper>
      <ReservationPanel />
    </Stack>
  ),
  'Parking Spaces': (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Parking Spaces
      </Typography>
      <Typography color="text.secondary">
        View and control the parking space layout without leaving the dashboard.
      </Typography>
    </Paper>
  ),
  History: (
    <Stack spacing={3}>
      <HistoryPanel />
    </Stack>
  ),
  'User Management': (
    <Stack spacing={3}>
      <AdminUserStaffManagement moduleView="User Management" />
    </Stack>
  ),
  'Staff Management': (
    <Stack spacing={3}>
      <AdminUserStaffManagement moduleView="Staff Management" />
    </Stack>
  ),
  'Roles & Permissions': (
    <Stack spacing={3}>
      <AdminUserStaffManagement moduleView="Roles & Permissions" />
    </Stack>
  ),
  Payment: (
    <Stack spacing={3}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Payment
        </Typography>
        <Typography color="text.secondary">
          Manage invoice details and payment settings right here.
        </Typography>
      </Paper>
      <PaymentPanel />
    </Stack>
  ),
  Settings: (
    <Stack spacing={3}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Settings
        </Typography>
        <Typography color="text.secondary">Configure your dashboard preferences and account settings.</Typography>
      </Paper>
      <SettingsPanel />
    </Stack>
  ),
  About: (
    <Stack spacing={3}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          About
        </Typography>
        <Typography color="text.secondary">Learn more about the parking management dashboard and features.</Typography>
      </Paper>
      <AboutPanel />
    </Stack>
  ),
  Feedback: (
    <Stack spacing={3}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Feedback
        </Typography>
        <Typography color="text.secondary">Share your feedback and suggestions with the team.</Typography>
      </Paper>
      <FeedbackPanel />
    </Stack>
  ),
};

export default function AdminDashboardContent({ section }: AdminDashboardContentProps) {
  return (
    <Box sx={{ width: '100%', minHeight: '100%', px: { xs: 0, md: 0 } }}>
      {sectionMap[section] ?? sectionMap.Home}
    </Box>
  );
}