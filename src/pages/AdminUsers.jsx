import React, { useEffect, useState, useContext } from 'react';
import { 
    Box, Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, 
    Button, Paper, Avatar, Chip, Dialog, DialogTitle, DialogContent, DialogActions, 
    Grid, Divider, CircularProgress, IconButton 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import GroupIcon from '@mui/icons-material/Group';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // User currently being verified
    const [idImage, setIdImage] = useState(null); // The image URL
    const [loadingImage, setLoadingImage] = useState(false);
    const [open, setOpen] = useState(false); // Modal state
    
    const { token } = useContext(AuthContext);

    // 1. Fetch Pending Users on Load
    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/admin/pending-users', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            // Filter for PENDING (users who uploaded ID)
            setUsers(res.data.filter(u => u.status === 'PENDING'));
        } catch (err) { console.error(err); }
    };

    // 2. Handle "Verify" Click -> Open Modal & Fetch Image
    const handleVerifyClick = async (user) => {
        setSelectedUser(user);
        setOpen(true);
        setLoadingImage(true);
        setIdImage(null);

        try {
            // Fetch image as a Blob (Binary Large Object)
            const res = await axios.get(`http://localhost:8080/api/admin/user-id-image/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob' // Important: tells axios to expect binary data
            });
            
            // Create a local URL for the image blob
            const imageUrl = URL.createObjectURL(res.data);
            setIdImage(imageUrl);
        } catch (err) {
            console.error("Failed to load ID image", err);
        } finally {
            setLoadingImage(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    // 3. Approve Logic
    const handleApprove = async () => {
        try {
            await axios.put(`http://localhost:8080/api/admin/approve/${selectedUser.id}`, {}, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            fetchUsers(); // Refresh list
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
                        <GroupIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                        <Typography variant="h4" fontWeight="bold" color="primary">Patient Verifications</Typography>
                    </Box>

                    {/* Table */}
                    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#eeeeee' }}>
                                <TableRow>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Email</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                    <TableCell align="center"><strong>Action</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.length > 0 ? users.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>{user.fullName?.charAt(0)}</Avatar>
                                            {user.fullName}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell><Chip label="Docs Uploaded" color="info" size="small" /></TableCell>
                                        <TableCell align="center">
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                size="small" 
                                                onClick={() => handleVerifyClick(user)} 
                                                sx={{ borderRadius: 20 }}
                                            >
                                                Verify & Approve
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}>No pending requests</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                </Container>

                {/* --- VERIFICATION MODAL --- */}
                <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Verification for: {selectedUser?.fullName}
                        <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={3}>
                            {/* Left Side: User Details */}
                            <Grid item xs={12} md={5}>
                                <Typography variant="h6" gutterBottom>Personal Details</Typography>
                                <Typography variant="body2" color="text.secondary">Full Name</Typography>
                                <Typography variant="body1" fontWeight="bold" gutterBottom>{selectedUser?.fullName}</Typography>
                                
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Email</Typography>
                                <Typography variant="body1" fontWeight="bold" gutterBottom>{selectedUser?.email}</Typography>

                                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Phone Number</Typography>
                                <Typography variant="body1" fontWeight="bold" gutterBottom>{selectedUser?.phoneNumber || 'N/A'}</Typography>

                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Age</Typography>
                                        <Typography variant="body1" fontWeight="bold">{selectedUser?.age || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Gender</Typography>
                                        <Typography variant="body1" fontWeight="bold">{selectedUser?.gender || 'N/A'}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Right Side: ID Image */}
                            <Grid item xs={12} md={7} sx={{ borderLeft: '1px solid #eee' }}>
                                <Typography variant="h6" gutterBottom>Government ID Proof</Typography>
                                <Box sx={{ 
                                    width: '100%', height: 300, bgcolor: '#f0f0f0', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd'
                                }}>
                                    {loadingImage ? (
                                        <CircularProgress />
                                    ) : idImage ? (
                                        <img src={idImage} alt="ID Proof" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <Typography color="error">Image unavailable</Typography>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={handleClose} color="error">Reject</Button>
                        <Button onClick={handleApprove} variant="contained" color="success">Approve User</Button>
                    </DialogActions>
                </Dialog>

            </Box>
        </Box>
    );
};

export default AdminUsers;