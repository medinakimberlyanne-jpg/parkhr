import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

type UserRole = 'Admin' | 'Staff' | 'Customer';
type UserStatus = 'Active' | 'Inactive';
type AdminModuleView = 'User Management' | 'Staff Management' | 'Roles & Permissions';

interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

interface AdminUserStaffManagementProps {
  moduleView: AdminModuleView;
}

const initialUsers: UserRecord[] = [
  { id: 1, name: 'Kimberly Flores', email: 'kimberly@parkhr.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Noel Garcia', email: 'noel.garcia@parkhr.com', role: 'Staff', status: 'Active' },
  { id: 3, name: 'Ella Rivera', email: 'ella.rivera@parkhr.com', role: 'Staff', status: 'Inactive' },
  { id: 4, name: 'Maria Santos', email: 'maria.santos@email.com', role: 'Customer', status: 'Active' },
  { id: 5, name: 'David Cruz', email: 'david.cruz@email.com', role: 'Customer', status: 'Inactive' },
];

const statusColorMap: Record<UserStatus, 'success' | 'default'> = {
  Active: 'success',
  Inactive: 'default',
};

const viewMeta: Record<AdminModuleView, { title: string; subtitle: string }> = {
  'User Management': {
    title: 'User Management',
    subtitle: 'Manage all account records, statuses, and role assignments in one place.',
  },
  'Staff Management': {
    title: 'Staff Management',
    subtitle: 'Focus on team members, staffing roles, and account status updates.',
  },
  'Roles & Permissions': {
    title: 'Roles & Permissions',
    subtitle: 'Control role assignments and keep permission ownership organized by account type.',
  },
};

const roleBadgeColor: Record<UserRole, 'primary' | 'info' | 'success'> = {
  Admin: 'primary',
  Staff: 'info',
  Customer: 'success',
};

type FormState = {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

const emptyForm: FormState = {
  name: '',
  email: '',
  role: 'Customer',
  status: 'Active',
};

type DialogMode = 'add' | 'edit' | 'role' | null;

export default function AdminUserStaffManagement({ moduleView }: AdminUserStaffManagementProps) {
  const [rows, setRows] = React.useState<UserRecord[]>(initialUsers);
  const [search, setSearch] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<'All' | UserRole>(
    moduleView === 'Staff Management' ? 'Staff' : 'All',
  );
  const [statusFilter, setStatusFilter] = React.useState<'All' | UserStatus>('All');
  const [dialogMode, setDialogMode] = React.useState<DialogMode>(null);
  const [selectedRowId, setSelectedRowId] = React.useState<number | null>(null);
  const [form, setForm] = React.useState<FormState>(emptyForm);

  React.useEffect(() => {
    if (moduleView === 'Staff Management') {
      setRoleFilter('Staff');
      return;
    }
    setRoleFilter('All');
  }, [moduleView]);

  const baseRows = React.useMemo(() => {
    if (moduleView === 'Staff Management') {
      return rows.filter((row) => row.role === 'Staff');
    }
    return rows;
  }, [rows, moduleView]);

  const filteredRows = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    return baseRows.filter((row) => {
      const text = `${row.name} ${row.email}`.toLowerCase();
      const matchesSearch = !query || text.includes(query);
      const matchesRole = roleFilter === 'All' || row.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || row.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [baseRows, search, roleFilter, statusFilter]);

  const summary = React.useMemo(() => {
    const sourceRows = moduleView === 'Roles & Permissions' ? rows : baseRows;
    const active = sourceRows.filter((row) => row.status === 'Active').length;
    const inactive = sourceRows.filter((row) => row.status === 'Inactive').length;
    const admins = sourceRows.filter((row) => row.role === 'Admin').length;
    const staff = sourceRows.filter((row) => row.role === 'Staff').length;
    const customers = sourceRows.filter((row) => row.role === 'Customer').length;

    return {
      total: sourceRows.length,
      active,
      inactive,
      admins,
      staff,
      customers,
    };
  }, [rows, baseRows, moduleView]);

  const openAddDialog = () => {
    setDialogMode('add');
    setSelectedRowId(null);
    setForm(emptyForm);
  };

  const openEditDialog = (row: UserRecord) => {
    setDialogMode('edit');
    setSelectedRowId(row.id);
    setForm({
      name: row.name,
      email: row.email,
      role: row.role,
      status: row.status,
    });
  };

  const openRoleDialog = (row: UserRecord) => {
    setDialogMode('role');
    setSelectedRowId(row.id);
    setForm({
      name: row.name,
      email: row.email,
      role: row.role,
      status: row.status,
    });
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedRowId(null);
  };

  const handleSaveDialog = () => {
    if (dialogMode === 'add') {
      const nextId = rows.length === 0 ? 1 : Math.max(...rows.map((row) => row.id)) + 1;
      setRows((prev) => [
        {
          id: nextId,
          name: form.name,
          email: form.email,
          role: form.role,
          status: form.status,
        },
        ...prev,
      ]);
      closeDialog();
      return;
    }

    if (selectedRowId === null) {
      return;
    }

    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== selectedRowId) {
          return row;
        }

        if (dialogMode === 'role') {
          return { ...row, role: form.role };
        }

        return {
          ...row,
          name: form.name,
          email: form.email,
          role: form.role,
          status: form.status,
        };
      }),
    );
    closeDialog();
  };

  const handleDeactivateOrDelete = (row: UserRecord) => {
    if (row.status === 'Active') {
      setRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, status: 'Inactive' } : item)));
      return;
    }

    setRows((prev) => prev.filter((item) => item.id !== row.id));
  };

  const handleFormRoleChange = (event: SelectChangeEvent<UserRole>) => {
    setForm((prev) => ({ ...prev, role: event.target.value as UserRole }));
  };

  const handleFormStatusChange = (event: SelectChangeEvent<UserStatus>) => {
    setForm((prev) => ({ ...prev, status: event.target.value as UserStatus }));
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setRoleFilter(moduleView === 'Staff Management' ? 'Staff' : 'All');
  };

  return (
    <Stack spacing={2.25} sx={{ width: '100%' }}>
      <Paper
        sx={{
          p: { xs: 2, md: 2.75 },
          borderRadius: 3,
          border: '1px solid rgba(15, 23, 42, 0.08)',
          background: 'linear-gradient(135deg, rgba(25,118,210,0.08) 0%, rgba(255,255,255,1) 55%)',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {viewMeta[moduleView].title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          {viewMeta[moduleView].subtitle}
        </Typography>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: moduleView === 'Roles & Permissions' ? 'repeat(3, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))',
          },
          gap: 1.25,
        }}
      >
        {[
          { label: 'Total Accounts', value: summary.total, color: '#1e293b' },
          { label: 'Active', value: summary.active, color: '#2e7d32' },
          { label: 'Inactive', value: summary.inactive, color: '#616161' },
          ...(moduleView === 'Roles & Permissions'
            ? [
                { label: 'Admins', value: summary.admins, color: '#1976d2' },
                { label: 'Staff', value: summary.staff, color: '#0288d1' },
                { label: 'Customers', value: summary.customers, color: '#2e7d32' },
              ]
            : [{ label: moduleView === 'Staff Management' ? 'Staff Accounts' : 'Customer Accounts', value: moduleView === 'Staff Management' ? summary.staff : summary.customers, color: moduleView === 'Staff Management' ? '#0288d1' : '#2e7d32' }]),
        ].map((metric) => (
          <Paper
            key={metric.label}
            sx={{ p: 1.6, borderRadius: 2.5, border: '1px solid rgba(15, 23, 42, 0.08)', bgcolor: 'background.paper' }}
          >
            <Typography variant="body2" color="text.secondary">
              {metric.label}
            </Typography>
            <Typography sx={{ mt: 0.4, fontWeight: 900, fontSize: 24, color: metric.color }}>
              {metric.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {moduleView === 'Roles & Permissions' ? (
        <Paper sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 3, border: '1px solid rgba(15, 23, 42, 0.08)' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.35fr 1fr' },
              gap: 1.5,
            }}
          >
            <Stack spacing={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Role Access Matrix
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ flexWrap: 'wrap' }}>
                <Chip label="Admin: Full platform control" color="primary" variant="outlined" sx={{ borderRadius: 2 }} />
                <Chip label="Staff: Reservations and operations" color="info" variant="outlined" sx={{ borderRadius: 2 }} />
                <Chip label="Customer: Booking and payment" color="success" variant="outlined" sx={{ borderRadius: 2 }} />
              </Stack>
            </Stack>
            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Permission Tip
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Use Change Role to update access while keeping the account history and status intact.
              </Typography>
            </Paper>
          </Box>
        </Paper>
      ) : null}

      <Paper sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 3, border: '1px solid rgba(15, 23, 42, 0.08)' }}>
        <Stack spacing={1.25} sx={{ mb: 1.75 }}>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={1.25}
            sx={{ justifyContent: 'space-between', alignItems: { lg: 'flex-end' } }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
                gap: 1.25,
                width: '100%',
                maxWidth: 930,
              }}
            >
            <TextField
              size="small"
              label="Search users"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              sx={{ minWidth: { xs: '100%', sm: 260 } }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="role-filter-label">Role</InputLabel>
              <Select
                labelId="role-filter-label"
                label="Role"
                value={roleFilter}
                disabled={moduleView === 'Staff Management'}
                onChange={(event) => setRoleFilter(event.target.value as 'All' | UserRole)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Staff">Staff</MenuItem>
                <MenuItem value="Customer">Customer</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 170 }}>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                label="Status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as 'All' | UserStatus)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.1}>
              <Button variant="outlined" onClick={handleResetFilters} sx={{ textTransform: 'none', fontWeight: 700 }}>
                Reset Filters
              </Button>
              <Button variant="contained" onClick={openAddDialog} sx={{ textTransform: 'none', fontWeight: 700 }}>
                Add New User
              </Button>
            </Stack>
          </Stack>
        </Stack>

        <TableContainer sx={{ border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: 2.5, width: '100%' }}>
          <Table size="medium" sx={{ minWidth: 980, width: '100%', tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(25, 118, 210, 0.08)' }}>
                <TableCell sx={{ width: '17%', fontWeight: 800, py: 1.8, verticalAlign: 'middle' }}>Name</TableCell>
                <TableCell sx={{ width: '22%', fontWeight: 800, py: 1.8, verticalAlign: 'middle' }}>Email</TableCell>
                <TableCell sx={{ width: '11%', fontWeight: 800, py: 1.8, verticalAlign: 'middle' }}>Role</TableCell>
                <TableCell sx={{ width: '12%', fontWeight: 800, py: 1.8, verticalAlign: 'middle' }}>Status</TableCell>
                <TableCell align="right" sx={{ width: '38%', fontWeight: 800, py: 1.8, verticalAlign: 'middle' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 3 }}>
                    No users found for the selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      '&:nth-of-type(even)': { backgroundColor: 'rgba(15, 23, 42, 0.015)' },
                      '& > td': {
                        py: 1.5,
                        verticalAlign: 'middle',
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ minHeight: 44, display: 'flex', alignItems: 'center' }}>{row.name}</Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ minHeight: 44, display: 'flex', alignItems: 'center' }}>{row.email}</Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ minHeight: 44, display: 'flex', alignItems: 'center' }}>
                        <Chip
                          size="small"
                          color={roleBadgeColor[row.role]}
                          label={row.role}
                          variant="outlined"
                          sx={{ borderRadius: 1.5, fontWeight: 700, height: 28 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ minHeight: 44, display: 'flex', alignItems: 'center' }}>
                        <Chip
                          size="small"
                          color={statusColorMap[row.status]}
                          label={row.status}
                          sx={{ borderRadius: 1.5, fontWeight: 700, height: 28 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ minWidth: 320 }}>
                      <Box
                        sx={{
                          minHeight: 44,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                            gap: 1,
                          }}
                        >
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => openEditDialog(row)}
                          fullWidth
                          sx={{ textTransform: 'none', fontWeight: 700, whiteSpace: 'nowrap', minHeight: 38 }}
                        >
                          Edit Details
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => openRoleDialog(row)}
                          fullWidth
                          sx={{ textTransform: 'none', fontWeight: 700, whiteSpace: 'nowrap', minHeight: 38 }}
                        >
                          Change Role
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => handleDeactivateOrDelete(row)}
                          fullWidth
                          sx={{ textTransform: 'none', fontWeight: 700, whiteSpace: 'nowrap', minHeight: 38 }}
                        >
                          {row.status === 'Active' ? 'Deactivate Account' : 'Delete Account'}
                        </Button>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={dialogMode !== null} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {dialogMode === 'add' && 'Add New User'}
          {dialogMode === 'edit' && 'Edit Details'}
          {dialogMode === 'role' && 'Change Role'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            {dialogMode !== 'role' ? (
              <>
                <TextField
                  label="Name"
                  fullWidth
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </>
            ) : null}

            <FormControl fullWidth>
              <InputLabel id="form-role-label">Role</InputLabel>
              <Select labelId="form-role-label" label="Role" value={form.role} onChange={handleFormRoleChange}>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Staff">Staff</MenuItem>
                <MenuItem value="Customer">Customer</MenuItem>
              </Select>
            </FormControl>

            {dialogMode !== 'role' ? (
              <FormControl fullWidth>
                <InputLabel id="form-status-label">Status</InputLabel>
                <Select labelId="form-status-label" label="Status" value={form.status} onChange={handleFormStatusChange}>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeDialog} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveDialog}
            disabled={(dialogMode !== 'role') && (!form.name.trim() || !form.email.trim())}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
