// routes/availability.routes.js
const express = require('express');
const availabilityController = require('../controllers/availability.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Get availability for the logged-in user
router.get('/', verifyToken, availabilityController.getUserAvailability);

// Update user availability
router.put('/', verifyToken, availabilityController.updateAvailability);

// Get referee availability for a date range - Admin only
router.get('/referees', [verifyToken, isAdmin], availabilityController.getRefereeAvailability);

module.exports = router;