const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Registration = sequelize.define('Registration', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  eventId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  timestamps: false
});

module.exports = Registration;
