import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import BookAppointment from './pages/BookAppointment';
import AuthLogin from './pages/AuthLogin';
import { api } from './api/client';
import './index.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [serverStatus, setServerStatus] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Check backend server health and load user profile if token exists
  useEffect(() => {
    api.checkHealth()
      .then(() => setServerStatus(true))
      .catch(() => setServerStatus(false));

    const token = localStorage.getItem('PETCARE_AUTH_TOKEN');
    if (token) {
      api.getMe()
        .then(res => setUser(res.user))
        .catch(() => localStorage.removeItem('PETCARE_AUTH_TOKEN'));
    }
  }, []);

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('PETCARE_AUTH_TOKEN', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('PETCARE_AUTH_TOKEN');
    triggerToast('Logged out successfully.', 'info');
  };

  return (
    <BrowserRouter>
      <div className="fullstack-app">
        <Navbar user={user} onLogout={handleLogout} serverStatus={serverStatus} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard triggerToast={triggerToast} />} />
            <Route path="/book" element={<BookAppointment triggerToast={triggerToast} />} />
            <Route path="/login" element={<AuthLogin onLoginSuccess={handleLoginSuccess} triggerToast={triggerToast} />} />
          </Routes>
        </main>

        {/* Global Toast */}
        {toast && (
          <div className={`toast-notification toast-${toast.type}`}>
            <span>{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}</span>
            <span>{toast.message}</span>
          </div>
        )}

        {/* Academic Footer */}
        <footer className="footer-bar">
          <div className="container footer-content">
            <div>
              <p><strong>Department of Artificial Intelligence and Data Science</strong></p>
              <p>Full Stack Development Practical Assignment (CA-3)</p>
            </div>
            <div className="author-details">
              <span>Submitted by: <strong>sukhada bhave</strong></span>
              <span>•</span>
              <span>Roll No: <strong>67</strong> (Sem V)</span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
