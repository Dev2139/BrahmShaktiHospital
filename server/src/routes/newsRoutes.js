import express from 'express';
import {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} from '../controllers/newsController.js';

const router = express.Router();

// Public / Filtered: Get published hospital news notices and circulars
router.get('/', getNews);

// Public / Detail: Get single notice circular
router.get('/:id', getNewsById);

// Admin: Create notice with audience distribution
router.post('/', createNews);

// Admin: Update notice
router.put('/:id', updateNews);
router.patch('/:id', updateNews);

// Admin: Delete notice
router.delete('/:id', deleteNews);

export default router;
