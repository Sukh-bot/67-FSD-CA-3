import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AppointmentForm({ onAddAppointment }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.petName.trim() || formData.petName.trim().length < 2) {
      errs.petName = 'Pet name must have at least 2 characters.';
    }
    if (!formData.ownerName.trim() || formData.ownerName.trim().length < 2) {
      errs.ownerName = 'Owner name must have at least 2 characters.';
    }
    if (!/^[6-9]\d{9}$/.test(formData.ownerPhone.trim())) {
      errs.ownerPhone = 'Enter a valid 10-digit mobile number starting with 6-9.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail.trim())) {
      errs.ownerEmail = 'Enter a valid email address.';
    }
    if (!formData.appointmentDate) {
      errs.appointmentDate = 'Please select appointment date and time.';
    } else {
      const selected = new Date(formData.appointmentDate);
      if (selected <= new Date()) {
        errs.appointmentDate = 'Appointment must be set in the future.';
      }
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field if being corrected
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const newAppointment = {
      ...formData,
      id: `APT-${Math.floor(2000 + Math.random() * 8000)}`,
      status: 'Scheduled',
      createdAt: new Date().toISOString()
    };

    onAddAppointment(newAppointment);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/');
    }, 400);
  };

  return (
    <div className="form-card-container">
      <div className="form-box-header">
        <h2>🐾 Schedule Pet Care Consultation</h2>
        <p>Managed via React functional components, hooks (`useState`), and event handling.</p>
      </div>

      <form onSubmit={handleSubmit} className="react-form" noValidate>
        <div className="form-grid-2">
          <div className="input-field">
            <label htmlFor="petName">Pet Name *</label>
            <input
              type="text"
              id="petName"
              name="petName"
              placeholder="e.g. Daisy"
              value={formData.petName}
              onChange={handleChange}
              className={errors.petName ? 'invalid' : ''}
            />
            {errors.petName && <span className="field-error">{errors.petName}</span>}
          </div>

          <div className="input-field">
            <label htmlFor="species">Species *</label>
            <select
              id="species"
              name="species"
              value={formData.species}
              onChange={handleChange}
            >
              <option value="Dog">Dog 🐶</option>
              <option value="Cat">Cat 🐱</option>
              <option value="Bird">Bird 🦜</option>
              <option value="Rabbit">Rabbit 🐰</option>
              <option value="Reptile">Reptile 🦎</option>
              <option value="Other">Other 🐾</option>
            </select>
          </div>
        </div>

        <div className="form-grid-2">
          <div className="input-field">
            <label htmlFor="breed">Breed</label>
            <input
              type="text"
              id="breed"
              name="breed"
              placeholder="e.g. Beagle / Persian"
              value={formData.breed}
              onChange={handleChange}
            />
          </div>

          <div className="input-field">
            <label htmlFor="ownerName">Owner Full Name *</label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              placeholder="e.g. Sukhada Bhave"
              value={formData.ownerName}
              onChange={handleChange}
              className={errors.ownerName ? 'invalid' : ''}
            />
            {errors.ownerName && <span className="field-error">{errors.ownerName}</span>}
          </div>
        </div>

        <div className="form-grid-2">
          <div className="input-field">
            <label htmlFor="ownerPhone">Phone Number *</label>
            <input
              type="tel"
              id="ownerPhone"
              name="ownerPhone"
              placeholder="10-digit mobile (e.g. 9876543210)"
              value={formData.ownerPhone}
              onChange={handleChange}
              className={errors.ownerPhone ? 'invalid' : ''}
            />
            {errors.ownerPhone && <span className="field-error">{errors.ownerPhone}</span>}
          </div>

          <div className="input-field">
            <label htmlFor="ownerEmail">Email Address *</label>
            <input
              type="email"
              id="ownerEmail"
              name="ownerEmail"
              placeholder="e.g. sukhada@example.com"
              value={formData.ownerEmail}
              onChange={handleChange}
              className={errors.ownerEmail ? 'invalid' : ''}
            />
            {errors.ownerEmail && <span className="field-error">{errors.ownerEmail}</span>}
          </div>
        </div>

        <div className="form-grid-2">
          <div className="input-field">
            <label htmlFor="appointmentDate">Appointment Date & Time *</label>
            <input
              type="datetime-local"
              id="appointmentDate"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              className={errors.appointmentDate ? 'invalid' : ''}
            />
            {errors.appointmentDate && <span className="field-error">{errors.appointmentDate}</span>}
          </div>

          <div className="input-field">
            <label htmlFor="service">Veterinary Service *</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
            >
              <option value="General Checkup">General Health Checkup 🩺</option>
              <option value="Vaccination">Vaccination Booster 💉</option>
              <option value="Grooming & Spa">Grooming & Spa Bath ✂️</option>
              <option value="Dental Cleaning">Dental Cleaning 🦷</option>
              <option value="Surgery Consultation">Surgery Consultation 🏥</option>
            </select>
          </div>
        </div>

        <div className="input-field">
          <label htmlFor="notes">Special Health Notes & Symptoms</label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            placeholder="Mention allergies, past medical conditions, or specific symptoms..."
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-button-row">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'Booking...' : '✅ Confirm Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
}
