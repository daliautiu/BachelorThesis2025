// routes/game.routes.js
const express = require('express');
const gameController = require('../controllers/game.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Get all games
router.get('/', verifyToken, gameController.getAllGames);

// Get game by ID
router.get('/:id', verifyToken, gameController.getGameById);

// Create a new game - Admin only
router.post('/', [verifyToken, isAdmin], gameController.createGame);

// Update a game - Admin only
router.put('/:id', [verifyToken, isAdmin], gameController.updateGame);

// Delete a game - Admin only
router.delete('/:id', [verifyToken, isAdmin], gameController.deleteGame);

module.exports = router;