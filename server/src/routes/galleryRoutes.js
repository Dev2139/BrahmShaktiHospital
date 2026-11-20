import express from 'express';
import {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem
} from '../controllers/galleryController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public: Get all active gallery photos for landing page
router.get('/', getGalleryItems);

// Protected Admin: Add a new photo to gallery
router.post('/', verifyToken, requireRole('admin', 'superadmin'), createGalleryItem);

// Protected Admin: Remove a photo from gallery
router.delete('/:id', verifyToken, requireRole('admin', 'superadmin'), deleteGalleryItem);

export default router;
