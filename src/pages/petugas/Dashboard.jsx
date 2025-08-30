import React, { useState } from 'react';
import {
  Dashboard as DashboardIcon,
  People,
  Assignment,
  Schedule,
  Notifications,
  LocalHospital,
  Assessment,
  PersonAdd,
  EventNote,
  TrendingUp,
  AccessTime,
  CheckCircle,
  HealthAndSafety,
  Vaccines,
  MedicalServices,
  Report,
  Settings,
  Logout,
  MenuBook,
  Analytics,
  AccountCircle
} from '@mui/icons-material';
import './dashboard.css';

function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    {
      section: 'Utama',
      items: [
        { id: 'dashboard', icon: DashboardIcon, label: 'Dashboard', active: true },
        { id: 'analytics', icon: Analytics, label: 'Analitik' },
        { id: 'reports', icon: Report, label: 'Laporan' }
      ]
    },
    {
      section: 'Manajemen Pasien',
      items: [
        { id: 'patients', icon: People, label: 'Data Pasien' },
        { id: 'add-patient', icon: PersonAdd, label: 'Tambah Pasien' },
        { id: 'medical-records', icon: MenuBook, label: 'Rekam Medis' }
      ]
    },
    {
      section: 'Layanan Kesehatan',
      items: [
        { id: 'health-services', icon: MedicalServices, label: 'Layanan Kesehatan' },
        { id: 'vaccinations', icon: Vaccines, label: 'Vaksinasi' },
        { id: 'appointments', icon: EventNote, label: 'Jadwal Kunjungan' },
        { id: 'emergency', icon: LocalHospital, label: 'Darurat' }
      ]
    },
    {
      section: 'Administrasi',
      items: [
        { id: 'schedule', icon: Schedule, label: 'Jadwal Kerja' },
        { id: 'inventory', icon: Assignment, label: 'Inventaris' },
        { id: 'settings', icon: Settings, label: 'Pengaturan' }
      ]
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
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
                        className={`menu-link ${activeMenu === item.id ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveMenu(item.id);
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
                  <a href="#" className="menu-link">
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
          {/* Welcome Header */}
          <section className="dashboard-header">
            <div className="container">
              <div className="dashboard-welcome">
                <h1 className="welcome-title">
                  Selamat Datang, Petugas Kesehatan
                </h1>
                <p className="welcome-subtitle">
                  Kelola layanan kesehatan masyarakat dengan mudah dan efisien melalui dashboard ini
                </p>
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="stats-section">
            <div className="container">
              <h2 className="section-title">Ringkasan Hari Ini</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <People />
                  </div>
                  <div className="stat-value">247</div>
                  <div className="stat-label">Total Pasien</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <LocalHospital />
                  </div>
                  <div className="stat-value">42</div>
                  <div className="stat-label">Kunjungan Hari Ini</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Vaccines />
                  </div>
                  <div className="stat-value">18</div>
                  <div className="stat-label">Vaksinasi Hari Ini</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Assessment />
                  </div>
                  <div className="stat-value">95%</div>
                  <div className="stat-label">Tingkat Kepuasan</div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions Section */}
          <section className="actions-section">
            <div className="container">
              <h2 className="section-title">Aksi Cepat</h2>
              <div className="actions-container">
                <div className="action-card">
                  <div className="action-icon">
                    <PersonAdd />
                  </div>
                  <h3 className="action-title">Daftar Pasien Baru</h3>
                  <p className="action-description">
                    Tambahkan data pasien baru ke dalam sistem kesehatan
                  </p>
                  <a href="#" className="action-button">Daftar Pasien</a>
                </div>
                <div className="action-card">
                  <div className="action-icon">
                    <EventNote />
                  </div>
                  <h3 className="action-title">Jadwalkan Vaksinasi</h3>
                  <p className="action-description">
                    Atur jadwal vaksinasi untuk masyarakat
                  </p>
                  <a href="#" className="action-button">Buat Jadwal</a>
                </div>
                <div className="action-card">
                  <div className="action-icon">
                    <MedicalServices />
                  </div>
                  <h3 className="action-title">Layanan Kesehatan</h3>
                  <p className="action-description">
                    Kelola layanan kesehatan dan pemeriksaan rutin
                  </p>
                  <a href="#" className="action-button">Kelola Layanan</a>
                </div>
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="content-section">
            <div className="container">
              <div className="main-content">
                <h3 className="content-title">Aktivitas Terbaru</h3>

                {/* Chart Placeholder */}
                <div className="chart-placeholder">
                  <div className="chart-placeholder-content">
                    <div className="chart-placeholder-icon">
                      <TrendingUp />
                    </div>
                    <div className="chart-placeholder-text">
                      Grafik Statistik Kunjungan
                    </div>
                  </div>
                </div>

                {/* Activity List */}
                <ul className="activity-list">
                  <li className="activity-item">
                    <div className="activity-icon">
                      <PersonAdd />
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">Pasien Baru Terdaftar</div>
                      <div className="activity-description">
                        Ahmad Surya telah mendaftar sebagai pasien baru
                      </div>
                    </div>
                    <div className="activity-time">2 jam lalu</div>
                  </li>
                  <li className="activity-item">
                    <div className="activity-icon">
                      <LocalHospital />
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">Pemeriksaan Rutin Selesai</div>
                      <div className="activity-description">
                        Pemeriksaan kesehatan rutin untuk 15 pasien telah selesai
                      </div>
                    </div>
                    <div className="activity-time">4 jam lalu</div>
                  </li>
                  <li className="activity-item">
                    <div className="activity-icon">
                      <Vaccines />
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">Vaksinasi COVID-19</div>
                      <div className="activity-description">
                        8 orang telah menerima vaksinasi dosis kedua
                      </div>
                    </div>
                    <div className="activity-time">6 jam lalu</div>
                  </li>
                  <li className="activity-item">
                    <div className="activity-icon">
                      <CheckCircle />
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">Laporan Harian Selesai</div>
                      <div className="activity-description">
                        Laporan kesehatan harian telah berhasil dibuat dan dikirim
                      </div>
                    </div>
                    <div className="activity-time">1 hari lalu</div>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;