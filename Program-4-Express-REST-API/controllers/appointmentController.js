/**
 * Appointment Controller
 * Implements CRUD routes: GET, POST, PUT, DELETE, and Protected Admin Stats
 * FSD Continuous Assessment (CA-3) | Roll No: 67
 */

const { appointments } = require('../models/store');

/**
 * GET /api/appointments
 * Retrieves list of appointments with optional filtering, search, and sorting
 */
exports.getAllAppointments = (req, res) => {
  const { status, service, search, sortBy } = req.query;

  let results = [...appointments];

  // Filtering
  if (status) {
    results = results.filter(a => a.status.toLowerCase() === status.toLowerCase());
  }
  if (service) {
    results = results.filter(a => a.service.toLowerCase() === service.toLowerCase());
  }

  // Search keyword
  if (search) {
    const term = search.toLowerCase();
    results = results.filter(a =>
      a.petName.toLowerCase().includes(term) ||
      a.ownerName.toLowerCase().includes(term) ||
      (a.breed && a.breed.toLowerCase().includes(term))
    );
  }

  // Sorting
  if (sortBy === 'date-asc') {
    results.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
  } else if (sortBy === 'date-desc') {
    results.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
  } else if (sortBy === 'name-asc') {
    results.sort((a, b) => a.petName.localeCompare(b.petName));
  }

  res.status(200).json({
    success: true,
    count: results.length,
    totalRecords: appointments.length,
    data: results
  });
};

/**
 * GET /api/appointments/:id
 * Retrieve a single appointment record
 */
exports.getAppointmentById = (req, res) => {
  const { id } = req.params;
  const apt = appointments.find(a => a.id.toLowerCase() === id.toLowerCase());

  if (!apt) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Appointment with ID "${id}" was not found.`
    });
  }

  res.status(200).json({
    success: true,
    data: apt
  });
};

/**
 * POST /api/appointments
 * Create a new appointment (Protected route: requires valid JWT & Input Validation)
 */
exports.createAppointment = (req, res) => {
  const { petName, species, breed, ownerName, ownerPhone, ownerEmail, appointmentDate, service, notes } = req.body;

  const newAppointment = {
    id: `APT-${Math.floor(4000 + Math.random() * 6000)}`,
    petName: petName.trim(),
    species,
    breed: breed ? breed.trim() : 'Mixed Breed',
    ownerName: ownerName.trim(),
    ownerPhone: String(ownerPhone).trim(),
    ownerEmail: ownerEmail.trim(),
    appointmentDate,
    service,
    status: 'Scheduled',
    notes: notes ? notes.trim() : '',
    createdBy: req.user ? req.user.email : 'System Admin',
    createdAt: new Date().toISOString()
  };

  appointments.unshift(newAppointment);

  res.status(201).json({
    success: true,
    message: 'Appointment successfully created via Express REST API.',
    data: newAppointment
  });
};

/**
 * PUT /api/appointments/:id
 * Update an existing appointment (Protected route: requires valid JWT)
 */
exports.updateAppointment = (req, res) => {
  const { id } = req.params;
  const index = appointments.findIndex(a => a.id.toLowerCase() === id.toLowerCase());

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Cannot update: Appointment with ID "${id}" not found.`
    });
  }

  // Apply updates while preserving ID and creation timestamp
  appointments[index] = {
    ...appointments[index],
    ...req.body,
    id: appointments[index].id,
    updatedAt: new Date().toISOString(),
    updatedBy: req.user ? req.user.email : 'System Admin'
  };

  res.status(200).json({
    success: true,
    message: `Appointment ${id} successfully updated.`,
    data: appointments[index]
  });
};

/**
 * DELETE /api/appointments/:id
 * Cancel / Delete an appointment (Protected route: requires valid JWT)
 */
exports.deleteAppointment = (req, res) => {
  const { id } = req.params;
  const index = appointments.findIndex(a => a.id.toLowerCase() === id.toLowerCase());

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Cannot delete: Appointment with ID "${id}" not found.`
    });
  }

  const deleted = appointments.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: `Appointment "${deleted.petName}" (${id}) was cancelled and deleted.`,
    data: deleted
  });
};

/**
 * GET /api/appointments/admin/stats
 * Protected route returning clinical KPIs (requires JWT token)
 */
exports.getAdminStats = (req, res) => {
  const total = appointments.length;
  const scheduled = appointments.filter(a => a.status === 'Scheduled').length;
  const confirmed = appointments.filter(a => a.status === 'Confirmed').length;
  const inProgress = appointments.filter(a => a.status === 'In Progress').length;
  const completed = appointments.filter(a => a.status === 'Completed').length;
  const cancelled = appointments.filter(a => a.status === 'Cancelled').length;

  res.status(200).json({
    success: true,
    authenticatedUser: req.user.email,
    role: req.user.role,
    metrics: {
      total,
      scheduled,
      confirmed,
      inProgress,
      completed,
      cancelled
    }
  });
};
