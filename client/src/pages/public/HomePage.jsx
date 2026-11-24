import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  PhoneCall,
  ShieldCheck,
  Award,
  Users,
  Activity,
  HeartPulse,
  Droplets,
  Building2,
  Stethoscope,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  Star,
  Ambulance,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Sparkles,
  Search,
  Plane,
  Globe,
  FlaskConical,
  Home as HomeIcon,
  FileCheck2,
  FileText,
  ExternalLink,
  Bell,
  Pin,
  Megaphone
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { InternationalModal } from '../../components/InternationalModal';
import { departmentsData, doctorsData } from '../../data/seedData';

const DEPARTMENT_CLINICAL_HIGHLIGHTS = {
  medicine: {
    faculty: 'Dr. S.K. Goyal (MD) · Dr. Vineet Mittal (DNB)',
    location: 'Block A, 1st Floor',
    procedures: [
      'Comprehensive Diabetology & Insulin Titration',
      'Hypertension & Cardiovascular Risk Management',
      'Fever & Pyrexia of Unknown Origin (PUO) Triage'
    ]
  },
  'general-surgery': {
    faculty: 'Dr. Nishant Verma (MS) · Dr. Rishabh Jain (MS)',
    location: 'Surgical Block, 2nd Floor',
    procedures: [
      'Laparoscopic Cholecystectomy (Gallbladder)',
      'Laser Proctology for Piles, Fissure & Fistula',
      'Keyhole Inguinal & Umbilical Hernia Repair'
    ]
  },
  gynecology: {
    faculty: 'Dr. Manisha Jain (DNB) · Dr. Renu Gupta (DGO)',
    location: 'Mother & Child Wing, 3rd Floor',
    procedures: [
      'Painless Normal & Caesarean (LSCS) Deliveries',
      'High-Risk Pregnancy & Ante-Natal Care (ANC)',
      'Laparoscopic Hysterectomy & Ovarian Cyst Surgery'
    ]
  },
  pediatrics: {
    faculty: 'Dr. Rupesh Sharma (DCH) · Dr. Satpal Yadav (DCH)',
    location: 'Mother & Child Wing, 2nd Floor',
    procedures: [
      'Level-III NICU Neonatal Critical Care & Incubators',
      'Preterm Low Birth Weight Resuscitation',
      'Complete Pediatric Immunization & Growth Tracking'
    ]
  },
  orthopedics: {
    faculty: 'Dr. Kapil Goyal (DNB) · Dr. Ravi Shankar Gupta (DNB)',
    location: 'Ortho Spine Wing, 1st Floor',
    procedures: [
      'Total Knee Replacement (TKR) & Hip Arthroplasty',
      'Arthroscopic ACL & Meniscal Ligament Repair',
      'Complex Fracture & Trauma Stabilization'
    ]
  },
  nephrology: {
    faculty: 'Senior Dialysis Physicians & Faculty',
    location: 'Renal Care Block, Ground Floor',
    procedures: [
      '24x7 Subsidized Maintenance Hemodialysis',
      'Arteriovenous (AV) Fistula Creation & Monitoring',
      'Diabetic Nephropathy & Renal Failure Management'
    ]
  },
  ophthalmology: {
    faculty: 'Dr. Monika Kumar (MS) · Dr. Rajesh Kumar (MS)',
    location: 'Eye Care OPD, 1st Floor',
    procedures: [
      'Stitchless MICS Micro-Phaco Cataract Surgery',
      'Glaucoma Screening, Tonometry & Laser Iridotomy',
      'Diabetic Retinopathy Screening & Fundus Evaluation'
    ]
  },
  skin: {
    faculty: 'Dr. Anish Goel (MD) · Dr. Swati Gupta (DDVL)',
    location: 'Dermatology OPD, 1st Floor',
    procedures: [
      'Laser Resurfacing for Acne Scars & Hyperpigmentation',
      'Radiofrequency Mole, Wart & Skin Tag Excision',
      'Chronic Psoriasis & Eczema Immunotherapy'
    ]
  }
};

const HERO_BANNER_IMAGES = [
  'https://res.cloudinary.com/urzka7oz/image/upload/v1795183537/WhatsApp_Image_2026-11-04_at_8.03.05_AM_2.jpg',
  'https://res.cloudinary.com/urzka7oz/image/upload/v1795183378/brahmshakti_event_hero_resized.jpg',
  'https://res.cloudinary.com/urzka7oz/image/upload/v1795179941/Proud_Indian_Flag_Group_Portrait.png',
  'https://res.cloudinary.com/urzka7oz/image/upload/v1795179942/Indian_Flag_Ceremony_Group_Photo.png'
];

const CLINICAL_DISCIPLINES = [
  { id: 'all', label: 'All 9 Departments' },
  { id: 'surgical', label: 'Surgery & Ortho', deptIds: ['general-surgery', 'orthopaedics'] },
  { id: 'medical', label: 'Internal Medicine', deptIds: ['medicine'] },
  { id: 'mother-child', label: 'Mother & Child', deptIds: ['gynae-obst', 'pediatrics'] },
  { id: 'eye-ent', label: 'Eye & ENT', deptIds: ['eye', 'ent'] },
  { id: 'skin', label: 'Dermatology (Skin)', deptIds: ['skin'] },
  { id: 'anesthesia', label: 'Anaesthesia & ICU', deptIds: ['anesthesia'] }
];

const FEATURED_EVENT = {
  id: 'event-mega-camp',
  title: 'Annual Free Mega Health Checkup & Diabetes Screening Camp 2026',
  badge: 'Free Trust Health Camp',
  date: 'Sunday, Dec 14, 2026',
  time: '09:00 AM - 03:00 PM',
  venue: 'Main OPD Block & Diagnostic Wing, Budh Vihar',
  image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200',
  description: 'Organized under the philanthropic mission of Brahm Shakti Trust. Offering free comprehensive health examinations, blood glucose tests, vital triage, and 1-on-1 consultations with senior DMC-registered medical specialists.',
  highlights: [
    'Free Blood Sugar, HbA1c & Random Glucose Tests',
    'Free Blood Pressure & 12-Lead ECG Evaluation',
    'Consultations with Internal Medicine & Cardiology Faculty',
    'Free Bone Density (BMD) & Gynaecology Advice for Women'
  ]
};

const UPCOMING_EVENTS = [
  {
    id: 'event-1',
    category: 'Clinical Workshop',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'CME Symposium: Modern Keyhole Laparoscopic & Laser Proctology Surgery',
    date: 'Dec 05, 2026 · 10:30 AM',
    speaker: 'Dr. Nishant Verma & Dr. Rishabh Jain (Surgical Sciences)',
    venue: 'Auditorium Hall, 4th Floor',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'event-2',
    category: 'Mother & Child Care',
    tagColor: 'bg-pink-50 text-pink-700 border-pink-200',
    title: 'Painless Normal Delivery, High-Risk ANC & Newborn Intensive Care Seminar',
    date: 'Dec 20, 2026 · 11:00 AM',
    speaker: 'Dr. Manisha Jain & Dr. Renu Gupta (Gynae & Obst)',
    venue: 'Mother & Child Care Wing',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'event-3',
    category: 'Renal Awareness',
    tagColor: 'bg-sky-50 text-sky-700 border-sky-200',
    title: 'Kidney Health Day: Prevention & Subsidized Hemodialysis Access Drive',
    date: 'Jan 08, 2027 · 02:00 PM',
    speaker: 'Dialysis Clinical Faculty & Certified Nephrologists',
    venue: 'Dialysis Wing Conference Room',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600'
  }
];

const GALLERY_CATEGORIES = [
  { id: 'all', label: 'All Photos' },
  { id: 'events', label: 'Events & Ceremonies' },
  { id: 'campus', label: 'Hospital Campus & Units' }
];

const INITIAL_GALLERY_PHOTOS = [
  {
    id: 'gal-1',
    category: 'events',
    categoryLabel: 'Flag Ceremony',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795179941/Proud_Indian_Flag_Group_Portrait.png',
    title: 'Proud Indian Flag Group Portrait',
    caption: 'Brahm Shakti Hospital medical faculty and administrative leadership celebrating national pride at the hospital campus.'
  },
  {
    id: 'gal-2',
    category: 'events',
    categoryLabel: 'Ceremony',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795179942/Indian_Flag_Ceremony_Group_Photo.png',
    title: 'Indian Flag Ceremony Group Photo',
    caption: 'Senior doctors, clinical nurses, and staff members assembled during the ceremonial flag hoisting event at Budh Vihar.'
  },
  {
    id: 'gal-3',
    category: 'events',
    categoryLabel: 'Foundation Day',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795183378/brahmshakti_event_hero_resized.jpg',
    title: 'Hospital Annual Foundation & Care Gathering',
    caption: 'Annual community healthcare milestone and clinical celebration organized under Brahm Shakti Trust.'
  },
  {
    id: 'gal-4',
    category: 'campus',
    categoryLabel: 'Medical Staff',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795183537/WhatsApp_Image_2026-11-04_at_8.03.05_AM_2.jpg',
    title: 'Clinical Faculty & Healthcare Team',
    caption: 'Dedicated doctors, consultants, and surgical teams delivering round-the-clock patient care and recovery.'
  },
  {
    id: 'gal-5',
    category: 'campus',
    categoryLabel: 'Hospital Campus',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185836/WhatsApp_Image_2026-11-04_at_8.03.05_AM.jpg',
    title: 'Emergency & Surgical Infrastructure',
    caption: 'Modern facilities and advanced clinical infrastructure serving North-West Delhi families with trusted care.'
  },
  {
    id: 'gal-6',
    category: 'campus',
    categoryLabel: 'Inpatient Care',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185834/WhatsApp_Image_2026-11-04_at_8.03.06_AM_1.jpg',
    title: 'Hospital Ward & Inpatient Facility',
    caption: 'Clean, sanitized inpatient recovery suites and dedicated clinical nursing stations for peaceful healing.'
  },
  {
    id: 'gal-7',
    category: 'campus',
    categoryLabel: 'Diagnostics',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185835/WhatsApp_Image_2026-11-04_at_8.03.06_AM.jpg',
    title: 'Diagnostics & Patient Care Units',
    caption: 'Accurate digital diagnostic monitoring and patient-first clinical departments equipped with advanced medical systems.'
  },
  {
    id: 'gal-8',
    category: 'campus',
    categoryLabel: 'Operation Theatres',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185836/WhatsApp_Image_2026-11-04_at_8.03.04_AM_2.jpg',
    title: 'Surgical Suites & Keyhole Laparoscopy',
    caption: 'Advanced modular operating suites with precision surgical instruments for minimally invasive surgeries.'
  },
  {
    id: 'gal-9',
    category: 'campus',
    categoryLabel: 'Critical Care',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185836/WhatsApp_Image_2026-11-04_at_8.03.04_AM_1.jpg',
    title: 'Critical Care ICU & Monitoring Suites',
    caption: 'Intensive care unit with multi-para vital monitors and specialized emergency resuscitation infrastructure.'
  },
  {
    id: 'gal-10',
    category: 'campus',
    categoryLabel: 'Mother & Child',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185837/WhatsApp_Image_2026-11-04_at_8.03.04_AM.jpg',
    title: 'Maternity Wing & Neonatal Nursery',
    caption: 'Comfortable obstetric suites and Level-III NICU care safeguarding mothers and fragile newborn babies.'
  },
  {
    id: 'gal-11',
    category: 'campus',
    categoryLabel: 'Dialysis Center',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185838/WhatsApp_Image_2026-11-04_at_8.03.03_AM_2.jpg',
    title: 'Subsidized Dialysis Renal Unit',
    caption: 'Charitable high-flux hemodialysis wing operating round-the-clock for kidney patients under Brahm Shakti Trust.'
  },
  {
    id: 'gal-12',
    category: 'campus',
    categoryLabel: 'Clinical Labs',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185839/WhatsApp_Image_2026-11-04_at_8.03.03_AM_1.jpg',
    title: 'Pathology & Diagnostic Laboratory',
    caption: 'Fully automated biochemistry, haematology, and microbiology analyzers delivering certified rapid turnaround.'
  },
  {
    id: 'gal-13',
    category: 'campus',
    categoryLabel: 'Main Reception',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185840/WhatsApp_Image_2026-11-04_at_8.03.03_AM.jpg',
    title: 'Outpatient Reception & Triage Desk',
    caption: 'Courteous patient navigation desk and smooth electronic registration for daily specialty OPD visits.'
  },
  {
    id: 'gal-14',
    category: 'campus',
    categoryLabel: '24x7 Trauma Care',
    image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185843/WhatsApp_Image_2026-11-04_at_8.03.01_AM_1.jpg',
    title: '24x7 Ambulance & Emergency Lifeline',
    caption: 'Rapid response emergency trauma care and mobile cardiac ambulances ready for immediate patient transfer.'
  }
];

const FAQ_ITEMS = [
  {
    question: 'How do I book an appointment at Brahm Shakti Hospital?',
    answer: 'Appointments can be booked directly online on our website by choosing your specialist doctor or clinical department, via our 24/7 central hospital helpline at +91-11-4700 5555 / 7840089703, or in-person at the central hospital registration desk in Budh Vihar, Delhi.'
  },
  {
    question: 'What are the OPD consultation timings and registration hours?',
    answer: 'General and super-specialty OPD clinics run Monday through Saturday from 09:00 AM to 05:00 PM. Patient registration counters open daily at 08:30 AM at the Main OPD Block on the Ground Floor.'
  },
  {
    question: 'Does Brahm Shakti Hospital provide 24x7 emergency and trauma care?',
    answer: 'Yes, our 24x7 Emergency & Trauma Resuscitation Centre, intensive care units (ICU, ICCU, Level-III NICU), and Cardiac Cath Lab are fully functional around the clock, 365 days a year with on-call trauma surgeons and emergency physicians.'
  },
  {
    question: 'Are cashless health insurance and panel facilities available?',
    answer: 'Yes, Brahm Shakti Hospital is empaneled with major private health insurance companies, Third Party Administrators (TPAs), and government schemes including CGHS, ECHS, and DGEHS for seamless cashless inpatient hospitalization.'
  },
  {
    question: 'How can I access my diagnostic and lab test reports online?',
    answer: 'You can quickly view and download your verified lab results from our online Lab Results portal by entering your UHID (Unique Hospital ID) and registered mobile number, or collect physical copies from the hospital pathology desk.'
  },
  {
    question: 'Where is Brahm Shakti Hospital located and how do I reach it?',
    answer: 'The hospital is situated at Udyog Nagar Metro Station Road, Budh Vihar Phase-1, North-West Delhi - 110086. It is conveniently accessible by Delhi Metro (Green Line - Udyog Nagar Station) and central public bus routes.'
  }
];

const INITIAL_HOME_EVENTS = [
  {
    _id: 'evt-hospice-care-2026',
    title: 'World Hospice and Palliative Care Day 2026',
    slug: 'world-hospice-and-palliative-care-day-2026',
    coverImage: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795183378/brahmshakti_event_hero_resized.jpg',
    location: 'Main Auditorium, Brahm Shakti Hospital, Pocket C, Budh Vihar, New Delhi',
    date: '2026-10-09',
    summary: 'A day of learning, clinical reflection, and compassionate healthcare at Brahm Shakti Hospital.'
  },
  {
    _id: 'evt-national-flag-ceremony-2026',
    title: 'National Flag Ceremony & Healthcare Dedication Assembly',
    slug: 'national-flag-ceremony-and-healthcare-dedication-assembly',
    coverImage: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795179941/Proud_Indian_Flag_Group_Portrait.png',
    location: 'Hospital Front Courtyard, Budh Vihar Main Campus, Delhi',
    date: '2026-08-15',
    summary: 'Senior doctors, surgeons, nurses, and administrative leadership assemble to celebrate national service.'
  },
  {
    _id: 'evt-mega-health-camp-2026',
    title: 'Mega Multi-Specialty Free Health Camp & Screening Drive',
    slug: 'mega-multi-specialty-free-health-camp-and-screening-drive',
    coverImage: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795183537/WhatsApp_Image_2026-11-04_at_8.03.05_AM_2.jpg',
    location: 'Super-Specialty OPD Complex, Brahm Shakti Hospital, New Delhi',
    date: '2026-11-02',
    summary: 'Complimentary specialist consultations in Cardiology, Orthopaedics, Gynaecology, and Paediatrics for local families.'
  },
  {
    _id: 'evt-blood-donation-drive-2026',
    title: 'Voluntary Blood Donation Drive & Donor Felicitations',
    slug: 'voluntary-blood-donation-drive-and-donor-felicitations',
    coverImage: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185836/WhatsApp_Image_2026-11-04_at_8.03.05_AM.jpg',
    location: 'Licensed Blood Centre, Brahm Shakti Hospital Campus',
    date: '2026-06-14',
    summary: 'Replenishing vital emergency blood reserves with 135 volunteer donors on World Blood Donor Day.'
  }
];

const HOSPITAL_FACILITIES = [
  {
    id: 'fac-01',
    title: 'Modular 4K Laparoscopic OT Suites',
    badge: 'Surgical Block · 2nd Floor',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200',
    description: 'Precision surgical operating suites with laminar positive airflow, HEPA-14 filtration, Stryker 4K laparoscopic vision towers, and high-frequency C-Arm fluoroscopy for zero-infection minimally invasive surgeries.',
    features: ['Laminar Airflow & HEPA-14 Clean Rooms', 'Stryker 4K Laparoscopy Systems', 'Laser Proctology & Endourology Station', 'Continuous Anesthesia Gas Scavenging']
  },
  {
    id: 'fac-02',
    title: 'Level-III Neonatal & Pediatric ICU (NICU / PICU)',
    badge: 'Mother & Child Wing · Block C',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200',
    description: 'Round-the-clock tertiary neonatal intensive care for premature and high-risk neonates, equipped with GE Giraffe radiant warmers, neonatal ventilators, and 1:1 dedicated nursing care.',
    features: ['GE Giraffe Micro-Environment Warmers', 'High-Frequency Oscillatory Ventilators', 'Continuous Multipara Cardio-Respiratory Monitors', 'Double Surface LED Phototherapy']
  },
  {
    id: 'fac-03',
    title: 'Hemodialysis & Charitable Renal Care Center',
    badge: 'Dialysis Center · Ground Floor',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
    description: 'High-flux hemodialysis unit equipped with Fresenius 4008S machines and multi-stage reverse osmosis (RO) water purification delivering subsidized, infection-free renal treatment.',
    features: ['Fresenius 4008S Dialysis Consoles', 'Double-Pass Ultra-Pure RO Water Plant', 'Dedicated Serology-Isolated Bays', 'Subsidized Charitable Trust Tariff']
  },
  {
    id: 'fac-04',
    title: '24x7 Emergency Casualty & Trauma Resuscitation Bay',
    badge: 'Emergency Ramp · 24x7 Triage',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=1200',
    description: 'Direct ground-level ambulance ramp with cardiac defibrillators, crash carts, mobile ICU ambulances, and on-duty emergency physicians ready 24 hours a day.',
    features: ['Direct Road-Level Ambulance Ramp', 'Zoll Biphasic Defibrillators & Crash Carts', 'Rapid Triage & Toxicology Protocol', 'Mobile ICU Ambulance Fleet on Call']
  },
  {
    id: 'fac-05',
    title: 'Digital Radiology, Ultrasonography & Diagnostics',
    badge: 'Radiology Wing · Ground Floor',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
    description: 'High-frequency digital radiography, Color Doppler 3D/4D ultrasound, echocardiography, and cloud PACS integration providing rapid diagnostic imaging reports.',
    features: ['High-Frequency Digital X-Ray (DR)', 'Color Doppler 3D/4D Ultrasound', '2D Echocardiography & Cardiac TMT', 'Immediate Cloud PACS Digital Reporting']
  },
  {
    id: 'fac-06',
    title: 'NABL-Accredited 24x7 Central Diagnostic Pathology',
    badge: 'Central Lab · Block A',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=1200',
    description: 'Fully automated clinical biochemistry, hematology, and clinical pathology analyzers delivering urgent STAT patient reports in under 45 minutes.',
    features: ['Automated Clinical Chemistry Analysers', 'Coulter 5-Part Differential Haematology', 'STAT Emergency Turnaround < 45 Mins', 'Online Lab Report Retrieval System']
  }
];

const INITIAL_PATIENT_NOTICES = [
  {
    id: 'notice-patient-01',
    title: 'Winter Seasonal Respiratory Care & Subsidized OPD Nebulization Desk Notification',
    summary: 'Special winter pediatric and geriatric respiratory desk operational in Block A. Daily nebulization, pulse oximetry, and senior physician consultations available at subsidized trust rates.',
    content: `CIRCULAR REF: BSH/ADM/2026/104
DATE OF ISSUANCE: 22nd November 2026
ISSUED BY: Office of the Medical Superintendent, Brahm Shakti Hospital, Budh Vihar

All patients, outpatients, and visiting families are hereby informed that in view of winter air quality fluctuations and seasonal bronchitis prevalence across North-West Delhi, Brahm Shakti Hospital has instituted a Dedicated Respiratory Support Desk at the Ground Floor OPD Block.

Key Patient Facilities:
1. Subsidized Consultation: Daily OPD assessment by consultant chest physicians and pediatricians between 09:00 AM and 04:00 PM.
2. Rapid Nebulization Suite: Equipped with hospital-grade ultrasonic nebulizers and oxygen concentrators.
3. Priority Senior Citizen Desk: Wheelchair access and zero-wait triage for patients aged 60 and above experiencing acute shortness of breath.
4. 24x7 Emergency Casualty: Round-the-clock emergency admission and nebulization available via Emergency Desk (Tel: 011-27531683 / 7840089703).

For further assistance, please contact the Main Hospital Reception or consult the Desk Officer at Counter 4.`,
    category: 'Patient Advisory',
    refNumber: 'BSH/ADM/2026/104',
    audience: 'patients',
    date: '2026-11-22',
    isPinned: true,
    isNewBadge: true,
    status: 'published',
    author: 'Medical Superintendent Office',
    readTime: '2 min read'
  },
  {
    id: 'notice-patient-02',
    title: 'Ayushman Bharat (PM-JAY) & Delhi Arogya Kosh (DAK) Cashless Helpdesk Operational Hours',
    summary: 'Designated Ayushman Mitras available 24x7 at the Cashless Triage Counter. Pre-authorization guidelines for tertiary surgical procedures and critical care admissions.',
    content: `CIRCULAR REF: BSH/GOV/2026/098
DATE OF ISSUANCE: 18th November 2026
ISSUED BY: Department of Government Empanelment & Public Welfare, Brahm Shakti Hospital

Brahm Shakti Hospital reaffirms its commitment to providing accessible, cashless healthcare under Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY) and Delhi Arogya Kosh (DAK).

Beneficiary Guidelines:
- Beneficiaries must present their active PM-JAY Golden Card or DAK allotment certificate along with Aadhaar authentication at Counter 2.
- Dedicated Ayushman Mitras will complete digital biometric verification and initiate real-time pre-authorization with the National Health Authority (NHA) within 45 minutes of admission.
- Covered specialties include General & Laparoscopic Surgery, Orthopedics & Joint Trauma, Dialysis & Nephrology, ICU/HDU Care, and Obstetrics & Gynecology.

Helpdesk Contact: 7840089703 (Ayushman Desk / Trauma Triage).`,
    category: 'Public Notice',
    refNumber: 'BSH/GOV/2026/098',
    audience: 'patients',
    date: '2026-11-18',
    isPinned: true,
    isNewBadge: true,
    status: 'published',
    author: 'Government Schemes Liaison Desk',
    readTime: '3 min read'
  },
  {
    id: 'notice-patient-03',
    title: 'Revised Morning & Evening OPD Consultation Timings for Winter Session 2026',
    summary: 'Clinical consultation schedule updated across General Medicine, General Surgery, Pediatrics, Orthopedics, and Gynecology departments.',
    content: `CIRCULAR REF: BSH/OPD/2026/091
DATE OF ISSUANCE: 15th November 2026
ISSUED BY: Director Clinical Services, Brahm Shakti Hospital

To optimize patient comfort and minimize early-morning chill exposure for infants and elderly visitors, OPD consultation hours have been revised as follows, effective immediately:

- Morning OPD Session: 09:30 AM to 01:30 PM (Monday through Saturday)
- Evening OPD Session: 04:30 PM to 07:30 PM (Monday through Saturday)
- Sunday Specialty Clinics: 10:00 AM to 01:00 PM (Cardiology, Diabetology & Pediatrics)
- Emergency Casualty & Trauma Ward: Functioning 24 Hours / 7 Days continuously.

Digital appointment tokens can be scheduled via our official online booking portal or by calling our desk at 011-27531683.`,
    category: 'OPD Schedule',
    refNumber: 'BSH/OPD/2026/091',
    audience: 'patients',
    date: '2026-11-15',
    isPinned: false,
    isNewBadge: false,
    status: 'published',
    author: 'Clinical Administration',
    readTime: '2 min read'
  },
  {
    id: 'notice-patient-04',
    title: 'Free Weekly Community Diabetes & Hypertension Screening Camp Every Sunday',
    summary: 'Complimentary blood sugar, HbA1c screening, blood pressure monitoring, and nutritionist consultations for local residents of Budh Vihar and Rohini.',
    content: `CIRCULAR REF: BSH/WLF/2026/085
DATE OF ISSUANCE: 10th November 2026
ISSUED BY: Community Health Outreach Division, Brahm Shakti Trust

Under the philanthropic banner of Brahm Shakti Trust, the hospital will conduct a Free Preventive Diabetes & Hypertension Camp on every Sunday throughout November and December 2026.

Camp Venue: Main OPD Foyer, Brahm Shakti Hospital, Pocket C, Budh Vihar Phase I, Delhi 110085.
Timings: 09:00 AM to 01:00 PM.
Free Deliverables: Random Blood Sugar Test, BP checkup, BMI calculation, and diet counseling by certified nutritionists. No registration fee required.`,
    category: 'Health Campaign',
    refNumber: 'BSH/WLF/2026/085',
    audience: 'patients',
    date: '2026-11-10',
    isPinned: false,
    isNewBadge: false,
    status: 'published',
    author: 'Brahm Shakti Trust Board',
    readTime: '2 min read'
  }
];

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isStaff, dashboardPath } = useAuth();
  const appointmentTarget = '/bookappointment';

  const [departments, setDepartments] = useState(departmentsData || []);
  const [allDoctors, setAllDoctors] = useState(doctorsData || []);
  const [doctors, setDoctors] = useState((doctorsData || []).slice(0, 4));
  const [loading, setLoading] = useState(true);

  // Department & Doctor selection state
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [internationalModalOpen, setInternationalModalOpen] = useState(false);
  const [selectedDisciplineTab, setSelectedDisciplineTab] = useState('all');

  // Hero banner slider state & auto-play
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  // Touch swipe support for mobile/tablet users
  const heroTouchStartX = React.useRef(0);
  const heroTouchEndX = React.useRef(0);

  const handleHeroTouchStart = (e) => {
    heroTouchStartX.current = e.targetTouches[0].clientX;
  };
  const handleHeroTouchMove = (e) => {
    heroTouchEndX.current = e.targetTouches[0].clientX;
  };
  const handleHeroTouchEnd = () => {
    const diff = heroTouchStartX.current - heroTouchEndX.current;
    if (diff > 45) {
      setHeroSlideIndex((prev) => (prev + 1) % HERO_BANNER_IMAGES.length);
    } else if (diff < -45) {
      setHeroSlideIndex((prev) => (prev - 1 + HERO_BANNER_IMAGES.length) % HERO_BANNER_IMAGES.length);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % HERO_BANNER_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Gallery 3D Cover Flow Carousel & Lightbox Preview State
  const [galleryItems, setGalleryItems] = useState(INITIAL_GALLERY_PHOTOS);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('all');
  const [galleryActiveIndex, setGalleryActiveIndex] = useState(0);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Gallery touch swipe for mobile/tablet
  const galleryTouchStartX = React.useRef(0);
  const galleryTouchEndX = React.useRef(0);

  const handleGalleryTouchStart = (e) => {
    galleryTouchStartX.current = e.targetTouches[0].clientX;
  };
  const handleGalleryTouchMove = (e) => {
    galleryTouchEndX.current = e.targetTouches[0].clientX;
  };
  const handleGalleryTouchEnd = () => {
    if (displayedGallery.length === 0) return;
    const diff = galleryTouchStartX.current - galleryTouchEndX.current;
    if (diff > 40) {
      setGalleryActiveIndex((prev) => (prev + 1) % displayedGallery.length);
    } else if (diff < -40) {
      setGalleryActiveIndex((prev) => (prev - 1 + displayedGallery.length) % displayedGallery.length);
    }
  };

  // Fetch dynamic gallery photos from database
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
          setGalleryItems(res.data.data);
        }
      } catch (err) {
        console.warn('Dynamic gallery fetch fallback to initial list:', err);
      }
    };
    fetchGallery();
  }, []);

  const displayedGallery = React.useMemo(() => {
    if (selectedGalleryCategory === 'all') return galleryItems;
    const filtered = galleryItems.filter((i) => i.category === selectedGalleryCategory);
    return filtered.length > 0 ? filtered : galleryItems;
  }, [galleryItems, selectedGalleryCategory]);

  // Auto-scrolling gallery interval (pauses on hover)
  useEffect(() => {
    if (isGalleryHovered || displayedGallery.length === 0) return;
    const interval = setInterval(() => {
      setGalleryActiveIndex((prev) => (prev + 1) % displayedGallery.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isGalleryHovered, displayedGallery.length]);

  const handleCategoryClick = (catId) => {
    setSelectedGalleryCategory(catId);
    setGalleryActiveIndex(0);
  };

  // Showcase Unified Section State ('events' | 'location' | 'facilities')
  const [activeShowcaseTab, setActiveShowcaseTab] = useState('events');
  const [facilitySlideIndex, setFacilitySlideIndex] = useState(0);

  // Events Slider State & Dynamic Fetching
  const [eventsList, setEventsList] = useState(INITIAL_HOME_EVENTS);
  const [eventSlideIndex, setEventSlideIndex] = useState(0);

  // Government Style Patient News & Official Bulletins
  const [patientNewsList, setPatientNewsList] = useState(INITIAL_PATIENT_NOTICES);
  const [newsFilterCategory, setNewsFilterCategory] = useState('all');
  const [selectedNoticeModal, setSelectedNoticeModal] = useState(null);
  const [newsSearchTerm, setNewsSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatientNews = async () => {
      try {
        const res = await api.get('/news?audience=patients');
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setPatientNewsList(res.data.data);
        }
      } catch (err) {
        console.warn('Patient news fetch fallback:', err);
      }
    };
    fetchPatientNews();
  }, []);

  const currentFacility = HOSPITAL_FACILITIES[facilitySlideIndex] || HOSPITAL_FACILITIES[0];

  const handlePrevFacility = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setFacilitySlideIndex((prev) => (prev - 1 + HOSPITAL_FACILITIES.length) % HOSPITAL_FACILITIES.length);
  };

  const handleNextFacility = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setFacilitySlideIndex((prev) => (prev + 1) % HOSPITAL_FACILITIES.length);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
          setEventsList(res.data.data);
        }
      } catch (err) {
        console.warn('Events fetch fallback:', err);
      }
    };
    fetchEvents();
  }, []);

  const currentEvent = eventsList[eventSlideIndex] || eventsList[0] || INITIAL_HOME_EVENTS[0];

  const handlePrevEvent = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setEventSlideIndex((prev) => (prev - 1 + eventsList.length) % eventsList.length);
  };

  const handleNextEvent = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setEventSlideIndex((prev) => (prev + 1) % eventsList.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          api.get('/departments'),
          api.get('/doctors')
        ]);
        if (deptRes.data?.success && Array.isArray(deptRes.data.data)) {
          setDepartments(deptRes.data.data);
        }
        if (docRes.data?.success && Array.isArray(docRes.data.data)) {
          setAllDoctors(docRes.data.data);
          setDoctors(docRes.data.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter doctors based strictly on the selected department
  const availableDoctors = useMemo(() => {
    if (!selectedDepartment) {
      return allDoctors;
    }
    return allDoctors.filter(
      (doc) =>
        doc.departmentId === selectedDepartment ||
        doc.departmentName?.toLowerCase().includes(selectedDepartment.toLowerCase())
    );
  }, [allDoctors, selectedDepartment]);

  const handleDepartmentChange = (e) => {
    const val = e.target.value;
    setSelectedDepartment(val);
    setSelectedDoctor(''); // reset doctor selection when department changes
  };

  const handleSearchAppointment = (e) => {
    if (e) e.preventDefault();
    if (selectedDoctor && selectedDepartment) {
      navigate(`/bookappointment?doctor=${encodeURIComponent(selectedDoctor)}&department=${encodeURIComponent(selectedDepartment)}`);
      return;
    }
    if (selectedDoctor) {
      navigate(`/bookappointment?doctor=${encodeURIComponent(selectedDoctor)}`);
      return;
    }
    if (selectedDepartment) {
      navigate(`/bookappointment?department=${encodeURIComponent(selectedDepartment)}`);
      return;
    }
    navigate('/bookappointment');
  };

  const activeTabObj = CLINICAL_DISCIPLINES.find((t) => t.id === selectedDisciplineTab);
  const displayedDepartments = React.useMemo(() => {
    if (!activeTabObj || activeTabObj.id === 'all') {
      return departments;
    }
    return departments.filter((d) => activeTabObj.deptIds?.includes(d.id));
  }, [departments, activeTabObj]);

  return (
    <div className="space-y-7 sm:space-y-12 lg:space-y-16 pb-12 sm:pb-20">
      {/* 1. Hero Section - Full-Width Hospital Banner Carousel */}
      <section
        className="relative w-full overflow-hidden bg-slate-900 shadow-md touch-pan-y"
        onTouchStart={handleHeroTouchStart}
        onTouchMove={handleHeroTouchMove}
        onTouchEnd={handleHeroTouchEnd}
      >
        <div className="relative w-full h-[210px] xs:h-[260px] sm:h-[380px] md:h-[480px] lg:h-[580px] xl:h-[660px]">
          {HERO_BANNER_IMAGES.map((imageUrl, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                idx === heroSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={imageUrl}
                alt={`Brahm Shakti Hospital Hero Slide ${idx + 1}`}
                className="w-full h-full object-cover object-center"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            type="button"
            aria-label="Previous Slide"
            onClick={() => setHeroSlideIndex((prev) => (prev - 1 + HERO_BANNER_IMAGES.length) % HERO_BANNER_IMAGES.length)}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs shadow-lg hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            type="button"
            aria-label="Next Slide"
            onClick={() => setHeroSlideIndex((prev) => (prev + 1) % HERO_BANNER_IMAGES.length)}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs shadow-lg hover:scale-105"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5 bg-black/35 backdrop-blur-xs px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full">
            {HERO_BANNER_IMAGES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setHeroSlideIndex(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  idx === heroSlideIndex
                    ? 'w-6 sm:w-7 h-2 sm:h-2.5 bg-white'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/60 hover:bg-white/90'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Our Doctor Team */}
      <section className="bg-white py-8 sm:py-14 border-b border-medical-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-6 sm:mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-[#0A7A74] text-xs font-bold uppercase tracking-wider mb-2">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Expert Healthcare Professionals</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0B2545] tracking-tight">
                Our Doctor Team
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                Experienced, caring doctors and specialists dedicated to the health and well-being of you and your family.
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <span className="sm:hidden text-xs text-[#0A7A74] font-bold">Swipe to view →</span>
              <Link
                to="/doctors"
                className="inline-flex items-center gap-1.5 text-primary hover:text-primary-hover font-bold text-xs sm:text-sm"
              >
                <span>View All Doctors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Doctor Cards: Mobile Horizontal Swipe Carousel, Desktop Grid */}
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="w-[74vw] xs:w-[68vw] sm:w-auto shrink-0 snap-start bg-medical-coolgray rounded-2xl overflow-hidden border border-medical-border shadow-soft hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 sm:h-56 overflow-hidden bg-slate-200 relative">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-emerald-600/90 text-white backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                      {doctor.category || 'In house'}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-bold text-secondary">
                      ★ {doctor.rating || 4.9}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="text-base sm:text-lg font-bold text-secondary leading-tight">{doctor.name}</h3>
                    <p className="text-xs font-semibold text-primary mt-1">{doctor.designation}</p>
                    <p className="text-[11px] text-medical-muted mt-0.5">{doctor.qualification}</p>
                    {doctor.dmcNo && (
                      <p className="text-[10px] font-bold text-slate-500 mt-1 font-mono">
                        DMC No. {doctor.dmcNo}
                      </p>
                    )}

                    <div className="mt-2.5 sm:mt-3 text-xs text-medical-slate space-y-0.5 sm:space-y-1">
                      <div>Experience: <strong>{doctor.experienceYears}+ Years</strong></div>
                      <div>Fee: <strong>₹{doctor.consultationFee}</strong> (Subsidized)</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0">
                  <Link
                    to={`/doctors/${doctor.id}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Appointment</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Specialities & Procedures Section - Professional Hospital Architecture */}
      <section className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-5 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0B2545] tracking-tight">
              Specialities & Procedures
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Evidence-based clinical treatments, advanced day-care surgeries & tertiary inpatient care led by DMC-registered faculty
            </p>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <span className="sm:hidden text-xs text-[#0A7A74] font-bold">Swipe to view →</span>
            <Link
              to="/departments"
              className="inline-flex items-center gap-1.5 text-primary hover:text-primary-hover font-bold text-xs sm:text-sm shrink-0"
            >
              <span>View All Specialities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Clinical Discipline Switcher Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2.5 mb-5 sm:mb-8 scrollbar-none flex-nowrap -mx-4 px-4 sm:mx-0 sm:px-0">
          {CLINICAL_DISCIPLINES.map((tab) => {
            const isActive = selectedDisciplineTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedDisciplineTab(tab.id)}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0B2545] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Clinical Department Cards: Mobile Swipe Carousel, Desktop Grid */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
          {displayedDepartments.map((dept) => {
            const highlights = DEPARTMENT_CLINICAL_HIGHLIGHTS[dept.id] || {
              faculty: dept.headOfDepartment || 'Senior Medical Faculty',
              location: dept.floorLocation || 'Main Hospital Wing',
              procedures: dept.services ? dept.services.slice(0, 3) : ['Comprehensive Specialist Evaluation', 'Diagnostic Workup', 'Outpatient Consultation']
            };

            return (
              <div
                key={dept.id}
                className="w-[82vw] xs:w-[76vw] sm:w-auto shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Department Photo with Location Badge */}
                  <div className="relative h-40 sm:h-48 overflow-hidden bg-slate-100">
                    <img
                      src={dept.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'}
                      alt={dept.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                    
                    {/* Location Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#0B2545]/90 text-white backdrop-blur-xs text-[10px] font-bold tracking-wide uppercase">
                      {highlights.location}
                    </div>

                    {/* Subsidized Fee Badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white/95 text-slate-800 backdrop-blur-xs text-[11px] font-bold shadow-xs">
                      ₹{dept.consultationCharges || 700} OPD
                    </div>

                    {/* Department Title Overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                        {dept.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 space-y-3">
                    {/* Lead Faculty */}
                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <Stethoscope className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{highlights.faculty}</span>
                    </div>

                    {/* Procedures List */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Key Procedures Performed
                      </div>
                      {highlights.procedures.map((proc, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{proc}</span>
                        </div>
                      ))}
                    </div>

                    {/* OPD Timings */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{dept.opdTimings || 'Mon - Sat: 09:00 AM - 05:00 PM'}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Available Today
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 sm:p-5 pt-0 flex items-center gap-2">
                  <Link
                    to={`/departments/${dept.id}`}
                    className="flex-1 py-2 sm:py-2.5 rounded-xl border border-slate-300 hover:border-[#0B2545] text-[#0B2545] text-xs font-bold text-center transition-all"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/bookappointment?specialty=${dept.id}`}
                    className="flex-1 py-2 sm:py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#123661] text-white text-xs font-bold text-center transition-all shadow-sm hover:shadow"
                  >
                    Book Slot
                  </Link>
                </div>
              </div>
            );
          })}
        </div>


      </section>

      {/* Hospital Metrics & Bed Census Statistics */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            { number: '250+', suffix: 'Beds', title: 'Inpatient Capacity', desc: 'ICU, Level-III NICU & modern private rooms' },
            { number: '20+', suffix: 'Consultants', title: 'DMC Certified Faculty', desc: 'Medicine, Surgery, Ortho, Gynae, Peds, Eye' },
            { number: '24x7', suffix: 'Active', title: 'Casualty & Blood Bank', desc: 'Round-the-clock emergency trauma desk' },
            { number: 'Subsidized', suffix: 'Trust Care', title: 'Philanthropic Ethos', desc: 'Brahm Shakti Trust charitable tariff' }
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 sm:p-6 border border-medical-border shadow-soft hover:shadow-card-hover hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary tracking-tight">{stat.number}</span>
                  <span className="text-xs sm:text-sm font-bold text-secondary">{stat.suffix}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-secondary mt-1">{stat.title}</h3>
                <p className="text-[11px] sm:text-xs text-medical-muted mt-1 leading-relaxed">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* 5. Why Choose Brahm Shakti Hospital */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0B2545] tracking-tight">
              Why Choose Brahm Shakti Hospital?
            </h2>
            <p className="text-medical-muted text-sm leading-relaxed">
              Managed by Brahm Shakti Trust (Regd.), our mission is to make super-specialty tertiary care accessible to all families in North-West Delhi without financial strain, backed by certified clinical excellence.
            </p>

            <div className="space-y-4 pt-2">
              {[
                { title: 'NABH & NABL Accredited Infrastructure', desc: 'Strict adherence to national patient safety protocols and international laboratory precision.' },
                { title: '24x7 Cath Lab & Emergency Trauma', desc: 'Rapid STEMI heart attack intervention with door-to-balloon time under 45 minutes.' },
                { title: 'Subsidized High-Flux Hemodialysis', desc: 'Charitable dialysis center operating round the clock at subsidized trust rates.' },
                { title: 'Cashless Insurance & Government Panels', desc: 'Empaneled with CGHS, ECHS, DGEHS, and leading TPAs for cashless hospitalization.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-medical-border">
                  <CheckCircle2 className="w-5 h-5 text-status-success shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-secondary">{item.title}</h4>
                    <p className="text-xs text-medical-muted mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600"
                  alt="Cath Lab Surgery"
                  className="rounded-2xl shadow-md h-36 sm:h-56 w-full object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600"
                  alt="Dialysis Care"
                  className="rounded-2xl shadow-md h-28 sm:h-40 w-full object-cover"
                />
              </div>
              <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-8">
                <img
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600"
                  alt="NICU Incubator"
                  className="rounded-2xl shadow-md h-28 sm:h-40 w-full object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=600"
                  alt="Orthopaedic Joint Surgery"
                  className="rounded-2xl shadow-md h-36 sm:h-56 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.5 Unified Hospital Showcase (Events / Location & Directions / Facilities) */}
      <section id="showcase-section" className="py-12 sm:py-16 bg-[#F4F8FA]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header & Segmented Switcher Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#0A7A74] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hospital Highlights &amp; Visitor Guide</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Explore Brahm Shakti Hospital
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Browse our institutional events, hospital transit directions, and advanced tertiary facilities all in one interactive space.
              </p>
            </div>

            {/* Unified Segmented Switcher Buttons */}
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs self-start md:self-auto">
              <button
                type="button"
                onClick={() => setActiveShowcaseTab('events')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeShowcaseTab === 'events'
                    ? 'bg-[#0A7A74] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Events</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeShowcaseTab === 'events' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {eventsList.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveShowcaseTab('location')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeShowcaseTab === 'location'
                    ? 'bg-[#0A7A74] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Location &amp; Directions</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveShowcaseTab('facilities')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeShowcaseTab === 'facilities'
                    ? 'bg-[#0A7A74] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Facilities</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeShowcaseTab === 'facilities' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {HOSPITAL_FACILITIES.length}
                </span>
              </button>
            </div>
          </div>

          {/* Unified Container - Switches in the same place */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden transition-all duration-300">
            {/* VIEW 1: EVENTS */}
            {activeShowcaseTab === 'events' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[380px]">
                {/* Event Photo with Floating Slider Controls */}
                <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto min-h-[280px] bg-slate-950 overflow-hidden group">
                  <img
                    src={currentEvent?.coverImage}
                    alt={currentEvent?.title || 'Brahm Shakti Hospital Event'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = 'https://res.cloudinary.com/urzka7oz/image/upload/v1795183378/brahmshakti_event_hero_resized.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={handlePrevEvent}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 text-slate-800 shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    aria-label="Previous Event"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-700" />
                  </button>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={handleNextEvent}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 text-slate-800 shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    aria-label="Next Event"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-700" />
                  </button>

                  {/* Slide Counter */}
                  <div className="absolute bottom-3 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                      Event {eventSlideIndex + 1} of {eventsList.length}
                    </span>
                  </div>
                </div>

                {/* Event Details Content */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-white">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-[#0A7A74] text-xs font-bold border border-teal-200/60">
                        Hospital Outreach
                      </span>
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#0A7A74]" />
                        <span>{currentEvent?.date || '2026-10-09'}</span>
                      </div>
                    </div>

                    <Link
                      to={`/events/${currentEvent?.slug || currentEvent?._id}`}
                      className="block text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug hover:text-[#0A7A74] transition-colors"
                    >
                      {currentEvent?.title}
                    </Link>

                    {currentEvent?.location && (
                      <div className="flex items-start gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-[#0A7A74] shrink-0 mt-0.5" />
                        <span>{currentEvent.location}</span>
                      </div>
                    )}

                    {currentEvent?.summary && (
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4">
                        {currentEvent.summary}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      to={`/events/${currentEvent?.slug || currentEvent?._id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs sm:text-sm font-bold transition-all shadow-sm group/btn"
                    >
                      <span>Read Event Details</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    {/* Dots */}
                    <div className="flex items-center gap-1.5">
                      {eventsList.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEventSlideIndex(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            idx === eventSlideIndex ? 'w-6 bg-[#0A7A74]' : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: LOCATION & DIRECTIONS */}
            {activeShowcaseTab === 'location' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[380px]">
                {/* Google Map Interactive Embed */}
                <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto min-h-[300px] bg-slate-100 overflow-hidden">
                  <iframe
                    title="Brahm Shakti Hospital Campus Directions"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.9754714488344!2d77.06745197631726!3d28.719894475619106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d06f6bf53bc47%3A0xe53be0c8fc0283f3!2sBrahm%20Shakti%20Hospital!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    className="w-full h-full border-0 min-h-[300px]"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Budh Vihar Main Campus</span>
                    </span>
                  </div>
                </div>

                {/* Location Details Content */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-white">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#0A7A74]" />
                      <span>Open 24 Hours / 7 Days a Week (Emergency Casualty)</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                      Brahm Shakti Hospital is located in Budh Vihar, Rohini Zone
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Pocket C, Budh Vihar Phase I, Pooth Kurd, New Delhi, Delhi, 110085. Managed by Brahm Shakti Trust (Regd.).
                    </p>

                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-teal-50 text-[#0A7A74] flex items-center justify-center font-bold text-[11px] shrink-0">
                          🚇
                        </span>
                        <span><strong>Nearest Metro:</strong> Rithala Metro (Red Line) &amp; Udyog Nagar (Green Line)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-teal-50 text-[#0A7A74] flex items-center justify-center font-bold text-[11px] shrink-0">
                          🚌
                        </span>
                        <span><strong>Road Access:</strong> Outer Ring Road &amp; Mangolpuri Flyover Corridor</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-[11px] shrink-0">
                          🚑
                        </span>
                        <span><strong>Emergency Triage:</strong> 24x7 Direct Road-Level Ambulance Ramp</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      to="/location-and-directions"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs sm:text-sm font-bold transition-all shadow-sm group/btn"
                    >
                      <span>Full Transit &amp; Route Guide</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    <a
                      href="https://maps.google.com/?q=Brahm+Shakti+Hospital+Budh+Vihar+New+Delhi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0A7A74] hover:underline"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: FACILITIES */}
            {activeShowcaseTab === 'facilities' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[380px]">
                {/* Facility Photo with Slider Controls */}
                <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto min-h-[280px] bg-slate-950 overflow-hidden group">
                  <img
                    src={currentFacility.image}
                    alt={currentFacility.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={handlePrevFacility}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 text-slate-800 shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    aria-label="Previous Facility"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-700" />
                  </button>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={handleNextFacility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 text-slate-800 shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    aria-label="Next Facility"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-700" />
                  </button>

                  {/* Slide Counter */}
                  <div className="absolute bottom-3 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                      Facility {facilitySlideIndex + 1} of {HOSPITAL_FACILITIES.length}
                    </span>
                  </div>
                </div>

                {/* Facility Details Content */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-white">
                  <div className="space-y-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-[#0A7A74] text-xs font-bold border border-teal-200/60">
                      {currentFacility.badge}
                    </span>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                      {currentFacility.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {currentFacility.description}
                    </p>

                    {/* Features list */}
                    <div className="pt-2 border-t border-slate-100 grid grid-cols-1 gap-2">
                      {currentFacility.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0A7A74] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      to={appointmentTarget}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs sm:text-sm font-bold transition-all shadow-sm group/btn"
                    >
                      <span>Book OPD Consultation</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    {/* Dots */}
                    <div className="flex items-center gap-1.5">
                      {HOSPITAL_FACILITIES.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFacilitySlideIndex(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            idx === facilitySlideIndex ? 'w-6 bg-[#0A7A74]' : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                          }`}
                          aria-label={`Facility ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. Patient Testimonials & Trust - Auto-scrolling Continuous Marquee (Matches Landing Page BG) */}
      <section className="py-10 sm:py-16 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 mb-6 sm:mb-10 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#0A7A74] mb-2">
            <Star className="w-4 h-4 fill-[#0A7A74]" />
            <span>Real Patient Feedback & Stories</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Words of Gratitude From Our Patients
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xl mx-auto">
            Real experiences from recovered patients treated across super-specialty departments at Brahm Shakti Hospital.
          </p>
        </div>

        {/* Dual-Row Infinite Auto-Scrolling Marquee with Edge Fade Masks */}
        <div className="relative w-full space-y-4 sm:space-y-6">
          {/* Subtle Left & Right Edge Fade Gradient Masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-[#F4F8FA] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-[#F4F8FA] to-transparent z-10" />

          {/* Row 1: Auto-scrolling to the left */}
          <div className="animate-marquee-left gap-4 sm:gap-6 px-4">
            {[
              {
                name: 'Satish Narang',
                treatment: 'Total Knee Replacement',
                location: 'Rohini, Sector 22',
                initials: 'SN',
                avatarBg: 'bg-amber-100',
                avatarText: 'text-amber-800',
                text: 'Dr. Kapil Goyal and the orthopaedic team at Brahm Shakti Hospital gave me a second chance to walk pain-free. Subsidized package made it truly affordable for our family.'
              },
              {
                name: 'Kavita Mathur',
                treatment: 'Emergency Cath Angioplasty',
                location: 'Budh Vihar Phase I',
                initials: 'KM',
                avatarBg: 'bg-teal-100',
                avatarText: 'text-teal-800',
                text: 'When my husband suffered severe chest angina at midnight, Brahm Shakti casualty team stabilized him in minutes. The 24x7 Cath Lab angioplasty saved his life. Eternally grateful.'
              },
              {
                name: 'Mohd. Salim',
                treatment: 'Maintenance Hemodialysis',
                location: 'Pooth Khurd, Delhi',
                initials: 'MS',
                avatarBg: 'bg-blue-100',
                avatarText: 'text-blue-800',
                text: 'I have been coming to Brahm Shakti dialysis wing for 2 years. Ultra-pure water system, friendly nurses, and philanthropic trust rates have relieved my family completely.'
              },
              {
                name: 'Anita Sharma',
                treatment: 'Maternity & High-Risk Delivery',
                location: 'Sector 24, Rohini',
                initials: 'AS',
                avatarBg: 'bg-rose-100',
                avatarText: 'text-rose-800',
                text: 'Under Dr. Manisha Jain’s gentle guidance, our twin delivery went smoothly. The Level-III NICU nursery and compassionate nursing staff gave us unmatched reassurance.'
              },
              // Duplicate items for continuous seamless loop
              {
                name: 'Satish Narang',
                treatment: 'Total Knee Replacement',
                location: 'Rohini, Sector 22',
                initials: 'SN',
                avatarBg: 'bg-amber-100',
                avatarText: 'text-amber-800',
                text: 'Dr. Kapil Goyal and the orthopaedic team at Brahm Shakti Hospital gave me a second chance to walk pain-free. Subsidized package made it truly affordable for our family.'
              },
              {
                name: 'Kavita Mathur',
                treatment: 'Emergency Cath Angioplasty',
                location: 'Budh Vihar Phase I',
                initials: 'KM',
                avatarBg: 'bg-teal-100',
                avatarText: 'text-teal-800',
                text: 'When my husband suffered severe chest angina at midnight, Brahm Shakti casualty team stabilized him in minutes. The 24x7 Cath Lab angioplasty saved his life. Eternally grateful.'
              },
              {
                name: 'Mohd. Salim',
                treatment: 'Maintenance Hemodialysis',
                location: 'Pooth Khurd, Delhi',
                initials: 'MS',
                avatarBg: 'bg-blue-100',
                avatarText: 'text-blue-800',
                text: 'I have been coming to Brahm Shakti dialysis wing for 2 years. Ultra-pure water system, friendly nurses, and philanthropic trust rates have relieved my family completely.'
              },
              {
                name: 'Anita Sharma',
                treatment: 'Maternity & High-Risk Delivery',
                location: 'Sector 24, Rohini',
                initials: 'AS',
                avatarBg: 'bg-rose-100',
                avatarText: 'text-rose-800',
                text: 'Under Dr. Manisha Jain’s gentle guidance, our twin delivery went smoothly. The Level-III NICU nursery and compassionate nursing staff gave us unmatched reassurance.'
              }
            ].map((t, idx) => (
              <div
                key={idx}
                className="w-[290px] xs:w-[320px] sm:w-[360px] bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/90 flex flex-col justify-between shrink-0 select-none hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${t.avatarBg} ${t.avatarText} font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs`}>
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">{t.name}</div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-wider uppercase truncate mt-0.5">
                      {t.treatment} · {t.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Auto-scrolling to the right */}
          <div className="animate-marquee-right gap-4 sm:gap-6 px-4">
            {[
              {
                name: 'Rajeshwar Singh',
                treatment: 'Laparoscopic Surgery',
                location: 'Rithala, Delhi',
                initials: 'RS',
                avatarBg: 'bg-indigo-100',
                avatarText: 'text-indigo-800',
                text: 'Dr. Nishant Verma’s surgical expertise is outstanding. Minimal incisions, discharged within 36 hours with zero post-operative pain. Cleanest hospital wards in North-West Delhi.'
              },
              {
                name: 'Pooja Aggarwal',
                treatment: 'Paediatric Emergency Care',
                location: 'Narela, Delhi',
                initials: 'PA',
                avatarBg: 'bg-emerald-100',
                avatarText: 'text-emerald-800',
                text: 'When my 3-year-old daughter had high fever complications, the paediatric critical care unit reacted instantly. The doctors explained every medication with great empathy.'
              },
              {
                name: 'Harpreet Kaur',
                treatment: 'Endoscopic Sinus Surgery',
                location: 'Pitampura, Delhi',
                initials: 'HK',
                avatarBg: 'bg-purple-100',
                avatarText: 'text-purple-800',
                text: 'Had suffered from chronic sinusitis for 5 years. The ENT day-care surgery at Brahm Shakti gave me permanent relief. Very courteous administration and billing desk.'
              },
              {
                name: 'Dharmendra Verma',
                treatment: 'Trauma & Fracture Fixation',
                location: 'Bawana, Delhi',
                initials: 'DV',
                avatarBg: 'bg-amber-100',
                avatarText: 'text-amber-800',
                text: 'Admitted through emergency casualty following an accident. Immediate CT scans, round-the-clock surgeon availability, and cashless TPA insurance processing was seamless.'
              },
              // Duplicate items for continuous seamless loop
              {
                name: 'Rajeshwar Singh',
                treatment: 'Laparoscopic Surgery',
                location: 'Rithala, Delhi',
                initials: 'RS',
                avatarBg: 'bg-indigo-100',
                avatarText: 'text-indigo-800',
                text: 'Dr. Nishant Verma’s surgical expertise is outstanding. Minimal incisions, discharged within 36 hours with zero post-operative pain. Cleanest hospital wards in North-West Delhi.'
              },
              {
                name: 'Pooja Aggarwal',
                treatment: 'Paediatric Emergency Care',
                location: 'Narela, Delhi',
                initials: 'PA',
                avatarBg: 'bg-emerald-100',
                avatarText: 'text-emerald-800',
                text: 'When my 3-year-old daughter had high fever complications, the paediatric critical care unit reacted instantly. The doctors explained every medication with great empathy.'
              },
              {
                name: 'Harpreet Kaur',
                treatment: 'Endoscopic Sinus Surgery',
                location: 'Pitampura, Delhi',
                initials: 'HK',
                avatarBg: 'bg-purple-100',
                avatarText: 'text-purple-800',
                text: 'Had suffered from chronic sinusitis for 5 years. The ENT day-care surgery at Brahm Shakti gave me permanent relief. Very courteous administration and billing desk.'
              },
              {
                name: 'Dharmendra Verma',
                treatment: 'Trauma & Fracture Fixation',
                location: 'Bawana, Delhi',
                initials: 'DV',
                avatarBg: 'bg-amber-100',
                avatarText: 'text-amber-800',
                text: 'Admitted through emergency casualty following an accident. Immediate CT scans, round-the-clock surgeon availability, and cashless TPA insurance processing was seamless.'
              }
            ].map((t, idx) => (
              <div
                key={idx}
                className="w-[290px] xs:w-[320px] sm:w-[360px] bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/90 flex flex-col justify-between shrink-0 select-none hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${t.avatarBg} ${t.avatarText} font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs`}>
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">{t.name}</div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-wider uppercase truncate mt-0.5">
                      {t.treatment} · {t.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Government-Style Official News, Announcements & Patient Circulars */}
      <section id="news-section" className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#0A7A74] text-xs font-bold uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Official Notices &amp; Patient Advisories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Hospital Announcements &amp; Public Circulars
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Official medical orders, health camp circulars, and public health advisories issued by Brahm Shakti Hospital Administration for visiting patients and families.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="text-xs text-slate-500 font-semibold">
              Showing {patientNewsList.length} Official Bulletins
            </span>
          </div>
        </div>

        {/* Institutional Alert / Urgent Advisory Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-3.5 sm:px-5 flex items-center justify-between gap-4 mb-6 shadow-sm overflow-hidden border border-slate-800">
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-800/60">
              LATEST CIRCULAR
            </span>
          </div>

          <div className="text-xs sm:text-sm text-slate-200 font-medium truncate flex-1">
            Winter Seasonal Respiratory Desk Operational in Block A · Free Sunday Diabetes Screening · 24x7 Cashless Ayushman Helpdesk Counter 2
          </div>

          <span className="text-[11px] text-teal-300 font-mono font-bold shrink-0 hidden md:inline">
            BSH / Budh Vihar Main Campus
          </span>
        </div>

        {/* Filter Pills & Search */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Notices' },
              { id: 'Patient Advisory', label: 'Patient Advisories' },
              { id: 'Public Notice', label: 'Public Notices' },
              { id: 'OPD Schedule', label: 'OPD Schedule' },
              { id: 'Health Campaign', label: 'Health Campaigns' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setNewsFilterCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  newsFilterCategory === cat.id
                    ? 'bg-[#0A7A74] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={newsSearchTerm}
              onChange={(e) => setNewsSearchTerm(e.target.value)}
              placeholder="Search circulars, topics..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A7A74]/20 focus:border-[#0A7A74]"
            />
          </div>
        </div>

        {/* Notice Board List (Authentic Government Institutional Design) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden divide-y divide-slate-100">
          {patientNewsList
            .filter((item) => {
              if (newsFilterCategory !== 'all' && item.category !== newsFilterCategory) return false;
              if (newsSearchTerm) {
                const term = newsSearchTerm.toLowerCase();
                return (
                  (item.title || '').toLowerCase().includes(term) ||
                  (item.summary || '').toLowerCase().includes(term) ||
                  (item.refNumber || '').toLowerCase().includes(term)
                );
              }
              return true;
            })
            .map((item) => (
              <div
                key={item.id || item._id}
                className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Government Date Badge */}
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0 border border-slate-800 shadow-2xs group-hover:border-[#0A7A74] transition-colors">
                    <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">
                      {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short' }) : 'NOV'}
                    </span>
                    <span className="text-base sm:text-lg font-black leading-none mt-0.5">
                      {item.date ? new Date(item.date).getDate() : '22'}
                    </span>
                  </div>

                  {/* Notice Content */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.refNumber && (
                        <span className="font-mono text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                          {item.refNumber}
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-50 text-[#0A7A74] border border-teal-200/60">
                        {item.category}
                      </span>
                      {item.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-600 text-[10px] font-bold">
                          <Pin className="w-3 h-3 fill-rose-600" />
                          <span>Pinned</span>
                        </span>
                      )}
                      {item.isNewBadge && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0A7A74] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.summary || item.excerpt}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <span>Issued by: {item.author || 'Brahm Shakti Hospital Administration'}</span>
                    </div>
                  </div>
                </div>

                {/* Read Button */}
                <button
                  type="button"
                  onClick={() => setSelectedNoticeModal(item)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 group-hover:border-[#0A7A74] group-hover:bg-[#0A7A74] group-hover:text-white text-slate-700 text-xs font-bold transition-all shrink-0 self-end md:self-center cursor-pointer shadow-2xs"
                >
                  <span>Read Circular</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ))}
        </div>
      </section>

      {/* 8. Campus Moments (Photo Gallery Section - 3D Cover Flow Carousel) */}
      <section className="max-w-7xl mx-auto px-4 overflow-hidden">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2545] tracking-tight">
            Campus Moments
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            A visual walk through our advanced surgical suites, intensive care units, emergency bay, and hospital campus.
          </p>
        </div>

        {/* 3D Auto-Scrolling One-Line Carousel Container */}
        <div
          className="relative w-full h-[290px] xs:h-[320px] sm:h-[370px] md:h-[420px] flex items-center justify-center py-2 select-none overflow-hidden touch-pan-y"
          onMouseEnter={() => setIsGalleryHovered(true)}
          onMouseLeave={() => setIsGalleryHovered(false)}
          onTouchStart={handleGalleryTouchStart}
          onTouchMove={handleGalleryTouchMove}
          onTouchEnd={handleGalleryTouchEnd}
        >
          {/* Navigation Arrows */}
          <button
            type="button"
            aria-label="Previous Gallery Photo"
            onClick={() => setGalleryActiveIndex((prev) => (prev - 1 + displayedGallery.length) % displayedGallery.length)}
            className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-[#0A7A74]" />
          </button>
          <button
            type="button"
            aria-label="Next Gallery Photo"
            onClick={() => setGalleryActiveIndex((prev) => (prev + 1) % displayedGallery.length)}
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-[#0A7A74]" />
          </button>

          {/* Cards 3D Stage */}
          <div className="relative w-full h-full flex items-center justify-center [perspective:1200px]">
            {displayedGallery.map((item, idx) => {
              const n = displayedGallery.length;
              let offset = idx - galleryActiveIndex;
              if (offset < -Math.floor(n / 2)) {
                offset += n;
              } else if (offset > Math.floor((n - 1) / 2)) {
                offset -= n;
              }

              const isMiddle = offset === 0;
              const isLeft = offset === -1;
              const isRight = offset === 1;
              const isVisible = isMiddle || isLeft || isRight;

              // Compute smooth transform, 3D perspective and depth
              let transformStyle = '';
              let opacityStyle = 0;
              let zIndexStyle = 0;

              if (isMiddle) {
                transformStyle = 'translateX(0%) scale(1.05) translateZ(35px)';
                opacityStyle = 1;
                zIndexStyle = 30;
              } else if (isLeft) {
                transformStyle = 'translateX(-72%) scale(0.85) perspective(1000px) rotateY(10deg)';
                opacityStyle = 0.65;
                zIndexStyle = 20;
              } else if (isRight) {
                transformStyle = 'translateX(72%) scale(0.85) perspective(1000px) rotateY(-10deg)';
                opacityStyle = 0.65;
                zIndexStyle = 20;
              } else {
                transformStyle = `translateX(${offset > 0 ? 140 : -140}%) scale(0.7)`;
                opacityStyle = 0;
                zIndexStyle = 0;
              }

              return (
                <div
                  key={item._id || item.id || idx}
                  onClick={() => {
                    if (isMiddle) {
                      setLightboxPhoto(item);
                    } else if (isLeft) {
                      setGalleryActiveIndex((prev) => (prev - 1 + n) % n);
                    } else if (isRight) {
                      setGalleryActiveIndex((prev) => (prev + 1) % n);
                    }
                  }}
                  style={{
                    transform: transformStyle,
                    opacity: opacityStyle,
                    zIndex: zIndexStyle,
                    transition: 'transform 700ms cubic-bezier(0.25, 1, 0.5, 1), opacity 700ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 500ms ease'
                  }}
                  className={`absolute w-[86%] xs:w-[80%] sm:w-[56%] md:w-[46%] lg:w-[40%] max-w-lg h-[240px] xs:h-[270px] sm:h-[340px] md:h-[390px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl select-none group ${
                    isMiddle
                      ? 'shadow-2xl ring-4 ring-[#0A7A74]/25 cursor-pointer pointer-events-auto'
                      : isVisible
                      ? 'shadow-lg border border-slate-200/80 cursor-pointer hover:opacity-90 pointer-events-auto'
                      : 'pointer-events-none'
                  }`}
                >
                  <img
                    src={item.image}
                    alt="Brahm Shakti Hospital Gallery"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {displayedGallery.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to photo ${idx + 1}`}
                onClick={() => setGalleryActiveIndex(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  idx === galleryActiveIndex
                    ? 'w-7 h-2.5 bg-[#0A7A74]'
                    : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Lightbox Modal - Pure High-Res Photo View */}
        {lightboxPhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setLightboxPhoto(null)}
          >
            <div
              className="bg-black/90 rounded-3xl overflow-hidden max-w-4xl max-h-[88vh] w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex items-center justify-center border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close photo preview"
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center z-20 transition-colors cursor-pointer border border-white/20 hover:scale-105"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full max-h-[88vh] flex items-center justify-center p-2 sm:p-4">
                <img
                  src={lightboxPhoto.image}
                  alt="Brahm Shakti Hospital Gallery Full View"
                  className="w-full h-auto max-h-[84vh] object-contain rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Official Hospital Circular / Patient Advisory Modal */}
        {selectedNoticeModal && (
          <div
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedNoticeModal(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[88vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedNoticeModal.refNumber && (
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                        {selectedNoticeModal.refNumber}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-teal-50 text-[#0A7A74] border border-teal-200/60">
                      {selectedNoticeModal.category}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug pt-1">
                    {selectedNoticeModal.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedNoticeModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0A7A74]" />
                  <span>Date: {selectedNoticeModal.date}</span>
                </span>
                <span>•</span>
                <span>Issued by: {selectedNoticeModal.author || 'Brahm Shakti Hospital Administration'}</span>
              </div>

              {/* Official notification text */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedNoticeModal.content || selectedNoticeModal.summary}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Brahm Shakti Hospital · Budh Vihar, Delhi 110085
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedNoticeModal(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close Notice
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 9. Frequently Asked Questions Section */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0A7A74] text-center mb-8 tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="max-w-4xl mx-auto space-y-3.5">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
                >
                  <span className="text-sm sm:text-base font-bold text-[#0B2545]">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#0A7A74]/10 text-[#0A7A74]' : 'text-slate-400'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Modals triggered from Max Healthcare cards */}
      <InternationalModal
        isOpen={internationalModalOpen}
        onClose={() => setInternationalModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
