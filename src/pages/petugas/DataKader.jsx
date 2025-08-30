import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  PhotoCamera,
  CloudUpload
} from '@mui/icons-material';
import './DataKader.css';
import useApi from '../../hooks/useApi';
// import { validateKaderForm, formatPhoneNumber, formatNIK } from '../../utils/validation';

function DataKader() {
  const [activeMenu, setActiveMenu] = useState('kaders');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [kaders, setKaders] = useState([]);
  const [selectedKader, setSelectedKader] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    kaderSince: '',
    nik: '',
    ktpAddress: '',
    residenceAddress: '',
    birthDate: '',
    gender: '',
    education: '',
    phone: '',
    email: '',
    healthInsurance: '',
    bankAccount: '',
    posyanduArea: '',
    posyanduName: '',
    training: '',
    photo: null
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);

  const { loading, error, get, post, put, clearError } = useApi();

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
        { id: 'kaders', icon: People, label: 'Data Kader', active: true },
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

  // Load kaders data on component mount
  useEffect(() => {
    loadKaders();
  }, []);

  const loadKaders = async () => {
    try {
      clearError();
      const response = await get('/api/kaders');
      setKaders(response.data || []);
    } catch (err) {
      console.error('Error loading kaders:', err);
      // For demo purposes, load sample data
      setKaders([
        {
          id: 1,
          name: 'Ratih Estiwening',
          kaderSince: '2007',
          nik: '3579034412650006',
          ktpAddress: 'Bumiasri Sengkaling Selatan L-15, RT/RW : 02/09, Dadaprejo, Junrejo, Jawa Timur',
          residenceAddress: 'Bumiasri Sengkaling Selatan L-15, RT/RW : 02/09, Dadaprejo, Junrejo, Batu',
          birthDate: '1965-12-04',
          gender: 'Perempuan',
          education: 'S1',
          phone: '6285791323079',
          email: 'ratihestiwening@gmail.com',
          healthInsurance: 'tidak',
          bankAccount: 'Bank Jatim 0406231356',
          posyanduArea: 'Dadaprejo',
          posyanduName: 'Kemuning',
          training: '25 Kompetensi Dasar Kader 2024',
          status: 'Aktif',
          photo: null
        }
      ]);
    }
  };

  const searchKaders = async (query) => {
    if (!query.trim()) {
      loadKaders();
      return;
    }

    try {
      clearError();
      const response = await get('/api/kaders/search', { q: query });
      setKaders(response.data || []);
    } catch (err) {
      console.error('Error searching kaders:', err);
    }
  };

  // Filter kaders based on search term and status filter
  const filteredKaders = kaders.filter(kader => {
    const matchesFilter = filterStatus === 'all' || kader.status === filterStatus;
    const matchesSearch = !searchTerm ||
      kader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kader.nik.includes(searchTerm) ||
      kader.phone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        searchKaders(searchTerm);
      } else {
        loadKaders();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleViewKader = (kader) => {
    setSelectedKader(kader);
    setShowViewModal(true);
  };

  const handleEditKader = (kader) => {
    setSelectedKader(kader);
    setFormData({
      name: kader.name,
      kaderSince: kader.kaderSince,
      nik: kader.nik,
      ktpAddress: kader.ktpAddress,
      residenceAddress: kader.residenceAddress,
      birthDate: kader.birthDate,
      gender: kader.gender,
      education: kader.education,
      phone: kader.phone,
      email: kader.email || '',
      healthInsurance: kader.healthInsurance,
      bankAccount: kader.bankAccount,
      posyanduArea: kader.posyanduArea,
      posyanduName: kader.posyanduName,
      training: kader.training,
      photo: null
    });
    setPhotoPreview(kader.photo);
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDeleteKader = (kaderId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data kader ini?')) {
      setKaders(kaders.filter(k => k.id !== kaderId));
    }
  };

  const handleAddKader = () => {
    setFormData({
      name: '',
      kaderSince: '',
      nik: '',
      ktpAddress: '',
      residenceAddress: '',
      birthDate: '',
      gender: '',
      education: '',
      phone: '',
      email: '',
      healthInsurance: '',
      bankAccount: '',
      posyanduArea: '',
      posyanduName: '',
      training: '',
      photo: null
    });
    setPhotoPreview(null);
    setFormErrors({});
    setShowAddModal(true);
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const validation = validateKaderForm(formData);
    setFormErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmitKader = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      clearError();
      const response = await post('/api/kaders', formData);

      if (response.data) {
        setKaders(prev => [...prev, response.data]);
        setShowAddModal(false);
        setSuccessMessage('Kader berhasil ditambahkan');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error adding kader:', err);
    }
  };

  const handleUpdateKader = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      clearError();
      const response = await put(`/api/kaders/${selectedKader.id}`, formData);

      if (response.data) {
        setKaders(prev => prev.map(k =>
          k.id === selectedKader.id ? response.data : k
        ));
        setShowEditModal(false);
        setSuccessMessage('Data kader berhasil diperbarui');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error updating kader:', err);
    }
  };

  const KaderModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content kader-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const handleMenuClick = (item) => {
    if (item.path) {
      window.location.href = item.path;
    } else {
      setActiveMenu(item.id);
    }
  };

  return (
    <div className="data-kader-page">
      <div className="data-kader-container">
        {/* Sidebar */}
        <aside className="data-kader-sidebar">
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
                          handleMenuClick(item);
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
        <main className="data-kader-main">
          {/* Header */}
          <section className="data-kader-header">
            <div className="container">
              <div className="header-content">
                <h1 className="page-title">Data Kader</h1>
                <p className="page-subtitle">
                  Kelola data kader kesehatan masyarakat dengan mudah dan terorganisir
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
                  <div className="stat-value">{kaders.length}</div>
                  <div className="stat-label">Total Kader</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Person />
                  </div>
                  <div className="stat-value">
                    {kaders.filter(k => k.status === 'Aktif').length}
                  </div>
                  <div className="stat-label">Kader Aktif</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <CalendarToday />
                  </div>
                  <div className="stat-value">
                    {kaders.filter(k => parseInt(k.kaderSince) >= 2020).length}
                  </div>
                  <div className="stat-label">Kader Baru (2020+)</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <MedicalServices />
                  </div>
                  <div className="stat-value">
                    {kaders.filter(k => k.training).length}
                  </div>
                  <div className="stat-label">Telah Dilatih</div>
                </div>
              </div>
            </div>
          </section>

          {/* Kader Management Section */}
          <section className="kader-management-section">
            <div className="container">
              <div className="management-header">
                <h2 className="section-title">Daftar Kader</h2>
                <button className="btn-add-kader" onClick={handleAddKader}>
                  <Add />
                  Tambah Kader
                </button>
              </div>

              {/* Search and Filter */}
              <div className="search-filter-container">
                <div className="search-box">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Cari kader berdasarkan nama, NIK, atau nomor telepon..."
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

              {/* Kader Table */}
              <div className="kader-table-container">
                {loading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Memuat data kader...</p>
                  </div>
                ) : (
                  <div className="kader-table-wrapper">
                    <table className="kader-table">
                      <thead>
                        <tr>
                          <th>Foto</th>
                          <th>Nama</th>
                          <th>NIK</th>
                          <th>Kontak</th>
                          <th>Jenis Kelamin</th>
                          <th>Posyandu</th>
                          <th>Status</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredKaders.map((kader) => (
                          <tr key={kader.id}>
                            <td>
                              <div className="kader-photo-cell">
                                {kader.photo ? (
                                  <img src={kader.photo} alt={kader.name} className="kader-photo-small" />
                                ) : (
                                  <div className="kader-photo-placeholder">
                                    <Person />
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="kader-info">
                                <div className="kader-name">{kader.name}</div>
                                <div className="kader-since">Kader sejak {kader.kaderSince}</div>
                              </div>
                            </td>
                            <td>{kader.nik}</td>
                            <td>
                              <div className="contact-info">
                                <div className="contact-item">
                                  <Phone fontSize="small" />
                                  {kader.phone}
                                </div>
                                <div className="contact-item">
                                  <Email fontSize="small" />
                                  {kader.email}
                                </div>
                              </div>
                            </td>
                            <td>{kader.gender}</td>
                            <td>
                              <div className="posyandu-info">
                                <div className="posyandu-name">{kader.posyanduName}</div>
                                <div className="posyandu-area">{kader.posyanduArea}</div>
                              </div>
                            </td>
                            <td>
                              <span className={`status-badge ${kader.status === 'Aktif' ? 'active' : 'inactive'}`}>
                                {kader.status}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="action-btn view"
                                  onClick={() => handleViewKader(kader)}
                                  title="Lihat Detail"
                                >
                                  <Visibility />
                                </button>
                                <button
                                  className="action-btn edit"
                                  onClick={() => handleEditKader(kader)}
                                  title="Edit"
                                >
                                  <Edit />
                                </button>
                                <button
                                  className="action-btn delete"
                                  onClick={() => handleDeleteKader(kader.id)}
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

                    {filteredKaders.length === 0 && (
                      <div className="no-data">
                        <Person fontSize="large" />
                        <p>Tidak ada data kader ditemukan</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* View Kader Modal */}
      <KaderModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Detail Kader"
      >
        {selectedKader && (
          <div className="kader-detail">
            <div className="kader-detail-header">
              <div className="kader-photo-large">
                {selectedKader.photo ? (
                  <img src={selectedKader.photo} alt={selectedKader.name} />
                ) : (
                  <Person />
                )}
              </div>
              <div>
                <h3>{selectedKader.name}</h3>
                <p>NIK: {selectedKader.nik}</p>
                <span className={`status-badge ${selectedKader.status === 'Aktif' ? 'active' : 'inactive'}`}>
                  {selectedKader.status}
                </span>
              </div>
            </div>

            <div className="kader-detail-grid">
              <div className="detail-item">
                <label>Kader Sejak Tahun</label>
                <p>{selectedKader.kaderSince}</p>
              </div>
              <div className="detail-item">
                <label>Tanggal Lahir</label>
                <p>{new Date(selectedKader.birthDate).toLocaleDateString('id-ID')}</p>
              </div>
              <div className="detail-item">
                <label>Jenis Kelamin</label>
                <p>{selectedKader.gender}</p>
              </div>
              <div className="detail-item">
                <label>Pendidikan Terakhir</label>
                <p>{selectedKader.education}</p>
              </div>
              <div className="detail-item">
                <label>Nomor Telepon</label>
                <p>{selectedKader.phone}</p>
              </div>
              <div className="detail-item">
                <label>Email</label>
                <p>{selectedKader.email}</p>
              </div>
              <div className="detail-item">
                <label>Kepemilikan JKN</label>
                <p>{selectedKader.healthInsurance}</p>
              </div>
              <div className="detail-item">
                <label>Nomor Rekening</label>
                <p>{selectedKader.bankAccount}</p>
              </div>
              <div className="detail-item">
                <label>Posyandu Wilayah</label>
                <p>{selectedKader.posyanduArea}</p>
              </div>
              <div className="detail-item">
                <label>Nama Posyandu</label>
                <p>{selectedKader.posyanduName}</p>
              </div>
              <div className="detail-item full-width">
                <label>Alamat sesuai KTP</label>
                <p>{selectedKader.ktpAddress}</p>
              </div>
              <div className="detail-item full-width">
                <label>Alamat Domisili</label>
                <p>{selectedKader.residenceAddress}</p>
              </div>
              <div className="detail-item full-width">
                <label>Pelatihan yang Pernah Diikuti</label>
                <p>{selectedKader.training}</p>
              </div>
            </div>
          </div>
        )}
      </KaderModal>

      {/* Add Kader Modal */}
      <KaderModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Tambah Kader Baru"
      >
        <form className="kader-form" onSubmit={handleSubmitKader}>
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
              <label>Menjadi Kader Sejak Tahun *</label>
              <input
                type="number"
                value={formData.kaderSince}
                onChange={(e) => handleFormChange('kaderSince', e.target.value)}
                placeholder="2024"
                className={formErrors.kaderSince ? 'error' : ''}
              />
              {formErrors.kaderSince && <span className="error-message">{formErrors.kaderSince}</span>}
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
              <label>Pendidikan Terakhir *</label>
              <select
                value={formData.education}
                onChange={(e) => handleFormChange('education', e.target.value)}
                className={formErrors.education ? 'error' : ''}
              >
                <option value="">Pilih Pendidikan</option>
                <option value="SD">SD</option>
                <option value="SMP">SMP</option>
                <option value="SMA">SMA</option>
                <option value="D1">D1</option>
                <option value="D2">D2</option>
                <option value="D3">D3</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
              </select>
              {formErrors.education && <span className="error-message">{formErrors.education}</span>}
            </div>
            <div className="form-group">
              <label>Nomor Handphone *</label>
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
            <div className="form-group">
              <label>Kepemilikan JKN *</label>
              <select
                value={formData.healthInsurance}
                onChange={(e) => handleFormChange('healthInsurance', e.target.value)}
                className={formErrors.healthInsurance ? 'error' : ''}
              >
                <option value="">Pilih Status</option>
                <option value="ya">Ya</option>
                <option value="tidak">Tidak</option>
              </select>
              {formErrors.healthInsurance && <span className="error-message">{formErrors.healthInsurance}</span>}
            </div>
            <div className="form-group">
              <label>Nomor Rekening *</label>
              <input
                type="text"
                value={formData.bankAccount}
                onChange={(e) => handleFormChange('bankAccount', e.target.value)}
                placeholder="Bank Jatim 1234567890"
                className={formErrors.bankAccount ? 'error' : ''}
              />
              {formErrors.bankAccount && <span className="error-message">{formErrors.bankAccount}</span>}
            </div>
            <div className="form-group">
              <label>Posyandu Wilayah *</label>
              <input
                type="text"
                value={formData.posyanduArea}
                onChange={(e) => handleFormChange('posyanduArea', e.target.value)}
                className={formErrors.posyanduArea ? 'error' : ''}
              />
              {formErrors.posyanduArea && <span className="error-message">{formErrors.posyanduArea}</span>}
            </div>
            <div className="form-group">
              <label>Nama Posyandu *</label>
              <input
                type="text"
                value={formData.posyanduName}
                onChange={(e) => handleFormChange('posyanduName', e.target.value)}
                className={formErrors.posyanduName ? 'error' : ''}
              />
              {formErrors.posyanduName && <span className="error-message">{formErrors.posyanduName}</span>}
            </div>
            <div className="form-group full-width">
              <label>Alamat sesuai KTP *</label>
              <textarea
                value={formData.ktpAddress}
                onChange={(e) => handleFormChange('ktpAddress', e.target.value)}
                className={formErrors.ktpAddress ? 'error' : ''}
              ></textarea>
              {formErrors.ktpAddress && <span className="error-message">{formErrors.ktpAddress}</span>}
            </div>
            <div className="form-group full-width">
              <label>Alamat Domisili *</label>
              <textarea
                value={formData.residenceAddress}
                onChange={(e) => handleFormChange('residenceAddress', e.target.value)}
                className={formErrors.residenceAddress ? 'error' : ''}
              ></textarea>
              {formErrors.residenceAddress && <span className="error-message">{formErrors.residenceAddress}</span>}
            </div>
            <div className="form-group full-width">
              <label>Pelatihan Kader yang Pernah Diikuti</label>
              <textarea
                value={formData.training}
                onChange={(e) => handleFormChange('training', e.target.value)}
                placeholder="Sebutkan pelatihan yang pernah diikuti"
              ></textarea>
            </div>
            <div className="form-group full-width">
              <label>Foto Kader</label>
              <div className="photo-upload-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  id="photo-upload"
                  className="photo-input"
                />
                <label htmlFor="photo-upload" className="photo-upload-label">
                  <CloudUpload />
                  <span>Pilih Foto</span>
                </label>
                {photoPreview && (
                  <div className="photo-preview">
                    <img src={photoPreview} alt="Preview" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Kader'}
            </button>
          </div>
        </form>
      </KaderModal>

      {/* Edit Kader Modal */}
      <KaderModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Data Kader"
      >
        {selectedKader && (
          <form className="kader-form" onSubmit={handleUpdateKader}>
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
                <label>Menjadi Kader Sejak Tahun *</label>
                <input
                  type="number"
                  value={formData.kaderSince}
                  onChange={(e) => handleFormChange('kaderSince', e.target.value)}
                  className={formErrors.kaderSince ? 'error' : ''}
                />
                {formErrors.kaderSince && <span className="error-message">{formErrors.kaderSince}</span>}
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
                <label>Pendidikan Terakhir *</label>
                <select
                  value={formData.education}
                  onChange={(e) => handleFormChange('education', e.target.value)}
                  className={formErrors.education ? 'error' : ''}
                >
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA">SMA</option>
                  <option value="D1">D1</option>
                  <option value="D2">D2</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
                {formErrors.education && <span className="error-message">{formErrors.education}</span>}
              </div>
              <div className="form-group">
                <label>Nomor Handphone *</label>
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
              <div className="form-group">
                <label>Kepemilikan JKN *</label>
                <select
                  value={formData.healthInsurance}
                  onChange={(e) => handleFormChange('healthInsurance', e.target.value)}
                  className={formErrors.healthInsurance ? 'error' : ''}
                >
                  <option value="ya">Ya</option>
                  <option value="tidak">Tidak</option>
                </select>
                {formErrors.healthInsurance && <span className="error-message">{formErrors.healthInsurance}</span>}
              </div>
              <div className="form-group">
                <label>Nomor Rekening *</label>
                <input
                  type="text"
                  value={formData.bankAccount}
                  onChange={(e) => handleFormChange('bankAccount', e.target.value)}
                  className={formErrors.bankAccount ? 'error' : ''}
                />
                {formErrors.bankAccount && <span className="error-message">{formErrors.bankAccount}</span>}
              </div>
              <div className="form-group">
                <label>Posyandu Wilayah *</label>
                <input
                  type="text"
                  value={formData.posyanduArea}
                  onChange={(e) => handleFormChange('posyanduArea', e.target.value)}
                  className={formErrors.posyanduArea ? 'error' : ''}
                />
                {formErrors.posyanduArea && <span className="error-message">{formErrors.posyanduArea}</span>}
              </div>
              <div className="form-group">
                <label>Nama Posyandu *</label>
                <input
                  type="text"
                  value={formData.posyanduName}
                  onChange={(e) => handleFormChange('posyanduName', e.target.value)}
                  className={formErrors.posyanduName ? 'error' : ''}
                />
                {formErrors.posyanduName && <span className="error-message">{formErrors.posyanduName}</span>}
              </div>
              <div className="form-group full-width">
                <label>Alamat sesuai KTP *</label>
                <textarea
                  value={formData.ktpAddress}
                  onChange={(e) => handleFormChange('ktpAddress', e.target.value)}
                  className={formErrors.ktpAddress ? 'error' : ''}
                ></textarea>
                {formErrors.ktpAddress && <span className="error-message">{formErrors.ktpAddress}</span>}
              </div>
              <div className="form-group full-width">
                <label>Alamat Domisili *</label>
                <textarea
                  value={formData.residenceAddress}
                  onChange={(e) => handleFormChange('residenceAddress', e.target.value)}
                  className={formErrors.residenceAddress ? 'error' : ''}
                ></textarea>
                {formErrors.residenceAddress && <span className="error-message">{formErrors.residenceAddress}</span>}
              </div>
              <div className="form-group full-width">
                <label>Pelatihan Kader yang Pernah Diikuti</label>
                <textarea
                  value={formData.training}
                  onChange={(e) => handleFormChange('training', e.target.value)}
                ></textarea>
              </div>
              <div className="form-group full-width">
                <label>Foto Kader</label>
                <div className="photo-upload-container">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    id="photo-upload-edit"
                    className="photo-input"
                  />
                  <label htmlFor="photo-upload-edit" className="photo-upload-label">
                    <CloudUpload />
                    <span>Ubah Foto</span>
                  </label>
                  {photoPreview && (
                    <div className="photo-preview">
                      <img src={photoPreview} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                Batal
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Memperbarui...' : 'Update Kader'}
              </button>
            </div>
          </form>
        )}
      </KaderModal>
    </div>
  );
}

export default DataKader;