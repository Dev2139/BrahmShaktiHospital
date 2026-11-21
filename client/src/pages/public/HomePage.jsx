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
  FileText
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { InternationalModal } from '../../components/InternationalModal';

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
  { id: 'all', label: 'All Disciplines' },
  { id: 'surgical', label: 'Surgical Sciences', deptIds: ['general-surgery', 'orthopedics'] },
  { id: 'medical', label: 'Medicine & Diabetology', deptIds: ['medicine', 'cardiology'] },
  { id: 'mother-child', label: 'Mother & Child', deptIds: ['gynecology', 'pediatrics'] },
  { id: 'critical', label: 'Dialysis & Renal', deptIds: ['nephrology'] },
  { id: 'specialist', label: 'Eye & Dermatology', deptIds: ['ophthalmology', 'skin'] }
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

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isStaff, dashboardPath } = useAuth();
  const appointmentTarget = isStaff
    ? (dashboardPath || '/admin/dashboard')
    : (isAuthenticated ? '/appointments' : '/login?redirect=/appointments');

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Max Healthcare appointment search & action cards state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          api.get('/departments'),
          api.get('/doctors')
        ]);
        if (deptRes.data.success) setDepartments(deptRes.data.data);
        if (docRes.data.success) setDoctors(docRes.data.data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchAppointment = (e) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (selectedDepartment) {
      if (q) {
        navigate(`/doctors?search=${encodeURIComponent(searchQuery.trim())}&department=${selectedDepartment}`);
      } else {
        navigate(`/departments/${selectedDepartment}`);
      }
      return;
    }
    if (!q) {
      navigate('/consultation');
      return;
    }
    const matchedDoc = doctors.find(
      (d) => d.name?.toLowerCase().includes(q) || d.speciality?.toLowerCase().includes(q)
    );
    if (matchedDoc) {
      navigate(`/consultation?doctor=${matchedDoc.id}`);
      return;
    }
    const matchedDept = departments.find(
      (dept) => dept.name?.toLowerCase().includes(q)
    );
    if (matchedDept) {
      navigate(`/consultation?specialty=${matchedDept.id}`);
      return;
    }
    navigate(`/doctors?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const activeTabObj = CLINICAL_DISCIPLINES.find((t) => t.id === selectedDisciplineTab);
  const displayedDepartments = React.useMemo(() => {
    if (!activeTabObj || activeTabObj.id === 'all') {
      return departments.slice(0, 6);
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

      {/* 2. Schedule Your Appointment Online - Max Healthcare Authentic Layout */}
      <section className="relative bg-[#F0F6FA] py-6 sm:py-12 lg:py-16 border-y border-slate-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative">
          {/* Centered Heading */}
          <div className="text-center max-w-3xl mx-auto mb-5 sm:mb-8">
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#0B2545] tracking-tight">
              Schedule Your Appointment Online
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2">
              Book verified consultant doctors, clinical departments & visa medical appointments
            </p>
          </div>

          {/* Appointment Booking Search Card with Flanking Hospital Illustrations */}
          <div className="relative max-w-4xl mx-auto mb-5 sm:mb-8">
            {/* Left Patient Illustration (Mother & Child waiting with masks) */}
            <div className="hidden xl:block absolute -left-48 bottom-0 w-44 h-40 pointer-events-none z-10">
              <svg viewBox="0 0 200 160" className="w-full h-full object-contain drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Waiting bench */}
                <rect x="20" y="115" width="160" height="8" rx="4" fill="#94A3B8" />
                <rect x="40" y="123" width="6" height="28" rx="2" fill="#64748B" />
                <rect x="154" y="123" width="6" height="28" rx="2" fill="#64748B" />
                {/* Mother figure */}
                <ellipse cx="65" cy="46" rx="14" ry="16" fill="#F8C8A0" />
                <path d="M51 44 Q65 30 79 44 Q79 26 65 24 Q51 26 51 44 Z" fill="#292524" />
                {/* Mask */}
                <rect x="55" y="47" width="20" height="12" rx="4" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
                {/* Torso & clothing */}
                <path d="M42 110 L48 64 C48 64 56 62 65 62 C74 62 82 64 82 64 L88 110 Z" fill="#F97316" />
                {/* Legs */}
                <rect x="52" y="105" width="10" height="42" rx="3" fill="#1E293B" />
                <rect x="66" y="105" width="10" height="42" rx="3" fill="#1E293B" />
                <ellipse cx="57" cy="148" rx="7" ry="3" fill="#0F172A" />
                <ellipse cx="71" cy="148" rx="7" ry="3" fill="#0F172A" />
                {/* Child figure */}
                <ellipse cx="120" cy="68" rx="11" ry="13" fill="#F8C8A0" />
                <path d="M109 66 Q120 54 131 66 Q131 52 120 50 Q109 52 109 66 Z" fill="#451A03" />
                {/* Mask */}
                <rect x="112" y="69" width="16" height="10" rx="3" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
                {/* Child torso */}
                <path d="M104 112 L108 81 C108 81 114 80 120 80 C126 80 132 81 132 81 L136 112 Z" fill="#FDE047" />
                {/* Child legs */}
                <rect x="112" y="108" width="7" height="32" rx="2" fill="#0284C7" />
                <rect x="122" y="108" width="7" height="32" rx="2" fill="#0284C7" />
                <ellipse cx="115" cy="141" rx="5" ry="2.5" fill="#0F172A" />
                <ellipse cx="125" cy="141" rx="5" ry="2.5" fill="#0F172A" />
                {/* Floating medical cross badge */}
                <circle cx="165" cy="40" r="14" fill="#E0F2FE" />
                <path d="M165 33 V47 M158 40 H172" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>

            {/* Right Hospital Receptionist Illustration */}
            <div className="hidden xl:block absolute -right-48 bottom-0 w-44 h-40 pointer-events-none z-10">
              <svg viewBox="0 0 200 160" className="w-full h-full object-contain drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Clinic Counter */}
                <path d="M30 90 L170 90 L170 152 L30 152 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
                <path d="M25 84 L175 84 L175 92 L25 92 Z" rx="3" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
                <rect x="42" y="104" width="20" height="28" rx="2" fill="#FFFFFF" stroke="#CBD5E1" />
                <line x1="47" y1="112" x2="57" y2="112" stroke="#94A3B8" strokeWidth="1.5" />
                <line x1="47" y1="118" x2="55" y2="118" stroke="#94A3B8" strokeWidth="1.5" />
                <line x1="47" y1="124" x2="53" y2="124" stroke="#94A3B8" strokeWidth="1.5" />
                {/* Receptionist Doctor / Nurse */}
                <ellipse cx="110" cy="38" rx="14" ry="16" fill="#F8C8A0" />
                <path d="M96 36 Q110 20 124 36 Q125 18 110 16 Q95 18 96 36 Z" fill="#1E293B" />
                {/* Mask */}
                <rect x="101" y="39" width="18" height="12" rx="4" fill="#E0F2FE" stroke="#7DD3FC" strokeWidth="1" />
                {/* Uniform / scrubs */}
                <path d="M85 86 L94 54 C97 54 103 52 110 52 C117 52 123 54 126 54 L135 86 Z" fill="#0D9488" />
                <path d="M100 54 L106 86 M120 54 L114 86" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="110" cy="62" r="3" fill="#FDE047" />
                {/* Desktop Monitor on Counter */}
                <rect x="135" y="60" width="32" height="24" rx="2" fill="#334155" />
                <rect x="137" y="62" width="28" height="18" rx="1" fill="#38BDF8" />
                <path d="M149 84 L153 84 L152 88 L150 88 Z" fill="#64748B" />
                {/* Medical Badge */}
                <circle cx="65" cy="40" r="14" fill="#CCFBF1" />
                <path d="M60 38 C60 45 70 45 70 38 V33" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="70" cy="32" r="2" fill="#0D9488" />
              </svg>
            </div>

            {/* White Search Box */}
            <form
              onSubmit={handleSearchAppointment}
              className="bg-white rounded-2xl shadow-lg border border-slate-200/90 p-2 sm:p-2.5 flex flex-col md:flex-row items-stretch gap-2 relative z-20"
            >
              {/* Search for Doctor or Speciality */}
              <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200/60 focus-within:bg-white focus-within:border-primary transition-all">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Doctor or Speciality"
                  className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden"
                />
              </div>

              {/* Department Dropdown (Replaced Location dropdown) */}
              <div className="md:w-72 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200/60 focus-within:bg-white focus-within:border-primary transition-all">
                <Stethoscope className="w-5 h-5 text-slate-400 shrink-0" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-700 focus:outline-hidden cursor-pointer"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Book an Appointment Button */}
              <button
                type="submit"
                className="px-7 py-3.5 bg-[#0B2545] hover:bg-[#123661] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center shrink-0 cursor-pointer"
              >
                Book an Appointment
              </button>
            </form>
          </div>

          {/* Static Appointment Booking Highlights Banner (Fills Space Under Search) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-6 max-w-4xl mx-auto pt-2">
            {/* 1. Instant Slot Booking */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex items-start gap-3.5 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-teal-50 text-primary flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">Instant Slot Booking</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Direct digital appointment confirmation with 20+ verified senior clinicians.
                </p>
              </div>
            </div>

            {/* 2. Subsidized Trust Tariffs */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex items-start gap-3.5 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">Subsidized Trust Care</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  High-tech tertiary surgical and IPD care provided at charitable trust rates.
                </p>
              </div>
            </div>

            {/* 3. Zero Waiting Time Support */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex items-start gap-3.5 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">Zero Waiting Time</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Fast-track triage, priority senior desk, and 24x7 emergency ramp access.
                </p>
              </div>
            </div>
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
                    to={isStaff ? appointmentTarget : (isAuthenticated ? `/appointments?specialty=${dept.id}` : `/login?redirect=${encodeURIComponent(`/appointments?specialty=${dept.id}`)}`)}
                    className="flex-1 py-2 sm:py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#123661] text-white text-xs font-bold text-center transition-all shadow-sm hover:shadow"
                  >
                    {isStaff ? 'My Dashboard' : 'Book Slot'}
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

      {/* 4. Consultant Doctor Profiles */}
      <section className="bg-white py-8 sm:py-16 border-y border-medical-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-5 sm:mb-10">
            <div>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0B2545] tracking-tight">
                Senior Consultant Specialists
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Verified roster of Brahm Shakti Hospital doctors holding registered Delhi Medical Council licenses
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <span className="sm:hidden text-xs text-[#0A7A74] font-bold">Swipe to view →</span>
              <Link
                to="/doctors"
                className="inline-flex items-center gap-1.5 text-primary hover:text-primary-hover font-bold text-xs sm:text-sm"
              >
                <span>Explore Directory</span>
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

      {/* 7. Community Health Camps & Hospital Events Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-5 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2545] tracking-tight">
              Hospital Events & Healthcare Initiatives
            </h2>
            <p className="text-xs sm:text-base text-slate-600 mt-1 max-w-2xl">
              Participate in free community screening camps, specialist CME symposiums, and patient awareness programs at Brahm Shakti Hospital.
            </p>
          </div>
          <Link
            to={appointmentTarget}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0A7A74] hover:text-[#08625d] transition-colors self-start sm:self-auto shrink-0"
          >
            <span>Register for Free Camp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-stretch">
          {/* Left Column: Featured Event Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
            <div className="relative h-48 sm:h-72 overflow-hidden bg-slate-900">
              <img
                src={FEATURED_EVENT.image}
                alt={FEATURED_EVENT.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-2">
                <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-600 text-white text-[11px] sm:text-xs font-bold shadow-sm">
                  {FEATURED_EVENT.badge}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-sm font-medium text-emerald-200 mb-1">
                  <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                    {FEATURED_EVENT.date}
                  </span>
                  <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                    {FEATURED_EVENT.time}
                  </span>
                </div>
                <h3 className="text-base sm:text-2xl font-bold leading-snug drop-shadow-sm line-clamp-2">
                  {FEATURED_EVENT.title}
                </h3>
              </div>
            </div>

            <div className="p-4 sm:p-7 flex-1 flex flex-col justify-between space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-[#0A7A74] shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-700">{FEATURED_EVENT.venue}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {FEATURED_EVENT.description}
                </p>

                {/* Highlights List */}
                <div className="pt-1 sm:pt-2">
                  <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 sm:mb-3">
                    Camp Benefits & Free Services
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2.5">
                    {FEATURED_EVENT.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0A7A74] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
                <Link
                  to={appointmentTarget}
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#0A7A74] hover:bg-[#08625d] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
                >
                  <span>Book Free Screening Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href="tel:7840089703"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-[#0A7A74] hover:border-[#0A7A74]/30 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#0A7A74]" />
                  <span>Enquiry: 7840089703</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Stacked Upcoming Events (Swipeable on Mobile, Stacked on Desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between mb-0.5 sm:mb-1">
              <h3 className="text-base sm:text-lg font-bold text-[#0B2545]">
                Upcoming Medical Workshops
              </h3>
              <span className="sm:hidden text-xs text-[#0A7A74] font-bold">Swipe →</span>
              <span className="hidden sm:inline text-xs font-medium text-slate-500">DMC Certified</span>
            </div>

            <div className="flex lg:flex-col gap-3 sm:gap-4 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 scrollbar-none snap-x -mx-4 px-4 lg:mx-0 lg:px-0">
              {UPCOMING_EVENTS.map((event) => (
                <div
                  key={event.id}
                  className="w-[84vw] xs:w-[76vw] lg:w-auto shrink-0 snap-start bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:gap-4 group cursor-default"
                >
                  <div className="relative w-full sm:w-28 sm:h-28 h-32 sm:h-auto rounded-xl overflow-hidden shrink-0 bg-slate-100">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold border ${event.tagColor}`}>
                          {event.category}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                          {event.date}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0A7A74] transition-colors line-clamp-2 leading-snug">
                        {event.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1 font-medium">
                        Faculty: {event.speaker}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span className="truncate max-w-[170px] sm:max-w-[200px]">{event.venue}</span>
                      <Link
                        to={appointmentTarget}
                        className="text-[#0A7A74] hover:underline font-semibold shrink-0 flex items-center gap-1"
                      >
                        Attend <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Campus & Infrastructure Photo Gallery Section - 3D Cover Flow Carousel */}
      <section className="max-w-7xl mx-auto px-4 overflow-hidden">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2545] tracking-tight">
            Hospital Campus & Clinical Gallery
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Explore our state-of-the-art modular operating suites, specialized critical care units, and patient facilities in Budh Vihar.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {GALLERY_CATEGORIES.map((cat) => {
              const active = selectedGalleryCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#0A7A74] text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
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
