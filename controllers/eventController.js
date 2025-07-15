import prisma from '../prisma/client.js';
import dayjs from 'dayjs';

export const createEvent = async (req, res) => {
  try {
    const event = await prisma.event.create({ data: req.body });
    return res.status(201).json({ eventId: event.id });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getEventDetails = async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { registrations: { include: { user: true } } }
  });
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
};

export const registerUser = async (req, res) => {
  const { userId } = req.body;
  const eventId = parseInt(req.params.id);

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (dayjs(event.datetime).isBefore(dayjs())) {
    return res.status(400).json({ message: 'Cannot register for past event' });
  }

  const existing = await prisma.registration.findUnique({ where: { userId_eventId: { userId, eventId } } });
  if (existing) return res.status(409).json({ message: 'User already registered' });

  const count = await prisma.registration.count({ where: { eventId } });
  if (count >= event.capacity) {
    return res.status(400).json({ message: 'Event is at full capacity' });
  }

  await prisma.registration.create({ data: { userId, eventId } });
  res.status(200).json({ message: 'User registered successfully' });
};

export const cancelRegistration = async (req, res) => {
  const { userId } = req.body;
  const eventId = parseInt(req.params.id);

  try {
    await prisma.registration.delete({ where: { userId_eventId: { userId, eventId } } });
    res.status(200).json({ message: 'Registration cancelled' });
  } catch {
    res.status(404).json({ message: 'User not registered for event' });
  }
};

export const listUpcomingEvents = async (req, res) => {
  const events = await prisma.event.findMany({
    where: { datetime: { gt: new Date() } },
    orderBy: [{ datetime: 'asc' }, { location: 'asc' }]
  });
  res.json(events);
};

export const eventStats = async (req, res) => {
  const eventId = parseInt(req.params.id);
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const total = await prisma.registration.count({ where: { eventId } });
  const percentage = (total / event.capacity) * 100;

  res.json({
    totalRegistrations: total,
    remainingCapacity: event.capacity - total,
    percentageUsed: Math.round(percentage)
  });
};
