import React, { useState, useEffect, useContext } from 'react';
import { 
    Box, Typography, Paper, Grid, Chip, Button, Avatar, 
    Tabs, Tab, CircularProgress, Alert, Card, CardContent, Divider 
} from '@mui/material';
import { 
    Event, AccessTime, LocationOn, VideoCall, 
    CheckCircle, Cancel, HourglassEmpty, History, CalendarMonth 
} from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

// --- THEME ---
const themeStyles = { 
    primaryGrad: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    greenGrad: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    amberGrad: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    redGrad: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
};

const MyAppointments = () => {
    const { token } = useContext(AuthContext);
    
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0); // 0 = Upcoming, 1 = History
    const [appointments, setAppointments] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    // --- 1. FETCH DATA ---
    useEffect(() => {
        const fetchMyApps = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/appointments/patient/my', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                // DEBUG: Check what the backend actually sent
                console.log("📥 Appointments Data:", res.data);
                
                setAppointments(res.data);
            } catch (err) {
                console.error("Error fetching appointments:", err);
                setErrorMsg("Failed to load appointments.");
            } finally {
                setLoading(false);
            }
        };
        fetchMyApps();
    }, [token]);

    // --- 2. FILTER LOGIC (ROBUST) ---
    const now = dayjs();
    
    const upcomingList = appointments.filter(a => {
        // If status is CANCELLED or COMPLETED, it's definitely History
        if (a.status === 'CANCELLED' || a.status === 'COMPLETED') return false;

        // Otherwise, check date
        const apptDate = dayjs(a.date);
        
        // Safety: If date is invalid, show it in Upcoming so we don't lose it
        if (!apptDate.isValid()) return true; 

        // Show if Future OR Today
        return apptDate.isAfter(now, 'day') || apptDate.isSame(now, 'day');
    });

    const historyList = appointments.filter(a => {
        if (a.status === 'CANCELLED' || a.status === 'COMPLETED') return true;

        const apptDate = dayjs(a.date);
        if (!apptDate.isValid()) return false;

        return apptDate.isBefore(now, 'day');
    });

    const displayList = tabValue === 0 ? upcomingList : historyList;

    // --- HELPER: Status Badge ---
    const getStatusChip = (status) => {
        switch(status) {
            case 'APPROVED': 
                return <Chip icon={<CheckCircle sx={{color:'white !important'}}/>} label="Confirmed" sx={{ background: themeStyles.greenGrad, color: 'white', fontWeight: 'bold' }} />;
            case 'PENDING': 
                return <Chip icon={<HourglassEmpty sx={{color:'white !important'}}/>} label="Pending Approval" sx={{ background: themeStyles.amberGrad, color: 'white', fontWeight: 'bold' }} />;
            case 'CANCELLED': 
                return <Chip icon={<Cancel sx={{color:'white !important'}}/>} label="Cancelled" sx={{ background: themeStyles.redGrad, color: 'white', fontWeight: 'bold' }} />;
            default: 
                return <Chip label={status} />;
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', bgcolor: '#f8fafc' }}>
            <Sidebar role="PATIENT" open={true} />
            
            <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
                
                {/* Header */}
                <Box sx={{ mb: 5 }}>
                    <Typography variant="h3" fontWeight="900" sx={{ color: '#1e293b', letterSpacing: -1 }}>
                        My <span style={{ color: '#6366f1' }}>Appointments</span>
                    </Typography>
                    <Typography variant="body1" color="text.secondary">Track your upcoming visits and previous consultations.</Typography>
                </Box>
                
                {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

                {/* Tabs */}
                <Paper sx={{ borderRadius: 4, mb: 4, bgcolor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Tabs 
                        value={tabValue} 
                        onChange={(e, v) => setTabValue(v)} 
                        variant="fullWidth"
                        sx={{ 
                            '& .Mui-selected': { color: '#6366f1 !important', fontWeight: 'bold' },
                            '& .MuiTabs-indicator': { bgcolor: '#6366f1', height: 3 }
                        }}
                    >
                        <Tab icon={<CalendarMonth />} label={`Upcoming (${upcomingList.length})`} iconPosition="start" sx={{ py: 3 }} />
                        <Tab icon={<History />} label={`History (${historyList.length})`} iconPosition="start" sx={{ py: 3 }} />
                    </Tabs>
                </Paper>

                {/* Content */}
                {loading ? (
                    <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>
                ) : displayList.length === 0 ? (
                    <Box textAlign="center" py={10} sx={{ opacity: 0.6 }}>
                        <Event sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
                        <Typography variant="h6" fontWeight="bold">No Appointments Found</Typography>
                        <Typography>You don't have any appointments in this section.</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {displayList.map((appt) => (
                            <Grid item xs={12} md={6} lg={4} key={appt.appointmentId}>
                                <Card 
                                    sx={{ 
                                        borderRadius: 5, border: '1px solid #e2e8f0', boxShadow: 'none',
                                        transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }
                                    }}
                                >
                                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: '#64748b' }}>
                                            <Event fontSize="small" />
                                            <Typography fontWeight="bold" variant="body2">{dayjs(appt.date).format('MMMM D, YYYY')}</Typography>
                                        </Box>
                                        {getStatusChip(appt.status)}
                                    </Box>

                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                            <Avatar src={appt.doctorImage} sx={{ width: 64, height: 64, border: '3px solid #f1f5f9' }} />
                                            <Box>
                                                <Typography variant="h6" fontWeight="800" sx={{ color: '#1e293b', lineHeight: 1.2 }}>Dr. {appt.doctorName}</Typography>
                                                <Typography variant="body2" color="primary" fontWeight="600">{appt.specialization}</Typography>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#eff6ff', borderRadius: 3, textAlign: 'center' }}>
                                                    <AccessTime sx={{ color: '#6366f1', mb: 0.5 }} />
                                                    <Typography variant="h6" fontWeight="900" sx={{ color: '#1e293b' }}>
                                                        {appt.time ? appt.time.substring(0,5) : '--:--'}
                                                    </Typography>
                                                    <Typography variant="caption" fontWeight="bold" color="text.secondary">TIME</Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#f0fdf4', borderRadius: 3, textAlign: 'center' }}>
                                                    <LocationOn sx={{ color: '#10b981', mb: 0.5 }} />
                                                    <Typography variant="h6" fontWeight="900" sx={{ color: '#1e293b' }}>Clinic</Typography>
                                                    <Typography variant="caption" fontWeight="bold" color="text.secondary">LOCATION</Typography>
                                                </Paper>
                                            </Grid>
                                        </Grid>

                                        {appt.status === 'APPROVED' && tabValue === 0 && (
                                            <Button 
                                                fullWidth variant="contained" 
                                                startIcon={<VideoCall />}
                                                sx={{ mt: 3, borderRadius: 3, bgcolor: '#1e293b', py: 1.5 }}
                                            >
                                                Join Video Call
                                            </Button>
                                        )}
                                        
                                        {appt.status === 'PENDING' && (
                                            <Alert severity="warning" sx={{ mt: 3, borderRadius: 3 }}>Waiting for Doctor Confirmation.</Alert>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

export default MyAppointments;