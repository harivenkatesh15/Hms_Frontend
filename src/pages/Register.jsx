import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper, Container, ToggleButton, ToggleButtonGroup, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [role, setRole] = useState('PATIENT');
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/register', { ...formData, role });
      setMessage({ type: 'success', text: 'Registration Successful! Waiting for Admin Approval.' });
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Registration Failed. Email might be in use.' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Container maxWidth="xs">
        <Paper elevation={10} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Join MedVault
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your account to get started
          </Typography>

          {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={(e, newRole) => { if(newRole) setRole(newRole); }}
            fullWidth
            sx={{ mb: 3 }}
          >
            <ToggleButton value="PATIENT">Patient</ToggleButton>
            <ToggleButton value="DOCTOR">Doctor</ToggleButton>
          </ToggleButtonGroup>

          <form onSubmit={handleSubmit}>
            <TextField fullWidth margin="normal" label="Full Name" name="fullName" onChange={handleChange} required />
            <TextField fullWidth margin="normal" label="Email Address" name="email" type="email" onChange={handleChange} required />
            <TextField fullWidth margin="normal" label="Password" name="password" type="password" onChange={handleChange} required />
            
            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, borderRadius: 2 }}>
              Register Now
            </Button>
          </form>
          
          <Button onClick={() => navigate('/login')} sx={{ mt: 2, textTransform: 'none' }}>
            Already have an account? Login
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;