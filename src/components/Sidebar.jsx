import React, { useContext } from 'react';
import { 
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Box, Typography, Avatar, Divider, IconButton, Tooltip 
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
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PersonIcon from '@mui/icons-material/Person';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import StarRateIcon from '@mui/icons-material/StarRate';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import EmergencyShareIcon from '@mui/icons-material/EmergencyShare';
import GroupIcon from '@mui/icons-material/Group';
import LockIcon from '@mui/icons-material/Lock'; // The Lock Icon
import FactCheckIcon from '@mui/icons-material/FactCheck'; // Icon for "Complete Profile"

const drawerWidth = 260;

// ... (Keep the existing Mixins and DrawerHeader styled components exactly as they were) ...
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
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
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Sidebar = ({ open, handleDrawerClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);

  // 1. Define the "Complete Profile" Item (This is the special key)
  const verificationItem = { 
    title: 'Complete Verification', 
    path: '/complete-profile', 
    icon: <FactCheckIcon color="primary" /> 
  };

  // 2. Base Menus
  const patientMenu = [
    { title: 'Dashboard', path: '/patient-dashboard', icon: <DashboardIcon /> },
    { title: 'Appointments', path: '/appointments', icon: <CalendarMonthIcon /> },
    { title: 'Book Appointment', path: '/book-appointment', icon: <EventAvailableIcon /> },
    { title: 'Prescriptions', path: '/prescriptions', icon: <DescriptionIcon /> },
    { title: 'Medical Record', path: '/medical-records', icon: <FolderSharedIcon /> },
    { title: 'Billing', path: '/billing', icon: <ReceiptLongIcon /> },
    { title: 'My Reviews', path: '/reviews', icon: <StarRateIcon /> },
    { title: 'Emergency', path: '/emergency', icon: <EmergencyShareIcon color="error" /> },
    { title: 'Settings', path: '/settings', icon: <SettingsOutlinedIcon /> },
  ];

  const adminMenu = [
    { title: 'Dashboard', path: '/admin-dashboard', icon: <DashboardIcon /> },
    { title: 'Manage Doctors', path: '/admin-doctors', icon: <LocalHospitalIcon /> },
    { title: 'Pending Users', path: '/admin-users', icon: <GroupIcon /> },
  ];

  const doctorMenu = [
    { title: 'Dashboard', path: '/doctor-dashboard', icon: <DashboardIcon /> },
    { title: 'My Schedule', path: '/doctor-schedule', icon: <CalendarMonthIcon /> },
    { title: 'My Patients', path: '/doctor-patients', icon: <PersonIcon /> },
  ];

  // 3. Determine which menu to show
  let currentMenu = [];
  if (user?.role === 'ADMIN') currentMenu = adminMenu;
  else if (user?.role === 'DOCTOR') currentMenu = doctorMenu;
  else currentMenu = patientMenu;

  // 4. Inject "Complete Verification" at the top ONLY if status is NEW
  if (user?.status === 'NEW') {
      currentMenu = [verificationItem, ...currentMenu];
  }

  return (
    <MuiDrawer variant="permanent" open={open}>
      <DrawerHeader>
        {open && (
           <Box sx={{ display: 'flex', alignItems: 'center', mr: 'auto', ml: 2 }}>
             <LocalHospitalIcon sx={{ color: '#ff6b6b', fontSize: 28, mr: 1 }} />
             <Typography variant="h6" fontWeight="800" color="text.primary">MedVault</Typography>
           </Box>
        )}
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      
      <Divider />

      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Profile Info */}
        {open && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 3 }}>
                <Avatar sx={{ width: 70, height: 70, mb: 1, bgcolor: '#e3f2fd', color: '#1976d2' }}>
                    <PersonIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold">
                    {user?.fullName || "User"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {user?.status === 'NEW' ? 'Verify Account' : user?.role}
                </Typography>
            </Box>
        )}

        <List sx={{ px: 1 }}>
            {currentMenu.map((item) => {
                const isActive = location.pathname === item.path;
                
                // 5. THE LOCK LOGIC
                // If user is NEW, everything is locked EXCEPT '/complete-profile'
                // If user is PENDING, everything is locked (waiting for admin)
                // If user is ACTIVE, everything is unlocked
               // 5. THE LOCK LOGIC
                let isLocked = false;

                if (user?.status === 'NEW') {
                    // NEW Users:
                    // Unlock: "Complete Verification" AND "Dashboard"
                    // Lock: Everything else
                    if (item.path === '/complete-profile' || item.path === '/patient-dashboard' || item.path === '/doctor-dashboard' || item.path === '/admin-dashboard') {
                        isLocked = false;
                    } else {
                        isLocked = true;
                    }
                } else if (user?.status === 'PENDING') {
                    // PENDING Users:
                    // Lock everything except Dashboard (waiting for admin)
                    if (item.path === '/patient-dashboard' || item.path === '/doctor-dashboard' || item.path === '/admin-dashboard') {
                        isLocked = false;
                    } else {
                        isLocked = true;
                    }
                }
                // ACTIVE Users: isLocked remains false (everything unlocked)

                return (
                    <ListItem key={item.title} disablePadding sx={{ mb: 1, display: 'block' }}>
                        <ListItemButton 
                            onClick={() => !isLocked && navigate(item.path)}
                            disabled={isLocked} // Material UI visual disable
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                borderRadius: '10px',
                                bgcolor: isActive ? '#f0f4ff' : 'transparent',
                                color: isActive ? '#1976d2' : (isLocked ? '#aaa' : '#555'),
                                cursor: isLocked ? 'not-allowed' : 'pointer',
                                opacity: isLocked ? 0.6 : 1
                            }}
                        >
                            <ListItemIcon 
                                sx={{ 
                                    minWidth: 0, 
                                    mr: open ? 3 : 'auto', 
                                    justifyContent: 'center', 
                                    color: isActive ? '#1976d2' : (isLocked ? '#aaa' : '#888') 
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            
                            <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
                            
                            {/* Optional: Show Lock Icon if locked and sidebar is open */}
                            {isLocked && open && <LockIcon fontSize="small" sx={{ ml: 1, fontSize: 16 }} />}
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        {/* Logout (Always Unlocked) */}
        <Box sx={{ p: 1 }}>
            <ListItemButton 
                onClick={() => { logout(); navigate('/login'); }}
                sx={{ 
                    justifyContent: open ? 'initial' : 'center', 
                    color: '#ff4757',
                    borderRadius: '10px',
                    '&:hover': { bgcolor: '#fff0f1' }
                }}
            >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', color: '#ff4757' }}>
                    <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0, fontWeight: 'bold' }} />
            </ListItemButton>
        </Box>
      </Box>
    </MuiDrawer>
  );
};

export default Sidebar;