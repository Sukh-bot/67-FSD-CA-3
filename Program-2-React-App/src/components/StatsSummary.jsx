import React from 'react';

export default function StatsSummary({ appointments }) {
  const total = appointments.length;
  const scheduled = appointments.filter(a => a.status === 'Scheduled').length;
  const confirmed = appointments.filter(a => a.status === 'Confirmed').length;
  const inProgress = appointments.filter(a => a.status === 'In Progress').length;
  const completed = appointments.filter(a => a.status === 'Completed').length;

  return (
    <div className="stats-container">
      <div className="stat-box">
        <span className="stat-num">{total}</span>
        <span className="stat-text">Total Bookings</span>
      </div>
      <div className="stat-box scheduled">
        <span className="stat-num">{scheduled}</span>
        <span className="stat-text">Scheduled</span>
      </div>
      <div className="stat-box confirmed">
        <span className="stat-num">{confirmed}</span>
        <span className="stat-text">Confirmed</span>
      </div>
      <div className="stat-box progress">
        <span className="stat-num">{inProgress}</span>
        <span className="stat-text">In Progress</span>
      </div>
      <div className="stat-box completed">
        <span className="stat-num">{completed}</span>
        <span className="stat-text">Completed</span>
      </div>
    </div>
  );
}
