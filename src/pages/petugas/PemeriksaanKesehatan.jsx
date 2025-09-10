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
    patient_id: '',
    exam_date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    nutrition_status: '',
    hypertension: '',
    diabetes: '',
    high_cholesterol: '',
    high_uric_acid: '',
    vision_problems: '',
    hearing_problems: '',
    treatment: '',
    referral: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [currentView, setCurrentView] = useState('examinations'); // 'examinations' or 'reports'

  const { loading, error, get, post, put, delete: deleteApi, clearError } = useApi();

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
  }, []);

  // Load examinations after patients are loaded
  useEffect(() => {
    if (patients.length > 0) {
      loadExaminations();
    }
  }, [patients]);

  const loadPatients = async () => {
    try {
      clearError();
      const response = await get('/api/patients');
      setPatients(response || []);
      console.log(response)
    } catch (err) {
      console.error('Error loading patients:', err);
      // Sample data for demo
    
    }
  };

  const loadExaminations = async () => {
    try {
      clearError();
      const response = await get('/api/examinations');
      const examData = response || [];

      // Map patient_id to patientName by finding patient details
      const mappedExams = examData.map(exam => {
        const patient = patients.find(p => p.id === exam.patient_id);
        return {
          ...exam,
          patientId: exam.patient_id,
          patientName: patient ? patient.name : `Patient ${exam.patient_id}`,
          examDate: new Date(exam.exam_date).toISOString().split('T')[0],
          exam_date: new Date(exam.exam_date).toISOString().split('T')[0],
          bloodPressureSystolic: exam.blood_pressure_systolic,
          bloodPressureDiastolic: exam.blood_pressure_diastolic,
          nutritionStatus: exam.nutrition_status,
          hypertension: exam.hypertension ? 'Ya' : 'Tidak',
          diabetes: exam.diabetes ? 'Ya' : 'Tidak',
          highCholesterol: exam.high_cholesterol ? 'Ya' : 'Tidak',
          highUricAcid: exam.high_uric_acid ? 'Ya' : 'Tidak',
          visionProblems: exam.vision_problems ? 'Ya' : 'Tidak',
          hearingProblems: exam.hearing_problems ? 'Ya' : 'Tidak',
          treatment: exam.treatment ? 'Ya' : 'Tidak',
          referral: exam.referral ? 'Ya' : 'Tidak'
        };
      });

      console.log(mappedExams)
      setExaminations(mappedExams);
    } catch (err) {
      console.error('Error loading examinations:', err);

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
    setSelectedPatient(null);
    setExamData({
      patient_id: '',
      exam_date: new Date().toISOString().split('T')[0],
      weight: '',
      height: '',
      blood_pressure_systolic: '',
      blood_pressure_diastolic: '',
      nutrition_status: '',
      hypertension: '',
      diabetes: '',
      high_cholesterol: '',
      high_uric_acid: '',
      vision_problems: '',
      hearing_problems: '',
      treatment: '',
      referral: '',
      notes: ''
    });
    setFormErrors({});
    setShowExamModal(true);
  };

  const handleFormChange = (field, value) => {
    // Prevent unnecessary re-renders by checking if value actually changed
    setExamData(prev => {
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
      const nutrition_status = calculateNutritionStatus(examData.weight, examData.height);
      setExamData(prev => ({
        ...prev,
        nutrition_status
      }));
    }
  };

  useEffect(() => {
    handleWeightHeightChange();
  }, [examData.weight, examData.height]);

  const validateForm = () => {
    const errors = {};

    if (!examData.patient_id) errors.patient_id = 'Pasien harus dipilih';
    if (!examData.exam_date) errors.exam_date = 'Tanggal pemeriksaan harus diisi';
    if (!examData.weight) errors.weight = 'Berat badan harus diisi';
    if (!examData.height) errors.height = 'Tinggi badan harus diisi';
    if (!examData.blood_pressure_systolic) errors.blood_pressure_systolic = 'Tekanan darah sistolik harus diisi';
    if (!examData.blood_pressure_diastolic) errors.blood_pressure_diastolic = 'Tekanan darah diastolik harus diisi';

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
     let response;

     // Check if we're editing (selectedPatient exists) or creating new
     if (selectedPatient && selectedPatient.id) {
       // Update existing examination
       response = await put(`/api/examinations/${selectedPatient.id}`, examData);
       setSuccessMessage('Pemeriksaan berhasil diperbarui');
     } else {
       // Create new examination
       response = await post('/api/examinations', examData);
       setSuccessMessage('Pemeriksaan berhasil disimpan');
     }

     if (response) {
       // Reload examinations to get updated data with proper mapping
       loadExaminations();
       setShowExamModal(false);
       setSelectedPatient(null);
       setTimeout(() => setSuccessMessage(''), 3000);
     }
   } catch (err) {
     console.error('Error saving examination:', err);
   }
 };

  const handleDeleteExamination = async (examId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data pemeriksaan ini?')) {
      try {
        clearError();
        await deleteApi(`/api/examinations/${examId}`);
        // Reload examinations after successful deletion
        loadExaminations();
        setSuccessMessage('Data pemeriksaan berhasil dihapus');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Error deleting examination:', err);
      }
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
                                {exam.nutritionStatus || exam.nutrition_status}
                              </span>
                            </td>
                            <td>
                              <div className="health-conditions">
                                {exam.hypertension === 'Ya' && <span className="condition-tag">Hipertensi</span>}
                                {exam.diabetes === 'Ya' && <span className="condition-tag">Diabetes</span>}
                                {exam.highCholesterol === 'Ya' && <span className="condition-tag">Kolesterol Tinggi</span>}
                                {exam.highUricAcid === 'Ya' && <span className="condition-tag">Asam Urat Tinggi</span>}
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
                                    setExamData({
                                      patient_id: exam.patient_id || exam.patientId,
                                      exam_date: exam.exam_date || exam.examDate,
                                      weight: exam.weight,
                                      height: exam.height,
                                      blood_pressure_systolic: exam.blood_pressure_systolic || exam.bloodPressureSystolic,
                                      blood_pressure_diastolic: exam.blood_pressure_diastolic || exam.bloodPressureDiastolic,
                                      nutrition_status: exam.nutrition_status || exam.nutritionStatus,
                                      hypertension: exam.hypertension,
                                      diabetes: exam.diabetes,
                                      high_cholesterol: exam.high_cholesterol || exam.highCholesterol,
                                      high_uric_acid: exam.high_uric_acid || exam.highUricAcid,
                                      vision_problems: exam.vision_problems || exam.visionProblems,
                                      hearing_problems: exam.hearing_problems || exam.hearingProblems,
                                      treatment: exam.treatment,
                                      referral: exam.referral,
                                      notes: exam.notes
                                    });
                                    setFormErrors({});
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
        onClose={() => {
          setShowExamModal(false);
          setSelectedPatient(null);
        }}
        title={selectedPatient ? "Edit Pemeriksaan" : "Tambah Pemeriksaan Baru"}
      >
        <form className="examination-form" onSubmit={handleSubmitExamination}>
          <div className="form-grid">
            <div className="form-group">
              <label>Pasien *</label>
              <select
                value={examData.patient_id}
                onChange={(e) => handleFormChange('patient_id', e.target.value)}
                className={formErrors.patient_id ? 'error' : ''}
              >
                <option value="">Pilih Pasien</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.nik}
                  </option>
                ))}
              </select>
              {formErrors.patient_id && <span className="error-message">{formErrors.patient_id}</span>}
            </div>

            <div className="form-group">
              <label>Tanggal Pemeriksaan *</label>
              <input
                type="date"
                value={examData.exam_date}
                onChange={(e) => handleFormChange('exam_date', e.target.value)}
                className={formErrors.exam_date ? 'error' : ''}
              />
              {formErrors.exam_date && <span className="error-message">{formErrors.exam_date}</span>}
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
                value={examData.blood_pressure_systolic}
                onChange={(e) => handleFormChange('blood_pressure_systolic', e.target.value)}
                placeholder="120"
                className={formErrors.blood_pressure_systolic ? 'error' : ''}
              />
              {formErrors.blood_pressure_systolic && <span className="error-message">{formErrors.blood_pressure_systolic}</span>}
            </div>

            <div className="form-group">
              <label>Tekanan Darah Diastolik *</label>
              <input
                type="number"
                value={examData.blood_pressure_diastolic}
                onChange={(e) => handleFormChange('blood_pressure_diastolic', e.target.value)}
                placeholder="80"
                className={formErrors.blood_pressure_diastolic ? 'error' : ''}
              />
              {formErrors.blood_pressure_diastolic && <span className="error-message">{formErrors.blood_pressure_diastolic}</span>}
            </div>

            <div className="form-group">
              <label>Status Gizi</label>
              <input
                type="text"
                value={examData.nutrition_status}
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
                value={examData.high_cholesterol}
                onChange={(e) => handleFormChange('high_cholesterol', e.target.value)}
              >
                <option value="">Pilih</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>

            <div className="form-group">
              <label>Asam Urat Tinggi</label>
              <select
                value={examData.high_uric_acid}
                onChange={(e) => handleFormChange('high_uric_acid', e.target.value)}
              >
                <option value="">Pilih</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>

            <div className="form-group">
              <label>Gangguan Penglihatan</label>
              <select
                value={examData.vision_problems}
                onChange={(e) => handleFormChange('vision_problems', e.target.value)}
              >
                <option value="">Pilih</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>

            <div className="form-group">
              <label>Gangguan Pendengaran</label>
              <select
                value={examData.hearing_problems}
                onChange={(e) => handleFormChange('hearing_problems', e.target.value)}
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