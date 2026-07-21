"use client";

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
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
			if (userId) {
				document.cookie = `userId=${String(userId)}; Path=/; Max-Age=${60 * 60 * 24 * 30}`;
			}

			dispatch(setUser(user));
			setSnackText('Login successful');
			setSnackOpen(true);
			router.push('/dashboard');
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
					px: 2,
					py: 4,
					background:
						'radial-gradient(circle at top, rgba(20, 184, 166, 0.18), transparent 32%), linear-gradient(180deg, #f7fbff 0%, #ffffff 100%)',
				}}
			>
				<Paper
					elevation={4}
					sx={{
						width: '100%',
						maxWidth: 520,
						borderRadius: 4,
						p: { xs: 3, sm: 4 },
					}}
				>
					<Stack component="form" onSubmit={handleSubmit} spacing={2.5} noValidate>
						<Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center' }}>
							Dashboard Login
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
							Enter your username and password to access the dashboard.
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

						<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
							<Link
								component="button"
								type="button"
								variant="body2"
								onClick={() => setForgotOpen(true)}
							>
								Forgot password?
							</Link>
						</Box>

						{error ? <Alert severity="error">{error}</Alert> : null}

						<Button type="submit" variant="contained" fullWidth disabled={submitting}>
							{submitting ? 'Logging in...' : 'Log in'}
						</Button>

						<ForgotPassword open={forgotOpen} handleClose={() => setForgotOpen(false)} />
					</Stack>
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
