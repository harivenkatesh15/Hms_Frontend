import React, { useEffect, useState, useContext } from 'react';
import { 
    Box, Typography, CircularProgress, Tabs, Tab, Paper, Button, Avatar, Chip, Fade 
} from '@mui/material';
import { 
    Person, Badge, HistoryEdu, SelfImprovement, 
    MonitorHeart, Medication, FolderShared, Edit 
} from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

// Child Tabs
import TabDemographics from '../components/tabs/TabDemographics';
import TabIdentification from '../components/tabs/TabIdentification';
import TabHistory from '../components/tabs/TabHistory';
import TabLifestyle from '../components/tabs/TabLifestyle';
import TabHealthData from '../components/tabs/TabHealthData';
import TabMeds from '../components/tabs/TabMeds';
import TabDocuments from '../components/tabs/TabDocuments';

import MedicalActionModal from '../components/MedicalActionModal';

// --- THEME COLORS ---
const TAB_THEMES = {
    0: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',   
    1: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',   
    2: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',   
    3: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',   
    4: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', 
    5: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',   
    6: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',   
};

const MedicalRecords = () => {
    const { token, user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [modal, setModal] = useState({ open: false, mode: '' });

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/patient/health-record', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setData(res.data);
        } catch (err) {
            console.error("Failed to fetch records", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [token]);
    const handleTabChange = (event, newValue) => setTabIndex(newValue);
    const handleAction = (mode) => setModal({ open: true, mode: mode });

    if (loading) return <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>;

    return (
        <Box sx={{ 
            display: 'flex', 
            minHeight: '100vh', 
            width: '100%', 
            overflowX: 'hidden',
            background: '#f5f8f4ff',
            position: 'relative'
        }}>
            {/* Dynamic Background Glow */}
            <Box sx={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: TAB_THEMES[tabIndex] || TAB_THEMES[0],
                opacity: 0.1, 
                transition: 'background 0.8s ease-in-out',
                zIndex: 0
            }} />

            <Sidebar role="PATIENT" open={true} onVerifyClick={() => {}} />
            
            <Box component="main" sx={{ flexGrow: 1, p: 3, minWidth: 0, position: 'relative', zIndex: 1 }}>
                
                {/* 1. HEADER */}
                <Paper sx={{ 
                    p: 3, mb: 4, borderRadius: 5, 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
                    flexWrap: 'wrap', gap: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Avatar sx={{ 
                            width: 72, height: 72, 
                            background: TAB_THEMES[tabIndex], 
                            fontSize: 30, fontWeight: 'bold', color: 'white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                            {user?.fullName?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: '-0.5px', color: '#1e293b' }}>
                                {user?.fullName}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mt: 0.5, alignItems: 'center' }}>
                                <Chip label={`PID: ${data?.patientProfile?.id}`} size="small" sx={{ fontWeight: 800, bgcolor: 'white', border: '1px solid #e2e8f0' }} />
                                <Typography variant="body2" fontWeight="600" color="text.secondary">
                                    {data?.patientProfile?.gender || '--'} • {data?.patientProfile?.age ? `${data.patientProfile.age} Yrs` : '--'}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    
                    <Button 
                        variant="contained" 
                        startIcon={<Edit />} 
                        onClick={() => handleAction('PROFILE')}
                        sx={{
                            borderRadius: '50px', px: 4, py: 1.2,
                            textTransform: 'none', fontSize: '1rem', fontWeight: 700,
                            background: '#1e293b',
                            boxShadow: '0 10px 20px -5px rgba(30, 41, 59, 0.3)',
                            '&:hover': { background: '#0f172a', transform: 'translateY(-2px)' }
                        }}
                    >
                        Edit Profile
                    </Button>
                </Paper>

                {/* 2. THE NEW "FLOATING ISLANDS" TABS (No Long Bar!) */}
                <Box sx={{ mb: 4 }}>
                    <Tabs 
                        value={tabIndex} 
                        onChange={handleTabChange} 
                        variant="scrollable" 
                        scrollButtons="auto"
                        sx={{
                            // Remove the default line indicator
                            '& .MuiTabs-indicator': { display: 'none' },
                            
                            // Flex layout to separate the tabs
                            '& .MuiTabs-flexContainer': { 
                                gap: 2, 
                                py: 1 // Add padding for shadows
                            },

                            // The Individual "Island" Tabs
                            '& .MuiTab-root': {
                                textTransform: 'none', 
                                fontWeight: 700, 
                                fontSize: '0.9rem',
                                minHeight: 55, 
                                borderRadius: '16px', // Rounded squares
                                px: 3, 
                                color: '#64748b', // Default grey text
                                bgcolor: 'rgba(255,255,255,0.6)', // Glass background
                                border: '1px solid rgba(255,255,255,0.5)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                
                                // HOVER STATE
                                '&:hover': { 
                                    bgcolor: 'white', 
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                },

                                // SELECTED STATE (The Magic)
                                '&.Mui-selected': { 
                                    color: 'white', 
                                    // Dynamic background based on the tab theme!
                                    background: TAB_THEMES[tabIndex] || '#1e293b',
                                    boxShadow: '0 8px 20px -5px rgba(0,0,0,0.2)',
                                    transform: 'scale(1.05)',
                                    border: 'none'
                                }
                            }
                        }}
                    >
                        <Tab label="Demographics" icon={<Person />} iconPosition="start" />
                        <Tab label="ID Proofs" icon={<Badge />} iconPosition="start" />
                        <Tab label="History" icon={<HistoryEdu />} iconPosition="start" />
                        <Tab label="Lifestyle" icon={<SelfImprovement />} iconPosition="start" />
                        <Tab label="Health" icon={<MonitorHeart />} iconPosition="start" />
                        <Tab label="Meds" icon={<Medication />} iconPosition="start" />
                        <Tab label="Docs" icon={<FolderShared />} iconPosition="start" />
                    </Tabs>
                </Box>

                {/* 3. CONTENT AREA */}
                <Fade in={true} key={tabIndex} timeout={600}>
                    <Box sx={{ minHeight: 400 }}>
                        {tabIndex === 0 && <TabDemographics profile={data?.patientProfile} />}
                        {tabIndex === 1 && <TabIdentification profile={data?.patientProfile} />}
                        {tabIndex === 2 && <TabHistory events={data?.timeline} onAdd={() => handleAction('HISTORY')} />}
                        {tabIndex === 3 && <TabLifestyle lifestyle={data?.lifestyle} onEdit={() => handleAction('LIFESTYLE')} />}
                        {tabIndex === 4 && <TabHealthData vitals={data?.latestVitals} history={data?.vitalHistory} onAdd={() => handleAction('VITALS')} />}
                        {tabIndex === 5 && <TabMeds meds={data?.medications} onAdd={() => handleAction('MEDS')} />}
                        {tabIndex === 6 && <TabDocuments reports={data?.reports} onAdd={() => handleAction('REPORT')} />}
                    </Box>
                </Fade>

            </Box>

            <MedicalActionModal 
                open={modal.open} 
                mode={modal.mode} 
                initialData={modal.mode === 'LIFESTYLE' ? data?.lifestyle : data?.patientProfile} 
                onClose={() => setModal({ ...modal, open: false })} 
                onSuccess={fetchData} 
            />
        </Box>
    );
};

export default MedicalRecords;