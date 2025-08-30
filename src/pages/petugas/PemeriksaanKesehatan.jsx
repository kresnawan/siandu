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
  Scale,
  Height,
  Favorite,
  Bloodtype,
  Visibility as EyeIcon,
  Hearing,
  MedicalInformation,
  AssignmentTurnedIn,
  Send
} from '@mui/icons-material';
import './PemeriksaanKesehatan.css';
import useApi from '../../hooks/useApi';

function PemeriksaanKesehatan() {
  const [activeMenu, setActiveMenu] = useState('examinations');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [examinations, setExaminations] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [examData, setExamData] = useState({
    patientId: '',
    examDate: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    nutritionStatus: '',
    hypertension: '',
    diabetes: '',
    highCholesterol: '',
    highUricAcid: '',
    visionProblems: '',
    hearingProblems: '',
    treatment: '',
    referral: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [currentView, setCurrentView] = useState('examinations'); // 'examinations' or 'reports'

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
        { id: 'examinations', icon: MedicalServices, label: 'Pemeriksaan', active: true },
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

  // Load data on component mount
  useEffect(() => {
    loadPatients();
    loadExaminations();
  }, []);

  const loadPatients = async () => {
    try {
      clearError();
      const response = await get('/api/patients');
      setPatients(response.data || []);
    } catch (err) {
      console.error('Error loading patients:', err);
      // Sample data for demo
      setPatients([
        { id: 1, name: 'Ahmad Surya', nik: '3579031234567890', phone: '6281234567890' },
        { id: 2, name: 'Siti Aminah', nik: '3579032345678901', phone: '6281234567891' },
        { id: 3, name: 'Budi Santoso', nik: '3579033456789012', phone: '6281234567892' }
      ]);
    }
  };

  const loadExaminations = async () => {
    try {
      clearError();
      const response = await get('/api/examinations');
      setExaminations(response.data || []);
    } catch (err) {
      console.error('Error loading examinations:', err);
      // Sample examination data
      setExaminations([
        {
          id: 1,
          patientId: 1,
          patientName: 'Ahmad Surya',
          examDate: '2024-08-15',
          weight: 65,
          height: 170,
          bloodPressureSystolic: 120,
          bloodPressureDiastolic: 80,
          nutritionStatus: 'NORMAL',
          hypertension: 'Tidak',
          diabetes: 'Tidak',
          highCholesterol: 'Tidak',
          highUricAcid: 'Tidak',
          visionProblems: 'Tidak',
          hearingProblems: 'Tidak',
          treatment: 'Ya',
          referral: 'Tidak',
          notes: 'Pemeriksaan rutin, kondisi baik'
        }
      ]);
    }
  };

  const searchExaminations = async (query) => {
    if (!query.trim()) {
      loadExaminations();
      return;
    }

    try {
      clearError();
      const response = await get('/api/examinations/search', { q: query });
      setExaminations(response.data || []);
    } catch (err) {
      console.error('Error searching examinations:', err);
    }
  };

  // Filter examinations based on search term and status filter
  const filteredExaminations = examinations.filter(exam => {
    const matchesSearch = !searchTerm ||
      exam.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        searchExaminations(searchTerm);
      } else {
        loadExaminations();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleViewExamination = (exam) => {
    setSelectedPatient(exam);
    setShowExamModal(true);
  };

  const handleAddExamination = () => {
    setExamData({
      patientId: '',
      examDate: new Date().toISOString().split('T')[0],
      weight: '',
      height: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      nutritionStatus: '',
      hypertension: '',
      diabetes: '',
      highCholesterol: '',
      highUricAcid: '',
      visionProblems: '',
      hearingProblems: '',
      treatment: '',
      referral: '',
      notes: ''
    });
    setFormErrors({});
    setShowExamModal(true);
  };

  const handleFormChange = (field, value) => {
    setExamData(prev => ({
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

  const calculateNutritionStatus = (weight, height) => {
    if (!weight || !height) return '';

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    if (bmi < 18.5) return 'KURUS';
    if (bmi < 25) return 'NORMAL';
    if (bmi < 30) return 'GEMUK';
    return 'OBESITAS';
  };

  const handleWeightHeightChange = () => {
    if (examData.weight && examData.height) {
      const nutritionStatus = calculateNutritionStatus(examData.weight, examData.height);
      setExamData(prev => ({
        ...prev,
        nutritionStatus
      }));
    }
  };

  useEffect(() => {
    handleWeightHeightChange();
  }, [examData.weight, examData.height]);

  const validateForm = () => {
    const errors = {};

    if (!examData.patientId) errors.patientId = 'Pasien harus dipilih';
    if (!examData.examDate) errors.examDate = 'Tanggal pemeriksaan harus diisi';
    if (!examData.weight) errors.weight = 'Berat badan harus diisi';
    if (!examData.height) errors.height = 'Tinggi badan harus diisi';
    if (!examData.bloodPressureSystolic) errors.bloodPressureSystolic = 'Tekanan darah sistolik harus diisi';
    if (!examData.bloodPressureDiastolic) errors.bloodPressureDiastolic = 'Tekanan darah diastolik harus diisi';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitExamination = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      clearError();
      const response = await post('/api/examinations', examData);

      if (response.data) {
        setExaminations(prev => [...prev, response.data]);
        setShowExamModal(false);
        setSuccessMessage('Pemeriksaan berhasil disimpan');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error saving examination:', err);
    }
  };

  const handleDeleteExamination = (examId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data pemeriksaan ini?')) {
      setExaminations(examinations.filter(e => e.id !== examId));
    }
  };

  const generateMonthlyReport = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExams = examinations.filter(exam => {
      const examDate = new Date(exam.examDate);
      return examDate.getMonth() === currentMonth && examDate.getFullYear() === currentYear;
    });

    const report = {
      period: `${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`,
      totalExaminations: monthlyExams.length,
      newVisits: monthlyExams.filter(exam => exam.isNewVisit).length,
      nutritionStats: {
        kurus: monthlyExams.filter(exam => exam.nutritionStatus === 'KURUS').length,
        normal: monthlyExams.filter(exam => exam.nutritionStatus === 'NORMAL').length,
        gemuk: monthlyExams.filter(exam => exam.nutritionStatus === 'GEMUK').length,
        obesitas: monthlyExams.filter(exam => exam.nutritionStatus === 'OBESITAS').length
      },
      healthConditions: {
        hypertension: monthlyExams.filter(exam => exam.hypertension === 'Ya').length,
        diabetes: monthlyExams.filter(exam => exam.diabetes === 'Ya').length,
        highCholesterol: monthlyExams.filter(exam => exam.highCholesterol === 'Ya').length,
        highUricAcid: monthlyExams.filter(exam => exam.highUricAcid === 'Ya').length,
        visionProblems: monthlyExams.filter(exam => exam.visionProblems === 'Ya').length,
        hearingProblems: monthlyExams.filter(exam => exam.hearingProblems === 'Ya').length
      },
      actions: {
        treated: monthlyExams.filter(exam => exam.treatment === 'Ya').length,
        referred: monthlyExams.filter(exam => exam.referral === 'Ya').length
      }
    };

    return report;
  };

  const ExaminationModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content examination-modal" onClick={e => e.stopPropagation()}>
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
      if (item.id === 'monthly-reports') {
        setCurrentView('reports');
        setShowReportModal(true);
      } else if (item.id === 'add-examination') {
        handleAddExamination();
      } else {
        setCurrentView('examinations');
      }
    }
  };

  return (
    <div className="pemeriksaan-kesehatan-page">
      <div className="pemeriksaan-kesehatan-container">
        {/* Sidebar */}
        <aside className="pemeriksaan-kesehatan-sidebar">
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
        <main className="pemeriksaan-kesehatan-main">
          {/* Header */}
          <section className="pemeriksaan-kesehatan-header">
            <div className="container">
              <div className="header-content">
                <h1 className="page-title">Pemeriksaan Kesehatan</h1>
                <p className="page-subtitle">
                  Lakukan pemeriksaan kesehatan dan pantau kondisi masyarakat
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
                    <MedicalServices />
                  </div>
                  <div className="stat-value">{examinations.length}</div>
                  <div className="stat-label">Total Pemeriksaan</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Person />
                  </div>
                  <div className="stat-value">{patients.length}</div>
                  <div className="stat-label">Total Pasien</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <CalendarToday />
                  </div>
                  <div className="stat-value">
                    {examinations.filter(e => {
                      const examDate = new Date(e.examDate);
                      const today = new Date();
                      return examDate.toDateString() === today.toDateString();
                    }).length}
                  </div>
                  <div className="stat-label">Pemeriksaan Hari Ini</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Assessment />
                  </div>
                  <div className="stat-value">
                    {examinations.filter(e => e.nutritionStatus === 'NORMAL').length}
                  </div>
                  <div className="stat-label">Status Gizi Normal</div>
                </div>
              </div>
            </div>
          </section>

          {/* Examination Management Section */}
          <section className="examination-management-section">
            <div className="container">
              <div className="management-header">
                <h2 className="section-title">Daftar Pemeriksaan</h2>
                <div className="header-actions">
                  <button className="btn-secondary" onClick={() => setShowReportModal(true)}>
                    <Assessment />
                    Laporan Bulanan
                  </button>
                  <button className="btn-add-examination" onClick={handleAddExamination}>
                    <Add />
                    Tambah Pemeriksaan
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="search-filter-container">
                <div className="search-box">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Cari pemeriksaan berdasarkan nama pasien..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              {/* Examination Table */}
              <div className="examination-table-container">
                {loading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Memuat data pemeriksaan...</p>
                  </div>
                ) : (
                  <div className="examination-table-wrapper">
                    <table className="examination-table">
                      <thead>
                        <tr>
                          <th>Nama Pasien</th>
                          <th>Tanggal</th>
                          <th>Berat/Tinggi</th>
                          <th>Tekanan Darah</th>
                          <th>Status Gizi</th>
                          <th>Kondisi Kesehatan</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExaminations.map((exam) => (
                          <tr key={exam.id}>
                            <td>
                              <div className="patient-info">
                                <div className="patient-avatar">
                                  <Person />
                                </div>
                                <div>
                                  <div className="patient-name">{exam.patientName}</div>
                                  <div className="patient-nik">ID: {exam.patientId}</div>
                                </div>
                              </div>
                            </td>
                            <td>{new Date(exam.examDate).toLocaleDateString('id-ID')}</td>
                            <td>
                              <div className="measurement-info">
                                <div className="weight-height">
                                  <Scale fontSize="small" />
                                  {exam.weight}kg / {exam.height}cm
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="blood-pressure">
                                <Favorite fontSize="small" />
                                {exam.bloodPressureSystolic}/{exam.bloodPressureDiastolic} mmHg
                              </div>
                            </td>
                            <td>
                              <span className={`nutrition-status ${exam.nutritionStatus?.toLowerCase()}`}>
                                {exam.nutritionStatus}
                              </span>
                            </td>
                            <td>
                              <div className="health-conditions">
                                {exam.hypertension === 'Ya' && <span className="condition-tag">Hipertensi</span>}
                                {exam.diabetes === 'Ya' && <span className="condition-tag">Diabetes</span>}
                                {exam.visionProblems === 'Ya' && <span className="condition-tag">Gangguan Penglihatan</span>}
                                {exam.hearingProblems === 'Ya' && <span className="condition-tag">Gangguan Pendengaran</span>}
                              </div>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="action-btn view"
                                  onClick={() => handleViewExamination(exam)}
                                  title="Lihat Detail"
                                >
                                  <Visibility />
                                </button>
                                <button
                                  className="action-btn edit"
                                  onClick={() => {
                                    setSelectedPatient(exam);
                                    setExamData(exam);
                                    setShowExamModal(true);
                                  }}
                                  title="Edit"
                                >
                                  <Edit />
                                </button>
                                <button
                                  className="action-btn delete"
                                  onClick={() => handleDeleteExamination(exam.id)}
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

                    {filteredExaminations.length === 0 && (
                      <div className="no-data">
                        <MedicalServices fontSize="large" />
                        <p>Tidak ada data pemeriksaan ditemukan</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Examination Modal */}
      <ExaminationModal
        isOpen={showExamModal}
        onClose={() => setShowExamModal(false)}
        title={selectedPatient ? "Edit Pemeriksaan" : "Tambah Pemeriksaan Baru"}
      >
        <form className="examination-form" onSubmit={handleSubmitExamination}>
          <div className="form-grid">
            <div className="form-group">
              <label>Pasien *</label>
              <select
                value={examData.patientId}
                onChange={(e) => handleFormChange('patientId', e.target.value)}
                className={formErrors.patientId ? 'error' : ''}
              >
                <option value="">Pilih Pasien</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.nik}
                  </option>
                ))}
              </select>
              {formErrors.patientId && <span className="error-message">{formErrors.patientId}</span>}
            </div>

            <div className="form-group">
              <label>Tanggal Pemeriksaan *</label>
              <input
                type="date"
                value={examData.examDate}
                onChange={(e) => handleFormChange('examDate', e.target.value)}
                className={formErrors.examDate ? 'error' : ''}
              />
              {formErrors.examDate && <span className="error-message">{formErrors.examDate}</span>}
            </div>

            <div className="form-group">
              <label>Berat Badan (kg) *</label>
              <input
                type="number"
                step="0.1"
                value={examData.weight}
                onChange={(e) => handleFormChange('weight', e.target.value)}
                placeholder="65.5"
                className={formErrors.weight ? 'error' : ''}
              />
              {formErrors.weight && <span className="error-message">{formErrors.weight}</span>}
            </div>

            <div className="form-group">
              <label>Tinggi Badan (cm) *</label>
              <input
                type="number"
                step="0.1"
                value={examData.height}
                onChange={(e) => handleFormChange('height', e.target.value)}
                placeholder="170.0"
                className={formErrors.height ? 'error' : ''}
              />
              {formErrors.height && <span className="error-message">{formErrors.height}</span>}
            </div>

            <div className="form-group">
              <label>Tekanan Darah Sistolik *</label>
              <input
                type="number"
                value={examData.bloodPressureSystolic}
                onChange={(e) => handleFormChange('bloodPressureSystolic', e.target.value)}
                placeholder="120"
                className={formErrors.bloodPressureSystolic ? 'error' : ''}
              />
              {formErrors.bloodPressureSystolic && <span className="error-message">{formErrors.bloodPressureSystolic}</span>}
            </div>

            <div className="form-group">
              <label>Tekanan Darah Diastolik *</label>
              <input
                type="number"
                value={examData.bloodPressureDiastolic}
                onChange={(e) => handleFormChange('bloodPressureDiastolic', e.target.value)}
                placeholder="80"
                className={formErrors.bloodPressureDiastolic ? 'error' : ''}
              />
              {formErrors.bloodPressureDiastolic && <span className="error-message">{formErrors.bloodPressureDiastolic}</span>}
            </div>

            <div className="form-group">
              <label>Status Gizi</label>
              <input
                type="text"
                value={examData.nutritionStatus}
                readOnly
                placeholder="Otomatis dihitung berdasarkan BMI"
              />
            </div>

            <div className="form-group">
              <label>Hipertensi</label>
              <select
                value={examData.hypertension}
                onChange={(e) => handleFormChange('hypertension', e.target.value)}
              >
                <option value="">Pilih</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>

            <div className="form-group">
              <label>Diabetes</label>
              <select
                value={examData.diabetes}
                onChange={(e) => handleFormChange('diabetes', e.target.value)}
              >
                <option value="">Pilih</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>

            <div className="form-group">
              <label>Kolesterol Tinggi</label>
              <select
                value={examData.highCholesterol}
                onChange={(e) => handleFormChange('highCholesterol', e.target.value)}
              >
                <option value="">Pilih</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>

            <div className="form-group">
              <label>Asam Urat Tinggi</label>
              <select
                value={examData.highUricAcid}
                onChange={(e) => handleFormChange('highUricAcid', e.target.value)}
              >
                <option value="">Pilih</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>

            <div className="form-group">
              <label>Gangguan Penglihatan</label>
              <select
                value={examData.visionProblems}
                onChange={(e) => handleFormChange('visionProblems', e.target.value)}
              >
                <option value="">Pilih</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>

            <div className="form-group">
              <label>Gangguan Pendengaran</label>
              <select
                value={examData.hearingProblems}
                onChange={(e) => handleFormChange('hearingProblems', e.target.value)}
              >
                <option value="">Pilih</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>

            <div className="form-group">
              <label>Diobati</label>
              <select
                value={examData.treatment}
                onChange={(e) => handleFormChange('treatment', e.target.value)}
              >
                <option value="">Pilih</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>

            <div className="form-group">
              <label>Dirujuk</label>
              <select
                value={examData.referral}
                onChange={(e) => handleFormChange('referral', e.target.value)}
              >
                <option value="">Pilih</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Catatan</label>
              <textarea
                value={examData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                placeholder="Catatan tambahan tentang pemeriksaan..."
                rows="3"
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowExamModal(false)}>
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Pemeriksaan'}
            </button>
          </div>
        </form>
      </ExaminationModal>

      {/* Monthly Report Modal */}
      <ExaminationModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Laporan Bulanan Pemeriksaan Kesehatan"
      >
        <div className="monthly-report">
          {(() => {
            const report = generateMonthlyReport();
            return (
              <div className="report-content">
                <div className="report-header">
                  <h3>Laporan Bulan {report.period}</h3>
                  <p>Total Pemeriksaan: {report.totalExaminations}</p>
                </div>

                <div className="report-table-container">
                  <table className="monthly-report-table">
                    <thead>
                      <tr>
                        <th>KUN. BARU</th>
                        <th>kunjungan</th>
                        <th colSpan="4">STATUS GIZI</th>
                        <th>HIPERTENSI</th>
                        <th>DIABETES</th>
                        <th>Hi. KOLESTEROL</th>
                        <th>Hi.ASAM URAT</th>
                        <th>GANGGUAN. PENGLIHATAN</th>
                        <th>GANGGUAN. PENDENGARAN</th>
                        <th>DIOBATI</th>
                        <th>DIRUJUK</th>
                      </tr>
                      <tr>
                        <th></th>
                        <th></th>
                        <th>KURUS</th>
                        <th>NORMAL</th>
                        <th>GEMUK</th>
                        <th>OBESITAS</th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{report.newVisits}</td>
                        <td>{report.totalExaminations}</td>
                        <td>{report.nutritionStats.kurus}</td>
                        <td>{report.nutritionStats.normal}</td>
                        <td>{report.nutritionStats.gemuk}</td>
                        <td>{report.nutritionStats.obesitas}</td>
                        <td>{report.healthConditions.hypertension}</td>
                        <td>{report.healthConditions.diabetes}</td>
                        <td>{report.healthConditions.highCholesterol}</td>
                        <td>{report.healthConditions.highUricAcid}</td>
                        <td>{report.healthConditions.visionProblems}</td>
                        <td>{report.healthConditions.hearingProblems}</td>
                        <td>{report.actions.treated}</td>
                        <td>{report.actions.referred}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="report-actions">
                  <button className="btn-secondary" onClick={() => setShowReportModal(false)}>
                    Tutup
                  </button>
                  <button className="btn-primary" onClick={() => window.print()}>
                    <Send />
                    Cetak Laporan
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </ExaminationModal>
    </div>
  );
}

export default PemeriksaanKesehatan;