import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

type PaymentStatus = 'Paid' | 'Pending' | 'Failed';
type PaymentMethod = 'GCash' | 'Cash' | 'Card';

interface PaymentRecord {
  date: string;
  billing: string;
  amount: number;
  status: PaymentStatus;
  transactionId: string;
  paymentMethod: PaymentMethod;
}

const payments: PaymentRecord[] = [
  {
    date: '2026-07-20',
    billing: 'Parking reservation A17',
    amount: 1025.5,
    status: 'Paid',
    transactionId: 'TXN-98432',
    paymentMethod: 'GCash',
  },
  {
    date: '2026-07-18',
    billing: 'Monthly parking plan',
    amount: 6650,
    status: 'Pending',
    transactionId: 'TXN-97652',
    paymentMethod: 'Card',
  },
  {
    date: '2026-07-15',
    billing: 'Parking reservation A09',
    amount: 540.25,
    status: 'Paid',
    transactionId: 'TXN-96231',
    paymentMethod: 'Cash',
  },
  {
    date: '2026-07-12',
    billing: 'Cancellation fee',
    amount: 275,
    status: 'Failed',
    transactionId: 'TXN-94811',
    paymentMethod: 'GCash',
  },
];

const statusColor: Record<PaymentStatus, 'success' | 'warning' | 'error'> = {
  Paid: 'success',
  Pending: 'warning',
  Failed: 'error',
};

const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
});

const toDateLabel = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));

export default function PaymentPanel() {
  const [search, setSearch] = React.useState('');
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');

  const filteredPayments = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const from = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
    const to = toDate ? new Date(`${toDate}T23:59:59`) : null;

    return payments.filter((payment) => {
      const searchable = `${payment.transactionId} ${payment.billing}`.toLowerCase();
      const matchesSearch = !query || searchable.includes(query);
      const paymentDate = new Date(`${payment.date}T00:00:00`);
      const matchesFrom = !from || paymentDate >= from;
      const matchesTo = !to || paymentDate <= to;

      return matchesSearch && matchesFrom && matchesTo;
    });
  }, [search, fromDate, toDate]);

  const handleResetFilters = () => {
    setSearch('');
    setFromDate('');
    setToDate('');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        sx={{
          p: { xs: 2, md: 2.75 },
          borderRadius: 3,
          mb: 2,
          border: '1px solid rgba(15, 23, 42, 0.08)',
          background: 'linear-gradient(135deg, rgba(25,118,210,0.08) 0%, rgba(255,255,255,1) 55%)',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Payment Records
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          Browse billing activity, receipt access, and transaction status across your account.
        </Typography>
      </Paper>

      <Paper sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 3, border: '1px solid rgba(15, 23, 42, 0.08)', mb: 2 }}>
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={1.25}
          sx={{ alignItems: { lg: 'flex-end' }, justifyContent: 'space-between' }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' },
              gap: 1.25,
              width: '100%',
              maxWidth: 920,
            }}
          >
            <TextField
              size="small"
              label="Search by transaction ID or billing"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <TextField
              size="small"
              label="From"
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              size="small"
              label="To"
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Button variant="outlined" onClick={handleResetFilters} sx={{ textTransform: 'none', fontWeight: 700 }}>
            Reset Filters
          </Button>
        </Stack>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'auto', width: '100%', border: '1px solid rgba(15, 23, 42, 0.08)' }}>
        <Table sx={{ minWidth: 1180 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(25, 118, 210, 0.08)' }}>
              <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Billing</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Payment Method</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Transaction ID</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ py: 3 }}>
                  No payment records found for the selected filters.
                </TableCell>
              </TableRow>
            ) : filteredPayments.map((payment) => (
              <TableRow key={payment.transactionId} hover sx={{ '& > td': { py: 1.6, verticalAlign: 'middle' } }}>
                <TableCell>{toDateLabel(payment.date)}</TableCell>
                <TableCell>{payment.billing}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{pesoFormatter.format(payment.amount)}</TableCell>
                <TableCell>
                  <Chip label={payment.status} color={statusColor[payment.status]} size="small" sx={{ fontWeight: 700 }} />
                </TableCell>
                <TableCell>{payment.transactionId}</TableCell>
                <TableCell align="right">
                  <Button size="small" variant="outlined" sx={{ textTransform: 'none', fontWeight: 700 }}>
                    View/Download Receipt
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
