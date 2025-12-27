import React, { useContext } from 'react';
import { 
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Box, Typography, Avatar, Divider, IconButton 
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { styled } from '@mui/material/styles';

// Icons
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthOutlined';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import FolderSharedIcon from '@mui/icons-material/FolderSharedOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PersonIcon from '@mui/icons-material/Person';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import StarRateIcon from '@mui/icons-material/StarRate';
import EmergencyShareIcon from '@mui/icons-material/EmergencyShare';
import LockIcon from '@mui/icons-material/Lock'; 
import FactCheckIcon from '@mui/icons-material/FactCheck'; 
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SecurityIcon from '@mui/icons-material/Security';
import EventNoteIcon from '@mui/icons-material/EventNote'; // ✅ NEW ICON

const drawerWidth = 270;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', 
  color: '#e2e8f0',
  borderRight: 'none',
  boxShadow: '4px 0 20px rgba(0,0,0,0.2)'
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  background: '#0f172a',
  color: '#e2e8f0',
  borderRight: 'none',
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const MuiDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && { ...openedMixin(theme), '& .MuiDrawer-paper': openedMixin(theme) }),
    ...(!open && { ...closedMixin(theme), '& .MuiDrawer-paper': closedMixin(theme) }),
  }),
);

const Sidebar = ({ open, handleDrawerClose, onVerifyClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);

  // --- SPECIAL ITEM: Uses 'action' instead of 'path' ---
  const verificationItem = { 
    title: 'Complete Verification', 
    action: 'VERIFY_POPUP', 
    icon: <FactCheckIcon sx={{ color: '#fbbf24' }} /> 
  };

  const patientMenu = [
    { title: 'Dashboard', path: '/patient/dashboard', icon: <DashboardIcon /> },
    { title: 'My Profile', path: '/profile', icon: <PersonIcon /> },
    
    // NEW UNIFIED BOOKING PATH
    { title: 'Book Appointment', path: '/patient/book-appointment', icon: <EventAvailableIcon /> },

    // ✅ NEW: My Appointments Link
    { title: 'My Appointments', path: '/patient/my-appointments', icon: <EventNoteIcon /> },
    
    { title: 'Prescriptions', path: '/prescriptions', icon: <DescriptionIcon /> },
    { title: 'Medical Record', path: '/medical-records', icon: <FolderSharedIcon /> },
    
    // Document Permissions Link
    { title: 'Doc Permissions', path: '/patient/permissions', icon: <SecurityIcon /> },

    { title: 'Billing', path: '/billing', icon: <ReceiptLongIcon /> },
    { title: 'My Reviews', path: '/reviews', icon: <StarRateIcon /> },
    { title: 'Emergency', path: '/emergency', icon: <EmergencyShareIcon color="error" /> },
    { title: 'Settings', path: '/settings', icon: <SettingsOutlinedIcon /> },
  ];

  const adminMenu = [
    { title: 'Overview', path: '/admin-dashboard', icon: <DashboardIcon /> },
    { title: 'Verification Hub', path: '/admin-verifications', icon: <VerifiedUserIcon /> },
    { title: 'Doctor Directory', path: '/admin-doctors-list', icon: <MedicalServicesIcon /> },
    { title: 'Patient Directory', path: '/admin-patients-list', icon: <PeopleAltIcon /> },
  ];

  // DOCTOR MENU
  const doctorMenu = [
    { title: 'Dashboard', path: '/doctor-dashboard', icon: <DashboardIcon /> },
    { title: 'My Profile', path: '/profile', icon: <PersonIcon /> },
    { title: 'My Schedule', path: '/doctor/schedule', icon: <CalendarMonthIcon /> }, 
    { title: 'My Patients', path: '/doctor/patients', icon: <PeopleAltIcon /> },
  ];

  let currentMenu = [];
  if (user?.role === 'ADMIN') currentMenu = adminMenu;
  else if (user?.role === 'DOCTOR') currentMenu = doctorMenu;
  else currentMenu = patientMenu;

  // Prepend verification button if status is NEW
  if (user?.status === 'NEW') {
      currentMenu = [verificationItem, ...currentMenu];
  }

  return (
    <MuiDrawer variant="permanent" open={open}>
      <DrawerHeader>
        {open && (
           <Box sx={{ display: 'flex', alignItems: 'center', mr: 'auto', ml: 2 }}>
             <LocalHospitalIcon sx={{ color: '#38bdf8', fontSize: 32, mr: 1 }} />
             <Typography variant="h6" fontWeight="800" sx={{ color: '#fff', letterSpacing: 1 }}>MEDVAULT</Typography>
           </Box>
        )}
        <IconButton onClick={handleDrawerClose} sx={{ color: '#94a3b8' }}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      
      <Divider sx={{ borderColor: '#334155' }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {open && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
                <Avatar sx={{ width: 70, height: 70, mb: 1.5, bgcolor: 'transparent', border: '2px solid #38bdf8', color: '#38bdf8' }}>
                    <PersonIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#f8fafc' }}>{user?.fullName}</Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase' }}>{user?.role}</Typography>
            </Box>
        )}

        <List sx={{ px: 2 }}>
            {currentMenu.map((item) => {
                const isActive = location.pathname === item.path;
                
                // --- LOCK LOGIC ---
                let isLocked = false;
                if (item.action === 'VERIFY_POPUP') {
                    isLocked = false; 
                } else if (user?.status === 'NEW') {
                    if (item.path?.includes('dashboard')) isLocked = false;
                    else isLocked = true;
                } else if (user?.status === 'PENDING') {
                    if (item.path?.includes('dashboard')) isLocked = false;
                    else isLocked = true;
                }

                return (
                    <ListItem key={item.title} disablePadding sx={{ mb: 1, display: 'block' }}>
                        <ListItemButton 
                            onClick={() => {
                                if (item.action === 'VERIFY_POPUP') {
                                    if (onVerifyClick) onVerifyClick(); 
                                } else if (!isLocked) {
                                    navigate(item.path);
                                }
                            }}
                            disabled={isLocked}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                borderRadius: '12px',
                                bgcolor: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent', 
                                color: isActive ? '#38bdf8' : (isLocked ? '#475569' : '#94a3b8'),
                                borderLeft: isActive ? '4px solid #38bdf8' : '4px solid transparent',
                                cursor: isLocked ? 'not-allowed' : 'pointer',
                                opacity: isLocked ? 0.5 : 1,
                                '&:hover': {
                                    bgcolor: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.05)',
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center', color: isActive ? '#38bdf8' : (isLocked ? '#475569' : '#64748b') }}>
                                {item.icon}
                            </ListItemIcon>
                            
                            <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
                            
                            {isLocked && open && <LockIcon fontSize="small" sx={{ ml: 1, fontSize: 16 }} />}
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>

        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ p: 2 }}>
            <ListItemButton onClick={() => { logout(); navigate('/login'); }} sx={{ justifyContent: open ? 'initial' : 'center', color: '#ef4444', borderRadius: '12px', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}>
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center', color: '#ef4444' }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0, fontWeight: 'bold' }} />
            </ListItemButton>
        </Box>
      </Box>
    </MuiDrawer>
  );
};

export default Sidebar;