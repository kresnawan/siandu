import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  HealthAndSafety
} from '@mui/icons-material';
import './AuthPages.css';
import useApi from '../hooks/useApi';

const LoginPage = () => {
  const navigate = useNavigate();
  const { post, loading, error } = useApi();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  // Remove local isLoading state, use loading from useApi

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
        general: '' // Clear general error too
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 1) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await post('/auth/login', formData);

      // Check if login was successful
      if (response && response.id) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(response));

        // Store authentication status in localStorage
        localStorage.setItem('isAuthenticated', 'true');

        // Check user role to determine redirect
        if (response.role === 3421) { // Admin role
          navigate('/dashboard');
        } else {
          navigate('/'); // Regular user goes to home
        }

        alert('Login berhasil!');
      } else {
        setErrors({ general: 'Login gagal. Periksa email dan password Anda.' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: error.message || 'Login gagal. Silakan coba lagi.' });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div
          className="auth-form-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-header">
            <div className="auth-logo">
              <HealthAndSafety className="logo-icon" />
              <h1>Siandu</h1>
            </div>
            <h2 className="auth-title">Selamat Datang Kembali</h2>
            <p className="auth-subtitle">
              Masuk ke akun Anda untuk mengakses layanan Posyandu digital
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Email className="input-icon" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Masukkan email Anda"
                disabled={loading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock className="input-icon" />
                Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Masukkan password Anda"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {errors.general && <div className="error-message general-error">{errors.general}</div>}

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Ingat saya
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              className={`btn btn-primary auth-submit ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="auth-divider">
            <span>atau</span>
          </div>

          <div className="social-login">
            <button className="social-btn google-btn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
              Masuk dengan Google
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Belum punya akun?{' '}
              <Link to="/register" className="auth-link">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </motion.div>

        <motion.div
          className="auth-illustration"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="illustration-content">
            <div className="health-illustration">
              <div className="floating-element element-1">
                <Person />
                <span>Konsultasi</span>
              </div>
              <div className="floating-element element-2">
                <HealthAndSafety />
                <span>Kesehatan</span>
              </div>
              <div className="main-illustration">
                <div className="illustration-icon">🏥</div>
                <h3>Posyandu Digital</h3>
                <p>Layanan kesehatan modern untuk keluarga Indonesia</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
