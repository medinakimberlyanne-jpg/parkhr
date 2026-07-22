"use client";

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import HeadsetMicRoundedIcon from '@mui/icons-material/HeadsetMicRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import AppTheme from '../../theme/AppTheme';
import Image from 'next/image';
type ViewMode = 'dashboard' | 'payslip';

const holidays = [
	{ date: 'January 01, 2026 - Thursday', title: 'New Years Day' },
	{ date: 'February 17, 2026 - Tuesday', title: 'Chinese New Year 2026 (SNWH)' },
	{ date: 'March 20, 2026 - Friday', title: 'Eidl Fitr 2026' },
	{ date: 'April 02, 2026 - Thursday', title: 'Maundy Thursday' },
	{ date: 'April 03, 2026 - Friday', title: 'Good Friday 2026' },
	{ date: 'April 09, 2026 - Thursday', title: 'Day of Valor' },
];

const periods = [
	'Please select',
	'07/15/2026',
	'06/30/2026',
	'06/15/2026',
	'05/31/2026',
	'05/15/2026',
	'04/30/2026',
	'04/15/2026',
	'03/31/2026',
	'03/15/2026',
	'02/28/2026',
	'02/15/2026',
	'01/31/2026',
	'01/15/2026',
	'12/31/2025',
	'12/15/2025',
	'11/30/2025',
	'11/15/2025',
	'10/31/2025',
];

const forms = [
	'Leave Credits',
	'Leave Application',
	'OT Application',
	'OB Application',
	'OTR Timesheet',
	'Upload DTR',
	'OT Report',
	'Leave Report',
	'SSS Maternity Benefit Reimbursement Form',
	'SSS Salary Loan Form',
	'SSS Sickness Notification Form',
];

function HeaderBar({ view, onViewChange }: { view: ViewMode; onViewChange: (view: ViewMode) => void }) {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const formsOpen = Boolean(anchorEl);
	const getNavButtonSx = (selected: boolean) => ({
		color: selected ? '#ffffff' : '#107927',
		bgcolor: selected ? '#107927' : '#ffffff',
		border: '1px solid rgba(16, 121, 39, 0.18)',
		borderRadius: 1.5,
		width: 56,
		height: 56,
		'&:hover': {
			bgcolor: selected ? '#0d6521' : '#edf7ea',
		},
	});

	return (
		<AppBar
			position="sticky"
			elevation={0}
			sx={{
				bgcolor: '#ffffff',
				borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
				boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
			}}
		>
			<Toolbar sx={{ minHeight: 56, px: { xs: 1.5, md: 3 }, gap: 1 }}>
				<Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 155 }}>
					{/* <Box
						sx={{
							width: 20,
							height: 20,
							borderRadius: '4px',
							background: 'linear-gradient(135deg, #edf7ea 0%, #147614 100%)',
						}}
					/> */}
					{/* <Typography variant="h6" sx={{ fontWeight: 500, color: '#f8fafc', fontSize: 24 }}>
						Information Professionals, Inc.
					</Typography> */}
                       <Image
                                         src="/logo_2.png"
                                         alt="ParkHR logo"
                                         width={100}
                                         height={40}
                                         style={{ width: 'auto', height: 'auto' }}
                                         priority
                                       />
				</Stack>

				<Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
					<Tooltip title="Dashboard">
						<IconButton
							size="small"
							onClick={() => onViewChange('dashboard')}
							sx={getNavButtonSx(view === 'dashboard')}
						>
							<HomeRoundedIcon fontSize="small" />
						</IconButton>
					</Tooltip>
					<Tooltip title="My Payslip">
						<IconButton
							size="small"
							onClick={() => onViewChange('payslip')}
							sx={getNavButtonSx(view === 'payslip')}
						>
							<PaymentsRoundedIcon fontSize="small" />
						</IconButton>
					</Tooltip>
					<Tooltip title="Forms">
						<IconButton
							size="small"
							onClick={(event) => setAnchorEl(event.currentTarget)}
							sx={getNavButtonSx(formsOpen)}
						>
							<ArticleRoundedIcon fontSize="small" />
						</IconButton>
					</Tooltip>
					<Tooltip title="Downloads">
						<IconButton size="small" sx={getNavButtonSx(false)}>
							<DownloadRoundedIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				</Stack>

				<Box sx={{ ml: 'auto' }}>
					<Typography variant="body2" sx={{ color: '#000000' }}>
						Ian Christopher Medina
					</Typography>
				</Box>

				<Menu anchorEl={anchorEl} open={formsOpen} onClose={() => setAnchorEl(null)}>
					{forms.map((item) => (
						<MenuItem key={item} onClick={() => setAnchorEl(null)}>
							{item}
						</MenuItem>
					))}
				</Menu>
			</Toolbar>
		</AppBar>
	);
}

function EmployeeDetails() {
	return (
		<Box sx={{ py: 2 }}>
			<Stack direction={{ xs: 'column', md: 'row' }} spacing={5}>
				<Stack spacing={0.5} sx={{ minWidth: 120 }}>
					<Typography variant="body2">Employee Number:</Typography>
					<Typography variant="body2">Employee Name:</Typography>
					<Typography variant="body2">Client Name:</Typography>
					<Typography variant="body2">Position:</Typography>
				</Stack>
				<Stack spacing={0.5}>
					<Typography variant="body2" color="text.secondary">2022-000330</Typography>
					<Typography variant="body2" color="text.secondary">Medina, Ian Christopher</Typography>
					<Typography variant="body2" color="text.secondary">Prulife Insurance Corporation of UK</Typography>
					<Typography variant="body2" color="text.secondary">Full Stack Developer</Typography>
				</Stack>
			</Stack>
		</Box>
	);
}

function HolidaysCard() {
	return (
		<Paper sx={{ borderRadius: 1.5, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
			<Box sx={{ bgcolor: '#107927', color: '#ffffff', px: 2, py: 1.25, display: 'flex', alignItems: 'center', gap: 1 }}>
				<CalendarMonthRoundedIcon fontSize="small" />
				<Typography variant="h6" sx={{ fontSize: 24, fontWeight: 700 }}>
					2026 Holidays
				</Typography>
			</Box>
			<Box sx={{ px: 2, py: 1.25 }}>
				<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
					The following were declared by virtue of Proclamation No. 269, unless otherwise specified: (SNWH) Special Non-Working Holiday.
				</Typography>
			</Box>
			<Divider />
			<TableContainer sx={{ maxHeight: 360 }}>
				<Table size="small" stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
							<TableCell sx={{ fontWeight: 700 }}>Holiday</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{holidays.map((row) => (
							<TableRow key={row.date} hover>
								<TableCell>{row.date}</TableCell>
								<TableCell>{row.title}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
}

function SidebarCards() {
	return (
		<Stack spacing={2}>
			<Button variant="contained" sx={{ bgcolor: '#0d852d', py: 1.1, textTransform: 'none' }}>
				My Weekly Schedule
			</Button>
			<Button variant="contained" sx={{ bgcolor: '#16a34a', py: 1.1, textTransform: 'none', '&:hover': { bgcolor: '#15803d' } }}>
				Time-in
			</Button>

			<Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
				<Box sx={{ p: 2, background: 'linear-gradient(160deg, #eef2ff 0%, #dbeafe 100%)' }}>
					<Chip label="COVID-19" size="small" color="error" sx={{ mb: 1 }} />
					<Typography variant="h5" sx={{ color: '#fbbf24', fontWeight: 800, lineHeight: 1.1 }}>
						Hygiene & Sanitation in the Workplace
					</Typography>
				</Box>
				<Button fullWidth sx={{ bgcolor: '#02712f', color: '#fff', borderRadius: 0, textTransform: 'none' }}>
					Watch This Video
				</Button>
			</Paper>

			<Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
				<Box sx={{ px: 2, py: 1.25 }}>
					<Typography sx={{ textAlign: 'center', fontWeight: 600 }}>Quick Links</Typography>
				</Box>
				<Divider />
				<List dense>
					{['Employee Handbook', 'Company Policies', 'Benefits Portal', 'Leave Calendar'].map((item) => (
						<ListItem key={item} disablePadding>
							<ListItemButton>
								<ListItemText primary={item} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Paper>
		</Stack>
	);
}

function DashboardView() {
	return (
		<Stack spacing={3}>
			<Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' } }}>
				<Typography variant="h3" sx={{ fontSize: { xs: 34, md: 52 }, fontWeight: 700 }}>
					Hello, Ian Christopher!
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Today is July 21, 2026 - Tuesday
				</Typography>
			</Stack>

			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2.3fr) minmax(0, 1fr)' },
					gap: 2.5,
					alignItems: 'start',
				}}
			>
				<HolidaysCard />
				<SidebarCards />
			</Box>
		</Stack>
	);
}

function PayslipView() {
	const [period, setPeriod] = React.useState('Please select');

	const handlePeriodChange = (event: SelectChangeEvent) => {
		setPeriod(event.target.value);
	};

	return (
		<Stack spacing={3}>
			<Box sx={{ textAlign: 'center' }}>
				<Typography variant="h4" sx={{ fontWeight: 500 }}>
					Employee Payslip
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
					To view your pay slip, select payroll period and click "Search" button.
				</Typography>
			</Box>

			<Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'center' }, justifyContent: 'center' }}>
				<Typography sx={{ minWidth: 110 }}>* Payroll Period:</Typography>
				<FormControl size="small" sx={{ minWidth: 220 }}>
					<InputLabel id="period-label">Please select</InputLabel>
					<Select
						labelId="period-label"
						id="period"
						value={period}
						label="Please select"
						onChange={handlePeriodChange}
					>
						{periods.map((item) => (
							<MenuItem key={item} value={item}>
								{item}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<Button variant="contained" sx={{ px: 5, textTransform: 'none', bgcolor: '#1d70d1' }}>
					Search
				</Button>
				<Button variant="contained" sx={{ px: 4, textTransform: 'none', bgcolor: '#60a5fa' }}>
					Generate PDF
				</Button>
			</Stack>

			<Divider />

			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 2fr) minmax(0, 1fr)' },
					gap: 3,
					alignItems: 'start',
				}}
			>
				<EmployeeDetails />
				<Stack spacing={0.5}>
					<Typography variant="body2">Payroll Period:</Typography>
					<Typography variant="body2">Cut-off Date:</Typography>
					<Typography variant="body2">Payroll Rate:</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
						View 13th Month(pay2025)
					</Typography>
					<Typography variant="body2" color="text.secondary">
						View Leave Balances
					</Typography>
					<Typography variant="body2" color="text.secondary">
						View My BIR2316
					</Typography>
				</Stack>
			</Box>

			<Box sx={{ py: 8, textAlign: 'center' }}>
				<Typography variant="h5" color="text.secondary">No Payroll Record.</Typography>
			</Box>
		</Stack>
	);
}

export default function EmployeePage(props: { disableCustomTheme?: boolean }) {
	const [view, setView] = React.useState<ViewMode>('dashboard');

	return (
		<AppTheme {...props}>
			<CssBaseline enableColorScheme />
			<Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
				<HeaderBar view={view} onViewChange={setView} />
				<Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
					{view === 'dashboard' ? <DashboardView /> : <PayslipView />}
				</Container>

				<Box
					component="footer"
					sx={{
						mt: 3,
						py: 1,
						px: 2,
						bgcolor: '#111827',
						color: '#cbd5e1',
						fontSize: 12,
						textAlign: 'center',
					}}
				>
					Copyright © 2026 ParkHR, Inc. All rights reserved.
				</Box>
			</Box>
		</AppTheme>
	);
}
