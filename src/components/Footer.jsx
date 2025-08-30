import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, YouTube, Email, Phone, LocationOn, HealthAndSafety } from '@mui/icons-material';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-col brand">
          <div className="brand-row">
            <HealthAndSafety className="brand-icon" />
            <div className="brand-text">
              <h3>Siandu</h3>
              <p>Posyandu Digital</p>
            </div>
          </div>
          <p className="brand-desc">
            Mempermudah konsultasi, informasi, dan kontrol kesehatan masyarakat sekitar Posyandu.
          </p>
          <div className="socials">
            <a href="#" aria-label="Facebook" className="social-btn"><Facebook /></a>
            <a href="#" aria-label="Instagram" className="social-btn"><Instagram /></a>
            <a href="#" aria-label="YouTube" className="social-btn"><YouTube /></a>
          </div>
        </div>

        <div className="footer-col links">
          <h4>Menu Cepat</h4>
          <ul>
            <li><Link to="/">Beranda</Link></li>
            <li><Link to="/login">Masuk</Link></li>
            <li><Link to="/register">Daftar</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-col contact">
          <h4>Kontak</h4>
          <ul>
            <li><Email /> support@siandu.id</li>
            <li><Phone /> 0800-123-456</li>
            <li><LocationOn /> Indonesia</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-row">
          <span>© {currentYear} Siandu. Semua hak dilindungi.</span>
          <div className="legal-links">
            <Link to="/privacy">Kebijakan Privasi</Link>
            <Link to="/terms">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
