import React, { useState, useContext } from 'react';
import { Box, Grid, Typography, Paper, Avatar, IconButton, useTheme } from '@mui/material';
import Sidebar from '../components/Sidebar';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle'; // Import Toggle

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import BloodtypeIcon from '@mui/icons-material/Bloodtype'; 
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'; 
import WaterDropIcon from '@mui/icons-material/WaterDrop'; 
import ScienceIcon from '@mui/icons-material/Science'; 
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';

// Mock Data
const data = [{v: 10}, {v: 15}, {v: 8}, {v: 20}, {v: 12}, {v: 25}];

const PatientDashboard = () => {
    const [open, setOpen] = useState(true);
    const { user } = useContext(AuthContext);
    const theme = useTheme(); // Hook to access theme colors

    return (
        // FIX 1: Use 'background.default' instead of hardcoded '#f1f5f9'
        <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh', color: 'text.primary' }}>
            
            <Sidebar role="PATIENT" open={open} handleDrawerClose={() => setOpen(false)} />
            
            <Box component="main" sx={{ flexGrow: 1, p: 4, transition: '0.3s' }}>
                
                {/* 1. Top Bar */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {!open && (
                            <IconButton onClick={() => setOpen(true)} sx={{ mr: 2 }}>
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Box>
                            <Typography variant="h5" fontWeight="bold">Dashboard</Typography>
                            <Typography variant="body2" color="text.secondary">Home &gt; Dashboard</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        
                        {/* THEME TOGGLE ADDED HERE */}
                        <ThemeToggle />

                        <IconButton sx={{ bgcolor: 'background.paper' }}><NotificationsNoneIcon /></IconButton>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {user?.fullName?.charAt(0) || 'P'}
                        </Avatar>
                    </Box>
                </Box>

                {/* 2. Welcome Banner */}
                {/* FIX 2: Use 'background.paper' for cards */}
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, mb: 4, display: 'flex', alignItems: 'center', bgcolor: 'background.paper', position: 'relative', overflow: 'hidden' }}>
                    <Box sx={{ flex: 1, zIndex: 1 }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>Welcome back</Typography>
                        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                            {user?.fullName || "User"}!
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mb: 2 }}>
                            We would like to take this opportunity to welcome you to our practice and to thank you for choosing our physicians.
                        </Typography>
                    </Box>
                    <Box component="img" src="https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg" sx={{ width: 300, display: { xs: 'none', md: 'block' } }} />
                </Paper>

                {/* 3. Vitals Grid */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <VitalCard title="Blood Pressure" value="110/70" unit="mmHg" icon={<BloodtypeIcon sx={{ fontSize: 30, color: '#ff6b6b' }} />} color="#ff6b6b" trend="+10% Higher" />
                    <VitalCard title="Heart Rate" value="72" unit="bpm" icon={<MonitorHeartIcon sx={{ fontSize: 30, color: '#1dd1a1' }} />} color="#1dd1a1" trend="-7% Lower" />
                    <VitalCard title="Glucose Level" value="88-75" unit="mg/dL" icon={<WaterDropIcon sx={{ fontSize: 30, color: '#feca57' }} />} color="#feca57" trend="+12% Higher" />
                    <VitalCard title="Blood Count" value="9,456" unit="/mL" icon={<ScienceIcon sx={{ fontSize: 30, color: '#5f27cd' }} />} color="#5f27cd" trend="-2% Lower" />
                </Grid>

                {/* 4. Appointments & Reports */}
                <Grid container spacing={3}>
                    {/* Appointment List */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'background.paper' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" fontWeight="bold">Upcoming Appointment</Typography>
                                <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>View All</Typography>
                            </Box>
                            
                            {[
                                { name: 'Dr. Cara Stevens', role: 'Radiologist', date: '12 June \'20', time: '09:00-10:00', treat: 'CT scans', img: 'https://i.pravatar.cc/150?img=1' },
                                { name: 'Dr. John Doe', role: 'Cardiologist', date: '13 June \'20', time: '11:00-11:30', treat: 'Heart Checkup', img: 'https://i.pravatar.cc/150?img=11' },
                                { name: 'Dr. Airi Satou', role: 'Dentist', date: '14 June \'20', time: '09:15-10:15', treat: 'Root Canal', img: 'https://i.pravatar.cc/150?img=3' },
                            ].map((apt, index) => (
                                <Box key={index} sx={{ 
                                    display: 'flex', alignItems: 'center', p: 2, mb: 2, 
                                    // FIX 3: Adaptive background for list items
                                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa', 
                                    borderRadius: 3, 
                                    transition: '0.3s', 
                                    '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#f1f5f9' } 
                                }}>
                                    <Avatar src={apt.img} sx={{ width: 50, height: 50, mr: 2 }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography fontWeight="bold">{apt.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{apt.role}</Typography>
                                    </Box>
                                    <Box sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }}>
                                        <Typography fontWeight="bold">{apt.date}</Typography>
                                        <Typography variant="caption" color="text.secondary">{apt.time}</Typography>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography fontWeight="bold" color="text.secondary">Treatment</Typography>
                                        <Typography variant="body2">{apt.treat}</Typography>
                                    </Box>
                                    <IconButton size="small" sx={{ border: '1px solid #ff6b6b', color: '#ff6b6b' }}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Paper>
                    </Grid>

                    {/* Reports Widget */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: '100%', bgcolor: 'background.paper' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold">Reports</Typography>
                                <Typography variant="body2" color="primary">View All</Typography>
                            </Box>
                            
                            {[
                                { title: 'Blood Report', color: '#ff6b6b' },
                                { title: 'CT Scan', color: '#54a0ff' },
                                { title: 'Prescription', color: '#1dd1a1' },
                            ].map((doc, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 2, border: '1px dashed', borderColor: 'text.secondary', borderRadius: 2 }}>
                                    <DescriptionIcon sx={{ color: doc.color, mr: 2 }} />
                                    <Typography sx={{ flex: 1, fontWeight: 500 }}>{doc.title}</Typography>
                                    <IconButton size="small"><DownloadIcon fontSize="small" /></IconButton>
                                    <IconButton size="small"><DeleteOutlineIcon fontSize="small" /></IconButton>
                                </Box>
                            ))}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

// Reusable Vital Card
const VitalCard = ({ title, value, unit, icon, color, trend }) => (
    <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, height: '100%', bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ bgcolor: `${color}15`, p: 1.5, borderRadius: '50%' }}>{icon}</Box>
            </Box>
            <Typography variant="body2" color="text.secondary" fontWeight="600">{title}</Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ my: 1 }}>{value} <Typography component="span" variant="caption" color="text.secondary">{unit}</Typography></Typography>
            
            <Box sx={{ height: 30 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}><Line type="monotone" dataKey="v" stroke={color} strokeWidth={3} dot={false} /></LineChart>
                </ResponsiveContainer>
            </Box>
            <Typography variant="caption" color={trend.includes('+') ? 'success.main' : 'error.main'} fontWeight="bold">{trend}</Typography>
        </Paper>
    </Grid>
);

export default PatientDashboard;