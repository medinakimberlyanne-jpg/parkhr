import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import Copyright from '../../Internals/components/Copyright';

const statCards = [
  {
    title: 'Total Registered Users',
    value: '12,846',
    trend: '+6.4%',
    subtitle: 'Compared to previous month',
    tone: 'success' as const,
  },
  {
    title: 'Active Parking Slots',
    value: '214 / 260',
    trend: '82.3%',
    subtitle: 'Currently available for booking',
    tone: 'primary' as const,
  },
  {
    title: "Today's Bookings",
    value: '168',
    trend: '+14',
    subtitle: 'Higher than yesterday',
    tone: 'info' as const,
  },
  {
    title: 'Total Revenue',
    value: 'PHP 1,284,530',
    trend: '+9.8%',
    subtitle: 'Month-to-date collections',
    tone: 'success' as const,
  },
];

const dailyRevenueLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dailyRevenueData = [154000, 168500, 162200, 178300, 186100, 194500, 181800];
const monthlyRevenueLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const monthlyRevenueData = [880000, 920000, 965000, 1032000, 1105000, 1190000, 1284530];

const peakHourLabels = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'];
const weekdayOccupancy = [22, 38, 56, 73, 79, 88, 94, 68];
const weekendOccupancy = [15, 29, 47, 64, 71, 80, 90, 61];

const slotZoneRows = [
  { zone: 'North Wing', total: 78, occupied: 62, occupancy: '79%' },
  { zone: 'Central Deck', total: 104, occupied: 89, occupancy: '86%' },
  { zone: 'South Wing', total: 78, occupied: 57, occupancy: '73%' },
];

export default function AdminMainGrid() {
  const theme = useTheme();
  const chartStroke = theme.palette.primary.main;
  const chartFill = alpha(theme.palette.primary.main, 0.2);

  return (
    <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2.25, fontWeight: 800 }}>
        Admin Analytics Overview
      </Typography>

      <Grid container spacing={2.5} columns={12} sx={{ mb: 2.75 }}>
        {statCards.map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, xl: 3 }}>
            <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={1.25}>
                  <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      {card.title}
                    </Typography>
                    <Chip size="small" color={card.tone} label={card.trend} sx={{ fontWeight: 700 }} />
                  </Stack>
                  <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.08 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {card.subtitle}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} columns={12} sx={{ mb: 2.75 }}>
        <Grid size={{ xs: 12, xl: 7 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 2.75 }}>
              <Stack spacing={2}>
                <Stack spacing={0.75}>
                  <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Daily and Monthly Revenue Chart
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Monitor revenue flow for operational planning and monthly performance checks.
                  </Typography>
                </Stack>

                <LineChart
                  xAxis={[{ scaleType: 'point', data: monthlyRevenueLabels, height: 28 }]}
                  yAxis={[{ width: 64 }]}
                  series={[
                    {
                      id: 'monthly-revenue',
                      label: 'Monthly Revenue',
                      data: monthlyRevenueData,
                      area: true,
                      showMark: false,
                      color: chartStroke,
                      curve: 'linear',
                    },
                  ]}
                  height={245}
                  margin={{ top: 10, bottom: 0, left: 0, right: 16 }}
                  grid={{ horizontal: true }}
                  sx={{ '& .MuiAreaElement-series-monthly-revenue': { fill: chartFill } }}
                />

                <BarChart
                  xAxis={[{ scaleType: 'band', data: dailyRevenueLabels, height: 28 }]}
                  yAxis={[{ width: 64 }]}
                  series={[{ id: 'daily-revenue', label: 'Daily Revenue', data: dailyRevenueData }]}
                  height={215}
                  margin={{ top: 8, bottom: 0, left: 0, right: 16 }}
                  grid={{ horizontal: true }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, xl: 5 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 2.75 }}>
              <Stack spacing={2}>
                <Stack spacing={0.75}>
                  <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Peak Hours Occupancy Chart
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Compare weekday and weekend occupancy to optimize staffing and slot allocation.
                  </Typography>
                </Stack>

                <BarChart
                  xAxis={[{ scaleType: 'band', data: peakHourLabels, height: 28 }]}
                  yAxis={[{ width: 52, min: 0, max: 100 }]}
                  series={[
                    { id: 'weekday', label: 'Weekday Occupancy (%)', data: weekdayOccupancy },
                    { id: 'weekend', label: 'Weekend Occupancy (%)', data: weekendOccupancy },
                  ]}
                  height={322}
                  margin={{ top: 18, bottom: 0, left: 0, right: 16 }}
                  grid={{ horizontal: true }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 2.75 }}>
          <Stack spacing={1.75}>
            <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 800 }}>
              Slot Utilization by Zone
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Zone</TableCell>
                    <TableCell>Total Slots</TableCell>
                    <TableCell>Occupied Slots</TableCell>
                    <TableCell>Occupancy Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {slotZoneRows.map((row) => (
                    <TableRow key={row.zone} hover>
                      <TableCell>{row.zone}</TableCell>
                      <TableCell>{row.total}</TableCell>
                      <TableCell>{row.occupied}</TableCell>
                      <TableCell>{row.occupancy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </CardContent>
      </Card>

      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
