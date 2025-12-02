// models/user.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  qualification: {
    type: DataTypes.STRING
  },
  experience: {
    type: DataTypes.STRING
  },
  preferredAgeGroups: {
    type: DataTypes.STRING
  },
  bio: {
    type: DataTypes.TEXT
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'REFEREE'
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

// Instance method to check password
User.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;