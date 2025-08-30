import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExpandMore, 
  ExpandLess,
  Search,
  HealthAndSafety,
  QuestionAnswer,
  Support
} from '@mui/icons-material';
import './FAQPage.css';

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const faqData = [
    {
      category: 'Umum',
      questions: [
        {
          question: 'Apa itu Siandu?',
          answer: 'Siandu adalah platform digital yang mempermudah akses layanan Posyandu, konsultasi kesehatan, dan monitoring kesehatan keluarga dengan teknologi modern yang ramah pengguna.'
        },
        {
          question: 'Apakah Siandu gratis digunakan?',
          answer: 'Ya, Siandu dapat digunakan secara gratis untuk fitur-fitur dasar. Beberapa fitur premium mungkin memerlukan biaya tambahan.'
        },
        {
          question: 'Bagaimana cara mendaftar di Siandu?',
          answer: 'Anda dapat mendaftar dengan mengisi formulir pendaftaran yang tersedia di halaman register, atau menggunakan akun Google untuk pendaftaran yang lebih cepat.'
        }
      ]
    },
    {
      category: 'Layanan Kesehatan',
      questions: [
        {
          question: 'Apa saja layanan kesehatan yang tersedia?',
          answer: 'Siandu menyediakan berbagai layanan seperti konsultasi kesehatan online, jadwal pemeriksaan, vaksinasi, monitoring tumbuh kembang anak, dan informasi kesehatan terkini.'
        },
        {
          question: 'Apakah konsultasi dengan petugas Posyandu aman?',
          answer: 'Ya, semua petugas Posyandu yang terdaftar di Siandu telah diverifikasi dan memiliki sertifikasi resmi. Data konsultasi Anda juga dijaga kerahasiaannya.'
        },
        {
          question: 'Bagaimana cara membuat janji temu?',
          answer: 'Anda dapat membuat janji temu melalui fitur "Jadwal" di aplikasi. Pilih tanggal dan waktu yang tersedia, lalu konfirmasi janji temu Anda.'
        }
      ]
    },
    {
      category: 'Keamanan & Privasi',
      questions: [
        {
          question: 'Apakah data kesehatan saya aman?',
          answer: 'Ya, Siandu menggunakan teknologi enkripsi tingkat tinggi untuk melindungi data kesehatan Anda. Kami berkomitmen untuk menjaga kerahasiaan dan keamanan informasi pribadi.'
        },
        {
          question: 'Siapa yang dapat mengakses data saya?',
          answer: 'Hanya Anda dan petugas kesehatan yang Anda pilih yang dapat mengakses data kesehatan Anda. Data tidak akan dibagikan kepada pihak ketiga tanpa izin tertulis.'
        },
        {
          question: 'Bagaimana jika saya lupa password?',
          answer: 'Anda dapat menggunakan fitur "Lupa Password" yang tersedia di halaman login. Sistem akan mengirimkan link reset password ke email Anda.'
        }
      ]
    },
    {
      category: 'Teknis',
      questions: [
        {
          question: 'Apakah Siandu dapat diakses dari semua perangkat?',
          answer: 'Ya, Siandu dapat diakses dari komputer, tablet, dan smartphone. Website ini responsive dan akan menyesuaikan tampilan dengan ukuran layar perangkat Anda.'
        },
        {
          question: 'Bagaimana jika ada masalah teknis?',
          answer: 'Jika mengalami masalah teknis, Anda dapat menghubungi tim support kami melalui fitur "Bantuan" atau mengirimkan email ke support@siandu.id'
        },
        {
          question: 'Apakah Siandu memerlukan koneksi internet yang cepat?',
          answer: 'Siandu dapat berfungsi dengan baik dengan koneksi internet standar. Namun, untuk pengalaman terbaik, disarankan menggunakan koneksi yang stabil.'
        }
      ]
    },
    {
      category: 'Posyandu',
      questions: [
        {
          question: 'Bagaimana cara menemukan Posyandu terdekat?',
          answer: 'Siandu memiliki fitur pencarian Posyandu berdasarkan lokasi. Anda dapat menggunakan GPS atau memasukkan alamat untuk menemukan Posyandu terdekat.'
        },
        {
          question: 'Apakah semua Posyandu terdaftar di Siandu?',
          answer: 'Kami terus berusaha untuk mendaftarkan semua Posyandu di Indonesia. Jika Posyandu Anda belum terdaftar, Anda dapat menghubungi kami untuk proses pendaftaran.'
        },
        {
          question: 'Bagaimana cara Posyandu bergabung dengan Siandu?',
          answer: 'Posyandu dapat menghubungi tim kami untuk proses pendaftaran. Tim akan membantu verifikasi dan onboarding untuk bergabung dengan platform Siandu.'
        }
      ]
    }
  ];

  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    const newExpandedItems = new Set(expandedItems);
    
    if (newExpandedItems.has(key)) {
      newExpandedItems.delete(key);
    } else {
      newExpandedItems.add(key);
    }
    
    setExpandedItems(newExpandedItems);
  };

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="faq-page">
      <div className="container">
        {/* Header Section */}
        <motion.div
          className="faq-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="faq-header-content">
            <div className="faq-logo">
              <HealthAndSafety className="logo-icon" />
              <h1>Siandu</h1>
            </div>
            <h2 className="faq-title">Pertanyaan yang Sering Diajukan</h2>
            <p className="faq-subtitle">
              Temukan jawaban untuk pertanyaan umum seputar Siandu dan layanan Posyandu digital
            </p>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          className="search-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Cari pertanyaan atau kata kunci..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </motion.div>

        {/* FAQ Content */}
        <motion.div
          className="faq-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map((category, categoryIndex) => (
              <div key={categoryIndex} className="faq-category">
                <h3 className="category-title">{category.category}</h3>
                <div className="questions-container">
                  {category.questions.map((item, questionIndex) => {
                    const key = `${categoryIndex}-${questionIndex}`;
                    const isExpanded = expandedItems.has(key);
                    
                    return (
                      <motion.div
                        key={questionIndex}
                        className="faq-item"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: questionIndex * 0.1 }}
                      >
                        <button
                          className="faq-question"
                          onClick={() => toggleItem(categoryIndex, questionIndex)}
                        >
                          <span className="question-text">{item.question}</span>
                          {isExpanded ? <ExpandLess /> : <ExpandMore />}
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              className="faq-answer"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <p>{item.answer}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <motion.div
              className="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <QuestionAnswer className="no-results-icon" />
              <h3>Tidak ada hasil ditemukan</h3>
              <p>Coba ubah kata kunci pencarian Anda atau lihat semua FAQ di bawah ini.</p>
              <button
                className="btn btn-secondary"
                onClick={() => setSearchTerm('')}
              >
                Lihat Semua FAQ
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Contact Support */}
        <motion.div
          className="support-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="support-content">
            <Support className="support-icon" />
            <h3>Masih punya pertanyaan?</h3>
            <p>
              Tim support kami siap membantu Anda. Jangan ragu untuk menghubungi kami
              jika pertanyaan Anda belum terjawab.
            </p>
            <div className="support-buttons">
              <button className="btn btn-primary">Hubungi Support</button>
              <button className="btn btn-secondary">Kirim Email</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;
