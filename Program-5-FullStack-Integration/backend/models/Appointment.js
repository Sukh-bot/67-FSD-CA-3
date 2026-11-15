const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => `APT-${Math.floor(5000 + Math.random() * 5000)}`
  },
  petName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 60]
    }
  },
  species: {
    type: DataTypes.STRING,
    allowNull: false
  },
  breed: {
    type: DataTypes.STRING,
    defaultValue: 'Mixed'
  },
  ownerName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  ownerPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ownerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  service: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'),
    defaultValue: 'Scheduled'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.STRING,
    defaultValue: 'Portal User'
  }
}, {
  timestamps: true,
  tableName: 'appointments'
});

module.exports = Appointment;
