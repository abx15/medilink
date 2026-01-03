import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import SmoothScroll from './components/layout/SmoothScroll';

// Pages - Public
import Home from './pages/public/Home';
import EmergencyView from './pages/public/EmergencyView';
import QRScanner from './pages/public/QRScanner';

// Pages - User
import UserLogin from './pages/user/UserLogin';
import UserRegister from './pages/user/UserRegister';
import UserDashboard from './pages/user/UserDashboard';
import Profile from './pages/user/Profile';
import MedicalHistory from './pages/user/MedicalHistory';
import HealthCard from './pages/user/HealthCard';
import QRManagement from './pages/user/QRManagement';

// Pages - Doctor
import DoctorRegister from './pages/doctor/DoctorRegister';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import VerifyPatient from './pages/doctor/VerifyPatient';
import UpdateMedicalRecord from './pages/doctor/UpdateMedicalRecord';
import ActionHistory from './pages/doctor/ActionHistory';
import ManagePrescription from './pages/doctor/ManagePrescription';

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import HCPApproval from './pages/admin/HCPApproval';
import UserManagement from './pages/admin/UserManagement';
import GlobalNotifications from './pages/admin/GlobalNotifications';

// Placeholder Pages (Will build these next)
const Placeholder = ({ title }) => (
  <div className="p-8 text-center">
    <h1 className="text-3xl font-heading mb-4">{title}</h1>
    <p className="text-slate-500">Coming soon in the next step!</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <SmoothScroll>
            <div className="min-h-screen">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/emergency" element={<EmergencyView />} />
                <Route path="/scan" element={<QRScanner />} />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/register" element={<UserRegister />} />
                <Route path="/doctor/register" element={<DoctorRegister />} />

                {/* User Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['user']}>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={['user']}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute allowedRoles={['user']}>
                      <MedicalHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/health-card"
                  element={
                    <ProtectedRoute allowedRoles={['user']}>
                      <HealthCard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/qr-management"
                  element={
                    <ProtectedRoute allowedRoles={['user']}>
                      <QRManagement />
                    </ProtectedRoute>
                  }
                />

                {/* Doctor Routes */}
                <Route
                  path="/doctor/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/verify-patient"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <VerifyPatient />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/update-record"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <UpdateMedicalRecord />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/action-history"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <ActionHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/prescribe"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <ManagePrescription />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/approvals"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <HCPApproval />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/notifications"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <GlobalNotifications />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            <ToastContainer
              position="top-right"
              autoClose={5000}
              theme="colored"
            />
          </SmoothScroll>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
