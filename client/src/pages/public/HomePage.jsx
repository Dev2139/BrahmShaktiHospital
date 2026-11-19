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
  ChevronRight,
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
import { InternationalModal } from '../../components/InternationalModal';
import { LabPortalModal } from '../../components/LabPortalModal';

const PROCEDURES_LIST = [
  { name: 'Total Knee Replacement (TKR)', category: 'Orthopaedics', badge: 'High Success', doctor: 'Dr. Kapil Goyal' },
  { name: 'Laparoscopic Cholecystectomy (Gallbladder)', category: 'Surgery', badge: 'Day Care', doctor: 'Dr. Sanjeev Verma' },
  { name: 'Painless Normal Delivery & C-Section', category: 'Gynae & Obst', badge: '24x7 Ready', doctor: 'Dr. Manisha Jain' },
  { name: 'Level-III NICU Neonatal Critical Care', category: 'Pediatrics', badge: 'Intensive Care', doctor: 'Dr. Rupesh Sharma' },
  { name: 'Stitchless MICS Phaco Cataract Surgery', category: 'Eye', badge: 'No Injection', doctor: 'Dr. Monika Kumar' },
  { name: 'Subsidized Maintenance Hemodialysis', category: 'Medicine', badge: 'Trust Subsidized', doctor: 'Dr. S.K. Goyal' },
  { name: 'Emergency Coronary Angiography', category: 'Medicine', badge: 'Door to Balloon <45m', doctor: 'Dr. Vineet Mittal' },
  { name: 'Diabetic Foot Ulcer Salvage & Debridement', category: 'Surgery', badge: 'Advanced Wound', doctor: 'Dr. Rishabh Jain' },
  { name: 'Laser Skin Resurfacing & Mole Excision', category: 'Skin', badge: 'Aesthetic & Derm', doctor: 'Dr. Anish Goel' }
];

const PROCEDURE_CATEGORIES = [
  'All',
  'Medicine',
  'Surgery',
  'Orthopaedics',
  'Gynae & Obst',
  'Pediatrics',
  'Eye',
  'Skin'
];

export const HomePage = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Max Healthcare appointment search & action cards state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Budh Vihar Main Campus, Delhi');
  const [internationalModalOpen, setInternationalModalOpen] = useState(false);
  const [labModalOpen, setLabModalOpen] = useState(false);
  const [selectedProcedureCategory, setSelectedProcedureCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          api.get('/departments'),
          api.get('/doctors')
        ]);
        if (deptRes.data.success) setDepartments(deptRes.data.data.slice(0, 6));
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

  const filteredProcedures =
    selectedProcedureCategory === 'All'
      ? PROCEDURES_LIST
      : PROCEDURES_LIST.filter((p) => p.category === selectedProcedureCategory);

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
                  to="/appointments"
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
              Book verified consultant doctors, visa medicals, preventive checkups & home diagnostic services
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

              {/* Location Dropdown */}
              <div className="md:w-64 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200/60 focus-within:bg-white focus-within:border-primary transition-all">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-700 focus:outline-hidden cursor-pointer"
                >
                  <option value="Budh Vihar Main Campus, Delhi">Budh Vihar Main Campus</option>
                  <option value="Super Specialty OPD Chambers">Super Specialty OPD Block</option>
                  <option value="Mother & Child Care Wing">Mother & Child Care Wing</option>
                  <option value="24x7 Emergency & Trauma Centre">24x7 Casualty & Trauma</option>
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

          {/* 5 Service Action Cards (Matching Max Healthcare Screenshot) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 max-w-5xl mx-auto">
            {/* 1. International Patients */}
            <button
              type="button"
              onClick={() => setInternationalModalOpen(true)}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center text-center group cursor-pointer"
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
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center text-center group cursor-pointer"
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

            {/* 3. Health Checkup */}
            <Link
              to="/services"
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                  <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                  <circle cx="20" cy="10" r="2" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
                Health Checkup
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Preventive Care Packages</p>
            </Link>

            {/* 4. MAX Lab Equivalent -> BSH Lab */}
            <button
              type="button"
              onClick={() => setLabModalOpen(true)}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FlaskConical className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
                MAX Lab / BSH Lab
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Lab Reports & Blood Tests</p>
            </button>

            {/* 5. MAX@Home Equivalent -> Care@Home */}
            <a
              href="tel:7840089703"
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center text-center group cursor-pointer col-span-2 sm:col-span-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <line x1="12" y1="11" x2="12" y2="17" />
                  <line x1="9" y1="14" x2="15" y2="14" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
                MAX@Home / BSH
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Home Sample & Nursing</p>
            </a>
          </div>
        </div>
      </section>

      {/* 3. Specialities & Procedures Section (Right below hero & booking section) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              <Activity className="w-4 h-4" />
              <span>Certified Clinical Departments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0B2545] tracking-tight">
              Specialities & Procedures
            </h2>
            <p className="text-xs sm:text-sm text-medical-muted mt-1">
              Comprehensive tertiary clinical departments & advanced surgical procedures led by DMC-registered faculty
            </p>
          </div>
          <Link
            to="/departments"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-bold text-sm"
          >
            <span>Explore All Specialities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
          {PROCEDURE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedProcedureCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedProcedureCategory === cat
                  ? 'bg-[#0B2545] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat === 'All' ? 'All Specialities' : cat}
            </button>
          ))}
        </div>

        {/* Procedure Highlights Strip */}
        <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Key High-Volume Procedures Performed</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {filteredProcedures.map((proc, idx) => (
              <div
                key={idx}
                className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium shadow-2xs flex items-center gap-2 hover:border-primary transition-colors"
              >
                <span>{proc.name}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-sky-50 text-sky-700">
                  {proc.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="group bg-white rounded-2xl overflow-hidden border border-medical-border shadow-soft hover:shadow-card-hover hover:-translate-y-1.5 transition-all flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={dept.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'}
                  alt={dept.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#0B2545]/90 text-white backdrop-blur-xs text-[11px] font-bold uppercase">
                  {dept.category || 'Specialty'}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-secondary group-hover:text-primary transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-medical-muted mt-2 line-clamp-2 leading-relaxed">
                    {dept.shortDescription}
                  </p>
                  <div className="mt-4 pt-3 border-t border-medical-border text-xs text-medical-slate space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{dept.opdTimings || 'Mon - Sat: 09:00 AM - 05:00 PM'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-medical-border flex items-center justify-between">
                  <span className="text-xs font-semibold text-secondary">
                    Consultation: <strong className="text-primary font-bold">₹{dept.consultationCharges || 800}</strong>
                  </span>
                  <Link
                    to={`/departments/${dept.id}`}
                    className="inline-flex items-center gap-1 text-primary hover:text-primary-hover font-bold text-xs"
                  >
                    <span>View Faculty</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
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

      {/* 7. Ready to Book CTA Strip */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-primary to-secondary p-6 sm:p-12 rounded-3xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 text-white text-center lg:text-left">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Need Medical Guidance or Appointment?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200">
              Consult with senior specialists across 25+ disciplines. Instant online booking with confirmed slot generation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto">
            <Link
              to="/appointments"
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl bg-white text-secondary font-bold text-sm hover:bg-accent hover:text-secondary-dark shadow-md transition-all text-center hover:scale-105"
            >
              Book OPD Appointment
            </Link>
            <a
              href="tel:7840089703"
              className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors text-center"
            >
              Emergency: 7840089703
            </a>
          </div>
        </div>
      </section>

      {/* Modals triggered from Max Healthcare cards */}
      <InternationalModal
        isOpen={internationalModalOpen}
        onClose={() => setInternationalModalOpen(false)}
      />
      <LabPortalModal
        isOpen={labModalOpen}
        onClose={() => setLabModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
