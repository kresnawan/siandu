import React, { useState, useEffect } from 'react';
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
  AccountCircle,
  Add,
  Edit,
  Delete,
  LocationOn,
  Event,
  Description,
  Group,
  Cancel
} from '@mui/icons-material';
import useApi from '../../hooks/useApi';
import './VaccinationPage.css';

function VaccinationPage() {
  const { get, post, delete: deleteApi, loading, error, clearError } = useApi();
  const [activeMenu, setActiveMenu] = useState('vaccinations');
  const [vaccinations, setVaccinations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    vaccineType: '',
    maxParticipants: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const menuItems = [
    {
      section: 'Utama',
      items: [
        { id: 'dashboard', icon: DashboardIcon, label: 'Dashboard', path: '/dashboard' },
        { id: 'analytics', icon: Analytics, label: 'Analitik' },
        { id: 'reports', icon: Report, label: 'Laporan' }
      ]
    },
    {
      section: 'Manajemen Kader',
      items: [
        { id: 'kaders', icon: People, label: 'Data Kader', path: '/dashboard/kaders' },
        { id: 'add-kader', icon: PersonAdd, label: 'Tambah Kader' },
        { id: 'kader-training', icon: MenuBook, label: 'Pelatihan Kader' }
      ]
    },
    {
      section: 'Manajemen Pasien',
      items: [
        { id: 'patients', icon: People, label: 'Data Pasien', path: '/dashboard/patients' },
        { id: 'add-patient', icon: PersonAdd, label: 'Tambah Pasien' },
        { id: 'medical-records', icon: MenuBook, label: 'Rekam Medis' }
      ]
    },
    {
      section: 'Pemeriksaan Kesehatan',
      items: [
        { id: 'examinations', icon: MedicalServices, label: 'Pemeriksaan', path: '/dashboard/examinations' },
        { id: 'add-examination', icon: PersonAdd, label: 'Tambah Pemeriksaan' },
        { id: 'monthly-reports', icon: Assessment, label: 'Laporan Bulanan' }
      ]
    },
    {
      section: 'Layanan Kesehatan',
      items: [
        { id: 'health-services', icon: MedicalServices, label: 'Layanan Kesehatan' },
        { id: 'vaccinations', icon: Vaccines, label: 'Vaksinasi', active: true },
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

  useEffect(() => {
    loadVaccinations();
  }, []);

  const loadVaccinations = async () => {
    try {
      clearError();
      const response = await get('/api/vaccinations');
      setVaccinations(response || []);
    } catch (err) {
      console.error('Error loading vaccinations:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      clearError();
      await post('/api/vaccinations', formData);
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        vaccineType: '',
        maxParticipants: ''
      });
      setShowForm(false);
      loadVaccinations();
      setSuccessMessage('Jadwal vaksinasi berhasil ditambahkan');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error adding vaccination:', err);
    }
  };

  const handleDeleteVaccination = async (vaccinationId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal vaksinasi ini?')) {
      try {
        clearError();
        await deleteApi(`/api/vaccinations/${vaccinationId}`);
        setVaccinations(vaccinations.filter(v => v.id !== vaccinationId));
        setSuccessMessage('Jadwal vaksinasi berhasil dihapus');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Error deleting vaccination:', err);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const viewInterestedUsers = async (vaccination) => {
    try {
      clearError();
      const response = await get(`/api/vaccinations/${vaccination.id}`);
      setSelectedVaccination(response);
    } catch (err) {
      console.error('Error loading interested users:', err);
    }
  };

  const closeModal = () => {
    setSelectedVaccination(null);
  };

  return (
    <div className="vaccination-page">
      <div className="vaccination-container">
        {/* Sidebar */}
        <aside className="vaccination-sidebar">
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
                          if (item.path) {
                            window.location.href = item.path;
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
        <main className="vaccination-main">
          {/* Success/Error Messages */}
          {(successMessage || error) && (
            <section className="message-section">
              <div className="container">
                {successMessage && (
                  <div className="message success-message">
                    <CheckCircle />
                    <span>{successMessage}</span>
                  </div>
                )}
                {error && (
                  <div className="message error-message">
                    <Cancel />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Header */}
          <section className="vaccination-header">
            <div className="container">
              <div className="header-content">
                <h1 className="page-title">Manajemen Vaksinasi</h1>
                <p className="page-subtitle">
                  Kelola jadwal vaksinasi dan pantau minat masyarakat
                </p>
                <button
                  className="add-vaccination-btn"
                  onClick={() => setShowForm(true)}
                >
                  <Add />
                  Tambah Jadwal Vaksinasi
                </button>
              </div>
            </div>
          </section>

        {/* Add Vaccination Form */}
        {showForm && (
          <div className="vaccination-form-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Tambah Jadwal Vaksinasi Baru</h2>
                <button className="close-btn" onClick={() => setShowForm(false)}>
                  <Cancel />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="vaccination-form">
                <div className="form-group">
                  <label>Judul Vaksinasi</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tanggal Vaksinasi</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Jenis Vaksin</label>
                    <select
                      name="vaccineType"
                      value={formData.vaccineType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Pilih jenis vaksin</option>
                      <option value="COVID-19">COVID-19</option>
                      <option value="Influenza">Influenza</option>
                      <option value="Hepatitis B">Hepatitis B</option>
                      <option value="DTP">DTP</option>
                      <option value="Polio">Polio</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Lokasi</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Maksimal Peserta</label>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">
                    Batal
                  </button>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Vaccinations List */}
        <div className="vaccinations-list">
          <h2>Daftar Jadwal Vaksinasi</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          <div className="vaccinations-grid">
            {vaccinations.map(vaccination => (
              <div key={vaccination.id} className="vaccination-card">
                <div className="vaccination-card-header">
                  <h3>{vaccination.title}</h3>
                  <div className="vaccination-status">
                    <span className={`status ${vaccination.status.toLowerCase()}`}>
                      {vaccination.status}
                    </span>
                  </div>
                </div>
                <div className="vaccination-card-content">
                  <div className="vaccination-info">
                    <div className="info-item">
                      <Vaccines />
                      <span>{vaccination.vaccineType}</span>
                    </div>
                    <div className="info-item">
                      <Description />
                      <span>{vaccination.description}</span>
                    </div>
                    <div className="info-item">
                      <Event />
                      <span>{vaccination.date}</span>
                    </div>
                    <div className="info-item">
                      <LocationOn />
                      <span>{vaccination.location}</span>
                    </div>
                    <div className="info-item">
                      <Group />
                      <span>{vaccination.interestedCount}/{vaccination.maxParticipants} peserta</span>
                    </div>
                  </div>
                </div>
                <div className="vaccination-card-actions">
                  <button
                    className="view-interested-btn"
                    onClick={() => viewInterestedUsers(vaccination)}
                  >
                    <People />
                    Lihat Minat ({vaccination.interestedCount})
                  </button>
                  <button
                    className="delete-vaccination-btn"
                    onClick={() => handleDeleteVaccination(vaccination.id)}
                  >
                    <Delete />
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interested Users Modal */}
        {selectedVaccination && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Orang yang Berminat: {selectedVaccination.title}</h2>
                <button className="close-btn" onClick={closeModal}>
                  <Cancel />
                </button>
              </div>
              <div className="interested-users-list">
                {selectedVaccination.interestedUsers && selectedVaccination.interestedUsers.length > 0 ? (
                  selectedVaccination.interestedUsers.map(user => (
                    <div key={user.id} className="user-item">
                      <div className="user-info">
                        <h4>{user.name}</h4>
                        <p>{user.email} | {user.phone}</p>
                      </div>
                      <div className="user-status">
                        <CheckCircle />
                        <span>Berminat</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Belum ada orang yang berminat.</p>
                )}
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  );
}

export default VaccinationPage;