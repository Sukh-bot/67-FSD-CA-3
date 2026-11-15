import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar({ user, onLogout, serverStatus }) {
  return (
    <>
      {/* Academic Header Banner */}
      <header className="academic-top-banner">
        <div className="container banner-flex">
          <div className="banner-tag">FSD Continuous Assessment (CA-3) | Program 5</div>
          <div className="banner-meta">
            <span><strong>Student:</strong> sukhada bhave</span>
            <span>•</span>
            <span><strong>Roll No:</strong> 67</span>
            <span>•</span>
            <span><strong>B.E. AI & DS (Sem V)</strong></span>
            <span>•</span>
            <span className="co-badge">CO6 (Full-Stack Integration & Deployment)</span>
          </div>
        </div>
      </header>

      {/* Main App Navbar */}
      <nav className="fullstack-navbar">
        <div className="container nav-content">
          <Link to="/" className="nav-brand">
            <span className="brand-icon">🐾</span>
            <div>
              <h3>PetCare Pro (Integrated)</h3>
              <p>React 18 + Express.js + Sequelize ORM</p>
            </div>
          </Link>

          <div className="nav-menu">
            <div className={`status-indicator ${serverStatus ? 'status-online' : 'status-offline'}`}>
              <span className="indicator-dot"></span>
              <span>{serverStatus ? 'API Connected' : 'Connecting...'}</span>
            </div>

            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              📊 Dashboard
            </NavLink>
            <NavLink to="/book" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              ➕ Book Visit
            </NavLink>

            {user ? (
              <div className="user-pill">
                <span>👨‍⚕️ {user.name}</span>
                <button onClick={onLogout} className="btn-logout">Logout</button>
              </div>
            ) : (
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                🔐 Staff Login
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
