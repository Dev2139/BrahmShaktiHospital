import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Check,
  ShieldCheck,
  Headphones,
  Mail,
  Home,
  Star,
  GraduationCap,
  Award,
  MapPin,
  Menu,
  X,
  AlertCircle,
  FlaskConical,
  AlertTriangle
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { departmentsData, doctorsData } from '../../data/seedData';

const todayISO = () => new Date().toISOString().split('T')[0];

export const ConsultationPage = () => {
  const [searchParams] = useSearchParams();
  const preDoctor = searchParams.get('doctor') || '';
  const preDept = searchParams.get('specialty') || searchParams.get('department') || '';
  const preDate = searchParams.get('date') || todayISO();
  const preSlot = searchParams.get('slot') || '';

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Consultation mode: strictly onsite OPD Direct Consultation
  const consultationMode = 'direct';

  // Metadata
  const [departments, setDepartments] = useState(departmentsData || []);
  const [doctors, setDoctors] = useState(doctorsData || []);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // Dropdown selections
  const [selectedSpeciality, setSelectedSpeciality] = useState(preDept || 'all');
  const [selectedDoctorId, setSelectedDoctorId] = useState(preDoctor || '');

  // Date selection
  const [selectedDate, setSelectedDate] = useState(preDate < todayISO() ? todayISO() : preDate);
  const [dateStripStartIndex, setDateStripStartIndex] = useState(0);

  // Time slot selection
  const [selectedSlot, setSelectedSlot] = useState(preSlot || '10:00 AM - 10:30 AM');

  // Modals & UI Controls
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [doctorProfileModalOpen, setDoctorProfileModalOpen] = useState(false);

  // Fetch departments and doctors
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          api.get('/departments').catch(() => ({ data: { success: false } })),
          api.get('/doctors').catch(() => ({ data: { success: false } }))
        ]);

        if (deptRes.data?.success && Array.isArray(deptRes.data.data) && deptRes.data.data.length > 0) {
          setDepartments(deptRes.data.data);
        } else {
          setDepartments(departmentsData);
        }

        let loadedDoctors = doctorsData;
        if (docRes.data?.success && Array.isArray(docRes.data.data) && docRes.data.data.length > 0) {
          loadedDoctors = docRes.data.data;
        }
        setDoctors(loadedDoctors);

        // Pre-selection
        if (preDoctor) {
          const match = loadedDoctors.find(
            (d) => d.id === preDoctor || d.name?.toLowerCase().includes(preDoctor.toLowerCase())
          );
          if (match) {
            setSelectedDoctorId(match.id);
            if (match.departmentId) setSelectedSpeciality(match.departmentId);
          } else if (loadedDoctors.length > 0) {
            setSelectedDoctorId(loadedDoctors[0].id);
          }
        } else if (preDept) {
          const matchDept = loadedDoctors.filter(
            (d) => d.departmentId === preDept || d.department?.toLowerCase() === preDept.toLowerCase()
          );
          if (matchDept.length > 0) {
            setSelectedDoctorId(matchDept[0].id);
            setSelectedSpeciality(preDept);
          } else if (loadedDoctors.length > 0) {
            setSelectedDoctorId(loadedDoctors[0].id);
          }
        } else if (loadedDoctors.length > 0) {
          setSelectedDoctorId(loadedDoctors[0].id);
        }
      } catch (err) {
        console.error('Error fetching meta:', err);
      } finally {
        setLoadingMeta(false);
      }
    };
    fetchMeta();
  }, [preDoctor, preDept]);

  // Doctors filtered by selected department
  const availableDoctors = useMemo(() => {
    if (selectedSpeciality === 'all') return doctors;
    const match = doctors.filter(
      (d) =>
        d.departmentId === selectedSpeciality ||
        d.department?.toLowerCase() === selectedSpeciality.toLowerCase()
    );
    return match.length > 0 ? match : doctors;
  }, [doctors, selectedSpeciality]);

  // Active Selected Doctor
  const activeDoctor = useMemo(() => {
    if (!doctors || doctors.length === 0) return null;
    const found = doctors.find((d) => d.id === selectedDoctorId);
    if (found) return found;
    return availableDoctors[0] || doctors[0];
  }, [doctors, selectedDoctorId, availableDoctors]);

  // When specialty changes, adjust doctor to first match
  const handleSpecialtyChange = (spec) => {
    setSelectedSpeciality(spec);
    const matchDocs = doctors.filter(
      (d) => spec === 'all' || d.departmentId === spec || d.department?.toLowerCase() === spec.toLowerCase()
    );
    if (matchDocs.length > 0) {
      setSelectedDoctorId(matchDocs[0].id);
    }
  };

  // When doctor changes, adjust specialty to doctor's department
  const handleDoctorChange = (docId) => {
    setSelectedDoctorId(docId);
    const doc = doctors.find((d) => d.id === docId);
    if (doc?.departmentId) {
      setSelectedSpeciality(doc.departmentId);
    }
  };

  // 28-day window for date picker
  const upcomingDays = useMemo(() => {
    const days = [];
    const base = new Date();
    for (let i = 0; i < 28; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const year = d.getFullYear();
      days.push({ iso, dayName, dayNumber, monthName, year, dateObj: d });
    }
    return days;
  }, []);

  // Visible window: 7 days on desktop, 4 on tablet, 3 on mobile
  const visibleDays = useMemo(() => {
    return upcomingDays.slice(dateStripStartIndex, dateStripStartIndex + 7);
  }, [upcomingDays, dateStripStartIndex]);

  const handleNextDays = () => {
    if (dateStripStartIndex + 7 < upcomingDays.length) {
      setDateStripStartIndex((prev) => prev + 1);
    }
  };

  const handlePrevDays = () => {
    if (dateStripStartIndex > 0) {
      setDateStripStartIndex((prev) => prev - 1);
    }
  };

  // Standard OPD Slots matching reference
  const timeSlots = [
    { time: '09:00 AM - 09:30 AM', status: 'available' },
    { time: '09:30 AM - 10:00 AM', status: 'available' },
    { time: '10:00 AM - 10:30 AM', status: 'available' },
    { time: '10:30 AM - 11:00 AM', status: 'available' },
    { time: '11:00 AM - 11:30 AM', status: 'available' },
    { time: '11:30 AM - 12:00 PM', status: 'available' },
    { time: '12:00 PM - 12:30 PM', status: 'unavailable' },
    { time: '12:30 PM - 01:00 PM', status: 'available' },
    { time: '01:00 PM - 01:30 PM', status: 'available' }
  ];

  // Format active date for display in summary
  const formattedSummaryDate = useMemo(() => {
    if (!selectedDate) return '';
    try {
      const d = new Date(selectedDate);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  // Proceed to Patient Type Selection page
  const handleConfirmAppointment = () => {
    if (!activeDoctor) {
      toast.error('Please select a doctor to continue.');
      return;
    }
    if (!selectedSlot) {
      toast.error('Please select an appointment time slot.');
      return;
    }

    const params = new URLSearchParams({
      doctor: activeDoctor.id,
      department: activeDoctor.departmentId || activeDoctor.department || 'general',
      date: selectedDate,
      mode: consultationMode,
      slot: selectedSlot
    });

    navigate(`/bookappointment/patient-type?${params.toString()}`);
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen flex flex-col font-sans selection:bg-[#018AAE] selection:text-white bg-[#EBF8FA] overflow-y-auto lg:overflow-hidden">
      {/* -------------------- 1. NAVBAR (UNCHANGED AS REQUESTED) -------------------- */}
      <header className="bg-white border-b border-slate-200 shrink-0 z-40 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
          {/* Left: Hospital Brand & Tagline */}
          <div className="flex items-center gap-2.5">
            <Link to="/" className="flex items-center gap-2.5 group" title="Brahm Shakti Hospital Home">
              <img
                src="https://res.cloudinary.com/urzka7oz/image/upload/v1795244093/WhatsApp_Image_2026-11-20_at_10.36.32_PM-removebg-preview.png"
                alt="Brahm Shakti Hospital"
                className="h-8 sm:h-9 w-auto object-contain"
              />
              <div className="hidden sm:block border-l border-slate-200 pl-2">
                <div className="text-[10px] font-black tracking-wider text-[#0B2545] uppercase leading-tight">
                  OPD APPOINTMENT PORTAL
                </div>
                <div className="text-[9px] font-medium text-[#018AAE] italic leading-tight">
                  Trust of Generations
                </div>
              </div>
            </Link>
          </div>

          {/* Right: Portal Links + Lab Result & Emergency Badges */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-5 text-[15px] font-bold text-secondary">
            <Link to="/" className="hover:text-primary transition-colors">
              Back Home
            </Link>
            <button
              type="button"
              onClick={() => setRefundModalOpen(true)}
              className="hover:text-primary transition-colors cursor-pointer font-bold"
            >
              Refund Policy
            </button>
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-use" className="hover:text-primary transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/contact" className="hover:text-primary transition-colors">
              Contact Us
            </Link>

            {/* Quick Access Badges: Lab Result & 24x7 Emergency */}
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
              <a
                href="https://itd.oncquest.net/oncquest/design/onlinelab"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#018AAE]/30 text-[#018AAE] text-xs font-bold shadow-2xs hover:bg-[#F0FBFC] transition-all"
                title="Online Oncquest Lab Portal"
              >
                <FlaskConical className="w-3.5 h-3.5 text-[#018AAE]" />
                <span>Lab Result</span>
              </a>

              <a
                href="tel:7840089703"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-rose-300 text-rose-600 text-xs font-bold shadow-2xs hover:bg-rose-50 transition-all"
                title="24x7 Emergency Casualty"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Emergency</span>
              </a>
            </div>

            <Link
              to={isAuthenticated ? '/patient/dashboard' : '/bookappointment/patient-type'}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#73E0EF] bg-[#F0FBFC] text-primary text-xs font-extrabold hover:bg-[#CEF5FA] transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient Portal</span>
            </Link>
          </nav>

          {/* Mobile Navigation Toggle Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to={isAuthenticated ? '/patient/dashboard' : '/bookappointment/patient-type'}
              className="text-[#018AAE] text-xs font-black px-2 py-1"
            >
              Patient Portal
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-2.5 space-y-1.5 text-xs font-bold text-slate-800">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#018AAE]">
              Back Home
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setRefundModalOpen(true);
              }}
              className="block w-full text-left py-1 hover:text-[#018AAE]"
            >
              Refund Policy
            </button>
            <Link to="/privacy-policy" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#018AAE]">
              Privacy Policy
            </Link>
            <Link to="/terms-of-use" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#018AAE]">
              Terms &amp; Conditions
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#018AAE]">
              Contact Us
            </Link>
          </div>
        )}
      </header>

      {/* -------------------- 2. MAIN CONTAINER WITH PERFECTLY BLENDED HIGH-RES STETHOSCOPE BG -------------------- */}
      <main className="relative flex-1 flex flex-col justify-center px-3 sm:px-6 lg:px-8 py-2.5 lg:py-2 overflow-y-auto lg:overflow-hidden">
        
        {/* Real Photographic Medical Stethoscope & Cyan Wave Wallpaper perfectly blended into the whole background */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-right-top bg-no-repeat pointer-events-none select-none"
          style={{
            backgroundImage: 'url(/images/banners/medical-bg-doctor-shield.jpg)'
          }}
        />

        {/* Ambient luminous gradient wash for clinical radiance and natural depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent pointer-events-none" />

        {/* ---------------- ELEGANT TRANSLUCENT MEDICAL WAVES IN BACKGROUND (MATCHING REFERENCE) ---------------- */}
        {/* 1. Prominent Bottom-Left Sweeping Cyan Wave (Curves under the card corner as shown in image) */}
        <div className="absolute -bottom-8 -left-8 w-[600px] h-[360px] pointer-events-none select-none z-0">
          <svg viewBox="0 0 600 360" className="w-full h-full" preserveAspectRatio="none">
            {/* Soft Ice Blue Under-Wave */}
            <path
              d="M0,80 C180,140 280,260 420,320 C480,345 540,360 600,360 L0,360 Z"
              fill="#CEF5FA"
              fillOpacity="0.8"
            />
            {/* Vibrant Sky Blue Accent Wave */}
            <path
              d="M0,130 C150,180 240,280 370,330 C430,350 500,360 560,360 L0,360 Z"
              fill="#0DAFD5"
              fillOpacity="0.4"
            />
            {/* Deep Ocean Blue Core Wave */}
            <path
              d="M0,190 C120,230 190,300 310,345 C360,355 420,360 480,360 L0,360 Z"
              fill="#018AAE"
              fillOpacity="0.25"
            />
          </svg>
        </div>

        {/* 2. Bottom-Right & Center Flowing Medical Wave Ribbon */}
        <div className="absolute bottom-0 right-0 w-[800px] h-[220px] pointer-events-none select-none z-0">
          <svg viewBox="0 0 800 220" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M0,220 C180,180 320,120 520,140 C650,155 740,190 800,220 Z"
              fill="#CEF5FA"
              fillOpacity="0.55"
            />
            <path
              d="M100,220 C260,195 380,145 560,165 C670,180 750,205 800,220 Z"
              fill="#0DAFD5"
              fillOpacity="0.3"
            />
          </svg>
        </div>

        {/* 3. Top-Right Soft Wave Framing the Stethoscope */}
        <div className="absolute top-0 right-0 w-[650px] h-[380px] pointer-events-none select-none z-0">
          <svg viewBox="0 0 650 380" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M120,0 C260,110 380,90 650,220 L650,0 Z"
              fill="url(#top-steth-wave-grad)"
            />
            <defs>
              <linearGradient id="top-steth-wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#CEF5FA" stopOpacity="0" />
                <stop offset="40%" stopColor="#0DAFD5" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#018AAE" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 4. Left-Edge Flowing Wave Curve */}
        <div className="absolute top-24 -left-10 w-[240px] h-[450px] pointer-events-none select-none z-0">
          <svg viewBox="0 0 240 450" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M0,0 C80,120 90,280 0,420 Z"
              fill="#CEF5FA"
              fillOpacity="0.45"
            />
          </svg>
        </div>

        {/* Compact, Single-Viewport Content Card Container smoothly blended with the background */}
        <div className="relative z-10 max-w-[1380px] w-full mx-auto bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/90 shadow-2xl shadow-[#018AAE]/10 p-3.5 sm:p-5 lg:p-6 flex flex-col justify-between space-y-3 sm:space-y-4">
          
          {/* Top Bar: Breadcrumb + Heading + Selector Dropdowns with soft luminous tint */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-200/60 bg-gradient-to-r from-white/70 via-white/50 to-[#CEF5FA]/35 rounded-2xl p-2.5 sm:p-3 backdrop-blur-xs">
            <div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                <Link to="/" className="hover:text-[#018AAE] flex items-center gap-1">
                  <Home className="w-3 h-3 text-[#018AAE]" />
                  <span>Home</span>
                </Link>
                <span>/</span>
                <span className="text-slate-800 font-bold">Book Appointment</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-[#0B2545] tracking-tight leading-tight">
                Book Your Appointment
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Find the right specialist and choose a convenient time.
              </p>
            </div>

            {/* Quick Dropdown Selectors: Select Specialty & Select Doctor (Responsive, no overflow) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-2 w-full md:w-auto">
              {/* Select Speciality */}
              <div className="relative w-full md:w-44 lg:w-52 min-w-0">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                  Speciality
                </label>
                <div className="relative min-w-0">
                  <select
                    value={selectedSpeciality}
                    onChange={(e) => handleSpecialtyChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 sm:py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 appearance-none pr-7 cursor-pointer focus:outline-hidden focus:border-[#018AAE] truncate shadow-2xs"
                  >
                    <option value="all">All Specialities</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Select Doctor */}
              <div className="relative w-full md:w-48 lg:w-56 min-w-0">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                  Doctor
                </label>
                <div className="relative min-w-0">
                  <select
                    value={activeDoctor?.id || ''}
                    onChange={(e) => handleDoctorChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 sm:py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 appearance-none pr-7 cursor-pointer focus:outline-hidden focus:border-[#018AAE] truncate shadow-2xs"
                  >
                    {availableDoctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Equal-Height 3-Column Grid Layout (Doctors Horizontal Card | Date & Slot Grid | Booking Summary) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
            
            {/* ================= COLUMN 1: DOCTOR PROFILE CARD (IMAGE & DETAILS SIDE BY SIDE) ================= */}
            {/* Equal height to column 2 */}
            <div className="lg:col-span-4 w-full bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs p-3.5 sm:p-4 flex flex-col justify-between space-y-3">
              
              {/* Top: Photo on Left & Details on Right SIDE-BY-SIDE */}
              <div className="flex items-start gap-3.5">
                {/* Doctor Avatar Photo */}
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden bg-slate-200 border border-slate-200 shadow-2xs shrink-0">
                  <img
                    src={
                      activeDoctor?.image ||
                      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'
                    }
                    alt={activeDoctor?.name || 'Doctor'}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                </div>

                {/* Details side by side with photo */}
                <div className="space-y-1 min-w-0 flex-1">
                  <h2 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                    {activeDoctor?.name || 'Dr. S. K. Goyal'}
                  </h2>
                  <p className="text-[11px] font-bold text-[#018AAE] leading-snug line-clamp-2">
                    {activeDoctor?.departmentName || activeDoctor?.speciality || 'Internal Medicine & Diabetology'}
                  </p>
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 pt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-slate-800">4.9</span>
                    <span className="text-slate-400 font-normal">(120+ reviews)</span>
                  </div>
                </div>
              </div>

              {/* Middle: Credentials list */}
              <div className="pt-2 border-t border-slate-200/80 space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-[#018AAE] shrink-0" />
                  <span className="truncate">{activeDoctor?.degrees || 'MBBS, MD'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-[#018AAE] shrink-0" />
                  <span>{activeDoctor?.experience || '18+ years experience'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#018AAE] shrink-0" />
                  <span className="truncate">{activeDoctor?.room || 'OPD Chamber 101, Block A'}</span>
                </div>
              </div>

              {/* Bottom: Profile Action Link (Directly navigates to specific doctor's profile page) */}
              <Link
                to={`/doctors/${activeDoctor?.id || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#018AAE] hover:bg-[#F0FBFC] hover:border-[#018AAE]/40 transition-all shadow-2xs"
              >
                View Full Profile &rarr;
              </Link>
            </div>

            {/* ================= COLUMN 2: DATE PICKER & TIME SLOTS (NO VIDEO CONSULTATION) ================= */}
            <div className="lg:col-span-5 w-full bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs p-3.5 sm:p-4 flex flex-col justify-between space-y-3">
              
              {/* Select Appointment Date Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-[#018AAE]" />
                    <span>Select Appointment Date</span>
                  </div>
                </div>

                {/* Horizontal Date Picker Strip */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevDays}
                    disabled={dateStripStartIndex === 0}
                    className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer shrink-0"
                    aria-label="Previous dates"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex-1 grid grid-cols-4 sm:grid-cols-7 gap-1">
                    {visibleDays.map((d) => {
                      const isSelected = d.iso === selectedDate;
                      return (
                        <button
                          key={d.iso}
                          type="button"
                          onClick={() => setSelectedDate(d.iso)}
                          className={`py-1.5 px-0.5 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                            isSelected
                              ? 'bg-[#018AAE] text-white shadow-xs scale-[1.02]'
                              : 'bg-white hover:bg-[#F0FBFC] border border-slate-200 text-slate-700 hover:border-[#0DAFD5]'
                          }`}
                        >
                          <span
                            className={`text-[9px] font-bold uppercase leading-none ${
                              isSelected ? 'text-white/80' : 'text-slate-400'
                            }`}
                          >
                            {d.dayName}
                          </span>
                          <span className="text-xs sm:text-sm font-black my-0.5 leading-tight">
                            {d.dayNumber}
                          </span>
                          <span
                            className={`text-[9px] font-semibold leading-none ${
                              isSelected ? 'text-white/90' : 'text-slate-500'
                            }`}
                          >
                            {d.monthName}
                          </span>
                          <div
                            className={`w-1 h-1 rounded-full mt-0.5 ${
                              isSelected ? 'bg-white' : 'bg-emerald-500'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextDays}
                    disabled={dateStripStartIndex + 7 >= upcomingDays.length}
                    className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer shrink-0"
                    aria-label="Next dates"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Select Time Slot Section */}
              <div className="space-y-2 pt-1 border-t border-slate-200/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-[#018AAE]" />
                    <span>Select Time Slot</span>
                  </div>
                </div>

                {/* 3-Column Slot Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.time;
                    const isUnavailable = slot.status === 'unavailable';

                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={isUnavailable}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                          isUnavailable
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50'
                            : isSelected
                            ? 'bg-[#018AAE] text-white shadow-xs'
                            : 'bg-white hover:bg-[#F0FBFC] text-slate-700 border border-slate-200 hover:border-[#0DAFD5] cursor-pointer'
                        }`}
                      >
                        <span>{slot.time}</span>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Status Legend Row */}
                <div className="flex items-center justify-center gap-4 text-[10px] font-medium text-slate-500 pt-1">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#018AAE]" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>Unavailable</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ================= COLUMN 3: BOOKING SUMMARY CARD ================= */}
            <div className="lg:col-span-3 w-full bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
              
              <div>
                {/* Header Strip */}
                <div className="bg-[#018AAE] px-3.5 py-2 text-white">
                  <h3 className="text-xs font-black tracking-wide uppercase">
                    Booking Summary
                  </h3>
                </div>

                {/* Summary Body */}
                <div className="p-3.5 space-y-2.5 text-xs">
                  {/* Doctor mini profile */}
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/80">
                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                      <img
                        src={activeDoctor?.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'}
                        alt={activeDoctor?.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 leading-tight truncate">
                        {activeDoctor?.name || 'Dr. S. K. Goyal'}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate">
                        {activeDoctor?.departmentName || activeDoctor?.speciality || 'Internal Medicine'}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                      Date
                    </div>
                    <div className="font-black text-slate-800 text-xs">
                      {formattedSummaryDate}
                    </div>
                  </div>

                  {/* Time slot */}
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                      Time
                    </div>
                    <div className="font-black text-slate-800 text-xs">
                      {selectedSlot || 'Not Selected'}
                    </div>
                  </div>

                  {/* Consultation Type */}
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                      Consultation Type
                    </div>
                    <div className="font-black text-[#018AAE] text-xs">
                      Direct OPD Consultation
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Button inside Summary */}
              <div className="p-3.5 pt-0">
                <button
                  type="button"
                  onClick={handleConfirmAppointment}
                  className="w-full py-2.5 rounded-xl bg-[#018AAE] hover:bg-[#007595] active:scale-[0.99] text-white text-xs font-black transition-all shadow-md shadow-[#018AAE]/25 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Confirm Appointment</span>
                  <span>&rarr;</span>
                </button>
              </div>

            </div>

          </div>

          {/* Three Trust Footers across the bottom (as shown in reference image) */}
          <div className="pt-2.5 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#018AAE] shrink-0" />
              <div>
                <span className="font-bold text-slate-800">100% Secure &amp; Trusted</span> &bull;{' '}
                <span className="text-slate-400">Your data is safe</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-[#018AAE] shrink-0" />
              <div>
                <span className="font-bold text-slate-800">Need Help? 011-27531683</span> &bull;{' '}
                <span className="text-slate-400">Mon - Sat, 9 AM - 6 PM</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#018AAE] shrink-0" />
              <div>
                <span className="font-bold text-slate-800">support@brahmshakti.com</span> &bull;{' '}
                <span className="text-slate-400">24x7 Digital Helpdesk</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Doctor Profile Modal */}
      {doctorProfileModalOpen && activeDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900">Doctor Profile</h3>
              <button
                type="button"
                onClick={() => setDoctorProfileModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={activeDoctor.image}
                alt={activeDoctor.name}
                className="w-16 h-16 rounded-2xl object-cover object-top border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-slate-900">{activeDoctor.name}</h4>
                <p className="text-xs text-[#018AAE] font-bold">{activeDoctor.departmentName || activeDoctor.speciality}</p>
                <p className="text-[11px] text-slate-500">{activeDoctor.degrees}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeDoctor.bio || 'Senior medical consultant with extensive clinical expertise at Brahm Shakti Hospital.'}
            </p>
            <button
              type="button"
              onClick={() => setDoctorProfileModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#018AAE] text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Refund Policy Modal */}
      {refundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-[#018AAE]">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-black text-base text-slate-800">OPD Refund Policy</h3>
              </div>
              <button
                type="button"
                onClick={() => setRefundModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>1. Registration:</strong> Patient registration is completely FREE of charge. We do not collect registration fees.
              </p>
              <p>
                <strong>2. Doctor Availability:</strong> If the doctor is called for emergency surgery, appointments are rescheduled at zero fee or consultation is adjusted at the counter.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRefundModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#018AAE] text-white text-xs font-bold cursor-pointer"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationPage;
