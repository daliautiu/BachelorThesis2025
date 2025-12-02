// routes/user.routes.js
const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Get user profile - Protected route
router.get('/profile', verifyToken, userController.getProfile);

// Update user profile - Protected route
router.put('/profile', verifyToken, userController.updateProfile);

module.exports = router;  // Make sure this line is present