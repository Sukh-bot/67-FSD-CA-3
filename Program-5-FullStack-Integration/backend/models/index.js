const sequelize = require('../config/database');
const User = require('./User');
const Appointment = require('./Appointment');

// Relationships if any
User.hasMany(Appointment, { foreignKey: 'userId', as: 'appointments' });
Appointment.belongsTo(User, { foreignKey: 'userId', as: 'doctor' });

module.exports = {
  sequelize,
  User,
  Appointment
};
