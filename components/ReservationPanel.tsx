'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

type SlotStatus = 'available' | 'occupied' | 'reserved';
type VehicleType = 'Sedan' | 'SUV' | 'Motorcycle' | 'EV';
type FilterValue = 'all' | SlotStatus;

interface Slot {
  id: number;
  code: string;
  zone: string;
  level: string;
  status: SlotStatus;
  pricePerHour: number;
  features: string[];
}

interface ReservationRecord {
  id: string;
  slotCode: string;
  zone: string;
  level: string;
  customerName: string;
  plateNumber: string;
  vehicleType: VehicleType;
  startTime: string;
  durationHours: number;
  notes: string;
  totalPrice: number;
  createdAt: string;
}

interface ReservationPanelProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

const STORAGE_KEY = 'parkhr.customer.reservations';

const slotPalette: Record<SlotStatus, { label: string; bg: string; color: string; border: string }> = {
  available: {
    label: 'Available',
    bg: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
    color: '#ecfeff',
    border: 'rgba(20, 184, 166, 0.3)',
  },
  occupied: {
    label: 'Occupied',
    bg: 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)',
    color: '#fff1f2',
    border: 'rgba(239, 68, 68, 0.28)',
  },
  reserved: {
    label: 'Reserved',
    bg: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
    color: '#eff6ff',
    border: 'rgba(59, 130, 246, 0.3)',
  },
};

const vehicleTypes: VehicleType[] = ['Sedan', 'SUV', 'Motorcycle', 'EV'];
const durationOptions = [1, 2, 3, 4, 6, 8, 12];
const occupiedSlotIds = new Set([2, 3, 7, 8, 10, 11, 14, 18, 21, 24, 26, 29, 33, 34, 37, 38, 41, 43, 46]);
const reservedSlotIds = new Set([5, 12, 16, 20, 27, 31, 35, 40, 44]);

const createBaseSlots = (): Slot[] =>
  Array.from({ length: 48 }, (_, index) => {
    const id = index + 1;
    const status: SlotStatus = occupiedSlotIds.has(id)
      ? 'occupied'
      : reservedSlotIds.has(id)
        ? 'reserved'
        : 'available';
    const zone = id <= 16 ? 'North Wing' : id <= 32 ? 'Central Deck' : 'South Wing';
    const level = id <= 24 ? 'Level 1' : 'Level 2';
    const typeOffset = id % 4;
    const features =
      typeOffset === 0
        ? ['Covered', 'Wide bay']
        : typeOffset === 1
          ? ['Near lobby', 'CCTV']
          : typeOffset === 2
            ? ['EV ready', 'Covered']
            : ['Fast exit', 'CCTV'];

    return {
      id,
      code: `${level === 'Level 1' ? 'L1' : 'L2'}-${String(id).padStart(2, '0')}`,
      zone,
      level,
      status,
      pricePerHour: typeOffset === 2 ? 6.5 : typeOffset === 3 ? 5.5 : 5,
      features,
    };
  });

const buildDefaultStartTime = () => {
  const value = new Date(Date.now() + 30 * 60 * 1000);
  value.setMinutes(value.getMinutes() - (value.getMinutes() % 15));
  return value.toISOString().slice(0, 16);
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

const readStoredReservations = (): ReservationRecord[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function ReservationPanel({
  title = 'Reserve a parking space',
  subtitle = 'Choose a live slot, confirm your parking details, and manage your reservation in one place.',
  compact = false,
}: ReservationPanelProps) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<FilterValue>('all');
  const [zoneFilter, setZoneFilter] = React.useState('all');
  const [selectedSlotCode, setSelectedSlotCode] = React.useState<string | null>(null);
  const [customerName, setCustomerName] = React.useState('');
  const [plateNumber, setPlateNumber] = React.useState('');
  const [vehicleType, setVehicleType] = React.useState<VehicleType>('Sedan');
  const [startTime, setStartTime] = React.useState('');
  const [durationHours, setDurationHours] = React.useState('2');
  const [notes, setNotes] = React.useState('');
  const [reservations, setReservations] = React.useState<ReservationRecord[]>([]);
  const [feedback, setFeedback] = React.useState<{ severity: 'success' | 'info'; message: string } | null>(null);

  React.useEffect(() => {
    setReservations(readStoredReservations());
    setStartTime(buildDefaultStartTime());
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
  }, [reservations]);

  const slots = React.useMemo(() => {
    const base = createBaseSlots();
    const reservedCodes = new Set(reservations.map((reservation) => reservation.slotCode));
    return base.map((slot) =>
      reservedCodes.has(slot.code) && slot.status === 'available'
        ? { ...slot, status: 'reserved' as const }
        : slot,
    );
  }, [reservations]);

  const zones = React.useMemo(() => ['all', ...new Set(slots.map((slot) => slot.zone))], [slots]);
  const selectedSlot = React.useMemo(
    () => slots.find((slot) => slot.code === selectedSlotCode) ?? null,
    [selectedSlotCode, slots],
  );

  React.useEffect(() => {
    if (!selectedSlot && slots.length > 0) {
      const firstAvailable = slots.find((slot) => slot.status === 'available');
      setSelectedSlotCode(firstAvailable?.code ?? null);
    }
  }, [selectedSlot, slots]);

  const filteredSlots = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return slots.filter((slot) => {
      const matchesStatus = statusFilter === 'all' || slot.status === statusFilter;
      const matchesZone = zoneFilter === 'all' || slot.zone === zoneFilter;
      const matchesQuery =
        query.length === 0 ||
        slot.code.toLowerCase().includes(query) ||
        slot.zone.toLowerCase().includes(query) ||
        slot.level.toLowerCase().includes(query) ||
        slot.features.some((feature) => feature.toLowerCase().includes(query));

      return matchesStatus && matchesZone && matchesQuery;
    });
  }, [search, slots, statusFilter, zoneFilter]);

  const availableCount = slots.filter((slot) => slot.status === 'available').length;
  const occupiedCount = slots.filter((slot) => slot.status === 'occupied').length;
  const reservedCount = slots.filter((slot) => slot.status === 'reserved').length;
  const activeReservation = reservations[0] ?? null;
  const duration = Number(durationHours);
  const estimatedTotal = selectedSlot ? selectedSlot.pricePerHour * duration : 0;

  const handleSelectSlot = (slot: Slot) => {
    setSelectedSlotCode(slot.code);

    if (slot.status !== 'available') {
      setFeedback({
        severity: 'info',
        message: `${slot.code} is currently ${slotPalette[slot.status].label.toLowerCase()}. Please choose an available space.`,
      });
      return;
    }

    setFeedback({
      severity: 'success',
      message: `${slot.code} selected. Complete the form to confirm your reservation.`,
    });
  };

  const handleReserve = () => {
    if (!selectedSlot || selectedSlot.status !== 'available') {
      setFeedback({ severity: 'info', message: 'Select an available slot before continuing.' });
      return;
    }

    if (!customerName.trim() || !plateNumber.trim()) {
      setFeedback({ severity: 'info', message: 'Enter your name and plate number to finish the reservation.' });
      return;
    }

    const newReservation: ReservationRecord = {
      id: `${selectedSlot.code}-${Date.now()}`,
      slotCode: selectedSlot.code,
      zone: selectedSlot.zone,
      level: selectedSlot.level,
      customerName: customerName.trim(),
      plateNumber: plateNumber.trim().toUpperCase(),
      vehicleType,
      startTime,
      durationHours: duration,
      notes: notes.trim(),
      totalPrice: estimatedTotal,
      createdAt: new Date().toISOString(),
    };

    setReservations((current) => [newReservation, ...current.filter((item) => item.slotCode !== newReservation.slotCode)]);
    setFeedback({ severity: 'success', message: `${selectedSlot.code} reserved successfully for ${customerName.trim()}.` });
    setNotes('');
  };

  const handleCancelReservation = () => {
    if (!activeReservation) {
      setFeedback({ severity: 'info', message: 'There is no active reservation to cancel.' });
      return;
    }

    setReservations((current) => current.filter((reservation) => reservation.id !== activeReservation.id));
    setSelectedSlotCode(activeReservation.slotCode);
    setFeedback({ severity: 'success', message: `${activeReservation.slotCode} is available again.` });
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setZoneFilter('all');
  };

  const handleFillActiveReservation = () => {
    if (!activeReservation) {
      setFeedback({ severity: 'info', message: 'Create a reservation first to review it here.' });
      return;
    }

    setSelectedSlotCode(activeReservation.slotCode);
    setCustomerName(activeReservation.customerName);
    setPlateNumber(activeReservation.plateNumber);
    setVehicleType(activeReservation.vehicleType);
    setStartTime(activeReservation.startTime);
    setDurationHours(String(activeReservation.durationHours));
    setNotes(activeReservation.notes);
    setFeedback({ severity: 'success', message: `Loaded ${activeReservation.slotCode} into the reservation form.` });
  };

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 5,
          p: { xs: 3, md: compact ? 3 : 4 },
          border: '1px solid rgba(15, 23, 42, 0.08)',
          background:
            'radial-gradient(circle at top left, rgba(20, 184, 166, 0.18), transparent 30%), linear-gradient(135deg, #fbfffe 0%, #f5f7ff 48%, #f0fdfa 100%)',
        }}
      >
        <Stack spacing={compact ? 2.5 : 3}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
                {title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 760 }}>
                {subtitle}
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                variant="contained"
                onClick={handleFillActiveReservation}
                sx={{
                  textTransform: 'none',
                  px: 2.5,
                  py: 1.2,
                  borderRadius: 999,
                  bgcolor: '#0f766e',
                  '&:hover': { bgcolor: '#115e59' },
                }}
              >
                View active reservation
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancelReservation}
                sx={{ textTransform: 'none', px: 2.5, py: 1.2, borderRadius: 999 }}
              >
                Cancel reservation
              </Button>
            </Stack>
          </Stack>

          {feedback ? <Alert severity={feedback.severity}>{feedback.message}</Alert> : null}

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: compact ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))' },
              gap: 2,
            }}
          >
            {[
              { label: 'Available now', value: availableCount, tone: '#0f766e' },
              { label: 'Occupied', value: occupiedCount, tone: '#b91c1c' },
              { label: 'Reserved', value: reservedCount, tone: '#1d4ed8' },
              { label: 'Starting at', value: formatMoney(5), tone: '#7c3aed' },
            ].map((item) => (
              <Paper
                key={item.label}
                elevation={0}
                sx={{
                  p: 2.25,
                  borderRadius: 4,
                  border: '1px solid rgba(15, 23, 42, 0.08)',
                  backgroundColor: 'rgba(255, 255, 255, 0.76)',
                  backdropFilter: 'blur(18px)',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 800, color: item.tone }}>
                  {item.value}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: compact ? '1fr' : '1.55fr 1fr' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 5,
            p: { xs: 3, md: 3.5 },
            border: '1px solid rgba(15, 23, 42, 0.08)',
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
          }}
        >
          <Stack spacing={3}>
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              spacing={2}
              sx={{ alignItems: { lg: 'center' }, justifyContent: 'space-between' }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Live slot map
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Click any available bay to start your reservation instantly.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {(Object.keys(slotPalette) as SlotStatus[]).map((status) => (
                  <Chip
                    key={status}
                    label={slotPalette[status].label}
                    clickable
                    onClick={() => setStatusFilter(status)}
                    color={statusFilter === status ? 'primary' : 'default'}
                    variant={statusFilter === status ? 'filled' : 'outlined'}
                  />
                ))}
                <Chip
                  label="All"
                  clickable
                  onClick={() => setStatusFilter('all')}
                  color={statusFilter === 'all' ? 'primary' : 'default'}
                  variant={statusFilter === 'all' ? 'filled' : 'outlined'}
                />
              </Stack>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1.2fr 0.8fr 0.8fr auto' },
                gap: 1.5,
              }}
            >
              <TextField
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by slot, zone, level, or feature"
                size="small"
                fullWidth
              />
              <TextField
                select
                label="Status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as FilterValue)}
                size="small"
                fullWidth
              >
                <MenuItem value="all">All statuses</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="occupied">Occupied</MenuItem>
                <MenuItem value="reserved">Reserved</MenuItem>
              </TextField>
              <TextField
                select
                label="Zone"
                value={zoneFilter}
                onChange={(event) => setZoneFilter(event.target.value)}
                size="small"
                fullWidth
              >
                {zones.map((zone) => (
                  <MenuItem key={zone} value={zone}>
                    {zone === 'all' ? 'All zones' : zone}
                  </MenuItem>
                ))}
              </TextField>
              <Button onClick={handleResetFilters} variant="text" sx={{ textTransform: 'none' }}>
                Reset filters
              </Button>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(4, minmax(0, 1fr))', md: 'repeat(6, minmax(0, 1fr))' },
                gap: 1.5,
              }}
            >
              {filteredSlots.map((slot) => {
                const isSelected = slot.code === selectedSlotCode;
                const palette = slotPalette[slot.status];
                return (
                  <Button
                    key={slot.code}
                    onClick={() => handleSelectSlot(slot)}
                    variant="contained"
                    disableElevation
                    sx={{
                      minHeight: 112,
                      borderRadius: 4,
                      p: 1.5,
                      color: palette.color,
                      background: palette.bg,
                      border: `1px solid ${palette.border}`,
                      boxShadow: isSelected ? '0 0 0 3px rgba(15, 118, 110, 0.2)' : '0 18px 30px rgba(15, 23, 42, 0.08)',
                      textTransform: 'none',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      '&:hover': {
                        background: palette.bg,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 22px 38px rgba(15, 23, 42, 0.14)',
                      },
                    }}
                  >
                    <Stack spacing={0.75} sx={{ width: '100%', textAlign: 'left' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {slot.code}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        {slot.zone}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        {slot.level}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        {slotPalette[slot.status].label} • {formatMoney(slot.pricePerHour)}/hr
                      </Typography>
                    </Stack>
                  </Button>
                );
              })}
            </Box>

            {filteredSlots.length === 0 ? (
              <Alert severity="info">No parking slots match the current filters.</Alert>
            ) : null}
          </Stack>
        </Paper>

        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 5,
              p: { xs: 3, md: 3.5 },
              border: '1px solid rgba(15, 23, 42, 0.08)',
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
            }}
          >
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Reservation details
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  {selectedSlot
                    ? `You're booking ${selectedSlot.code} in ${selectedSlot.zone}.`
                    : 'Pick a slot to begin your reservation.'}
                </Typography>
              </Box>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  backgroundColor: '#f8fafc',
                  border: '1px solid rgba(15, 23, 42, 0.08)',
                }}
              >
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 1.25 }}>
                  <Chip label={selectedSlot?.code ?? 'No slot selected'} color="primary" variant="outlined" />
                  <Chip label={selectedSlot ? slotPalette[selectedSlot.status].label : 'Waiting'} variant="outlined" />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {selectedSlot
                    ? `${selectedSlot.features.join(' • ')} • ${formatMoney(selectedSlot.pricePerHour)}/hr`
                    : 'Select an available space to view slot features and pricing.'}
                </Typography>
              </Paper>

              <TextField label="Customer name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} fullWidth />
              <TextField label="Plate number" value={plateNumber} onChange={(event) => setPlateNumber(event.target.value.toUpperCase())} fullWidth />
              <TextField
                select
                label="Vehicle type"
                value={vehicleType}
                onChange={(event) => setVehicleType(event.target.value as VehicleType)}
                fullWidth
              >
                {vehicleTypes.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                type="datetime-local"
                label="Arrival time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                fullWidth
              />
              <TextField
                select
                label="Duration"
                value={durationHours}
                onChange={(event) => setDurationHours(event.target.value)}
                fullWidth
              >
                {durationOptions.map((hours) => (
                  <MenuItem key={hours} value={String(hours)}>
                    {hours} {hours === 1 ? 'hour' : 'hours'}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Notes for the parking team"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                fullWidth
                multiline
                minRows={3}
                placeholder="Example: arriving with an EV and need charger access."
              />

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.1) 0%, rgba(29, 78, 216, 0.08) 100%)',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Estimated total
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>
                  {formatMoney(estimatedTotal)}
                </Typography>
              </Paper>

              <Button
                variant="contained"
                onClick={handleReserve}
                sx={{
                  py: 1.4,
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 700,
                  bgcolor: '#0f766e',
                  '&:hover': { bgcolor: '#115e59' },
                }}
              >
                Confirm reservation
              </Button>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 5,
              p: { xs: 3, md: 3.5 },
              border: '1px solid rgba(15, 23, 42, 0.08)',
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Recent reservation activity
              </Typography>
              {reservations.length === 0 ? (
                <Alert severity="info">No reservations yet. Your next booking will appear here instantly.</Alert>
              ) : (
                reservations.slice(0, compact ? 2 : 4).map((reservation, index) => (
                  <React.Fragment key={reservation.id}>
                    <Box>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {reservation.slotCode}
                        </Typography>
                        <Chip label={reservation.vehicleType} size="small" color="primary" variant="outlined" />
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                        {reservation.customerName} • {reservation.plateNumber} • {formatDateTime(reservation.startTime)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {reservation.zone} • {reservation.level} • {formatMoney(reservation.totalPrice)}
                      </Typography>
                    </Box>
                    {index < Math.min(reservations.length, compact ? 2 : 4) - 1 ? <Divider /> : null}
                  </React.Fragment>
                ))
              )}
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Stack>
  );
}
