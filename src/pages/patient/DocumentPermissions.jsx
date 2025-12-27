import React, { useState, useEffect, useContext } from 'react';
import { 
    Box, Typography, Paper, Tabs, Tab, Grid, Avatar, Button, TextField, 
    Chip, Divider, Fade, CircularProgress, Alert, Snackbar 
} from '@mui/material';
import { 
    Security, CheckCircle, Cancel, AccessTime, VerifiedUser, 
    Block, Description, ChatBubbleOutline 
} from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar'; // ✅ Added Sidebar
import dayjs from 'dayjs';

// --- THEME COLORS ---
const colors = {
    pending: '#f59e0b', // Amber
    approved: '#10b981', // Emerald
    rejected: '#ef4444', // Red
    dark: '#1e293b',
    light: '#f8fafc'
};

const DocumentPermissions = () => {
    const { user, token } = useContext(AuthContext); 
    
    const [tabValue, setTabValue] = useState(0);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Stores replies for specific requests: { requestId: "My reply text" }
    const [replies, setReplies] = useState({}); 
    
    const [toast, setToast] = useState({ open: false, msg: '', severity: 'success' });

    // Status mapping for API and UI
    const statusMap = ['PENDING', 'APPROVED', 'REJECTED'];

    // --- FETCH REQUESTS ---
    const fetchRequests = async () => {
        if (!user || !user.id) return;
        
        setLoading(true);
        try {
            const status = statusMap[tabValue]; // 0=PENDING, 1=APPROVED, 2=REJECTED

            const res = await axios.get(`http://localhost:8080/api/access/patient/${user.id}/${status}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data || []);
        } catch (err) {
            console.error("Error fetching permissions:", err);
            setRequests([]); // Safe fallback
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch when tab or user changes
    useEffect(() => {
        fetchRequests();
    }, [tabValue, user]);

    // --- HANDLE ACTION (Approve/Deny) ---
    const handleRespond = async (requestId, status) => {
        try {
            const replyText = replies[requestId] || "Access Updated by Patient"; 
            
            await axios.put(`http://localhost:8080/api/access/respond/${requestId}`, {
                status: status,
                reply: replyText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setToast({ open: true, msg: `Request ${status} successfully!`, severity: status === 'APPROVED' ? 'success' : 'info' });
            
            // ✅ CRITICAL FIX: Remove item from current view immediately to prevent crash/confusion
            setRequests(prev => prev.filter(r => r.id !== requestId));
            setReplies(prev => ({ ...prev, [requestId]: '' })); 

        } catch (err) {
            console.error(err);
            setToast({ open: true, msg: 'Action failed. Please try again.', severity: 'error' });
        }
    };

    // --- HELPER: Handle Text Change ---
    const handleReplyChange = (reqId, text) => {
        setReplies(prev => ({ ...prev, [reqId]: text }));
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f1f5f9' }}>
            {/* ✅ SIDEBAR ADDED HERE */}
            <Sidebar role="PATIENT" open={true} />

            <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
                {/* HEADER */}
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: colors.dark, width: 56, height: 56 }}>
                        <Security fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="900" color={colors.dark}>
                            Permission<span style={{ color: '#6366f1' }}>Center</span>
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage doctor access to your private medical documents.
                        </Typography>
                    </Box>
                </Box>

                {/* TABS */}
                <Paper sx={{ borderRadius: 4, mb: 4, overflow: 'hidden' }}>
                    <Tabs 
                        value={tabValue} 
                        onChange={(e, v) => setTabValue(v)} 
                        variant="fullWidth"
                        sx={{
                            '& .MuiTab-root': { py: 3, fontWeight: 'bold', fontSize: '1rem' },
                            '& .Mui-selected': { color: tabValue === 0 ? colors.pending : tabValue === 1 ? colors.approved : colors.rejected },
                            '& .MuiTabs-indicator': { bgcolor: tabValue === 0 ? colors.pending : tabValue === 1 ? colors.approved : colors.rejected }
                        }}
                    >
                        <Tab icon={<AccessTime />} label={`Pending (${tabValue === 0 ? requests.length : ''})`} iconPosition="start" />
                        <Tab icon={<VerifiedUser />} label="Approved Access" iconPosition="start" />
                        <Tab icon={<Block />} label="Rejected / Expired" iconPosition="start" />
                    </Tabs>
                </Paper>

                {/* CONTENT AREA */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
                ) : requests.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 10, opacity: 0.6 }}>
                        <Description sx={{ fontSize: 80, mb: 2, color: 'text.disabled' }} />
                        <Typography variant="h6">No requests found in this section.</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {requests.map((req) => (
                            <Grid item xs={12} md={tabValue === 0 ? 6 : 12} key={req.id}> 
                                <Fade in={true}>
                                    <Paper sx={{ 
                                        p: 3, borderRadius: 4, position: 'relative', overflow: 'hidden',
                                        borderLeft: `6px solid ${tabValue === 0 ? colors.pending : tabValue === 1 ? colors.approved : colors.rejected}`,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                        transition: '0.3s',
                                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }
                                    }}>
                                        
                                        {/* Top Section: Doctor & File Info */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                {/* Safety check for doctor object */}
                                                <Avatar src={req.doctor?.profileImage} sx={{ width: 50, height: 50, border: '2px solid #e2e8f0' }}>
                                                    {req.doctor?.fullName?.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" fontWeight="800">Dr. {req.doctor?.fullName || "Unknown"}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Requested: {dayjs(req.requestedAt).format('MMM D, h:mm A')}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Chip 
                                                icon={<Description sx={{ fontSize: '16px !important' }} />} 
                                                label={req.labReport?.testName || "Unknown Document"} 
                                                variant="outlined" 
                                                sx={{ fontWeight: 'bold', borderRadius: 2 }} 
                                            />
                                        </Box>

                                        <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

                                        {/* Middle Section: Communication */}
                                        <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 3, mb: 2 }}>
                                            <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <ChatBubbleOutline fontSize="small" /> DOCTOR'S NOTE
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontStyle: 'italic', color: colors.dark }}>
                                                "{req.doctorNote}"
                                            </Typography>
                                        </Box>

                                        {/* Logic for PENDING Tab (Actionable) */}
                                        {tabValue === 0 && (
                                            <Box>
                                                <TextField
                                                    fullWidth
                                                    placeholder="Write a reply (optional)..."
                                                    variant="outlined"
                                                    size="small"
                                                    multiline
                                                    rows={2}
                                                    value={replies[req.id] || ''}
                                                    onChange={(e) => handleReplyChange(req.id, e.target.value)}
                                                    sx={{ mb: 2, bgcolor: 'white' }}
                                                />
                                                <Box sx={{ display: 'flex', gap: 2 }}>
                                                    <Button 
                                                        fullWidth 
                                                        variant="contained" 
                                                        onClick={() => handleRespond(req.id, 'APPROVED')}
                                                        startIcon={<CheckCircle />}
                                                        sx={{ bgcolor: colors.approved, '&:hover': { bgcolor: '#059669' }, borderRadius: 2, py: 1 }}
                                                    >
                                                        Approve Access
                                                    </Button>
                                                    <Button 
                                                        fullWidth 
                                                        variant="outlined" 
                                                        onClick={() => handleRespond(req.id, 'REJECTED')}
                                                        startIcon={<Cancel />}
                                                        sx={{ color: colors.rejected, borderColor: colors.rejected, '&:hover': { bgcolor: '#fef2f2', borderColor: colors.rejected }, borderRadius: 2, py: 1 }}
                                                    >
                                                        Deny
                                                    </Button>
                                                </Box>
                                            </Box>
                                        )}

                                        {/* Logic for APPROVED/REJECTED Tabs (Read-Only) */}
                                        {tabValue !== 0 && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                <Typography variant="caption" fontWeight="bold" color="text.secondary">YOUR REPLY:</Typography>
                                                <Typography variant="body2">{req.patientReply || "No reply provided."}</Typography>
                                                <Box sx={{ flexGrow: 1 }} />
                                                <Typography variant="caption" color="text.disabled">
                                                    {statusMap[tabValue]} on {dayjs(req.respondedAt).format('MMM D, YYYY')}
                                                </Typography>
                                            </Box>
                                        )}

                                    </Paper>
                                </Fade>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Feedback Toast */}
                <Snackbar 
                    open={toast.open} 
                    autoHideDuration={4000} 
                    onClose={() => setToast({ ...toast, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert severity={toast.severity} variant="filled" sx={{ borderRadius: 3 }}>
                        {toast.msg}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default DocumentPermissions;