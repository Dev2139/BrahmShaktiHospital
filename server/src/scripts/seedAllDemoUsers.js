import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import User from '../models/User.js';

export const demoAccounts = [
  {
    roleKey: 'superadmin',
    name: 'Dev Patel (Super Administrator)',
    email: 'superadmin@brahmshaktihospital.com',
    password: 'SuperAdmin@123',
    role: 'superadmin',
    phone: '+91-9811029381',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300'
  },
  {
    roleKey: 'admin',
    name: 'Samir Singh Kshatriya (Hospital Administrator)',
    email: 'admin@brahmshaktihospital.com',
    password: 'Admin@123',
    role: 'admin',
    phone: '+91-9811029382',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300'
  },
  {
    roleKey: 'doctor',
    name: 'Dr. S.K. Goyal (Senior Consultant Physician)',
    email: 'doctor@brahmshaktihospital.com',
    password: 'Doctor@123',
    role: 'doctor',
    doctorId: 'doc-med-01',
    phone: '+91-9811234001',
    status: 'active',
    avatar: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795269079/Gemini_Generated_Image_kap530kap530kap5.png'
  },
  {
    roleKey: 'bloodbank',
    name: 'Ravi Thakur (Blood Bank Technician)',
    email: 'bloodbank@brahmshaktihospital.com',
    password: 'BloodBank@123',
    role: 'blood_bank_technician',
    phone: '+91-9811029386',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
  },
  {
    roleKey: 'pharmacy',
    name: 'Pooja Sharma (Senior Pharmacist)',
    email: 'pharmacist@brahmshaktihospital.com',
    password: 'Pharmacist@123',
    role: 'pharmacist',
    phone: '+91-9811029383',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1594824813571-638f02613d54?auto=format&fit=crop&q=80&w=300'
  },
  {
    roleKey: 'patient',
    name: 'Ramesh Chand (Registered Patient)',
    email: 'patient@brahmshaktihospital.com',
    password: 'Patient@123',
    role: 'patient',
    patientId: 'PT-2026-0001',
    phone: '+91-9811029388',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
  }
];

async function seedDemoUsers() {
  console.log('[SeedDemo] Starting user verification...');
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/brahm_shakti_hospital';
  await mongoose.connect(uri);
  console.log('[SeedDemo] Connected to MongoDB Atlas.');

  for (const acc of demoAccounts) {
    let existing = await User.findOne({ email: acc.email.toLowerCase() });
    if (existing) {
      existing.name = acc.name;
      existing.role = acc.role;
      existing.status = 'active';
      existing.phone = acc.phone;
      existing.avatar = acc.avatar;
      if (acc.doctorId) existing.doctorId = acc.doctorId;
      if (acc.patientId) existing.patientId = acc.patientId;
      existing.password = acc.password; // pre-save will re-hash
      await existing.save();
      console.log(`[SeedDemo] Updated user: ${acc.email} (${acc.role})`);
    } else {
      await User.create({
        name: acc.name,
        email: acc.email.toLowerCase(),
        password: acc.password,
        role: acc.role,
        doctorId: acc.doctorId || null,
        patientId: acc.patientId || null,
        phone: acc.phone,
        status: 'active',
        avatar: acc.avatar
      });
      console.log(`[SeedDemo] Created user: ${acc.email} (${acc.role})`);
    }

    // Verify authentication immediately
    const check = await User.findOne({ email: acc.email.toLowerCase() });
    const isMatch = await check.comparePassword(acc.password);
    console.log(`[AuthTest] ${acc.email} -> Password match: ${isMatch ? 'PASS ✅' : 'FAIL ❌'}`);
    if (!isMatch) {
      throw new Error(`Auth failed for ${acc.email}`);
    }
  }

  await mongoose.disconnect();
  console.log('[SeedDemo] All 6 roles verified in MongoDB Atlas.');
}

seedDemoUsers().catch(err => {
  console.error('[SeedDemo] Error:', err);
  process.exit(1);
});
