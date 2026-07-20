import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

const payments = [
  {
    date: '2026-07-20',
    billing: 'Parking reservation A17',
    amount: '$18.50',
    status: 'Paid',
    transaction: 'TXN-98432',
  },
  {
    date: '2026-07-18',
    billing: 'Monthly parking plan',
    amount: '$120.00',
    status: 'Pending',
    transaction: 'TXN-97652',
  },
  {
    date: '2026-07-15',
    billing: 'Parking reservation A09',
    amount: '$9.75',
    status: 'Paid',
    transaction: 'TXN-96231',
  },
  {
    date: '2026-07-12',
    billing: 'Cancellation fee',
    amount: '$5.00',
    status: 'Failed',
    transaction: 'TXN-94811',
  },
];

const statusColor: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  Paid: 'success',
  Pending: 'warning',
  Failed: 'error',
};

export default function PaymentPanel() {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
        Payment Records
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Browse recent billing activity, transaction details, and payment status.
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Billing</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Transaction</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.transaction} hover>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.billing}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>
                  <Chip label={payment.status} color={statusColor[payment.status] || 'default'} size="small" />
                </TableCell>
                <TableCell>{payment.transaction}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
