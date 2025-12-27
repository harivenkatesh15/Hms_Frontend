import React, { useState, useContext } from 'react';
import {
    TextField, Button, Typography, Alert, Box, Paper, Grid, Avatar, CssBaseline, Link
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// A professional, bright medical image
const bgImage = 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=2000&auto=format&fit=crop';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Added loading state
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

   const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
            
            // 🔍 DEBUG: Check console to prove ID is arriving
            console.log("Login Success! Response Data:", res.data);

            // 1. Extract ALL fields including the new ID
            const { token, role, fullName, status, id } = res.data;

            // 2. Create a User Object (Vital for features like Request Access)
            const userData = {
                id: id,            // <--- CRITICAL FIX: Saving the ID
                email: email,
                role: role,
                fullName: fullName,
                status: status
            };

            // 3. Send to AuthContext
            // Note: Ensure your AuthContext 'login' function accepts (userData, token)
            login(userData, token);

            // 4. Redirect based on Role
            if (role === 'ADMIN') navigate('/admin-dashboard');
            else if (role === 'DOCTOR') navigate('/doctor-dashboard');
            else navigate('/patient/dashboard'); // Updated to match your new route structure

        } catch (err) {
            console.error("Login Error:", err);
            setError('Invalid Credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            {/* Left Side - Professional Image */}
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    }}
                />
            </Grid>

            {/* Right Side - Login Form */}
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center',
                        height: '100%', justifyContent: 'center'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
                        <LockOutlinedIcon fontSize="large" />
                    </Avatar>
                    <Typography component="h1" variant="h4" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>
                        Welcome Back
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Sign in to your MedVault account
                    </Typography>

                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%', maxWidth: '450px' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ py: 1.5, fontSize: '1rem', fontWeight: 600, borderRadius: 2 }}
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </Button>
                        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                            <Grid item>
                                <Link href="#" onClick={() => navigate('/register')} variant="body2" sx={{ textDecoration: 'none', fontWeight: 500 }}>
                                    Don't have an account? Register
                                </Link>
                            </Grid>
                        </Grid>
                        
                        <Box sx={{ mt: 5, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                © {new Date().getFullYear()} MedVault HMS. All rights reserved.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Login;