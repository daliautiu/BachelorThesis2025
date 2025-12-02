// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({
      message: 'No token provided!'
    });
  }

  // Remove Bearer from string
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_default_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: 'Unauthorized!'
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (user.role === 'ADMIN') {
      next();
      return;
    }

    res.status(403).json({
      message: 'Require Admin Role!'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to validate user role!'
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin
};