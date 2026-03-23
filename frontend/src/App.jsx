import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ContentManagement from './pages/admin/ContentManagement';
import AuditLogs from './pages/admin/AuditLogs';
import SystemHealth from './pages/admin/SystemHealth';
import ParentDashboard from './components/ParentDashboard';
import DashboardOverview from './pages/parent/DashboardOverview';
import Children from './pages/parent/Children';
import Vaccinations from './pages/parent/Vaccinations';
import Reminders from './pages/parent/Reminders';
import MedicalRecords from './pages/parent/MedicalRecords';
import Growth from './pages/parent/Growth';
import Nutrition from './pages/parent/Nutrition';
import Appointments from './pages/parent/Appointments';
import Emergency from './pages/parent/Emergency';
import Settings from './pages/parent/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isParentDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="App min-h-screen flex flex-col bg-white">
      {!isAuthPage && !isAdminPage && !isParentDashboard && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Parent Dashboard Routes - Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireParent={true}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="children" element={<Children />} />
            <Route path="vaccinations" element={<Vaccinations />} />
            <Route path="reminders" element={<Reminders />} />
            <Route path="medical" element={<MedicalRecords />} />
            <Route path="growth" element={<Growth />} />
            <Route path="nutrition" element={<Nutrition />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="emergency" element={<Emergency />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Admin Routes - Protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="logs" element={<AuditLogs />} />
            <Route path="system" element={<SystemHealth />} />
          </Route>
        </Routes>
      </main>
      {!isAuthPage && !isAdminPage && !isParentDashboard && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App