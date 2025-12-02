const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Register new user
exports.register = async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    
    // Check if email already exists
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      address: req.body.address || null,
      qualification: req.body.qualification || null,
      experience: req.body.experience || null,
      preferredAgeGroups: req.body.preferredAgeGroups || null,
      bio: req.body.bio || null
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_default_jwt_secret',
      { expiresIn: '24h' }
    );

    console.log('User registered successfully:', user.email);
    
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    console.log('Login request received:', req.body.email);
    
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_default_jwt_secret',
      { expiresIn: '24h' }
    );

    console.log('User logged in successfully:', user.email);
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};