import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import StatsCards from '../components/StatsCards';
import { Link } from 'react-router-dom';

export default function Dashboard({ triggerToast }) {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [aptRes, statsRes] = await Promise.all([
        api.getAppointments({ status: statusFilter, search: searchTerm }),
        api.getStats()
      ]);
      setAppointments(aptRes.data || []);
      setStats(statsRes.stats || {});
    } catch (err) {
      console.error('Failed to load data from backend:', err);
      triggerToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateAppointment(id, { status: newStatus });
      triggerToast(`Status updated to "${newStatus}" in Database!`, 'success');
      loadData();
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  };

  const handleDelete = async (id, petName) => {
    if (window.confirm(`Are you sure you want to delete the appointment for ${petName} from the database?`)) {
      try {
        await api.deleteAppointment(id);
        triggerToast(`Appointment for ${petName} deleted from database.`, 'info');
        loadData();
      } catch (err) {
        triggerToast(err.message, 'error');
      }
    }
  };

  return (
    <div className="container dashboard-page">
      <div className="dashboard-header">
        <div>
          <h2>🐾 Integrated Pet Care Management Portal</h2>
          <p>Connected live to Express.js REST API with Sequelize ORM Database Persistence.</p>
        </div>
        <div className="db-badge">
          <span className="db-pulse"></span>
          <span>Database: <strong>Sequelize (SQLite / PostgreSQL)</strong></span>
        </div>
      </div>

      <StatsCards stats={stats} />

      {/* Filter and Search Bar */}
      <div className="dashboard-toolbar">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search by pet, owner, or breed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn-search">Search</button>
        </form>

        <div className="status-filter">
          <label>Filter Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Appointments</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointment Table / Cards */}
      {isLoading ? (
        <div className="loader-box">
          <div className="loading-spinner"></div>
          <p>Querying records from backend REST API...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="empty-box">
          <span style={{ fontSize: '2.5rem' }}>🐾</span>
          <h3>No Appointments Found</h3>
          <p>No records matched your query in the database.</p>
          <Link to="/book" className="btn-book-link">+ Book First Appointment</Link>
        </div>
      ) : (
        <div className="appointments-table-wrapper">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Pet Details</th>
                <th>Owner & Contact</th>
                <th>Service</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id}>
                  <td><code>{apt.id}</code></td>
                  <td>
                    <strong>{apt.petName}</strong>
                    <div className="table-sub">{apt.species} • {apt.breed || 'Mixed'}</div>
                  </td>
                  <td>
                    <div>{apt.ownerName}</div>
                    <div className="table-sub">{apt.ownerPhone}</div>
                  </td>
                  <td><span className="service-tag">{apt.service}</span></td>
                  <td>
                    {new Date(apt.appointmentDate).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </td>
                  <td>
                    <StatusBadge status={apt.status} />
                  </td>
                  <td>
                    <div className="table-actions">
                      <select
                        value={apt.status}
                        onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                        className="table-status-select"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => handleDelete(apt.id, apt.petName)}
                        className="btn-table-del"
                        title="Delete from Database"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
