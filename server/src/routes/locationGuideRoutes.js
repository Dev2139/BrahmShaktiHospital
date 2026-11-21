import express from 'express';
import {
  getLocationGuide,
  updateLocationGuide
} from '../controllers/locationGuideController.js';

const router = express.Router();

// Public: Get location and directions guide
router.get('/', getLocationGuide);

// Admin: Update location and directions guide
router.put('/', updateLocationGuide);
router.patch('/', updateLocationGuide);

export default router;
