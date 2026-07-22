"use client";

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ForgotPassword from '../../components/ForgotPassword';
import { useAppDispatch } from '../../store/store';
import { setUser } from '../../store/userSlice';
import AppTheme from '../../theme/AppTheme';

export default function DashboardLoginPage(props: { disableCustomTheme?: boolean }) {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [identifier, setIdentifier] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [submitting, setSubmitting] = React.useState(false);
	const [forgotOpen, setForgotOpen] = React.useState(false);
	const [snackOpen, setSnackOpen] = React.useState(false);
	const [snackText, setSnackText] = React.useState('');
	const [error, setError] = React.useState<string | null>(null);

	const API_BASE =
		(process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')) ||
		'http://localhost:5000';

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);

		if (!identifier.trim() || !password.trim()) {
			setError('Username and password are required.');
			return;
		}

		setSubmitting(true);
		try {
			const res = await fetch(`${API_BASE}/users/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ identifier: identifier.trim(), password }),
			});

			const contentType = res.headers.get('content-type') || '';
			let body: any = null;
			if (contentType.includes('application/json')) {
				body = await res.json();
			} else {
				body = await res.text();
			}

			if (!res.ok) {
				setError(body?.error || body || res.statusText || 'Login failed.');
				return;
			}

			const user = body?.user || body;
			const userId = user?._id || user?.id || user?._doc?._id;
			const userType = String(user?.userType || '').toLowerCase();
			if (userId) {
				document.cookie = `userId=${String(userId)}; Path=/; Max-Age=${60 * 60 * 24 * 30}`;
				window.localStorage.setItem('parkhr.userId', String(userId));
			}

			// Persist full user details to localStorage but strip any password fields
			try {
				const safeUser: any = { ...(user || {}) };
				delete safeUser.password;
				delete safeUser.passwd;
				delete safeUser.pwd;
				window.localStorage.setItem('parkhr.user', JSON.stringify(safeUser));
			} catch (err) {
				console.warn('Failed to persist user to localStorage', err);
			}

			dispatch(setUser(user));
			setSnackText('Login successful');
			setSnackOpen(true);
			if (userType === 'admin') {
				router.push('/admin-dashboard');
			} else if (userType === 'staff') {
				router.push('/hr-dashboard');
			} else if (userType === 'hr') {
				router.push('/hr-dashboard');
			} else if (userType === 'employee') {
				router.push('/employee-page');
			} else {
				router.push('/dashboard');
			}
		} catch (err) {
			setError('Login error: ' + String(err));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<AppTheme {...props}>
			<CssBaseline enableColorScheme />
			<Box
				sx={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					px: { xs: 1.25, sm: 2 },
					py: { xs: 2, sm: 4 },
					background:
						'radial-gradient(circle at 14% 18%, rgba(16,121,39,0.12), transparent 35%), linear-gradient(180deg, #ffffff 0%, #f6fbf6 100%)',
				}}
			>
				<Paper
					elevation={4}
					sx={{
						width: '100%',
						maxWidth: 1100,
						borderRadius: 4,
						overflow: 'hidden',
						border: '1px solid rgba(0,0,0,0.12)',
					}}
				>
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.1fr) minmax(0, 1fr)' },
							minHeight: { xs: 'auto', md: 620 },
						}}
					>
						<Box
							sx={{
								position: 'relative',
								overflow: 'hidden',
								background:
									'radial-gradient(circle at 30% 22%, rgba(255,255,255,0.12), transparent 42%), linear-gradient(145deg, #107927 0%, #0b5d1e 100%)',
								p: { xs: 3, md: 4 },
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
							}}
						>
							<Box
								sx={{
									position: 'absolute',
									inset: 0,
									opacity: 0.13,
									backgroundImage:
										'radial-gradient(circle at 20% 25%, rgba(255,255,255,0.55) 0, transparent 36%), radial-gradient(circle at 75% 70%, rgba(0,0,0,0.45) 0, transparent 40%)',
								}}
							/>
							<Box
								sx={{
									position: 'absolute',
									right: { md: -130 },
									top: 0,
									height: '100%',
									width: 260,
									borderRadius: '50% 0 0 50%',
									background: '#ffffff',
									display: { xs: 'none', md: 'block' },
								}}
							/>

							<Box
								sx={{
									position: 'relative',
									zIndex: 2,
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									bgcolor: 'rgba(255,255,255,0.96)',
									px: 1.5,
									py: 1,
									borderRadius: 2,
									border: '1px solid rgba(0,0,0,0.15)',
									boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
									width: 'fit-content',
								}}
							>
								<Image
									src="/logo_2.png"
									alt="ParkHR logo"
									width={210}
									height={80}
									priority
									style={{ width: '210px', height: 'auto' }}
								/>
							</Box>

							<Box sx={{ position: 'relative', zIndex: 1, mt: { xs: 8, md: 0 }, mb: { xs: 3, md: 11 } }}>
								<Typography sx={{ color: 'rgba(255,255,255,0.84)', fontSize: 24, fontWeight: 300, letterSpacing: '0.03em' }}>
									MY DASHBOARD
								</Typography>
								<Typography sx={{ color: '#ffffff', fontSize: { xs: 36, md: 44 }, fontWeight: 900, lineHeight: 1.05 }}>
									ADMIN LOGIN
								</Typography>
							</Box>
						</Box>

						<Stack
							component="form"
							onSubmit={handleSubmit}
							spacing={2.25}
							noValidate
							sx={{ p: { xs: 3, sm: 4.5, md: 6 }, justifyContent: 'center' }}
						>
							<Typography sx={{ color: '#107927', fontWeight: 900, fontSize: 20, letterSpacing: '0.08em', textAlign: { xs: 'left', sm: 'center', md: 'left' } }}>
								PARKING RESERVATION
							</Typography>
							<Typography sx={{ color: '#111111', fontWeight: 900, fontSize: { xs: 32, md: 38 }, lineHeight: 1.1 }}>
								WELCOME BACK!
							</Typography>
							<Typography sx={{ color: 'rgba(0,0,0,0.66)', fontSize: 14 }}>
								Please login to view your dashboard.
							</Typography>

							<TextField
								label="Username"
								name="identifier"
								autoComplete="username"
								value={identifier}
								onChange={(e) => setIdentifier(e.target.value)}
								fullWidth
								required
							/>

							<TextField
								label="Password"
								name="password"
								type="password"
								autoComplete="current-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								fullWidth
								required
							/>

							<Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
								<FormControlLabel
									control={<Checkbox size="small" sx={{ color: '#111111', '&.Mui-checked': { color: '#107927' } }} />}
									label={<Typography sx={{ fontSize: 13, color: 'rgba(0,0,0,0.72)' }}>Keep me logged in</Typography>}
									sx={{ ml: -0.5 }}
								/>
								<Link
									component="button"
									type="button"
									variant="body2"
									onClick={() => setForgotOpen(true)}
									sx={{ color: '#111111', textDecorationColor: 'rgba(0,0,0,0.35)', fontSize: 13 }}
								>
									Forgot password? Reset now
								</Link>
							</Stack>

							{error ? <Alert severity="error">{error}</Alert> : null}

							<Button
								type="submit"
								variant="contained"
								disabled={submitting}
								sx={{
									alignSelf: { xs: 'stretch', sm: 'center' },
									minWidth: { sm: 180 },
									py: 1.1,
									fontWeight: 800,
									letterSpacing: '0.05em',
									bgcolor: '#107927',
									'&:hover': { bgcolor: '#0b5d1e' },
								}}
							>
								{submitting ? 'LOGGING IN...' : 'LOGIN'}
							</Button>

							<Typography sx={{ color: 'rgba(0,0,0,0.46)', fontSize: 12, pt: 0.5 }}>
								By signing in, you accept the terms, privacy policy, and data usage guidelines.
							</Typography>

							<ForgotPassword open={forgotOpen} handleClose={() => setForgotOpen(false)} />
						</Stack>
					</Box>
				</Paper>

				<Snackbar
					open={snackOpen}
					autoHideDuration={3000}
					onClose={() => setSnackOpen(false)}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				>
					<Alert onClose={() => setSnackOpen(false)} severity="success" sx={{ width: '100%' }}>
						{snackText}
					</Alert>
				</Snackbar>
			</Box>
		</AppTheme>
	);
}
