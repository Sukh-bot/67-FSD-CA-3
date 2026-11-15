/**
 * Input Validation Middleware
 * FSD Continuous Assessment (CA-3) | Roll No: 67
 */

const VALID_SPECIES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Reptile', 'Other'];
const VALID_SERVICES = [
  'General Checkup',
  'Vaccination',
  'Grooming & Spa',
  'Dental Cleaning',
  'Surgery Consultation',
  'Emergency Care'
];
const VALID_STATUSES = ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

/**
 * Validates Pet Appointment Creation / Update Payload
 */
function validateAppointment(req, res, next) {
  const { petName, species, ownerName, ownerPhone, ownerEmail, appointmentDate, service, status } = req.body;
  const errors = [];

  // 1. Pet Name
  if (!petName || typeof petName !== 'string' || petName.trim().length < 2) {
    errors.push({ field: 'petName', message: 'petName is required and must have at least 2 characters.' });
  }

  // 2. Species
  if (!species || !VALID_SPECIES.includes(species)) {
    errors.push({ field: 'species', message: `species must be one of: ${VALID_SPECIES.join(', ')}` });
  }

  // 3. Owner Name
  if (!ownerName || typeof ownerName !== 'string' || ownerName.trim().length < 2) {
    errors.push({ field: 'ownerName', message: 'ownerName is required and must have at least 2 characters.' });
  }

  // 4. Owner Phone (10-digit Indian Mobile Regex)
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!ownerPhone || !phoneRegex.test(String(ownerPhone).trim())) {
    errors.push({ field: 'ownerPhone', message: 'ownerPhone must be a valid 10-digit mobile number starting with 6-9.' });
  }

  // 5. Owner Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!ownerEmail || !emailRegex.test(String(ownerEmail).trim())) {
    errors.push({ field: 'ownerEmail', message: 'ownerEmail must be a valid email address.' });
  }

  // 6. Appointment Date (Future Date check)
  if (!appointmentDate) {
    errors.push({ field: 'appointmentDate', message: 'appointmentDate is required.' });
  } else {
    const parsedDate = new Date(appointmentDate);
    if (isNaN(parsedDate.getTime())) {
      errors.push({ field: 'appointmentDate', message: 'appointmentDate must be a valid ISO datetime format.' });
    } else if (parsedDate <= new Date()) {
      errors.push({ field: 'appointmentDate', message: 'appointmentDate must be in the future.' });
    }
  }

  // 7. Service
  if (!service || !VALID_SERVICES.includes(service)) {
    errors.push({ field: 'service', message: `service must be one of: ${VALID_SERVICES.join(', ')}` });
  }

  // 8. Status (optional on create, but if provided must be valid)
  if (status && !VALID_STATUSES.includes(status)) {
    errors.push({ field: 'status', message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Input Validation Failed',
      errorCount: errors.length,
      errors
    });
  }

  next();
}

/**
 * Validates User Registration
 */
function validateRegistration(req, res, next) {
  const { name, email, password, role } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.push({ field: 'email', message: 'Valid email is required.' });
  }

  if (!password || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long.' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Registration Validation Failed',
      errors
    });
  }

  next();
}

module.exports = {
  validateAppointment,
  validateRegistration
};
