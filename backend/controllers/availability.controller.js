// controllers/availability.controller.js
const { Availability, User } = require('../models');
const { Op } = require('sequelize');

// Get availability for the logged-in user
exports.getUserAvailability = async (req, res) => {
  try {
    const availability = await Availability.findAll({
      where: { userId: req.userId },
      order: [['date', 'ASC']]
    });
    
    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user availability
exports.updateAvailability = async (req, res) => {
  try {
    const { availabilities } = req.body;
    
    if (!availabilities || typeof availabilities !== 'object') {
      return res.status(400).json({ message: 'Invalid availability data' });
    }
    
    // Process each date
    const results = [];
    
    for (const [date, type] of Object.entries(availabilities)) {
      // Find or create availability entry
      const [availability, created] = await Availability.findOrCreate({
        where: { userId: req.userId, date },
        defaults: { type }
      });
      
      // Update if it exists
      if (!created) {
        await availability.update({ type });
      }
      
      results.push(availability);
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get referee availability for a date range - Admin only
exports.getRefereeAvailability = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const availability = await Availability.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [['date', 'ASC']]
    });
    
    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};