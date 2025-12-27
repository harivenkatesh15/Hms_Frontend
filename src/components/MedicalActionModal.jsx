import React, { useState, useContext, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, TextField, Button, 
    Box, MenuItem, IconButton, Typography, Alert, CircularProgress, Divider 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MedicalActionModal = ({ open, onClose, mode, onSuccess, initialData }) => {
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState(null);

    // 1. PRE-FILL LOGIC
    useEffect(() => {
        if (open && initialData) {
            if (mode === 'PROFILE') {
                setFormData({
                    // Demographics
                    age: initialData.age || '',
                    gender: initialData.gender || '',
                    phoneNumber: initialData.phoneNumber || '',
                    address: initialData.address || '',
                    // Medical
                    bloodGroup: initialData.bloodGroup || '',
                    height: initialData.height || '',
                    weight: initialData.weight || '',
                    allergies: initialData.allergies || '',
                    chronicConditions: initialData.chronicConditions || ''
                });
            } else if (mode === 'LIFESTYLE') {
                setFormData({
                    smokingStatus: initialData.smokingStatus || '',
                    alcoholConsumption: initialData.alcoholConsumption || '',
                    diet: initialData.diet || '',
                    exerciseFrequency: initialData.exerciseFrequency || '',
                    sleepHours: initialData.sleepHours || ''
                });
            }
        } else if (!open) {
            setFormData({});
        }
    }, [open, mode, initialData]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        let url = '';
        let payload = {};
        let isMultipart = false; 

        switch (mode) {
            case 'PROFILE':
                url = '/api/user/complete-profile';
                isMultipart = true;
                const profileData = new FormData();
                const jsonBlob = new Blob([JSON.stringify({
                    age: formData.age, gender: formData.gender,
                    phoneNumber: formData.phoneNumber, address: formData.address,
                    bloodGroup: formData.bloodGroup, height: formData.height,
                    weight: formData.weight, allergies: formData.allergies,
                    chronicConditions: formData.chronicConditions
                })], { type: 'application/json' });
                profileData.append('data', jsonBlob);
                payload = profileData;
                break;

            case 'LIFESTYLE':
                url = '/api/patient/action/update-lifestyle';
                payload = {
                    smokingStatus: formData.smokingStatus,
                    alcoholConsumption: formData.alcoholConsumption,
                    diet: formData.diet,
                    exerciseFrequency: formData.exerciseFrequency,
                    sleepHours: formData.sleepHours
                };
                break;

            case 'VITALS':
                url = '/api/patient/action/add-vital';
                payload = { 
                    heartRate: formData.heartRate, bloodPressure: formData.bloodPressure,
                    temperature: formData.temperature, oxygenLevel: formData.oxygenLevel, weight: formData.weight
                };
                break;
            case 'HISTORY':
                url = '/api/patient/action/add-history';
                payload = { 
                    eventType: formData.eventType, title: formData.title, doctorName: formData.doctorName,
                    description: formData.description, eventDate: formData.eventDate
                };
                break;
            case 'MEDS':
                url = '/api/patient/action/add-prescription';
                payload = { 
                    medicineName: formData.medicineName, dosage: formData.dosage,
                    frequency: formData.frequency, endDate: formData.endDate
                };
                break;
            case 'REPORT':
                url = '/api/patient/action/add-report';
                isMultipart = true;
                const reportData = new FormData();
                reportData.append('file', file);
                reportData.append('testName', formData.testName);
                reportData.append('result', formData.result);
                payload = reportData;
                break;
            default: return;
        }

        try {
            await axios.post(`http://localhost:8080${url}`, payload, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    ...(isMultipart && { 'Content-Type': 'multipart/form-data' }) 
                }
            });
            
            setMsg({ type: 'success', text: 'Saved Successfully!' });
            setTimeout(() => { onSuccess(); onClose(); setMsg(null); }, 1000);
        } catch (err) {
            console.error(err);
            setMsg({ type: 'error', text: 'Failed to save.' });
        } finally { setLoading(false); }
    };

    const titles = {
        'PROFILE': 'Edit Profile',
        'LIFESTYLE': 'Update Lifestyle Habits',
        'VITALS': 'Record Vital Signs',
        'HISTORY': 'Add Medical Event',
        'MEDS': 'Add Prescription',
        'REPORT': 'Upload Lab Report'
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle disableTypography sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div" fontWeight="bold">{titles[mode]}</Typography>
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            
            <DialogContent dividers>
                {msg && <Alert severity={msg.type} sx={{ mb: 2 }}>{msg.text}</Alert>}

                <form onSubmit={handleSubmit}>
                    
                    {/* MODE: PROFILE */}
                    {mode === 'PROFILE' && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <Typography variant="subtitle2" color="primary" fontWeight="bold">Basic Demographics</Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField fullWidth label="Age" name="age" type="number" value={formData.age || ''} onChange={handleChange} />
                                <TextField select fullWidth label="Gender" name="gender" value={formData.gender || ''} onChange={handleChange}>
                                    <MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem>
                                </TextField>
                            </Box>
                            <TextField fullWidth label="Phone" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} />
                            <TextField fullWidth label="Address" name="address" value={formData.address || ''} onChange={handleChange} multiline rows={2} />

                            <Divider sx={{ my: 1 }} />
                            <Typography variant="subtitle2" color="primary" fontWeight="bold">Medical Details</Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField select fullWidth label="Blood Group" name="bloodGroup" value={formData.bloodGroup || ''} onChange={handleChange}>
                                    <MenuItem value="A+">A+</MenuItem><MenuItem value="O+">O+</MenuItem><MenuItem value="B+">B+</MenuItem><MenuItem value="AB+">AB+</MenuItem>
                                </TextField>
                                <TextField fullWidth label="Height (cm)" name="height" type="number" value={formData.height || ''} onChange={handleChange} />
                                <TextField fullWidth label="Weight (kg)" name="weight" type="number" value={formData.weight || ''} onChange={handleChange} />
                            </Box>
                        </Box>
                    )}

                    {/* MODE: LIFESTYLE */}
                    {mode === 'LIFESTYLE' && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField select fullWidth label="Smoking Status" name="smokingStatus" value={formData.smokingStatus || ''} onChange={handleChange}>
                                <MenuItem value="Never">Never</MenuItem><MenuItem value="Former">Former</MenuItem><MenuItem value="Current">Current</MenuItem>
                            </TextField>
                            <TextField select fullWidth label="Alcohol" name="alcoholConsumption" value={formData.alcoholConsumption || ''} onChange={handleChange}>
                                <MenuItem value="None">None</MenuItem><MenuItem value="Socially">Socially</MenuItem><MenuItem value="Frequent">Frequent</MenuItem>
                            </TextField>
                            <TextField select fullWidth label="Diet" name="diet" value={formData.diet || ''} onChange={handleChange}>
                                <MenuItem value="Vegetarian">Vegetarian</MenuItem><MenuItem value="Non-Vegetarian">Non-Vegetarian</MenuItem><MenuItem value="Vegan">Vegan</MenuItem>
                            </TextField>
                            <TextField select fullWidth label="Exercise" name="exerciseFrequency" value={formData.exerciseFrequency || ''} onChange={handleChange}>
                                <MenuItem value="Sedentary">Sedentary</MenuItem><MenuItem value="Moderate">Moderate</MenuItem><MenuItem value="Active">Active</MenuItem>
                            </TextField>
                            <TextField fullWidth label="Sleep (Hours)" name="sleepHours" type="number" value={formData.sleepHours || ''} onChange={handleChange} />
                        </Box>
                    )}

                    {/* MODE: VITALS */}
                    {mode === 'VITALS' && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField fullWidth label="Heart Rate" name="heartRate" type="number" onChange={handleChange} required />
                                <TextField fullWidth label="BP" name="bloodPressure" onChange={handleChange} required />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField fullWidth label="Temp" name="temperature" type="number" onChange={handleChange} required />
                                <TextField fullWidth label="Oxygen" name="oxygenLevel" type="number" onChange={handleChange} required />
                            </Box>
                            <TextField fullWidth label="Weight" name="weight" type="number" onChange={handleChange} />
                        </Box>
                    )}
                    
                    {/* MODE: HISTORY */}
                    {mode === 'HISTORY' && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField select fullWidth label="Event Type" name="eventType" onChange={handleChange} defaultValue="" required>
                                <MenuItem value="Surgery">Surgery</MenuItem><MenuItem value="Diagnosis">Diagnosis</MenuItem>
                            </TextField>
                            <TextField fullWidth label="Title" name="title" onChange={handleChange} required />
                            <TextField fullWidth label="Doctor" name="doctorName" onChange={handleChange} required />
                            <TextField fullWidth label="Date" name="eventDate" type="date" InputLabelProps={{ shrink: true }} onChange={handleChange} required />
                            <TextField fullWidth label="Description" name="description" multiline rows={2} onChange={handleChange} />
                        </Box>
                    )}

                    {/* MODE: MEDS */}
                    {mode === 'MEDS' && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField fullWidth label="Medicine" name="medicineName" onChange={handleChange} required />
                            <TextField fullWidth label="Dosage" name="dosage" onChange={handleChange} required />
                            <TextField fullWidth label="Frequency" name="frequency" onChange={handleChange} required />
                            <TextField fullWidth label="End Date" name="endDate" type="date" InputLabelProps={{ shrink: true }} onChange={handleChange} />
                        </Box>
                    )}

                    {/* MODE: REPORT */}
                    {mode === 'REPORT' && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField fullWidth label="Test Name" name="testName" onChange={handleChange} required />
                            <TextField select fullWidth label="Result" name="result" onChange={handleChange} defaultValue="" required>
                                <MenuItem value="Normal">Normal</MenuItem><MenuItem value="Abnormal">Abnormal</MenuItem>
                            </TextField>
                            <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ py: 2, borderStyle: 'dashed' }}>
                                {file ? file.name : "Choose File"}
                                <input type="file" hidden onChange={handleFileChange} required />
                            </Button>
                        </Box>
                    )}

                    <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mt: 3 }}>
                        {loading ? <CircularProgress size={24} /> : "Save Changes"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default MedicalActionModal;