import React from 'react';

export default function StatsCards({ stats }) {
  const { total = 0, scheduled = 0, confirmed = 0, inProgress = 0, completed = 0 } = stats || {};

  return (
    <div className="stats-row">
      <div className="stat-item total">
        <span className="stat-qty">{total}</span>
        <span className="stat-title">Database Records</span>
      </div>
      <div className="stat-item scheduled">
        <span className="stat-qty">{scheduled}</span>
        <span className="stat-title">Scheduled</span>
      </div>
      <div className="stat-item confirmed">
        <span className="stat-qty">{confirmed}</span>
        <span className="stat-title">Confirmed</span>
      </div>
      <div className="stat-item progress">
        <span className="stat-qty">{inProgress}</span>
        <span className="stat-title">In Progress</span>
      </div>
      <div className="stat-item completed">
        <span className="stat-qty">{completed}</span>
        <span className="stat-title">Completed</span>
      </div>
    </div>
  );
}
