import React, { useState, useEffect, useContext } from 'react';
import { 
    Box, TextField, Button, Typography, Paper, Grid, MenuItem, 
    Avatar, Divider, Alert, CircularProgress, IconButton, Tooltip 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VisibilityIcon from '@mui/icons-material/Visibility'; // 👁️ Import View Icon
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const Profile = () => {
    const { token, user } = useContext(AuthContext); 
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState(null);
    const [file, setFile] = useState(null);
    const [savedDocPath, setSavedDocPath] = useState(null); // 📄 Store path of existing doc

    // Initial State
    const [formData, setFormData] = useState({
        newPassword: '', 
        age: '', gender: '', phoneNumber: '', address: '', emergencyContact: '',
        bloodGroup: '', weight: '', height: '', allergies: '', chronicConditions: '',
        specialization: '', registrationNumber: '', qualification: '', experienceYears: '', consultationFee: ''
    });

    // 1. FETCH USER DATA ON LOAD
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const u = res.data;
                
                // Save the document path if it exists
                setSavedDocPath(u.govtIdImagePath || null); 

                setFormData({
                    newPassword: '', 
                    age: u.age || '',
                    gender: u.gender || '',
                    phoneNumber: u.phoneNumber || '',
                    address: u.address || '',
                    emergencyContact: u.emergencyContact || '',
                    // Medical fields (Preserved but hidden for patients)
                    bloodGroup: u.bloodGroup || '',
                    weight: u.weight || '',
                    height: u.height || '',
                    allergies: u.allergies || '',
                    chronicConditions: u.chronicConditions || '',
                    // Doctor fields
                    specialization: u.specialization || '',
                    registrationNumber: u.registrationNumber || '',
                    qualification: u.qualification || '',
                    experienceYears: u.experienceYears || '',
                    consultationFee: u.consultationFee || ''
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                setMsg({ type: 'error', text: 'Failed to load profile data.' });
            }
        };
        fetchProfile();
    }, [token]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setFile(e.target.files[0]);

    // Function to View Document
    const handleViewDoc = () => {
        if (savedDocPath) {
            // Opens the file in a new tab
            window.open(`http://localhost:8080/${savedDocPath}`, '_blank');
        }
    };

    // 2. SUBMIT UPDATES
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);

        const cleanData = {};
        Object.keys(formData).forEach(key => {
            cleanData[key] = formData[key] === '' ? null : formData[key];
        });

        const data = new FormData();
        if (file) {
            data.append('file', file);
        }
        
        const jsonBlob = new Blob([JSON.stringify(cleanData)], { type: 'application/json' });
        data.append('data', jsonBlob);

        try {
            await axios.post('http://localhost:8080/api/user/complete-profile', data, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMsg({ type: 'success', text: 'Profile Updated Successfully!' });
            
            // Optional: Refresh page or re-fetch to show new image immediately
            // window.location.reload(); 
        } catch (err) {
            setMsg({ type: 'error', text: 'Update Failed.' });
        }
    };

    const isDoctor = user?.role === 'DOCTOR';

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
            <Sidebar open={true} role={user?.role} />
            
            <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: 'primary.main' }}>
                    My Profile
                </Typography>

                <Paper sx={{ p: 4, borderRadius: 4, maxWidth: 900 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mr: 3 }}>
                            <AccountCircleIcon sx={{ fontSize: 50 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="bold">{user?.fullName}</Typography>
                            <Typography variant="body1" color="text.secondary">{user?.role} ACCOUNT</Typography>
                        </Box>
                    </Box>

                    {msg && <Alert severity={msg.type} sx={{ mb: 3 }}>{msg.text}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>Personal Details</Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}><TextField fullWidth label="Age" name="age" type="number" value={formData.age} onChange={handleChange} /></Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField fullWidth select label="Gender" name="gender" value={formData.gender} onChange={handleChange} defaultValue="">
                                    <MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={4}><TextField fullWidth label="Phone" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} /></Grid>
                            <Grid item xs={12}><TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} /></Grid>
                            <Grid item xs={12}><TextField fullWidth label="Emergency Contact" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} /></Grid>
                        </Grid>

                        {/* ONLY SHOW THIS SECTION FOR DOCTORS */}
                        {isDoctor && (
                            <>
                                <Typography variant="h6" sx={{ mt: 4, color: 'text.secondary' }}>Professional Info</Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Grid container spacing={3}>
                                    <Grid item xs={6}><TextField fullWidth label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} /></Grid>
                                    <Grid item xs={6}><TextField fullWidth label="Qualification" name="qualification" value={formData.qualification} onChange={handleChange} /></Grid>
                                    <Grid item xs={6}><TextField fullWidth label="Experience (Yrs)" name="experienceYears" type="number" value={formData.experienceYears} onChange={handleChange} /></Grid>
                                    <Grid item xs={6}><TextField fullWidth label="Fee (₹)" name="consultationFee" type="number" value={formData.consultationFee} onChange={handleChange} /></Grid>
                                    <Grid item xs={12}><TextField fullWidth label="License No" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} /></Grid>
                                </Grid>
                            </>
                        )}

                        {/* UPDATE DOCUMENTS SECTION */}
                        <Box sx={{ mt: 4, p: 3, bgcolor: '#f9f9f9', borderRadius: 2, border: '1px dashed #ccc' }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>Update Documents (ID Proof)</Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {/* 1. Upload Button */}
                                <Button component="label" startIcon={<CloudUploadIcon />} variant="outlined" size="small">
                                    {file ? "Change File" : "Choose File"}
                                    <input type="file" hidden onChange={handleFileChange} />
                                </Button>

                                {/* 2. File Name Display */}
                                {file && <Typography component="span" sx={{ color: 'success.main', fontSize: '0.9rem' }}>{file.name}</Typography>}

                                {/* 3. View Button (Only if document exists on server) */}
                                {savedDocPath && (
                                    <Tooltip title="View Current Document">
                                        <IconButton onClick={handleViewDoc} color="primary" sx={{ border: '1px solid #eee', bgcolor: 'white' }}>
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>
                            
                            {savedDocPath && !file && (
                                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                                    ✓ A document is currently uploaded.
                                </Typography>
                            )}
                        </Box>

                        <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />} sx={{ mt: 4, px: 4, borderRadius: 2 }}>
                            Save Changes
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Box>
    );
};

export default Profile;