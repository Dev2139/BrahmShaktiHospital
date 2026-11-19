import express from 'express';
import {
  getDoctorLeaves,
  createDoctorLeave,
  updateDoctorLeaveStatus,
  deleteDoctorLeave
} from '../controllers/leaveController.js';

const router = express.Router();

router.get('/', getDoctorLeaves);
router.post('/', createDoctorLeave);
router.put('/:id', updateDoctorLeaveStatus);
router.delete('/:id', deleteDoctorLeave);

export default router;
