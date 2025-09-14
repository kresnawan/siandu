import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Search,
  FilterList,
  Add,
  Edit,
  Delete,
  Visibility,
  Person,
  Phone,
  Email,
  LocationOn,
  CalendarToday,
  MoreVert,
  Error,
  CheckCircle as SuccessIcon,
  Home,
  Event,
  Schedule as ScheduleIcon,
  Today,
  DateRange,
  ChevronLeft,
  ChevronRight,
  Group,
  LocalPharmacy,
  Warning,
  Info
} from '@mui/icons-material';
import './VaccinationPage.css';
import useApi from '../../hooks/useApi';
import Sidebar from '../../components/Sidebar';

const VaccinationModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

function VaccinationPage() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('vaccinations');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [vaccinations, setVaccinations] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedVaccination, setSelectedVaccination] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    vaccine_type: '',
    max_participants: '',
    status: 'active'
  });
  const [registrationData, setRegistrationData] = useState({
    vaccination_id: '',
    patient_id: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const { loading, error, get, post, put, delete: del, clearError } = useApi();

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
        { id: 'vaccinations', icon: Vaccines, label: 'Vaksinasi', path: '/dashboard/vaccinations', active: true },
        { id: 'schedule', icon: Schedule, label: 'Jadwal Pemeriksaan', path: '/dashboard/schedulevisit' }
      ]
    }
  ];

  // Load vaccinations and patients data on component mount
  useEffect(() => {
    loadVaccinations();
    loadPatients();
  }, []);

  const loadVaccinations = async () => {
    try {
      clearError();
      const data = await get('/api/vaccinations');
      setVaccinations(data || []);
    } catch (err) {
      console.error('Error loading vaccinations:', err);
    }
  };

  const loadPatients = async () => {
    try {
      clearError();
      const data = await get('/patients');
      setPatients(data || []);
    } catch (err) {
      console.error('Error loading patients:', err);
    }
  };

  // Filter vaccinations based on search term and status filter
  const filteredVaccinations = vaccinations.filter(vaccination => {
    const matchesSearch = !searchTerm.trim() || 
      (vaccination.title && vaccination.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vaccination.location && vaccination.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vaccination.vaccine_type && vaccination.vaccine_type.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || vaccination.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleViewVaccination = (vaccination) => {
    setSelectedVaccination(vaccination);
    setShowViewModal(true);
  };

  const handleEditVaccination = (vaccination) => {
    setSelectedVaccination(vaccination);
    setFormData({
      title: vaccination.title || '',
      description: vaccination.description || '',
      date: vaccination.date ? vaccination.date.split('T')[0] : '',
      location: vaccination.location || '',
      vaccine_type: vaccination.vaccine_type || '',
      max_participants: vaccination.max_participants || '',
      status: vaccination.status || 'active'
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDeleteVaccination = async (vaccinationId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal vaksinasi ini?')) {
      try {
        clearError();
        await del(`/api/vaccinations/${vaccinationId}`);
        setVaccinations(vaccinations.filter(v => v.id !== vaccinationId));
        setSuccessMessage('Jadwal vaksinasi berhasil dihapus');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Error deleting vaccination:', err);
      }
    }
  };

  const handleAddVaccination = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      vaccine_type: '',
      max_participants: '',
      status: 'active'
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleRegisterPatient = (vaccination) => {
    setSelectedVaccination(vaccination);
    setRegistrationData({
      vaccination_id: vaccination.id,
      patient_id: ''
    });
    setShowRegisterModal(true);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleRegistrationChange = (field, value) => {
    setRegistrationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Judul vaksinasi harus diisi';
    if (!formData.date) errors.date = 'Tanggal vaksinasi harus diisi';
    if (!formData.location.trim()) errors.location = 'Lokasi harus diisi';
    if (!formData.vaccine_type.trim()) errors.vaccine_type = 'Jenis vaksin harus diisi';
    if (!formData.max_participants || formData.max_participants <= 0) errors.max_participants = 'Maksimal peserta harus diisi';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegistration = () => {
    const errors = {};
    
    if (!registrationData.patient_id) errors.patient_id = 'Pilih pasien terlebih dahulu';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitVaccination = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    try {
      clearError();
      const response = await post('/api/vaccinations', {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        vaccineType: formData.vaccine_type,
        maxParticipants: parseInt(formData.max_participants),
        status: formData.status
      });
      
      setVaccinations(prev => [...prev, response]);
      setShowAddModal(false);
      setSuccessMessage('Jadwal vaksinasi berhasil ditambahkan');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error adding vaccination:', err);
    }
  };

  const handleUpdateVaccination = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    try {
      clearError();
      const response = await put(`/api/vaccinations/${selectedVaccination.id}`, {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        vaccineType: formData.vaccine_type,
        maxParticipants: parseInt(formData.max_participants),
        status: formData.status
      });

      setVaccinations(prev => prev.map(v => v.id === selectedVaccination.id ? response : v));
      setShowEditModal(false);
      setSuccessMessage('Jadwal vaksinasi berhasil diperbarui');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating vaccination:', err);
    }
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateRegistration()) {
      return;
    }

    try {
      clearError();
      await post(`/api/vaccinations/${registrationData.vaccination_id}/register`, {
        userId: parseInt(registrationData.patient_id)
      });
      
      setShowRegisterModal(false);
      setSuccessMessage('Pasien berhasil didaftarkan untuk vaksinasi');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error registering patient:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'active';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      default: return 'active';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return 'Aktif';
    }
  };

  const getUpcomingVaccinations = () => {
    const today = new Date();
    return vaccinations.filter(vaccination => {
      const vaccinationDate = new Date(vaccination.date);
      return vaccinationDate >= today && vaccination.status === 'active';
    }).slice(0, 5);
  };

  return (
    <Sidebar>
    <div className="vaccination-page">
      <div className="vaccination-container">
        {/* Main Content */}
        <main className="vaccination-main">
          {/* Header */}
          <section className="vaccination-header">
            <div className="container">
              <div className="header-content">
                <h1 className="page-title">Vaksinasi</h1>
                <p className="page-subtitle">
                  Kelola jadwal vaksinasi dan daftarkan pasien untuk program vaksinasi
                </p>
              </div>
            </div>
          </section>

          {/* Success/Error Messages */}
          {(successMessage || error) && (
            <section className="message-section">
              <div className="container">
                {successMessage && (
                  <div className="message success-message">
                    <SuccessIcon />
                    <span>{successMessage}</span>
                  </div>
                )}
                {error && (
                  <div className="message error-message">
                    <Error />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Stats Section */}
          <section className="stats-section">
            <div className="container">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <Vaccines />
                  </div>
                  <div className="stat-value">{vaccinations.length}</div>
                  <div className="stat-label">Total Vaksinasi</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Today />
                  </div>
                  <div className="stat-value">
                    {vaccinations.filter(v => v.status === 'active').length}
                  </div>
                  <div className="stat-label">Aktif</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <CheckCircle />
                  </div>
                  <div className="stat-value">
                    {vaccinations.filter(v => v.status === 'completed').length}
                  </div>
                  <div className="stat-label">Selesai</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Group />
                  </div>
                  <div className="stat-value">
                    {vaccinations.reduce((sum, v) => sum + (v.max_participants || 0), 0)}
                  </div>
                  <div className="stat-label">Total Kapasitas</div>
                </div>
              </div>
            </div>
          </section>

          {/* Vaccination Management Section */}
          <section className="vaccination-management-section">
            <div className="container">
              <div className="management-header">
                <h2 className="section-title">Daftar Jadwal Vaksinasi</h2>
                <button className="btn-add-vaccination" onClick={handleAddVaccination}>
                  <Add />
                  Tambah Jadwal Vaksinasi
                </button>
              </div>

              {/* Search and Filter */}
              <div className="search-filter-container">
                <div className="search-box">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan judul, lokasi, atau jenis vaksin..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="filter-box">
                  <FilterList className="filter-icon" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                </div>
              </div>

              {/* Vaccination Table */}
              <div className="vaccination-table-container">
                {loading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Memuat data vaksinasi...</p>
                  </div>
                ) : (
                  <div className="vaccination-table-wrapper">
                    <table className="vaccination-table">
                      <thead>
                        <tr>
                          <th>Judul</th>
                          <th>Tanggal</th>
                          <th>Lokasi</th>
                          <th>Jenis Vaksin</th>
                          <th>Kapasitas</th>
                          <th>Status</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVaccinations.map((vaccination) => (
                          <tr key={vaccination.id}>
                            <td>
                              <div className="vaccination-info">
                                <div className="vaccination-title">{vaccination.title}</div>
                                <div className="vaccination-description">{vaccination.description}</div>
                              </div>
                            </td>
                            <td>
                              <div className="vaccination-date">
                                <CalendarToday fontSize="small" />
                                {new Date(vaccination.date).toLocaleDateString('id-ID')}
                              </div>
                            </td>
                            <td>
                              <div className="vaccination-location">
                                <LocationOn fontSize="small" />
                                {vaccination.location}
                              </div>
                            </td>
                            <td>
                              <div className="vaccine-type">
                                <LocalPharmacy fontSize="small" />
                                {vaccination.vaccine_type}
                              </div>
                            </td>
                            <td>
                              <div className="capacity-info">
                                <Group fontSize="small" />
                                {vaccination.max_participants} orang
                              </div>
                            </td>
                            <td>
                              <span className={`status-badge ${getStatusColor(vaccination.status)}`}>
                                {getStatusText(vaccination.status)}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="action-btn view"
                                  onClick={() => handleViewVaccination(vaccination)}
                                  title="Lihat Detail"
                                >
                                  <Visibility />
                                </button>
                                <button
                                  className="action-btn edit"
                                  onClick={() => handleEditVaccination(vaccination)}
                                  title="Edit"
                                >
                                  <Edit />
                                </button>
                                {vaccination.status === 'active' && (
                                  <button
                                    className="action-btn register"
                                    onClick={() => handleRegisterPatient(vaccination)}
                                    title="Daftarkan Pasien"
                                  >
                                    <PersonAdd />
                                  </button>
                                )}
                                <button
                                  className="action-btn delete"
                                  onClick={() => handleDeleteVaccination(vaccination.id)}
                                  title="Hapus"
                                >
                                  <Delete />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {filteredVaccinations.length === 0 && (
                      <div className="no-data">
                        <Vaccines fontSize="large" />
                        <p>Tidak ada jadwal vaksinasi ditemukan</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>

      {/* View Vaccination Modal */}
      <VaccinationModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Detail Jadwal Vaksinasi"
      >
        {selectedVaccination && (
          <div className="vaccination-detail">
            <div className="vaccination-detail-header">
              <div className="vaccination-icon-large">
                <Vaccines />
                  </div>
              <div>
                <h3>{selectedVaccination.title}</h3>
                <p>{selectedVaccination.vaccine_type}</p>
                <span className={`status-badge ${getStatusColor(selectedVaccination.status)}`}>
                  {getStatusText(selectedVaccination.status)}
                </span>
                  </div>
                </div>

            <div className="vaccination-detail-grid">
              <div className="detail-item">
                <label>Tanggal Vaksinasi</label>
                <p>{new Date(selectedVaccination.date).toLocaleDateString('id-ID')}</p>
              </div>
              <div className="detail-item">
                <label>Lokasi</label>
                <p>{selectedVaccination.location}</p>
              </div>
              <div className="detail-item">
                <label>Jenis Vaksin</label>
                <p>{selectedVaccination.vaccine_type}</p>
              </div>
              <div className="detail-item">
                <label>Kapasitas Maksimal</label>
                <p>{selectedVaccination.max_participants} orang</p>
              </div>
              <div className="detail-item full-width">
                <label>Deskripsi</label>
                <p>{selectedVaccination.description || 'Tidak ada deskripsi'}</p>
                </div>
            </div>
              </div>
        )}
      </VaccinationModal>

      {/* Add Vaccination Modal */}
      <VaccinationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Tambah Jadwal Vaksinasi"
      >
        <form className="vaccination-form" onSubmit={handleSubmitVaccination}>
          <div className="form-grid">
                <div className="form-group">
              <label>Judul Vaksinasi *</label>
                  <input
                    type="text"
                    value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="Contoh: Vaksinasi COVID-19 Dosis 1"
                className={formErrors.title ? 'error' : ''}
                  />
              {formErrors.title && <span className="error-message">{formErrors.title}</span>}
                </div>
                <div className="form-group">
              <label>Tanggal Vaksinasi *</label>
                    <input
                      type="date"
                      value={formData.date}
                onChange={(e) => handleFormChange('date', e.target.value)}
                className={formErrors.date ? 'error' : ''}
              />
              {formErrors.date && <span className="error-message">{formErrors.date}</span>}
                </div>
            <div className="form-group">
              <label>Lokasi *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleFormChange('location', e.target.value)}
                placeholder="Contoh: Puskesmas Kecamatan"
                className={formErrors.location ? 'error' : ''}
              />
              {formErrors.location && <span className="error-message">{formErrors.location}</span>}
                  </div>
                  <div className="form-group">
              <label>Jenis Vaksin *</label>
                    <select
                value={formData.vaccine_type}
                onChange={(e) => handleFormChange('vaccine_type', e.target.value)}
                className={formErrors.vaccine_type ? 'error' : ''}
              >
                <option value="">Pilih Jenis Vaksin</option>
                      <option value="COVID-19">COVID-19</option>
                <option value="BCG">BCG</option>
                <option value="DPT">DPT</option>
                      <option value="Hepatitis B">Hepatitis B</option>
                      <option value="Polio">Polio</option>
                <option value="Campak">Campak</option>
                <option value="Influenza">Influenza</option>
                <option value="Lainnya">Lainnya</option>
                    </select>
              {formErrors.vaccine_type && <span className="error-message">{formErrors.vaccine_type}</span>}
                  </div>
                  <div className="form-group">
              <label>Kapasitas Maksimal *</label>
                    <input
                      type="number"
                value={formData.max_participants}
                onChange={(e) => handleFormChange('max_participants', e.target.value)}
                placeholder="50"
                      min="1"
                className={formErrors.max_participants ? 'error' : ''}
              />
              {formErrors.max_participants && <span className="error-message">{formErrors.max_participants}</span>}
                    </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
              >
                <option value="active">Aktif</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
                    </div>
            <div className="form-group full-width">
              <label>Deskripsi</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Masukkan informasi tambahan tentang vaksinasi..."
              ></textarea>
                  </div>
                </div>
                <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                    Batal
                  </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Jadwal'}
                  </button>
                </div>
              </form>
      </VaccinationModal>

      {/* Edit Vaccination Modal */}
      <VaccinationModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Jadwal Vaksinasi"
      >
        {selectedVaccination && (
          <form className="vaccination-form" onSubmit={handleUpdateVaccination}>
            <div className="form-grid">
              <div className="form-group">
                <label>Judul Vaksinasi *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  className={formErrors.title ? 'error' : ''}
                />
                {formErrors.title && <span className="error-message">{formErrors.title}</span>}
                  </div>
              <div className="form-group">
                <label>Tanggal Vaksinasi *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  className={formErrors.date ? 'error' : ''}
                />
                {formErrors.date && <span className="error-message">{formErrors.date}</span>}
                </div>
              <div className="form-group">
                <label>Lokasi *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                  className={formErrors.location ? 'error' : ''}
                />
                {formErrors.location && <span className="error-message">{formErrors.location}</span>}
                    </div>
              <div className="form-group">
                <label>Jenis Vaksin *</label>
                <select
                  value={formData.vaccine_type}
                  onChange={(e) => handleFormChange('vaccine_type', e.target.value)}
                  className={formErrors.vaccine_type ? 'error' : ''}
                >
                  <option value="COVID-19">COVID-19</option>
                  <option value="BCG">BCG</option>
                  <option value="DPT">DPT</option>
                  <option value="Hepatitis B">Hepatitis B</option>
                  <option value="Polio">Polio</option>
                  <option value="Campak">Campak</option>
                  <option value="Influenza">Influenza</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                {formErrors.vaccine_type && <span className="error-message">{formErrors.vaccine_type}</span>}
                    </div>
              <div className="form-group">
                <label>Kapasitas Maksimal *</label>
                <input
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => handleFormChange('max_participants', e.target.value)}
                  min="1"
                  className={formErrors.max_participants ? 'error' : ''}
                />
                {formErrors.max_participants && <span className="error-message">{formErrors.max_participants}</span>}
                    </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                >
                  <option value="active">Aktif</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
                    </div>
              <div className="form-group full-width">
                <label>Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                ></textarea>
                    </div>
                  </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                Batal
                  </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Memperbarui...' : 'Update Jadwal'}
                  </button>
                </div>
          </form>
        )}
      </VaccinationModal>

      {/* Register Patient Modal */}
      <VaccinationModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title="Daftarkan Pasien untuk Vaksinasi"
      >
        {selectedVaccination && (
          <form className="registration-form" onSubmit={handleSubmitRegistration}>
            <div className="registration-info">
              <div className="info-card">
                <h4>{selectedVaccination.title}</h4>
                <p><strong>Tanggal:</strong> {new Date(selectedVaccination.date).toLocaleDateString('id-ID')}</p>
                <p><strong>Lokasi:</strong> {selectedVaccination.location}</p>
                <p><strong>Jenis Vaksin:</strong> {selectedVaccination.vaccine_type}</p>
                <p><strong>Kapasitas:</strong> {selectedVaccination.max_participants} orang</p>
          </div>
        </div>

            <div className="form-group">
              <label>Pilih Pasien *</label>
              <select
                value={registrationData.patient_id}
                onChange={(e) => handleRegistrationChange('patient_id', e.target.value)}
                className={formErrors.patient_id ? 'error' : ''}
              >
                <option value="">Pilih Pasien</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.phone}
                  </option>
                ))}
              </select>
              {formErrors.patient_id && <span className="error-message">{formErrors.patient_id}</span>}
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowRegisterModal(false)}>
                Batal
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Mendaftarkan...' : 'Daftarkan Pasien'}
                </button>
              </div>
          </form>
        )}
      </VaccinationModal>
    </Sidebar>
  );
}

export default VaccinationPage;