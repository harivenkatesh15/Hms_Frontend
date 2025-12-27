import React, { useState, useEffect, useContext } from 'react';
import { 
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Avatar, Chip, IconButton, Button, Dialog, DialogContent, Tabs, Tab, Grid, CircularProgress, 
    Fade, Stack, InputBase, Alert, Divider, DialogTitle, DialogActions, TextField, Snackbar, Tooltip
} from '@mui/material';
import { 
    Search, Close, MonitorHeart, MedicalServices, Science,
    Bloodtype, MonitorWeight, Straighten, AccessTime, ArrowForward,
    Lock, Key, Send, Description, CheckCircle, Cancel
} from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

// --- THEME ---
const theme = {
    primary: '#6366f1',
    secondary: '#06b6d4',
    accent: '#f43f5e',
    dark: '#1e293b',
    light: '#f8fafc',
    activeGradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    glass: {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
    }
};

// --- HELPER: Extract filename from full path ---
const getFileName = (path) => {
    if (!path) return "";
    return path.split(/[/\\]/).pop();
};

// --- COMPONENT: Bio-HUD ---
const BioHUD = ({ icon, label, value, unit, color }) => (
    <Paper sx={{ 
        p: 3, borderRadius: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', 
        gap: 1, background: 'white', border: `1px solid ${color}20`, position: 'relative', overflow: 'hidden',
        transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: `0 10px 30px -10px ${color}30` }
    }}>
        <Box sx={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, bgcolor: `${color}08`, borderRadius: '50%' }} />
        <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 44, height: 44, mb: 1 }}>{icon}</Avatar>
        <Typography variant="h4" fontWeight="900" sx={{ color: theme.dark }}>{value || '--'}<Typography component="span" variant="caption" sx={{ml:0.5, fontWeight:'bold', color:'text.secondary'}}>{unit}</Typography></Typography>
        <Typography variant="caption" fontWeight="800" sx={{ color: color, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</Typography>
    </Paper>
);

const MyPatients = () => {
    const { user, token } = useContext(AuthContext); 
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);

    // Modal States
    const [profileOpen, setProfileOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [fullRecord, setFullRecord] = useState(null);
    const [recordTab, setRecordTab] = useState(0);
    const [recordLoading, setRecordLoading] = useState(false);

    // Request Access States
    const [requestModalOpen, setRequestModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [requestNote, setRequestNote] = useState('');
    const [toast, setToast] = useState({ open: false, msg: '', severity: 'success' });
    
    // Approved Report IDs
    const [approvedReportIds, setApprovedReportIds] = useState([]);

    // --- 1. FETCH ALL PATIENTS ---
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/appointments/doctor/all', { 
                    headers: { 'Authorization': `Bearer ${token}` } 
                });
                if (Array.isArray(res.data)) {
                    setAppointments(res.data);
                } else {
                    setAppointments([]);
                }
            } catch (err) {
                console.error("Error fetching patients", err);
                setErrorMsg("Failed to load patient list.");
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, [token]);

    // --- 2. HANDLE STATUS CHANGE (Approve/Reject Appointment) ---
    const handleAppointmentStatus = async (appointmentId, newStatus) => {
        try {
            await axios.put(`http://localhost:8080/api/appointments/${appointmentId}/status`, null, {
                params: { status: newStatus },
                headers: { 'Authorization': `Bearer ${token}` } 
            });

            // Update UI Locally
            setAppointments(prev => prev.map(appt => 
                appt.appointmentId === appointmentId ? { ...appt, status: newStatus } : appt
            ));

            setToast({ open: true, msg: `Appointment ${newStatus}!`, severity: 'success' });

        } catch (err) {
            console.error("Status update failed", err);
            setToast({ open: true, msg: 'Failed to update status', severity: 'error' });
        }
    };

    // --- 3. OPEN PROFILE ---
    const handleViewProfile = async (appt) => {
        if (!appt) return;
        setSelectedPatient(appt);
        setProfileOpen(true);
        setRecordLoading(true);
        setFullRecord(null);
        setApprovedReportIds([]); // Reset permissions on open

        try {
            const pId = appt.patientId; 
            
            // Fetch Records
            const recordRes = await axios.get(`http://localhost:8080/api/doctor/records/patient/${pId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setFullRecord(recordRes.data);

            // Fetch Permissions
            if (user?.id) {
                const accessRes = await axios.get(`http://localhost:8080/api/access/check/${user.id}/patient/${pId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setApprovedReportIds(accessRes.data);
            }

        } catch (err) {
            console.error("Fetch error", err);
        } finally {
            setRecordLoading(false);
        }
    };

    // --- 4. SECURE FILE VIEWING (Fixes White Label Error) ---
    const handleViewDocument = async (filePath) => {
        if (!filePath) return;
        const fileName = getFileName(filePath);

        try {
            // Fetch the file securely using Axios (Sends Token)
            const response = await axios.get(`http://localhost:8080/api/files/view/${fileName}`, {
                headers: { 'Authorization': `Bearer ${token}` },
                responseType: 'blob' // IMPORTANT: Tell axios this is a file, not JSON
            });

            // Create a temporary URL for the file
            const file = new Blob([response.data], { type: response.headers['content-type'] });
            const fileURL = URL.createObjectURL(file);

            // Open that URL in a new tab
            window.open(fileURL, '_blank');

        } catch (err) {
            console.error("File Download Error:", err);
            setToast({ open: true, msg: "Could not open file. Access Denied or File Missing.", severity: "error" });
        }
    };

    // --- 5. REQUEST ACCESS LOGIC ---
    const openRequestModal = (report) => {
        setSelectedReport(report);
        setRequestNote('');
        setRequestModalOpen(true);
    };

    const handleSendRequest = async () => {
        if (!requestNote.trim()) {
            setToast({ open: true, msg: 'Please add a note.', severity: 'warning' });
            return;
        }

        try {
            const payload = {
                doctorId: user.id,
                patientId: selectedPatient.patientId,
                reportId: selectedReport.id,
                note: requestNote
            };
            
            await axios.post('http://localhost:8080/api/access/request', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setToast({ open: true, msg: 'Request sent successfully!', severity: 'success' });
            setRequestModalOpen(false);
        } catch (err) {
            console.error("Request Failed:", err);
            const errMsg = err.response?.data || 'Failed to send request.';
            setToast({ open: true, msg: errMsg, severity: 'error' });
        }
    };

    const filteredList = appointments.filter(a => 
        (a.patientName && a.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (a.date && a.date.includes(searchTerm))
    );

    // Status Color Helper
    const getStatusColor = (status) => {
        switch(status) {
            case 'APPROVED': return 'success';
            case 'PENDING': return 'warning';
            case 'CANCELLED': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', bgcolor: '#f1f5f9' }}>
            <Sidebar role="DOCTOR" open={true} />
            
            <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 5, alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: -1, color: theme.dark, mb: 0.5 }}>
                            Patient<span style={{color: theme.primary}}>Directory</span>
                        </Typography>
                        <Typography color="text.secondary" fontWeight="500">Manage appointments & records.</Typography>
                    </Box>
                    <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300, borderRadius: 3 }}>
                        <IconButton sx={{ p: '10px' }}><Search /></IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1, fontWeight: 'bold' }}
                            placeholder="Search Patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Paper>
                </Box>

                {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

                {/* Table */}
                <TableContainer component={Paper} sx={{ borderRadius: 5, boxShadow: theme.glass.boxShadow, overflow: 'hidden' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', pl: 4 }}>PATIENT</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>DATE</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>TIME</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>REASON</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>STATUS</TableCell>
                                <TableCell align="right" sx={{ pr: 4, fontWeight: 'bold', color: 'text.secondary' }}>ACTION</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={6} align="center" sx={{py: 5}}><CircularProgress /></TableCell></TableRow>
                            ) : filteredList.length === 0 ? (
                                <TableRow><TableCell colSpan={6} align="center" sx={{py: 5}}>No appointments found.</TableCell></TableRow>
                            ) : (
                                filteredList.map((row) => (
                                    <TableRow key={row.appointmentId} sx={{ '&:hover': { bgcolor: '#f1f5f9' }, transition: '0.2s' }}>
                                        <TableCell sx={{ pl: 4 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar src={row.patientImage} />
                                                <Box>
                                                    <Typography fontWeight="bold">{row.patientName}</Typography>
                                                    <Typography variant="caption" color="text.secondary">ID: #{row.patientId}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell><Typography fontWeight="500">{dayjs(row.date).format('MMM D, YYYY')}</Typography></TableCell>
                                        <TableCell><Chip icon={<AccessTime sx={{fontSize: 16}}/>} label={row.time?.substring(0, 5)} size="small" sx={{ bgcolor: '#ecfeff', color: theme.secondary, fontWeight: 'bold' }} /></TableCell>
                                        <TableCell>{row.reason}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={row.status} 
                                                size="small" 
                                                color={getStatusColor(row.status)} 
                                                variant={row.status === 'PENDING' ? 'outlined' : 'filled'}
                                            />
                                        </TableCell>
                                        <TableCell align="right" sx={{ pr: 4 }}>
                                            
                                            {/* --- ACTION BUTTONS LOGIC --- */}
                                            {row.status === 'PENDING' ? (
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                    <Tooltip title="Reject">
                                                        <IconButton 
                                                            size="small" 
                                                            color="error" 
                                                            onClick={() => handleAppointmentStatus(row.appointmentId, 'CANCELLED')}
                                                            sx={{ border: '1px solid', borderColor: 'error.main' }}
                                                        >
                                                            <Cancel fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Button 
                                                        variant="contained" 
                                                        size="small" 
                                                        color="success"
                                                        startIcon={<CheckCircle />}
                                                        onClick={() => handleAppointmentStatus(row.appointmentId, 'APPROVED')}
                                                        sx={{ borderRadius: 2 }}
                                                    >
                                                        Approve
                                                    </Button>
                                                </Box>
                                            ) : row.status === 'APPROVED' ? (
                                                <Button 
                                                    variant="contained" 
                                                    size="small" 
                                                    onClick={() => handleViewProfile(row)} 
                                                    sx={{ borderRadius: 3, textTransform: 'none', background: theme.activeGradient }} 
                                                    endIcon={<ArrowForward />}
                                                >
                                                    View Profile
                                                </Button>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">No Actions</Typography>
                                            )}

                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* MODAL: PATIENT PROFILE (Records) */}
                <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 6, ...theme.glass } }}>
                    {selectedPatient && (
                        <>
                            <Box sx={{ p: 4, background: theme.dark, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                    <Avatar src={selectedPatient.patientImage} sx={{ width: 80, height: 80, border: `4px solid ${theme.primary}` }} />
                                    <Box>
                                        <Typography variant="h4" fontWeight="900">{selectedPatient.patientName}</Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.7 }}>{selectedPatient.patientGender} | {selectedPatient.patientAge} Years</Typography>
                                    </Box>
                                </Box>
                                <IconButton onClick={() => setProfileOpen(false)} sx={{ color: 'white' }}><Close /></IconButton>
                            </Box>

                            <Box sx={{ bgcolor: theme.dark, pb: 2 }}>
                                <Tabs value={recordTab} onChange={(e, v) => setRecordTab(v)} centered sx={{ '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)', '&.Mui-selected': { color: theme.secondary } } }}>
                                    <Tab icon={<MonitorHeart />} label="Vitals" />
                                    <Tab icon={<MedicalServices />} label="History" />
                                    <Tab icon={<Science />} label="Labs" />
                                </Tabs>
                            </Box>

                            <DialogContent sx={{ p: 4, minHeight: 450, bgcolor: '#f8fafc' }}>
                                {recordLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}><CircularProgress /></Box> : (
                                    <Fade in={true}>
                                        <Box>
                                            {recordTab === 0 && fullRecord?.latestVitals ? (
                                                <Grid container spacing={3}>
                                                    <Grid item xs={6} md={3}><BioHUD icon={<MonitorHeart />} label="Heart Rate" value={fullRecord.latestVitals.heartRate} unit="bpm" color={theme.accent} /></Grid>
                                                    <Grid item xs={6} md={3}><BioHUD icon={<Bloodtype />} label="BP" value={fullRecord.latestVitals.bloodPressure} unit="" color="#8b5cf6" /></Grid>
                                                    <Grid item xs={6} md={3}><BioHUD icon={<MonitorWeight />} label="Weight" value={fullRecord.latestVitals.weight} unit="kg" color="#f59e0b" /></Grid>
                                                    <Grid item xs={6} md={3}><BioHUD icon={<Straighten />} label="Height" value={fullRecord.latestVitals.height} unit="cm" color={theme.secondary} /></Grid>
                                                </Grid>
                                            ) : recordTab === 0 ? <Alert severity="info">No vitals found.</Alert> : null}

                                            {recordTab === 1 && (
                                                <Stack spacing={2}>
                                                    {fullRecord?.timeline?.map((item, idx) => (
                                                        <Paper key={idx} sx={{ p: 3, borderLeft: `6px solid ${theme.primary}` }}>
                                                            <Typography fontWeight="bold" color="primary">{item.eventType}</Typography>
                                                            <Typography variant="h6">{item.title}</Typography>
                                                            <Typography variant="body2">{item.description}</Typography>
                                                            <Divider sx={{ my: 1 }} />
                                                            <Typography variant="caption">Dr. {item.doctorName} • {item.eventDate}</Typography>
                                                        </Paper>
                                                    ))}
                                                    {!fullRecord?.timeline?.length && <Alert severity="info">No history found.</Alert>}
                                                </Stack>
                                            )}

                                            {recordTab === 2 && (
                                                <Grid container spacing={2}>
                                                    {fullRecord?.reports?.map((rep, idx) => {
                                                        const isLocked = !approvedReportIds.includes(rep.id); 

                                                        return (
                                                            <Grid item xs={6} key={idx}>
                                                                <Paper 
                                                                    sx={{ 
                                                                        p: 3, textAlign: 'center', cursor: isLocked ? 'default' : 'pointer',
                                                                        position: 'relative', overflow: 'hidden', transition: '0.2s',
                                                                        border: isLocked ? `1px solid ${theme.accent}` : `1px solid ${theme.secondary}`,
                                                                        '&:hover': { transform: 'scale(1.02)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' } 
                                                                    }}
                                                                    // ✅ CLICK HANDLER: Calls secure view function
                                                                    onClick={() => {
                                                                        if (!isLocked) {
                                                                            handleViewDocument(rep.filePath);
                                                                        }
                                                                    }}
                                                                >
                                                                    {isLocked ? (
                                                                        <Lock sx={{ fontSize: 40, color: theme.accent, mb: 1 }} />
                                                                    ) : (
                                                                        <Description sx={{ fontSize: 40, color: theme.secondary, mb: 1 }} />
                                                                    )}
                                                                    <Typography fontWeight="bold">{rep.testName}</Typography>
                                                                    <Typography variant="caption" display="block">{rep.testDate}</Typography>
                                                                    {isLocked ? (
                                                                        <Button 
                                                                            variant="contained" size="small" 
                                                                            sx={{ mt: 2, bgcolor: theme.accent, '&:hover': { bgcolor: '#e11d48' } }}
                                                                            startIcon={<Key />}
                                                                            onClick={(e) => { e.stopPropagation(); openRequestModal(rep); }}
                                                                        >
                                                                            Request Access
                                                                        </Button>
                                                                    ) : (
                                                                        <Chip label="ACCESS GRANTED" size="small" sx={{ mt: 2, bgcolor: '#ecfeff', color: theme.secondary, fontWeight: 'bold' }} />
                                                                    )}
                                                                </Paper>
                                                            </Grid>
                                                        );
                                                    })}
                                                    {!fullRecord?.reports?.length && <Alert severity="info">No lab reports found.</Alert>}
                                                </Grid>
                                            )}
                                        </Box>
                                    </Fade>
                                )}
                            </DialogContent>
                        </>
                    )}
                </Dialog>

                {/* MODAL: REQUEST ACCESS */}
                <Dialog open={requestModalOpen} onClose={() => setRequestModalOpen(false)} fullWidth maxWidth="sm">
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Lock color="warning" /> Request Document Access</DialogTitle>
                    <DialogContent>
                        <Alert severity="info" sx={{ mb: 2 }}>Requesting access to <b>{selectedReport?.testName}</b>.</Alert>
                        <TextField autoFocus margin="dense" label="Note to Patient" fullWidth multiline rows={4} value={requestNote} onChange={(e) => setRequestNote(e.target.value)} />
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setRequestModalOpen(false)} color="inherit">Cancel</Button>
                        <Button onClick={handleSendRequest} variant="contained" endIcon={<Send />}>Send Request</Button>
                    </DialogActions>
                </Dialog>

                <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert severity={toast.severity} variant="filled">{toast.msg}</Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default MyPatients;