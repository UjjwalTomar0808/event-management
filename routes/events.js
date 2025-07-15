const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { eventSchema } = require('../validators/eventValidator');
const controller = require('../controllers/eventController');

router.post('/', validate(eventSchema), controller.createEvent);
router.get('/:id', controller.getEventDetails);
router.post('/:id/register', controller.registerUser);
router.delete('/:id/register', controller.cancelRegistration);
router.get('/upcoming/list', controller.listUpcomingEvents);
router.get('/:id/stats', controller.eventStats);

module.exports = router;
