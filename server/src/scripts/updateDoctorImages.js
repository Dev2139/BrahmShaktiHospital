import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import Doctor from '../models/Doctor.js';

async function updateImages() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/brahm_shakti_hospital';
  console.log('[Update] Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('[Update] Connected.');

  const updates = [
    { id: 'doc-surg-02', name: 'Dr. Rishabh Jain', image: '/doctors/dr-rishabh-jain.jpg' },
    { id: 'doc-gyn-02', name: 'Dr. Renu Gupta', image: '/doctors/dr-renu-gupta.jpg' },
    { id: 'doc-ortho-02', name: 'Dr. Ravi Shankar Gupta', image: '/doctors/dr-ravi-shankar-gupta.jpg' }
  ];

  for (const doc of updates) {
    const res = await Doctor.updateOne(
      { $or: [{ id: doc.id }, { name: { $regex: new RegExp(doc.name, 'i') } }] },
      { $set: { image: doc.image } }
    );
    console.log(`Updated ${doc.name}: matched=${res.matchedCount}, modified=${res.modifiedCount}`);
  }

  await mongoose.disconnect();
  console.log('[Update] Done.');
}

updateImages().catch((err) => {
  console.error('[Update] Error:', err);
  process.exit(1);
});
