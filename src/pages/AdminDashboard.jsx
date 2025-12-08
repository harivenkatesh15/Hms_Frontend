import React, { useState, useEffect, useContext } from 'react';
import { 
    Box, Container, Grid, Typography, Paper, IconButton, CssBaseline, 
    Table, TableBody, TableCell, TableHead, TableRow, Chip, Button, Avatar, useTheme,
    List, ListItem, ListItemIcon, ListItemText, Checkbox, Divider
} from '@mui/material';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// --- Components & Context ---
import Sidebar from '../components/Sidebar.jsx';
import StatCard from '../components/StatCard.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

// --- Icons ---
import MenuIcon from '@mui/icons-material/Menu';
import GroupIcon from '@mui/icons-material/Group';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// --- Mock Data for Charts ---
const userData = [
  { name: 'Jan', Patients: 40, Doctors: 24 },
  { name: 'Feb', Patients: 30, Doctors: 13 },
  { name: 'Mar', Patients: 20, Doctors: 58 },
  { name: 'Apr', Patients: 27, Doctors: 39 },
  { name: 'May', Patients: 18, Doctors: 48 },
  { name: 'Jun', Patients: 23, Doctors: 38 },
];
const roleData = [{ name: 'Patients', value: 400 }, { name: 'Doctors', value: 300 }, { name: 'Admins', value: 30 }];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const AdminDashboard = () => {
    const [open, setOpen] = useState(true);
    const [recentUsers, setRecentUsers] = useState([]);
    const { token, user } = useContext(AuthContext); // Get user for welcome msg
    const navigate = useNavigate();
    const theme = useTheme(); // Theme Hook

    // --- Admin Task List State (New Extra Feature) ---
    const [adminTasks, setAdminTasks] = useState([
        { id: 1, text: 'Review system logs', completed: false },
        { id: 2, text: 'Backup database', completed: true },
        { id: 3, text: 'Check server health', completed: false },
    ]);

    const toggleTask = (id) => {
        setAdminTasks(adminTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    // --- Fetch Logic (PRESERVED) ---
    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/admin/pending-users', { headers: { Authorization: `Bearer ${token}` } });
                setRecentUsers(res.data.slice(0, 5)); // Only show first 5
            } catch (err) { console.error(err); }
        };
        fetchRecent();
    }, [token]);

    // --- Calendar Logic ---
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const calendarDates = [null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, null, null];


    return (
        <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh', color: 'text.primary' }}>
            <CssBaseline />
            <Sidebar role="ADMIN" open={open} handleDrawerClose={() => setOpen(false)} />
            
            <Box component="main" sx={{ flexGrow: 1, p: 3, transition: '0.3s' }}>
                
                {/* 1. Top Bar (Matched Style) */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {!open && <IconButton onClick={() => setOpen(true)} sx={{ mr: 2 }}><MenuIcon /></IconButton>}
                        <Box>
                            <Typography variant="h5" fontWeight="bold" color="primary">Admin Control Center</Typography>
                            <Typography variant="body2" color="text.secondary">Overview & Statistics</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <ThemeToggle />
                        <IconButton sx={{ bgcolor: 'background.paper' }}><NotificationsNoneIcon /></IconButton>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                            <AdminPanelSettingsIcon />
                        </Avatar>
                    </Box>
                </Box>

                {/* 2. Welcome Banner */}
                <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 4, bgcolor: 'background.paper', position: 'relative', overflow: 'hidden' }}>
                    <Box sx={{ zIndex: 1, position: 'relative' }}>
                        <Typography variant="h6" color="text.secondary">Welcome back,</Typography>
                        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                            {user?.fullName || "Administrator"}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            System is running smoothly. You have <strong>{recentUsers.length} pending requests</strong> requiring attention.
                        </Typography>
                    </Box>
                    <Box sx={{ position: 'absolute', right: -10, bottom: -20, opacity: 0.1 }}>
                        <VerifiedUserIcon sx={{ fontSize: 180, color: 'primary.main' }} />
                    </Box>
                </Paper>

                <Container maxWidth="xl" disableGutters>
                    {/* 3. Stats Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={4}>
                            <StatCard title="Total Users" value="1,240" icon={<GroupIcon sx={{ fontSize: 60, opacity:0.5 }} />} gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatCard title="Verified Doctors" value="45" icon={<VerifiedUserIcon sx={{ fontSize: 60, opacity:0.5 }} />} gradient="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatCard title="System Health" value="98%" icon={<AdminPanelSettingsIcon sx={{ fontSize: 60, opacity:0.5 }} />} gradient="linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)" />
                        </Grid>
                    </Grid>

                    {/* 4. Graphs Section */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <Typography variant="h6" gutterBottom fontWeight="bold">Platform Growth</Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <AreaChart data={userData}>
                                        <defs>
                                            <linearGradient id="colorPat" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                                        <YAxis stroke={theme.palette.text.secondary} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                                        <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: '10px' }} />
                                        <Area type="monotone" dataKey="Patients" stroke="#8884d8" fillOpacity={1} fill="url(#colorPat)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 3, borderRadius: 3, height: '100%', bgcolor: 'background.paper', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <Typography variant="h6" gutterBottom fontWeight="bold">User Distribution</Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={roleData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                                            {roleData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: '10px' }} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* 5. Bottom Section: Requests Table + Extra Widgets */}
                    <Grid container spacing={3}>
                        
                        {/* LEFT: Recent Pending Requests (Preserved Functionality) */}
                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6" fontWeight="bold">Recent Pending Requests</Typography>
                                    <Button onClick={() => navigate('/admin-users')}>View All</Button>
                                </Box>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f5f5f5' }}>
                                        <TableRow>
                                            <TableCell><strong>Name</strong></TableCell>
                                            <TableCell><strong>Role</strong></TableCell>
                                            <TableCell><strong>Status</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recentUsers.length > 0 ? recentUsers.map((u) => (
                                            <TableRow key={u.id} hover>
                                                <TableCell>{u.fullName}</TableCell>
                                                <TableCell>
                                                    <Chip label={u.role} color={u.role === 'DOCTOR' ? 'secondary' : 'primary'} size="small" variant="outlined" />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="Pending Action" color="warning" size="small" />
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow><TableCell colSpan={3} align="center" sx={{ py: 3 }}>No recent requests found</TableCell></TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Grid>

                        {/* RIGHT: Calendar & Admin Tasks (New Extra Feature) */}
                        <Grid item xs={12} md={4}>
                            {/* Calendar */}
                            <Paper sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: 'background.paper', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" fontWeight="bold">System Calendar</Typography>
                                    <Box>
                                        <IconButton size="small"><ChevronLeftIcon /></IconButton>
                                        <IconButton size="small"><ChevronRightIcon /></IconButton>
                                    </Box>
                                </Box>
                                <Grid container columns={7} sx={{ mb: 1, textAlign: 'center' }}>
                                    {days.map(d => <Grid item xs={1} key={d}><Typography variant="caption" fontWeight="bold" color="text.secondary">{d}</Typography></Grid>)}
                                </Grid>
                                <Grid container columns={7} spacing={1}>
                                    {calendarDates.map((date, index) => (
                                        <Grid item xs={1} key={index} sx={{ textAlign: 'center' }}>
                                            {date && <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', borderRadius: '50%', cursor: 'pointer', ...(date === 5 ? { bgcolor: 'primary.main', color: 'white' } : { '&:hover': { bgcolor: theme.palette.action.hover } }) }}>{date}</Box>}
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>

                            {/* Admin To-Do List */}
                            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" fontWeight="bold">Maintenance Tasks</Typography>
                                    <IconButton color="primary"><AddCircleOutlineIcon /></IconButton>
                                </Box>
                                <List dense>
                                    {adminTasks.map((task) => (
                                        <ListItem key={task.id} button onClick={() => toggleTask(task.id)}>
                                            <ListItemIcon><Checkbox edge="start" checked={task.completed} disableRipple /></ListItemIcon>
                                            <ListItemText primary={task.text} sx={{ textDecoration: task.completed ? 'line-through' : 'none' }} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>

                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default AdminDashboard;