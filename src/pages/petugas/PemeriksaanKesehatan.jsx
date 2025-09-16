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
import Sidebar from '../../components/Sidebar';

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
    blood_sugar: '',
    nutrition_status: '',
    hypertension: '',
    diabetes: '',
    cholesterol: '',
    uric_acid: '',
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
      const response = await get('/patients');
      console.log('Patients API response:', response);
      setPatients(response || []);
    } catch (err) {
      console.error('Error loading patients:', err);
      // Set empty array on error to prevent issues
      setPatients([]);
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
        const bmi = calculateBMI(exam.weight, exam.height);
        const bloodPressureStatus = getBloodPressureStatus(exam.blood_pressure_systolic, exam.blood_pressure_diastolic);
        const bloodSugarStatus = getBloodSugarStatus(exam.blood_sugar);
        const cholesterolStatus = getCholesterolStatus(exam.cholesterol);
        const uricAcidStatus = getUricAcidStatus(exam.uric_acid);
        
        return {
          ...exam,
          patientId: exam.patient_id,
          patientName: patient ? patient.name : `Patient ${exam.patient_id}`,
          examDate: new Date(exam.exam_date).toISOString().split('T')[0],
          exam_date: new Date(exam.exam_date).toISOString().split('T')[0],
          bloodPressureSystolic: exam.blood_pressure_systolic,
          bloodPressureDiastolic: exam.blood_pressure_diastolic,
          bloodSugar: exam.blood_sugar,
          cholesterol: exam.cholesterol,
          uricAcid: exam.uric_acid,
          bmi: bmi,
          bloodPressureStatus: bloodPressureStatus,
          bloodSugarStatus: bloodSugarStatus,
          cholesterolStatus: cholesterolStatus,
          uricAcidStatus: uricAcidStatus,
          nutritionStatus: exam.nutrition_status,
          hypertension: exam.hypertension ? 'Ya' : 'Tidak',
          diabetes: exam.diabetes ? 'Ya' : 'Tidak',
          highCholesterol: exam.cholesterol ? (exam.cholesterol > 200 ? 'Ya' : 'Tidak') : 'Tidak',
          highUricAcid: exam.uric_acid ? (exam.uric_acid > 7.0 ? 'Ya' : 'Tidak') : 'Tidak',
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
      blood_sugar: '',
      nutrition_status: '',
      hypertension: '',
      diabetes: '',
      cholesterol: '',
      uric_acid: '',
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


  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
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

  const getBloodPressureStatus = (systolic, diastolic) => {
    if (!systolic || !diastolic) return '';
    
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    
    if (sys < 90 || dia < 60) return 'RENDAH';
    if (sys >= 140 || dia >= 90) return 'TINGGI';
    return 'NORMAL';
  };

  const getBloodSugarStatus = (bloodSugar) => {
    if (!bloodSugar) return '';
    
    const sugar = parseInt(bloodSugar);
    
    if (sugar < 70) return 'RENDAH';
    if (sugar > 140) return 'TINGGI';
    return 'NORMAL';
  };

  const getCholesterolStatus = (cholesterol) => {
    if (!cholesterol) return '';
    
    const chol = parseFloat(cholesterol);
    
    if (chol > 200) return 'TINGGI';
    return 'NORMAL';
  };

  const getUricAcidStatus = (uricAcid) => {
    if (!uricAcid) return '';
    
    const uric = parseFloat(uricAcid);
    
    if (uric > 7.0) return 'TINGGI';
    return 'NORMAL';
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

  // Helper: determine age group from birthDate (string 'YYYY-MM-DD' or Date)
  const getAgeGroupFromBirthDate = (birthDate) => {
    if (!birthDate) return 'Unknown';
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : new Date(birthDate);
    if (Number.isNaN(birth.getTime())) return 'Unknown';
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    if (age < 5) return 'Balita';
    if (age >= 5 && age <= 17) return 'Remaja';
    if (age >= 18 && age <= 59) return 'Dewasa';
    if (age >= 60) return 'Lansia';
    return 'Unknown';
  };

  const generateMonthlyReport = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExams = examinations.filter(exam => {
      const examDate = new Date(exam.examDate);
      return examDate.getMonth() === currentMonth && examDate.getFullYear() === currentYear;
    });

    // Build quick lookup for patients by id (normalize to string keys)
    const patientById = new Map(patients.map(p => [String(p.id), p]));

    // Initialize groups
    const ageGroups = ['Balita', 'Remaja', 'Dewasa', 'Lansia'];
    const defaultStats = () => ({
      newVisits: 0,
      total: 0,
      nutrition: { kurus: 0, normal: 0, gemuk: 0, obesitas: 0 },
      conditions: {
        hypertension: 0,
        diabetes: 0,
        highCholesterol: 0,
        highUricAcid: 0,
        visionProblems: 0,
        hearingProblems: 0
      },
      actions: { treated: 0, referred: 0 }
    });

    const grouped = {
      Balita: defaultStats(),
      Remaja: defaultStats(),
      Dewasa: defaultStats(),
      Lansia: defaultStats()
    };

    monthlyExams.forEach(exam => {
      const pid = exam.patientId != null ? String(exam.patientId) : (exam.patient_id != null ? String(exam.patient_id) : undefined);
      const patient = pid ? patientById.get(pid) : undefined;
      // Default to 'Dewasa' when patient or birthDate missing to avoid dropping rows
      const derivedGroup = patient && patient.birthDate ? getAgeGroupFromBirthDate(patient.birthDate) : 'Dewasa';
      const group = grouped[derivedGroup] ? derivedGroup : 'Dewasa';

      const g = grouped[group];
      g.total += 1;
      if (exam.isNewVisit) g.newVisits += 1;

      // Nutrition
      const ns = (exam.nutritionStatus || exam.nutrition_status || '').toUpperCase();
      if (ns === 'KURUS') g.nutrition.kurus += 1;
      else if (ns === 'NORMAL') g.nutrition.normal += 1;
      else if (ns === 'GEMUK') g.nutrition.gemuk += 1;
      else if (ns === 'OBESITAS') g.nutrition.obesitas += 1;

      // Conditions (values are 'Ya'/'Tidak')
      if (exam.hypertension === 'Ya') g.conditions.hypertension += 1;
      if (exam.diabetes === 'Ya') g.conditions.diabetes += 1;
      if (exam.highCholesterol === 'Ya') g.conditions.highCholesterol += 1;
      if (exam.highUricAcid === 'Ya') g.conditions.highUricAcid += 1;
      if (exam.visionProblems === 'Ya') g.conditions.visionProblems += 1;
      if (exam.hearingProblems === 'Ya') g.conditions.hearingProblems += 1;

      // Actions
      if (exam.treatment === 'Ya') g.actions.treated += 1;
      if (exam.referral === 'Ya') g.actions.referred += 1;
    });

    // Totals across groups
    const totals = ageGroups.reduce((acc, key) => {
      const g = grouped[key];
      acc.newVisits += g.newVisits;
      acc.total += g.total;
      acc.nutrition.kurus += g.nutrition.kurus;
      acc.nutrition.normal += g.nutrition.normal;
      acc.nutrition.gemuk += g.nutrition.gemuk;
      acc.nutrition.obesitas += g.nutrition.obesitas;
      acc.conditions.hypertension += g.conditions.hypertension;
      acc.conditions.diabetes += g.conditions.diabetes;
      acc.conditions.highCholesterol += g.conditions.highCholesterol;
      acc.conditions.highUricAcid += g.conditions.highUricAcid;
      acc.conditions.visionProblems += g.conditions.visionProblems;
      acc.conditions.hearingProblems += g.conditions.hearingProblems;
      acc.actions.treated += g.actions.treated;
      acc.actions.referred += g.actions.referred;
      return acc;
    }, { newVisits: 0, total: 0, nutrition: { kurus: 0, normal: 0, gemuk: 0, obesitas: 0 }, conditions: { hypertension: 0, diabetes: 0, highCholesterol: 0, highUricAcid: 0, visionProblems: 0, hearingProblems: 0 }, actions: { treated: 0, referred: 0 } });

    return {
      period: `${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`,
      groups: grouped,
      totals
    };
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
    <Sidebar>
    <div className="pemeriksaan-kesehatan-page">
      <div className="pemeriksaan-kesehatan-container">
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
                          <th>IMT</th>
                          <th>Tekanan Darah</th>
                          <th>Gula Darah</th>
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
                              <div className="bmi-info">
                                <div className="bmi-value">
                                  {exam.bmi || 'N/A'}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="blood-pressure">
                                <Favorite fontSize="small" />
                                <div>
                                  <div>{exam.bloodPressureSystolic}/{exam.bloodPressureDiastolic} mmHg</div>
                                  <div className={`status-tag ${exam.bloodPressureStatus?.toLowerCase()}`}>
                                    {exam.bloodPressureStatus || 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="blood-sugar">
                                <Bloodtype fontSize="small" />
                                <div>
                                  <div>{exam.bloodSugar || 'N/A'} mg/dL</div>
                                  <div className={`status-tag ${exam.bloodSugarStatus?.toLowerCase()}`}>
                                    {exam.bloodSugarStatus || 'N/A'}
                                  </div>
                                </div>
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
                                {exam.cholesterol && (
                                  <div className="condition-item">
                                    <span className="condition-value">Kolesterol: {exam.cholesterol} mg/dL</span>
                                    <span className={`status-tag ${exam.cholesterolStatus?.toLowerCase()}`}>
                                      {exam.cholesterolStatus}
                                    </span>
                                  </div>
                                )}
                                {exam.uric_acid && (
                                  <div className="condition-item">
                                    <span className="condition-value">Asam Urat: {exam.uric_acid} mg/dL</span>
                                    <span className={`status-tag ${exam.uricAcidStatus?.toLowerCase()}`}>
                                      {exam.uricAcidStatus}
                                    </span>
                                  </div>
                                )}
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
                                      blood_sugar: exam.blood_sugar || exam.bloodSugar,
                                      nutrition_status: exam.nutrition_status || exam.nutritionStatus,
                                      hypertension: exam.hypertension,
                                      diabetes: exam.diabetes,
                                      cholesterol: exam.cholesterol,
                                      uric_acid: exam.uric_acid,
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
                {loading ? (
                  <option value="" disabled>Memuat data pasien...</option>
                ) : patients.length === 0 ? (
                  <option value="" disabled>Tidak ada pasien tersedia</option>
                ) : (
                  patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.nik}
                    </option>
                  ))
                )}
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
              <label>Gula Darah (mg/dL)</label>
              <input
                type="number"
                value={examData.blood_sugar}
                onChange={(e) => handleFormChange('blood_sugar', e.target.value)}
                placeholder="100"
              />
            </div>

            <div className="form-group">
              <label>IMT (Indeks Massa Tubuh)</label>
              <input
                type="text"
                value={calculateBMI(examData.weight, examData.height) || ''}
                readOnly
                placeholder="Otomatis dihitung"
              />
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
              <label>Status Tekanan Darah</label>
              <input
                type="text"
                value={getBloodPressureStatus(examData.blood_pressure_systolic, examData.blood_pressure_diastolic) || ''}
                readOnly
                placeholder="Otomatis dihitung"
              />
            </div>

            <div className="form-group">
              <label>Status Gula Darah</label>
              <input
                type="text"
                value={getBloodSugarStatus(examData.blood_sugar) || ''}
                readOnly
                placeholder="Otomatis dihitung"
              />
            </div>

            <div className="form-group">
              <label>Kolesterol (mg/dL)</label>
              <input
                type="number"
                step="0.1"
                value={examData.cholesterol}
                onChange={(e) => handleFormChange('cholesterol', e.target.value)}
                placeholder="200"
              />
            </div>

            <div className="form-group">
              <label>Status Kolesterol</label>
              <input
                type="text"
                value={getCholesterolStatus(examData.cholesterol) || ''}
                readOnly
                placeholder="Otomatis dihitung"
              />
            </div>

            <div className="form-group">
              <label>Asam Urat (mg/dL)</label>
              <input
                type="number"
                step="0.1"
                value={examData.uric_acid}
                onChange={(e) => handleFormChange('uric_acid', e.target.value)}
                placeholder="7.0"
              />
            </div>

            <div className="form-group">
              <label>Status Asam Urat</label>
              <input
                type="text"
                value={getUricAcidStatus(examData.uric_acid) || ''}
                readOnly
                placeholder="Otomatis dihitung"
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
                  <p>Total Pemeriksaan: {report.totals.total}</p>
                </div>

                <div className="report-table-container">
                  <table className="monthly-report-table">
                    <thead>
                      <tr>
                        <th>KELOMPOK USIA</th>
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
                        <td style={{ fontWeight: 700 }}>Balita</td>
                        <td>{report.groups.Balita.total}</td>
                        <td>{report.groups.Balita.nutrition.kurus}</td>
                        <td>{report.groups.Balita.nutrition.normal}</td>
                        <td>{report.groups.Balita.nutrition.gemuk}</td>
                        <td>{report.groups.Balita.nutrition.obesitas}</td>
                        <td>{report.groups.Balita.conditions.hypertension}</td>
                        <td>{report.groups.Balita.conditions.diabetes}</td>
                        <td>{report.groups.Balita.conditions.highCholesterol}</td>
                        <td>{report.groups.Balita.conditions.highUricAcid}</td>
                        <td>{report.groups.Balita.conditions.visionProblems}</td>
                        <td>{report.groups.Balita.conditions.hearingProblems}</td>
                        <td>{report.groups.Balita.actions.treated}</td>
                        <td>{report.groups.Balita.actions.referred}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 700 }}>Remaja</td>
                        <td>{report.groups.Remaja.total}</td>
                        <td>{report.groups.Remaja.nutrition.kurus}</td>
                        <td>{report.groups.Remaja.nutrition.normal}</td>
                        <td>{report.groups.Remaja.nutrition.gemuk}</td>
                        <td>{report.groups.Remaja.nutrition.obesitas}</td>
                        <td>{report.groups.Remaja.conditions.hypertension}</td>
                        <td>{report.groups.Remaja.conditions.diabetes}</td>
                        <td>{report.groups.Remaja.conditions.highCholesterol}</td>
                        <td>{report.groups.Remaja.conditions.highUricAcid}</td>
                        <td>{report.groups.Remaja.conditions.visionProblems}</td>
                        <td>{report.groups.Remaja.conditions.hearingProblems}</td>
                        <td>{report.groups.Remaja.actions.treated}</td>
                        <td>{report.groups.Remaja.actions.referred}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 700 }}>Dewasa</td>
                        <td>{report.groups.Dewasa.total}</td>
                        <td>{report.groups.Dewasa.nutrition.kurus}</td>
                        <td>{report.groups.Dewasa.nutrition.normal}</td>
                        <td>{report.groups.Dewasa.nutrition.gemuk}</td>
                        <td>{report.groups.Dewasa.nutrition.obesitas}</td>
                        <td>{report.groups.Dewasa.conditions.hypertension}</td>
                        <td>{report.groups.Dewasa.conditions.diabetes}</td>
                        <td>{report.groups.Dewasa.conditions.highCholesterol}</td>
                        <td>{report.groups.Dewasa.conditions.highUricAcid}</td>
                        <td>{report.groups.Dewasa.conditions.visionProblems}</td>
                        <td>{report.groups.Dewasa.conditions.hearingProblems}</td>
                        <td>{report.groups.Dewasa.actions.treated}</td>
                        <td>{report.groups.Dewasa.actions.referred}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 700 }}>Lansia</td>
                        <td>{report.groups.Lansia.total}</td>
                        <td>{report.groups.Lansia.nutrition.kurus}</td>
                        <td>{report.groups.Lansia.nutrition.normal}</td>
                        <td>{report.groups.Lansia.nutrition.gemuk}</td>
                        <td>{report.groups.Lansia.nutrition.obesitas}</td>
                        <td>{report.groups.Lansia.conditions.hypertension}</td>
                        <td>{report.groups.Lansia.conditions.diabetes}</td>
                        <td>{report.groups.Lansia.conditions.highCholesterol}</td>
                        <td>{report.groups.Lansia.conditions.highUricAcid}</td>
                        <td>{report.groups.Lansia.conditions.visionProblems}</td>
                        <td>{report.groups.Lansia.conditions.hearingProblems}</td>
                        <td>{report.groups.Lansia.actions.treated}</td>
                        <td>{report.groups.Lansia.actions.referred}</td>
                      </tr>
                      <tr style={{ fontWeight: 700 }}>
                        <td>TOTAL</td>
                        <td>{report.totals.total}</td>
                        <td>{report.totals.nutrition.kurus}</td>
                        <td>{report.totals.nutrition.normal}</td>
                        <td>{report.totals.nutrition.gemuk}</td>
                        <td>{report.totals.nutrition.obesitas}</td>
                        <td>{report.totals.conditions.hypertension}</td>
                        <td>{report.totals.conditions.diabetes}</td>
                        <td>{report.totals.conditions.highCholesterol}</td>
                        <td>{report.totals.conditions.highUricAcid}</td>
                        <td>{report.totals.conditions.visionProblems}</td>
                        <td>{report.totals.conditions.hearingProblems}</td>
                        <td>{report.totals.actions.treated}</td>
                        <td>{report.totals.actions.referred}</td>
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
    </Sidebar>
  );
}

export default PemeriksaanKesehatan;