import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function AuthLogin({ onLoginSuccess, triggerToast }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('sukhada.bhave@vetcare.com');
  const [password, setPassword] = useState('Sukhada@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await api.login({ email, password });
      onLoginSuccess(data.user, data.token);
      triggerToast(`Welcome back, ${data.user.name}! Authenticated with JWT.`, 'success');
      navigate('/');
    } catch (err) {
      setError(err.message);
      triggerToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container form-page-container">
      <div className="form-card auth-card">
        <div className="form-title-bar">
          <h2>🔐 Staff Portal Login</h2>
          <p>JWT Authentication Handshake with Express Backend & Bcrypt Verification.</p>
        </div>

        {error && <div className="alert-error">⚠️ {error}</div>}

        <div className="demo-credentials-box">
          <strong>Demo Seeded Credentials:</strong>
          <div>Email: <code>sukhada.bhave@vetcare.com</code></div>
          <div>Password: <code>Sukhada@2026</code></div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-submit btn-block">
            {loading ? 'Authenticating...' : 'Sign In with JWT'}
          </button>
        </form>
      </div>
    </div>
  );
}
