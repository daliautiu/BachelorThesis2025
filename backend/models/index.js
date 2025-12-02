// models/index.js
const { sequelize } = require('../config/db.config');
const User = require('./user.model');

// Export models
module.exports = {
  sequelize,
  User
};