const { Event, User, Registration } = require('../models');
const { Op } = require('sequelize');
const dayjs = require('dayjs');

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    return res.status(201).json({ eventId: event.id });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getEventDetails = async (req, res) => {
  const event = await Event.findByPk(req.params.id, {
    include: {
      model: User,
      attributes: ['id', 'name', 'email'],
      through: { attributes: [] }
    }
  });
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
};

exports.registerUser = async (req, res) => {
  const { userId } = req.body;
  const event = await Event.findByPk(req.params.id, {
    include: { model: User }
  });
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (dayjs(event.datetime).isBefore(dayjs())) {
    return res.status(400).json({ message: 'Cannot register for past event' });
  }

  const existing = await Registration.findOne({ where: { userId, eventId: event.id } });
  if (existing) return res.status(409).json({ message: 'User already registered' });

  const count = await Registration.count({ where: { eventId: event.id } });
  if (count >= event.capacity) {
    return res.status(400).json({ message: 'Event is at full capacity' });
  }

  await Registration.create({ userId, eventId: event.id });
  res.status(200).json({ message: 'User registered successfully' });
};

exports.cancelRegistration = async (req, res) => {
  const { userId } = req.body;
  const deleted = await Registration.destroy({
    where: { userId, eventId: req.params.id }
  });

  if (!deleted) return res.status(404).json({ message: 'User not registered for event' });
  res.status(200).json({ message: 'Registration cancelled' });
};

exports.listUpcomingEvents = async (req, res) => {
  const now = new Date();
  const events = await Event.findAll({
    where: {
      datetime: { [Op.gt]: now }
    },
    order: [['datetime', 'ASC'], ['location', 'ASC']]
  });
  res.json(events);
};

exports.eventStats = async (req, res) => {
  const event = await Event.findByPk(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const total = await Registration.count({ where: { eventId: event.id } });
  const percentage = (total / event.capacity) * 100;

  res.json({
    totalRegistrations: total,
    remainingCapacity: event.capacity - total,
    percentageUsed: Math.round(percentage)
  });
};
