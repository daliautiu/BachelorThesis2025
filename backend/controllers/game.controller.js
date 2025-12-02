// controllers/game.controller.js
const { Game, User, Assignment } = require('../models');
const { Op } = require('sequelize');

// Get all games
exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.findAll({
      order: [['gameDate', 'ASC'], ['startTime', 'ASC']]
    });
    
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get game by ID
exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id, {
      include: [
        {
          model: User,
          through: { 
            model: Assignment,
            attributes: ['id', 'role', 'status', 'fee'] 
          },
          attributes: ['id', 'name', 'email', 'phone'],
          as: 'Users'
        }
      ]
    });
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new game
exports.createGame = async (req, res) => {
  try {
    const newGame = await Game.create({
      teams: req.body.teams,
      gameDate: req.body.gameDate,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      location: req.body.location,
      address: req.body.address,
      league: req.body.league,
      division: req.body.division,
      status: req.body.status || 'scheduled',
      notes: req.body.notes,
      fee: req.body.fee,
      refereesNeeded: req.body.refereesNeeded || 3
    });
    
    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a game
exports.updateGame = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    await game.update({
      teams: req.body.teams || game.teams,
      gameDate: req.body.gameDate || game.gameDate,
      startTime: req.body.startTime || game.startTime,
      endTime: req.body.endTime || game.endTime,
      location: req.body.location || game.location,
      address: req.body.address || game.address,
      league: req.body.league || game.league,
      division: req.body.division || game.division,
      status: req.body.status || game.status,
      notes: req.body.notes || game.notes,
      fee: req.body.fee || game.fee,
      refereesNeeded: req.body.refereesNeeded || game.refereesNeeded
    });
    
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a game
exports.deleteGame = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    await game.destroy();
    
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};