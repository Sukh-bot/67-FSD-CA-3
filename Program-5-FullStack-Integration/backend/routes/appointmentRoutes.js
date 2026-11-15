const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateJWT } = require('../middleware/auth');

// Public read endpoints
router.get('/stats', appointmentController.getStats);
router.get('/', appointmentController.getAll);
router.get('/:id', appointmentController.getById);

// Creation, update, delete endpoints
router.post('/', appointmentController.create);
router.put('/:id', appointmentController.update);
router.delete('/:id', appointmentController.delete);

module.exports = router;
