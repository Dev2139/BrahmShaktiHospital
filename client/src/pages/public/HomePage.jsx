import React, { useState, useEffect } from 'react';
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
    faculty: 'Dr. Sanjeev Verma (MS) · Dr. Rishabh Jain (MS)',
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

const CLINICAL_DISCIPLINES = [
  { id: 'all', label: 'All Disciplines' },
  { id: 'surgical', label: 'Surgical Sciences', deptIds: ['general-surgery', 'orthopedics'] },
  { id: 'medical', label: 'Medicine & Diabetology', deptIds: ['medicine', 'cardiology'] },
  { id: 'mother-child', label: 'Mother & Child', deptIds: ['gynecology', 'pediatrics'] },
  { id: 'critical', label: 'Dialysis & Renal', deptIds: ['nephrology'] },
  { id: 'specialist', label: 'Eye & Dermatology', deptIds: ['ophthalmology', 'skin'] }
];

const LATEST_NEWS_ITEMS = [
  {
    id: 1,
    image: '/news/news-convocation.jpg',
    date: '2026-11-03',
    title: 'Dr. D. S. Rana Conferred Honorary Doctorate at Convocation',
    link: '/about'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    date: '2026-10-15',
    title: 'Brahm Shakti Hospital Inaugurates Subsidized High-Flux Dialysis Wing',
    link: '/departments'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
    date: '2026-10-01',
    title: '24x7 Cath Lab Rapid Cardiac Response Network Saves 150+ Golden Hour Lives',
    link: '/facilities'
  }
];

const EVENTS_ITEMS = [
  {
    id: 1,
    image: '/news/event-palliative.jpg',
    date: '2026-10-09',
    title: 'World Hospice and Palliative Care Day Celebrations & Workshop',
    link: '/about'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800',
    date: '2026-11-14',
    title: 'Free Community Health & Diabetes Screening Camp for Senior Citizens',
    link: '/about'
  }
];

const LOCATION_ITEMS = [
  {
    id: 1,
    image: '/news/location-map.jpg',
    date: '2024-01-16',
    title: 'Brahm Shakti Hospital is located in Budh Vihar, North-West Delhi',
    link: '/contact'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    date: '2024-03-20',
    title: 'Main Campus Udyog Nagar Metro Station Road, Budh Vihar Phase-1',
    link: '/contact'
  }
];

const PHOTO_GALLERY_ITEMS = [
  {
    id: 1,
    image: '/gallery/gallery-homage.jpg',
    caption: "Dr Ajay Swaroop Chairman - BOM paying homage to Sir Ganga Ram on Founder's Day Celebrations."
  },
  {
    id: 2,
    image: '/gallery/gallery-surgery.jpg',
    caption: 'Dr. Munish Sachdeva'
  },
  {
    id: 3,
    image: '/gallery/gallery-padmashri.jpg',
    caption: "Dr. (Prof.) A.K Bhalla receiving Padma Shri from the Hon'ble President of India"
  },
  {
    id: 4,
    image: '/gallery/gallery-felicitation.jpg',
    caption: 'Dr. D. S. Rana'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
    caption: 'Advanced 24x7 Cath Lab & Cardiac Angiography Suite'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    caption: 'Subsidized High-Flux Charitable Hemodialysis Wing'
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
  const { isAuthenticated } = useAuth();
  const appointmentTarget = isAuthenticated ? '/appointments' : '/login?redirect=/appointments';

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Max Healthcare appointment search & action cards state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [internationalModalOpen, setInternationalModalOpen] = useState(false);
  const [selectedDisciplineTab, setSelectedDisciplineTab] = useState('all');

  // Interactive carousel states for News, Events, Location & Photo Gallery
  const [newsIndex, setNewsIndex] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [locationIndex, setLocationIndex] = useState(0);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

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
    <div className="space-y-12 lg:space-y-20 pb-20">
      {/* 1. Hero Section - Modern Split Layout */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary-50 via-white to-medical-coolgray pt-8 lg:pt-16 pb-12 lg:pb-20 border-b border-medical-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary/20 text-primary text-xs font-bold tracking-wide">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>NABH Accredited · Brahm Shakti Trust (Regd.)</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-tight">
                  Healthcare with <br className="hidden sm:inline" />
                  <span className="text-primary font-black">Trust & Humanity</span>
                </h1>
                <p className="text-base sm:text-lg text-medical-muted max-w-xl font-normal leading-relaxed">
                  250+ bed multispecialty hospital in North-West Delhi offering advanced tertiary care, 24x7 trauma resuscitation, subsidized hemodialysis, and certified DMC faculty.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to={appointmentTarget}
                  className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-card-hover transition-all flex items-center gap-2 hover:scale-105"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </Link>
                <a
                  href="tel:7840089703"
                  className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-white hover:bg-slate-50 text-secondary font-bold text-sm border-2 border-medical-border shadow-soft transition-all flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-status-danger" />
                  <span>24x7 Help: 7840089703</span>
                </a>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-medical-border max-w-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-secondary">NABH Certified</div>
                    <div className="text-[10px] text-medical-muted">Patient Safety</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-secondary">24x7 Cath Lab</div>
                    <div className="text-[10px] text-medical-muted">Cardiac Emergency</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-secondary">Dialysis Wing</div>
                    <div className="text-[10px] text-medical-muted">Subsidized Rates</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Media Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative h-96 sm:h-[460px] rounded-3xl overflow-hidden shadow-elevated border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"
                    alt="Brahm Shakti Hospital Modern Campus"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent text-secondary-dark text-xs font-bold uppercase tracking-wider mb-2">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Budh Vihar Campus</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Brahm Shakti Hospital</h3>
                    <p className="text-xs text-slate-200 mt-1">
                      Udyog Nagar Metro Station Road, Budh Vihar, Delhi 110086
                    </p>
                  </div>
                </div>

                {/* Floating Emergency Badge */}
                <div className="absolute -bottom-4 -right-4 bg-white p-3.5 sm:p-4 rounded-2xl shadow-elevated border border-medical-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-status-danger/10 text-status-danger flex items-center justify-center">
                    <Ambulance className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-secondary">24x7 Ambulance</div>
                    <div className="text-[11px] font-bold text-status-danger">Call 7840089703</div>
                  </div>
                </div>

                {/* Trust Badge Floating */}
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 bg-white p-2.5 sm:p-3.5 rounded-2xl shadow-elevated border border-medical-border hidden sm:flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent text-accent-dark flex items-center justify-center font-bold text-xs sm:text-sm">
                    ★ 4.9
                  </div>
                  <div>
                    <div className="text-xs font-bold text-secondary">Patient Satisfaction</div>
                    <div className="text-[10px] text-medical-muted">Over 45,000+ Treated</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Schedule Your Appointment Online - Max Healthcare Authentic Layout */}
      <section className="relative bg-[#F0F6FA] py-12 lg:py-16 border-y border-slate-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative">
          {/* Centered Heading */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#0B2545] tracking-tight">
              Schedule Your Appointment Online
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Book verified consultant doctors, clinical departments & visa medical appointments
            </p>
          </div>

          {/* Appointment Booking Search Card with Flanking Hospital Illustrations */}
          <div className="relative max-w-4xl mx-auto mb-10">
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

          {/* Service Action Cards: International Patients & Immigration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            {/* 1. International Patients */}
            <button
              type="button"
              onClick={() => setInternationalModalOpen(true)}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="m14 14 3-3-3-3" />
                  <path d="M8 11h9" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
                International Patients
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Visit International Desk</p>
            </button>

            {/* 2. Immigration */}
            <button
              type="button"
              onClick={() => setInternationalModalOpen(true)}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  <rect x="14" y="6" width="6" height="4" rx="1" fill="currentColor" fillOpacity="0.2" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
                Immigration
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Visa Medical Appointment</p>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Specialities & Procedures Section - Professional Hospital Architecture */}
      <section className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Activity className="w-4 h-4" />
              <span>Clinical Centres & Super Specialities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0B2545] tracking-tight">
              Specialities & Procedures
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Evidence-based clinical treatments, advanced day-care surgeries & tertiary inpatient care led by DMC-registered faculty
            </p>
          </div>
          <Link
            to="/departments"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-bold text-sm shrink-0"
          >
            <span>View All Clinical Specialities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Clinical Discipline Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-thin">
          {CLINICAL_DISCIPLINES.map((tab) => {
            const isActive = selectedDisciplineTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedDisciplineTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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

        {/* Clinical Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedDepartments.map((dept) => {
            const highlights = DEPARTMENT_CLINICAL_HIGHLIGHTS[dept.id] || {
              faculty: dept.headOfDepartment || 'Senior Medical Faculty',
              location: dept.floorLocation || 'Main Hospital Wing',
              procedures: dept.services ? dept.services.slice(0, 3) : ['Comprehensive Specialist Evaluation', 'Diagnostic Workup', 'Outpatient Consultation']
            };

            return (
              <div
                key={dept.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Department Photo with Location Badge */}
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
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
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {dept.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3.5">
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
                <div className="p-5 pt-0 flex items-center gap-2">
                  <Link
                    to={`/departments/${dept.id}`}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:border-[#0B2545] text-[#0B2545] text-xs font-bold text-center transition-all"
                  >
                    View Details
                  </Link>
                  <Link
                    to={isAuthenticated ? `/appointments?specialty=${dept.id}` : `/login?redirect=${encodeURIComponent(`/appointments?specialty=${dept.id}`)}`}
                    className="flex-1 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#123661] text-white text-xs font-bold text-center transition-all shadow-sm hover:shadow"
                  >
                    Book Appointment
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
      <section className="bg-white py-16 border-y border-medical-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
                <Stethoscope className="w-4 h-4" />
                <span>Expert Medical Faculty</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0B2545] tracking-tight">
                Senior Consultant Specialists
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Verified roster of Brahm Shakti Hospital doctors holding registered Delhi Medical Council licenses
              </p>
            </div>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-bold text-sm"
            >
              <span>Explore Doctor Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-medical-coolgray rounded-2xl overflow-hidden border border-medical-border shadow-soft hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-56 overflow-hidden bg-slate-200 relative">
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

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-secondary leading-tight">{doctor.name}</h3>
                    <p className="text-xs font-semibold text-primary mt-1">{doctor.designation}</p>
                    <p className="text-[11px] text-medical-muted mt-0.5">{doctor.qualification}</p>
                    {doctor.dmcNo && (
                      <p className="text-[10px] font-bold text-slate-500 mt-1 font-mono">
                        DMC No. {doctor.dmcNo}
                      </p>
                    )}

                    <div className="mt-3 text-xs text-medical-slate space-y-1">
                      <div>Experience: <strong>{doctor.experienceYears}+ Years</strong></div>
                      <div>Fee: <strong>₹{doctor.consultationFee}</strong> (Subsidized)</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/doctors/${doctor.id}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm"
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
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <ShieldCheck className="w-4 h-4" />
              <span>Philanthropic Healthcare Mission</span>
            </div>
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

      {/* 6. Patient Testimonials & Trust */}
      <section className="bg-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent mb-2">
              <Star className="w-4 h-4 fill-accent" />
              <span>Patient Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Words From Our Recovered Patients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Satish Narang',
                treatment: 'Total Knee Replacement',
                text: 'Dr. Kapil Goyal and the orthopaedic team at Brahm Shakti Hospital gave me a second chance to walk without pain. Subsidized package made it truly affordable for our family.',
                location: 'Rohini, Sector 22'
              },
              {
                name: 'Kavita Mathur',
                treatment: 'Emergency Cath Angioplasty',
                text: 'When my husband suffered severe chest pain at midnight, Brahm Shakti casualty team stabilized him in minutes. The 24x7 Cath Lab angioplasty saved his life. Eternally grateful.',
                location: 'Budh Vihar Phase I'
              },
              {
                name: 'Mohd. Salim',
                treatment: 'Maintenance Hemodialysis',
                text: 'I have been coming to Brahm Shakti dialysis wing for 2 years. Ultra-pure water system, friendly nurses, and philanthropic trust rates have relieved my family completely.',
                location: 'Pooth Khurd, Delhi'
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-accent mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-accent">{t.treatment} · {t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Latest News, Events & Location Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Column 1: Latest News */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0A7A74] mb-4">
              Latest News
            </h3>
            {(() => {
              const item = LATEST_NEWS_ITEMS[newsIndex];
              return (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
                  <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Navigation Arrows */}
                    <button
                      type="button"
                      aria-label="Previous News"
                      onClick={() => setNewsIndex((prev) => (prev - 1 + LATEST_NEWS_ITEMS.length) % LATEST_NEWS_ITEMS.length)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-[#0A7A74] shadow-md flex items-center justify-center transition-all cursor-pointer z-10"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next News"
                      onClick={() => setNewsIndex((prev) => (prev + 1) % LATEST_NEWS_ITEMS.length)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-[#0A7A74] shadow-md flex items-center justify-center transition-all cursor-pointer z-10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#0A7A74]" />
                        <span>{item.date}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-[#0A7A74] transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                    </div>

                    <div className="pt-2">
                      <Link
                        to={item.link}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-900 hover:text-[#0A7A74] transition-colors"
                      >
                        <span>Read More</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Column 2: Events */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0A7A74] mb-4">
              Events
            </h3>
            {(() => {
              const item = EVENTS_ITEMS[eventIndex];
              return (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
                  <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Navigation Arrows */}
                    <button
                      type="button"
                      aria-label="Previous Event"
                      onClick={() => setEventIndex((prev) => (prev - 1 + EVENTS_ITEMS.length) % EVENTS_ITEMS.length)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-[#0A7A74] shadow-md flex items-center justify-center transition-all cursor-pointer z-10"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next Event"
                      onClick={() => setEventIndex((prev) => (prev + 1) % EVENTS_ITEMS.length)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-[#0A7A74] shadow-md flex items-center justify-center transition-all cursor-pointer z-10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#0A7A74]" />
                        <span>{item.date}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-[#0A7A74] transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                    </div>

                    <div className="pt-2">
                      <Link
                        to={item.link}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-900 hover:text-[#0A7A74] transition-colors"
                      >
                        <span>Read More</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Column 3: Location and Directions */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0A7A74] mb-4">
              Location and Directions
            </h3>
            {(() => {
              const item = LOCATION_ITEMS[locationIndex];
              return (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
                  <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Navigation Arrows */}
                    <button
                      type="button"
                      aria-label="Previous Location Slide"
                      onClick={() => setLocationIndex((prev) => (prev - 1 + LOCATION_ITEMS.length) % LOCATION_ITEMS.length)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-[#0A7A74] shadow-md flex items-center justify-center transition-all cursor-pointer z-10"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next Location Slide"
                      onClick={() => setLocationIndex((prev) => (prev + 1) % LOCATION_ITEMS.length)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-[#0A7A74] shadow-md flex items-center justify-center transition-all cursor-pointer z-10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#0A7A74]" />
                        <span>{item.date}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-[#0A7A74] transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                    </div>

                    <div className="pt-2">
                      <Link
                        to={item.link}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-900 hover:text-[#0A7A74] transition-colors"
                      >
                        <span>Read More</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* 8. Photo Gallery Section */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0A7A74] text-center mb-8">
          Photo Gallery
        </h2>

        <div className="relative">
          {/* Navigation Arrows */}
          <button
            type="button"
            aria-label="Previous Photos"
            onClick={() => setGalleryStartIndex((prev) => (prev - 1 + PHOTO_GALLERY_ITEMS.length) % PHOTO_GALLERY_ITEMS.length)}
            className="absolute -left-2 sm:-left-5 top-1/3 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-slate-700 hover:text-[#0A7A74] shadow-md border border-slate-200 flex items-center justify-center transition-all cursor-pointer z-20 hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Next Photos"
            onClick={() => setGalleryStartIndex((prev) => (prev + 1) % PHOTO_GALLERY_ITEMS.length)}
            className="absolute -right-2 sm:-right-5 top-1/3 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-slate-700 hover:text-[#0A7A74] shadow-md border border-slate-200 flex items-center justify-center transition-all cursor-pointer z-20 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[0, 1, 2, 3].map((offset) => {
              const item = PHOTO_GALLERY_ITEMS[(galleryStartIndex + offset) % PHOTO_GALLERY_ITEMS.length];
              return (
                <div
                  key={offset}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs hover:shadow-md transition-all group flex flex-col"
                >
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 text-center flex-1 flex items-center justify-center">
                    <p className="text-xs text-slate-700 font-medium leading-snug line-clamp-3">
                      {item.caption}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
