const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  title: DataTypes.STRING,
  datetime: DataTypes.DATE,
  location: DataTypes.STRING,
  capacity: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 1000
    }
  }
});

module.exports = Event;
