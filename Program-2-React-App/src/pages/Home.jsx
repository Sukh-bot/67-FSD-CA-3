import React from 'react';
import StatsSummary from '../components/StatsSummary';
import AppointmentList from '../components/AppointmentList';

export default function Home({
  appointments,
  onStatusChange,
  onDelete,
  isLoading
}) {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Clinic Appointments Dashboard</h1>
          <p>Real-time view of scheduled pet consultations, examinations, and procedures.</p>
        </div>
      </div>

      <StatsSummary appointments={appointments} />

      <AppointmentList
        appointments={appointments}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
