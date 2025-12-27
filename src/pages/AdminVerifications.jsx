import React, { useEffect, useState, useContext } from 'react';
import { 
    Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, 
    Button, Paper, Avatar, Chip, Dialog, DialogTitle, DialogContent, DialogActions, 
    Grid, CircularProgress, Fade, IconButton, Stack, Menu, MenuItem, ListItemIcon, ListItemText
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

// Icons
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList'; // The Filter Icon
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import AppsIcon from '@mui/icons-material/Apps'; // Icon for "All"

const AdminVerifications = () => {
    const [users, setUsers] = useState([]);
    const [filterRole, setFilterRole] = useState('ALL'); // Default is ALL
    const [anchorEl, setAnchorEl] = useState(null); // For the Filter Menu
    
    // Modal States
    const [selectedUser, setSelectedUser] = useState(null);
    const [docImage, setDocImage] = useState(null);
    const [loadingImage, setLoadingImage] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    
    const { token } = useContext(AuthContext);

    // --- Fetch Data ---
    useEffect(() => {
        fetchData();
    }, [token]); 

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/admin/pending-users', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setUsers(res.data);
        } catch (err) { console.error(err); }
    };

    // --- Filter Menu Handlers ---
    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleFilterClose = (role) => {
        if (role) setFilterRole(role);
        setAnchorEl(null);
    };

    // --- Filtering Logic ---
    const filteredUsers = users.filter(u => {
        if (u.status !== 'PENDING') return false; // Safety check

        if (filterRole === 'ALL') return true; // Show everyone
        if (filterRole === 'DOCTOR') return u.role === 'DOCTOR';
        if (filterRole === 'PATIENT') return u.role !== 'DOCTOR' && u.role !== 'ADMIN';
        return false;
    });

    // --- Verification Logic ---
    const handleVerifyClick = async (user) => {
        setSelectedUser(user);
        setOpenModal(true);
        setLoadingImage(true);
        setDocImage(null);

        try {
            const res = await axios.get(`http://localhost:8080/api/admin/user-id-image/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            setDocImage(URL.createObjectURL(res.data));
        } catch (err) { console.error("Image load failed", err); } 
        finally { setLoadingImage(false); }
    };

    const handleApprove = async () => {
        try {
            await axios.put(`http://localhost:8080/api/admin/approve/${selectedUser.id}`, {}, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            fetchData(); 
            setOpenModal(false);
        } catch (err) { alert("Approval Failed"); }
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh', width: '100%' }}>
            <Sidebar open={true} /> 
            
            <Box component="main" sx={{ flexGrow: 1, p: 4, overflowX: 'hidden' }}>
                
                {/* Header Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    {/* Left: Title */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'white', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <VerifiedUserIcon sx={{ fontSize: 32 }} />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight="800" color="#0f172a">Verification Center</Typography>
                            <Typography color="text.secondary" variant="body2">
                                Showing: <strong>{filterRole === 'ALL' ? 'All Requests' : filterRole === 'DOCTOR' ? 'Doctors Only' : 'Patients Only'}</strong>
                            </Typography>
                        </Box>
                    </Box>

                    {/* Right: Filter Button */}
                    <Button 
                        variant="contained"
                        startIcon={<FilterListIcon />}
                        onClick={handleFilterClick}
                        sx={{ 
                            borderRadius: '30px', px: 3, py: 1,
                            bgcolor: 'white', color: '#0f172a',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                            textTransform: 'none', fontWeight: 'bold',
                            '&:hover': { bgcolor: '#f1f5f9' }
                        }}
                    >
                        Filter Requests
                    </Button>

                    {/* Filter Pop-up Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => handleFilterClose(null)}
                        PaperProps={{ sx: { borderRadius: 3, minWidth: 200, mt: 1, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }}
                    >
                        <MenuItem onClick={() => handleFilterClose('ALL')} selected={filterRole === 'ALL'}>
                            <ListItemIcon><AppsIcon fontSize="small" /></ListItemIcon>
                            <ListItemText>All Requests</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handleFilterClose('DOCTOR')} selected={filterRole === 'DOCTOR'}>
                            <ListItemIcon><LocalHospitalIcon fontSize="small" /></ListItemIcon>
                            <ListItemText>Doctors Only</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handleFilterClose('PATIENT')} selected={filterRole === 'PATIENT'}>
                            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                            <ListItemText>Patients Only</ListItemText>
                        </MenuItem>
                    </Menu>
                </Box>

                {/* Table Section */}
                <Fade in={true} key={filterRole}>
                    <Paper sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#64748b', py: 2.5 }}>APPLICANT</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>ROLE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>DETAILS / LICENSE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>STATUS</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', color: '#64748b', pr: 4 }}>ACTION</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.length > 0 ? filteredUsers.map((u) => {
                                    const isDoc = u.role === 'DOCTOR';
                                    return (
                                        <TableRow key={u.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            {/* Name & Email */}
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ 
                                                        bgcolor: isDoc ? '#0f172a' : '#10b981', 
                                                        borderRadius: 2.5, width: 45, height: 45, fontWeight: 'bold'
                                                    }}>
                                                        {u.fullName?.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography fontWeight="700" color="#1e293b">{u.fullName}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            
                                            {/* Role Badge */}
                                            <TableCell>
                                                <Chip 
                                                    label={u.role || "PATIENT"} 
                                                    size="small"
                                                    sx={{ 
                                                        fontWeight: '800', borderRadius: 1.5, fontSize: '0.7rem', px: 0.5,
                                                        bgcolor: isDoc ? '#e2e8f0' : '#dcfce7', 
                                                        color: isDoc ? '#475569' : '#166534'
                                                    }} 
                                                />
                                            </TableCell>

                                            {/* Smart Details Column */}
                                            <TableCell>
                                                <Stack>
                                                    {isDoc ? (
                                                        <>
                                                            <Typography variant="body2" fontWeight="600">{u.registrationNumber}</Typography>
                                                            <Typography variant="caption" color="text.secondary">License No</Typography>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Typography variant="body2" fontWeight="600">{u.age} Yrs / {u.gender}</Typography>
                                                            <Typography variant="caption" color="text.secondary">Demographics</Typography>
                                                        </>
                                                    )}
                                                </Stack>
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell>
                                                <Chip 
                                                    label="Pending" 
                                                    color="warning" 
                                                    size="small" 
                                                    variant="filled"
                                                    sx={{ fontWeight: 'bold', color: '#fff' }} 
                                                />
                                            </TableCell>
                                            
                                            {/* Action Button */}
                                            <TableCell align="right" sx={{ pr: 3 }}>
                                                <IconButton 
                                                    onClick={() => handleVerifyClick(u)}
                                                    sx={{ 
                                                        bgcolor: '#0f172a', color: 'white', borderRadius: 2,
                                                        '&:hover': { bgcolor: '#334155' }
                                                    }}
                                                >
                                                    <FactCheckIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                }) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                                                <FactCheckIcon sx={{ fontSize: 50, color: '#cbd5e1', mb: 2 }} />
                                                <Typography fontWeight="bold" color="text.secondary">No pending requests found.</Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                </Fade>

                {/* --- MODAL (Standard View) --- */}
                <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ borderBottom: '1px solid #f1f5f9', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                        Reviewing: {selectedUser?.fullName}
                        <IconButton onClick={() => setOpenModal(false)}><CloseIcon /></IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ p: 0 }}>
                        <Grid container sx={{ height: 450 }}>
                            <Grid item xs={12} md={4} sx={{ bgcolor: '#f8fafc', p: 3, borderRight: '1px solid #f1f5f9' }}>
                                <Typography variant="overline" color="text.secondary" fontWeight="bold">APPLICANT DETAILS</Typography>
                                <Stack spacing={2} sx={{ mt: 2 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Full Name</Typography>
                                        <Typography variant="body1" fontWeight="600">{selectedUser?.fullName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Email Address</Typography>
                                        <Typography variant="body2">{selectedUser?.email}</Typography>
                                    </Box>
                                    {selectedUser?.role === 'DOCTOR' ? (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">License No</Typography>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#e2e8f0', p: 0.5, borderRadius: 1, display: 'inline-block' }}>
                                                {selectedUser?.registrationNumber}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Demographics</Typography>
                                            <Typography variant="body2">{selectedUser?.age} Yrs / {selectedUser?.gender}</Typography>
                                        </Box>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={8} sx={{ bgcolor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                                {loadingImage ? <CircularProgress sx={{ color: 'white' }} /> : (
                                    docImage ? 
                                    <img src={docImage} alt="ID Proof" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} />
                                    : <Typography color="white" sx={{ opacity: 0.7 }}>No Document Preview Available</Typography>
                                )}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, bgcolor: 'white' }}>
                        <Button onClick={() => setOpenModal(false)} sx={{ color: '#64748b' }}>Cancel</Button>
                        <Button onClick={handleApprove} variant="contained" color="success" disableElevation>Approve & Verify</Button>
                    </DialogActions>
                </Dialog>

            </Box>
        </Box>
    );
};

export default AdminVerifications;