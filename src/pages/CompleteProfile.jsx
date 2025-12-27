import React, { useState, useContext } from 'react';
import { 
    Box, TextField, Button, Typography, Paper, Container, 
    MenuItem, Alert, CssBaseline, Grid, Divider
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
        newPassword: '', age: '', gender: '', phoneNumber: '', address: '', emergencyContact: '',
        bloodGroup: '', weight: '', height: '', allergies: '', chronicConditions: '',
        specialization: '', registrationNumber: '', qualification: '', experienceYears: '', consultationFee: ''
    });

    const [file, setFile] = useState(null);
    const [msg, setMsg] = useState(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setFile(e.target.files[0]);

   const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file) {
            setMsg({ type: 'error', text: 'Please upload a Government ID.' });
            return;
        }

        const data = new FormData();
        
        // 1. Append File
        data.append('file', file);

        // 2. Bundle Text Data into JSON Blob (This fixes the Limit Exceeded Error)
        const jsonBlob = new Blob([JSON.stringify(formData)], { type: 'application/json' });
        data.append('data', jsonBlob);

        try {
            await axios.post('http://localhost:8080/api/user/complete-profile', data, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    // Axios handles the multipart boundary automatically
                }
            });
            
            setMsg({ type: 'success', text: 'Profile Updated! Logging out...' });
            
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error(err);
            setMsg({ type: 'error', text: 'Submission failed. Try again.' });
        }
    };

    const isDoctor = user?.role === 'DOCTOR';

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', py: 5 }}>
            <CssBaseline />
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 5, borderRadius: 4 }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/login')} sx={{ mb: 2 }}>Back</Button>
                    <Typography variant="h4" fontWeight="800" color="primary">Complete Profile</Typography>
                    
                    {msg && <Alert severity={msg.type} sx={{ mb: 3 }}>{msg.text}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>1. Security</Typography>
                        <TextField fullWidth label="Set New Password" name="newPassword" type="password" required onChange={handleChange} sx={{ mb: 3 }} />
                        <Divider />

                        <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>2. Personal Details</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}><TextField fullWidth label="Age" name="age" type="number" required onChange={handleChange} /></Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField fullWidth select label="Gender" name="gender" required onChange={handleChange} defaultValue="">
                                    <MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={4}><TextField fullWidth label="Phone" name="phoneNumber" required onChange={handleChange} /></Grid>
                            <Grid item xs={12}><TextField fullWidth label="Address" name="address" required onChange={handleChange} /></Grid>
                            <Grid item xs={12}><TextField fullWidth label="Emergency Contact" name="emergencyContact" required onChange={handleChange} /></Grid>
                        </Grid>
                        <Divider sx={{ mt: 3 }} />

                        {isDoctor ? (
                            <>
                                <Typography variant="h6" fontWeight="bold" sx={{ mt: 3, color: '#0288d1' }}>3. Doctor Profile</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}><TextField fullWidth label="Specialization" name="specialization" required onChange={handleChange} /></Grid>
                                    <Grid item xs={6}><TextField fullWidth label="Qualification" name="qualification" required onChange={handleChange} /></Grid>
                                    <Grid item xs={6}><TextField fullWidth label="Experience (Yrs)" name="experienceYears" type="number" required onChange={handleChange} /></Grid>
                                    <Grid item xs={6}><TextField fullWidth label="Fee (₹)" name="consultationFee" type="number" required onChange={handleChange} /></Grid>
                                    <Grid item xs={12}><TextField fullWidth label="License Number" name="registrationNumber" required onChange={handleChange} /></Grid>
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Typography variant="h6" fontWeight="bold" sx={{ mt: 3, color: '#2e7d32' }}>3. Medical History</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <TextField fullWidth select label="Blood Group" name="bloodGroup" onChange={handleChange} defaultValue="">
                                            <MenuItem value="A+">A+</MenuItem><MenuItem value="B+">B+</MenuItem><MenuItem value="O+">O+</MenuItem><MenuItem value="AB+">AB+</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={4}><TextField fullWidth label="Height (cm)" name="height" type="number" onChange={handleChange} /></Grid>
                                    <Grid item xs={4}><TextField fullWidth label="Weight (kg)" name="weight" type="number" onChange={handleChange} /></Grid>
                                    <Grid item xs={12}><TextField fullWidth label="Allergies" name="allergies" onChange={handleChange} /></Grid>
                                    <Grid item xs={12}><TextField fullWidth label="Chronic Conditions" name="chronicConditions" onChange={handleChange} /></Grid>
                                </Grid>
                            </>
                        )}

                        <Box sx={{ border: '2px dashed #90caf9', borderRadius: 2, p: 4, mt: 4, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                            <Button component="label" startIcon={<CloudUploadIcon />} variant="contained">
                                Upload Government ID
                                <input type="file" hidden onChange={handleFileChange} />
                            </Button>
                            {file && <Typography sx={{ mt: 1, color: 'green' }}>✅ {file.name}</Typography>}
                        </Box>

                        <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 4, py: 1.5 }}>Submit Verification</Button>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default CompleteProfile;