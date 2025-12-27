import React, { useState, useEffect, useContext } from 'react';
import { 
    Box, Typography, Paper, Grid, TextField, MenuItem, 
    Button, IconButton, Chip, CircularProgress, Alert, Fade, Avatar,
    Dialog, DialogContent, Tabs, Tab, Badge, Switch, Divider, 
    Card, Tooltip, Zoom, Stack
} from '@mui/material';
import { 
    Save, Visibility, Close, CalendarMonth, AutoAwesome, 
    WbSunny, WbTwilight, NightsStay, EventBusy, CheckCircle,
    EditCalendar, AccessTime, Person, MedicalServices,
    MonitorHeart, Bloodtype, Straighten, MonitorWeight, Description, ArrowForward,
    Spa, LocalHospital, Science, AddCircle, Delete, Update, Star, Block, EventAvailable,
    SmokeFree, LocalBar, Restaurant, SportsGymnastics
} from '@mui/icons-material';
import { LocalizationProvider, DateCalendar, PickersDay } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

// --- 🎨 MED-OS DESIGN THEME ---
const theme = {
    primary: '#6366f1',   
    secondary: '#06b6d4', 
    booked: '#f59e0b',    
    blocked: '#ef4444',   
    dark: '#0f172a',
    light: '#f8fafc',
    glass: {
        background: 'rgba(255, 255, 255, 0.75)', 
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
    },
    activeGrad: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    goldGrad: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
};

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

// --- 🧩 1. DATE CARD ---
const DateCard = ({ dateObj, isSelected, onClick }) => {
    if (!dateObj) return null; 
    const isToday = dayjs().isSame(dateObj, 'day');
    return (
        <Paper
            onClick={onClick}
            sx={{
                minWidth: 100, height: 120, cursor: 'pointer',
                borderRadius: 4, position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: isSelected ? `2px solid ${theme.primary}` : '1px solid rgba(255,255,255,0.5)',
                background: isSelected ? 'white' : 'rgba(255,255,255,0.4)',
                transform: isSelected ? 'translateY(-8px)' : 'none',
                boxShadow: isSelected ? `0 15px 30px -10px ${theme.primary}40` : 'none',
                '&:hover': { background: 'white', transform: 'translateY(-4px)' }
            }}
        >
            {isSelected && <Box sx={{ position: 'absolute', top: 0, width: '100%', height: 4, background: theme.activeGrad }} />}
            <Typography variant="caption" fontWeight="800" sx={{ letterSpacing: 1, color: isSelected ? theme.primary : '#64748b', mb: 1 }}>{isToday ? 'TODAY' : dateObj.format('ddd').toUpperCase()}</Typography>
            <Typography variant="h4" fontWeight="900" sx={{ color: theme.dark }}>{dateObj.format('D')}</Typography>
            <Typography variant="caption" fontWeight="bold" sx={{ color: '#94a3b8' }}>{dateObj.format('MMM')}</Typography>
        </Paper>
    );
};

// --- 🧩 2. SLOT ITEM ---
const SlotItem = ({ slot, onAction }) => {
    if (!slot) return null;

    let bg = 'white';
    let border = '#e2e8f0';
    let icon = <AccessTime fontSize="small" />;
    let textColor = theme.dark;
    let glow = 'none';
    let cursor = 'pointer';

    if (slot.isBooked) {
        bg = theme.goldGrad; border = 'transparent'; icon = <Person fontSize="small" sx={{color:'white'}} />; textColor = 'white'; glow = `0 8px 20px -5px ${theme.booked}60`;
    } else if (slot.isBlocked) {
        bg = '#fee2e2'; border = '#fecaca'; icon = <Block fontSize="small" sx={{color: theme.blocked}} />; textColor = theme.blocked;
    } else {
        bg = '#ecfeff'; border = '#cffafe'; icon = <EventAvailable fontSize="small" sx={{color: theme.secondary}} />; textColor = theme.secondary;
    }

    return (
        <Zoom in={true} style={{ transitionDelay: '50ms' }}>
            <Paper
                onClick={() => onAction(slot)}
                elevation={0}
                sx={{
                    p: 1.5, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: bg, border: `1px solid ${border}`, color: textColor, boxShadow: glow, cursor: cursor, transition: '0.2s',
                    '&:hover': { transform: 'scale(1.03)' }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {icon}
                    <Typography fontWeight="800" sx={{ letterSpacing: 0.5 }}>{slot.time}</Typography>
                </Box>
                {slot.isBooked && <Tooltip title={`Patient: ${slot.patientName || 'Unknown'}`}><Chip label="BOOKED" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white', fontWeight: 'bold', height: 20, fontSize: '0.65rem' }} /></Tooltip>}
                {slot.isBlocked && <Typography variant="caption" fontWeight="bold">BLOCKED</Typography>}
            </Paper>
        </Zoom>
    );
};

// --- 🧩 3. PATIENT PASS ---
const PatientPass = ({ appt, onClick }) => (
    <Card 
        onClick={() => onClick(appt)}
        sx={{ 
            mb: 2, borderRadius: 4, cursor: 'pointer', border: '1px solid #f1f5f9',
            background: 'white', transition: '0.3s', overflow: 'visible',
            '&:hover': { transform: 'scale(1.02)', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', borderColor: theme.primary }
        }}
    >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, position: 'relative' }}>
            <Box sx={{ position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, bgcolor: '#f1f5f9', borderRadius: '50%' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60, borderRight: '2px dashed #e2e8f0', pr: 2 }}>
                <AccessTime sx={{ fontSize: 20, color: theme.primary, mb: 0.5 }} />
                <Typography variant="h6" fontWeight="900" sx={{ color: theme.dark, lineHeight: 1 }}>{appt.time}</Typography>
            </Box>
            <Avatar src={appt.patientImage} sx={{ width: 50, height: 50, border: '2px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: theme.dark }}>{appt.patientName}</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Chip label={appt.reason} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold', bgcolor: '#eff6ff', color: theme.primary }} />
                </Box>
            </Box>
            <IconButton size="small" sx={{ bgcolor: '#f8fafc' }}><ArrowForward fontSize="small" /></IconButton>
        </Box>
    </Card>
);

// --- 🧩 4. BIO HUD ---
const BioHUD = ({ icon, label, value, unit, color }) => (
    <Paper sx={{ p: 3, borderRadius: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, background: 'white', border: `1px solid ${color}20`, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, bgcolor: `${color}08`, borderRadius: '50%' }} />
        <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 44, height: 44, mb: 1 }}>{icon}</Avatar>
        <Typography variant="h4" fontWeight="900" sx={{ color: theme.dark }}>{value || '--'}<Typography component="span" variant="caption" sx={{ml:0.5, fontWeight:'bold', color:'text.secondary'}}>{unit}</Typography></Typography>
        <Typography variant="caption" fontWeight="800" sx={{ color: color, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</Typography>
    </Paper>
);

// --- LOGIC HELPER: GENERATE SLOTS ---
const generateSlotsForDay = (rule, bookedList, blockedList) => {
    if (!rule || !rule.isAvailable) return [];
    if (!rule.startTime || !rule.endTime) return [];
    
    const slots = [];
    let current = dayjs(`2000-01-01 ${rule.startTime}`);
    const endTime = dayjs(`2000-01-01 ${rule.endTime}`);

    while (current.isBefore(endTime)) {
        const slotStart = current.format('HH:mm');
        const nextTime = current.add(rule.slotDuration || 30, 'minute');
        
        const isBreak = rule.breaks && rule.breaks.some(brk => {
            if(!brk.startTime || !brk.endTime) return false;
            const bStart = dayjs(`2000-01-01 ${brk.startTime}`);
            const bEnd = dayjs(`2000-01-01 ${brk.endTime}`);
            return (current.isSame(bStart) || current.isAfter(bStart)) && current.isBefore(bEnd);
        });

        if (!isBreak && (nextTime.isBefore(endTime) || nextTime.isSame(endTime))) {
            const booking = bookedList?.find(b => b.time && b.time.substring(0,5) === slotStart);
            const isBlocked = blockedList?.includes(slotStart);
            
            slots.push({ 
                id: slotStart, 
                time: slotStart, 
                isBooked: !!booking, 
                patientName: booking ? booking.patientName : null, 
                patientId: booking ? booking.patientId : null,
                patientImage: booking ? booking.patientImage : null,
                isBlocked: isBlocked && !booking 
            });
        }
        current = nextTime;
    }
    return slots;
};

// --- CALENDAR DAY ---
function ServerDay(props) {
    const { day, outsideCurrentMonth, leaves, schedule, ...other } = props;
    const dateStr = day.format('YYYY-MM-DD');
    const isLeave = leaves.some(l => l.leaveDate === dateStr);
    const dayName = DAYS_OF_WEEK[day.day() === 0 ? 6 : day.day() - 1];
    const isWorking = schedule.find(s => s.dayOfWeek === dayName)?.isAvailable;
    const isToday = day.isSame(dayjs(), 'day');
    return (
        <Badge key={props.day.toString()} overlap="circular" badgeContent={isLeave ? ' ' : (isWorking ? ' ' : undefined)} sx={{ '& .MuiBadge-badge': { bgcolor: isLeave ? theme.blocked : theme.secondary, width: 6, height: 6, borderRadius: '50%', minWidth: 'unset', top: 4, right: 4 } }}>
            <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} sx={{ fontWeight: 'bold', fontSize: '0.85rem', margin: '2px', ...(isToday && { border: `2px solid ${theme.primary}`, color: theme.primary }), ...(isLeave && { color: theme.blocked, bgcolor: '#fff1f2', borderRadius: '50%' }), ...(!isLeave && isWorking && { color: theme.dark }), ...(!isLeave && !isWorking && { color: '#cbd5e1', opacity: 0.6 }) }} />
        </Badge>
    );
}

const MySchedule = () => {
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    
    // Data
    const [schedule, setSchedule] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [upcomingDays, setUpcomingDays] = useState([]); 
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [slots, setSlots] = useState([]); 
    const [bookedList, setBookedList] = useState([]);
    const [dailyAppointments, setDailyAppointments] = useState([]);
    const [tabValue, setTabValue] = useState(0);

    // Form
    const [formRule, setFormRule] = useState({ dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00', slotDuration: 30, breaks: [], isAvailable: true });

    // Modals
    const [medicalRecordOpen, setMedicalRecordOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [fullRecord, setFullRecord] = useState(null);
    const [recordTabValue, setRecordTabValue] = useState(0);
    const [recordLoading, setRecordLoading] = useState(false);
    const [slotDialogOpen, setSlotDialogOpen] = useState(false);

    // --- 1. INITIAL LOAD ---
    useEffect(() => {
        const days = [];
        for (let i = 0; i < 7; i++) { days.push(dayjs().add(i, 'day')); }
        setUpcomingDays(days);

        const fetchInitialData = async () => {
            try {
                const [schedRes, leaveRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/doctor/schedule', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/api/doctor/leaves', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                
                const schedData = Array.isArray(schedRes.data) ? schedRes.data : [];
                const leavesData = Array.isArray(leaveRes.data) ? leaveRes.data : [];

                const mergedSchedule = DAYS_OF_WEEK.map(day => {
                    const found = schedData.find(d => d.dayOfWeek === day);
                    return found 
                        ? { ...found, isAvailable: found.isAvailable ?? found.available ?? false, breaks: found.breaks || [] } 
                        : { dayOfWeek: day, isAvailable: false, startTime: '09:00', endTime: '17:00', slotDuration: 30, breaks: [] };
                });
                
                setSchedule(mergedSchedule);
                setLeaves(leavesData);
            } catch (err) { console.error("Init Error", err); }
        };
        fetchInitialData();
    }, [token]);

    // --- 2. UPDATE WHEN DATE CHANGES ---
    useEffect(() => {
        if (schedule.length > 0) {
            const dayName = DAYS_OF_WEEK[selectedDate.day() === 0 ? 6 : selectedDate.day() - 1];
            const rule = schedule.find(s => s.dayOfWeek === dayName);
            
            if (rule) {
                setFormRule({ ...rule });
                fetchSlotsForDate(selectedDate, rule);
            } else {
                setFormRule({ dayOfWeek: dayName, startTime: '09:00', endTime: '17:00', slotDuration: 30, breaks: [], isAvailable: true });
                setSlots([]);
            }
        }
    }, [selectedDate, schedule]);

    // --- 3. FETCH SLOTS ---
    const fetchSlotsForDate = async (date, ruleOverride = null) => {
        setLoading(true);
        const dateStr = date.format('YYYY-MM-DD');
        const dayName = DAYS_OF_WEEK[date.day() === 0 ? 6 : date.day() - 1];
        const rule = ruleOverride || schedule.find(s => s.dayOfWeek === dayName);
        const isLeave = leaves.some(l => l.leaveDate === dateStr);

        if (isLeave || !rule || !rule.isAvailable) {
            setSlots([]); setLoading(false); return;
        }

        try {
            const [blockedRes, bookedRes] = await Promise.all([
                axios.get(`http://localhost:8080/api/doctor/slots/blocked?start=${dateStr}T00:00:00&end=${dateStr}T23:59:59`, { headers: { 'Authorization': `Bearer ${token}` } }),
                axios.get(`http://localhost:8080/api/appointments/doctor/daily?date=${dateStr}`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const blocked = Array.isArray(blockedRes.data) ? blockedRes.data.map(item => dayjs(item.slotDateTime).format('HH:mm')) : [];
            const booked = Array.isArray(bookedRes.data) ? bookedRes.data : [];
            
            setDailyAppointments(booked);
            setBookedList(booked);

            const finalSlots = generateSlotsForDay(rule, booked, blocked);
            setSlots(finalSlots);

        } catch (err) { console.error(err); setSlots([]); } finally { setLoading(false); }
    };

    // --- 4. ACTIONS ---
    const handleFormChange = (field, value) => setFormRule(prev => ({ ...prev, [field]: value }));
    const handleAddBreak = () => setFormRule(prev => ({ ...prev, breaks: [...(prev.breaks || []), { startTime: '13:00', endTime: '14:00' }] }));
    const handleRemoveBreak = (idx) => { const nb = [...formRule.breaks]; nb.splice(idx, 1); setFormRule(prev => ({ ...prev, breaks: nb })); };
    const handleBreakChange = (idx, field, value) => { const nb = [...formRule.breaks]; nb[idx][field] = value; setFormRule(prev => ({ ...prev, breaks: nb })); };

    const saveScheduleConfig = async () => {
        // ✅ CRITICAL FIX: Send both "available" and "isAvailable"
        const cleanRule = {
            ...formRule,
            available: formRule.isAvailable, // Fix for Jackson mapping
            isAvailable: formRule.isAvailable,
            startTime: formRule.startTime.length === 5 ? formRule.startTime + ':00' : formRule.startTime,
            endTime: formRule.endTime.length === 5 ? formRule.endTime + ':00' : formRule.endTime,
            breaks: formRule.breaks.map(b => ({
                startTime: b.startTime.length === 5 ? b.startTime + ':00' : b.startTime,
                endTime: b.endTime.length === 5 ? b.endTime + ':00' : b.endTime
            }))
        };

        const updatedSchedule = schedule.map(d => d.dayOfWeek === formRule.dayOfWeek ? cleanRule : d);
        setSchedule(updatedSchedule);

        try {
            await axios.post('http://localhost:8080/api/doctor/schedule/update', { days: updatedSchedule }, { headers: { 'Authorization': `Bearer ${token}` } });
            setMsg({ type: 'success', text: `Schedule updated for ${formRule.dayOfWeek}` });
            setTimeout(() => setMsg(null), 3000);
            fetchSlotsForDate(selectedDate, cleanRule); 
        } catch (err) { 
            console.error("Update Error", err);
            setMsg({ type: 'error', text: 'Update Failed' }); 
        }
    };

    const handleSlotClick = (slot) => {
        if (slot.isBooked) handleOpenRecord(slot);
        else toggleSlotBlock(slot);
    };

    const toggleSlotBlock = async (targetSlot) => {
        const dateTimeStr = `${selectedDate.format('YYYY-MM-DD')}T${targetSlot.time}:00`;
        try {
            if (targetSlot.isBlocked) {
                await axios.post('http://localhost:8080/api/doctor/slots/unblock', { slotDateTime: dateTimeStr }, { headers: { 'Authorization': `Bearer ${token}` } });
                setSlots(prev => prev.map(s => s.id === targetSlot.id ? { ...s, isBlocked: false } : s));
            } else {
                await axios.post('http://localhost:8080/api/doctor/slots/block', { slotDateTime: dateTimeStr, reason: 'Manual' }, { headers: { 'Authorization': `Bearer ${token}` } });
                setSlots(prev => prev.map(s => s.id === targetSlot.id ? { ...s, isBlocked: true } : s));
            }
        } catch (err) { console.error(err); }
    };

    const toggleWholeDayLeave = async () => {
        const dateStr = selectedDate.format('YYYY-MM-DD');
        const existing = leaves.find(l => l.leaveDate === dateStr);
        try {
            if (existing) {
                await axios.delete(`http://localhost:8080/api/doctor/leaves/${existing.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
                setLeaves(prev => prev.filter(l => l.id !== existing.id));
            } else {
                const res = await axios.post('http://localhost:8080/api/doctor/leaves', { date: dateStr, reason: 'Personal' }, { headers: { 'Authorization': `Bearer ${token}` } });
                setLeaves(prev => [...prev, { id: res.data?.id || Date.now(), leaveDate: dateStr }]);
            }
        } catch (e) { console.error(e); }
    };

    const handleOpenRecord = async (appt) => {
        if (!appt.patientId) { alert("No patient data."); return; }
        setSelectedPatient(appt);
        setMedicalRecordOpen(true);
        setRecordLoading(true);
        setFullRecord(null);
        try {
            const res = await axios.get(`http://localhost:8080/api/doctor/records/patient/${appt.patientId}`, { headers: { 'Authorization': `Bearer ${token}` } });
            setFullRecord(res.data);
        } catch (e) { console.error(e); } finally { setRecordLoading(false); }
    };

    const isDayLeave = selectedDate && leaves.some(l => l.leaveDate === selectedDate.format('YYYY-MM-DD'));

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', bgcolor: '#f1f5f9', backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                <Sidebar role="DOCTOR" open={true} />
                <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
                    
                    <Box sx={{ mb: 5 }}>
                        <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: -1, color: theme.dark }}>Temporal<span style={{color: theme.secondary}}>Control</span></Typography>
                        <Typography color="text.secondary" fontWeight="500">Manage your weekly rhythm and daily exceptions.</Typography>
                    </Box>

                    {msg && <Fade in={true}><Alert severity={msg.type} sx={{ mb: 4, borderRadius: 4 }}>{msg.text}</Alert></Fade>}

                    {/* --- 1. DATE SELECTOR --- */}
                    <Box sx={{ mb: 4, overflowX: 'auto', pb: 2 }}>
                        <Grid container spacing={2} wrap="nowrap" sx={{ minWidth: '100%' }}>
                            {upcomingDays.map((date, index) => (
                                <Grid item key={index}>
                                    <DateCard dateObj={date} isSelected={selectedDate.isSame(date, 'day')} onClick={() => setSelectedDate(date)} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* --- 2. CONFIGURATOR --- */}
                    <Fade in={true} key={selectedDate.toString()}>
                        <Paper sx={{ ...theme.glass, p: 3, mb: 4, borderRadius: 5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EditCalendar sx={{ color: theme.primary }} />
                                    <Typography variant="h6" fontWeight="bold">Schedule Configuration</Typography>
                                </Box>
                                <Chip label={`Editing: ${formRule?.dayOfWeek || '...'}`} color="primary" variant="outlined" sx={{ fontWeight: 'bold' }} />
                            </Box>

                            <Grid container spacing={3} alignItems="center">
                                <Grid item xs={12} md={3}>
                                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: formRule.isAvailable ? '#f0f9ff' : '#fff1f2', borderColor: formRule.isAvailable ? theme.secondary : theme.blocked }}>
                                        <Typography fontWeight="bold" color={formRule.isAvailable ? 'text.primary' : 'error'}>{formRule.isAvailable ? 'Working Day' : 'Rest Day'}</Typography>
                                        <Switch checked={formRule.isAvailable} onChange={(e) => handleFormChange('isAvailable', e.target.checked)} />
                                    </Paper>
                                </Grid>

                                {formRule.isAvailable && (
                                    <>
                                        <Grid item xs={6} md={3}><TextField fullWidth label="Start Time" type="time" InputLabelProps={{shrink: true}} value={formRule.startTime || '09:00'} onChange={(e) => handleFormChange('startTime', e.target.value)} sx={{ bgcolor: 'white', borderRadius: 2 }} /></Grid>
                                        <Grid item xs={6} md={3}><TextField fullWidth label="End Time" type="time" InputLabelProps={{shrink: true}} value={formRule.endTime || '17:00'} onChange={(e) => handleFormChange('endTime', e.target.value)} sx={{ bgcolor: 'white', borderRadius: 2 }} /></Grid>
                                        <Grid item xs={6} md={3}><TextField select fullWidth label="Slot Duration" value={formRule.slotDuration || 30} onChange={(e) => handleFormChange('slotDuration', e.target.value)} sx={{ bgcolor: 'white', borderRadius: 2 }}><MenuItem value={15}>15 Minutes</MenuItem><MenuItem value={30}>30 Minutes</MenuItem><MenuItem value={60}>60 Minutes</MenuItem></TextField></Grid>
                                        
                                        <Grid item xs={12}>
                                            <Divider sx={{ my: 1 }}><Chip label="Breaks & Pauses" size="small" /></Divider>
                                            {formRule.breaks && formRule.breaks.map((brk, idx) => (
                                                <Box key={idx} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                                                    <TextField size="small" type="time" label="Start" InputLabelProps={{shrink: true}} value={brk.startTime} onChange={(e) => handleBreakChange(idx, 'startTime', e.target.value)} />
                                                    <Typography>-</Typography>
                                                    <TextField size="small" type="time" label="End" InputLabelProps={{shrink: true}} value={brk.endTime} onChange={(e) => handleBreakChange(idx, 'endTime', e.target.value)} />
                                                    <IconButton color="error" onClick={() => handleRemoveBreak(idx)}><Delete /></IconButton>
                                                </Box>
                                            ))}
                                            <Button startIcon={<AddCircle />} size="small" onClick={handleAddBreak}>Add Break</Button>
                                        </Grid>
                                    </>
                                )}
                                <Grid item xs={12} sx={{ textAlign: 'right' }}>
                                    <Button variant="contained" startIcon={<Update />} onClick={saveScheduleConfig} sx={{ borderRadius: 4, px: 4, py: 1, background: theme.activeGrad }}>Update {formRule?.dayOfWeek}</Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Fade>

                    {/* --- 3. SLOT MANAGER --- */}
                    <Paper sx={{ ...theme.glass, borderRadius: 6, overflow: 'hidden', minHeight: 400 }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h5" fontWeight="900" sx={{ color: theme.primary }}>Generated Slots</Typography>
                                <Typography variant="body2" color="text.secondary">Live view for {selectedDate.format('MMM D')}</Typography>
                            </Box>
                            {!isDayLeave && (
                                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ '& .MuiTab-root': { fontWeight: 'bold' } }}>
                                    <Tab icon={<AutoAwesome fontSize="small"/>} iconPosition="start" label="All" />
                                    <Tab icon={<Star fontSize="small"/>} iconPosition="start" label="Booked" />
                                </Tabs>
                            )}
                        </Box>

                        <Box sx={{ p: 4 }}>
                            {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box> : (
                                isDayLeave ? <Alert severity="warning" action={<Button size="small" onClick={toggleWholeDayLeave}>Restore Day</Button>}>Marked as Full Day Leave.</Alert> :
                                !formRule.isAvailable ? <Alert severity="info">Rest Day.</Alert> :
                                slots.length === 0 ? <Alert severity="info">No slots generated.</Alert> :
                                <Grid container spacing={2}>
                                    {slots
                                        .filter(slot => tabValue === 0 ? true : slot.isBooked)
                                        .map((slot) => (
                                        <Grid item xs={6} sm={4} md={3} lg={2} key={slot.id}>
                                            <SlotItem slot={slot} onAction={handleSlotClick} />
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                        
                        {!isDayLeave && <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}><Button color="error" startIcon={<EventBusy/>} onClick={toggleWholeDayLeave}>Block Entire Day</Button></Box>}
                    </Paper>

                    {/* --- 4. MEDICAL RECORD DIALOG --- */}
                    <Dialog open={medicalRecordOpen} onClose={() => setMedicalRecordOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 6, ...theme.glass } }}>
                        {selectedPatient && (
                            <>
                                <Box sx={{ p: 4, background: theme.dark, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                        <Avatar src={selectedPatient.patientImage} sx={{ width: 80, height: 80, border: `4px solid ${theme.primary}` }} />
                                        <Box>
                                            <Typography variant="h4" fontWeight="900">{selectedPatient.patientName}</Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.7 }}>Patient ID: {selectedPatient.patientId}</Typography>
                                        </Box>
                                    </Box>
                                    <IconButton onClick={() => setMedicalRecordOpen(false)} sx={{ color: 'white' }}><Close /></IconButton>
                                </Box>
                                <Box sx={{ bgcolor: theme.dark, pb: 2 }}><Tabs value={recordTabValue} onChange={(e, v) => setRecordTabValue(v)} centered sx={{ '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)', '&.Mui-selected': { color: theme.secondary } } }}><Tab icon={<MonitorHeart />} label="Vitals" /><Tab icon={<MedicalServices />} label="History" /><Tab icon={<Science />} label="Labs" /></Tabs></Box>
                                <DialogContent sx={{ p: 4, minHeight: 450, bgcolor: '#f8fafc' }}>
                                    {recordLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}><CircularProgress /></Box> : (
                                        <Fade in={true}>
                                            <Box>
                                                {recordTabValue === 0 && (
                                                    fullRecord?.latestVitals ? (
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={6} md={3}><BioHUD icon={<MonitorHeart />} label="Heart Rate" value={fullRecord.latestVitals.heartRate} unit="bpm" color={theme.primary} /></Grid>
                                                            <Grid item xs={6} md={3}><BioHUD icon={<Bloodtype />} label="BP" value={fullRecord.latestVitals.bloodPressure} unit="" color="#8b5cf6" /></Grid>
                                                            <Grid item xs={6} md={3}><BioHUD icon={<MonitorWeight />} label="Weight" value={fullRecord.latestVitals.weight} unit="kg" color="#f59e0b" /></Grid>
                                                            <Grid item xs={6} md={3}><BioHUD icon={<Straighten />} label="Height" value={fullRecord.latestVitals.height} unit="cm" color={theme.secondary} /></Grid>
                                                        </Grid>
                                                    ) : <Alert severity="info" sx={{borderRadius: 4}}>No vitals found.</Alert>
                                                )}
                                                {recordTabValue === 1 && <Alert severity="info">No history found.</Alert>}
                                                {recordTabValue === 2 && <Alert severity="info">No labs found.</Alert>}
                                            </Box>
                                        </Fade>
                                    )}
                                </DialogContent>
                            </>
                        )}
                    </Dialog>

                    {/* --- 5. PREVIEW DIALOG --- */}
                    <Dialog open={slotDialogOpen} onClose={() => setSlotDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 5, ...theme.glass } }}>
                        <DialogContent>
                            {dailyAppointments.length === 0 ? <Alert severity="info">No patients today.</Alert> : dailyAppointments.map(appt => <PatientPass key={appt.appointmentId} appt={appt} onClick={handleOpenRecord} />)}
                        </DialogContent>
                    </Dialog>

                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default MySchedule;