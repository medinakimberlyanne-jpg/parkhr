import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const historyData = [
  { date: '2026-07-20', vehicle: 'XY68ZTR', slot: 'A17', status: 'Completed' },
  { date: '2026-07-19', vehicle: 'PL8R34G', slot: 'A05', status: 'Cancelled' },
  { date: '2026-07-18', vehicle: 'GHT-993', slot: 'A09', status: 'In progress' },
  { date: '2026-07-17', vehicle: 'MNT-221', slot: 'A02', status: 'Completed' },
  { date: '2026-07-16', vehicle: 'KLM-508', slot: 'A13', status: 'Completed' },
];

const statusColor: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  Completed: 'success',
  'In progress': 'warning',
  Cancelled: 'error',
  Pending: 'default',
};

export default function HistoryPanel() {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Parking History
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review recent parking reservations and transaction history.
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Vehicle</TableCell>
              <TableCell>Slot Number</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historyData.map((row) => (
              <TableRow key={`${row.date}-${row.vehicle}`} hover>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.vehicle}</TableCell>
                <TableCell>{row.slot}</TableCell>
                <TableCell>
                  <Chip label={row.status} color={statusColor[row.status] || 'default'} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
