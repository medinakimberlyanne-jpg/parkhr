import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
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

type HistoryStatus = 'Completed' | 'In Progress' | 'Cancelled';

interface ParkingHistoryRecord {
  id: number;
  entryDateTime: string;
  exitDateTime: string;
  ownerName: string;
  vehicleName: string;
  vehiclePlate: string;
  slotNumber: string;
  status: HistoryStatus;
}

const initialHistoryData: ParkingHistoryRecord[] = [
  {
    id: 1,
    entryDateTime: '2026-07-20T08:15',
    exitDateTime: '2026-07-20T11:40',
    ownerName: 'Maria Santos',
    vehicleName: 'Toyota Vios',
    vehiclePlate: 'XY68ZTR',
    slotNumber: 'A17',
    status: 'Completed',
  },
  {
    id: 2,
    entryDateTime: '2026-07-19T14:00',
    exitDateTime: '2026-07-19T16:30',
    ownerName: 'David Cruz',
    vehicleName: 'Honda City',
    vehiclePlate: 'PL8R34G',
    slotNumber: 'A05',
    status: 'Cancelled',
  },
  {
    id: 3,
    entryDateTime: '2026-07-18T09:45',
    exitDateTime: '2026-07-18T13:15',
    ownerName: 'Lara Tan',
    vehicleName: 'Mitsubishi Mirage',
    vehiclePlate: 'GHT-993',
    slotNumber: 'A09',
    status: 'In Progress',
  },
  {
    id: 4,
    entryDateTime: '2026-07-17T10:25',
    exitDateTime: '2026-07-17T12:00',
    ownerName: 'Noel Garcia',
    vehicleName: 'Suzuki Ertiga',
    vehiclePlate: 'MNT-221',
    slotNumber: 'A02',
    status: 'Completed',
  },
  {
    id: 5,
    entryDateTime: '2026-07-16T18:10',
    exitDateTime: '2026-07-16T21:20',
    ownerName: 'Ella Rivera',
    vehicleName: 'Nissan Almera',
    vehiclePlate: 'KLM-508',
    slotNumber: 'A13',
    status: 'Completed',
  },
];

const statusColor: Record<HistoryStatus, 'success' | 'warning' | 'error'> = {
  Completed: 'success',
  'In Progress': 'warning',
  Cancelled: 'error',
};

const toDateLabel = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

export default function HistoryPanel() {
  const [rows, setRows] = React.useState<ParkingHistoryRecord[]>(initialHistoryData);
  const [search, setSearch] = React.useState('');
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');
  const [editingRowId, setEditingRowId] = React.useState<number | null>(null);
  const [editForm, setEditForm] = React.useState<ParkingHistoryRecord | null>(null);

  const filteredRows = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const from = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
    const to = toDate ? new Date(`${toDate}T23:59:59`) : null;

    return rows.filter((row) => {
      const text = `${row.ownerName} ${row.vehiclePlate} ${row.slotNumber}`.toLowerCase();
      const matchesSearch = !query || text.includes(query);
      const entry = new Date(row.entryDateTime);
      const matchesFrom = !from || entry >= from;
      const matchesTo = !to || entry <= to;
      return matchesSearch && matchesFrom && matchesTo;
    });
  }, [rows, search, fromDate, toDate]);

  const statusSummary = React.useMemo(() => {
    return {
      completed: rows.filter((row) => row.status === 'Completed').length,
      inProgress: rows.filter((row) => row.status === 'In Progress').length,
      cancelled: rows.filter((row) => row.status === 'Cancelled').length,
    };
  }, [rows]);

  const handleDelete = (id: number) => {
    setRows((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (row: ParkingHistoryRecord) => {
    setEditingRowId(row.id);
    setEditForm({ ...row });
  };

  const handleSaveEdit = () => {
    if (!editForm || editingRowId === null) return;
    setRows((prev) => prev.map((row) => (row.id === editingRowId ? editForm : row)));
    setEditingRowId(null);
    setEditForm(null);
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
          Parking History
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          Review recent parking reservations and transaction history with searchable, editable records.
        </Typography>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
          gap: 1.5,
          mb: 2,
        }}
      >
        {[
          { label: 'Completed', value: statusSummary.completed, color: '#2e7d32' },
          { label: 'In Progress', value: statusSummary.inProgress, color: '#ed6c02' },
          { label: 'Cancelled', value: statusSummary.cancelled, color: '#d32f2f' },
        ].map((item) => (
          <Paper
            key={item.label}
            sx={{
              p: 1.75,
              borderRadius: 2.5,
              border: '1px solid rgba(15, 23, 42, 0.08)',
              backgroundColor: 'rgba(255,255,255,0.96)',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {item.label}
            </Typography>
            <Typography sx={{ mt: 0.5, fontWeight: 900, fontSize: 26, color: item.color }}>
              {item.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Paper sx={{ p: 2.25, borderRadius: 3, mb: 2, border: '1px solid rgba(15, 23, 42, 0.08)' }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.5} sx={{ alignItems: { lg: 'center' }, justifyContent: 'space-between' }}>
          <TextField
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by owner name, vehicle number, or slot"
            size="small"
            sx={{ width: { xs: '100%', lg: 440 } }}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ width: { xs: '100%', lg: 'auto' } }}>
            <TextField
              type="date"
              label="From"
              size="small"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ minWidth: 170 }}
            />
            <TextField
              type="date"
              label="To"
              size="small"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ minWidth: 170 }}
            />
            <Button
              variant="text"
              onClick={() => {
                setSearch('');
                setFromDate('');
                setToDate('');
              }}
              sx={{ textTransform: 'none', alignSelf: { xs: 'stretch', sm: 'center' } }}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'auto', width: '100%', border: '1px solid rgba(15, 23, 42, 0.08)' }}>
        <Table size="small" sx={{ minWidth: 1320 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(25, 118, 210, 0.08)' }}>
              <TableCell sx={{ fontWeight: 800 }}>Entry Date and Time</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Exit Date and Time</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Owner Name</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Vehicle Name</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Vehicle Number / Plate</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Slot Number</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ py: 3 }}>No parking history records found for the current search/filter.</TableCell>
              </TableRow>
            ) : filteredRows.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:last-of-type td': { borderBottom: 0 } }}>
                <TableCell sx={{ py: 1.5 }}>{toDateLabel(row.entryDateTime)}</TableCell>
                <TableCell sx={{ py: 1.5 }}>{toDateLabel(row.exitDateTime)}</TableCell>
                <TableCell sx={{ py: 1.5 }}>{row.ownerName}</TableCell>
                <TableCell sx={{ py: 1.5 }}>{row.vehicleName}</TableCell>
                <TableCell sx={{ py: 1.5, fontWeight: 700 }}>{row.vehiclePlate}</TableCell>
                <TableCell sx={{ py: 1.5 }}>{row.slotNumber}</TableCell>
                <TableCell>
                  <Chip label={row.status} color={statusColor[row.status]} size="small" sx={{ fontWeight: 700 }} />
                </TableCell>
                <TableCell align="right" sx={{ py: 1.5 }}>
                  <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                    <Button size="small" variant="outlined" sx={{ textTransform: 'none', fontWeight: 700 }} onClick={() => handleEdit(row)}>
                      Edit
                    </Button>
                    <Button size="small" variant="outlined" color="error" sx={{ textTransform: 'none', fontWeight: 700 }} onClick={() => handleDelete(row.id)}>
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={Boolean(editForm)} onClose={() => { setEditingRowId(null); setEditForm(null); }} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Parking Record</DialogTitle>
        <DialogContent>
          {editForm ? (
            <Stack spacing={1.5} sx={{ pt: 1 }}>
              <TextField
                label="Entry Date and Time"
                type="datetime-local"
                value={editForm.entryDateTime}
                onChange={(event) => setEditForm((prev) => prev ? { ...prev, entryDateTime: event.target.value } : prev)}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
              />
              <TextField
                label="Exit Date and Time"
                type="datetime-local"
                value={editForm.exitDateTime}
                onChange={(event) => setEditForm((prev) => prev ? { ...prev, exitDateTime: event.target.value } : prev)}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
              />
              <TextField
                label="Owner Name"
                value={editForm.ownerName}
                onChange={(event) => setEditForm((prev) => prev ? { ...prev, ownerName: event.target.value } : prev)}
                fullWidth
              />
              <TextField
                label="Vehicle Name"
                value={editForm.vehicleName}
                onChange={(event) => setEditForm((prev) => prev ? { ...prev, vehicleName: event.target.value } : prev)}
                fullWidth
              />
              <TextField
                label="Vehicle Number / Plate"
                value={editForm.vehiclePlate}
                onChange={(event) => setEditForm((prev) => prev ? { ...prev, vehiclePlate: event.target.value.toUpperCase() } : prev)}
                fullWidth
              />
              <TextField
                label="Slot Number"
                value={editForm.slotNumber}
                onChange={(event) => setEditForm((prev) => prev ? { ...prev, slotNumber: event.target.value } : prev)}
                fullWidth
              />
              <TextField
                select
                label="Status"
                value={editForm.status}
                onChange={(event) => setEditForm((prev) => prev ? { ...prev, status: event.target.value as HistoryStatus } : prev)}
                fullWidth
              >
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </TextField>
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setEditingRowId(null); setEditForm(null); }} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" sx={{ textTransform: 'none' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
