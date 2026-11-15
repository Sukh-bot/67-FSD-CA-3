/**
 * Authentication Routes
 * FSD Continuous Assessment (CA-3) | Roll No: 67
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration } = require('../middleware/validate');
const { authenticateJWT } = require('../middleware/auth');

// Public auth endpoints
router.post('/register', validateRegistration, authController.register);
router.post('/login', authController.login);

// Protected auth endpoint
router.get('/me', authenticateJWT, authController.getProfile);

module.exports = router;
