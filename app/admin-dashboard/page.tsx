"use client";
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../store/store';
import AdminAppNavbar from '../../components/admin/AdminAppNavbar';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminMainGrid from '../../components/admin/AdminMainGrid';
import AdminSideMenu from '../../components/admin/AdminSideMenu';
import AdminDashboardContent from '../../components/admin/AdminDashboardContent';
import AppTheme from '../../theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '../../theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function AdminDashboard(props: { disableCustomTheme?: boolean }) {
  const [selectedSection, setSelectedSection] = React.useState('Home');
  const router = useRouter();
  const user = useAppSelector((s) => s.user.user);

  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  };

  React.useEffect(() => {
    // if user is not in redux store and no userId cookie, redirect to login
    const id = getCookie('userId');
    if (!user && !id) {
      router.replace('/login');
    }
  }, [user, router]);

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <AdminSideMenu selectedSection={selectedSection} onSelectSection={setSelectedSection} />
        <AdminAppNavbar selectedSection={selectedSection} onSelectSection={setSelectedSection} />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'stretch',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <AdminHeader />
            <Box sx={{ width: '100%', maxWidth: 1700, mx: 'auto' }}>
              {selectedSection === 'Home' ? (
                <AdminMainGrid />
              ) : (
                <AdminDashboardContent section={selectedSection} />
              )}
            </Box>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}