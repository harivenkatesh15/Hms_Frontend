import React from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, Container, Grid, Paper, 
  Avatar, Card, CardContent, IconButton, useTheme 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled, keyframes } from '@mui/material/styles';

// Icons
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// --- Animations ---
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(25, 118, 210, 0); }
  100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Styled Components ---
const HeroButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px',
  padding: '12px 35px',
  fontSize: '1.1rem',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0,118,255,0.23)',
  },
}));

const ServiceCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  borderRadius: '20px',
  transition: 'all 0.4s ease',
  border: '1px solid rgba(0,0,0,0.05)',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    border: `1px solid ${theme.palette.primary.main}`,
  },
}));

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#fff', overflowX: 'hidden' }}>
       
      {/* 1. Transparent Floating Navbar */}
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #f0f0f0' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <LocalHospitalIcon sx={{ color: '#1976d2', mr: 1, fontSize: 32 }} />
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: '#1976d2', fontWeight: '800', letterSpacing: '-0.5px' }}>
              MedVault
            </Typography>
            
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
                {['Home', 'Services', 'Doctors', 'Contact'].map((item) => (
                    <Button key={item} sx={{ color: '#555', fontWeight: 500, '&:hover': { color: '#1976d2' } }}>{item}</Button>
                ))}
                <Button variant="outlined" onClick={() => navigate('/login')} sx={{ borderRadius: '20px', px: 3 }}>Login</Button>
                <Button variant="contained" onClick={() => navigate('/register')} disableElevation sx={{ borderRadius: '20px', px: 3, background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)' }}>
                  Get Started
                </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 2. Hero Section */}
      <Box sx={{ 
          pt: 18, pb: 15, position: 'relative',
          background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
          overflow: 'hidden'
      }}>
        {/* Abstract Shapes Background */}
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'linear-gradient(45deg, #e3f2fd 30%, #e1f5fe 90%)', opacity: 0.7, zIndex: 0 }} />
        <Box sx={{ position: 'absolute', bottom: 50, left: -50, width: 300, height: 300, borderRadius: '50%', background: '#fff3e0', opacity: 0.6, zIndex: 0 }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ animation: `${fadeIn} 1s ease-out` }}>
                  <Typography variant="overline" color="primary" fontWeight="bold" sx={{ letterSpacing: 2 }}>
                    FUTURE OF HEALTHCARE
                  </Typography>
                  <Typography variant="h2" fontWeight="900" sx={{ mt: 1, mb: 3, color: '#1a237e', lineHeight: 1.1 }}>
                    Managing Your <br/>
                    <span style={{ color: '#1976d2', background: '-webkit-linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      Hospital Operations
                    </span>
                    <br/> Has Never Been Easier.
                  </Typography>
                  <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: '500px', lineHeight: 1.6 }}>
                    Connect patients, doctors, and administrators in one unified cloud platform. Secure, fast, and reliable.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <HeroButton variant="contained" onClick={() => navigate('/register')} sx={{ background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)', animation: `${pulse} 2s infinite` }}>
                      Start Free Trial
                    </HeroButton>
                    <HeroButton variant="outlined" onClick={() => navigate('/login')} sx={{ borderColor: '#1976d2', color: '#1976d2' }}>
                      Book Demo
                    </HeroButton>
                  </Box>
                  
                  <Box sx={{ mt: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex' }}>
                        {[1,2,3,4].map(i => (
                            <Avatar key={i} src={`https://i.pravatar.cc/150?img=${i+10}`} sx={{ width: 40, height: 40, border: '2px solid white', ml: i === 0 ? 0 : -1.5 }} />
                        ))}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        <strong>2,000+</strong> Doctors trust MedVault
                    </Typography>
                  </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' }, position: 'relative' }}>
                {/* 3D Illustration / Composition */}
                <Box sx={{ position: 'relative', height: 500, width: '100%', animation: `${float} 6s ease-in-out infinite` }}>
                    <Box component="img" src="https://img.freepik.com/free-vector/health-professional-team-concept-illustration_114360-1618.jpg" 
                        sx={{ width: '100%', borderRadius: 8, boxShadow: '0 20px 80px rgba(0,0,0,0.1)', bgcolor: 'white' }} 
                    />
                    
                    {/* Floating Cards */}
                    <Paper sx={{ position: 'absolute', top: 40, left: -40, p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, boxShadow: 3, animation: `${float} 4s ease-in-out infinite reverse` }}>
                        <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}><EventAvailableIcon /></Avatar>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold">Appointments</Typography>
                            <Typography variant="caption" color="text.secondary">Pending: 12</Typography>
                        </Box>
                    </Paper>

                    <Paper sx={{ position: 'absolute', bottom: 80, right: -20, p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, boxShadow: 3, animation: `${float} 5s ease-in-out infinite` }}>
                        <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32' }}><VerifiedUserIcon /></Avatar>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold">Data Secure</Typography>
                            <Typography variant="caption" color="text.secondary">Encrypted</Typography>
                        </Box>
                    </Paper>
                </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 3. Stats Section */}
      <Box sx={{ py: 6, bgcolor: '#1a237e', color: 'white' }}>
        <Container>
            <Grid container spacing={4} justifyContent="center" textAlign="center">
                {[
                    { label: 'Active Patients', value: '15,000+' },
                    { label: 'Qualified Doctors', value: '500+' },
                    { label: 'Medical Operations', value: '1M+' },
                    { label: 'Hospital Networks', value: '50+' }
                ].map((stat, i) => (
                    <Grid item xs={6} md={3} key={i}>
                        <Typography variant="h3" fontWeight="bold" sx={{ color: '#4fc3f7' }}>{stat.value}</Typography>
                        <Typography variant="body1" sx={{ opacity: 0.8 }}>{stat.label}</Typography>
                    </Grid>
                ))}
            </Grid>
        </Container>
      </Box>

      {/* 4. Why Choose Us / Features */}
      <Container sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" color="primary" fontWeight="bold">OUR SERVICES</Typography>
            <Typography variant="h3" fontWeight="800" sx={{ color: '#2d3436' }}>Why Choose MedVault?</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
                We provide a comprehensive ecosystem for healthcare management, tailored to your needs.
            </Typography>
        </Box>

        <Grid container spacing={4}>
            {[
                { icon: <SecurityIcon fontSize="large" />, title: "Bank-Grade Security", desc: "Your data is protected with 256-bit AES encryption." },
                { icon: <SpeedIcon fontSize="large" />, title: "Instant Analytics", desc: "Real-time dashboards for better decision making." },
                { icon: <MedicalServicesIcon fontSize="large" />, title: "Telemedicine Ready", desc: "Built-in video consultation features for remote care." },
                { icon: <LocalHospitalIcon fontSize="large" />, title: "Inventory Management", desc: "Track medicine stocks and equipment effortlessly." },
                { icon: <EventAvailableIcon fontSize="large" />, title: "Smart Scheduling", desc: "AI-powered appointment booking system." },
                { icon: <VerifiedUserIcon fontSize="large" />, title: "Role-Based Access", desc: "Granular permissions for Admins, Doctors, and Staff." }
            ].map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <ServiceCard elevation={0}>
                        <Avatar sx={{ width: 60, height: 60, bgcolor: '#e3f2fd', color: '#1976d2', mx: 'auto', mb: 2 }}>
                            {feature.icon}
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>{feature.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{feature.desc}</Typography>
                    </ServiceCard>
                </Grid>
            ))}
        </Grid>
      </Container>

      {/* 5. Modern Call to Action (Curve Divider) */}
      <Box sx={{ position: 'relative', mt: 10 }}>
        {/* SVG Wave */}
        <Box component="svg" viewBox="0 0 1440 320" sx={{ display: 'block', mb: -1 }}>
            <path fill="#1976d2" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </Box>
        
        <Box sx={{ bgcolor: '#1976d2', color: 'white', py: 8, textAlign: 'center' }}>
            <Container maxWidth="md">
                <Typography variant="h3" fontWeight="bold" gutterBottom>Ready to Transform Your Hospital?</Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
                    Join 500+ hospitals that have switched to MedVault for smarter management.
                </Typography>
                <Button 
                    variant="contained" 
                    size="large" 
                    onClick={() => navigate('/register')}
                    sx={{ 
                        bgcolor: 'white', color: '#1976d2', borderRadius: 50, px: 6, py: 2, fontSize: '1.2rem', fontWeight: 'bold',
                        '&:hover': { bgcolor: '#f5f5f5', transform: 'scale(1.05)' } 
                    }}
                >
                    Get Started Now
                </Button>
            </Container>
        </Box>
      </Box>

      {/* 6. Footer */}
      <Box sx={{ bgcolor: '#0d1b2a', color: 'rgba(255,255,255,0.7)', py: 8 }}>
        <Container>
            <Grid container spacing={5}>
                <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocalHospitalIcon sx={{ color: '#4fc3f7', mr: 1 }} />
                        <Typography variant="h5" color="white" fontWeight="bold">MedVault</Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                        A next-generation Hospital Management System designed to simplify healthcare operations and improve patient outcomes.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {[FacebookIcon, TwitterIcon, LinkedInIcon, InstagramIcon].map((Icon, i) => (
                            <IconButton key={i} size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: '#1976d2' } }}>
                                <Icon />
                            </IconButton>
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={6} md={2}>
                    <Typography variant="subtitle1" color="white" fontWeight="bold" gutterBottom>Product</Typography>
                    {['Features', 'Pricing', 'Case Studies', 'Reviews', 'Updates'].map(item => (
                        <Typography key={item} variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#4fc3f7' } }}>{item}</Typography>
                    ))}
                </Grid>
                <Grid item xs={6} md={2}>
                    <Typography variant="subtitle1" color="white" fontWeight="bold" gutterBottom>Company</Typography>
                    {['About', 'Careers', 'Contact', 'Partners', 'Legal'].map(item => (
                        <Typography key={item} variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#4fc3f7' } }}>{item}</Typography>
                    ))}
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" color="white" fontWeight="bold" gutterBottom>Newsletter</Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>Subscribe to get the latest news and updates.</Typography>
                    <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <Box component="input" placeholder="Your email" style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', padding: '10px', outline: 'none' }} />
                        <IconButton type="button" sx={{ p: '10px', color: '#4fc3f7' }}>
                            <ArrowForwardIcon />
                        </IconButton>
                    </Paper>
                </Grid>
            </Grid>
            <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 6, pt: 3, textAlign: 'center' }}>
                <Typography variant="body2">© {new Date().getFullYear()} MedVault HMS. All rights reserved.</Typography>
            </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;