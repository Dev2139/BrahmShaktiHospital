import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import * as serverSeed from '../data/seedData.js';

// Target list of doctors with their updated details and images
export const doctorsToSync = [
  {
    id: 'doc-ortho-02',
    name: 'Dr. Ravi Shankar Gupta',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795268266/Gemini_Generated_Image_shswfoshswfoshsw_1.png',
    departmentId: 'orthopaedics',
    departmentName: 'Orthopaedics & Joint Replacement',
    designation: 'Senior Consultant Orthopaedic & Joint Replacement Surgeon',
    qualification: 'MBBS, MS (Orthopaedics)',
    email: 'ravishankar@brahmshaktihospital.com',
    phone: '+91-9811234011',
    category: 'In house',
    dmcNo: '16892',
    validity: '14/11/2026',
    experienceYears: 19,
    specializations: ['Total Knee Replacement (TKR)', 'Total Hip Replacement (THR)', 'Complex Trauma & Fracture Care', 'Pelvic Acetabular Surgery'],
    consultationFee: 700,
    birthdate: '1981-08-19',
    availableDays: ['Tue', 'Thu', 'Sat'],
    availableTimings: '09:00 AM - 02:00 PM',
    opdSchedule: 'Tue, Thu, Sat: 09:00 AM - 02:00 PM (Room 112)',
    room: 'Orthopaedic Wing Room 112',
    languages: ['English', 'Hindi'],
    bio: 'Dr. Ravi Shankar Gupta is a leading joint replacement surgeon with extensive surgical mastery in minimally invasive primary and revision knee and hip arthroplasties.',
    isActive: true,
    rating: 4.9
  },
  {
    id: 'doc-cardio-01',
    name: 'Dr. Nishant Verma (Cardio)',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795268417/Gemini_Generated_Image_dv68midv68midv68.png',
    departmentId: 'cardiology',
    departmentName: 'Cardiology & Vascular Center',
    designation: 'Senior Consultant Interventional Cardiologist',
    qualification: 'MBBS, MD, DM (Cardiology)',
    email: 'nishant.cardio@brahmshaktihospital.com',
    phone: '+91-9811234021',
    category: 'In house',
    dmcNo: '24119',
    validity: '10/08/2028',
    experienceYears: 18,
    specializations: ['Coronary Angiography & Angioplasty', 'Complex PCI & Stenting', 'Pacemaker & ICD Implantation', 'Heart Failure Management'],
    consultationFee: 800,
    birthdate: '1982-05-14',
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableTimings: '10:00 AM - 03:00 PM',
    opdSchedule: 'Mon, Wed, Fri: 10:00 AM - 03:00 PM (Cardio OPD 204)',
    room: 'Cardiac Science Center Room 204',
    languages: ['English', 'Hindi'],
    bio: 'Dr. Nishant Verma is a distinguished interventional cardiologist specialized in radial approach coronary interventions, acute myocardial infarction salvage, and cardiovascular wellness.',
    isActive: true,
    rating: 4.9
  },
  {
    id: 'doc-surg-02',
    name: 'Dr. Rishabh Jain',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795268665/Gemini_Generated_Image_v2dcnxv2dcnxv2dc.png',
    departmentId: 'general-surgery',
    departmentName: 'General & Laparoscopic Surgery',
    designation: 'Senior Consultant General & Minimal Access Surgeon',
    qualification: 'MBBS, MS, FMAS',
    email: 'rishabhjain@brahmshaktihospital.com',
    phone: '+91-9811234004',
    category: 'In house',
    dmcNo: '19450',
    validity: '12/03/2026',
    experienceYears: 16,
    specializations: ['Laparoscopic Cholecystectomy', 'Keyhole Inguinal & Ventral Hernia', 'Laser Proctology (Piles, Fissure, Fistula)', 'Emergency Abdominal Trauma'],
    consultationFee: 700,
    birthdate: '1984-11-20',
    availableDays: ['Tue', 'Thu', 'Sat'],
    availableTimings: '10:00 AM - 03:00 PM',
    opdSchedule: 'Tue, Thu, Sat: 10:00 AM - 03:00 PM (Room 106)',
    room: 'Surgical OPD Block Chamber 106',
    languages: ['English', 'Hindi'],
    bio: 'Dr. Rishabh Jain is an accomplished minimal access surgeon focusing on precision day-care laparoscopic procedures, advanced GI surgeries, and laser proctology.',
    isActive: true,
    rating: 4.8
  },
  {
    id: 'doc-med-03',
    name: 'Dr. Lakashya Kumawat',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795268794/Gemini_Generated_Image_jox0g5jox0g5jox0.png',
    departmentId: 'medicine',
    departmentName: 'Internal Medicine & Diabetology',
    designation: 'Consultant Physician & Diabetologist',
    qualification: 'MBBS, MD (Internal Medicine)',
    email: 'lakashyakumawat@brahmshaktihospital.com',
    phone: '+91-9811234022',
    category: 'In house',
    dmcNo: '31245',
    validity: '22/07/2029',
    experienceYears: 12,
    specializations: ['Metabolic Syndrome & Diabetes', 'Hypertension & Lipid Clinics', 'Infectious Disease Triage', 'Geriatric Chronic Care'],
    consultationFee: 700,
    birthdate: '1987-03-12',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableTimings: '09:00 AM - 02:00 PM',
    opdSchedule: 'Mon - Sat: 09:00 AM - 02:00 PM (Room 103)',
    room: 'Medical OPD Chamber 103',
    languages: ['English', 'Hindi'],
    bio: 'Dr. Lakashya Kumawat brings clinical diligence to comprehensive diabetes titration, adult metabolic syndrome, and systemic internal medicine care.',
    isActive: true,
    rating: 4.8
  },
  {
    id: 'doc-cardio-02',
    name: 'Dr. Bharat Ratan Jindal',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795268883/Gemini_Generated_Image_anmzo1anmzo1anmz.png',
    departmentId: 'cardiology',
    departmentName: 'Cardiology & Vascular Center',
    designation: 'Senior Consultant Cardiologist & Electrophysiologist',
    qualification: 'MBBS, MD, DNB (Cardiology)',
    email: 'bharatjindal@brahmshaktihospital.com',
    phone: '+91-9811234023',
    category: 'Visiting',
    dmcNo: '18390',
    validity: '19/09/2027',
    experienceYears: 20,
    specializations: ['Clinical Electrophysiology', 'Arrhythmia Management', 'Cardiac Resynchronization Therapy (CRT)', 'Echocardiography & TEE'],
    consultationFee: 800,
    birthdate: '1980-09-08',
    availableDays: ['Tue', 'Thu', 'Sat'],
    availableTimings: '11:00 AM - 03:00 PM',
    opdSchedule: 'Tue, Thu, Sat: 11:00 AM - 03:00 PM (Room 205)',
    room: 'Cardiac Science Center Room 205',
    languages: ['English', 'Hindi', 'Punjabi'],
    bio: 'Dr. Bharat Ratan Jindal is a seasoned cardiologist specializing in cardiac rhythm disorders, advanced echocardiography, and preventive cardiology protocols.',
    isActive: true,
    rating: 4.9
  },
  {
    id: 'doc-gyn-04',
    name: 'Dr. Manju Bansal',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795268967/Gemini_Generated_Image_vyhpaavyhpaavyhp.png',
    departmentId: 'gynae-obst',
    departmentName: 'Obstetrics & Gynaecology (Maternity)',
    designation: 'Senior Consultant Obstetrician & Gynaecologist',
    qualification: 'MBBS, MS (Obstetrics & Gynaecology)',
    email: 'manjubansal@brahmshaktihospital.com',
    phone: '+91-9811234024',
    category: 'In house',
    dmcNo: '15408',
    validity: '15/04/2026',
    experienceYears: 22,
    specializations: ['High-Risk Pregnancy', 'Normal & Operative Deliveries', 'Laparoscopic Hysterectomy', 'Infertility Counseling'],
    consultationFee: 700,
    birthdate: '1978-02-18',
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableTimings: '09:30 AM - 02:30 PM',
    opdSchedule: 'Mon, Wed, Fri: 09:30 AM - 02:30 PM (Room 109)',
    room: 'Mother & Child Wing Chamber 109',
    languages: ['English', 'Hindi'],
    bio: 'Dr. Manju Bansal is a revered senior gynaecologist dedicated to high-risk obstetric monitoring, painless deliveries, and advanced gynaecological laparoscopy.',
    isActive: true,
    rating: 4.9
  },
  {
    id: 'doc-med-01',
    name: 'Dr. S.K. Goyal',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795269079/Gemini_Generated_Image_kap530kap530kap5.png',
    departmentId: 'medicine',
    departmentName: 'Internal Medicine & Diabetology',
    designation: 'Senior Consultant Physician & Diabetologist',
    qualification: 'MBBS, MD (Medicine)',
    email: 'skgoyal@brahmshaktihospital.com',
    phone: '+91-9811234001',
    category: 'In house',
    dmcNo: '11847',
    validity: '12/04/2028',
    experienceYears: 24,
    specializations: ['Diabetes Management', 'Cardiometabolic Disorders', 'Infectious Diseases', 'Geriatric Medicine'],
    consultationFee: 700,
    birthdate: '1976-06-15',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableTimings: '09:00 AM - 02:00 PM',
    opdSchedule: 'Mon - Sat: 09:00 AM - 02:00 PM (Room 101)',
    room: 'OPD Block A Chamber 101',
    languages: ['English', 'Hindi'],
    bio: 'Dr. S.K. Goyal is one of Delhi’s most respected physicians with 24+ years of clinical excellence in complex metabolic conditions, intensive internal medicine, and patient-first care.',
    isActive: true,
    rating: 4.9
  },
  {
    id: 'doc-ortho-01',
    name: 'Dr. Kapil Goyal',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795269246/Gemini_Generated_Image_5eui7k5eui7k5eui.png',
    departmentId: 'orthopaedics',
    departmentName: 'Orthopaedics & Joint Replacement',
    designation: 'Senior Consultant Orthopaedic & Arthroscopy Surgeon',
    qualification: 'MBBS, MS, DNB (Ortho)',
    email: 'kapilgoyal@brahmshaktihospital.com',
    phone: '+91-9811234010',
    category: 'In house',
    dmcNo: '14320',
    validity: '25/06/2027',
    experienceYears: 21,
    specializations: ['Arthroscopy & Sports Injury', 'ACL / PCL Ligament Reconstruction', 'Joint Replacement', 'Fracture Care'],
    consultationFee: 700,
    birthdate: '1979-04-12',
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableTimings: '09:00 AM - 02:00 PM',
    opdSchedule: 'Mon, Wed, Fri: 09:00 AM - 02:00 PM (Room 111)',
    room: 'Orthopaedic Wing Room 111',
    languages: ['English', 'Hindi'],
    bio: 'Dr. Kapil Goyal specializes in minimally invasive arthroscopy, sports trauma, and complex articular reconstruction, restoring mobility with precision.',
    isActive: true,
    rating: 4.9
  },
  {
    id: 'doc-ortho-04',
    name: 'Dr. Anuj Valecha',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795269335/Gemini_Generated_Image_u5mjr3u5mjr3u5mj.png',
    departmentId: 'orthopaedics',
    departmentName: 'Orthopaedics & Joint Replacement',
    designation: 'Consultant Orthopaedic & Spine Surgeon',
    qualification: 'MBBS, MS (Orthopaedics)',
    email: 'anujvalecha@brahmshaktihospital.com',
    phone: '+91-9811234025',
    category: 'In house',
    dmcNo: '28456',
    validity: '18/10/2030',
    experienceYears: 14,
    specializations: ['Spine Surgery & Decompression', 'Disc Prolapse Management', 'Orthopaedic Trauma & Fixation', 'Arthritis Care'],
    consultationFee: 700,
    birthdate: '1986-07-22',
    availableDays: ['Tue', 'Thu', 'Sat'],
    availableTimings: '10:00 AM - 03:00 PM',
    opdSchedule: 'Tue, Thu, Sat: 10:00 AM - 03:00 PM (Room 114)',
    room: 'Orthopaedic Wing Room 114',
    languages: ['English', 'Hindi'],
    bio: 'Dr. Anuj Valecha provides specialized expertise in spinal decompression, herniated disc management, and comprehensive orthopaedic trauma reconstruction.',
    isActive: true,
    rating: 4.8
  },
  {
    id: 'doc-ped-01',
    name: 'Dr. Rupesh Sharma',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795269399/Gemini_Generated_Image_ey958bey958bey95.png',
    departmentId: 'pediatrics',
    departmentName: 'Pediatrics & Neonatal Care (NICU)',
    designation: 'Senior Consultant Pediatrician & Neonatologist',
    qualification: 'MBBS, MD (Pediatrics)',
    email: 'rupeshsharma@brahmshaktihospital.com',
    phone: '+91-9811234008',
    category: 'In house',
    dmcNo: '21094',
    validity: '30/10/2026',
    experienceYears: 18,
    specializations: ['Neonatal Intensive Care (NICU Level III)', 'Developmental Milestones', 'Child Immunization Programs', 'Pediatric Asthma & Allergies'],
    consultationFee: 700,
    birthdate: '1982-01-28',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableTimings: '09:00 AM - 02:00 PM',
    opdSchedule: 'Mon - Sat: 09:00 AM - 02:00 PM (Room 104)',
    room: 'Pediatrics Block Chamber 104',
    languages: ['English', 'Hindi'],
    bio: 'Dr. Rupesh Sharma has dedicated nearly two decades to saving critically ill newborns, managing tertiary Level-III NICU facilities, and childhood development.',
    isActive: true,
    rating: 4.9
  },
  {
    id: 'doc-skin-02',
    name: 'Dr. Swati Gupta',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795269489/Gemini_Generated_Image_ewlawbewlawbewla.png',
    departmentId: 'skin',
    departmentName: 'Dermatology & Skin Care',
    designation: 'Consultant Dermatologist & Cosmetologist',
    qualification: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
    email: 'swatigupta@brahmshaktihospital.com',
    phone: '+91-9811234017',
    category: 'In house',
    dmcNo: '30112',
    validity: '19/08/2029',
    experienceYears: 11,
    specializations: ['Clinical Dermatology & Eczema', 'Laser Skin Treatments', 'Acne Scar Resurfacing', 'Hair Loss & PRP Therapy'],
    consultationFee: 700,
    birthdate: '1989-10-14',
    availableDays: ['Tue', 'Thu', 'Sat'],
    availableTimings: '10:00 AM - 02:30 PM',
    opdSchedule: 'Tue, Thu, Sat: 10:00 AM - 02:30 PM (Room 202)',
    room: 'Skin & Laser Suite Chamber 202',
    languages: ['English', 'Hindi'],
    bio: 'Dr. Swati Gupta is a respected dermatologist providing science-backed treatments for acute and chronic skin disorders, clinical lasers, and trichology.',
    isActive: true,
    rating: 4.8
  },
  {
    id: 'doc-ped-03',
    name: 'Dr. Hitesh Aggarwal',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795269572/Gemini_Generated_Image_2yjmm12yjmm12yjm.png',
    departmentId: 'pediatrics',
    departmentName: 'Pediatrics & Neonatal Care (NICU)',
    designation: 'Senior Consultant Pediatric Intensivist',
    qualification: 'MBBS, DNB (Pediatrics), Fellowship Pediatric Critical Care',
    email: 'hiteshaggarwal@brahmshaktihospital.com',
    phone: '+91-9811234026',
    category: 'In house',
    dmcNo: '23501',
    validity: '14/06/2028',
    experienceYears: 16,
    specializations: ['Pediatric ICU (PICU)', 'Neonatal Emergencies', 'Childhood Infectious Diseases', 'Nutritional Counseling'],
    consultationFee: 700,
    birthdate: '1984-08-05',
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableTimings: '10:00 AM - 03:00 PM',
    opdSchedule: 'Mon, Wed, Fri: 10:00 AM - 03:00 PM (Room 105)',
    room: 'Pediatrics Block Chamber 105',
    languages: ['English', 'Hindi'],
    bio: 'Dr. Hitesh Aggarwal brings specialized expertise in pediatric intensive care, resuscitation, childhood fever protocols, and preventive immunizations.',
    isActive: true,
    rating: 4.9
  },
  {
    id: 'doc-skin-01',
    name: 'Dr. Avnish Goel',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795269652/Gemini_Generated_Image_ikbi8rikbi8rikbi.png',
    departmentId: 'skin',
    departmentName: 'Dermatology & Skin Care',
    designation: 'Senior Consultant Dermatologist & Cosmetologist',
    qualification: 'MBBS, MD (Skin & VD)',
    email: 'avnishgoel@brahmshaktihospital.com',
    phone: '+91-9811234016',
    category: 'In house',
    dmcNo: '9815',
    validity: '11/12/2025',
    experienceYears: 23,
    specializations: ['Chronic Psoriasis & Vitiligo', 'Radiofrequency Mole & Wart Excision', 'Cosmetic Dermatology', 'Allergic Dermatitis'],
    consultationFee: 700,
    birthdate: '1977-11-03',
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableTimings: '09:30 AM - 02:00 PM',
    opdSchedule: 'Mon, Wed, Fri: 09:30 AM - 02:00 PM (Room 201)',
    room: 'Skin & Laser Suite Chamber 201',
    languages: ['English', 'Hindi'],
    bio: 'Dr. Avnish Goel has over 23 years of specialized practice in clinical dermatology, vitiligo phototherapy, and aesthetic skin rejuvenation.',
    isActive: true,
    rating: 4.9
  },
  {
    id: 'doc-surg-01',
    name: 'Dr. Nishant Verma (Neuro Sergion)',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795269744/Gemini_Generated_Image_iy20x7iy20x7iy20.png',
    departmentId: 'general-surgery',
    departmentName: 'General & Laparoscopic Surgery',
    designation: 'Senior Consultant Neurosurgeon & Spine Specialist',
    qualification: 'MBBS, MS, MCh (Neurosurgery)',
    email: 'nishantverma@brahmshaktihospital.com',
    phone: '+91-9811234003',
    category: 'In house',
    dmcNo: '11842',
    validity: '23/05/2027',
    experienceYears: 22,
    specializations: ['Cranial Trauma & Brain Surgery', 'Microsurgical Spine Decompression', 'Minimally Invasive Neurosurgery', 'Neuro-trauma Intensive Care'],
    consultationFee: 800,
    birthdate: '1978-08-14',
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableTimings: '09:00 AM - 02:00 PM',
    opdSchedule: 'Mon, Wed, Fri: 09:00 AM - 02:00 PM (Room 105)',
    room: 'Surgical OPD Block Chamber 105',
    languages: ['English', 'Hindi'],
    bio: 'Dr. Nishant Verma is a prominent neurosurgeon recognized for surgical precision in brain trauma management, complex spine surgeries, and neurological recovery.',
    isActive: true,
    rating: 4.9
  },
  {
    id: 'doc-eye-01',
    name: 'Dr. Rajesh',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795269864/Gemini_Generated_Image_w4nq3zw4nq3zw4nq.png',
    departmentId: 'eye',
    departmentName: 'Ophthalmology & Eye Care Center',
    designation: 'Senior Consultant Ophthalmologist & Phaco Surgeon',
    qualification: 'MBBS, MS (Ophthalmology)',
    email: 'rajeshkumar@brahmshaktihospital.com',
    phone: '+91-9811234018',
    category: 'In house',
    dmcNo: '13980',
    validity: '17/02/2026',
    experienceYears: 22,
    specializations: ['Micro-Incision Cataract Surgery (MICS)', 'Premium Intraocular Lenses (IOL)', 'Glaucoma Diagnostics & Filtration', 'Medical Retina'],
    consultationFee: 700,
    birthdate: '1978-05-19',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableTimings: '09:00 AM - 02:00 PM',
    opdSchedule: 'Mon - Sat: 09:00 AM - 02:00 PM (Room 210)',
    room: 'Eye Care Center Chamber 210',
    languages: ['English', 'Hindi'],
    bio: 'Dr. Rajesh has performed thousands of painless cataract and phacoemulsification surgeries with advanced monofocal and multifocal lens implants.',
    isActive: true,
    rating: 4.9
  },
  {
    id: 'doc-eye-02',
    name: 'Dr. Monnica Kumawat',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795269960/WhatsApp_Image_2026-11-21_at_6.30.59_PM.jpg',
    departmentId: 'eye',
    departmentName: 'Ophthalmology & Eye Care Center',
    designation: 'Consultant Ophthalmologist, Cornea & Refractive Specialist',
    qualification: 'MBBS, DNB (Ophthalmology)',
    email: 'monnicakumawat@brahmshaktihospital.com',
    phone: '+91-9811234019',
    category: 'In house',
    dmcNo: '27641',
    validity: '09/07/2028',
    experienceYears: 13,
    specializations: ['Corneal Disorders & Keratoconus', 'Diabetic Retinopathy Screening', 'Dry Eye Clinic', 'Computer Vision Syndrome'],
    consultationFee: 700,
    birthdate: '1987-11-29',
    availableDays: ['Tue', 'Thu', 'Sat'],
    availableTimings: '09:30 AM - 02:30 PM',
    opdSchedule: 'Tue, Thu, Sat: 09:30 AM - 02:30 PM (Room 211)',
    room: 'Eye Care Center Chamber 211',
    languages: ['English', 'Hindi'],
    bio: 'Dr. Monnica Kumawat is an expert eye surgeon specializing in comprehensive anterior segment care, corneal disorders, and modern refractive diagnostics.',
    isActive: true,
    rating: 4.8
  },
  {
    id: 'doc-surg-03',
    name: 'Dr. Sanjeev Verma',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795269965/Gemini_Generated_Image_syipulsyipulsyip.png',
    departmentId: 'general-surgery',
    departmentName: 'General & Laparoscopic Surgery',
    designation: 'Senior Consultant & Head of General & Laparoscopic Surgery',
    qualification: 'MBBS, MS (General Surgery)',
    email: 'sanjeevverma@brahmshaktihospital.com',
    phone: '+91-9811234027',
    category: 'In house',
    dmcNo: '11843',
    validity: '23/05/2027',
    experienceYears: 25,
    specializations: ['Advanced Laparoscopic GI Surgery', 'Complex Hernia Repair', 'Gallbladder & Biliary Procedures', 'Surgical Oncology Triage'],
    consultationFee: 800,
    birthdate: '1975-03-24',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableTimings: '09:30 AM - 02:30 PM',
    opdSchedule: 'Mon - Sat: 09:30 AM - 02:30 PM (Room 105)',
    room: 'Surgical OPD Block Chamber 105',
    languages: ['English', 'Hindi'],
    bio: 'Dr. Sanjeev Verma heads the Department of General & Laparoscopic Surgery at Brahm Shakti Hospital with over 25 years of surgical mastery and compassionate patient guidance.',
    isActive: true,
    rating: 5.0
  },
  {
    id: 'doc-anes-04',
    name: 'Dr. Gaurav Kaushik',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795270039/Gemini_Generated_Image_3yb39r3yb39r3yb3.png',
    departmentId: 'anesthesia',
    departmentName: 'Anaesthesiology & Critical Care',
    designation: 'Senior Consultant Anaesthesiologist & Critical Care Specialist',
    qualification: 'MBBS, MD (Anaesthesiology), IDCCM',
    email: 'gauravkaushik@brahmshaktihospital.com',
    phone: '+91-9811234028',
    category: 'In house',
    dmcNo: '29871',
    validity: '17/12/2029',
    experienceYears: 15,
    specializations: ['Neuro-anaesthesia', 'Advanced Hemodynamic Monitoring', 'ICU Resuscitation & Sepsis Care', 'Difficult Airway Management'],
    consultationFee: 700,
    birthdate: '1985-05-30',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableTimings: '08:00 AM - 03:00 PM',
    opdSchedule: 'Mon - Sat: 08:00 AM - 03:00 PM (OT Complex)',
    room: 'Critical Care ICU Complex',
    languages: ['English', 'Hindi'],
    bio: 'Dr. Gaurav Kaushik is an expert critical care specialist ensuring perioperative safety, neuro-anaesthetic vigilance, and round-the-clock intensive life support.',
    isActive: true,
    rating: 4.9
  }
];

async function syncDoctors() {
  console.log('[Sync] Starting doctor sync process...');

  // 1. Sync MongoDB Atlas
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/brahm_shakti_hospital';
    console.log('[Sync] Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('[Sync] MongoDB Atlas Connected.');

    for (const doc of doctorsToSync) {
      // Upsert Doctor in Doctor collection
      const filter = {
        $or: [
          { id: doc.id },
          { email: doc.email.toLowerCase() },
          { name: { $regex: new RegExp(`^${doc.name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, 'i') } }
        ]
      };

      const updatedDoc = await Doctor.findOneAndUpdate(
        filter,
        { $set: doc },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`[MongoDB] Upserted Doctor: ${doc.name} (${doc.id})`);

      // Upsert User in User collection with status 'active' (lowercase!)
      const userFilter = {
        $or: [
          { email: doc.email.toLowerCase() },
          { doctorId: doc.id }
        ]
      };

      let existingUser = await User.findOne(userFilter);
      if (!existingUser) {
        await User.create({
          name: doc.name,
          email: doc.email.toLowerCase(),
          password: 'Password@123',
          role: 'doctor',
          doctorId: doc.id,
          phone: doc.phone,
          status: 'active',
          avatar: doc.image
        });
        console.log(`[MongoDB] Created User account: ${doc.name} (${doc.email})`);
      } else {
        existingUser.avatar = doc.image;
        existingUser.name = doc.name;
        existingUser.doctorId = doc.id;
        existingUser.role = 'doctor';
        existingUser.status = 'active';
        await existingUser.save();
        console.log(`[MongoDB] Updated User account: ${doc.name} (${doc.email})`);
      }
    }

    await mongoose.disconnect();
    console.log('[Sync] MongoDB Atlas sync complete.');
  } catch (err) {
    console.error('[Sync] MongoDB Atlas Error:', err.message);
  }

  // 2. Sync client and server seedData.js files
  const seedFiles = [
    path.join(__dirname, '../data/seedData.js'),
    path.join(__dirname, '../../../client/src/data/seedData.js')
  ];

  for (const filePath of seedFiles) {
    if (!fs.existsSync(filePath)) continue;
    console.log('[Sync] Updating seed file:', filePath);

    let content = fs.readFileSync(filePath, 'utf8');

    // For each doctor, update existing or append
    for (const doc of doctorsToSync) {
      const idRegex = new RegExp(`(["']id["']:\\s*["']${doc.id}["'])`, 'i');
      if (idRegex.test(content)) {
        // Update the image field
        const imgRegex = new RegExp(`(\\{[\\s\\S]*?["']id["']:\\s*["']${doc.id}["'][\\s\\S]*?["']image["']:\\s*["'])[^"']+?(["'][\\s\\S]*?\\})`);
        if (imgRegex.test(content)) {
          content = content.replace(imgRegex, `$1${doc.image}$2`);
        }
        // Update name if needed
        const nameRegex = new RegExp(`(\\{[\\s\\S]*?["']id["']:\\s*["']${doc.id}["'][\\s\\S]*?["']name["']:\\s*["'])[^"']+?(["'][\\s\\S]*?\\})`);
        if (nameRegex.test(content)) {
          content = content.replace(nameRegex, `$1${doc.name}$2`);
        }
      } else {
        // Add new doctor to the end of doctorsData array
        const insertMarker = 'export const doctorsData = [';
        if (content.includes(insertMarker)) {
          const docStr = '  ' + JSON.stringify(doc, null, 2).replace(/\n/g, '\n  ') + ',\n';
          content = content.replace(insertMarker, `${insertMarker}\n${docStr}`);
        }
      }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('[Sync] Saved:', filePath);
  }

  console.log('[Sync] All doctors synced successfully!');
}

syncDoctors().catch(err => {
  console.error('[Sync] Fatal error:', err);
  process.exit(1);
});
