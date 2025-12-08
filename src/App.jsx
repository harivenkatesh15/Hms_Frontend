import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProviderWrapper } from './context/ThemeContext'; // Import the new wrapper
import CompleteProfile from './pages/CompleteProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/home'; 
import AdminDoctors from './pages/AdminDoctors';
import AdminUsers from './pages/AdminUsers';

// Placeholder Component
const Placeholder = ({ title }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', opacity: 0.7 }}>
        <h2>{title} Page</h2>
        <p>This feature is under development.</p>
        <button onClick={() => window.history.back()} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>Go Back</button>
    </div>
);

function App() {
  return (
    <AuthProvider>
      <ThemeProviderWrapper> {/* WRAP HERE */}
        <Router>
            <Routes>
            <Route path="/complete-profile" element={<CompleteProfile />} />
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/admin-dashboard" element={<PrivateRoute requiredRole="ADMIN"><AdminDashboard /></PrivateRoute>} />
            <Route path="/doctor-dashboard" element={<PrivateRoute requiredRole="DOCTOR"><DoctorDashboard /></PrivateRoute>} />
            <Route path="/patient-dashboard" element={<PrivateRoute requiredRole="PATIENT"><PatientDashboard /></PrivateRoute>} />

            {/* Admin Sub-Pages */}
            <Route path="/admin-doctors" element={<PrivateRoute requiredRole="ADMIN"><AdminDoctors /></PrivateRoute>} />
            <Route path="/admin-users" element={<PrivateRoute requiredRole="ADMIN"><AdminUsers /></PrivateRoute>} />

            {/* Placeholders */}
            <Route path="/appointments" element={<Placeholder title="Appointments" />} />
            <Route path="/prescriptions" element={<Placeholder title="Prescriptions" />} />
            <Route path="/medical-records" element={<Placeholder title="Medical Records" />} />
            <Route path="/billing" element={<Placeholder title="Billing" />} />
            <Route path="/chat" element={<Placeholder title="Chat" />} />
            <Route path="/settings" element={<Placeholder title="Settings" />} />
            <Route path="/book-appointment" element={<Placeholder title="Book Appointment" />} />
            <Route path="/my-appointments" element={<Placeholder title="My Appointments" />} />
            <Route path="/doctor-patients" element={<Placeholder title="My Patients" />} />
            <Route path="/doctor-schedule" element={<Placeholder title="Doctor Schedule" />} />

            <Route path="*" element={<Login />} />
            </Routes>
        </Router>
      </ThemeProviderWrapper>
    </AuthProvider>
  );
}

export default App;