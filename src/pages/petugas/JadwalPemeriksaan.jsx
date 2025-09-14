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
  ChevronRight
} from '@mui/icons-material';
import './JadwalPemeriksaan.css';
import useApi from '../../hooks/useApi';
import Sidebar from '../../components/Sidebar';

const ScheduleModal = ({ isOpen, onClose, title, children }) => {
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

// Calendar Component
const CalendarView = ({ schedules, onDateClick, onScheduleClick, selectedDate, onClearDateFilter }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const dayNames = ['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };
  
  const getSchedulesForDate = (date) => {
    if (!date) return [];
    // Use local date formatting to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return schedules.filter(schedule => {
      // Handle both date formats: "2025-09-20" and "2025-09-20T17:00:00.000Z"
      const scheduleDate = schedule.visit_date.split('T')[0];
      return scheduleDate === dateStr;
    });
  };

  const isDateSelected = (date) => {
    if (!date || !selectedDate) return false;
    // Use local date formatting to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return dateStr === selectedDate;
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Terjadwal': return 'status-scheduled';
      case 'Selesai': return 'status-completed';
      case 'Dibatalkan': return 'status-cancelled';
      case 'Ditunda': return 'status-postponed';
      default: return 'status-default';
    }
  };
  
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const days = getDaysInMonth(currentDate);
  
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={() => navigateMonth(-1)}>
          <ChevronLeft />
        </button>
        <h3 className="calendar-title">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button className="calendar-nav-btn" onClick={() => navigateMonth(1)}>
          <ChevronRight />
        </button>
        <button className="calendar-today-btn" onClick={goToToday}>
          Hari Ini
        </button>
        {selectedDate && (
          <button className="calendar-clear-btn" onClick={onClearDateFilter}>
            Hapus Filter
          </button>
        )}
      </div>
      
      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {dayNames.map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>
        
        <div className="calendar-days">
          {days.map((day, index) => {
            const daySchedules = getSchedulesForDate(day);
            const isToday = day && day.toDateString() === new Date().toDateString();
            const isSelected = isDateSelected(day);
            
            return (
              <div
                key={index}
                className={`calendar-day ${!day ? 'calendar-day-empty' : ''} ${isToday ? 'calendar-day-today' : ''} ${isSelected ? 'calendar-day-selected' : ''}`}
                onClick={() => day && onDateClick(day)}
              >
                {day && (
                  <>
                    <div className="calendar-day-number">{day.getDate()}</div>
                    <div className="calendar-day-schedules">
                      {daySchedules.slice(0, 3).map((schedule, idx) => (
                        <div
                          key={idx}
                          className={`calendar-schedule-item ${getStatusColor(schedule.status)}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onScheduleClick(schedule);
                          }}
                          title={`${schedule.patient_name} - ${schedule.visit_time}`}
                        >
                          {schedule.patient_name}
                        </div>
                      ))}
                      {daySchedules.length > 3 && (
                        <div className="calendar-schedule-more">
                          +{daySchedules.length - 3} lagi
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function JadwalPemeriksaan() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('schedule');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [schedules, setSchedules] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: '',
    visit_date: '',
    visit_time: '',
    visit_type: 'Rumah',
    notes: '',
    status: 'Terjadwal',
    examination_type: 'Pemeriksaan Rutin',
    petugas_id: ''
  });
  const [isWeeklySchedule, setIsWeeklySchedule] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

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
        { id: 'vaccinations', icon: Vaccines, label: 'Vaksinasi', path: '/dashboard/vaccinations' },
        { id: 'schedule', icon: Schedule, label: 'Jadwal Pemeriksaan', path: '/dashboard/schedulevisit', active: true }
      ]
    }
  ];

  // Load schedules and patients data on component mount
  useEffect(() => {
    loadSchedules();
    loadPatients();
  }, []);

  const loadSchedules = async () => {
    try {
      clearError();
      const data = await get('/api/jadwal-pemeriksaan');
      setSchedules(data);
    } catch (err) {
      console.error('Error loading schedules:', err);
    }
  };

  const loadPatients = async () => {
    try {
      clearError();
      const data = await get('/patients');
      setPatients(data);
    } catch (err) {
      console.error('Error loading patients:', err);
    }
  };

  // Load schedules with filters
  const loadSchedulesWithFilters = async () => {
    try {
      clearError();
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (searchTerm.trim()) {
        // For now, we'll filter on the frontend since the backend doesn't have search yet
        // In a real implementation, you'd add search parameters to the API
      }
      
      const data = await get('/api/jadwal-pemeriksaan', params);
      setSchedules(data);
    } catch (err) {
      console.error('Error loading schedules:', err);
    }
  };

  // Filter schedules based on search term, status, and selected date
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = !searchTerm.trim() || 
      (schedule.patient_name && schedule.patient_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (schedule.patient_phone && schedule.patient_phone.includes(searchTerm)) ||
      (schedule.patient_address && schedule.patient_address.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || schedule.status === filterStatus;
    
    const matchesDate = !selectedDate || schedule.visit_date.split('T')[0] === selectedDate;
    
    return matchesSearch && matchesFilter && matchesDate;
  });

  const handleViewSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setShowViewModal(true);
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      patient_id: schedule.patient_id.toString(),
      visit_date: schedule.visit_date.split('T')[0], // Extract just the date part
      visit_time: schedule.visit_time,
      visit_type: schedule.visit_type,
      notes: schedule.notes,
      status: schedule.status,
      examination_type: schedule.examination_type || 'Pemeriksaan Rutin',
      petugas_id: schedule.petugas_id || ''
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal pemeriksaan ini?')) {
      try {
        clearError();
        await del(`/api/jadwal-pemeriksaan/${scheduleId}`);
        setSchedules(schedules.filter(s => s.id !== scheduleId));
        setSuccessMessage('Jadwal pemeriksaan berhasil dihapus');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Error deleting schedule:', err);
      }
    }
  };

  const handleAddSchedule = () => {
    setFormData({
      patient_id: '',
      visit_date: '',
      visit_time: '',
      visit_type: 'Rumah',
      notes: '',
      status: 'Terjadwal',
      examination_type: 'Pemeriksaan Rutin',
      petugas_id: ''
    });
    setFormErrors({});
    setIsWeeklySchedule(false);
    setShowAddModal(true);
  };

  // Calendar handlers
  const handleDateClick = (date) => {
    // Use local date formatting to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    setSelectedDate(dateStr);
    // Clear search term when filtering by date
    setSearchTerm('');
  };

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
    setShowViewModal(true);
  };

  const clearDateFilter = () => {
    setSelectedDate(null);
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

  const validateForm = () => {
    const errors = {};
    
    if (!formData.patient_id) errors.patient_id = 'Pilih pasien terlebih dahulu';
    if (!formData.visit_date) errors.visit_date = 'Tanggal kunjungan harus diisi';
    if (!formData.visit_time) errors.visit_time = 'Waktu kunjungan harus diisi';
    if (!formData.notes.trim()) errors.notes = 'Catatan harus diisi';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitSchedule = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    try {
      clearError();
      
      if (isWeeklySchedule) {
        // Create weekly schedule
        const response = await post('/api/jadwal-pemeriksaan/weekly', {
          patient_id: parseInt(formData.patient_id),
          start_date: formData.visit_date,
          visit_time: formData.visit_time,
          visit_type: formData.visit_type,
          petugas_id: formData.petugas_id ? parseInt(formData.petugas_id) : null,
          examination_type: formData.examination_type,
          notes: formData.notes
        });
        
        setSchedules(prev => [...prev, ...response.schedules]);
        setSuccessMessage('Jadwal mingguan berhasil dibuat (4 minggu)');
      } else {
        // Create single schedule
        const response = await post('/api/jadwal-pemeriksaan', {
          patient_id: parseInt(formData.patient_id),
          visit_date: formData.visit_date,
          visit_time: formData.visit_time,
          visit_type: formData.visit_type,
          status: formData.status,
          notes: formData.notes,
          examination_type: formData.examination_type,
          petugas_id: formData.petugas_id ? parseInt(formData.petugas_id) : null
        });
        
        setSchedules(prev => [...prev, response]);
        setSuccessMessage('Jadwal pemeriksaan berhasil ditambahkan');
      }
      
      setShowAddModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error adding schedule:', err);
    }
  };

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    try {
      clearError();
      const response = await put(`/api/jadwal-pemeriksaan/${selectedSchedule.id}`, {
        patient_id: parseInt(formData.patient_id),
        visit_date: formData.visit_date,
        visit_time: formData.visit_time,
        visit_type: formData.visit_type,
        status: formData.status,
        notes: formData.notes,
        examination_type: formData.examination_type,
        petugas_id: formData.petugas_id ? parseInt(formData.petugas_id) : null
      });

      setSchedules(prev => prev.map(s => s.id === selectedSchedule.id ? response : s));
      setShowEditModal(false);
      setSuccessMessage('Jadwal pemeriksaan berhasil diperbarui');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating schedule:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Terjadwal': return 'scheduled';
      case 'Selesai': return 'completed';
      case 'Dibatalkan': return 'cancelled';
      default: return 'scheduled';
    }
  };

  const handleStatusUpdate = async (scheduleId, newStatus, notes = '') => {
    try {
      clearError();
      const response = await put(`/api/jadwal-pemeriksaan/${scheduleId}/status`, {
        status: newStatus,
        notes: notes
      });
      
      setSchedules(prev => prev.map(s => s.id === scheduleId ? response.schedule : s));
      setSuccessMessage(`Status berhasil diubah menjadi ${newStatus}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const getUpcomingSchedules = () => {
    const today = new Date();
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.visit_date);
      return scheduleDate >= today && schedule.status === 'Terjadwal';
    }).slice(0, 5);
  };

  return (
    <Sidebar>
    <div className="jadwal-pemeriksaan-page">
      <div className="jadwal-pemeriksaan-container">
        {/* Main Content */}
        <main className="jadwal-pemeriksaan-main">
          {/* Header */}
          <section className="jadwal-pemeriksaan-header">
            <div className="container">
              <div className="header-content">
                <h1 className="page-title">Jadwal Pemeriksaan</h1>
                <p className="page-subtitle">
                  Kelola jadwal kunjungan pemeriksaan kesehatan ke rumah pasien
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
                    <Schedule />
                  </div>
                  <div className="stat-value">{schedules.length}</div>
                  <div className="stat-label">Total Jadwal</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Today />
                  </div>
                  <div className="stat-value">
                    {schedules.filter(s => s.status === 'Terjadwal').length}
                  </div>
                  <div className="stat-label">Terjadwal</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <CheckCircle />
                  </div>
                  <div className="stat-value">
                    {schedules.filter(s => s.status === 'Selesai').length}
                  </div>
                  <div className="stat-label">Selesai</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Home />
                  </div>
                  <div className="stat-value">
                    {schedules.filter(s => s.visitType === 'Rumah').length}
                  </div>
                  <div className="stat-label">Kunjungan Rumah</div>
                </div>
              </div>
            </div>
          </section>

          {/* Calendar Section */}
          {showCalendar && (
            <section className="calendar-section">
              <div className="container">
                <div className="calendar-header-section">
                  <h2 className="section-title">Kalender Jadwal Pemeriksaan</h2>
                  <button 
                    className="btn-toggle-calendar"
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    <DateRange />
                    {showCalendar ? 'Sembunyikan Kalender' : 'Tampilkan Kalender'}
                  </button>
                </div>
                <CalendarView
                  schedules={schedules}
                  onDateClick={handleDateClick}
                  onScheduleClick={handleScheduleClick}
                  selectedDate={selectedDate}
                  onClearDateFilter={clearDateFilter}
                />
              </div>
            </section>
          )}

          {/* Schedule Management Section */}
          <section className="schedule-management-section">
            <div className="container">
              <div className="management-header">
                <div className="management-title-section">
                  <h2 className="section-title">Daftar Jadwal Pemeriksaan</h2>
                  {selectedDate && (
                    <div className="date-filter-indicator">
                      <CalendarToday fontSize="small" />
                      <span>Menampilkan jadwal untuk: {(() => {
                        const [year, month, day] = selectedDate.split('-');
                        const date = new Date(year, month - 1, day);
                        return date.toLocaleDateString('id-ID', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        });
                      })()}</span>
                      <button 
                        className="clear-date-filter-btn"
                        onClick={clearDateFilter}
                        title="Hapus filter tanggal"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                <button className="btn-add-schedule" onClick={handleAddSchedule}>
                  <Add />
                  Tambah Jadwal
                </button>
              </div>

              {/* Search and Filter */}
              <div className="search-filter-container">
                <div className="search-box">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama pasien, nomor telepon, atau alamat..."
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
                    <option value="Terjadwal">Terjadwal</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>
              </div>

              {/* Schedule Table */}
              <div className="schedule-table-container">
                {loading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Memuat data jadwal...</p>
                  </div>
                ) : (
                  <div className="schedule-table-wrapper">
                    <table className="schedule-table">
                      <thead>
                        <tr>
                          <th>Pasien</th>
                          <th>Tanggal & Waktu</th>
                          <th>Jenis Kunjungan</th>
                          <th>Status</th>
                          <th>Catatan</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSchedules.map((schedule) => (
                          <tr key={schedule.id}>
                            <td>
                              <div className="patient-info">
                                <div className="patient-avatar">
                                  <Person />
                                </div>
                                <div>
                                  <div className="patient-name">{schedule.patient_name}</div>
                                  <div className="patient-phone">{schedule.patient_phone}</div>
                                  <div className="patient-address">{schedule.patient_address}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="schedule-datetime">
                                <div className="schedule-date">
                                  <CalendarToday fontSize="small" />
                                  {schedule.visit_date.split('T')[0].split('-').reverse().join('/')}
                                </div>
                                <div className="schedule-time">
                                  <AccessTime fontSize="small" />
                                  {schedule.visit_time}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="visit-type">
                                <Home fontSize="small" />
                                {schedule.visit_type}
                              </div>
                            </td>
                            <td>
                              <span className={`status-badge ${getStatusColor(schedule.status)}`}>
                                {schedule.status}
                              </span>
                            </td>
                            <td>
                              <div className="schedule-notes">
                                {schedule.notes}
                              </div>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="action-btn view"
                                  onClick={() => handleViewSchedule(schedule)}
                                  title="Lihat Detail"
                                >
                                  <Visibility />
                                </button>
                                <button
                                  className="action-btn edit"
                                  onClick={() => handleEditSchedule(schedule)}
                                  title="Edit"
                                >
                                  <Edit />
                                </button>
                                {schedule.status === 'Terjadwal' && (
                                  <button
                                    className="action-btn complete"
                                    onClick={() => handleStatusUpdate(schedule.id, 'Selesai')}
                                    title="Tandai Selesai"
                                  >
                                    <CheckCircle />
                                  </button>
                                )}
                                <button
                                  className="action-btn delete"
                                  onClick={() => handleDeleteSchedule(schedule.id)}
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

                    {filteredSchedules.length === 0 && (
                      <div className="no-data">
                        <Schedule fontSize="large" />
                        <p>Tidak ada jadwal pemeriksaan ditemukan</p>
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

      {/* View Schedule Modal */}
      <ScheduleModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Detail Jadwal Pemeriksaan"
      >
        {selectedSchedule && (
          <div className="schedule-detail">
            <div className="schedule-detail-header">
              <div className="patient-avatar-large">
                <Person />
              </div>
              <div>
                <h3>{selectedSchedule.patient_name}</h3>
                <p>{selectedSchedule.patient_phone}</p>
                <span className={`status-badge ${getStatusColor(selectedSchedule.status)}`}>
                  {selectedSchedule.status}
                </span>
              </div>
            </div>

            <div className="schedule-detail-grid">
              <div className="detail-item">
                <label>Tanggal Kunjungan</label>
                <p>{selectedSchedule.visit_date.split('T')[0].split('-').reverse().join('/')}</p>
              </div>
              <div className="detail-item">
                <label>Waktu Kunjungan</label>
                <p>{selectedSchedule.visit_time}</p>
              </div>
              <div className="detail-item">
                <label>Jenis Kunjungan</label>
                <p>{selectedSchedule.visit_type}</p>
              </div>
              <div className="detail-item">
                <label>Alamat Pasien</label>
                <p>{selectedSchedule.patient_address}</p>
              </div>
              <div className="detail-item full-width">
                <label>Catatan</label>
                <p>{selectedSchedule.notes}</p>
              </div>
            </div>
          </div>
        )}
      </ScheduleModal>

      {/* Add Schedule Modal */}
      <ScheduleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Tambah Jadwal Pemeriksaan"
      >
        <form className="schedule-form" onSubmit={handleSubmitSchedule}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>
                <input
                  type="checkbox"
                  checked={isWeeklySchedule}
                  onChange={(e) => setIsWeeklySchedule(e.target.checked)}
                />
                Buat Jadwal Mingguan (4 minggu)
              </label>
            </div>
            <div className="form-group">
              <label>Pilih Pasien *</label>
              <select
                value={formData.patient_id}
                onChange={(e) => handleFormChange('patient_id', e.target.value)}
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
            <div className="form-group">
              <label>{isWeeklySchedule ? 'Tanggal Mulai *' : 'Tanggal Kunjungan *'}</label>
              <input
                type="date"
                value={formData.visit_date}
                onChange={(e) => handleFormChange('visit_date', e.target.value)}
                className={formErrors.visit_date ? 'error' : ''}
              />
              {formErrors.visit_date && <span className="error-message">{formErrors.visit_date}</span>}
            </div>
            <div className="form-group">
              <label>Waktu Kunjungan *</label>
              <input
                type="time"
                value={formData.visit_time}
                onChange={(e) => handleFormChange('visit_time', e.target.value)}
                className={formErrors.visit_time ? 'error' : ''}
              />
              {formErrors.visit_time && <span className="error-message">{formErrors.visit_time}</span>}
            </div>
            <div className="form-group">
              <label>Jenis Kunjungan</label>
              <select
                value={formData.visit_type}
                onChange={(e) => handleFormChange('visit_type', e.target.value)}
              >
                <option value="Rumah">Rumah</option>
                <option value="Posyandu">Posyandu</option>
                <option value="Puskesmas">Puskesmas</option>
              </select>
            </div>
            <div className="form-group">
              <label>Jenis Pemeriksaan</label>
              <input
                type="text"
                value={formData.examination_type}
                onChange={(e) => handleFormChange('examination_type', e.target.value)}
                placeholder="Pemeriksaan Rutin"
              />
            </div>
            {!isWeeklySchedule && (
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                >
                  <option value="Terjadwal">Terjadwal</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>
            )}
            <div className="form-group full-width">
              <label>Catatan *</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                placeholder="Masukkan catatan pemeriksaan..."
                className={formErrors.notes ? 'error' : ''}
              ></textarea>
              {formErrors.notes && <span className="error-message">{formErrors.notes}</span>}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : (isWeeklySchedule ? 'Buat Jadwal Mingguan' : 'Simpan Jadwal')}
            </button>
          </div>
        </form>
      </ScheduleModal>

      {/* Edit Schedule Modal */}
      <ScheduleModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Jadwal Pemeriksaan"
      >
        {selectedSchedule && (
          <form className="schedule-form" onSubmit={handleUpdateSchedule}>
            <div className="form-grid">
              <div className="form-group">
                <label>Pilih Pasien *</label>
                <select
                  value={formData.patient_id}
                  onChange={(e) => handleFormChange('patient_id', e.target.value)}
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
              <div className="form-group">
                <label>Tanggal Kunjungan *</label>
                <input
                  type="date"
                  value={formData.visit_date}
                  onChange={(e) => handleFormChange('visit_date', e.target.value)}
                  className={formErrors.visit_date ? 'error' : ''}
                />
                {formErrors.visit_date && <span className="error-message">{formErrors.visit_date}</span>}
              </div>
              <div className="form-group">
                <label>Waktu Kunjungan *</label>
                <input
                  type="time"
                  value={formData.visit_time}
                  onChange={(e) => handleFormChange('visit_time', e.target.value)}
                  className={formErrors.visit_time ? 'error' : ''}
                />
                {formErrors.visit_time && <span className="error-message">{formErrors.visit_time}</span>}
              </div>
              <div className="form-group">
                <label>Jenis Kunjungan</label>
                <select
                  value={formData.visit_type}
                  onChange={(e) => handleFormChange('visit_type', e.target.value)}
                >
                  <option value="Rumah">Rumah</option>
                  <option value="Posyandu">Posyandu</option>
                  <option value="Puskesmas">Puskesmas</option>
                </select>
              </div>
              <div className="form-group">
                <label>Jenis Pemeriksaan</label>
                <input
                  type="text"
                  value={formData.examination_type}
                  onChange={(e) => handleFormChange('examination_type', e.target.value)}
                  placeholder="Pemeriksaan Rutin"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                >
                  <option value="Terjadwal">Terjadwal</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                  <option value="Ditunda">Ditunda</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Catatan *</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  className={formErrors.notes ? 'error' : ''}
                ></textarea>
                {formErrors.notes && <span className="error-message">{formErrors.notes}</span>}
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
      </ScheduleModal>
    </Sidebar>
  );
}

export default JadwalPemeriksaan;
