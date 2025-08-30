import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LocalHospital, 
  People, 
  Notifications, 
  TrendingUp,
  CheckCircle,
  Support
} from '@mui/icons-material';
import './LandingPage.css';

const LandingPage = () => {
  const features = [
    {
      icon: <LocalHospital />,
      title: 'Konsultasi Mudah',
      description: 'Konsultasi kesehatan langsung dengan petugas Posyandu tanpa perlu datang ke lokasi'
    },
    {
      icon: <People />,
      title: 'Informasi Terkini',
      description: 'Dapatkan informasi terbaru seputar kesehatan dan program Posyandu'
    },
    {
      icon: <Notifications />,
      title: 'Notifikasi Pintar',
      description: 'Pengingatan jadwal pemeriksaan dan vaksinasi untuk keluarga'
    },
    {
      icon: <TrendingUp />,
      title: 'Monitoring Kesehatan',
      description: 'Pantau perkembangan kesehatan anak dan keluarga secara berkala'
    }
  ];

  const benefits = [
    'Akses 24/7 untuk informasi kesehatan',
    'Konsultasi langsung dengan petugas terpercaya',
    'Data kesehatan tersimpan aman dan terorganisir',
    'Menghemat waktu dan biaya transportasi',
    'Mendukung program pemerintah dalam kesehatan masyarakat'
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <motion.div
              className="hero-text"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="hero-title">
                Siandu - <span className="highlight">Posyandu Digital</span> untuk Masyarakat
              </h1>
              <p className="hero-description">
                Platform digital yang mempermudah akses layanan Posyandu, 
                konsultasi kesehatan, dan monitoring kesehatan keluarga 
                dengan teknologi modern yang ramah pengguna.
              </p>
              <div className="hero-buttons">
                <Link to="/register" className="btn btn-primary hero-btn">
                  Mulai Sekarang
                </Link>
                <Link to="/faq" className="btn btn-secondary hero-btn">
                  Pelajari Lebih Lanjut
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="hero-image"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="hero-visual">
                <div className="floating-card card-1">
                  <CheckCircle />
                  <span>Konsultasi Online</span>
                </div>
                <div className="floating-card card-2">
                  <Support />
                  <span>24/7 Support</span>
                </div>
                <div className="main-hero-image">
                  <div className="health-icon">🏥</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Fitur Unggulan</h2>
            <p className="section-subtitle">
              Nikmati berbagai kemudahan dalam mengakses layanan Posyandu 
              dengan fitur-fitur modern yang dirancang khusus untuk Anda
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section section">
        <div className="container">
          <div className="benefits-content">
            <motion.div
              className="benefits-text"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">Mengapa Memilih Siandu?</h2>
              <p className="section-subtitle">
                Platform digital yang dirancang khusus untuk memenuhi 
                kebutuhan kesehatan masyarakat modern
              </p>
              <ul className="benefits-list">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="benefit-icon" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>
              <Link to="/register" className="btn btn-primary">
                Daftar Sekarang
              </Link>
            </motion.div>
            <motion.div
              className="benefits-visual"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="stats-container">
                <div className="stat-item">
                  <div className="stat-number">1000+</div>
                  <div className="stat-label">Pengguna Aktif</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Posyandu Terdaftar</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Layanan Tersedia</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-title">Siap Memulai Perjalanan Kesehatan Digital?</h2>
            <p className="cta-description">
              Bergabunglah dengan ribuan keluarga yang telah merasakan 
              kemudahan layanan Posyandu digital
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary cta-btn">
                Daftar Gratis
              </Link>
              <Link to="/login" className="btn btn-secondary cta-btn">
                Sudah Punya Akun? Masuk
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
