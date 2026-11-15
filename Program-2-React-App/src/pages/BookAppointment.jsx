import React from 'react';
import AppointmentForm from '../components/AppointmentForm';

export default function BookAppointment({ onAddAppointment }) {
  return (
    <div className="page-container small-container">
      <AppointmentForm onAddAppointment={onAddAppointment} />
    </div>
  );
}
