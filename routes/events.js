import express from 'express';
import validate from '../middleware/validate.js';
import { eventSchema } from '../validators/eventValidator.js';
import {
  createEvent,
  getEventDetails,
  registerUser,
  cancelRegistration,
  listUpcomingEvents,
  eventStats
} from '../controllers/eventController.js';

const router = express.Router();

router.post('/', validate(eventSchema), createEvent);
router.get('/:id', getEventDetails);
router.post('/:id/register', registerUser);
router.delete('/:id/register', cancelRegistration);
router.get('/upcoming/list', listUpcomingEvents);
router.get('/:id/stats', eventStats);

export default router;
