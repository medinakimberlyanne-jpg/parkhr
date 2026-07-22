'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '../store/store';

type SlotStatus = 'available' | 'occupied' | 'reserved';
type VehicleType = 'Sedan' | 'SUV' | 'Motorcycle' | 'EV';
type FilterValue = 'all' | SlotStatus;

interface Slot {
  id?: number;
  _id?: string;
  code: string;
  zone: string;
  level: string;
  status: SlotStatus;
  pricePerHour: number;
  features: string[];
  occupantDetails?: SlotOccupantDetails | null;
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

interface SlotOccupantDetails {
  customerName: string;
  contactNumber: string;
  plateNumber: string;
  startTime: string;
  durationHours: number;
}

interface SlotManualState {
  status: SlotStatus;
  details: SlotOccupantDetails | null;
}

const STORAGE_KEY = 'parkhr.customer.reservations';
const SLOT_MANUAL_STATE_KEY = 'parkhr.customer.slot-manual-state';

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
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2,
  }).format(value);

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

const normalizeSlotStatus = (status: unknown): SlotStatus => {
  const value = String(status || '').trim().toLowerCase();
  return ['available', 'occupied', 'reserved'].includes(value) ? (value as SlotStatus) : 'available';
};

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

const readStoredSlotManualState = (): Record<string, SlotManualState> => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(SLOT_MANUAL_STATE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const createDefaultOccupiedDetails = (slot: Slot): SlotOccupantDetails => {
  const slotNumber = Number(slot.code.split('-')[1]) || 1;
  const duration = (slotNumber % 4) + 1;
  const d = new Date(Date.now() - duration * 60 * 60 * 1000);
  const iso = Number.isFinite(d.getTime()) ? d.toISOString() : new Date().toISOString();
  const normalizedStartTime = iso.slice(0, 16);

  return {
    customerName: `Occupant ${slot.code}`,
    contactNumber: `09${String(100000000 + slotNumber).slice(-10)}`,
    plateNumber: `PKR-${String(1000 + slotNumber)}`,
    startTime: normalizedStartTime,
    durationHours: duration,
  };
};

export default function ReservationPanel({
  title = 'Reserve a parking space',
  subtitle = 'Choose a live slot, confirm your parking details, and manage your reservation in one place.',
  compact = false,
}: ReservationPanelProps) {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<FilterValue>('all');
  const [zoneFilter, setZoneFilter] = React.useState('all');
  const [planLevel, setPlanLevel] = React.useState<'Level 1' | 'Level 2'>('Level 1');
  const [selectedSlotCode, setSelectedSlotCode] = React.useState<string | null>(null);
  const [customerName, setCustomerName] = React.useState('');
  const [plateNumber, setPlateNumber] = React.useState('');
  const [vehicleType, setVehicleType] = React.useState<VehicleType>('Sedan');
  const [startTime, setStartTime] = React.useState('');
  const [durationHours, setDurationHours] = React.useState('2');
  const [notes, setNotes] = React.useState('');
  const [reservations, setReservations] = React.useState<ReservationRecord[]>([]);
  const [slotManualState, setSlotManualState] = React.useState<Record<string, SlotManualState>>({});
  const [slotModalOpen, setSlotModalOpen] = React.useState(false);
  const [slotEditCode, setSlotEditCode] = React.useState<string | null>(null);
  const [slotEditForm, setSlotEditForm] = React.useState({
    status: 'available' as SlotStatus,
    customerName: '',
    contactNumber: '',
    plateNumber: '',
    startTime: '',
    durationHours: '2',
  });
  const [feedback, setFeedback] = React.useState<{ severity: 'success' | 'info'; message: string } | null>(null);
  const [dbSlots, setDbSlots] = React.useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = React.useState(true);
  const [slotsLoaded, setSlotsLoaded] = React.useState(false);
  const [addSlotLoading, setAddSlotLoading] = React.useState(false);
  const user = useAppSelector((s) => s.user.user);
  const isAdmin = String(user?.userType || '').toLowerCase() === 'admin';

  React.useEffect(() => {
    setReservations(readStoredReservations());
    setSlotManualState(readStoredSlotManualState());
    setStartTime(buildDefaultStartTime());
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
  }, [reservations]);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(SLOT_MANUAL_STATE_KEY, JSON.stringify(slotManualState));
  }, [slotManualState]);

  React.useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await fetch('/api/parking-slots');
        if (!res.ok) {
          throw new Error(`Failed to load parking slots: ${res.status}`);
        }

        const body = await res.json();
        if (Array.isArray(body.slots)) {
          setDbSlots(
            body.slots.map((slot: any, index: number) => ({
              ...slot,
              id: slot.id ?? index + 1,
              status: normalizeSlotStatus(slot.status),
              occupantDetails: slot.occupantDetails ?? null,
            })),
          );
        }
      } catch (err) {
        console.warn('Failed to load parking slots', err);
      } finally {
        setLoadingSlots(false);
        setSlotsLoaded(true);
      }
    };

    fetchSlots();
  }, []);

  const slots = React.useMemo(() => {
    const base = slotsLoaded ? dbSlots : createBaseSlots();
    const reservedCodes = new Set(reservations.map((reservation) => reservation.slotCode));
    return base.map((slot) => {
      const manual = slotManualState[slot.code];
      if (manual) {
        return { ...slot, status: manual.status };
      }
      return reservedCodes.has(slot.code) && slot.status === 'available'
        ? { ...slot, status: 'reserved' as const }
        : slot;
    });
  }, [dbSlots, reservations, slotManualState, slotsLoaded]);

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

  const floorPlanSlots = React.useMemo(() => {
    const levelSlots = filteredSlots
      .filter((slot) => slot.level === planLevel)
      .sort((a, b) => a.id - b.id);

    const midpoint = Math.ceil(levelSlots.length / 2);
    return {
      topRow: levelSlots.slice(0, midpoint),
      bottomRow: levelSlots.slice(midpoint),
      all: levelSlots,
    };
  }, [filteredSlots, planLevel]);

  const availableCount = slots.filter((slot) => slot.status === 'available').length;
  const occupiedCount = slots.filter((slot) => slot.status === 'occupied').length;
  const reservedCount = slots.filter((slot) => slot.status === 'reserved').length;
  const activeReservation = reservations[0] ?? null;
  const duration = Number(durationHours);
  const estimatedTotal = selectedSlot ? selectedSlot.pricePerHour * duration : 0;

  const getSlotDetails = React.useCallback((slot: Slot): SlotOccupantDetails | null => {
    const manual = slotManualState[slot.code];
    if (manual?.details) {
      return manual.details;
    }

    if (slot.occupantDetails) {
      return slot.occupantDetails;
    }

    const reservation = reservations.find((item) => item.slotCode === slot.code);
    if (reservation) {
      return {
        customerName: reservation.customerName,
        contactNumber: 'N/A',
        plateNumber: reservation.plateNumber,
        startTime: reservation.startTime,
        durationHours: reservation.durationHours,
      };
    }

    if (slot.status === 'occupied' || slot.status === 'reserved') {
      return createDefaultOccupiedDetails(slot);
    }

    return null;
  }, [reservations, slotManualState]);

  const getSlotTimeDisplay = React.useCallback((slot: Slot) => {
    const details = getSlotDetails(slot);
    if (!details || slot.status === 'available') {
      return null;
    }
    return `${formatDateTime(details.startTime)} • ${details.durationHours}h`;
  }, [getSlotDetails]);

  const handleSelectSlot = (slot: Slot) => {
    setSelectedSlotCode(slot.code);

    const details = getSlotDetails(slot);
    setSlotEditCode(slot.code);
    setSlotEditForm({
      status: !isAdmin && slot.status === 'available' ? 'reserved' : normalizeSlotStatus(slot.status),
      customerName: details?.customerName || '',
      contactNumber: details?.contactNumber || '',
      plateNumber: details?.plateNumber || '',
      startTime: details?.startTime || buildDefaultStartTime(),
      durationHours: String(details?.durationHours || 2),
    });
    setSlotModalOpen(true);

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

  const handleAddSlot = async () => {
    if (!isAdmin) return;
    if (!slotsLoaded) return;
    setAddSlotLoading(true);

    const level = planLevel;
    const prefix = level === 'Level 1' ? 'L1' : 'L2';
    const levelSlots = dbSlots.filter((slot) => slot.level === level);
    const highestIndex = levelSlots.reduce((max, slot) => {
      const slotNumber = Number(slot.code.split('-')[1]);
      return Number.isFinite(slotNumber) ? Math.max(max, slotNumber) : max;
    }, 0);
    const nextIndex = highestIndex + 1;
    const code = `${prefix}-${String(nextIndex).padStart(2, '0')}`;
    const zone = level === 'Level 1' ? 'North Wing' : 'South Wing';
    const newSlot = {
      code,
      zone,
      level,
      status: 'available' as SlotStatus,
      pricePerHour: 5,
      features: ['Covered', 'Wide bay'],
    };

    try {
      const res = await fetch('/api/parking-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSlot),
      });

      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody?.error || `Add slot failed: ${res.status}`);
      }

      const body = await res.json();
      setDbSlots((current) => [...current, body.slot]);
      setFeedback({ severity: 'success', message: `Slot ${body.slot.code} added successfully.` });
    } catch (err) {
      console.error(err);
      setFeedback({ severity: 'info', message: String(err) });
    } finally {
      setAddSlotLoading(false);
    }
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

  const handleSaveSlotStatus = () => {
    if (!slotEditCode) {
      return;
    }

    const nextStatus = isAdmin ? slotEditForm.status : 'reserved';
    const shouldStoreDetails = nextStatus !== 'available';

    const occupantDetails = shouldStoreDetails
      ? {
          customerName: slotEditForm.customerName.trim() || 'Unknown',
          contactNumber: slotEditForm.contactNumber.trim() || 'N/A',
          plateNumber: slotEditForm.plateNumber.trim().toUpperCase() || 'N/A',
          startTime: slotEditForm.startTime || buildDefaultStartTime(),
          durationHours: Math.max(1, Number(slotEditForm.durationHours) || 1),
        }
      : null;

    const saveToServer = async () => {
      if (!slotsLoaded) return null;
      try {
        const res = await fetch(`/api/parking-slots/${encodeURIComponent(slotEditCode)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slotStatus: nextStatus, occupantDetails }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || `Update failed: ${res.status}`);
        }
        const body = await res.json();
        return body.slot;
      } catch (err) {
        console.warn('Failed to save slot to server', err);
        return null;
      }
    };

    (async () => {
      const updatedSlot = await saveToServer();
      if (updatedSlot) {
        // update local dbSlots so UI disables the slot (status -> occupied)
        setDbSlots((current) => current.map((s) => (s.code === updatedSlot.code ? updatedSlot : s)));
        setFeedback({ severity: 'success', message: `${slotEditCode} updated to ${slotPalette[updatedSlot.status].label}.` });
      } else {
        // fallback to local manual state if server unavailable
        setSlotManualState((prev) => ({
          ...prev,
          [slotEditCode]: { status: nextStatus, details: occupantDetails },
        }));
        setFeedback({ severity: 'success', message: `${slotEditCode} updated locally to ${slotPalette[nextStatus].label}.` });
      }
      setSlotModalOpen(false);
    })();
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

      <Box sx={{ width: '100%' }}>
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
                p: 1.5,
                borderRadius: 2,
                border: '1px solid rgba(15, 23, 42, 0.12)',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.25}
                sx={{ alignItems: { sm: 'center' }, flexWrap: 'wrap', justifyContent: 'space-between' }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  Slot Status Color Guide
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {(['available', 'occupied', 'reserved'] as SlotStatus[]).map((status) => (
                    <Box
                      key={status}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 1.25,
                        py: 0.65,
                        borderRadius: 999,
                        border: `1px solid ${slotPalette[status].border}`,
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      }}
                    >
                      <Box
                        sx={{
                          width: 13,
                          height: 13,
                          borderRadius: '50%',
                          background: slotPalette[status].bg,
                          border: `1px solid ${slotPalette[status].border}`,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        {slotPalette[status].label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Box>

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

            <Stack spacing={1.5}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' } }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Interactive Facility Floor Plan
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select a specific parking bay within the actual structure layout.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
                  {(['Level 1', 'Level 2'] as const).map((level) => (
                    <Chip
                      key={level}
                      label={level}
                      clickable
                      onClick={() => setPlanLevel(level)}
                      color={planLevel === level ? 'primary' : 'default'}
                      variant={planLevel === level ? 'filled' : 'outlined'}
                    />
                  ))}
                  {isAdmin && slotsLoaded ? (
                    <Button
                      onClick={handleAddSlot}
                      disabled={addSlotLoading || loadingSlots}
                      variant="outlined"
                      sx={{ textTransform: 'none', borderRadius: 999, height: 40 }}
                    >
                      {addSlotLoading ? 'Adding slot...' : `Add ${planLevel} slot`}
                    </Button>
                  ) : null}
                </Stack>
              </Stack>

              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 4,
                  border: '1px solid rgba(15, 23, 42, 0.12)',
                  background:
                    'linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(241,245,249,0.95) 100%)',
                  minHeight: { xs: 390, md: 460 },
                  p: { xs: 1.5, md: 2 },
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: '6%',
                    right: '6%',
                    top: '40%',
                    height: '20%',
                    borderRadius: 3,
                    background:
                      'repeating-linear-gradient(90deg, rgba(15,23,42,0.04) 0, rgba(15,23,42,0.04) 18px, rgba(255,255,255,0.5) 18px, rgba(255,255,255,0.5) 34px)',
                    border: '1px dashed rgba(15, 23, 42, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'rgba(15,23,42,0.72)', letterSpacing: '0.04em' }}>
                    MAIN DRIVE AISLE
                  </Typography>
                </Box>

                <Typography sx={{ position: 'absolute', left: 20, top: 14, fontSize: 11, fontWeight: 800, color: 'rgba(15,23,42,0.65)' }}>
                  ENTRANCE
                </Typography>
                <Typography sx={{ position: 'absolute', right: 20, top: 14, fontSize: 11, fontWeight: 800, color: 'rgba(15,23,42,0.65)' }}>
                  EXIT
                </Typography>
                <Typography sx={{ position: 'absolute', right: 20, bottom: 14, fontSize: 11, fontWeight: 800, color: 'rgba(15,23,42,0.65)' }}>
                  RAMP TO OTHER LEVEL
                </Typography>

                {floorPlanSlots.topRow.map((slot, index) => {
                  const isSelected = slot.code === selectedSlotCode;
                  const palette = slotPalette[slot.status];
                  const timeDisplay = getSlotTimeDisplay(slot);
                  const step = floorPlanSlots.topRow.length > 1 ? (84 / (floorPlanSlots.topRow.length - 1)) : 0;
                  const left = 8 + (index * step);
                  const clickable = isAdmin || slot.status !== 'occupied';
                  return (
                    <Button
                      key={slot.code}
                      onClick={clickable ? () => handleSelectSlot(slot) : undefined}
                      disabled={!clickable}
                      variant="contained"
                      disableElevation
                      sx={{
                        position: 'absolute',
                        top: { xs: '12%', md: '11%' },
                        left: `${left}%`,
                        transform: 'translateX(-50%)',
                        minWidth: 0,
                        width: { xs: 64, md: 74 },
                        minHeight: { xs: 76, md: 84 },
                        borderRadius: 2.5,
                        p: 0.8,
                        color: palette.color,
                        background: palette.bg,
                        border: `1px solid ${palette.border}`,
                        boxShadow: isSelected ? '0 0 0 3px rgba(15, 118, 110, 0.22)' : '0 10px 22px rgba(15, 23, 42, 0.12)',
                        textTransform: 'none',
                          '&:hover': { background: palette.bg },
                          '&.Mui-disabled': {
                            color: '#ffffff',
                            opacity: 1,
                            background: palette.bg,
                            border: `1px solid ${palette.border}`,
                          },
                      }}
                    >
                      <Stack spacing={0.2} sx={{ textAlign: 'center', width: '100%' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 11, lineHeight: 1.1 }}>{slot.code}</Typography>
                        <Typography sx={{ fontSize: 9, opacity: 0.9, lineHeight: 1.1 }}>{slot.zone}</Typography>
                        {timeDisplay ? (
                          <Typography sx={{ fontSize: 8, opacity: 0.92, lineHeight: 1.1 }}>
                            {timeDisplay}
                          </Typography>
                        ) : null}
                      </Stack>
                    </Button>
                  );
                })}

                {floorPlanSlots.bottomRow.map((slot, index) => {
                  const isSelected = slot.code === selectedSlotCode;
                  const palette = slotPalette[slot.status];
                  const timeDisplay = getSlotTimeDisplay(slot);
                  const step = floorPlanSlots.bottomRow.length > 1 ? (84 / (floorPlanSlots.bottomRow.length - 1)) : 0;
                  const left = 8 + (index * step);
                  const clickable = isAdmin || slot.status !== 'occupied';
                  return (
                    <Button
                      key={slot.code}
                      onClick={clickable ? () => handleSelectSlot(slot) : undefined}
                      disabled={!clickable}
                      variant="contained"
                      disableElevation
                      sx={{
                        position: 'absolute',
                        top: { xs: '66%', md: '66%' },
                        left: `${left}%`,
                        transform: 'translateX(-50%)',
                        minWidth: 0,
                        width: { xs: 64, md: 74 },
                        minHeight: { xs: 76, md: 84 },
                        borderRadius: 2.5,
                        p: 0.8,
                        color: palette.color,
                        background: palette.bg,
                        border: `1px solid ${palette.border}`,
                        boxShadow: isSelected ? '0 0 0 3px rgba(15, 118, 110, 0.22)' : '0 10px 22px rgba(15, 23, 42, 0.12)',
                        textTransform: 'none',
                          '&:hover': { background: palette.bg },
                          '&.Mui-disabled': {
                            color: '#ffffff',
                            opacity: 1,
                            background: palette.bg,
                            border: `1px solid ${palette.border}`,
                          },
                      }}
                    >
                      <Stack spacing={0.2} sx={{ textAlign: 'center', width: '100%' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 11, lineHeight: 1.1 }}>{slot.code}</Typography>
                        <Typography sx={{ fontSize: 9, opacity: 0.9, lineHeight: 1.1 }}>{slot.zone}</Typography>
                        {timeDisplay ? (
                          <Typography sx={{ fontSize: 8, opacity: 0.92, lineHeight: 1.1 }}>
                            {timeDisplay}
                          </Typography>
                        ) : null}
                      </Stack>
                    </Button>
                  );
                })}
              </Box>

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Showing {floorPlanSlots.all.length} slots on {planLevel} based on current filters.
              </Typography>
            </Stack>

            {filteredSlots.length === 0 ? (
              <Alert severity="info">No parking slots match the current filters.</Alert>
            ) : null}
          </Stack>
        </Paper>
      </Box>

      <Dialog open={slotModalOpen} onClose={() => setSlotModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }} >
          {slotEditCode ? `Manage Slot ${slotEditCode}` : 'Manage Slot'}
        </DialogTitle>
        <DialogContent >
          <Stack spacing={2} sx={{ pt: 0.5, mt: 4 }}>
            <TextField
              select
              label="Slot Status"
              value={slotEditForm.status}
              onChange={(event) => setSlotEditForm((prev) => ({ ...prev, status: event.target.value as SlotStatus }))}
              fullWidth
            >
                  {isAdmin ? [
                      <MenuItem key="available" value="available">Available</MenuItem>,
                      <MenuItem key="occupied" value="occupied">Occupied</MenuItem>,
                      <MenuItem key="reserved" value="reserved">Reserved</MenuItem>,
                    ] : (
                    <MenuItem value="reserved">Reserved</MenuItem>
                  )}
            </TextField>

            {slotEditForm.status !== 'available' ? (
              <>
                <TextField
                  label="Customer Name"
                  value={slotEditForm.customerName}
                  onChange={(event) => setSlotEditForm((prev) => ({ ...prev, customerName: event.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Contact Number"
                  value={slotEditForm.contactNumber}
                  onChange={(event) => setSlotEditForm((prev) => ({ ...prev, contactNumber: event.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Plate Number"
                  value={slotEditForm.plateNumber}
                  onChange={(event) => setSlotEditForm((prev) => ({ ...prev, plateNumber: event.target.value.toUpperCase() }))}
                  fullWidth
                />
                <TextField
                  type="datetime-local"
                  label="Start Time"
                  value={slotEditForm.startTime}
                  onChange={(event) => setSlotEditForm((prev) => ({ ...prev, startTime: event.target.value }))}
                  fullWidth
                />
                <TextField
                  select
                  label="Duration"
                  value={slotEditForm.durationHours}
                  onChange={(event) => setSlotEditForm((prev) => ({ ...prev, durationHours: event.target.value }))}
                  fullWidth
                >
                  {durationOptions.map((hours) => (
                    <MenuItem key={hours} value={String(hours)}>
                      {hours} {hours === 1 ? 'hour' : 'hours'}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            ) : (
              <Alert severity="info">This slot will be released and shown as available.</Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSlotModalOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleSaveSlotStatus} variant="contained" sx={{ textTransform: 'none' }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
