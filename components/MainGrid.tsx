import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import Copyright from '../Internals/components/Copyright';

type ReservationState = 'Active' | 'Upcoming' | 'Completed';

const parkingHourSeries = [5.5, 6.2, 4.8, 7.1, 6.6, 8.3, 5.9, 6.8, 7.4, 6.1, 8.0, 7.2];
const bookingCountSeries = [2, 3, 2, 4, 3, 5, 3, 4, 5, 4, 5, 4];
const chartLabels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'];

const summaryCards = [
  {
    title: 'Active Reservation',
    value: '1',
    detail: 'B2 Slot 18 until 6:30 PM',
    chip: 'Live',
  },
  {
    title: 'Pending Payments',
    value: '2',
    detail: 'PHP 420 awaiting payment',
    chip: 'Action Needed',
  },
  {
    title: 'Completed Bookings',
    value: '48',
    detail: 'Last 90 days',
    chip: 'On Track',
  },
  {
    title: 'Total Parking Hours',
    value: '79.9h',
    detail: 'Accumulated in the last 12 weeks',
    chip: 'Usage',
  },
];

const reservationTimeline: Array<{
  id: string;
  slot: string;
  location: string;
  schedule: string;
  state: ReservationState;
}> = [
  {
    id: 'R-2026-0718',
    slot: 'B2-18',
    location: 'North Wing',
    schedule: 'Today, 3:30 PM to 6:30 PM',
    state: 'Active',
  },
  {
    id: 'R-2026-0723',
    slot: 'A1-09',
    location: 'East Wing',
    schedule: 'Jul 23, 8:00 AM to 11:00 AM',
    state: 'Upcoming',
  },
  {
    id: 'R-2026-0715',
    slot: 'C3-04',
    location: 'South Wing',
    schedule: 'Jul 15, 1:00 PM to 4:00 PM',
    state: 'Completed',
  },
];

const recentParkingHistory = [
  { date: 'Jul 21, 2026', slot: 'B2-18', duration: '3.0h', payment: 'Paid', amount: 'PHP 210' },
  { date: 'Jul 19, 2026', slot: 'A1-11', duration: '2.5h', payment: 'Pending', amount: 'PHP 170' },
  { date: 'Jul 18, 2026', slot: 'A1-09', duration: '1.5h', payment: 'Paid', amount: 'PHP 110' },
  { date: 'Jul 16, 2026', slot: 'C3-04', duration: '4.0h', payment: 'Paid', amount: 'PHP 260' },
  { date: 'Jul 14, 2026', slot: 'B1-06', duration: '2.0h', payment: 'Pending', amount: 'PHP 150' },
];

function reservationChipColor(state: ReservationState): 'success' | 'warning' | 'default' {
  if (state === 'Active') return 'success';
  if (state === 'Upcoming') return 'warning';
  return 'default';
}

export default function MainGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Customer Parking Dashboard
      </Typography>

      <Grid container spacing={2.25} columns={12} sx={{ mb: 2.25 }}>
        {summaryCards.map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={1.25}>
                  <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2">{card.title}</Typography>
                    <Chip label={card.chip} size="small" color="success" />
                  </Stack>
                  <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.05 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.detail}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.25} columns={12} sx={{ mb: 2.25 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1.5}>
                <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Personal Parking History Charts
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Weekly trend of your parking usage and bookings.
                </Typography>
                <LineChart
                  xAxis={[
                    {
                      scaleType: 'point',
                      data: chartLabels,
                      height: 28,
                    },
                  ]}
                  yAxis={[{ width: 52, label: 'Hours' }]}
                  series={[
                    {
                      id: 'hours',
                      label: 'Parking Hours',
                      data: parkingHourSeries,
                      showMark: false,
                      area: true,
                      curve: 'linear',
                    },
                  ]}
                  height={250}
                  margin={{ top: 16, bottom: 0, left: 0, right: 16 }}
                  grid={{ horizontal: true }}
                />
                <Divider />
                <BarChart
                  xAxis={[
                    {
                      scaleType: 'band',
                      data: chartLabels,
                      height: 28,
                    },
                  ]}
                  yAxis={[{ width: 52, label: 'Bookings' }]}
                  series={[
                    {
                      id: 'bookings',
                      label: 'Completed Bookings',
                      data: bookingCountSeries,
                    },
                  ]}
                  height={220}
                  margin={{ top: 8, bottom: 0, left: 0, right: 16 }}
                  grid={{ horizontal: true }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1.5}>
                <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Active Reservation Status
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current and upcoming reservation checkpoints.
                </Typography>

                {reservationTimeline.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      p: 1.5,
                    }}
                  >
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {item.slot} - {item.location}
                      </Typography>
                      <Chip label={item.state} size="small" color={reservationChipColor(item.state)} />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {item.schedule}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Reference: {item.id}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card variant="outlined">
        <CardContent sx={{ p: 2.5 }}>
          <Stack spacing={1.5}>
            <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700 }}>
              Recent Parking Activity and Payments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Snapshot of your recent parking sessions, including pending and completed payments.
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Slot</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Payment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentParkingHistory.map((item) => (
                    <TableRow key={`${item.date}-${item.slot}`} hover>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.slot}</TableCell>
                      <TableCell>{item.duration}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.payment}
                          size="small"
                          color={item.payment === 'Pending' ? 'warning' : 'success'}
                        />
                      </TableCell>
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
