import React from 'react';
import StatusBadge from './StatusBadge';

const SPECIES_ICONS = {
  Dog: '🐶',
  Cat: '🐱',
  Bird: '🦜',
  Rabbit: '🐰',
  Reptile: '🦎',
  Other: '🐾'
};

export default function AppointmentCard({ appointment, onStatusChange, onDelete }) {
  const {
    id,
    petName,
    species,
    breed,
    ownerName,
    ownerPhone,
    ownerEmail,
    appointmentDate,
    service,
    status,
    notes
  } = appointment;

  const formattedDate = new Date(appointmentDate).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="react-card">
      <div className="react-card-header">
        <div className="pet-meta-row">
          <div className="species-avatar">
            {SPECIES_ICONS[species] || '🐾'}
          </div>
          <div>
            <h3 className="pet-heading">
              {petName} <span className="apt-id">({id})</span>
            </h3>
            <p className="species-subtitle">{species} • {breed || 'Mixed'}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="card-info-grid">
        <div className="info-cell">
          <span className="info-label">Owner</span>
          <span className="info-value">{ownerName}</span>
        </div>
        <div className="info-cell">
          <span className="info-label">Contact</span>
          <span className="info-value">{ownerPhone}</span>
        </div>
        <div className="info-cell">
          <span className="info-label">Service</span>
          <span className="info-value service-highlight">{service}</span>
        </div>
        <div className="info-cell">
          <span className="info-label">Date & Time</span>
          <span className="info-value">{formattedDate}</span>
        </div>
      </div>

      {notes && (
        <div className="card-notes-box">
          <span className="notes-tag">Clinical Note:</span> {notes}
        </div>
      )}

      <div className="react-card-footer">
        <div className="status-update-control">
          <label htmlFor={`status-${id}`}>Update Status:</label>
          <select
            id={`status-${id}`}
            value={status}
            onChange={(e) => onStatusChange(id, e.target.value)}
            className="status-select-input"
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <button
          onClick={() => onDelete(id)}
          className="btn-danger-outline"
          title="Cancel appointment"
        >
          🗑️ Cancel
        </button>
      </div>
    </div>
  );
}
