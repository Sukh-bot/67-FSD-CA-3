/**
 * Appointment Routes (CRUD & Protected Endpoints)
 * FSD Continuous Assessment (CA-3) | Roll No: 67
 */

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { validateAppointment } = require('../middleware/validate');
const { authenticateJWT } = require('../middleware/auth');

// Protected administrative stats endpoint (must be declared before :id route)
router.get('/admin/stats', authenticateJWT, appointmentController.getAdminStats);

// CRUD Routes:
// 1. GET all appointments (with optional filters)
router.get('/', appointmentController.getAllAppointments);

// 2. GET single appointment by ID
router.get('/:id', appointmentController.getAppointmentById);

// 3. POST create appointment (Protected with JWT + Input Validation Middleware)
router.post('/', authenticateJWT, validateAppointment, appointmentController.createAppointment);

// 4. PUT update appointment (Protected with JWT)
router.put('/:id', authenticateJWT, appointmentController.updateAppointment);

// 5. DELETE cancel appointment (Protected with JWT)
router.delete('/:id', authenticateJWT, appointmentController.deleteAppointment);

module.exports = router;
