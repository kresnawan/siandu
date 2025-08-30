import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock,
  Person,
  Phone,
  HealthAndSafety,
  CheckCircle
} from '@mui/icons-material';
import './AuthPages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Nama lengkap minimal 3 karakter';
    }

    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (!/^(\+62|62|0)8[1-9][0-9]{6,9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password harus mengandung huruf besar, huruf kecil, dan angka';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Anda harus menyetujui syarat dan ketentuan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Register data:', formData);
      // Here you would typically make an API call to register
      alert('Registrasi berhasil! Silakan cek email untuk verifikasi.');
    } catch (error) {
      console.error('Register error:', error);
      alert('Registrasi gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[!@#$%^&*])/.test(password)) score++;

    const strengthMap = {
      0: { label: 'Sangat Lemah', color: '#ff4444' },
      1: { label: 'Lemah', color: '#ff8800' },
      2: { label: 'Sedang', color: '#ffaa00' },
      3: { label: 'Kuat', color: '#00aa00' },
      4: { label: 'Sangat Kuat', color: '#008800' },
      5: { label: 'Sempurna', color: '#006600' }
    };

    return strengthMap[score] || strengthMap[0];
  };

  const passwordStrengthInfo = passwordStrength();

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
            <h2 className="auth-title">Buat Akun Baru</h2>
            <p className="auth-subtitle">
              Bergabunglah dengan Siandu untuk akses layanan Posyandu digital
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                <Person className="input-icon" />
                Nama Lengkap
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`form-input ${errors.fullName ? 'error' : ''}`}
                placeholder="Masukkan nama lengkap Anda"
                disabled={isLoading}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

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
                disabled={isLoading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                <Phone className="input-icon" />
                Nomor Telepon
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="Contoh: 08123456789"
                disabled={isLoading}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
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
                  placeholder="Minimal 8 karakter"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('password')}
                  disabled={isLoading}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill" 
                      style={{ 
                        width: `${(passwordStrengthInfo.strength / 5) * 100}%`,
                        backgroundColor: passwordStrengthInfo.color
                      }}
                    ></div>
                  </div>
                  <span className="strength-label" style={{ color: passwordStrengthInfo.color }}>
                    {passwordStrengthInfo.label}
                  </span>
                </div>
              )}
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <Lock className="input-icon" />
                Konfirmasi Password
              </label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Ulangi password Anda"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <div className="form-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Saya setuju dengan{' '}
                <Link to="/terms" className="terms-link">
                  Syarat dan Ketentuan
                </Link>{' '}
                serta{' '}
                <Link to="/privacy" className="terms-link">
                  Kebijakan Privasi
                </Link>
              </label>
              {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
            </div>

            <button
              type="submit"
              className={`btn btn-primary auth-submit ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Membuat Akun...' : 'Daftar Sekarang'}
            </button>
          </form>

          <div className="auth-divider">
            <span>atau</span>
          </div>

          <div className="social-login">
            <button className="social-btn google-btn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
              Daftar dengan Google
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Sudah punya akun?{' '}
              <Link to="/login" className="auth-link">
                Masuk sekarang
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
                <CheckCircle />
                <span>Terdaftar</span>
              </div>
              <div className="floating-element element-2">
                <HealthAndSafety />
                <span>Terpercaya</span>
              </div>
              <div className="main-illustration">
                <div className="illustration-icon">🏥</div>
                <h3>Bergabung dengan Siandu</h3>
                <p>Dapatkan akses ke layanan kesehatan modern dan terpercaya</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
