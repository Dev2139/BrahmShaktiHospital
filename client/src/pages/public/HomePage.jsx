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
  Megaphone,
  Info,
  ListFilter,
  Check,
  Printer,
  Bed,
  Scissors,
  Eye,
  Baby
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { InternationalModal } from '../../components/InternationalModal';
import { departmentsData, doctorsData } from '../../data/seedData';

const DEPT_ICON_MAP = {
  medicine: Stethoscope,
  'general-surgery': Scissors,
  surgery: Scissors,
  orthopaedics: Activity,
  orthopedics: Activity,
  eye: Eye,
  ophthalmology: Eye,
  'gynae-obst': Baby,
  gynecology: Baby,
  pediatrics: Baby,
  cardiology: HeartPulse,
  ent: Activity,
  skin: Droplets,
  dermatology: Droplets,
  anesthesia: Activity
};

const DEPT_SHORT_NAME_MAP = {
  medicine: 'Medicine',
  'general-surgery': 'Surgery',
  surgery: 'Surgery',
  orthopaedics: 'Ortho',
  orthopedics: 'Ortho',
  eye: 'Eye',
  ophthalmology: 'Eye',
  'gynae-obst': 'Gynae',
  gynecology: 'Gynae',
  pediatrics: 'Pediatrics',
  cardiology: 'Cardiology',
  ent: 'ENT',
  skin: 'Dermatology',
  dermatology: 'Dermatology',
  anesthesia: 'Anesthesia'
};

const DEPARTMENT_CLINICAL_HIGHLIGHTS = {
  medicine: {
    faculty: 'Dr. S.K. Goyal (MD) · Dr. Vineet Mittal (MD)',
    location: 'Block A, 1st Floor',
    procedures: [
      'Comprehensive Diabetology & Insulin Titration',
      'Hypertension & Cardiovascular Risk Management',
      'Fever & Pyrexia of Unknown Origin (PUO) Triage'
    ]
  },
  'general-surgery': {
    faculty: 'Dr. Sanjeev Verma (MS) · Dr. Rishabh Jain',
    location: 'Surgical Block, 2nd Floor',
    procedures: [
      'Laparoscopic Cholecystectomy (Gallbladder)',
      'Laser Proctology for Piles, Fissure & Fistula',
      'Keyhole Inguinal & Umbilical Hernia Repair'
    ]
  },
  'gynae-obst': {
    faculty: 'Dr. Manisha Jain · Dr. Renu Gupta',
    location: 'Mother & Child Wing, 3rd Floor',
    procedures: [
      'Painless Normal & Caesarean (LSCS) Deliveries',
      'High-Risk Pregnancy & Ante-Natal Care (ANC)',
      'Laparoscopic Hysterectomy & Ovarian Cyst Surgery'
    ]
  },
  gynecology: {
    faculty: 'Dr. Manisha Jain · Dr. Renu Gupta',
    location: 'Mother & Child Wing, 3rd Floor',
    procedures: [
      'Painless Normal & Caesarean (LSCS) Deliveries',
      'High-Risk Pregnancy & Ante-Natal Care (ANC)',
      'Laparoscopic Hysterectomy & Ovarian Cyst Surgery'
    ]
  },
  pediatrics: {
    faculty: 'Dr. Rupesh',
    location: 'Mother & Child Wing, 2nd Floor',
    procedures: [
      'Level-III NICU Neonatal Critical Care & Incubators',
      'Preterm Low Birth Weight Resuscitation',
      'Complete Pediatric Immunization & Growth Tracking'
    ]
  },
  orthopaedics: {
    faculty: 'Dr. Kapil Goyal (DNB) · Dr. Dinesh Chand Sharma · Dr. Ravi Shankar Gupta',
    location: 'Ortho Spine Wing, 1st Floor',
    procedures: [
      'Total Knee Replacement (TKR) & Hip Arthroplasty',
      'Arthroscopic ACL & Meniscal Ligament Repair',
      'Complex Fracture & Trauma Stabilization'
    ]
  },
  orthopedics: {
    faculty: 'Dr. Kapil Goyal (DNB) · Dr. Dinesh Chand Sharma · Dr. Ravi Shankar Gupta',
    location: 'Ortho Spine Wing, 1st Floor',
    procedures: [
      'Total Knee Replacement (TKR) & Hip Arthroplasty',
      'Arthroscopic ACL & Meniscal Ligament Repair',
      'Complex Fracture & Trauma Stabilization'
    ]
  },
  eye: {
    faculty: 'Dr. Manvi Aggarwal · Dr. Monika Kumawat',
    location: 'Eye Care OPD, 1st Floor',
    procedures: [
      'Stitchless MICS Micro-Phaco Cataract Surgery',
      'Glaucoma Screening, Tonometry & Laser Iridotomy',
      'Diabetic Retinopathy Screening & Fundus Evaluation'
    ]
  },
  ophthalmology: {
    faculty: 'Dr. Manvi Aggarwal · Dr. Monika Kumawat',
    location: 'Eye Care OPD, 1st Floor',
    procedures: [
      'Stitchless MICS Micro-Phaco Cataract Surgery',
      'Glaucoma Screening, Tonometry & Laser Iridotomy',
      'Diabetic Retinopathy Screening & Fundus Evaluation'
    ]
  },
  skin: {
    faculty: 'Dr. Swati Gupta · Dr. Avnish Goyal',
    location: 'Dermatology OPD, 1st Floor',
    procedures: [
      'Laser Resurfacing for Acne Scars & Hyperpigmentation',
      'Radiofrequency Mole, Wart & Skin Tag Excision',
      'Chronic Psoriasis & Eczema Immunotherapy'
    ]
  },
  ent: {
    faculty: 'Dr. Manju Bansal · Dr. Hitesh Aggarwal',
    location: 'ENT OPD, 1st Floor',
    procedures: [
      'Micro-Ear Surgery (Tympanoplasty & Mastoidectomy)',
      'Endoscopic Sinus Surgery (FESS)',
      'Coblation Tonsillectomy & Adenoidectomy'
    ]
  },
  anesthesia: {
    faculty: 'Dr. Sunil (Senior Consultant Anesthesiology)',
    location: 'ICU & Operation Complex',
    procedures: [
      'Critical Care & Mechanical Ventilation Management',
      'Advanced Cardiac Life Support (ACLS)',
      'Post-Operative Acute Pain Management'
    ]
  }
};

const HERO_BANNER_IMAGES = [
  {
    url: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795514685/Brahm_Shakti_Advancing_Healthcare_Research.png',
    alt: 'Advancing Better Healthcare Through Knowledge - Brahm Shakti Hospital'
  },
  {
    url: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795514679/Brahm_Shakti_Hospital_Healthcare_Banner.png',
    alt: 'Healthcare Excellence - Brahm Shakti Hospital'
  },
  {
    url: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795514697/Brahm_Shakti_Hospital_Advanced_Care.png',
    alt: 'Advanced Clinical Care - Brahm Shakti Hospital'
  },
  {
    url: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795514695/Brahm_Shakti_Hospital_Hero_Banner.png',
    alt: 'Brahm Shakti Hospital & Research Centre'
  },
  {
    url: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795179941/Proud_Indian_Flag_Group_Portrait.png',
    alt: 'Proud Indian Flag Group Portrait'
  }
];

const CLINICAL_DISCIPLINES = [
  { id: 'all', label: 'All 9 Departments' },
  { id: 'medicine', label: 'Medicine', deptIds: ['medicine'] },
  { id: 'general-surgery', label: 'Surgery', deptIds: ['general-surgery', 'surgery'] },
  { id: 'orthopaedics', label: 'Ortho', deptIds: ['orthopaedics', 'orthopedics'] },
  { id: 'eye', label: 'Eye', deptIds: ['eye', 'ophthalmology'] },
  { id: 'gynae-obst', label: 'Gynae & Obs', deptIds: ['gynae-obst', 'gynecology'] },
  { id: 'skin', label: 'Skin', deptIds: ['skin'] },
  { id: 'ent', label: 'ENT', deptIds: ['ent'] },
  { id: 'pediatrics', label: 'Pediatric', deptIds: ['pediatrics'] },
  { id: 'anesthesia', label: 'Anesthesia', deptIds: ['anesthesia'] }
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
DATE OF ISSUANCE: 05th November 2026
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
    date: '2026-11-05',
    isPinned: true,
    isNewBadge: true,
    status: 'published',
    author: 'Medical Superintendent Office',
    readTime: '2 min read',
    highlights: [
      'Special respiratory care desk in Block A',
      'Daily nebulization & pulse oximetry',
      'Senior physician consultation at subsidized rates'
    ]
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
    readTime: '3 min read',
    highlights: [
      '24x7 Ayushman Mitra helpdesk at Counter 2',
      'Digital pre-authorization initiated in under 45 mins',
      'Cashless surgical and intensive care admissions'
    ]
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
    author: 'OPD Administration',
    readTime: '2 min read',
    highlights: [
      'Morning Session: 09:30 AM to 01:30 PM (Mon - Sat)',
      'Evening Session: 04:30 PM to 07:30 PM (Mon - Sat)',
      '24x7 Emergency Casualty & Trauma Ward active continuously'
    ]
  },
  {
    id: 'notice-patient-04',
    title: 'Health Camp — Free Checkup Camp for Senior Citizens',
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
    author: 'Community Health Department',
    readTime: '2 min read',
    highlights: [
      'Free blood glucose, HbA1c screening & BP checkup',
      'Specialized geriatric consultation with zero registration fees',
      'Free nutrition & healthy aging diet counseling'
    ]
  },
  {
    id: 'notice-patient-05',
    title: 'Vaccination Drive — Seasonal Flu (Children & Elderly)',
    summary: 'Annual quadrivalent influenza vaccination protection drive initiated for pediatric visitors and senior citizens at subsidized trust rates.',
    content: `CIRCULAR REF: BSH/VAC/2026/077
DATE OF ISSUANCE: 08th November 2026
ISSUED BY: Public Health Cell, Brahm Shakti Hospital

To protect vulnerable demographics against seasonal respiratory influenza and secondary respiratory infections, Brahm Shakti Hospital announces its Annual Flu Immunization Drive.

Key Information:
- Recommended for all infants 6 months+, school-aged children, and senior citizens aged 60+.
- Administered daily in the Immunization Suite (OPD Room 108).
- Subsidized trust charges applied. No appointment fee.`,
    category: 'Patient Advisory',
    refNumber: 'BSH/VAC/2026/077',
    audience: 'patients',
    date: '2026-11-08',
    isPinned: false,
    isNewBadge: false,
    status: 'published',
    author: 'Public Health Cell',
    readTime: '2 min read',
    highlights: [
      'Quadrivalent seasonal influenza vaccine administration',
      'Dedicated immunization room for pediatric visitors',
      'Special subsidized welfare tariff for elderly citizens'
    ]
  }
];

// Beautiful SVG artwork featuring Lungs & Stethoscope for the Key Highlights container
const LungsStethoscopeArtwork = ({ className = 'w-36 h-36' }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="lungLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5EEAD4" />
        <stop offset="60%" stopColor="#0DAFD5" />
        <stop offset="100%" stopColor="#018AAE" />
      </linearGradient>
      <linearGradient id="lungRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#5EEAD4" />
        <stop offset="60%" stopColor="#0DAFD5" />
        <stop offset="100%" stopColor="#018AAE" />
      </linearGradient>
      <linearGradient id="stethTube" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0F172A" />
        <stop offset="50%" stopColor="#018AAE" />
        <stop offset="100%" stopColor="#042F2E" />
      </linearGradient>
      <linearGradient id="stethChrome" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#CBD5E1" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
    </defs>

    {/* Background Soft Glow */}
    <circle cx="100" cy="100" r="75" fill="#CEF5FA" fillOpacity="0.75" />

    {/* Trachea (Windpipe) */}
    <path
      d="M100 35 L100 68"
      stroke="#018AAE"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <line x1="95" y1="42" x2="105" y2="42" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="95" y1="49" x2="105" y2="49" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="95" y1="56" x2="105" y2="56" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

    {/* Left Bronchus & Lobe */}
    <path
      d="M100 68 C88 78 72 75 62 82 C48 93 42 118 48 138 C53 154 68 162 84 152 C94 145 98 128 98 108 C98 90 98 78 100 68 Z"
      fill="url(#lungLeftGrad)"
      opacity="0.9"
    />
    <path
      d="M88 88 C78 98 70 115 72 132"
      stroke="#FFFFFF"
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity="0.45"
    />
    <path
      d="M78 108 C68 114 62 124 64 135"
      stroke="#FFFFFF"
      strokeWidth="1.4"
      strokeLinecap="round"
      opacity="0.35"
    />

    {/* Right Bronchus & Lobe */}
    <path
      d="M100 68 C112 78 128 75 138 82 C152 93 158 118 152 138 C147 154 132 162 116 152 C106 145 102 128 102 108 C102 90 102 78 100 68 Z"
      fill="url(#lungRightGrad)"
      opacity="0.9"
    />
    <path
      d="M112 88 C122 98 130 115 128 132"
      stroke="#FFFFFF"
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity="0.45"
    />
    <path
      d="M122 108 C132 114 138 124 136 135"
      stroke="#FFFFFF"
      strokeWidth="1.4"
      strokeLinecap="round"
      opacity="0.35"
    />

    {/* Stethoscope Tubing coiled around Lungs */}
    <path
      d="M85 140 C85 172 120 182 145 165 C162 152 162 135 150 120"
      stroke="url(#stethTube)"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />

    {/* Stethoscope Chest Piece */}
    <circle cx="152" cy="118" r="9" fill="url(#stethChrome)" stroke="#0F172A" strokeWidth="1.5" />
    <circle cx="152" cy="118" r="5" fill="#018AAE" />
    <circle cx="152" cy="118" r="2" fill="#FFFFFF" />

    {/* Medical Cross Accent */}
    <g opacity="0.35" transform="translate(160, 48)">
      <rect x="4" y="0" width="3" height="11" rx="1.5" fill="#018AAE" />
      <rect x="0" y="4" width="11" height="3" rx="1.5" fill="#018AAE" />
    </g>
  </svg>
);

// Cleanly parses administrative circular text into structured, elegant document sections
const parseCircularContent = (rawText) => {
  if (!rawText) return { intro: '', items: [], outro: '' };

  const rawLines = rawText.split('\n');
  const filteredLines = [];

  for (const line of rawLines) {
    const trimmed = line.trim();
    // Exclude redundant header meta lines already displayed in the official memo bar
    if (
      trimmed.startsWith('CIRCULAR REF:') ||
      trimmed.startsWith('DATE OF ISSUANCE:') ||
      trimmed.startsWith('ISSUED BY:')
    ) {
      continue;
    }
    filteredLines.push(line);
  }

  const cleanText = filteredLines.join('\n').trim();
  const paragraphs = cleanText.split(/\n\s*\n/);
  let intro = '';
  const items = [];
  let outro = '';

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // Check if paragraph contains list items (numbered 1. or bullets - / *)
    const lines = trimmed.split('\n');
    const hasListItems = lines.some((l) => /^\s*(\d+\.|\-|\*)\s+/.test(l));

    if (hasListItems) {
      for (const line of lines) {
        const lTrim = line.trim();
        const numMatch = lTrim.match(/^(\d+)\.\s*(.+)$/);
        const bulletMatch = lTrim.match(/^[-*]\s*(.+)$/);

        if (numMatch) {
          const full = numMatch[2].trim();
          const colonIdx = full.indexOf(':');
          if (colonIdx !== -1) {
            items.push({
              title: full.slice(0, colonIdx).trim(),
              desc: full.slice(colonIdx + 1).trim()
            });
          } else {
            items.push({
              title: full,
              desc: ''
            });
          }
        } else if (bulletMatch) {
          const full = bulletMatch[1].trim();
          const colonIdx = full.indexOf(':');
          if (colonIdx !== -1) {
            items.push({
              title: full.slice(0, colonIdx).trim(),
              desc: full.slice(colonIdx + 1).trim()
            });
          } else {
            items.push({
              title: full,
              desc: ''
            });
          }
        }
      }
    } else if (!intro) {
      if (/^(Key\s+[A-Za-z\s]+|Beneficiary\s+Guidelines|Guidelines|Operational\s+Highlights):?$/i.test(trimmed)) {
        continue;
      }
      intro = trimmed;
    } else {
      if (/^(Key\s+[A-Za-z\s]+|Beneficiary\s+Guidelines|Guidelines|Operational\s+Highlights):?$/i.test(trimmed)) {
        continue;
      }
      outro = outro ? `${outro}\n\n${trimmed}` : trimmed;
    }
  }

  return { intro, items, outro };
};

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
  const [activeDeptId, setActiveDeptId] = useState('medicine');

  // Hero banner slider state & auto-play
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  // Mobile doctor carousel state & touch handlers
  const [mobileDoctorIndex, setMobileDoctorIndex] = useState(0);
  const docTouchStartX = React.useRef(0);
  const docTouchEndX = React.useRef(0);

  const handleDocTouchStart = (e) => {
    docTouchStartX.current = e.targetTouches[0].clientX;
  };
  const handleDocTouchMove = (e) => {
    docTouchEndX.current = e.targetTouches[0].clientX;
  };
  const handleDocTouchEnd = () => {
    const diff = docTouchStartX.current - docTouchEndX.current;
    const docCount = doctors.length || 1;
    if (diff > 40) {
      setMobileDoctorIndex((prev) => (prev + 1) % docCount);
    } else if (diff < -40) {
      setMobileDoctorIndex((prev) => (prev - 1 + docCount) % docCount);
    }
  };

  const handlePrevMobileDoc = () => {
    const docCount = doctors.length || 1;
    setMobileDoctorIndex((prev) => (prev - 1 + docCount) % docCount);
  };
  const handleNextMobileDoc = () => {
    const docCount = doctors.length || 1;
    setMobileDoctorIndex((prev) => (prev + 1) % docCount);
  };

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
    }, 5500);
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
  const [selectedNoticeId, setSelectedNoticeId] = useState('notice-patient-01');
  const [announcementPageIndex, setAnnouncementPageIndex] = useState(0);
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

  // Prevent background scrolling while notice circular modal is open
  useEffect(() => {
    if (selectedNoticeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedNoticeModal]);

  // Dedicated Print Function for Single Official Circular (Prints ONLY this circular on official hospital letterhead)
  const handlePrintCircular = (notice) => {
    if (!notice) return;
    const parsed = parseCircularContent(notice.content || notice.summary);
    const formattedDate = notice.date
      ? new Date(notice.date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      : '01 Nov 2026';

    const highlights = notice.highlights && notice.highlights.length > 0 ? notice.highlights : [];

    let iframe = document.getElementById('bsh-circular-print-frame');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'bsh-circular-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentWindow || iframe.contentDocument;
    const docObj = doc.document || doc;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>${notice.refNumber || 'Circular'} - Brahm Shakti Hospital</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 14mm 14mm 14mm 14mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #0f172a;
            background: #ffffff;
            font-size: 12.5px;
            line-height: 1.5;
            padding: 0;
          }
          .letterhead-container {
            border-bottom: 2.5px solid #018AAE;
            padding-bottom: 12px;
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .hosp-logo-wrap {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .hosp-logo {
            height: 52px;
            width: auto;
            object-fit: contain;
          }
          .hosp-name {
            font-size: 17px;
            font-weight: 800;
            color: #0B2545;
            letter-spacing: -0.2px;
            text-transform: uppercase;
          }
          .hosp-tag {
            font-size: 10px;
            font-weight: 700;
            color: #018AAE;
            letter-spacing: 0.3px;
          }
          .hosp-campus {
            font-size: 9.5px;
            color: #64748b;
            margin-top: 2px;
          }
          .accred-box {
            text-align: right;
            border: 1px solid #73E0EF;
            background: #F0FBFC;
            padding: 6px 12px;
            border-radius: 6px;
          }
          .accred-badge {
            font-size: 10.5px;
            font-weight: 800;
            color: #015B73;
          }
          .accred-sub {
            font-size: 8.5px;
            color: #64748b;
            font-weight: 600;
          }
          .bulletin-bar {
            background: #018AAE;
            color: #ffffff;
            text-align: center;
            padding: 6px 12px;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.6px;
            text-transform: uppercase;
            border-radius: 4px;
            margin-bottom: 14px;
          }
          .meta-grid {
            display: table;
            width: 100%;
            margin-bottom: 14px;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            border-collapse: collapse;
          }
          .meta-row {
            display: table-row;
          }
          .meta-cell {
            display: table-cell;
            padding: 6px 10px;
            font-size: 11.5px;
            border: 1px solid #e2e8f0;
          }
          .meta-label {
            font-weight: 700;
            color: #475569;
            background: #f8fafc;
            width: 18%;
          }
          .meta-val {
            font-weight: 600;
            color: #0f172a;
          }
          .target-banner {
            background: #f8fafc;
            border-left: 3px solid #018AAE;
            padding: 6px 12px;
            font-size: 11px;
            font-weight: 700;
            color: #334155;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin-bottom: 14px;
            border-radius: 0 4px 4px 0;
          }
          .circular-subject {
            font-size: 16px;
            font-weight: 800;
            color: #0B2545;
            line-height: 1.35;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e2e8f0;
          }
          .content-intro {
            font-size: 12px;
            color: #334155;
            line-height: 1.6;
            margin-bottom: 14px;
            text-align: justify;
          }
          .section-title {
            font-size: 11px;
            font-weight: 800;
            color: #018AAE;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 14px 0 8px 0;
          }
          .highlights-box {
            background: #F0FBFC;
            border: 1px solid #B6EEF6;
            border-radius: 6px;
            padding: 10px 14px;
            margin-bottom: 14px;
          }
          .highlight-row {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 6px;
            font-size: 11.5px;
            font-weight: 600;
            color: #0f172a;
          }
          .highlight-row:last-child {
            margin-bottom: 0;
          }
          .check-mark {
            color: #018AAE;
            font-weight: 800;
          }
          .item-card {
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 8px 12px;
            margin-bottom: 8px;
            background: #fbfcfd;
          }
          .item-title {
            font-weight: 700;
            color: #0f172a;
            font-size: 11.5px;
            margin-bottom: 2px;
          }
          .item-desc {
            font-size: 11px;
            color: #475569;
            line-height: 1.45;
          }
          .content-outro {
            font-size: 11.5px;
            color: #475569;
            line-height: 1.5;
            margin-bottom: 14px;
          }
          .auth-box {
            margin-top: 20px;
            padding-top: 12px;
            border-top: 1.5px dashed #cbd5e1;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .helpline-info {
            font-size: 10.5px;
            color: #64748b;
          }
          .helpline-info strong {
            color: #018AAE;
            font-size: 11.5px;
            display: block;
            margin-top: 2px;
          }
          .signoff-seal-wrap {
            text-align: right;
          }
          .seal-stamp {
            display: inline-block;
            border: 1.5px solid #018AAE;
            color: #018AAE;
            font-weight: 800;
            font-size: 9px;
            letter-spacing: 0.5px;
            padding: 3px 8px;
            border-radius: 4px;
            text-transform: uppercase;
            margin-bottom: 4px;
          }
          .auth-name {
            font-size: 11px;
            font-weight: 800;
            color: #0B2545;
          }
          .auth-dept {
            font-size: 9.5px;
            color: #64748b;
          }
          .doc-foot {
            margin-top: 16px;
            font-size: 8.5px;
            color: #94a3b8;
            text-align: center;
            border-top: 1px solid #f1f5f9;
            padding-top: 6px;
          }
        </style>
      </head>
      <body>
        <div class="letterhead-container">
          <div class="hosp-logo-wrap">
            <img src="https://res.cloudinary.com/urzka7oz/image/upload/v1795244093/WhatsApp_Image_2026-11-20_at_10.36.32_PM-removebg-preview.png" class="hosp-logo" alt="Brahm Shakti Hospital" />
            <div>
              <div class="hosp-name">Brahm Shakti Hospital &amp; Research Centre</div>
              <div class="hosp-tag">NABH &amp; NABL ACCREDITED TERTIARY HEALTHCARE INSTITUTION</div>
              <div class="hosp-campus">Pocket C, B-Block, NIT-3 Phase-1, Budh Vihar, Rohini, New Delhi - 110085 · Tel: 011-27531683, 7840089703</div>
            </div>
          </div>
          <div class="accred-box">
            <div class="accred-badge">NABH &amp; NABL</div>
            <div class="accred-sub">Quality Certified</div>
          </div>
        </div>

        <div class="bulletin-bar">Official Administrative Circular &amp; Public Health Bulletin</div>

        <div class="meta-grid">
          <div class="meta-row">
            <div class="meta-cell meta-label">Ref. Number:</div>
            <div class="meta-cell meta-val">${notice.refNumber || 'BSH/SAF/2026/001'}</div>
            <div class="meta-cell meta-label">Date of Issue:</div>
            <div class="meta-cell meta-val">${formattedDate}</div>
          </div>
          <div class="meta-row">
            <div class="meta-cell meta-label">Classification:</div>
            <div class="meta-cell meta-val">${notice.category || 'Statutory Notice'}</div>
            <div class="meta-cell meta-label">Issued By:</div>
            <div class="meta-cell meta-val">${notice.author || 'Hospital Quality Directorate'}</div>
          </div>
        </div>

        <div class="target-banner">Target Audience: All Staff, Patients, Medical Officers and Visitors</div>

        <div class="circular-subject">${notice.title}</div>

        ${parsed.intro ? `<div class="content-intro">${parsed.intro}</div>` : ''}

        ${
          highlights.length > 0
            ? `
              <div class="section-title">Key Directives &amp; Advisory Highlights</div>
              <div class="highlights-box">
                ${highlights.map(hl => `
                  <div class="highlight-row">
                    <span class="check-mark">✓</span>
                    <span>${hl}</span>
                  </div>
                `).join('')}
              </div>
            `
            : ''
        }

        ${
          parsed.items && parsed.items.length > 0
            ? `
              <div class="section-title">Operational Guidelines &amp; Directives</div>
              <div>
                ${parsed.items.map((it, idx) => `
                  <div class="item-card">
                    <div class="item-title">${idx + 1}. ${it.title}</div>
                    ${it.desc ? `<div class="item-desc">${it.desc}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            `
            : ''
        }

        ${parsed.outro ? `<div class="content-outro">${parsed.outro}</div>` : ''}

        <div class="auth-box">
          <div class="helpline-info">
            <div>Patient Assistance &amp; 24x7 Emergency Casualty:</div>
            <strong>011-27531683 · 7840089703</strong>
            <div>Budh Vihar Main Campus, Delhi</div>
          </div>
          <div class="signoff-seal-wrap">
            <div class="seal-stamp">Verified Administrative Record</div>
            <div class="auth-name">${notice.author || 'Directorate of Clinical Governance'}</div>
            <div class="auth-dept">Brahm Shakti Hospital &amp; Research Centre</div>
          </div>
        </div>

        <div class="doc-foot">
          Official Institutional Bulletin · Computer generated verified administrative circular · Brahm Shakti Hospital
        </div>
      </body>
      </html>
    `;

    docObj.open();
    docObj.write(htmlContent);
    docObj.close();

    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) {
        console.error('Print iframe error:', e);
      }
    }, 400);
  };

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
    <div className="min-h-screen bg-[#F0FBFC] pb-8 sm:pb-12">
      {/* 1. Hero Section - Seamless Full Hospital Banner Carousel */}
      <section
        className="relative w-full overflow-hidden p-0 m-0 select-none touch-pan-y bg-[#F0FBFC]"
        onTouchStart={handleHeroTouchStart}
        onTouchMove={handleHeroTouchMove}
        onTouchEnd={handleHeroTouchEnd}
      >
        <div className="relative w-full overflow-hidden p-0 m-0 leading-none">
          {/* Active slide rendered directly as responsive image so top is never cut or clipped */}
          <div className="relative w-full overflow-hidden">
            <img
              src={HERO_BANNER_IMAGES[heroSlideIndex]?.url || HERO_BANNER_IMAGES[0].url}
              alt={HERO_BANNER_IMAGES[heroSlideIndex]?.alt || 'Brahm Shakti Hospital'}
              className="w-full h-auto block object-contain object-top select-none m-0 p-0 transition-opacity duration-500"
              loading="eager"
            />
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            aria-label="Previous Slide"
            onClick={() => setHeroSlideIndex((prev) => (prev - 1 + HERO_BANNER_IMAGES.length) % HERO_BANNER_IMAGES.length)}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs shadow-md hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            type="button"
            aria-label="Next Slide"
            onClick={() => setHeroSlideIndex((prev) => (prev + 1) % HERO_BANNER_IMAGES.length)}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs shadow-md hover:scale-105"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-5 sm:bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5 bg-black/40 backdrop-blur-md px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20 shadow-md">
            {HERO_BANNER_IMAGES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setHeroSlideIndex(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  idx === heroSlideIndex
                    ? 'w-6 sm:w-7 h-2 sm:h-2.5 bg-white shadow-xs'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/60 hover:bg-white/90'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="space-y-6 sm:space-y-8 lg:space-y-10">

      {/* 2. Our Doctor Team - Seamlessly Blended with #F0FBFC Background */}
      <section className="bg-[#F0FBFC] pt-2 pb-10 sm:pb-14 border-b-0">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Section Header: Centered on Mobile, Row on Desktop */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="text-center sm:text-left">
              <div className="flex justify-center sm:justify-start">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FA] border border-[#73E0EF]/60 text-[#018AAE] text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2 shadow-2xs">
                  <Stethoscope className="w-3.5 h-3.5 text-[#018AAE]" />
                  <span>EXPERT HEALTHCARE PROFESSIONALS</span>
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0B2545] tracking-tight">
                Our Doctor Team
              </h2>
              <div className="w-14 h-1 bg-[#018AAE] rounded-full mx-auto sm:hidden mt-2 mb-2" />
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm sm:max-w-2xl mx-auto sm:mx-0 leading-relaxed mt-1">
                Experienced, caring doctors and specialists dedicated to the health and well-being of you and your family.
              </p>
              
              {/* Centered Mobile "View All Doctors" Button */}
              <div className="mt-3.5 flex justify-center sm:hidden">
                <Link
                  to="/doctors"
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#018AAE] bg-white text-[#018AAE] font-bold text-xs hover:bg-[#EBF8FA] transition-colors shadow-2xs"
                >
                  <span>View All Doctors</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Desktop "View All Doctors" Link */}
            <div className="hidden sm:flex items-center justify-end shrink-0">
              <Link
                to="/doctors"
                className="inline-flex items-center gap-1.5 text-primary hover:text-primary-hover font-bold text-sm"
              >
                <span>View All Doctors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* ================= MOBILE VIEW: SINGLE-CARD CAROUSEL (AS SHOWN IN IMAGE) ================= */}
          <div className="sm:hidden mt-5">
            {doctors.length > 0 && (() => {
              const activeDoc = doctors[mobileDoctorIndex] || doctors[0];
              return (
                <div>
                  {/* Doctor Card */}
                  <div
                    className="w-full max-w-[340px] xs:max-w-[360px] mx-auto bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-md flex flex-col justify-between"
                    onTouchStart={handleDocTouchStart}
                    onTouchMove={handleDocTouchMove}
                    onTouchEnd={handleDocTouchEnd}
                  >
                    {/* Photo with In-House & Rating Badges */}
                    <div className="h-64 xs:h-72 w-full overflow-hidden bg-slate-100 relative">
                      <img
                        src={activeDoc.image || '/assets/images/doctor_placeholder.svg'}
                        alt={activeDoc.name}
                        onError={(e) => {
                          e.target.src = '/assets/images/doctor_placeholder.svg';
                        }}
                        className="w-full h-full object-cover object-top"
                      />
                      {/* Top-Right: IN HOUSE Pill Badge */}
                      <div className="absolute top-3 right-3 bg-[#018AAE] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        {activeDoc.category || 'IN HOUSE'}
                      </div>
                      {/* Bottom-Left: Rating Badge */}
                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-bold px-2.5 py-1 rounded-xl shadow-xs flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{activeDoc.rating || 4.9}</span>
                      </div>
                    </div>

                    {/* Doctor Details */}
                    <div className="p-4 xs:p-5 space-y-2">
                      <h3 className="text-base xs:text-lg font-black text-slate-900 leading-tight">
                        {activeDoc.name}
                      </h3>
                      <p className="text-xs font-bold text-[#018AAE] leading-snug line-clamp-2">
                        {activeDoc.designation || activeDoc.speciality || 'Senior Consultant'}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                        {activeDoc.qualification || 'MBBS, MD'}
                      </p>

                      {/* Inline Info: Experience & Fee */}
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-[#018AAE]" />
                          <span>{activeDoc.experienceYears || 15}+ Years</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-700">
                          <span className="font-bold text-[#018AAE]">₹</span>
                          <span className="font-bold">₹{activeDoc.consultationFee || 700}</span>
                          <span className="text-slate-400 text-[11px] font-normal">(Subsidized)</span>
                        </div>
                      </div>

                      {/* Book Appointment Pill Button */}
                      <div className="pt-2">
                        <Link
                          to={`/bookappointment?doctor=${activeDoc.id}&department=${activeDoc.departmentId || 'general'}`}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#018AAE] hover:bg-[#007595] active:scale-[0.99] text-white text-xs font-bold transition-all shadow-sm shadow-[#018AAE]/25"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Book Appointment</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Controls: < Dots > */}
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                      type="button"
                      onClick={handlePrevMobileDoc}
                      className="w-8 h-8 rounded-full border border-[#018AAE]/30 bg-white text-[#018AAE] hover:bg-[#F0FBFC] flex items-center justify-center shadow-2xs cursor-pointer active:scale-95"
                      aria-label="Previous Doctor"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Dots */}
                    <div className="flex items-center gap-1.5">
                      {doctors.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setMobileDoctorIndex(idx)}
                          className={`transition-all rounded-full cursor-pointer ${
                            idx === mobileDoctorIndex
                              ? 'w-5 h-2 bg-[#018AAE]'
                              : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                          }`}
                          aria-label={`Doctor ${idx + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleNextMobileDoc}
                      className="w-8 h-8 rounded-full border border-[#018AAE]/30 bg-white text-[#018AAE] hover:bg-[#F0FBFC] flex items-center justify-center shadow-2xs cursor-pointer active:scale-95"
                      aria-label="Next Doctor"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* ================= DESKTOP / TABLET GRID (hidden on mobile) ================= */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="w-auto bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#0DAFD5] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 sm:h-56 overflow-hidden bg-slate-200 relative">
                    <img
                      src={doctor.image || '/assets/images/doctor_placeholder.svg'}
                      alt={doctor.name}
                      onError={(e) => {
                        e.target.src = '/assets/images/doctor_placeholder.svg';
                      }}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-[#018AAE] text-white backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                      {doctor.category || 'IN HOUSE'}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-bold text-secondary">
                      ★ {doctor.rating || 4.9}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="text-base sm:text-lg font-bold text-secondary leading-tight">{doctor.name}</h3>
                    <p className="text-xs font-semibold text-[#018AAE] mt-1">{doctor.designation}</p>
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
                    to={`/bookappointment?doctor=${doctor.id}&department=${doctor.departmentId || 'general'}`}
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

      {/* 3. Our Departments Section (Redesigned per Reference) */}
      <section className="relative max-w-7xl mx-auto px-4 py-6 sm:py-10 overflow-hidden">
        
        {/* Ambient Medical Cyan Waves in Background (No hospital building image as requested) */}
        <div className="absolute top-0 right-0 w-[550px] h-[350px] pointer-events-none select-none opacity-25 z-0">
          <svg viewBox="0 0 550 350" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M0,0 C180,110 340,60 550,200 L550,0 Z"
              fill="url(#dept-wave-cyan)"
            />
            <defs>
              <linearGradient id="dept-wave-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#CEF5FA" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#0DAFD5" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#018AAE" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Section Header */}
        <div className="relative z-10 mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF8FA] border border-[#73E0EF]/60 text-[#018AAE] text-xs font-black uppercase tracking-wider mb-2 shadow-2xs">
            <Stethoscope className="w-3.5 h-3.5 text-[#018AAE]" />
            <span>SPECIALISED CARE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0B2545] tracking-tight">
            Our Departments
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Comprehensive clinical care across all 9 hospital departments.
          </p>
          <Link
            to="/departments"
            className="inline-flex items-center gap-1.5 text-[#018AAE] font-bold text-xs sm:text-sm mt-1.5 hover:underline"
          >
            <span>Explore all {departments.length || 9}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Main Content: Responsive layout */}
        {(() => {
          const activeDept = departments.find((d) => d.id === activeDeptId) || departments[0] || {};
          const activeDeptHighlights = DEPARTMENT_CLINICAL_HIGHLIGHTS[activeDept.id] || {
            faculty: activeDept.headOfDepartment || 'Senior Medical Faculty',
            location: activeDept.floorLocation || 'Block A, 1st Floor',
            procedures: activeDept.services ? activeDept.services.slice(0, 3) : ['Comprehensive Specialist Evaluation', 'Diagnostic Workup', 'Outpatient Consultation']
          };
          const activeDeptIndex = departments.findIndex((d) => d.id === activeDept.id);
          const displayIndex = activeDeptIndex >= 0 ? activeDeptIndex + 1 : 1;

          return (
            <div className="relative z-10 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
              
              {/* Left Column on Desktop / Top on Mobile: Featured Department */}
              <div className="lg:col-span-7 space-y-3">
                {/* Featured Department Subheading + Counter */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0B2545]">
                    Featured department
                  </h3>
                  <div className="text-xs font-bold text-[#018AAE]">
                    {displayIndex} of {departments.length || 9} &mdash;
                  </div>
                </div>

                {/* Featured Department Card */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden flex flex-col justify-between transition-all">
                  {/* Image with Badges */}
                  <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={activeDept.image || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800'}
                      alt={activeDept.name}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                    {/* Location Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0B2545]/95 text-white backdrop-blur-xs text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#0DAFD5]" />
                      <span>{activeDeptHighlights.location || activeDept.floorLocation || 'BLOCK A, 1ST FLOOR'}</span>
                    </div>

                    {/* Subsidized Fee Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 text-slate-800 backdrop-blur-xs text-xs font-black shadow-xs">
                      ₹{activeDept.consultationCharges || 700} OPD
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-6 space-y-3">
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0B2545] leading-tight">
                      {activeDept.name}
                    </h3>

                    {/* Faculty */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-[#018AAE] font-bold">
                      <Stethoscope className="w-4 h-4 text-[#018AAE] shrink-0" />
                      <span>{activeDeptHighlights.faculty || activeDept.headOfDepartment || 'Senior Medical Faculty'}</span>
                    </div>

                    {/* Key Procedures */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        KEY PROCEDURES
                      </div>
                      {(activeDeptHighlights.procedures || activeDept.services?.slice(0, 3) || []).map((proc, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{proc}</span>
                        </div>
                      ))}
                    </div>

                    {/* OPD Timings & Available Today */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{activeDept.opdTimings || 'Mon - Sat: 09:00 AM - 05:00 PM'}</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                        Available Today
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2">
                      <Link
                        to={`/departments/${activeDept.id}`}
                        className="w-full block py-2.5 sm:py-3 rounded-full border border-slate-300 hover:border-[#0B2545] text-[#0B2545] text-xs sm:text-sm font-bold text-center transition-all bg-white hover:bg-slate-50 shadow-2xs"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column on Desktop / Bottom on Mobile: Browse All Departments & Stats */}
              <div className="lg:col-span-5 space-y-5">
                {/* Browse all departments */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg sm:text-xl font-serif font-black text-[#0B2545] shrink-0">
                      Browse all departments
                    </h3>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-slate-200 to-transparent rounded-full" />
                  </div>

                  {/* 3-column pill grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                    {departments.slice(0, 9).map((dept) => {
                      const isSelected = dept.id === activeDeptId;
                      const IconComp = DEPT_ICON_MAP[dept.id] || Stethoscope;
                      const shortName = DEPT_SHORT_NAME_MAP[dept.id] || dept.name;

                      return (
                        <button
                          key={dept.id}
                          type="button"
                          onClick={() => setActiveDeptId(dept.id)}
                          className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex items-center gap-2 sm:gap-2.5 text-left cursor-pointer ${
                            isSelected
                              ? 'bg-[#F0FBFC] border-[#018AAE] shadow-sm text-[#018AAE] ring-2 ring-[#018AAE]/25'
                              : 'bg-white border-slate-200/90 hover:border-[#0DAFD5] hover:bg-slate-50 text-slate-700 shadow-2xs'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-[#018AAE] text-white' : 'bg-[#EBF8FA] text-[#018AAE]'
                            }`}
                          >
                            <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold truncate">
                            {shortName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4 Compact Metric Badges (250+ Beds, 20+ Consultants, 24/7 Emergency, Subsidized Trust Care) */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 pt-1">
                  {/* 1. 250+ Beds */}
                  <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-3 sm:p-3.5 shadow-2xs hover:shadow-xs transition-all flex items-center gap-2.5 sm:gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#EBF8FA] text-[#018AAE] flex items-center justify-center shrink-0">
                      <Bed className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg sm:text-xl font-black text-[#0B2545] leading-tight">250+</div>
                      <div className="text-[11px] font-semibold text-slate-500 truncate">Beds</div>
                    </div>
                    {/* Wavy bottom right accent */}
                    <div className="absolute -bottom-2 -right-2 w-16 h-7 pointer-events-none opacity-30 select-none">
                      <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                        <path d="M0,50 Q40,10 100,20 L100,50 Z" fill="#0DAFD5" />
                      </svg>
                    </div>
                  </div>

                  {/* 2. 20+ Consultants */}
                  <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-3 sm:p-3.5 shadow-2xs hover:shadow-xs transition-all flex items-center gap-2.5 sm:gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#EBF8FA] text-[#018AAE] flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg sm:text-xl font-black text-[#0B2545] leading-tight">20+</div>
                      <div className="text-[11px] font-semibold text-slate-500 truncate">Consultants</div>
                    </div>
                    {/* Wavy bottom right accent */}
                    <div className="absolute -bottom-2 -right-2 w-16 h-7 pointer-events-none opacity-30 select-none">
                      <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                        <path d="M0,50 Q40,10 100,20 L100,50 Z" fill="#0DAFD5" />
                      </svg>
                    </div>
                  </div>

                  {/* 3. 24/7 Emergency */}
                  <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-3 sm:p-3.5 shadow-2xs hover:shadow-xs transition-all flex items-center gap-2.5 sm:gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#EBF8FA] text-[#018AAE] flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg sm:text-xl font-black text-[#0B2545] leading-tight">24/7</div>
                      <div className="text-[11px] font-semibold text-slate-500 truncate">Emergency</div>
                    </div>
                    {/* Wavy bottom right accent */}
                    <div className="absolute -bottom-2 -right-2 w-16 h-7 pointer-events-none opacity-30 select-none">
                      <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                        <path d="M0,50 Q40,10 100,20 L100,50 Z" fill="#0DAFD5" />
                      </svg>
                    </div>
                  </div>

                  {/* 4. Subsidized Care */}
                  <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-3 sm:p-3.5 shadow-2xs hover:shadow-xs transition-all flex items-center gap-2.5 sm:gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#EBF8FA] text-[#018AAE] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg sm:text-xl font-black text-[#0B2545] leading-tight">Subsidized</div>
                      <div className="text-[11px] font-semibold text-slate-500 truncate">Trust Care</div>
                    </div>
                    {/* Wavy bottom right accent */}
                    <div className="absolute -bottom-2 -right-2 w-16 h-7 pointer-events-none opacity-30 select-none">
                      <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                        <path d="M0,50 Q40,10 100,20 L100,50 Z" fill="#0DAFD5" />
                      </svg>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          );
        })()}

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
      <section id="showcase-section" className="py-8 sm:py-10 bg-[#F0FBFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header & Segmented Switcher Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 sm:mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FBFC] text-[#018AAE] text-xs font-bold uppercase tracking-wider mb-2">
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
                    ? 'bg-[#018AAE] text-white shadow-sm'
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
                    ? 'bg-[#018AAE] text-white shadow-sm'
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
                    ? 'bg-[#018AAE] text-white shadow-sm'
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
                      <span className="px-2.5 py-0.5 rounded-md bg-[#F0FBFC] text-[#018AAE] text-xs font-bold border border-[#B6EEF6]/60">
                        Hospital Outreach
                      </span>
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#018AAE]" />
                        <span>{currentEvent?.date || '2026-10-09'}</span>
                      </div>
                    </div>

                    <Link
                      to={`/events/${currentEvent?.slug || currentEvent?._id}`}
                      className="block text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug hover:text-[#018AAE] transition-colors"
                    >
                      {currentEvent?.title}
                    </Link>

                    {currentEvent?.location && (
                      <div className="flex items-start gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-[#018AAE] shrink-0 mt-0.5" />
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
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#018AAE] hover:bg-[#007595] text-white text-xs sm:text-sm font-bold transition-all shadow-sm group/btn"
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
                            idx === eventSlideIndex ? 'w-6 bg-[#018AAE]' : 'w-1.5 bg-slate-200 hover:bg-slate-300'
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
                      <Clock className="w-3.5 h-3.5 text-[#018AAE]" />
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
                        <span className="w-6 h-6 rounded-md bg-[#F0FBFC] text-[#018AAE] flex items-center justify-center font-bold text-[11px] shrink-0">
                          🚇
                        </span>
                        <span><strong>Nearest Metro:</strong> Rithala Metro (Red Line) &amp; Udyog Nagar (Green Line)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-[#F0FBFC] text-[#018AAE] flex items-center justify-center font-bold text-[11px] shrink-0">
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
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#018AAE] hover:bg-[#007595] text-white text-xs sm:text-sm font-bold transition-all shadow-sm group/btn"
                    >
                      <span>Full Transit &amp; Route Guide</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    <a
                      href="https://maps.google.com/?q=Brahm+Shakti+Hospital+Budh+Vihar+New+Delhi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#018AAE] hover:underline"
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
                    <span className="px-2.5 py-0.5 rounded-md bg-[#F0FBFC] text-[#018AAE] text-xs font-bold border border-[#B6EEF6]/60">
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
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#018AAE] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      to={appointmentTarget}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#018AAE] hover:bg-[#007595] text-white text-xs sm:text-sm font-bold transition-all shadow-sm group/btn"
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
                            idx === facilitySlideIndex ? 'w-6 bg-[#018AAE]' : 'w-1.5 bg-slate-200 hover:bg-slate-300'
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
      <section className="py-6 sm:py-10 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 mb-4 sm:mb-6 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#018AAE] mb-2">
            <Star className="w-4 h-4 fill-[#018AAE]" />
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
                avatarBg: 'bg-[#CEF5FA]',
                avatarText: 'text-[#015B73]',
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
                avatarBg: 'bg-[#CEF5FA]',
                avatarText: 'text-[#015B73]',
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

      {/* 7. Redesigned Hospital Announcements & Public Circulars (Master-Detail Bento Grid) */}
      <section id="news-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F0FBFC] text-[#018AAE] flex items-center justify-center border border-[#B6EEF6]/80 shrink-0">
              <Megaphone className="w-4 h-4 text-[#018AAE]" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Hospital Announcements &amp; Public Circulars
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Official medical orders, health camp circulars, and public health advisories issued by Brahm Shakti Hospital Administration for visiting patients and families.
          </p>
        </div>

        {/* Master-Detail 2-Column Bento Grid */}
        {(() => {
          const selectedNotice =
            patientNewsList.find((n) => (n.id || n._id) === selectedNoticeId) || patientNewsList[0];
          
          const pageSize = 5;
          const totalItems = patientNewsList.length;
          const totalPages = Math.ceil(totalItems / pageSize) || 1;
          const currentSlice = patientNewsList.slice(
            announcementPageIndex * pageSize,
            (announcementPageIndex + 1) * pageSize
          );

          const defaultHighlights = [
            'Special respiratory care desk in Block A',
            'Daily nebulization & pulse oximetry',
            'Senior physician consultation at subsidized rates'
          ];
          const highlights = selectedNotice.highlights && selectedNotice.highlights.length > 0
            ? selectedNotice.highlights
            : defaultHighlights;

          const formattedDate = selectedNotice.date
            ? new Date(selectedNotice.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })
            : '05 Nov 2026';

          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
              {/* ================= LEFT PANEL: SELECTED ANNOUNCEMENT CARD ================= */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-7 flex flex-col justify-between space-y-4">
                <div className="space-y-3.5">
                  {/* Top Badges Row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FBFC] text-[#018AAE] border border-[#B6EEF6]/80 text-xs font-bold shadow-2xs">
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>Selected Announcement</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-[#018AAE]" />
                      <span>Date: {formattedDate}</span>
                    </div>
                  </div>

                  {/* Heading */}
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug tracking-tight">
                    {selectedNotice.title}
                  </h3>

                  {/* Description / Summary */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {selectedNotice.summary || selectedNotice.excerpt}
                  </p>

                  {/* Key Highlights Container with Medical Lungs & Stethoscope Vector */}
                  <div className="bg-[#F0FBFC]/60 border border-[#B6EEF6]/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Bullets List */}
                    <div className="space-y-2.5 z-10 flex-1">
                      <div className="flex items-center gap-1.5 text-xs font-black text-[#018AAE] uppercase tracking-wider pb-0.5">
                        <Info className="w-3.5 h-3.5 text-[#018AAE]" />
                        <span>Key Highlights</span>
                      </div>

                      <div className="space-y-2">
                        {highlights.map((hl, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="w-4 h-4 rounded-full bg-[#018AAE] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className="text-xs font-bold text-slate-800 leading-snug">
                              {hl}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Vector Lungs & Stethoscope Artwork */}
                    <div className="shrink-0 self-center sm:self-auto opacity-95">
                      <LungsStethoscopeArtwork className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xs select-none" />
                    </div>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Building2 className="w-4 h-4 text-[#018AAE] shrink-0" />
                    <span>
                      Issued by: <strong>{selectedNotice.author || 'Medical Superintendent Office'}</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedNoticeModal(selectedNotice)}
                    className="inline-flex items-center gap-1 font-bold text-[#018AAE] hover:underline cursor-pointer self-start sm:self-auto"
                  >
                    <span>Read Full Circular</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ================= RIGHT PANEL: ALL ANNOUNCEMENTS LIST ================= */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col justify-between space-y-3.5">
                {/* Header Row */}
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ListFilter className="w-4 h-4 text-[#018AAE]" />
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      All Announcements
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500">
                      Showing {currentSlice.length} of {totalItems}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Previous circulars"
                        disabled={announcementPageIndex === 0}
                        onClick={() => setAnnouncementPageIndex((prev) => Math.max(0, prev - 1))}
                        className="w-7 h-7 rounded-full border border-slate-200 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center text-slate-600 transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next circulars"
                        disabled={announcementPageIndex >= totalPages - 1}
                        onClick={() => setAnnouncementPageIndex((prev) => Math.min(totalPages - 1, prev + 1))}
                        className="w-7 h-7 rounded-full border border-slate-200 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center text-slate-600 transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* List of Announcements */}
                <div className="space-y-2.5 flex-1">
                  {currentSlice.map((item) => {
                    const isSelected = (item.id || item._id) === (selectedNotice.id || selectedNotice._id);
                    const itemDate = item.date ? new Date(item.date) : new Date();
                    const monthStr = itemDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                    const dayStr = String(itemDate.getDate()).padStart(2, '0');

                    return (
                      <div
                        key={item.id || item._id}
                        onClick={() => setSelectedNoticeId(item.id || item._id)}
                        className={`rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#F0FBFC]/80 border-2 border-[#018AAE] shadow-2xs'
                            : 'bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-[#73E0EF]'
                        }`}
                      >
                        {/* Date Badge */}
                        <div
                          className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border transition-colors ${
                            isSelected
                              ? 'bg-white border-[#B6EEF6] text-[#018AAE]'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className={`text-[10px] font-black uppercase tracking-wider leading-tight ${isSelected ? 'text-[#018AAE]' : 'text-slate-400'}`}>
                            {monthStr}
                          </span>
                          <span className="text-base font-black leading-none mt-0.5">
                            {dayStr}
                          </span>
                        </div>

                        {/* Title & Issuer */}
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <h4
                            className={`text-xs sm:text-sm font-bold line-clamp-2 leading-snug ${
                              isSelected ? 'text-slate-900' : 'text-slate-800'
                            }`}
                          >
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
                            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>Issued by: {item.author || 'Hospital Administration'}</span>
                          </div>
                        </div>

                        {/* Action Status Pill */}
                        <div className="shrink-0">
                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#018AAE] text-white text-[10px] font-black shadow-2xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Selected</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedNoticeId(item.id || item._id);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold text-[#018AAE] hover:bg-[#F0FBFC] transition-colors"
                            >
                              <span>Read Circular</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
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
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-[#018AAE]" />
          </button>
          <button
            type="button"
            aria-label="Next Gallery Photo"
            onClick={() => setGalleryActiveIndex((prev) => (prev + 1) % displayedGallery.length)}
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-[#018AAE]" />
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
                      ? 'shadow-2xl ring-4 ring-[#018AAE]/25 cursor-pointer pointer-events-auto'
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
                    ? 'w-7 h-2.5 bg-[#018AAE]'
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
        {selectedNoticeModal && (() => {
          const parsed = parseCircularContent(selectedNoticeModal.content || selectedNoticeModal.summary);
          const modalFormattedDate = selectedNoticeModal.date
            ? new Date(selectedNoticeModal.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })
            : '05 Nov 2026';

          const highlightsList = selectedNoticeModal.highlights && selectedNoticeModal.highlights.length > 0
            ? selectedNoticeModal.highlights
            : [];

          return (
            <div
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto"
              onClick={() => setSelectedNoticeModal(null)}
            >
              <div
                className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-200 font-sans"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 1. Official Institutional Letterhead Header */}
                <div className="p-4 sm:p-5 md:p-6 bg-slate-50/90 border-b border-slate-200/80 shrink-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#018AAE] text-white flex items-center justify-center shadow-xs shrink-0">
                        <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs sm:text-sm font-black text-[#0B2545] tracking-tight uppercase truncate">
                            Brahm Shakti Hospital &amp; Research Centre
                          </span>
                          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            NABH &amp; NABL Accredited
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                          Official Administrative Circular &amp; Public Health Bulletin · Budh Vihar, Delhi
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedNoticeModal(null)}
                      aria-label="Close Notice"
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-slate-200/80 text-slate-400 hover:text-slate-800 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
                    >
                      <X className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* 2. Scrollable Notice Body */}
                <div className="overflow-y-auto p-4 sm:p-6 md:p-7 space-y-5 text-slate-700">
                  {/* Metadata Banner: Ref ID, Category, Date */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 py-2.5 px-3.5 sm:px-4 rounded-2xl bg-[#F0FBFC]/70 border border-[#B6EEF6]/70">
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedNoticeModal.refNumber && (
                        <span className="text-xs font-bold text-slate-800 bg-white px-3 py-1 rounded-lg border border-[#B6EEF6] shadow-2xs">
                          Ref: {selectedNoticeModal.refNumber}
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#018AAE] text-white shadow-2xs">
                        {selectedNoticeModal.category || 'Patient Advisory'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#018AAE]" />
                        <span>Date: {modalFormattedDate}</span>
                      </span>
                    </div>
                  </div>

                  {/* Title & Department */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#0B2545] tracking-tight leading-snug">
                      {selectedNoticeModal.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium pt-0.5">
                      <Award className="w-3.5 h-3.5 text-[#018AAE]" />
                      <span>
                        Issued by: <strong className="text-slate-700">{selectedNoticeModal.author || 'Hospital Quality Directorate'}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Target Audience Banner */}
                  <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/90 text-xs font-semibold text-slate-700 tracking-wide">
                    <span className="text-slate-500 font-bold uppercase tracking-wider">TARGET AUDIENCE:</span>{' '}
                    <span>All Staff, Patients, Medical Officers and Visitors</span>
                  </div>

                  {/* Executive Overview Paragraph */}
                  {parsed.intro && (
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/70 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80">
                      <p>{parsed.intro}</p>
                    </div>
                  )}

                  {/* Key Highlights Card (Identical in styling to the home page announcement panel) */}
                  {highlightsList.length > 0 && (
                    <div className="bg-[#F0FBFC]/60 border border-[#B6EEF6]/80 rounded-2xl p-4 sm:p-5 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black text-[#018AAE] uppercase tracking-wider">
                        <Info className="w-3.5 h-3.5 text-[#018AAE]" />
                        <span>Key Directives &amp; Advisory Highlights</span>
                      </div>
                      <div className="space-y-2">
                        {highlightsList.map((hl, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <div className="w-4 h-4 rounded-full bg-[#018AAE] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                              {hl}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Structured Guidelines / Operational Facilities Bento Grid */}
                  {parsed.items.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#018AAE]" />
                        <span>Operational Facilities &amp; Beneficiary Guidelines</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {parsed.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl bg-slate-50/90 hover:bg-[#F0FBFC]/40 border border-slate-200/80 hover:border-[#73E0EF] transition-all space-y-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#018AAE]/10 text-[#018AAE] text-xs font-black flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                                {item.title}
                              </span>
                            </div>
                            {item.desc && (
                              <p className="text-xs text-slate-600 leading-relaxed pl-7">
                                {item.desc}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional / Outro Notice Details */}
                  {parsed.outro && (
                    <div className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                      <p>{parsed.outro}</p>
                    </div>
                  )}

                  {/* Official Hospital Seal & Authentication Card */}
                  <div className="p-4 rounded-2xl bg-linear-to-r from-teal-50/40 via-white to-slate-50 border border-[#B6EEF6]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F0FBFC] border border-[#B6EEF6] text-[#018AAE] flex items-center justify-center shrink-0">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#0B2545] uppercase tracking-wide">
                          Verified Administrative Notice
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Signed &amp; Approved by Directorate of Clinical Governance, Brahm Shakti Hospital
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#B6EEF6]/90 text-[#018AAE] text-[11px] font-bold shadow-2xs self-end sm:self-auto">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#018AAE]" />
                      <span>Authorized Circular</span>
                    </div>
                  </div>

                  {/* Helpdesk & Emergency Support Line */}
                  <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-3.5 h-3.5 text-[#018AAE] shrink-0" />
                      <span>Patient Assistance &amp; 24x7 Emergency Casualty:</span>
                    </div>
                    <div className="font-bold text-[#0B2545] flex items-center gap-2 text-xs">
                      <span>011-27531683</span>
                      <span>·</span>
                      <span>7840089703</span>
                    </div>
                  </div>
                </div>

                {/* 3. Action Footer */}
                <div className="p-4 sm:p-5 bg-slate-50/90 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={() => handlePrintCircular(selectedNoticeModal)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#018AAE]" />
                      <span>Print Circular</span>
                    </button>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      Brahm Shakti Hospital · Budh Vihar, Delhi 110085
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedNoticeModal(null)}
                    className="w-full sm:w-auto px-6 py-2 rounded-xl bg-[#018AAE] hover:bg-[#007595] text-white text-xs font-black transition-all shadow-xs hover:shadow-sm cursor-pointer"
                  >
                    Close Circular
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* 9. Frequently Asked Questions Section */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#018AAE] text-center mb-8 tracking-tight">
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
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#018AAE]/10 text-[#018AAE]' : 'text-slate-400'}`}>
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
    </div>
  );
};

export default HomePage;
