const { Appointment } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res, next) => {
  try {
    const { status, search, service } = req.query;
    const where = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (service && service !== 'ALL') {
      where.service = service;
    }
    if (search) {
      where[Op.or] = [
        { petName: { [Op.like]: `%${search}%` } },
        { ownerName: { [Op.like]: `%${search}%` } },
        { breed: { [Op.like]: `%${search}%` } }
      ];
    }

    const appointments = await Appointment.findAll({
      where,
      order: [['appointmentDate', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const apt = await Appointment.findByPk(req.params.id);
    if (!apt) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.status(200).json({ success: true, data: apt });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { petName, species, breed, ownerName, ownerPhone, ownerEmail, appointmentDate, service, notes } = req.body;

    const apt = await Appointment.create({
      petName,
      species,
      breed: breed || 'Mixed',
      ownerName,
      ownerPhone,
      ownerEmail,
      appointmentDate,
      service,
      status: 'Scheduled',
      notes: notes || '',
      createdBy: req.user ? req.user.name : 'Web Client'
    });

    res.status(201).json({
      success: true,
      message: 'Appointment created and persisted in database.',
      data: apt
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const apt = await Appointment.findByPk(req.params.id);
    if (!apt) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    await apt.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully in database.',
      data: apt
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const apt = await Appointment.findByPk(req.params.id);
    if (!apt) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    await apt.destroy();

    res.status(200).json({
      success: true,
      message: `Appointment for ${apt.petName} deleted from database.`
    });
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const total = await Appointment.count();
    const scheduled = await Appointment.count({ where: { status: 'Scheduled' } });
    const confirmed = await Appointment.count({ where: { status: 'Confirmed' } });
    const inProgress = await Appointment.count({ where: { status: 'In Progress' } });
    const completed = await Appointment.count({ where: { status: 'Completed' } });

    res.status(200).json({
      success: true,
      stats: { total, scheduled, confirmed, inProgress, completed }
    });
  } catch (err) {
    next(err);
  }
};
