import { Enquiry } from '../models/Enquiry.js';
import { isMongoConnected } from '../config/db.js';

// In-memory store fallback if MongoDB is not connected
const demonstrationEnquiries = [];

export const createEnquiry = async (req, res, next) => {
  try {
    const {
      type = 'general_enquiry',
      fullName,
      name,
      phone,
      email,
      department,
      subject,
      doctorName,
      preferredDate,
      country = 'India',
      message
    } = req.body;

    const contactName = (fullName || name || '').trim();
    const contactDepartment = (department || subject || 'General Hospital Enquiry').trim();

    // Validation
    if (!contactName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your full name.'
      });
    }

    if (!phone || !phone.trim() || phone.replace(/\D/g, '').length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid contact telephone number.'
      });
    }

    const referenceNumber = `BSH-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const enquiryPayload = {
      type,
      fullName: contactName,
      phone: phone.trim(),
      email: email ? email.trim() : '',
      department: contactDepartment,
      doctorName: doctorName || 'Hospital Coordination Desk',
      preferredDate: preferredDate || 'Immediate',
      country,
      message: message ? message.trim() : '',
      referenceNumber,
      status: 'received',
      createdAt: new Date()
    };

    if (isMongoConnected) {
      try {
        const saved = await Enquiry.create(enquiryPayload);
        return res.status(201).json({
          success: true,
          message: 'Inquiry received by Brahm Shakti Hospital Administration Desk.',
          referenceNumber,
          source: 'mongodb',
          data: saved
        });
      } catch (err) {
        console.error('[Enquiry] MongoDB save error, falling back to memory store:', err.message);
      }
    }

    // Memory store fallback
    const memRecord = { ...enquiryPayload, _id: `mem-${Date.now()}` };
    demonstrationEnquiries.unshift(memRecord);
    if (demonstrationEnquiries.length > 100) demonstrationEnquiries.pop();

    return res.status(201).json({
      success: true,
      message: 'Inquiry received by Brahm Shakti Hospital Administration Desk.',
      referenceNumber,
      source: 'demonstration_buffer',
      data: memRecord
    });
  } catch (error) {
    next(error);
  }
};

export const getEnquiries = async (req, res, next) => {
  try {
    if (isMongoConnected) {
      try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean();
        return res.status(200).json({
          success: true,
          count: enquiries.length,
          data: enquiries
        });
      } catch (err) {
        console.error('[Enquiry] Error fetching from MongoDB:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      count: demonstrationEnquiries.length,
      data: demonstrationEnquiries
    });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['received', 'acknowledged', 'in_review', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be received, acknowledged, in_review, or resolved.'
      });
    }

    if (isMongoConnected && !id.startsWith('mem-')) {
      const updated = await Enquiry.findByIdAndUpdate(id, { status }, { new: true });
      if (updated) {
        return res.status(200).json({
          success: true,
          message: 'Inquiry status updated successfully.',
          data: updated
        });
      }
    }

    // Memory store update
    const memItem = demonstrationEnquiries.find((e) => e._id === id || e.referenceNumber === id);
    if (memItem) {
      memItem.status = status;
      return res.status(200).json({
        success: true,
        message: 'Inquiry status updated.',
        data: memItem
      });
    }

    return res.status(404).json({
      success: false,
      message: 'Inquiry record not found.'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected && !id.startsWith('mem-')) {
      await Enquiry.findByIdAndDelete(id);
    }

    const memIndex = demonstrationEnquiries.findIndex((e) => e._id === id || e.referenceNumber === id);
    if (memIndex !== -1) {
      demonstrationEnquiries.splice(memIndex, 1);
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
