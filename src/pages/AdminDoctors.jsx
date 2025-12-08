import React, { useEffect, useState, useContext } from 'react';
import { 
    Box, Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, 
    Button, Paper, Avatar, Chip, Dialog, DialogTitle, DialogContent, DialogActions, 
    Grid, CircularProgress, IconButton 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null); // Doctor being verified
    const [idImage, setIdImage] = useState(null); 
    const [loadingImage, setLoadingImage] = useState(false);
    const [open, setOpen] = useState(false); 
    
    const { token } = useContext(AuthContext);

    // 1. Fetch Pending Doctors
    useEffect(() => {
        fetchDoctors();
    }, [token]);

    const fetchDoctors = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/admin/pending-users', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            // Filter: Role is DOCTOR and Status is PENDING (Docs uploaded)
            setDoctors(res.data.filter(u => u.role === 'DOCTOR' && u.status === 'PENDING'));
        } catch (err) { console.error(err); }
    };

    // 2. Open Verification Modal
    const handleVerifyClick = async (doc) => {
        setSelectedDoc(doc);
        setOpen(true);
        setLoadingImage(true);
        setIdImage(null);

        try {
            const res = await axios.get(`http://localhost:8080/api/admin/user-id-image/${doc.id}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            setIdImage(URL.createObjectURL(res.data));
        } catch (err) {
            console.error("Failed to load ID", err);
        } finally {
            setLoadingImage(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDoc(null);
    };

    // 3. Approve License Logic
    const handleApprove = async () => {
        try {
            await axios.put(`http://localhost:8080/api/admin/approve/${selectedDoc.id}`, {}, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            fetchDoctors(); 
            handleClose();
        } catch (err) {
            alert("Approval Failed");
        }
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: '#f4f6f8', minHeight: '100vh' }}>
            <Sidebar role="ADMIN" open={true} />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Container maxWidth="lg">
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <LocalHospitalIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                        <Typography variant="h4" fontWeight="bold" color="primary">Doctor License Verification</Typography>
                    </Box>

                    {/* Doctors List */}
                    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#eeeeee' }}>
                                <TableRow>
                                    <TableCell><strong>Doctor Name</strong></TableCell>
                                    <TableCell><strong>Specialization</strong></TableCell>
                                    <TableCell><strong>License No.</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                    <TableCell align="center"><strong>Action</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {doctors.length > 0 ? doctors.map((doc) => (
                                    <TableRow key={doc.id} hover>
                                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>{doc.fullName?.charAt(0)}</Avatar>
                                            {doc.fullName}
                                        </TableCell>
                                        <TableCell>{doc.specialization || "N/A"}</TableCell>
                                        <TableCell>{doc.registrationNumber || "N/A"}</TableCell>
                                        <TableCell><Chip label="Review Needed" color="warning" size="small" /></TableCell>
                                        <TableCell align="center">
                                            <Button 
                                                variant="contained" 
                                                color="success" 
                                                size="small" 
                                                onClick={() => handleVerifyClick(doc)} 
                                                sx={{ borderRadius: 20 }}
                                            >
                                                Verify License
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>No pending doctor reviews</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                </Container>

                {/* --- LICENSE VERIFICATION MODAL --- */}
                <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f5f5f5' }}>
                        <Typography variant="h6">Verifying: Dr. {selectedDoc?.fullName}</Typography>
                        <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                    </DialogTitle>
                    
                    <DialogContent dividers>
                        <Grid container spacing={3}>
                            {/* Left Side: Professional Info */}
                            <Grid item xs={12} md={5}>
                                <Typography variant="h6" color="primary" gutterBottom>Professional Credentials</Typography>
                                
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary">Specialization</Typography>
                                    <Typography variant="h6">{selectedDoc?.specialization || "Not Provided"}</Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary">Medical License Number</Typography>
                                    <Typography variant="h6" sx={{ fontFamily: 'monospace', letterSpacing: 1 }}>
                                        {selectedDoc?.registrationNumber || "Not Provided"}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary">Email Contact</Typography>
                                    <Typography variant="body1">{selectedDoc?.email}</Typography>
                                </Box>
                            </Grid>

                            {/* Right Side: ID Proof */}
                            <Grid item xs={12} md={7} sx={{ borderLeft: '1px solid #eee' }}>
                                <Typography variant="h6" gutterBottom>Uploaded License / ID</Typography>
                                <Box sx={{ 
                                    width: '100%', height: 350, bgcolor: '#f0f0f0', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    borderRadius: 2, overflow: 'hidden', border: '1px solid #ccc'
                                }}>
                                    {loadingImage ? (
                                        <CircularProgress />
                                    ) : idImage ? (
                                        <img src={idImage} alt="Doctor ID" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <Typography color="error">Document unavailable</Typography>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                        <Button onClick={handleClose} color="error" variant="outlined">Reject Application</Button>
                        <Button onClick={handleApprove} variant="contained" color="success" size="large">
                            Approve & Activate Doctor
                        </Button>
                    </DialogActions>
                </Dialog>

            </Box>
        </Box>
    );
};

export default AdminDoctors;