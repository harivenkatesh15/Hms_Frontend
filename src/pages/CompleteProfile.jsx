import React, { useState, useContext } from 'react';
import { 
    Box, TextField, Button, Typography, Paper, Container, 
    MenuItem, Alert, CssBaseline
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CompleteProfile = () => {
    const { token, logout, user } = useContext(AuthContext); 
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        newPassword: '',
        age: '',
        gender: '',
        phoneNumber: '',
        specialization: '', 
        registrationNumber: '' 
    });
    const [file, setFile] = useState(null);
    const [msg, setMsg] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Dynamic Navigation based on Role
    const handleBack = () => {
        if (user?.role === 'DOCTOR') {
            navigate('/doctor-dashboard');
        } else if (user?.role === 'ADMIN') {
            navigate('/admin-dashboard');
        } else {
            navigate('/patient-dashboard');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file) {
            setMsg({ type: 'error', text: 'Please upload a Government ID.' });
            return;
        }

        const data = new FormData();
        data.append('file', file);
        data.append('newPassword', formData.newPassword);
        data.append('age', formData.age);
        data.append('gender', formData.gender);
        data.append('phoneNumber', formData.phoneNumber);

        // Append doctor-specific fields ONLY if user is a DOCTOR
        if (user?.role === 'DOCTOR') {
            data.append('specialization', formData.specialization);
            data.append('registrationNumber', formData.registrationNumber);
        }

        try {
            await axios.post('http://localhost:8080/api/user/complete-profile', data, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });
            
            setMsg({ type: 'success', text: 'Profile Submitted! Please Login again.' });
            
            // Logout after 2 seconds to force re-login with new status
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error(err);
            setMsg({ type: 'error', text: 'Submission failed. Try again.' });
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', py: 8 }}>
            <CssBaseline />
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                    
                    {/* Back Button */}
                    <Button 
                        startIcon={<ArrowBackIcon />} 
                        onClick={handleBack}
                        sx={{ mb: 2 }}
                    >
                        Back to Dashboard
                    </Button>

                    <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                        Complete Your Profile
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        For security, please update your details and upload a Government ID to verify your identity.
                    </Typography>

                    {msg && <Alert severity={msg.type} sx={{ mb: 2 }}>{msg.text}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField 
                            fullWidth label="Set New Password" name="newPassword" type="password" 
                            margin="normal" required onChange={handleChange} 
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField 
                                fullWidth label="Age" name="age" type="number" 
                                margin="normal" required onChange={handleChange} 
                            />
                            <TextField 
                                fullWidth select label="Gender" name="gender" 
                                margin="normal" required onChange={handleChange} 
                                defaultValue=""
                            >
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </TextField>
                        </Box>

                        <TextField 
                            fullWidth label="Phone Number" name="phoneNumber" 
                            margin="normal" required onChange={handleChange} 
                        />

                        {/* DOCTOR SPECIFIC FIELDS */}
                        {user?.role === 'DOCTOR' && (
                            <>
                                <TextField 
                                    fullWidth label="Specialization" name="specialization" 
                                    margin="normal" required onChange={handleChange} 
                                    placeholder="e.g. Cardiologist"
                                />
                                <TextField 
                                    fullWidth label="Medical License Number" name="registrationNumber" 
                                    margin="normal" required onChange={handleChange} 
                                />
                            </>
                        )}

                        {/* File Upload Box */}
                        <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, mt: 3, textAlign: 'center', cursor: 'pointer', bgcolor: '#fafafa' }}>
                            <Button
                                component="label"
                                startIcon={<CloudUploadIcon />}
                                sx={{ mb: 1 }}
                            >
                                Upload ID Proof (Image/PDF)
                                <input type="file" hidden onChange={handleFileChange} accept="image/*,.pdf" />
                            </Button>
                            {file && (
                                <Typography variant="body2" sx={{ color: 'green', fontWeight: 'bold' }}>
                                    Selected: {file.name}
                                </Typography>
                            )}
                        </Box>

                        <Button 
                            type="submit" fullWidth variant="contained" size="large" 
                            sx={{ mt: 4, py: 1.5, borderRadius: 50 }}
                        >
                            Submit Verification
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default CompleteProfile;