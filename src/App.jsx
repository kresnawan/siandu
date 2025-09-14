import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FAQPage from './pages/FAQPage';
import './styles/global.css';
import Dashboard from './pages/petugas/Dashboard';
import DataPasien from './pages/petugas/DataPasien';
import DataKader from './pages/petugas/DataKader';
import PemeriksaanKesehatan from './pages/petugas/PemeriksaanKesehatan';
import VaccinationPage from './pages/petugas/VaccinationPage';
import JadwalPemeriksaan from './pages/petugas/JadwalPemeriksaan';


function AppLayout() {
  const location = useLocation();

  // Check if current path starts with /dashboard
  const isDashboard = location.pathname.startsWith("/dashboard");

  if (isDashboard) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/patients" element={<DataPasien />} />
          <Route path="/dashboard/kaders" element={<DataKader />} />
          <Route path="/dashboard/examinations" element={<PemeriksaanKesehatan />} />
          <Route path="/dashboard/vaccinations" element={<VaccinationPage />} />
          <Route path="/dashboard/schedulevisit" element={<JadwalPemeriksaan />} />
        </Routes>
      </ProtectedRoute>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/faq" element={<FAQPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
