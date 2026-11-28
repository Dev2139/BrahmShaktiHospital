import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import bloodBankRoutes from './routes/bloodBankRoutes.js';
import pharmacyRoutes from './routes/pharmacyRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import labReportRoutes from './routes/labReportRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import locationGuideRoutes from './routes/locationGuideRoutes.js';

import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { isMongoConnected } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health & System Info
app.get(['/', '/api'], (req, res) => {
  res.status(200).json({
    success: true,
    institution: 'Brahm Shakti Hospital, U-1/78, Budh Vihar, Main Kanjhawala Road, Delhi-110086',
    service: 'Brahm Shakti Hospital MERN Digital Healthcare Architecture',
    status: 'healthy',
    database: isMongoConnected ? 'MongoDB Atlas Connected' : 'In-Memory High-Speed Store',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      doctors: '/api/doctors',
      departments: '/api/departments',
      appointments: '/api/appointments',
      bloodBank: '/api/blood-bank',
      pharmacy: '/api/pharmacy',
      labReports: '/api/lab-reports',
      auth: '/api/auth'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    institution: 'Brahm Shakti Hospital, U-1/78, Budh Vihar, Main Kanjhawala Road, Delhi-110086',
    service: 'Brahm Shakti Hospital MERN Digital Healthcare Architecture',
    database: isMongoConnected ? 'MongoDB Atlas Connected' : 'In-Memory High-Speed Store',
    timestamp: new Date().toISOString()
  });
});

// Primary RESTful API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/blood-bank', bloodBankRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/lab-reports', labReportRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/location-guide', locationGuideRoutes);

// Serve static client production build if available
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Fallback & Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
