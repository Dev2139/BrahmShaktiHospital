import mongoose from 'mongoose';

const doctorLeaveSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    departmentId: { type: String, required: true },
    departmentName: { type: String, required: true },
    leaveType: {
      type: String,
      enum: ['Casual Leave', 'Medical Leave', 'Conference / CME', 'Vacation', 'Emergency Leave'],
      default: 'Casual Leave'
    },
    startDate: { type: String, required: true }, // YYYY-MM-DD
    endDate: { type: String, required: true },   // YYYY-MM-DD
    daysCount: { type: Number, default: 1 },
    reason: { type: String, default: '' },
    substituteDoctor: { type: String, default: 'On-Call Emergency Specialist' },
    status: {
      type: String,
      enum: ['Approved', 'Pending', 'Rejected'],
      default: 'Approved'
    },
    appliedOn: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const DoctorLeave = mongoose.models.DoctorLeave || mongoose.model('DoctorLeave', doctorLeaveSchema);
export default DoctorLeave;
