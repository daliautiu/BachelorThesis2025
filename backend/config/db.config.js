const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Database path
const dbPath = path.resolve(__dirname, '../database/referee.sqlite');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false // Set to console.log to see SQL queries
});

// Test database connection function
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
}

module.exports = {
  sequelize,
  testConnection
};