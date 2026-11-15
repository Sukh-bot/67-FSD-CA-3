import React, { useState } from 'react';
import AppointmentCard from './AppointmentCard';
import { Link } from 'react-router-dom';

export default function AppointmentList({
  appointments,
  onStatusChange,
  onDelete,
  isLoading
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-asc');

  // Filter logic
  const filtered = appointments.filter((apt) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      apt.petName.toLowerCase().includes(term) ||
      apt.ownerName.toLowerCase().includes(term) ||
      apt.breed.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
    const matchesService = serviceFilter === 'ALL' || apt.service === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date-asc') {
      return new Date(a.appointmentDate) - new Date(b.appointmentDate);
    }
    if (sortBy === 'date-desc') {
      return new Date(b.appointmentDate) - new Date(a.appointmentDate);
    }
    if (sortBy === 'name-asc') {
      return a.petName.localeCompare(b.petName);
    }
    if (sortBy === 'name-desc') {
      return b.petName.localeCompare(a.petName);
    }
    if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  if (isLoading) {
    return (
      <div className="state-panel">
        <div className="react-spinner"></div>
        <p>Loading appointments using useEffect hook...</p>
      </div>
    );
  }

  return (
    <div className="appointment-list-wrapper">
      {/* Controls Bar */}
      <div className="controls-bar">
        <div className="search-field">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by pet name, breed, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="control-item">
            <label>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All ({appointments.length})</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="control-item">
            <label>Service:</label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              <option value="ALL">All Services</option>
              <option value="General Checkup">General Checkup</option>
              <option value="Vaccination">Vaccination</option>
              <option value="Grooming & Spa">Grooming & Spa</option>
              <option value="Dental Cleaning">Dental Cleaning</option>
              <option value="Surgery Consultation">Surgery</option>
            </select>
          </div>

          <div className="control-item">
            <label>Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-asc">Date (Earliest First)</option>
              <option value="date-desc">Date (Latest First)</option>
              <option value="name-asc">Pet Name (A to Z)</option>
              <option value="name-desc">Pet Name (Z to A)</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listing Cards / Conditional Rendering */}
      {sorted.length === 0 ? (
        <div className="empty-listing">
          <span className="empty-icon">🐾</span>
          <h3>No matching pet appointments</h3>
          <p>Try adjusting your search filters or book a new pet visit.</p>
          <Link to="/book" className="btn-primary-inline">+ Book Appointment</Link>
        </div>
      ) : (
        <div className="cards-grid">
          {sorted.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
