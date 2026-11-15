import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-container state-panel">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist in the PetCare React portal.</p>
      <Link to="/" className="btn-primary-inline">Return to Appointments</Link>
    </div>
  );
}
