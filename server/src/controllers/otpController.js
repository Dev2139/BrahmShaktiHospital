import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import { isMongoConnected } from '../config/db.js';
import { usersData, patientsData } from '../data/seedData.js';
import { sendOtpEmail } from '../services/emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'brahm_shakti_hospital_jwt_secret_key_2026_secured';

// In-memory OTP storage with TTL for high reliability
// Map: email -> { otp, expiresAt, patientName, uhid, role, type }
const otpStore = new Map();

// Helper to generate 6-digit cryptographic-safe-like numerical OTP
const generate6DigitOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * POST /api/auth/send-otp
 * Body: { email, type: 'registered_patient' | 'new_patient' }
 *
 * For 'registered_patient':
 * 1. Checks if the user / patient exists in the system (Database or Seed Data).
 * 2. If NOT found, returns 404 with error message:
 *    "No registered patient account found with this email. Please register as a new patient."
 * 3. If found, generates 6-digit OTP, stores it with 10 min expiry, and sends via Nodemailer.
 *
 * For 'new_patient':
 * 1. Generates 6-digit OTP, stores it with 10 min expiry, and sends via Nodemailer.
 */
export const sendOtp = async (req, res) => {
  try {
    const { email, type = 'registered_patient' } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    let patientName = 'Valued Patient';
    let uhid = '';

    if (type === 'registered_patient') {
      let existingUser = null;
      let existingPatient = null;

      // 1. Check MongoDB if connected
      if (isMongoConnected) {
        existingUser = await User.findOne({ email: cleanEmail });
        existingPatient = await Patient.findOne({ email: cleanEmail });
      }

      // 2. Check seed/in-memory fallback
      if (!existingUser) {
        existingUser = usersData.find((u) => u.email.toLowerCase() === cleanEmail);
      }
      if (!existingPatient) {
        existingPatient = patientsData.find((p) => p.email && p.email.toLowerCase() === cleanEmail);
      }

      // If neither User nor Patient exists, reject with 404
      if (!existingUser && !existingPatient) {
        return res.status(404).json({
          success: false,
          userNotFound: true,
          message: 'No registered patient account found with this email. Please register as a new patient.'
        });
      }

      // Determine patient name and UHID
      if (existingPatient) {
        patientName = existingPatient.name;
        uhid = existingPatient.uhid || existingPatient.patientId || '';
      } else if (existingUser) {
        patientName = existingUser.name;
        uhid = existingUser.patientId || existingUser.uhid || '';
      }
    } else {
      // New patient registration flow
      if (req.body.name) {
        patientName = req.body.name;
      }
    }

    // Generate 6-digit OTP
    const otp = generate6DigitOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(cleanEmail, {
      otp,
      expiresAt,
      patientName,
      uhid,
      type
    });

    console.log(`[OTP] Generated OTP ${otp} for ${cleanEmail} (Type: ${type}, Expires: 10m)`);

    // Dispatch email via nodemailer
    const emailResult = await sendOtpEmail({
      to: cleanEmail,
      otp,
      patientName,
      type,
      uhid
    });

    return res.status(200).json({
      success: true,
      message: `Verification OTP has been sent to ${cleanEmail}`,
      email: cleanEmail,
      expiresInMinutes: 10,
      previewUrl: emailResult.previewUrl || null,
      // For local testing convenience if SMTP is not configured
      demoOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
    });
  } catch (error) {
    console.error('[sendOtp] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to dispatch verification OTP email.',
      error: error.message
    });
  }
};

/**
 * POST /api/auth/verify-otp
 * Body: { email, otp, type }
 * Verifies the submitted OTP against stored OTP.
 * For registered patients, establishes a session token and returns the user profile.
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, type = 'registered_patient' } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and 6-digit OTP code are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const storedData = otpStore.get(cleanEmail);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'No active OTP found or the OTP has expired. Please request a new OTP.'
      });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        message: 'Verification OTP has expired. Please request a new OTP.'
      });
    }

    if (storedData.otp !== cleanOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check your email and try again.'
      });
    }

    // OTP is valid! Consume it.
    otpStore.delete(cleanEmail);

    // If registered patient, prepare user profile and sign JWT token
    let patientProfile = null;

    if (type === 'registered_patient') {
      let existingUser = null;
      let existingPatient = null;

      if (isMongoConnected) {
        existingUser = await User.findOne({ email: cleanEmail });
        existingPatient = await Patient.findOne({ email: cleanEmail });
      }

      if (!existingUser) {
        existingUser = usersData.find((u) => u.email.toLowerCase() === cleanEmail);
      }
      if (!existingPatient) {
        existingPatient = patientsData.find((p) => p.email && p.email.toLowerCase() === cleanEmail);
      }

      patientProfile = {
        name: existingPatient?.name || existingUser?.name || storedData.patientName,
        email: cleanEmail,
        role: 'patient',
        phone: existingPatient?.phone || existingUser?.phone || '+91-9871023456',
        uhid: existingPatient?.uhid || existingPatient?.patientId || existingUser?.patientId || storedData.uhid || `BSH-${new Date().getFullYear()}-001`,
        gender: existingPatient?.gender || 'Other',
        bloodGroup: existingPatient?.bloodGroup || 'Unknown'
      };

      const token = jwt.sign(
        {
          id: existingUser?._id || existingPatient?._id || `pat-${Date.now()}`,
          email: cleanEmail,
          name: patientProfile.name,
          role: 'patient',
          uhid: patientProfile.uhid
        },
        JWT_SECRET,
        { expiresIn: '14d' }
      );

      return res.status(200).json({
        success: true,
        verified: true,
        message: 'Email OTP verified successfully.',
        token,
        user: patientProfile
      });
    }

    // For new patient registration flow, confirm email verification
    return res.status(200).json({
      success: true,
      verified: true,
      message: 'Email OTP verified successfully.'
    });
  } catch (error) {
    console.error('[verifyOtp] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'OTP verification failed.',
      error: error.message
    });
  }
};
