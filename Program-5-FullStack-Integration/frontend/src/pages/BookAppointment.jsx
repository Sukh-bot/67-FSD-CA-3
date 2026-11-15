import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function BookAppointment({ triggerToast }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    petName: '',
    species: 'Dog',
    breed: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    appointmentDate: '',
    service: 'General Checkup',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.createAppointment(form);
      triggerToast(`Appointment booked & saved to Database! (ID: ${res.data.id})`, 'success');
      navigate('/');
    } catch (err) {
      setError(err.message);
      triggerToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container form-page-container">
      <div className="form-card">
        <div className="form-title-bar">
          <h2>🐾 Schedule Pet Visit (Full-Stack Integrated)</h2>
          <p>Dispatches HTTP POST to Express Backend & Persists into Database via Sequelize ORM.</p>
        </div>

        {error && <div className="alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-row">
            <div className="form-group">
              <label>Pet Name *</label>
              <input
                type="text"
                name="petName"
                placeholder="e.g. Copper"
                required
                value={form.petName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Species *</label>
              <select name="species" value={form.species} onChange={handleChange}>
                <option value="Dog">Dog 🐶</option>
                <option value="Cat">Cat 🐱</option>
                <option value="Bird">Bird 🦜</option>
                <option value="Rabbit">Rabbit 🐰</option>
                <option value="Other">Other 🐾</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Breed</label>
              <input
                type="text"
                name="breed"
                placeholder="e.g. Beagle / Siamese"
                value={form.breed}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Owner Name *</label>
              <input
                type="text"
                name="ownerName"
                placeholder="e.g. Sukhada Bhave"
                required
                value={form.ownerName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="ownerPhone"
                placeholder="10-digit mobile"
                required
                value={form.ownerPhone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="ownerEmail"
                placeholder="e.g. sukhada@example.com"
                required
                value={form.ownerEmail}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Appointment Date & Time *</label>
              <input
                type="datetime-local"
                name="appointmentDate"
                required
                value={form.appointmentDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Service *</label>
              <select name="service" value={form.service} onChange={handleChange}>
                <option value="General Checkup">General Health Checkup 🩺</option>
                <option value="Vaccination">Vaccination & Booster 💉</option>
                <option value="Grooming & Spa">Grooming & Spa ✂️</option>
                <option value="Dental Cleaning">Dental Cleaning 🦷</option>
                <option value="Surgery Consultation">Surgery Consultation 🏥</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Health Notes / Symptoms</label>
            <textarea
              name="notes"
              rows="3"
              placeholder="Provide symptoms, past medical history, or dietary requests..."
              value={form.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-actions-bar">
            <button type="button" onClick={() => navigate('/')} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-submit">
              {isSubmitting ? 'Saving to Database...' : '💾 Save to Database (HTTP POST)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
