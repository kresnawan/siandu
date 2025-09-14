import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People,
  MedicalServices,
  Vaccines,
  Schedule,
  HealthAndSafety,
  Logout
} from '@mui/icons-material';
import './Sidebar.css';

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear server-side session
      await fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    // Clear authentication data
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');

    // Redirect to login
    navigate('/login');
  };

  const menuItems = [
    {
      section: 'Utama',
      items: [
        { id: 'dashboard', icon: DashboardIcon, label: 'Dashboard', path: '/dashboard' }
      ]
    },
    {
      section: 'Manajemen Data',
      items: [
        { id: 'patients', icon: People, label: 'Data Pasien', path: '/dashboard/patients' },
        { id: 'kaders', icon: People, label: 'Data Kader', path: '/dashboard/kaders' }
      ]
    },
    {
      section: 'Layanan Kesehatan',
      items: [
        { id: 'examinations', icon: MedicalServices, label: 'Pemeriksaan', path: '/dashboard/examinations' },
        { id: 'vaccinations', icon: Vaccines, label: 'Vaksinasi', path: '/dashboard/vaccinations' },
        { id: 'schedule', icon: Schedule, label: 'Jadwal Pemeriksaan', path: '/dashboard/schedulevisit' }
      ]
    }
  ];

  // Determine active menu based on current path
  const getActiveMenu = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/dashboard/patients') return 'patients';
    if (path === '/dashboard/kaders') return 'kaders';
    if (path === '/dashboard/examinations') return 'examinations';
    if (path === '/dashboard/vaccinations') return 'vaccinations';
    if (path === '/dashboard/schedulevisit') return 'schedule';
    return 'dashboard';
  };

  const currentActiveMenu = getActiveMenu();

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <HealthAndSafety />
            </div>
            <div className="sidebar-logo-text">
              <h3>Siandu</h3>
              <p>Petugas Kesehatan</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="menu-section">
              <div className="menu-section-title">{section.section}</div>
              <ul className="menu-list">
                {section.items.map((item) => (
                  <li key={item.id} className="menu-item">
                    <a
                      href="#"
                      className={`menu-link ${currentActiveMenu === item.id ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (item.path) {
                          navigate(item.path);
                        } else {
                          setActiveMenu(item.id);
                        }
                      }}
                    >
                      <span className="menu-icon">
                        <item.icon />
                      </span>
                      <span className="menu-text">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Logout Section */}
          <div className="menu-section">
            <ul className="menu-list">
              <li className="menu-item">
                <a href="#" className="menu-link" onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}>
                  <span className="menu-icon">
                    <Logout />
                  </span>
                  <span className="menu-text">Keluar</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
