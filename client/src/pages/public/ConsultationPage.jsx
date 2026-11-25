import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Check,
  CheckCircle2,
  Video,
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
  Loader2,
  AlertCircle
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

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Consultation mode: 'direct' (Direct Consultation - Visit Doctor in Person) | 'video' (Video Consultation - Consult Online)
  const [consultationMode, setConsultationMode] = useState('direct');

  // Metadata
  const [departments, setDepartments] = useState(departmentsData || []);
  const [doctors, setDoctors] = useState(doctorsData || []);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState(preDept || 'all');

  // Doctor selection
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

        // Pre-selection logic
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

  // Filtered doctors list based on search and speciality
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.name?.toLowerCase().includes(q) ||
        doc.speciality?.toLowerCase().includes(q) ||
        doc.departmentName?.toLowerCase().includes(q) ||
        doc.department?.toLowerCase().includes(q);

      const matchesSpeciality =
        selectedSpeciality === 'all' ||
        doc.departmentId === selectedSpeciality ||
        doc.department?.toLowerCase() === selectedSpeciality.toLowerCase();

      return matchesSearch && matchesSpeciality;
    });
  }, [doctors, searchQuery, selectedSpeciality]);

  // Active Selected Doctor
  const activeDoctor = useMemo(() => {
    if (!doctors || doctors.length === 0) return null;
    const found = doctors.find((d) => d.id === selectedDoctorId);
    if (found) return found;
    return filteredDoctors[0] || doctors[0];
  }, [doctors, selectedDoctorId, filteredDoctors]);

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

    // Navigate to patient type page
    navigate(`/bookappointment/patient-type?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#F0FBFC] text-slate-800 flex flex-col font-sans selection:bg-[#018AAE] selection:text-white">
      {/* -------------------- 1. NAVBAR (UNCHANGED AS REQUESTED) -------------------- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
          {/* Left: Hospital Brand & Tagline */}
          <div className="flex items-center gap-2.5">
            <Link to="/" className="flex items-center gap-2.5 group" title="Brahm Shakti Hospital Home">
              <img
                src="https://res.cloudinary.com/urzka7oz/image/upload/v1795244093/WhatsApp_Image_2026-11-20_at_10.36.32_PM-removebg-preview.png"
                alt="Brahm Shakti Hospital"
                className="h-9 sm:h-10 w-auto object-contain"
              />
              <div className="hidden sm:block border-l border-slate-200 pl-2.5">
                <div className="text-[11px] font-black tracking-wider text-[#0B2545] uppercase leading-tight">
                  OPD APPOINTMENT PORTAL
                </div>
                <div className="text-[10px] font-medium text-[#018AAE] italic leading-tight">
                  Trust of Generations
                </div>
              </div>
            </Link>
          </div>

          {/* Right: Portal Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-xs sm:text-sm font-bold text-slate-800">
            <Link to="/" className="hover:text-[#018AAE] transition-colors">
              Back Home
            </Link>
            <button
              type="button"
              onClick={() => setRefundModalOpen(true)}
              className="hover:text-[#018AAE] transition-colors cursor-pointer font-bold"
            >
              Refund Policy
            </button>
            <Link to="/privacy-policy" className="hover:text-[#018AAE] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-use" className="hover:text-[#018AAE] transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/contact" className="hover:text-[#018AAE] transition-colors">
              Contact Us
            </Link>
            <Link
              to={isAuthenticated ? '/patient/dashboard' : '/bookappointment/patient-type'}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#73E0EF] bg-[#F0FBFC] text-[#018AAE] font-extrabold hover:bg-[#CEF5FA] transition-all"
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
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 text-xs font-bold text-slate-800">
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

      {/* -------------------- 2. MAIN APPOINTMENT PORTAL CONTAINER -------------------- */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        
        {/* Main Floating Card Container (Matches Desktop View in reference image) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-4 sm:p-6 lg:p-8 space-y-6 relative overflow-hidden">
          
          {/* Faint Medical Stethoscope & Cross Watermark on Top Right */}
          <div className="absolute right-0 top-0 w-80 h-48 opacity-15 pointer-events-none hidden lg:block overflow-hidden">
            <svg viewBox="0 0 200 120" fill="none" className="w-full h-full object-contain">
              <path d="M 40 20 C 40 80, 100 100, 140 100" stroke="#018AAE" strokeWidth="8" strokeLinecap="round" />
              <circle cx="140" cy="100" r="16" fill="#0DAFD5" />
              <rect x="160" y="20" width="6" height="24" rx="3" fill="#018AAE" />
              <rect x="151" y="29" width="24" height="6" rx="3" fill="#018AAE" />
            </svg>
          </div>

          {/* Breadcrumb strip */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Link to="/" className="hover:text-[#018AAE] flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-[#018AAE]" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-800 font-bold">Book Appointment</span>
          </div>

          {/* Page Heading & Tagline */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight">
              Book Your Appointment
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Find the right specialist and choose a convenient time.
            </p>
          </div>

          {/* Search Bar Row (Matches reference image with input, specialty dropdown, and search button) */}
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-2 sm:p-2.5 flex flex-col md:flex-row items-stretch md:items-center gap-2 shadow-2xs">
            {/* Search Input */}
            <div className="flex-1 relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Doctor, Speciality..."
                className="w-full pl-10 pr-3 py-2 sm:py-2.5 rounded-xl border-0 bg-transparent text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
              />
            </div>

            {/* Specialities Select */}
            <div className="w-full md:w-56 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-2">
              <div className="relative">
                <select
                  value={selectedSpeciality}
                  onChange={(e) => {
                    setSelectedSpeciality(e.target.value);
                    const matchDocs = doctors.filter(
                      (d) => e.target.value === 'all' || d.departmentId === e.target.value
                    );
                    if (matchDocs.length > 0) setSelectedDoctorId(matchDocs[0].id);
                  }}
                  className="w-full px-3 py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 appearance-none pr-8 cursor-pointer focus:outline-hidden focus:border-[#018AAE]"
                >
                  <option value="all">All Specialities</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Search Action Button */}
            <button
              type="button"
              className="px-6 py-2.5 rounded-xl bg-[#018AAE] hover:bg-[#007595] text-white text-xs sm:text-sm font-black transition-all shadow-sm shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Search</span>
            </button>
          </div>

          {/* 3-Column Responsive Grid Layout (Doctor Profile Card | Date & Slot Picker | Booking Summary) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* ================= COLUMN 1: DOCTOR PROFILE CARD (Matches Left Card in Image) ================= */}
            <div className="lg:col-span-3 w-full bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex flex-col items-center text-center space-y-3.5">
              {/* Doctor Avatar Photo */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs shrink-0">
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

              {/* Name, Specialty & Rating */}
              <div className="space-y-1">
                <h2 className="text-base font-black text-slate-900 leading-tight">
                  {activeDoctor?.name || 'Dr. S. K. Goyal'}
                </h2>
                <p className="text-xs font-bold text-[#018AAE]">
                  {activeDoctor?.departmentName || activeDoctor?.speciality || 'Internal Medicine & Diabetology'}
                </p>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 pt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-slate-800">4.9</span>
                  <span className="text-slate-400 font-normal">(120+ reviews)</span>
                </div>
              </div>

              {/* Credentials & Chamber Info */}
              <div className="w-full pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600 text-left">
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

              {/* View Full Profile Link Button */}
              <button
                type="button"
                onClick={() => setDoctorProfileModalOpen(true)}
                className="w-full py-2 rounded-xl border border-slate-200 text-xs font-black text-[#018AAE] hover:bg-[#F0FBFC] transition-colors mt-1"
              >
                View Full Profile &rarr;
              </button>
            </div>

            {/* ================= COLUMN 2: CONSULTATION MODE + DATE STRIP + TIME SLOTS ================= */}
            <div className="lg:col-span-6 w-full space-y-4">
              
              {/* Consultation Mode Row (Direct vs Video) */}
              <div className="grid grid-cols-2 gap-3">
                {/* 1. Direct Consultation */}
                <button
                  type="button"
                  onClick={() => setConsultationMode('direct')}
                  className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                    consultationMode === 'direct'
                      ? 'border-[#018AAE] bg-[#F0FBFC] shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        consultationMode === 'direct'
                          ? 'bg-[#018AAE] text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 leading-tight">
                        Direct Consultation
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        Visit Doctor in Person
                      </div>
                    </div>
                  </div>
                  {consultationMode === 'direct' && (
                    <div className="w-4 h-4 rounded-full bg-[#018AAE] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>

                {/* 2. Video Consultation */}
                <button
                  type="button"
                  onClick={() => setConsultationMode('video')}
                  className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                    consultationMode === 'video'
                      ? 'border-[#018AAE] bg-[#F0FBFC] shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        consultationMode === 'video'
                          ? 'bg-[#018AAE] text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 leading-tight">
                        Video Consultation
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        Consult Online
                      </div>
                    </div>
                  </div>
                  {consultationMode === 'video' && (
                    <div className="w-4 h-4 rounded-full bg-[#018AAE] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              </div>

              {/* Select Appointment Date Section */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                    <Clock className="w-4 h-4 text-[#018AAE]" />
                    <span>Select Appointment Date</span>
                  </div>
                </div>

                {/* Horizontal Date Picker Strip (Matches reference strip with Mon/Date/Month) */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={handlePrevDays}
                    disabled={dateStripStartIndex === 0}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                    aria-label="Previous dates"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex-1 grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                    {visibleDays.map((d) => {
                      const isSelected = d.iso === selectedDate;
                      return (
                        <button
                          key={d.iso}
                          type="button"
                          onClick={() => setSelectedDate(d.iso)}
                          className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                            isSelected
                              ? 'bg-[#018AAE] text-white shadow-sm scale-[1.02]'
                              : 'bg-slate-50 hover:bg-[#F0FBFC] border border-slate-200 text-slate-700 hover:border-[#0DAFD5]'
                          }`}
                        >
                          <span
                            className={`text-[10px] font-bold uppercase leading-none ${
                              isSelected ? 'text-white/80' : 'text-slate-400'
                            }`}
                          >
                            {d.dayName}
                          </span>
                          <span className="text-sm font-black my-0.5 leading-tight">
                            {d.dayNumber}
                          </span>
                          <span
                            className={`text-[9px] font-semibold leading-none ${
                              isSelected ? 'text-white/90' : 'text-slate-500'
                            }`}
                          >
                            {d.monthName}
                          </span>
                          {/* Dot status indicator under each date */}
                          <div
                            className={`w-1 h-1 rounded-full mt-1 ${
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
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                    aria-label="Next dates"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Select Time Slot Section (Matches reference grid) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                    <Clock className="w-4 h-4 text-[#018AAE]" />
                    <span>Select Time Slot</span>
                  </div>
                </div>

                {/* 3-Column Slot Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.time;
                    const isUnavailable = slot.status === 'unavailable';

                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={isUnavailable}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isUnavailable
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-[#018AAE] text-white shadow-xs'
                            : 'bg-white hover:bg-[#F0FBFC] text-slate-700 border border-slate-200 hover:border-[#0DAFD5] cursor-pointer'
                        }`}
                      >
                        <span>{slot.time}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Status Legend Row (Available, Selected, Unavailable) */}
                <div className="pt-2 flex items-center justify-center gap-5 text-[11px] font-medium text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#018AAE]" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    <span>Unavailable</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ================= COLUMN 3: BOOKING SUMMARY CARD ================= */}
            <div className="lg:col-span-3 w-full bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between">
              
              <div>
                {/* Header Strip */}
                <div className="bg-[#018AAE] px-4 py-3 text-white">
                  <h3 className="text-xs sm:text-sm font-black tracking-wide uppercase">
                    Booking Summary
                  </h3>
                </div>

                {/* Summary Body */}
                <div className="p-4 space-y-4 text-xs">
                  {/* Doctor mini profile */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={activeDoctor?.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'}
                        alt={activeDoctor?.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-snug">
                        {activeDoctor?.name || 'Dr. S. K. Goyal'}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {activeDoctor?.departmentName || activeDoctor?.speciality || 'Internal Medicine'}
                      </p>
                    </div>
                  </div>

                  {/* Date summary */}
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Date
                    </div>
                    <div className="font-extrabold text-slate-800 text-xs">
                      {formattedSummaryDate}
                    </div>
                  </div>

                  {/* Time slot summary */}
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Time
                    </div>
                    <div className="font-extrabold text-slate-800 text-xs">
                      {selectedSlot || 'Not Selected'}
                    </div>
                  </div>

                  {/* Mode summary */}
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Consultation Type
                    </div>
                    <div className="font-extrabold text-[#018AAE] text-xs">
                      {consultationMode === 'direct' ? 'Direct Consultation' : 'Video Consultation'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Button inside Summary */}
              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={handleConfirmAppointment}
                  className="w-full py-3 rounded-xl bg-[#018AAE] hover:bg-[#007595] active:scale-[0.99] text-white text-xs sm:text-sm font-black transition-all shadow-md shadow-[#018AAE]/25 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Confirm Appointment</span>
                  <span>&rarr;</span>
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Policy & Fee Banner (Matches exact pill in reference image) */}
          <div className="p-3 bg-[#F0FBFC] border border-[#B6EEF6] rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-700 text-center">
            <span className="font-bold text-[#018AAE]">Registration Fee: ₹200/-</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="text-slate-600">
              Refund Policy: Refund available as per hospital policy.
            </span>
          </div>

          {/* Three Trust Footers across the bottom of the card */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#018AAE] shrink-0" />
              <div>
                <div className="font-bold text-slate-800">100% Secure &amp; Trusted</div>
                <div className="text-[11px] text-slate-400">Your data is safe with us</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Headphones className="w-5 h-5 text-[#018AAE] shrink-0" />
              <div>
                <div className="font-bold text-slate-800">Need Help? 011-27531683</div>
                <div className="text-[11px] text-slate-400">Mon - Sat, 9 AM - 6 PM</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-[#018AAE] shrink-0" />
              <div>
                <div className="font-bold text-slate-800">support@brahmshakti.com</div>
                <div className="text-[11px] text-slate-400">24x7 Digital Helpdesk</div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Floating Bottom Bar for Mobile View (Matches the mobile sticky bar in reference image) */}
      <div className="lg:hidden sticky bottom-0 z-30 bg-white border-t border-slate-200 px-4 py-3 shadow-lg flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0">
            <img
              src={activeDoctor?.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'}
              alt={activeDoctor?.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-slate-900 truncate leading-tight">
              {activeDoctor?.name || 'Dr. S. K. Goyal'}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {selectedSlot}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleConfirmAppointment}
          className="px-5 py-2.5 rounded-xl bg-[#018AAE] hover:bg-[#007595] text-white text-xs font-black shrink-0 transition-all shadow-md flex items-center gap-1.5"
        >
          <span>Confirm</span>
          <span>&rarr;</span>
        </button>
      </div>

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
