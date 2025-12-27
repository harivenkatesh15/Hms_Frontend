import React, { useState, useContext } from 'react';
import { 
    Dialog, DialogContent, DialogTitle, TextField, Button, Typography, 
    Box, Grid, MenuItem, Alert, Divider, IconButton, useTheme 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CloseIcon from '@mui/icons-material/Close'; // <--- The "Go Back" button
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CompleteProfileModal = ({ open, onClose }) => { 
    const { token, logout, user } = useContext(AuthContext); 
    const navigate = useNavigate();
    const theme = useTheme();

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
        setMsg(null);
        
        if (!file) {
            setMsg({ type: 'error', text: 'Please upload a Government ID.' });
            return;
        }

        const cleanData = {};
        Object.keys(formData).forEach(key => {
            cleanData[key] = formData[key] === '' ? null : formData[key];
        });

        const data = new FormData();
        data.append('file', file);
        const jsonBlob = new Blob([JSON.stringify(cleanData)], { type: 'application/json' });
        data.append('data', jsonBlob);

        try {
            await axios.post('http://localhost:8080/api/user/complete-profile', data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            setMsg({ type: 'success', text: 'Profile Submitted! Logging out...' });
            setTimeout(() => { logout(); navigate('/login'); }, 2000);

        } catch (err) {
            console.error("Upload Error:", err);
            const serverMsg = err.response?.data?.message || 'Submission failed.';
            setMsg({ type: 'error', text: serverMsg });
        }
    };

    const isDoctor = user?.role === 'DOCTOR';

    return (
        <Dialog 
            open={open} 
            onClose={onClose} // Allow closing by clicking outside
            fullWidth 
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    // --- GLASS EFFECT ---
                    background: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.65)',
                    backdropFilter: 'blur(16px)', // The Blur
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1, borderRadius: '50%', background: 'linear-gradient(135deg, #2196F3, #21CBF3)' }}>
                        <VerifiedUserIcon sx={{ color: 'white' }} />
                    </Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
                        Complete Verification
                    </Typography>
                </Box>
                {/* CLOSE BUTTON */}
                <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Please complete these details to activate full access to your account.
                </Typography>

                {msg && <Alert severity={msg.type} sx={{ mb: 3, borderRadius: 2 }}>{msg.text}</Alert>}

                <form onSubmit={handleSubmit}>
                    {/* 1. Security */}
                    <Divider textAlign="left" sx={{ mb: 2, fontSize: '0.8rem', opacity: 0.7 }}>SECURITY</Divider>
                    <TextField fullWidth label="Set New Password" name="newPassword" type="password" required onChange={handleChange} sx={{ mb: 3 }} />

                    {/* 2. Personal Details */}
                    <Divider textAlign="left" sx={{ mb: 2, fontSize: '0.8rem', opacity: 0.7 }}>PERSONAL DETAILS</Divider>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={4}><TextField fullWidth label="Age" name="age" type="number" required onChange={handleChange} /></Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth select label="Gender" name="gender" required onChange={handleChange} defaultValue="">
                                <MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}><TextField fullWidth label="Phone" name="phoneNumber" required onChange={handleChange} /></Grid>
                        <Grid item xs={12}><TextField fullWidth label="Address" name="address" required onChange={handleChange} multiline rows={2} /></Grid>
                        <Grid item xs={12}><TextField fullWidth label="Emergency Contact (Name & Phone)" name="emergencyContact" required onChange={handleChange} /></Grid>
                    </Grid>

                    {/* 3. Role Specific */}
                    <Divider textAlign="left" sx={{ mb: 2, fontSize: '0.8rem', opacity: 0.7 }}>
                        {isDoctor ? "PROFESSIONAL INFO" : "MEDICAL HISTORY"}
                    </Divider>
                    
                    {isDoctor ? (
                        <Grid container spacing={2}>
                            <Grid item xs={6}><TextField fullWidth label="Specialization" name="specialization" required onChange={handleChange} /></Grid>
                            <Grid item xs={6}><TextField fullWidth label="Qualification" name="qualification" required onChange={handleChange} /></Grid>
                            <Grid item xs={6}><TextField fullWidth label="Experience (Yrs)" name="experienceYears" type="number" required onChange={handleChange} /></Grid>
                            <Grid item xs={6}><TextField fullWidth label="Fee (₹)" name="consultationFee" type="number" required onChange={handleChange} /></Grid>
                            <Grid item xs={12}><TextField fullWidth label="Medical License No." name="registrationNumber" required onChange={handleChange} /></Grid>
                        </Grid>
                    ) : (
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <TextField fullWidth select label="Blood Group" name="bloodGroup" onChange={handleChange} defaultValue="">
                                    <MenuItem value="A+">A+</MenuItem><MenuItem value="B+">B+</MenuItem><MenuItem value="O+">O+</MenuItem><MenuItem value="AB+">AB+</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={4}><TextField fullWidth label="Height (cm)" name="height" type="number" onChange={handleChange} /></Grid>
                            <Grid item xs={4}><TextField fullWidth label="Weight (kg)" name="weight" type="number" onChange={handleChange} /></Grid>
                            <Grid item xs={12}><TextField fullWidth label="Allergies" name="allergies" placeholder="Optional" onChange={handleChange} /></Grid>
                            <Grid item xs={12}><TextField fullWidth label="Chronic Conditions" name="chronicConditions" placeholder="Optional" onChange={handleChange} /></Grid>
                        </Grid>
                    )}

                    {/* 4. Upload */}
                    <Box sx={{ 
                        mt: 4, mb: 3, p: 3, borderRadius: 2, border: '2px dashed', borderColor: 'primary.main',
                        bgcolor: 'rgba(25, 118, 210, 0.05)', textAlign: 'center', transition: '0.3s',
                        '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.1)' }
                    }}>
                        <Button component="label" startIcon={<CloudUploadIcon />} variant="contained" sx={{ borderRadius: 20, px: 4 }}>
                            Upload Government ID
                            <input type="file" hidden onChange={handleFileChange} />
                        </Button>
                        {file ? (
                            <Typography sx={{ mt: 2, color: 'success.main', fontWeight: 'bold' }}>✅ {file.name}</Typography>
                        ) : (
                            <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>Required for Admin Verification</Typography>
                        )}
                    </Box>

                    <Button 
                        type="submit" fullWidth variant="contained" size="large" 
                        sx={{ py: 1.5, borderRadius: 2, fontSize: '1.1rem', background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)' }}
                    >
                        Submit Verification
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CompleteProfileModal;