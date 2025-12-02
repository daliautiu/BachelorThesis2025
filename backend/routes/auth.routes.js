// routes/auth.routes.js
const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Register new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

module.exports = router;  // Make sure this line is present