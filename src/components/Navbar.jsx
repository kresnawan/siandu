import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      const user = localStorage.getItem('user');
      
      setIsAuthenticated(authStatus === 'true');
      
      if (user) {
        try {
          const userData = JSON.parse(user);
          setUserRole(userData.role);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };

    checkAuth();
    
    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', checkAuth);
    
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/');
    closeMenu();
  };

  const isDashboardPage = location.pathname.startsWith('/dashboard');

  // Don't show navbar on dashboard pages (they have their own sidebar)
  if (isDashboardPage) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <motion.div
          className="navbar-logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" onClick={closeMenu}>
            <span className="logo-text">Siandu</span>
            <span className="logo-subtitle">Posyandu Digital</span>
          </Link>
        </motion.div>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <motion.div
            className="navbar-links"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Beranda
            </Link>
            <Link 
              to="/faq" 
              className={`nav-link ${isActive('/faq') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              FAQ
            </Link>
            {isAuthenticated && userRole === 'admin' && (
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Dashboard
              </Link>
            )}
          </motion.div>

          <motion.div
            className="navbar-cta"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isAuthenticated ? (
              <div className="auth-buttons">
                <span className="user-info">
                  Selamat datang, {userRole === 'admin' ? 'Admin' : 'User'}
                </span>
                <button className="logout-button" onClick={handleLogout}>
                  Keluar
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="login-button" onClick={closeMenu}>
                  Masuk
                </Link>
                <Link to="/register" className="register-button" onClick={closeMenu}>
                  Daftar
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isOpen ? 'active' : ''}`}></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

