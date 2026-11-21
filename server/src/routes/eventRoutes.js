import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';

const router = express.Router();

// Public: Get all published hospital events
router.get('/', getEvents);

// Public: Get single event by id or slug
router.get('/:id', getEventById);

// Admin: Create new event
router.post('/', createEvent);

// Admin: Update event by id
router.put('/:id', updateEvent);
router.patch('/:id', updateEvent);

// Admin: Delete event by id
router.delete('/:id', deleteEvent);

export default router;
