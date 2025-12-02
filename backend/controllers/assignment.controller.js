// controllers/assignment.controller.js
const { Assignment, Game, User, Notification } = require('../models');

// Get assignments for the logged-in user
exports.getUserAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      where: { userId: req.userId },
      include: [
        {
          model: Game,
          attributes: ['id', 'teams', 'gameDate', 'startTime', 'endTime', 'location', 'fee']
        }
      ],
      order: [
        [Game, 'gameDate', 'ASC'],
        [Game, 'startTime', 'ASC']
      ]
    });
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create an assignment - Admin only
exports.createAssignment = async (req, res) => {
  try {
    const { gameId, userId, role, fee } = req.body;
    
    // Check if game exists
    const game = await Game.findByPk(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if assignment already exists
    const existingAssignment = await Assignment.findOne({
      where: { gameId, userId }
    });
    
    if (existingAssignment) {
      return res.status(400).json({ message: 'Assignment already exists' });
    }
    
    // Create assignment
    const assignment = await Assignment.create({
      gameId,
      userId,
      role,
      status: 'pending',
      fee: fee || game.fee
    });
    
    // Create notification for the user
    await Notification.create({
      userId,
      title: 'New Game Assignment',
      message: `You have been assigned as ${role} for the game ${game.teams} on ${game.gameDate} at ${game.startTime}.`,
      type: 'ASSIGNMENT',
      gameId
    });
    
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept an assignment
exports.acceptAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [Game]
    });
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    if (assignment.userId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await assignment.update({ status: 'accepted' });
    
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Decline an assignment
exports.declineAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [Game]
    });
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    if (assignment.userId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await assignment.update({ status: 'declined' });
    
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an assignment - Admin only
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    await assignment.destroy();
    
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};