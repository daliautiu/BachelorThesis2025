// controllers/user.controller.js
const { User } = require('../models');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user data
    const updatedUser = await user.update({
      name: req.body.name || user.name,
      phone: req.body.phone || user.phone,
      address: req.body.address || user.address,
      qualification: req.body.qualification || user.qualification,
      experience: req.body.experience || user.experience,
      preferredAgeGroups: req.body.preferredAgeGroups || user.preferredAgeGroups,
      bio: req.body.bio || user.bio
    });
    
    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      qualification: updatedUser.qualification,
      experience: updatedUser.experience,
      preferredAgeGroups: updatedUser.preferredAgeGroups,
      bio: updatedUser.bio,
      role: updatedUser.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};