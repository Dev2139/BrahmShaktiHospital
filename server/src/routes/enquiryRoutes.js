import express from 'express';
import {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry
} from '../controllers/enquiryController.js';

const router = express.Router();

router.post('/', createEnquiry);
router.get('/', getEnquiries);
router.patch('/:id', updateEnquiryStatus);
router.delete('/:id', deleteEnquiry);

export default router;
