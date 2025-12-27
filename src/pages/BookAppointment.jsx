import React, { useState, useEffect, useContext } from 'react';
import { 
    Box, Typography, Paper, Grid, Button, Avatar, 
    Divider, CircularProgress, Alert, Dialog, DialogTitle, 
    DialogContent, DialogActions, TextField, 
    Card, CardContent, IconButton, Chip, Stack, Snackbar, Fade, Skeleton 
} from '@mui/material';
import { 
    Search, FilterList, AccessTime, ArrowBack, 
    CheckCircle, School, LocalHospital, WorkspacePremium, 
    Star, Person, Block, WbTwilight, WbSunny, NightsStay 
} from '@mui/icons-material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

// --- STYLING CONSTANTS ---
const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const themeStyles = { 
    primaryGrad: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
    glass: {
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
    }
};

// --- HELPER: Normalize Time ---
const normalizeTime = (timeStr) => {
    if (!timeStr) return null;
    return timeStr.length > 5 ? timeStr.substring(0, 5) : timeStr;
};

// --- HELPER: Get Time Period (Morning/Afternoon/Evening) ---
const getTimePeriod = (timeStr) => {
    const hour = parseInt(timeStr.split(':')[0], 10);
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
};

const BookAppointment = () => {
    const { token } = useContext(AuthContext);

    // --- STATES ---
    const [view, setView] = useState('LIST'); 
    const [loading, setLoading] = useState(true);
    const [doctorsList, setDoctorsList] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Profile & Schedule
    const [profileOpen, setProfileOpen] = useState(false);
    const [profileDoctor, setProfileDoctor] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    
    // Slots
    const [allSlots, setAllSlots] = useState([]); 
    const [slotsLoading, setSlotsLoading] = useState(false);
    
    // Booking Actions
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // --- 1. INITIAL LOAD ---
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/doctors', { 
                    headers: { 'Authorization': `Bearer ${token}` } 
                });
                setDoctorsList(res.data);
            } catch (err) { 
                console.error(err);
                setErrorMsg("Could not connect to the server.");
            } finally { 
                setLoading(false); 
            }
        };
        fetchDoctors();
    }, [token]);

    // --- 2. HANDLER: SELECT DOCTOR ---
    const handleDoctorSelect = async (doc) => {
        setSelectedDoctor(doc);
        setView('BOOKING');
        setAllSlots([]); 
        setSchedule([]); 
        setLeaves([]);

        try {
            const [schedRes, leaveRes] = await Promise.all([
                axios.get(`http://localhost:8080/api/doctors/schedule/${doc.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                axios.get(`http://localhost:8080/api/doctors/leaves/${doc.id}`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            // Map schedule to ensure all days exist
            const cleanSchedule = DAYS_OF_WEEK.map(day => {
                const found = schedRes.data.find(d => d.dayOfWeek === day);
                const isAvail = found ? (found.isAvailable ?? found.available ?? false) : false;
                return found ? { ...found, isAvailable: isAvail } : { dayOfWeek: day, isAvailable: false };
            });

            setSchedule(cleanSchedule);
            setLeaves(leaveRes.data || []);
        } catch (err) {
            console.error("Error fetching schedule details", err);
        }
    };

    // --- 3. GENERATE SLOTS WITH STATUS ---
    useEffect(() => {
        if (view !== 'BOOKING' || !selectedDoctor) return;

        const generateSlots = async () => {
            setSlotsLoading(true);
            const dateStr = selectedDate.format('YYYY-MM-DD');
            const isLeave = leaves.some(l => l.leaveDate === dateStr);
            
            if (isLeave) { setAllSlots([]); setSlotsLoading(false); return; }

            const jsDay = selectedDate.day(); 
            const dayName = DAYS_OF_WEEK[jsDay === 0 ? 6 : jsDay - 1]; 
            const rule = schedule.find(s => s.dayOfWeek === dayName);

            if (!rule || !rule.isAvailable) { setAllSlots([]); setSlotsLoading(false); return; }

            let blockedTimes = [];
            let bookedTimes = [];

            try {
                const startT = dateStr + 'T00:00:00';
                const endT = dateStr + 'T23:59:59';
                
                // Parallel Fetch
                const [blockedRes, bookedRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/doctors/slots/blocked/${selectedDoctor.id}?start=${startT}&end=${endT}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get(`http://localhost:8080/api/appointments/doctor/${selectedDoctor.id}/date/${dateStr}`, { headers: { 'Authorization': `Bearer ${token}` } }) 
                ]);

                if(Array.isArray(blockedRes.data)) blockedTimes = blockedRes.data.map(b => dayjs(b.slotDateTime).format('HH:mm'));
                if(Array.isArray(bookedRes.data)) bookedTimes = bookedRes.data.map(b => normalizeTime(b.time));

            } catch (err) { 
                console.log("Data fetch warning:", err);
            }

            const generated = [];
            let current = dayjs(`${dateStr} ${rule.startTime}`);
            const end = dayjs(`${dateStr} ${rule.endTime}`);
            const duration = rule.slotDuration || 30;

            while (current.isBefore(end)) {
                const timeStr = current.format('HH:mm');
                const nextTime = current.add(duration, 'minute');
                
                // Check Breaks
                const isBreak = rule.breaks?.some(brk => {
                    const bStart = dayjs(`${dateStr} ${brk.startTime}`);
                    const bEnd = dayjs(`${dateStr} ${brk.endTime}`);
                    return (current.isSame(bStart) || current.isAfter(bStart)) && current.isBefore(bEnd);
                });

                if (!isBreak && (nextTime.isBefore(end) || nextTime.isSame(end))) {
                    let status = 'AVAILABLE';
                    
                    if (blockedTimes.includes(timeStr)) status = 'BLOCKED';
                    else if (bookedTimes.includes(timeStr)) status = 'BOOKED';
                    else if (selectedDate.isSame(dayjs(), 'day') && current.isBefore(dayjs())) status = 'PASSED';

                    generated.push({ 
                        time: timeStr, 
                        status,
                        period: getTimePeriod(timeStr) // Add period for grouping
                    });
                }
                current = nextTime;
            }
            setAllSlots(generated);
            setSlotsLoading(false);
        };

        generateSlots();
    }, [selectedDate, schedule, leaves, selectedDoctor, view, token]);

    // --- 4. BOOKING (DEBUGGED VERSION) ---
    const handleConfirmBooking = async () => {
        if (!selectedSlot || !selectedDate || !selectedDoctor) {
            console.error("Missing Data:", { selectedSlot, selectedDate, selectedDoctor });
            return;
        }

        // 1. FORMAT DATA CORRECTLY
        // Java LocalTime usually needs "HH:mm:ss". If slot is "09:00", add ":00".
        const formattedTime = selectedSlot.length === 5 ? selectedSlot + ":00" : selectedSlot;
        const formattedDate = selectedDate.format('YYYY-MM-DD');

        const payload = {
            doctorId: selectedDoctor.id,
            date: formattedDate,
            time: formattedTime, 
            reason: reason || "Regular Checkup"
        };

        // 2. DEBUG LOG (Open Console F12 to see this)
        console.group("🚀 ATTEMPTING BOOKING");
        console.log("URL:", 'http://localhost:8080/api/appointments/book');
        console.log("Payload Sending:", JSON.stringify(payload, null, 2));
        console.groupEnd();

        try {
            const res = await axios.post('http://localhost:8080/api/appointments/book', payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            console.log("✅ SUCCESS RESPONSE:", res.data);
            
            setConfirmOpen(false);
            setSuccessOpen(true);
            setReason('');
        } catch (err) {
            // 3. DETAILED ERROR ANALYSIS
            console.group("❌ BOOKING FAILED");
            console.error("Full Error Object:", err);
            
            if (err.response) {
                // The server responded with a status code outside of 2xx
                console.error("Status Code:", err.response.status); 
                console.error("Server Data (The Reason):", err.response.data); 
                
                // Show the actual server error message to the user
                const serverMessage = typeof err.response.data === 'string' 
                    ? err.response.data 
                    : "Invalid Data Format (Check Console)";
                
                setErrorMsg(`Server Error: ${serverMessage}`);
            } else {
                console.error("Request Error:", err.message);
                setErrorMsg("Server not responding.");
            }
            console.groupEnd();
            setConfirmOpen(false);
        }
    };

    // --- HELPER: Render Slot Section ---
    const renderSlotSection = (period, icon, label) => {
        const slotsInPeriod = allSlots.filter(s => s.period === period);
        if (slotsInPeriod.length === 0) return null;

        return (
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#64748b' }}>
                    {icon}
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>{label}</Typography>
                    <Divider sx={{ flexGrow: 1 }} />
                </Box>
                <Grid container spacing={2}>
                    {slotsInPeriod.map((slot) => {
                        const isAvailable = slot.status === 'AVAILABLE';
                        const isBooked = slot.status === 'BOOKED';
                        const isBlocked = slot.status === 'BLOCKED' || slot.status === 'PASSED';

                        return (
                            <Grid item xs={4} sm={3} md={2} key={slot.time}>
                                <Button 
                                    fullWidth
                                    disabled={!isAvailable}
                                    onClick={() => { setSelectedSlot(slot.time); setConfirmOpen(true); }}
                                    sx={{ 
                                        py: 1.5, borderRadius: 3, fontWeight: 'bold', border: '1px solid',
                                        bgcolor: isBooked ? '#fff7ed' : isBlocked ? '#f1f5f9' : (selectedSlot === slot.time ? '#6366f1' : '#fff'),
                                        color: isBooked ? '#f59e0b' : isBlocked ? '#94a3b8' : (selectedSlot === slot.time ? 'white' : '#1e293b'),
                                        borderColor: isBooked ? '#ffedd5' : isBlocked ? '#e2e8f0' : (selectedSlot === slot.time ? '#6366f1' : '#e2e8f0'),
                                        backgroundImage: isBooked ? 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(245, 158, 11, 0.05) 5px, rgba(245, 158, 11, 0.05) 10px)' : 'none',
                                        '&:hover': { 
                                            bgcolor: isAvailable ? (selectedSlot === slot.time ? '#4f46e5' : '#eff6ff') : undefined,
                                            transform: isAvailable ? 'translateY(-2px)' : 'none',
                                            boxShadow: isAvailable ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none'
                                        },
                                        transition: 'all 0.2s', opacity: isBlocked ? 0.6 : 1
                                    }}
                                >
                                    {isBooked ? (
                                        <Stack alignItems="center" spacing={0}>
                                            <Person fontSize="small" sx={{ fontSize: 16 }} />
                                            <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>Taken</Typography>
                                        </Stack>
                                    ) : isBlocked ? (
                                        <Stack alignItems="center" spacing={0}>
                                            <Block fontSize="small" sx={{ fontSize: 16 }} />
                                            <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>Busy</Typography>
                                        </Stack>
                                    ) : (
                                        slot.time
                                    )}
                                </Button>
                            </Grid>
                        )
                    })}
                </Grid>
            </Box>
        );
    };

    const filteredDoctors = doctorsList.filter(d => 
        (d.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (d.specialization || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', bgcolor: '#f1f5f9', backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                <Sidebar role="PATIENT" open={true} />
                
                <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
                    
                    {/* === VIEW 1: SEARCH === */}
                    {view === 'LIST' && (
                        <Fade in={true}>
                            <Box>
                                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: -1, color: '#1e293b' }}>
                                            Find a <span style={{ background: themeStyles.primaryGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Specialist</span>
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" fontWeight="500">Book appointments with top rated doctors.</Typography>
                                    </Box>
                                    
                                    <Paper sx={{ ...themeStyles.glass, p: '4px 16px', display: 'flex', alignItems: 'center', width: 400, borderRadius: 10 }}>
                                        <Search sx={{ color: '#94a3b8' }} />
                                        <TextField 
                                            fullWidth placeholder="Search by Name or Specialty..." variant="standard"
                                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                            InputProps={{ disableUnderline: true, sx: { px: 2, fontWeight: 500 } }}
                                        />
                                        <IconButton sx={{ bgcolor: '#f1f5f9' }}><FilterList fontSize="small" /></IconButton>
                                    </Paper>
                                </Box>

                                {loading ? (
                                    <Grid container spacing={3}>
                                        {[1,2,3,4].map(i => (
                                            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                                                <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 5 }} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : filteredDoctors.length === 0 ? (
                                    <Alert severity="info" sx={{ borderRadius: 3 }}>No doctors found matching your criteria.</Alert>
                                ) : (
                                    <Grid container spacing={3}>
                                        {filteredDoctors.map((doc) => (
                                            <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
                                                <Card 
                                                    elevation={0}
                                                    sx={{ 
                                                        borderRadius: 5, overflow: 'visible', mt: 4, bgcolor: 'white',
                                                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.08)',
                                                        transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.2)' }
                                                    }}
                                                >
                                                    <Box sx={{ height: 80, background: themeStyles.primaryGrad, borderRadius: '20px 20px 0 0', position: 'relative' }}>
                                                        <Avatar src={doc.profileImage} sx={{ width: 80, height: 80, position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                                    </Box>
                                                    <CardContent sx={{ pt: 6, pb: 3, textAlign: 'center' }}>
                                                        <Typography variant="h6" fontWeight="800" sx={{ color: '#1e293b' }}>{doc.fullName}</Typography>
                                                        <Chip label={doc.specialization} size="small" sx={{ mt: 0.5, mb: 2, bgcolor: '#f0f9ff', color: '#0ea5e9', fontWeight: 'bold' }} />
                                                        <Stack direction="row" spacing={1}>
                                                            <Button fullWidth variant="outlined" onClick={(e) => { e.stopPropagation(); setProfileDoctor(doc); setProfileOpen(true); }} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold', borderColor: '#e2e8f0', color: '#64748b' }}>View Profile</Button>
                                                            <Button fullWidth variant="contained" onClick={() => handleDoctorSelect(doc)} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold', background: themeStyles.primaryGrad }}>Book</Button>
                                                        </Stack>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Box>
                        </Fade>
                    )}

                    {/* === VIEW 2: BOOKING DASHBOARD === */}
                    {view === 'BOOKING' && selectedDoctor && (
                        <Fade in={true}>
                            <Box>
                                <Button startIcon={<ArrowBack />} onClick={() => setView('LIST')} sx={{ mb: 2, color: '#64748b', fontWeight: 'bold' }}>Back to Search</Button>
                                
                                <Grid container spacing={4}>
                                    {/* Calendar Column */}
                                    <Grid item xs={12} md={4}>
                                        <Card elevation={0} sx={{ borderRadius: 5, mb: 3, overflow: 'hidden', boxShadow: themeStyles.glass.boxShadow }}>
                                            <Box sx={{ p: 3, background: '#1e293b', color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar src={selectedDoctor.profileImage} sx={{ width: 64, height: 64, border: '2px solid white' }} />
                                                <Box>
                                                    <Typography variant="h6" fontWeight="bold">{selectedDoctor.fullName}</Typography>
                                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>{selectedDoctor.specialization}</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ p: 2 }}>
                                                <DateCalendar value={selectedDate} onChange={(newValue) => setSelectedDate(newValue)} disablePast sx={{ width: '100%' }} />
                                            </Box>
                                        </Card>
                                    </Grid>

                                    {/* Slots Column */}
                                    <Grid item xs={12} md={8}>
                                        <Paper sx={{ p: 4, borderRadius: 5, minHeight: 500, bgcolor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                            
                                            {/* Legend */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                                <Box>
                                                    <Typography variant="h5" fontWeight="900" sx={{ color: '#1e293b' }}>Select Time Slot</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Availability for <span style={{ fontWeight: 'bold', color: '#6366f1' }}>{selectedDate.format('dddd, MMMM D')}</span>
                                                    </Typography>
                                                </Box>
                                                <Stack direction="row" spacing={1}>
                                                    <Chip size="small" label="Available" sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0', color: '#64748b' }} />
                                                    <Chip size="small" label="Selected" sx={{ bgcolor: '#6366f1', color: '#fff' }} />
                                                    <Chip size="small" label="Booked" sx={{ bgcolor: '#fff7ed', color: '#f59e0b' }} />
                                                </Stack>
                                            </Box>
                                            
                                            {slotsLoading ? (
                                                <Box sx={{ pt: 2 }}>
                                                    <Skeleton height={40} width="30%" sx={{ mb: 2 }} />
                                                    <Grid container spacing={2} sx={{ mb: 4 }}>
                                                        {[1,2,3,4,5,6].map(i => <Grid item xs={4} sm={3} md={2} key={i}><Skeleton variant="rectangular" height={50} sx={{ borderRadius: 3 }} /></Grid>)}
                                                    </Grid>
                                                    <Skeleton height={40} width="30%" sx={{ mb: 2 }} />
                                                    <Grid container spacing={2}>
                                                        {[1,2,3,4].map(i => <Grid item xs={4} sm={3} md={2} key={i}><Skeleton variant="rectangular" height={50} sx={{ borderRadius: 3 }} /></Grid>)}
                                                    </Grid>
                                                </Box>
                                            ) : allSlots.length === 0 ? (
                                                <Box sx={{ textAlign: 'center', py: 10, opacity: 0.5 }}>
                                                    <AccessTime sx={{ fontSize: 80, mb: 2, color: '#cbd5e1' }} />
                                                    <Typography variant="h6" fontWeight="bold">No Availability</Typography>
                                                    <Typography variant="body2">Doctor is not available on this date.</Typography>
                                                </Box>
                                            ) : (
                                                <Box>
                                                    {renderSlotSection('Morning', <WbTwilight />, 'Morning')}
                                                    {renderSlotSection('Afternoon', <WbSunny />, 'Afternoon')}
                                                    {renderSlotSection('Evening', <NightsStay />, 'Evening')}
                                                </Box>
                                            )}
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Fade>
                    )}

                    {/* === MODALS === */}
                    <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 5, overflow: 'hidden' } }}>
                        {profileDoctor && (
                            <>
                                <Box sx={{ background: themeStyles.primaryGrad, p: 3, color: 'white' }}>
                                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                        <Avatar src={profileDoctor.profileImage} sx={{ width: 80, height: 80, border: '4px solid rgba(255,255,255,0.3)' }} />
                                        <Box>
                                            <Typography variant="h5" fontWeight="900">{profileDoctor.fullName}</Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>{profileDoctor.qualification}</Typography>
                                            <Chip label={profileDoctor.specialization} size="small" sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }} />
                                        </Box>
                                    </Box>
                                </Box>
                                <DialogContent sx={{ p: 4 }}>
                                    <Grid container spacing={2} sx={{ mb: 4 }}>
                                        <Grid item xs={4}><Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 3 }}><WorkspacePremium sx={{ color: '#f59e0b' }} /><Typography variant="h6" fontWeight="900">${profileDoctor.consultationFee}</Typography><Typography variant="caption">Fee</Typography></Paper></Grid>
                                        <Grid item xs={4}><Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 3 }}><Star sx={{ color: '#f59e0b' }} /><Typography variant="h6" fontWeight="900">4.9</Typography><Typography variant="caption">Rating</Typography></Paper></Grid>
                                        <Grid item xs={4}><Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 3 }}><AccessTime sx={{ color: '#6366f1' }} /><Typography variant="h6" fontWeight="900">{profileDoctor.experience}</Typography><Typography variant="caption">Exp</Typography></Paper></Grid>
                                    </Grid>
                                    <Stack spacing={2}>
                                        <Box display="flex" gap={2} alignItems="center"><LocalHospital color="action" /><Typography variant="body2" fontWeight="600">{profileDoctor.location}</Typography></Box>
                                        <Box display="flex" gap={2} alignItems="center"><School color="action" /><Typography variant="body2" fontWeight="600">{profileDoctor.qualification}</Typography></Box>
                                    </Stack>
                                </DialogContent>
                                <DialogActions sx={{ p: 3, pt: 0 }}>
                                    <Button fullWidth onClick={() => setProfileOpen(false)} sx={{ color: '#64748b' }}>Close</Button>
                                    <Button fullWidth variant="contained" onClick={() => { setProfileOpen(false); handleDoctorSelect(profileDoctor); }} sx={{ borderRadius: 3, background: themeStyles.primaryGrad }}>Book Now</Button>
                                </DialogActions>
                            </>
                        )}
                    </Dialog>

                    <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                        <DialogTitle fontWeight="900">Confirm Booking</DialogTitle>
                        <DialogContent>
                            <Alert severity="info" sx={{ mb: 2 }}>{selectedDate.format('MMM D')} at {selectedSlot}</Alert>
                            <TextField fullWidth label="Reason" multiline rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                            <Button variant="contained" onClick={handleConfirmBooking} sx={{ bgcolor: '#6366f1' }}>Confirm</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={successOpen} onClose={() => { setSuccessOpen(false); setView('LIST'); }} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, textAlign: 'center', p: 2 } }}>
                        <DialogContent>
                            <Avatar sx={{ width: 60, height: 60, bgcolor: '#dcfce7', color: '#16a34a', mx: 'auto', mb: 2 }}><CheckCircle /></Avatar>
                            <Typography variant="h5" fontWeight="900">Booked!</Typography>
                            <Button fullWidth variant="contained" onClick={() => { setSuccessOpen(false); setView('LIST'); }} sx={{ mt: 3, borderRadius: 3, bgcolor: '#16a34a' }}>Done</Button>
                        </DialogContent>
                    </Dialog>

                    <Snackbar open={!!errorMsg} autoHideDuration={6000} onClose={() => setErrorMsg('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}><Alert severity="error" onClose={() => setErrorMsg('')} sx={{ borderRadius: 3 }}>{errorMsg}</Alert></Snackbar>

                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default BookAppointment;