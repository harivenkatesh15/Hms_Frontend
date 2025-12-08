import React, { useState, useContext } from 'react';
import { 
    Box, Container, Grid, Typography, Paper, IconButton, Avatar, useTheme,
    List, ListItem, ListItemIcon, ListItemText, Checkbox, Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- Imports ---
import Sidebar from '../components/Sidebar.jsx'; 
import StatCard from '../components/StatCard.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx'; 

// --- Icons ---
import PeopleIcon from '@mui/icons-material/People';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonIcon from '@mui/icons-material/Person'; 
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthOutlined';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const appointmentData = [
  { day: 'Mon', Patients: 12 },
  { day: 'Tue', Patients: 19 },
  { day: 'Wed', Patients: 3 },
  { day: 'Thu', Patients: 5 },
  { day: 'Fri', Patients: 2 },
  { day: 'Sat', Patients: 20 },
];

const DoctorDashboard = () => {
    const [open, setOpen] = useState(true);
    const { user } = useContext(AuthContext); 
    const theme = useTheme(); 

    // --- To-Do List State ---
    const [todos, setTodos] = useState([
        { id: 1, text: 'Review annual reports for James Doe', completed: false },
        { id: 2, text: 'Team meeting at 2:00 PM', completed: true },
        { id: 3, text: 'Sign discharge papers for Ward B', completed: false },
        { id: 4, text: 'Update patient records', completed: false },
    ]);

    const toggleTodo = (id) => {
        setTodos(todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    // --- Simple Calendar Logic ---
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    // Static calendar grid for visual demo
    const calendarDates = [
        null, null, 1, 2, 3, 4, 5,
        6, 7, 8, 9, 10, 11, 12,
        13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26,
        27, 28, 29, 30, 31, null, null
    ];

    return (
        <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh', color: 'text.primary' }}>
            <Sidebar role="DOCTOR" open={open} handleDrawerClose={() => setOpen(false)} />
            
            <Box component="main" sx={{ flexGrow: 1, p: 3, transition: '0.3s' }}>
                
                {/* 1. Top Bar */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {!open && <IconButton onClick={() => setOpen(true)} sx={{ mr: 2 }}><MenuIcon /></IconButton>}
                        <Box>
                            <Typography variant="h5" fontWeight="bold">Doctor's Portal</Typography>
                            <Typography variant="body2" color="text.secondary">Home &gt; Dashboard</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <ThemeToggle />
                        <IconButton sx={{ bgcolor: 'background.paper' }}><NotificationsNoneIcon /></IconButton>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}><PersonIcon /></Avatar>
                    </Box>
                </Box>

                {/* 2. Welcome Banner */}
                <Paper elevation={0} sx={{ 
                    p: 4, mb: 4, borderRadius: 4, 
                    bgcolor: 'background.paper', position: 'relative', overflow: 'hidden' 
                }}>
                    <Box sx={{ zIndex: 1, position: 'relative' }}>
                        <Typography variant="h6" color="text.secondary">Welcome back,</Typography>
                        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                            {user?.fullName || "Doctor"}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            You have <strong>8 appointments</strong> remaining today.
                        </Typography>
                    </Box>
                    <Box sx={{ position: 'absolute', right: -20, top: -30, opacity: 0.1 }}>
                        <AssignmentIndIcon sx={{ fontSize: 200, color: 'primary.main' }} />
                    </Box>
                </Paper>

                <Container maxWidth="xl" disableGutters>
                    {/* 3. Stats Section */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={4}>
                            <StatCard title="Today's Patients" value="8" icon={<PeopleIcon sx={{fontSize:60, opacity:0.5}}/>} gradient="linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)" />
                        </Grid>
                        <Grid item xs={12} md={4}>
                             <StatCard title="Pending Reports" value="3" icon={<AssignmentIndIcon sx={{fontSize:60, opacity:0.5}}/>} gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" />
                        </Grid>
                        <Grid item xs={12} md={4}>
                             <StatCard title="Total Appointments" value="124" icon={<CalendarMonthIcon sx={{fontSize:60, opacity:0.5}}/>} gradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" />
                        </Grid>
                    </Grid>

                    {/* 4. Main Content Grid */}
                    <Grid container spacing={3}>
                        
                        {/* LEFT COLUMN: Charts & To-Do List */}
                        <Grid item xs={12} md={8}>
                            {/* A. Graph */}
                            <Paper sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: 'background.paper', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <Typography variant="h6" gutterBottom fontWeight="bold">Weekly Overview</Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={appointmentData}>
                                        <XAxis dataKey="day" stroke={theme.palette.text.secondary} />
                                        <YAxis stroke={theme.palette.text.secondary} />
                                        <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: '10px' }} />
                                        <Bar dataKey="Patients" fill="#8884d8" radius={[10, 10, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>

                            {/* B. To-Do List */}
                            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" fontWeight="bold">Tasks & Notes</Typography>
                                    <IconButton color="primary"><AddCircleOutlineIcon /></IconButton>
                                </Box>
                                <List>
                                    {todos.map((todo) => (
                                        <ListItem 
                                            key={todo.id} 
                                            dense 
                                            button 
                                            onClick={() => toggleTodo(todo.id)}
                                            sx={{ 
                                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f9f9f9', 
                                                mb: 1, borderRadius: 2 
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Checkbox 
                                                    edge="start" 
                                                    checked={todo.completed} 
                                                    tabIndex={-1} 
                                                    disableRipple 
                                                    color="primary"
                                                />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={todo.text} 
                                                sx={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? 'text.secondary' : 'text.primary' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>
                        
                        {/* RIGHT COLUMN: Calendar & Schedule */}
                        <Grid item xs={12} md={4}>
                            
                            {/* C. Calendar Widget */}
                            <Paper sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: 'background.paper', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" fontWeight="bold">December 2025</Typography>
                                    <Box>
                                        <IconButton size="small"><ChevronLeftIcon /></IconButton>
                                        <IconButton size="small"><ChevronRightIcon /></IconButton>
                                    </Box>
                                </Box>
                                
                                {/* Days Header */}
                                <Grid container columns={7} sx={{ mb: 1, textAlign: 'center' }}>
                                    {days.map(d => (
                                        <Grid item xs={1} key={d}>
                                            <Typography variant="caption" color="text.secondary" fontWeight="bold">{d}</Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                                
                                {/* Calendar Grid */}
                                <Grid container columns={7} spacing={1}>
                                    {calendarDates.map((date, index) => (
                                        <Grid item xs={1} key={index} sx={{ textAlign: 'center' }}>
                                            {date && (
                                                <Box sx={{ 
                                                    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', borderRadius: '50%', cursor: 'pointer', fontSize: '0.875rem',
                                                    ...(date === 5 ? { bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' } : // Highlight "Today" (Example: 5th)
                                                      date === 12 || date === 15 ? { border: `1px solid ${theme.palette.primary.main}`, color: 'primary.main' } : // Highlight Event Days
                                                      { '&:hover': { bgcolor: theme.palette.action.hover } })
                                                }}>
                                                    {date}
                                                </Box>
                                            )}
                                        </Grid>
                                    ))}
                                </Grid>
                                <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                                    <Chip label="Surgery" size="small" variant="outlined" color="primary" />
                                    <Chip label="Meeting" size="small" variant="outlined" color="secondary" />
                                </Box>
                            </Paper>

                            {/* D. Mini Schedule */}
                            <Paper sx={{ p: 3, borderRadius: 3, height: 'auto', bgcolor: 'background.paper', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6" fontWeight="bold">Upcoming</Typography>
                                    <Typography variant="body2" color="primary" sx={{ cursor:'pointer' }}>View All</Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa', borderRadius: 2 }}>
                                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>J</Avatar>
                                    <Box>
                                        <Typography fontWeight="bold">John Doe</Typography>
                                        <Typography variant="caption" color="text.secondary">10:00 AM - General Checkup</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa', borderRadius: 2 }}>
                                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>S</Avatar>
                                    <Box>
                                        <Typography fontWeight="bold">Sarah Connor</Typography>
                                        <Typography variant="caption" color="text.secondary">11:30 AM - Follow up</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default DoctorDashboard;