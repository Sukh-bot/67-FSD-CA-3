import React from 'react';

export default function Analytics({ appointments }) {
  // Service breakdown
  const serviceCounts = appointments.reduce((acc, curr) => {
    acc[curr.service] = (acc[curr.service] || 0) + 1;
    return acc;
  }, {});

  // Species breakdown
  const speciesCounts = appointments.reduce((acc, curr) => {
    acc[curr.species] = (acc[curr.species] || 0) + 1;
    return acc;
  }, {});

  // Status breakdown
  const statusCounts = appointments.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  const total = appointments.length || 1;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Clinic Analytics & Operational Insights</h1>
          <p>Computed dynamically from React state using array methods and conditional rendering.</p>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Service Distribution */}
        <div className="analytics-card">
          <h3>🩺 Service Distribution</h3>
          <div className="bar-list">
            {Object.entries(serviceCounts).map(([svc, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={svc} className="bar-item">
                  <div className="bar-label-row">
                    <span>{svc}</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: '#0d9488' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Species Breakdown */}
        <div className="analytics-card">
          <h3>🐾 Patients by Species</h3>
          <div className="bar-list">
            {Object.entries(speciesCounts).map(([sp, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={sp} className="bar-item">
                  <div className="bar-label-row">
                    <span>{sp}</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: '#f59e0b' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Pipeline */}
        <div className="analytics-card">
          <h3>📋 Consultation Pipeline</h3>
          <div className="bar-list">
            {Object.entries(statusCounts).map(([st, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={st} className="bar-item">
                  <div className="bar-label-row">
                    <span>{st}</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: '#6366f1' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
