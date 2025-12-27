import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProviderWrapper } from './context/ThemeContext'; 
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
import AdminVerifications from './pages/AdminVerifications';
import Profile from './pages/Profile';
import MedicalRecords from './pages/MedicalRecords';

// 👇 DOCTOR PAGES
import MySchedule from './pages/doctor/MySchedule';
import MyPatients from './pages/doctor/MyPatients';

// 👇 PATIENT PAGES
import BookAppointment from './pages/BookAppointment';
import DocumentPermissions from './pages/patient/DocumentPermissions'; 
import MyAppointments from './pages/patient/MyAppointments'; // ✅ NEW IMPORT

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
      <ThemeProviderWrapper>
        <Router>
            <Routes>
              {/* --- PUBLIC ROUTES --- */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />

              {/* --- SHARED PRIVATE ROUTES --- */}
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              
              {/* --- PATIENT ROUTES --- */}
              <Route path="/patient/dashboard" element={<PrivateRoute requiredRole="PATIENT"><PatientDashboard /></PrivateRoute>} />
              <Route path="/medical-records" element={<PrivateRoute requiredRole="PATIENT"><MedicalRecords /></PrivateRoute>} />
              <Route path="/patient/book-appointment" element={<PrivateRoute requiredRole="PATIENT"><BookAppointment /></PrivateRoute>} />
              <Route path="/patient/permissions" element={<PrivateRoute requiredRole="PATIENT"><DocumentPermissions /></PrivateRoute>} />
              
              {/* ✅ NEW: MY APPOINTMENTS ROUTE */}
              <Route path="/patient/my-appointments" element={<PrivateRoute requiredRole="PATIENT"><MyAppointments /></PrivateRoute>} />

              {/* --- ADMIN ROUTES --- */}
              <Route path="/admin-dashboard" element={<PrivateRoute requiredRole="ADMIN"><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin-verifications" element={<PrivateRoute requiredRole="ADMIN"><AdminVerifications /></PrivateRoute>} />
              <Route path="/admin-doctors" element={<PrivateRoute requiredRole="ADMIN"><AdminDoctors /></PrivateRoute>} />
              <Route path="/admin-users" element={<PrivateRoute requiredRole="ADMIN"><AdminUsers /></PrivateRoute>} />

              {/* --- DOCTOR ROUTES --- */}
              <Route path="/doctor-dashboard" element={<PrivateRoute requiredRole="DOCTOR"><DoctorDashboard /></PrivateRoute>} />
              <Route path="/doctor/schedule" element={<PrivateRoute requiredRole="DOCTOR"><MySchedule /></PrivateRoute>} />
              <Route path="/doctor/patients" element={<PrivateRoute requiredRole="DOCTOR"><MyPatients /></PrivateRoute>} />

              {/* --- PLACEHOLDERS (Future Features) --- */}
              <Route path="/prescriptions" element={<Placeholder title="Prescriptions" />} />
              <Route path="/billing" element={<Placeholder title="Billing" />} />
              <Route path="/chat" element={<Placeholder title="Chat" />} />
              <Route path="/settings" element={<Placeholder title="Settings" />} />
              
              {/* Redirects/Legacy Paths */}
              <Route path="/patient-dashboard" element={<PrivateRoute requiredRole="PATIENT"><PatientDashboard /></PrivateRoute>} /> 
              {/* Mapped old path to new component just in case */}
              <Route path="/appointments" element={<PrivateRoute requiredRole="PATIENT"><MyAppointments /></PrivateRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Login />} />
            </Routes>
        </Router>
      </ThemeProviderWrapper>
    </AuthProvider>
  );
}

export default App;