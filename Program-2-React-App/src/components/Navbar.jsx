import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar({ appointmentsCount }) {
  return (
    <>
      {/* Academic Header Banner */}
      <header className="academic-banner">
        <div className="container banner-inner">
          <div className="banner-badge">FSD Continuous Assessment (CA-3) | Program 2</div>
          <div className="banner-student">
            <span><strong>Student:</strong> sukhada bhave</span>
            <span className="dot">•</span>
            <span><strong>Roll No:</strong> 67</span>
            <span className="dot">•</span>
            <span><strong>B.E. AI & DS (Sem V)</strong></span>
            <span className="dot">•</span>
            <span className="co-badge">CO3 (React Functional Components, Hooks & Router)</span>
          </div>
        </div>
      </header>

      {/* Main Navbar */}
      <nav className="main-navbar">
        <div className="container nav-wrapper">
          <Link to="/" className="brand">
            <span className="brand-logo">🐾</span>
            <div>
              <h2>PetCare Plus</h2>
              <p>React Veterinary Appointment Suite</p>
            </div>
          </Link>

          <div className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              📑 Appointments ({appointmentsCount})
            </NavLink>
            <NavLink
              to="/book"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              ➕ Book New Visit
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              📊 Clinic Analytics
            </NavLink>
          </div>
        </div>
      </nav>
    </>
  );
}
