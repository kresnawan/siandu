import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() =>{
    const setAuth = () =>{
      const authStatus = localStorage.getItem('isAuthenticated');
  const userData = localStorage.getItem('user');

  

  if (authStatus === 'true' && userData) {
    const user = JSON.parse(userData);
    setIsLoggedIn(true);
    if(user.role === 3422) {
      setIsAdmin(true);
    }
  } else {
    setIsLoggedIn(false);
  }
    }

    setAuth();
  })

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
            {isAdmin === true && <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Dashboard
            </Link>}
            <Link
              to="/login"
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Masuk
            </Link>
            <Link 
              to="/faq" 
              className={`nav-link ${isActive('/faq') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              FAQ
            </Link>
          </motion.div>

          <motion.div
            className="navbar-cta"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/register" className="cta-button" onClick={closeMenu}>
              Mulai Sekarang
            </Link>
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

