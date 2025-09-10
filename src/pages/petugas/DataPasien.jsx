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
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import './DataPasien.css';
import useApi from '../../hooks/useApi';
import { validatePatientForm, formatPhoneNumber, formatNIK } from '../../utils/validation';

const PatientModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    // Reset form data when closing modal
    setFormData({
      name: '',
      nik: '',
      phone: '',
      email: '',
      address: '',
      birthDate: '',
      gender: '',
      bloodType: ''
    });
    setFormErrors({});
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

function DataPasien() {
  const [activeMenu, setActiveMenu] = useState('patients');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    phone: '',
    email: '',
    address: '',
    birthDate: '',
    gender: '',
    bloodType: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const { loading, error, get, post, put, delete: del, clearError } = useApi();

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
        { id: 'patients', icon: People, label: 'Data Pasien', active: true },
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

  // Load patients data on component mount
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      clearError();
      const response = await get('/api/patients');
      console.log('Patients loaded:', response);
  
      const patientsWithDefaults = (response || []).map(patient => ({
        ...patient,
        status: patient.status || 'Aktif', 
        lastVisit: patient.lastVisit || new Date().toISOString(), 
        medicalRecords: patient.medicalRecords || 0 
      }));
  
      setPatients(patientsWithDefaults);
    } catch (err) {
      console.error('Error loading patients:', err);
    }
  };

  const searchPatients = async (query) => {
    if (!query.trim()) {
      loadPatients();
      return;
    }

    try {
      clearError();
      const response = await get('/pasien/search', { q: query });
      setPatients(response.data || []);
    } catch (err) {
      console.error('Error searching patients:', err);
    }
  };

  // Filter patients based on search term and status filter
  const filteredPatients = patients.filter(patient => {
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesFilter;
  });

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        searchPatients(searchTerm);
      } else {
        loadPatients();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Reset form data when modals close
  useEffect(() => {
    if (!showAddModal && !showEditModal) {
      setFormData({
        name: '',
        nik: '',
        phone: '',
        email: '',
        address: '',
        birthDate: '',
        gender: '',
        bloodType: ''
      });
      setFormErrors({});
    }
  }, [showAddModal, showEditModal]);

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name || '',
      nik: patient.nik || '',
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
      birthDate: patient.birthDate ? patient.birthDate.split('T')[0] : '',
      gender: patient.gender || '',
      bloodType: patient.bloodType || ''
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDeletePatient = async (patientId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data pasien ini?')) {
          try {
            clearError();
            await del(`/pasien/${patientId}`);
            setPatients(patients.filter(p => p.id !== patientId));
            setSuccessMessage('Data pasien berhasil dihapus');
            setTimeout(() => setSuccessMessage(''), 3000);
          } catch (err) {
            console.error('Error deleting patient:', err);
            // Error will be automatically set by the useApi hook and displayed in the UI
          }
        }
      };

  const handleAddPatient = () => {
    setFormData({
      name: '',
      nik: '',
      phone: '',
      email: '',
      address: '',
      birthDate: '',
      gender: '',
      bloodType: ''
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleFormChange = (field, value) => {
    // Prevent unnecessary re-renders by checking if value actually changed
    setFormData(prev => {
      if (prev[field] === value) return prev;
      return {
        ...prev,
        [field]: value
      };
    });

    // Clear error for this field when user starts typing (debounced)
    if (formErrors[field]) {
      setTimeout(() => {
        setFormErrors(prev => ({
          ...prev,
          [field]: null
        }));
      }, 100);
    }
  };

  const validateForm = () => {
    const validation = validatePatientForm(formData);
    setFormErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmitPatient = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    try {
      clearError();
      const response = await post('/pasien', formData);
      await loadPatients();

      if (response.data) {
        setPatients(prev => [...prev, response.data]);
        setShowAddModal(false);
        setSuccessMessage('Pasien berhasil ditambahkan');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error adding patient:', err);
    }
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    try {
      clearError();
      const response = await put(`/pasien/${selectedPatient.id}`, formData);
      await loadPatients();

      if (response.data) {
        setPatients(prev => prev.map(p =>
          p.id === selectedPatient.id ? response.data : p
        ));
        setShowEditModal(false);
        setSuccessMessage('Data pasien berhasil diperbarui');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error updating patient:', err);
    }
  };



  return (
    <div className="data-pasien-page">
      <div className="data-pasien-container">
        {/* Sidebar */}
        <aside className="data-pasien-sidebar">
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
        <main className="data-pasien-main">
          {/* Header */}
          <section className="data-pasien-header">
            <div className="container">
              <div className="header-content">
                <h1 className="page-title">Data Pasien</h1>
                <p className="page-subtitle">
                  Kelola data pasien masyarakat dengan mudah dan terorganisir
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
                    <People />
                  </div>
                  <div className="stat-value">{patients.length}</div>
                  <div className="stat-label">Total Pasien</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Person />
                  </div>
                  <div className="stat-value">
                    {patients.filter(p => p.status === 'Aktif').length}
                  </div>
                  <div className="stat-label">Pasien Aktif</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <CalendarToday />
                  </div>
                  <div className="stat-value">
                    {patients.filter(p => {
                      const lastVisit = new Date(p.lastVisit);
                      const monthAgo = new Date();
                      monthAgo.setMonth(monthAgo.getMonth() - 1);
                      return lastVisit >= monthAgo;
                    }).length}
                  </div>
                  <div className="stat-label">Kunjungan Bulan Ini</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <MedicalServices />
                  </div>
                  <div className="stat-value">
                    {patients.reduce((sum, p) => sum + p.medicalRecords, 0)}
                  </div>
                  <div className="stat-label">Total Rekam Medis</div>
                </div>
              </div>
            </div>
          </section>

          {/* Patient Management Section */}
          <section className="patient-management-section">
            <div className="container">
              <div className="management-header">
                <h2 className="section-title">Daftar Pasien</h2>
                <button className="btn-add-patient" onClick={handleAddPatient}>
                  <Add />
                  Tambah Pasien
                </button>
              </div>

              {/* Search and Filter */}
              <div className="search-filter-container">
                <div className="search-box">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Cari pasien berdasarkan nama, NIK, atau nomor telepon..."
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
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>

              {/* Patient Table */}
              <div className="patient-table-container">
                {loading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Memuat data pasien...</p>
                  </div>
                ) : (
                  <div className="patient-table-wrapper">
                    <table className="patient-table">
                      <thead>
                        <tr>
                          <th>Nama</th>
                          <th>NIK</th>
                          <th>Kontak</th>
                          <th>Jenis Kelamin</th>
                          <th>Status</th>
                          <th>Kunjungan Terakhir</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patients.map((patient) => (
                          <tr key={patient.id}>
                            <td>
                              <div className="patient-info">
                                <div className="patient-avatar">
                                  <Person />
                                </div>
                                <div>
                                  <div className="patient-name">{patient.name}</div>
                                  <div className="patient-address">{patient.address}</div>
                                </div>
                              </div>
                            </td>
                            <td>{patient.nik}</td>
                            <td>
                              <div className="contact-info">
                                <div className="contact-item">
                                  <Phone fontSize="small" />
                                  {patient.phone}
                                </div>
                                <div className="contact-item">
                                  <Email fontSize="small" />
                                  {patient.email}
                                </div>
                              </div>
                            </td>
                            <td>{patient.gender}</td>
                            <td>
                              <span className={`status-badge ${patient.status === 'Aktif' ? 'active' : 'inactive'}`}>
                                {patient.status}
                              </span>
                            </td>
                            <td>{new Date(patient.lastVisit).toLocaleDateString('id-ID')}</td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="action-btn view"
                                  onClick={() => handleViewPatient(patient)}
                                  title="Lihat Detail"
                                >
                                  <Visibility />
                                </button>
                                <button
                                  className="action-btn edit"
                                  onClick={() => handleEditPatient(patient)}
                                  title="Edit"
                                >
                                  <Edit />
                                </button>
                                <button
                                  className="action-btn delete"
                                  onClick={() => handleDeletePatient(patient.id)}
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

                    {filteredPatients.length === 0 && (
                      <div className="no-data">
                        <Person fontSize="large" />
                        <p>Tidak ada data pasien ditemukan</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* View Patient Modal */}
      <PatientModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Detail Pasien"
      >
        {selectedPatient && (
          <div className="patient-detail">
            <div className="patient-detail-header">
              <div className="patient-avatar-large">
                <Person />
              </div>
              <div>
                <h3>{selectedPatient.name}</h3>
                <p>NIK: {selectedPatient.nik}</p>
                <span className={`status-badge ${selectedPatient.status === 'Aktif' ? 'active' : 'inactive'}`}>
                  {selectedPatient.status}
                </span>
              </div>
            </div>

            <div className="patient-detail-grid">
              <div className="detail-item">
                <label>Tanggal Lahir</label>
                <p>{new Date(selectedPatient.birthDate).toLocaleDateString('id-ID')}</p>
              </div>
              <div className="detail-item">
                <label>Jenis Kelamin</label>
                <p>{selectedPatient.gender}</p>
              </div>
              <div className="detail-item">
                <label>Golongan Darah</label>
                <p>{selectedPatient.bloodType}</p>
              </div>
              <div className="detail-item">
                <label>Nomor Telepon</label>
                <p>{selectedPatient.phone}</p>
              </div>
              <div className="detail-item">
                <label>Email</label>
                <p>{selectedPatient.email}</p>
              </div>
              <div className="detail-item">
                <label>Kunjungan Terakhir</label>
                <p>{new Date(selectedPatient.lastVisit).toLocaleDateString('id-ID')}</p>
              </div>
              <div className="detail-item full-width">
                <label>Alamat</label>
                <p>{selectedPatient.address}</p>
              </div>
              <div className="detail-item">
                <label>Jumlah Rekam Medis</label>
                <p>{selectedPatient.medicalRecords} rekam medis</p>
              </div>
            </div>
          </div>
        )}
      </PatientModal>

      {/* Add Patient Modal */}
      <PatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Tambah Pasien Baru"
      >
        <form className="patient-form" onSubmit={handleSubmitPatient}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nama Lengkap *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                className={formErrors.name ? 'error' : ''}
              />
              {formErrors.name && <span className="error-message">{formErrors.name}</span>}
            </div>
            <div className="form-group">
              <label>NIK *</label>
              <input
                type="text"
                value={formData.nik}
                onChange={(e) => handleFormChange('nik', e.target.value)}
                placeholder="16 digit NIK"
                className={formErrors.nik ? 'error' : ''}
              />
              {formErrors.nik && <span className="error-message">{formErrors.nik}</span>}
            </div>
            <div className="form-group">
              <label>Tanggal Lahir *</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleFormChange('birthDate', e.target.value)}
                className={formErrors.birthDate ? 'error' : ''}
              />
              {formErrors.birthDate && <span className="error-message">{formErrors.birthDate}</span>}
            </div>
            <div className="form-group">
              <label>Jenis Kelamin *</label>
              <select
                value={formData.gender}
                onChange={(e) => handleFormChange('gender', e.target.value)}
                className={formErrors.gender ? 'error' : ''}
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
              {formErrors.gender && <span className="error-message">{formErrors.gender}</span>}
            </div>
            <div className="form-group">
              <label>Golongan Darah</label>
              <select
                value={formData.bloodType}
                onChange={(e) => handleFormChange('bloodType', e.target.value)}
              >
                <option value="">Pilih Golongan Darah</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nomor Telepon *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                placeholder="+62 atau 08xx"
                className={formErrors.phone ? 'error' : ''}
              />
              {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                className={formErrors.email ? 'error' : ''}
              />
              {formErrors.email && <span className="error-message">{formErrors.email}</span>}
            </div>
            <div className="form-group full-width">
              <label>Alamat *</label>
              <textarea
                value={formData.address}
                onChange={(e) => handleFormChange('address', e.target.value)}
                className={formErrors.address ? 'error' : ''}
              ></textarea>
              {formErrors.address && <span className="error-message">{formErrors.address}</span>}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Pasien'}
            </button>
          </div>
        </form>
      </PatientModal>

      {/* Edit Patient Modal */}
      <PatientModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Data Pasien"
      >
        {selectedPatient && (
          <form className="patient-form" onSubmit={handleUpdatePatient}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nama Lengkap *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className={formErrors.name ? 'error' : ''}
                />
                {formErrors.name && <span className="error-message">{formErrors.name}</span>}
              </div>
              <div className="form-group">
                <label>NIK *</label>
                <input
                  type="text"
                  value={formData.nik}
                  onChange={(e) => handleFormChange('nik', e.target.value)}
                  className={formErrors.nik ? 'error' : ''}
                />
                {formErrors.nik && <span className="error-message">{formErrors.nik}</span>}
              </div>
              <div className="form-group">
                <label>Tanggal Lahir *</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleFormChange('birthDate', e.target.value)}
                  className={formErrors.birthDate ? 'error' : ''}
                />
                {formErrors.birthDate && <span className="error-message">{formErrors.birthDate}</span>}
              </div>
              <div className="form-group">
                <label>Jenis Kelamin *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleFormChange('gender', e.target.value)}
                  className={formErrors.gender ? 'error' : ''}
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
                {formErrors.gender && <span className="error-message">{formErrors.gender}</span>}
              </div>
              <div className="form-group">
                <label>Golongan Darah</label>
                <select
                  value={formData.bloodType}
                  onChange={(e) => handleFormChange('bloodType', e.target.value)}
                >
                  <option value="">Pilih Golongan Darah</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nomor Telepon *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  className={formErrors.phone ? 'error' : ''}
                />
                {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  className={formErrors.email ? 'error' : ''}
                />
                {formErrors.email && <span className="error-message">{formErrors.email}</span>}
              </div>
              <div className="form-group full-width">
                <label>Alamat *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleFormChange('address', e.target.value)}
                  className={formErrors.address ? 'error' : ''}
                ></textarea>
                {formErrors.address && <span className="error-message">{formErrors.address}</span>}
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                Batal
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Memperbarui...' : 'Update Pasien'}
              </button>
            </div>
          </form>
        )}
      </PatientModal>
    </div>
  );
}

export default DataPasien;