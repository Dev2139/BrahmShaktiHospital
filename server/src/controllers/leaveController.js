import { DoctorLeave } from '../models/DoctorLeave.js';
import { isMongoConnected } from '../config/db.js';
import { doctorLeavesData } from '../data/seedData.js';

let inMemoryLeaves = [...(doctorLeavesData || [])];

export const getDoctorLeaves = async (req, res, next) => {
  try {
    const { doctorId, departmentId, status, month } = req.query;

    if (isMongoConnected) {
      let query = {};
      if (doctorId && doctorId !== 'all') query.doctorId = doctorId;
      if (departmentId && departmentId !== 'all') query.departmentId = departmentId;
      if (status && status !== 'all') query.status = status;
      if (month) {
        query.startDate = { $regex: `^${month}` };
      }

      const dbLeaves = await DoctorLeave.find(query).sort({ startDate: -1 });
      if (dbLeaves && dbLeaves.length > 0) {
        return res.status(200).json({
          success: true,
          count: dbLeaves.length,
          data: dbLeaves
        });
      }
    }

    let filtered = [...inMemoryLeaves];
    if (doctorId && doctorId !== 'all') {
      filtered = filtered.filter((l) => l.doctorId === doctorId);
    }
    if (departmentId && departmentId !== 'all') {
      filtered = filtered.filter((l) => l.departmentId === departmentId);
    }
    if (status && status !== 'all') {
      filtered = filtered.filter((l) => l.status === status);
    }
    if (month) {
      filtered = filtered.filter((l) => l.startDate.startsWith(month));
    }

    return res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    next(error);
  }
};

export const createDoctorLeave = async (req, res, next) => {
  try {
    const {
      doctorId,
      doctorName,
      departmentId,
      departmentName,
      leaveType,
      startDate,
      endDate,
      daysCount,
      reason,
      substituteDoctor,
      status
    } = req.body;

    const newLeave = {
      id: `leave-${Date.now()}`,
      doctorId: doctorId || 'doc-bsh-01',
      doctorName: doctorName || 'Doctor',
      departmentId: departmentId || 'medicine',
      departmentName: departmentName || 'General Medicine',
      leaveType: leaveType || 'Casual Leave',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || startDate || new Date().toISOString().split('T')[0],
      daysCount: Number(daysCount) || 1,
      reason: reason || 'Scheduled leave',
      substituteDoctor: substituteDoctor || 'On-Call Emergency Specialist',
      status: status || 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    };

    if (isMongoConnected) {
      await DoctorLeave.create(newLeave);
    }

    inMemoryLeaves.unshift(newLeave);

    return res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      data: newLeave
    });
  } catch (error) {
    next(error);
  }
};

export const updateDoctorLeaveStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (isMongoConnected) {
      const updated = await DoctorLeave.findOneAndUpdate(
        { id },
        { status, notes },
        { new: true }
      );
      if (updated) {
        return res.status(200).json({
          success: true,
          message: `Leave status updated to ${status}`,
          data: updated
        });
      }
    }

    const idx = inMemoryLeaves.findIndex((l) => l.id === id);
    if (idx !== -1) {
      inMemoryLeaves[idx] = {
        ...inMemoryLeaves[idx],
        status: status || inMemoryLeaves[idx].status,
        notes: notes !== undefined ? notes : inMemoryLeaves[idx].notes
      };
      return res.status(200).json({
        success: true,
        message: `Leave status updated to ${status}`,
        data: inMemoryLeaves[idx]
      });
    }

    return res.status(404).json({
      success: false,
      message: 'Leave record not found'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDoctorLeave = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      await DoctorLeave.findOneAndDelete({ id });
    }

    inMemoryLeaves = inMemoryLeaves.filter((l) => l.id !== id);

    return res.status(200).json({
      success: true,
      message: 'Doctor leave record cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};
