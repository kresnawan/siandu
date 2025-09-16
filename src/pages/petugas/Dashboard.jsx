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
  BeachAccess,
  ChildCare,
  School,
  Work,
  Elderly,
  Warning,
  Favorite,
  Visibility,
  Hearing
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import './Dashboard.css';
import Sidebar from '../../components/Sidebar';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function Dashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/dashboard/stats', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard statistics');
        }
        
        const data = await response.json();
        setDashboardStats(data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

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

  // Chart configurations
  const ageGroupChartData = dashboardStats ? {
    labels: ['Balita', 'Remaja', 'Dewasa', 'Lansia'],
    datasets: [
      {
        label: 'Jumlah Pemeriksaan',
        data: [
          dashboardStats.ageGroups.Balita || 0,
          dashboardStats.ageGroups.Remaja || 0,
          dashboardStats.ageGroups.Dewasa || 0,
          dashboardStats.ageGroups.Lansia || 0
        ],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0'
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0'
        ],
        borderWidth: 1
      }
    ]
  } : null;

  const healthConditionsChartData = dashboardStats ? {
    labels: ['Hipertensi', 'Diabetes', 'Kolesterol Tinggi', 'Asam Urat Tinggi', 'Gula Darah Tinggi', 'Masalah Penglihatan', 'Masalah Pendengaran'],
    datasets: [
      {
        label: 'Jumlah Kasus',
        data: [
          dashboardStats.healthConditions.hypertension,
          dashboardStats.healthConditions.diabetes,
          dashboardStats.healthConditions.highCholesterol,
          dashboardStats.healthConditions.highUricAcid,
          dashboardStats.healthConditions.highBloodSugar,
          dashboardStats.healthConditions.visionProblems,
          dashboardStats.healthConditions.hearingProblems
        ],
        backgroundColor: [
          '#FF6B6B',
          '#4ECDC4',
          '#45B7D1',
          '#96CEB4',
          '#FFEAA7',
          '#DDA0DD',
          '#98D8C8'
        ],
        borderColor: [
          '#FF6B6B',
          '#4ECDC4',
          '#45B7D1',
          '#96CEB4',
          '#FFEAA7',
          '#DDA0DD',
          '#98D8C8'
        ],
        borderWidth: 1
      }
    ]
  } : null;

  const monthlyTrendsChartData = dashboardStats ? {
    labels: dashboardStats.monthlyTrends.map(trend => {
      const [year, month] = trend.month.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }).reverse(),
    datasets: [
      {
        label: 'Total Pemeriksaan',
        data: dashboardStats.monthlyTrends.map(trend => trend.total_examinations).reverse(),
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.1
      },
      {
        label: 'Pemeriksaan Selesai',
        data: dashboardStats.monthlyTrends.map(trend => trend.completed_examinations).reverse(),
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    }
  };

  if (loading) {
    return (
      <Sidebar>
        <div className="dashboard-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Memuat data dashboard...</p>
          </div>
        </div>
      </Sidebar>
    );
  }

  if (error) {
    return (
      <Sidebar>
        <div className="dashboard-page">
          <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Coba Lagi</button>
          </div>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="dashboard-page">
        <div className="dashboard-container">
          {/* Main Content */}
          <main className="dashboard-main marginignore">
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
                <h2 className="section-title">Ringkasan Bulan Ini</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <People />
                    </div>
                    <div className="stat-value">{dashboardStats?.totalPatients || 0}</div>
                    <div className="stat-label">Total Pasien</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <LocalHospital />
                    </div>
                    <div className="stat-value">{dashboardStats?.todayStats?.total || 0}</div>
                    <div className="stat-label">Kunjungan Hari Ini</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <CheckCircle />
                    </div>
                    <div className="stat-value">{dashboardStats?.todayStats?.completed || 0}</div>
                    <div className="stat-label">Pemeriksaan Selesai</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Assessment />
                    </div>
                    <div className="stat-value">{dashboardStats?.healthConditions?.totalExaminations || 0}</div>
                    <div className="stat-label">Total Pemeriksaan Bulan Ini</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Age Groups Section */}
            <section className="age-groups-section">
              <div className="container">
                <h2 className="section-title">Distribusi Pemeriksaan Berdasarkan Usia</h2>
                <div className="charts-grid">
                  <div className="chart-container">
                    <div className="chart-card">
                      <h3>Pemeriksaan per Kelompok Usia</h3>
                      <div className="chart-wrapper">
                        {ageGroupChartData && <Doughnut data={ageGroupChartData} options={doughnutOptions} />}
                      </div>
                    </div>
                  </div>
                  <div className="age-stats-grid">
                    <div className="age-stat-card">
                      <div className="age-stat-icon balita">
                        <ChildCare />
                      </div>
                      <div className="age-stat-content">
                        <div className="age-stat-value">{dashboardStats?.ageGroups?.Balita || 0}</div>
                        <div className="age-stat-label">Balita (0-4 tahun)</div>
                      </div>
                    </div>
                    <div className="age-stat-card">
                      <div className="age-stat-icon remaja">
                        <School />
                      </div>
                      <div className="age-stat-content">
                        <div className="age-stat-value">{dashboardStats?.ageGroups?.Remaja || 0}</div>
                        <div className="age-stat-label">Remaja (5-17 tahun)</div>
                      </div>
                    </div>
                    <div className="age-stat-card">
                      <div className="age-stat-icon dewasa">
                        <Work />
                      </div>
                      <div className="age-stat-content">
                        <div className="age-stat-value">{dashboardStats?.ageGroups?.Dewasa || 0}</div>
                        <div className="age-stat-label">Dewasa (18-59 tahun)</div>
                      </div>
                    </div>
                    <div className="age-stat-card">
                      <div className="age-stat-icon lansia">
                        <Elderly />
                      </div>
                      <div className="age-stat-content">
                        <div className="age-stat-value">{dashboardStats?.ageGroups?.Lansia || 0}</div>
                        <div className="age-stat-label">Lansia (60+ tahun)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Health Conditions Section */}
            <section className="health-conditions-section">
              <div className="container">
                <h2 className="section-title">Kondisi Kesehatan yang Terdeteksi</h2>
                <div className="health-charts-grid">
                  <div className="chart-container">
                    <div className="chart-card">
                      <h3>Distribusi Kondisi Kesehatan</h3>
                      <div className="chart-wrapper">
                        {healthConditionsChartData && <Bar data={healthConditionsChartData} options={chartOptions} />}
                      </div>
                    </div>
                  </div>
                  <div className="health-stats-grid">
                    <div className="health-stat-card hypertension">
                      <div className="health-stat-icon">
                        <Warning />
                      </div>
                      <div className="health-stat-content">
                        <div className="health-stat-value">{dashboardStats?.healthConditions?.hypertension || 0}</div>
                        <div className="health-stat-label">Hipertensi</div>
                      </div>
                    </div>
                    <div className="health-stat-card diabetes">
                      <div className="health-stat-icon">
                        <Favorite />
                      </div>
                      <div className="health-stat-content">
                        <div className="health-stat-value">{dashboardStats?.healthConditions?.diabetes || 0}</div>
                        <div className="health-stat-label">Diabetes</div>
                      </div>
                    </div>
                    <div className="health-stat-card cholesterol">
                      <div className="health-stat-icon">
                        <Warning />
                      </div>
                      <div className="health-stat-content">
                        <div className="health-stat-value">{dashboardStats?.healthConditions?.highCholesterol || 0}</div>
                        <div className="health-stat-label">Kolesterol Tinggi</div>
                      </div>
                    </div>
                    <div className="health-stat-card uric-acid">
                      <div className="health-stat-icon">
                        <Warning />
                      </div>
                      <div className="health-stat-content">
                        <div className="health-stat-value">{dashboardStats?.healthConditions?.highUricAcid || 0}</div>
                        <div className="health-stat-label">Asam Urat Tinggi</div>
                      </div>
                    </div>
                    <div className="health-stat-card blood-sugar">
                      <div className="health-stat-icon">
                        <Warning />
                      </div>
                      <div className="health-stat-content">
                        <div className="health-stat-value">{dashboardStats?.healthConditions?.highBloodSugar || 0}</div>
                        <div className="health-stat-label">Gula Darah Tinggi</div>
                      </div>
                    </div>
                    <div className="health-stat-card vision">
                      <div className="health-stat-icon">
                        <Visibility />
                      </div>
                      <div className="health-stat-content">
                        <div className="health-stat-value">{dashboardStats?.healthConditions?.visionProblems || 0}</div>
                        <div className="health-stat-label">Masalah Penglihatan</div>
                      </div>
                    </div>
                    <div className="health-stat-card hearing">
                      <div className="health-stat-icon">
                        <Hearing />
                      </div>
                      <div className="health-stat-content">
                        <div className="health-stat-value">{dashboardStats?.healthConditions?.hearingProblems || 0}</div>
                        <div className="health-stat-label">Masalah Pendengaran</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Monthly Trends Section */}
            <section className="trends-section">
              <div className="container">
                <h2 className="section-title">Tren Pemeriksaan 6 Bulan Terakhir</h2>
                <div className="chart-container">
                  <div className="chart-card">
                    <h3>Grafik Tren Pemeriksaan</h3>
                    <div className="chart-wrapper">
                      {monthlyTrendsChartData && <Line data={monthlyTrendsChartData} options={chartOptions} />}
                    </div>
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

          </main>
        </div>
      </div>
    </Sidebar>
  );
}

export default Dashboard;