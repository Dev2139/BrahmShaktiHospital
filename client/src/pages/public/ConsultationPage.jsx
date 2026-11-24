import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  Printer,
  ShieldCheck,
  PhoneCall,
  ArrowLeft,
  ArrowRight,
  Lock,
  Mail,
  Phone,
  Info,
  X,
  Video,
  MapPin,
  GraduationCap,
  Award,
  AlertCircle,
  CalendarDays,
  Loader2,
  Check,
  Star,
  Sparkles,
  HelpCircle,
  Menu,
  FileText,
  BadgeCheck,
  HeartPulse,
  Languages
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { departmentsData, doctorsData } from '../../data/seedData';

const todayISO = () => new Date().toISOString().split('T')[0];

// Standard time slots for OPD sessions
const DEFAULT_OPD_SLOTS = [
  { timeSlot: '09:00 AM - 09:30 AM', remaining: 4, isClosed: false },
  { timeSlot: '09:30 AM - 10:00 AM', remaining: 3, isClosed: false },
  { timeSlot: '10:00 AM - 10:30 AM', remaining: 5, isClosed: false },
  { timeSlot: '10:30 AM - 11:00 AM', remaining: 2, isClosed: false },
  { timeSlot: '11:00 AM - 11:30 AM', remaining: 4, isClosed: false },
  { timeSlot: '11:30 AM - 12:00 PM', remaining: 1, isClosed: false },
  { timeSlot: '12:00 PM - 12:30 PM', remaining: 3, isClosed: false },
  { timeSlot: '12:30 PM - 01:00 PM', remaining: 2, isClosed: false },
  { timeSlot: '01:00 PM - 01:30 PM', remaining: 4, isClosed: false },
  { timeSlot: '02:00 PM - 02:30 PM', remaining: 3, isClosed: false },
  { timeSlot: '02:30 PM - 03:00 PM', remaining: 5, isClosed: false },
  { timeSlot: '03:00 PM - 03:30 PM', remaining: 2, isClosed: false }
];

// Clean vector doctor silhouette fallback
const DoctorSilhouette = ({ className = 'w-40 h-40' }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} drop-shadow-sm`}
  >
    <rect width="200" height="200" rx="28" fill="#E8F4F8" />
    <path
      d="M36 200 C36 156 60 144 86 142 L114 142 C140 144 164 156 164 200 Z"
      fill="#F8FAFC"
      stroke="#DCE5EC"
      strokeWidth="2"
    />
    <path d="M88 142 L100 168 L112 142 Z" fill="#0B2545" />
    <path d="M96 150 L100 188 L104 150 Z" fill="#2563EB" />
    <path d="M60 148 L88 178 L80 200 L44 200 Z" fill="#FFFFFF" />
    <path d="M140 148 L112 178 L120 200 L156 200 Z" fill="#FFFFFF" />
    <rect x="88" y="112" width="24" height="34" rx="4" fill="#E5A672" />
    <ellipse cx="100" cy="92" rx="32" ry="38" fill="#F0BA8B" />
    <path
      d="M68 90 C66 66 82 52 100 52 C118 52 134 66 132 90 C128 72 118 64 100 64 C82 64 72 72 68 90 Z"
      fill="#2A2F35"
    />
    <ellipse cx="88" cy="94" rx="3" ry="4" fill="#2A2F35" />
    <ellipse cx="112" cy="94" rx="3" ry="4" fill="#2A2F35" />
    <path d="M96 102 C98 106 102 106 104 102" stroke="#D99B6A" strokeWidth="2" strokeLinecap="round" />
    <path d="M92 116 C96 120 104 120 108 116" stroke="#C88456" strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M74 140 C70 166 78 184 88 186 C98 188 98 178 98 172"
      stroke="#475569"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M126 140 C130 166 122 184 112 186 C102 188 102 178 102 172"
      stroke="#475569"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="100" cy="184" r="8" fill="#94A3B8" stroke="#475569" strokeWidth="2.5" />
    <circle cx="100" cy="184" r="3.5" fill="#0A7A74" />
  </svg>
);

export const ConsultationPage = () => {
  const [searchParams] = useSearchParams();
  const preDoctor = searchParams.get('doctor') || '';
  const preDept = searchParams.get('specialty') || searchParams.get('department') || '';
  const preDate = searchParams.get('date') || todayISO();
  const preMode = searchParams.get('mode') || 'direct';
  const preSlot = searchParams.get('slot') || '';

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Mode: direct vs video consultation
  const [consultationMode, setConsultationMode] = useState(preMode);

  // Metadata
  const [departments, setDepartments] = useState(departmentsData || []);
  const [doctors, setDoctors] = useState(doctorsData || []);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // Search & Filter state
  const [selectedDeptId, setSelectedDeptId] = useState(preDept);
  const [selectedDoctorId, setSelectedDoctorId] = useState(preDoctor);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorPickerOpen, setDoctorPickerOpen] = useState(false);

  // Date strip state
  const [date, setDate] = useState(preDate < todayISO() ? todayISO() : preDate);
  const [dateStripStartIndex, setDateStripStartIndex] = useState(0);

  // Slots
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(preSlot);

  // Patient Booking form state
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [symptoms, setSymptoms] = useState('');
  const [uhid, setUhid] = useState('');

  // Modals & UI Controls
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dateStripRef = useRef(null);

  // Autofill patient details if user is logged in
  useEffect(() => {
    if (user) {
      if (user.name && !patientName) setPatientName(user.name);
      if (user.email && !patientEmail) setPatientEmail(user.email);
      if (user.phone && !patientPhone) setPatientPhone(user.phone);
      if (user.uhid && !uhid) setUhid(user.uhid);
    }
  }, [user]);

  // Fetch departments and doctors from backend API with local seedData fallback
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

        // Determine initially selected doctor
        if (preDoctor) {
          const match = loadedDoctors.find((d) => d.id === preDoctor || d.name?.toLowerCase().includes(preDoctor.toLowerCase()));
          if (match) {
            setSelectedDoctorId(match.id);
            if (match.departmentId) setSelectedDeptId(match.departmentId);
          } else if (loadedDoctors.length > 0) {
            setSelectedDoctorId(loadedDoctors[0].id);
          }
        } else if (preDept) {
          const matchDept = loadedDoctors.filter(
            (d) => d.departmentId === preDept || d.department?.toLowerCase() === preDept.toLowerCase()
          );
          if (matchDept.length > 0) {
            setSelectedDoctorId(matchDept[0].id);
            setSelectedDeptId(preDept);
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

  // Filtered doctors list based on search term & department filter
  const filteredDoctors = useMemo(() => {
    let list = doctors;
    if (selectedDeptId) {
      list = list.filter(
        (d) =>
          d.departmentId === selectedDeptId ||
          d.department?.toLowerCase() === selectedDeptId.toLowerCase()
      );
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.departmentName?.toLowerCase().includes(q) ||
          d.designation?.toLowerCase().includes(q) ||
          d.specializations?.some((s) => s.toLowerCase().includes(q))
      );
    }
    return list;
  }, [doctors, selectedDeptId, searchTerm]);

  // Active selected doctor object
  const activeDoctor = useMemo(() => {
    if (!doctors || doctors.length === 0) return null;
    return doctors.find((d) => d.id === selectedDoctorId) || filteredDoctors[0] || doctors[0];
  }, [doctors, selectedDoctorId, filteredDoctors]);

  // Generate 21 upcoming days for the horizontal calendar strip
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

  // Visible window of days in the carousel strip (shows 7 at a time on desktop, scrolls smoothly)
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

  // Sync selected date with visible strip if date is navigated externally
  useEffect(() => {
    const idx = upcomingDays.findIndex((d) => d.iso === date);
    if (idx !== -1) {
      if (idx < dateStripStartIndex) {
        setDateStripStartIndex(idx);
      } else if (idx >= dateStripStartIndex + 7) {
        setDateStripStartIndex(Math.min(idx - 6, upcomingDays.length - 7));
      }
    }
  }, [date, upcomingDays, dateStripStartIndex]);

  // Load live slots from API or fallback to standard schedule
  const loadSlots = useCallback(async () => {
    if (!activeDoctor?.id || !date) return;
    setSlotsLoading(true);
    try {
      const res = await api.get('/appointments/slots', {
        params: { doctorId: activeDoctor.id, date }
      });
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setSlots(res.data.data);
        if (!preSlot || !res.data.data.some((s) => s.timeSlot === preSlot)) {
          const firstOpen = res.data.data.find((s) => s.remaining > 0 && !s.isClosed);
          if (firstOpen) setSelectedSlot(firstOpen.timeSlot);
        }
      } else {
        // Fallback to standard doctor schedule
        setSlots(DEFAULT_OPD_SLOTS);
        if (!selectedSlot) setSelectedSlot(DEFAULT_OPD_SLOTS[2].timeSlot); // 10:00 AM default
      }
    } catch {
      setSlots(DEFAULT_OPD_SLOTS);
      if (!selectedSlot) setSelectedSlot(DEFAULT_OPD_SLOTS[2].timeSlot);
    } finally {
      setSlotsLoading(false);
    }
  }, [activeDoctor, date, preSlot, selectedSlot]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  // Formatted date string for display (e.g., "Mon, 24 Nov, 2026")
  const formattedDisplayDate = useMemo(() => {
    if (!date) return '';
    try {
      const d = new Date(date + 'T00:00:00');
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return date;
    }
  }, [date]);

  // Proceed / Confirm action handler
  const handleProceedOrConfirm = () => {
    if (!activeDoctor) {
      toast.error('Please choose a consulting doctor.');
      return;
    }
    if (!isAuthenticated) {
      // User is a guest: preserve draft state and navigate to patient type / login flow
      const query = `?doctor=${encodeURIComponent(activeDoctor.id)}&department=${encodeURIComponent(
        activeDoctor.departmentId || ''
      )}&date=${encodeURIComponent(date)}&mode=${encodeURIComponent(consultationMode)}&slot=${encodeURIComponent(
        selectedSlot || ''
      )}`;
      navigate(`/bookappointment/patient-type${query}`);
      return;
    }
    if (!selectedSlot) {
      toast.error('Please select an available consultation slot.');
      return;
    }
    // Authenticated user: open patient verification & booking modal
    setBookingModalOpen(true);
  };

  // Submit confirmed appointment to backend
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      toast.error('Please enter patient name.');
      return;
    }
    if (!patientPhone.trim() || patientPhone.trim().replace(/\D/g, '').length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    setBookingLoading(true);
    try {
      const payload = {
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail.trim() || undefined,
        patientAge: Number(patientAge) || undefined,
        gender,
        doctorId: activeDoctor.id,
        doctorName: activeDoctor.name,
        departmentId: activeDoctor.departmentId,
        departmentName: activeDoctor.departmentName,
        date,
        timeSlot: selectedSlot,
        appointmentType: consultationMode === 'video' ? 'Video Consultation' : 'Direct Consultation',
        symptoms: symptoms.trim() || undefined,
        fee: activeDoctor.consultationFee || 700,
        registrationFee: 0,
        paymentMethod: 'Pay at Hospital Counter'
      };

      const res = await api.post('/appointments', payload);
      if (res.data?.success) {
        setBookingModalOpen(false);
        setConfirmed(res.data.data);
        toast.success('Appointment Confirmed Successfully!');
      }
    } catch (err) {
      console.error('Booking error:', err);
      toast.error(err.response?.data?.message || 'Booking submission failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleResetBooking = () => {
    setConfirmed(null);
    setBookingModalOpen(false);
    setSymptoms('');
    loadSlots();
  };

  return (
    <div className="min-h-screen bg-[#F4F8FA] text-slate-800 flex flex-col font-sans selection:bg-[#0A7A74] selection:text-white">
      {/* ----------------- 1. OPD APPOINTMENT PORTAL HEADER ----------------- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Left: Official Hospital Brand & Portal Label */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group" title="Brahm Shakti Hospital Home">
              <img
                src="https://res.cloudinary.com/urzka7oz/image/upload/v1795244093/WhatsApp_Image_2026-11-20_at_10.36.32_PM-removebg-preview.png"
                alt="Brahm Shakti Hospital"
                className="h-10 sm:h-12 w-auto object-contain"
              />
              <div className="hidden sm:block border-l border-slate-200 pl-3">
                <div className="text-xs font-black tracking-wider text-[#0B2545] uppercase">
                  OPD APPOINTMENT PORTAL
                </div>
                <div className="text-[11px] font-medium text-[#0A7A74] italic">
                  Trust of Generations
                </div>
              </div>
            </Link>
          </div>

          {/* Right: Desktop Navigation Links (Matching Reference UI) */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-700">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 hover:text-[#0A7A74] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#0A7A74]" />
              <span>Home</span>
            </Link>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-1.5 hover:text-[#0A7A74] transition-colors"
            >
              <Stethoscope className="w-4 h-4 text-[#0A7A74]" />
              <span>Our Doctors</span>
            </Link>
            <button
              type="button"
              onClick={() => setRefundModalOpen(true)}
              className="hover:text-[#0A7A74] transition-colors cursor-pointer"
            >
              Help &amp; Support
            </button>
            <Link
              to={isAuthenticated ? '/patient/dashboard' : '/bookappointment/patient-type'}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#0A7A74]/30 bg-teal-50 hover:bg-[#0A7A74] text-[#0A7A74] hover:text-white font-bold transition-all shadow-2xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>
                {isAuthenticated
                  ? user?.name?.split(' ')[0]
                    ? `${user.name.split(' ')[0]}'s Portal`
                    : 'Patient Portal'
                  : 'Patient Portal'}
              </span>
            </Link>
          </nav>

          {/* Mobile Navigation Toggle Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to={isAuthenticated ? '/patient/dashboard' : '/bookappointment/patient-type'}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#0A7A74]/30 bg-teal-50 text-[#0A7A74] text-xs font-bold"
            >
              <User className="w-3.5 h-3.5" />
              <span>Portal</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 text-sm font-semibold">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-[#0A7A74]"
            >
              Home
            </Link>
            <Link
              to="/doctors"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-[#0A7A74]"
            >
              Our Doctors
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-[#0A7A74]"
            >
              Help &amp; Support
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setRefundModalOpen(true);
              }}
              className="block w-full text-left py-2 text-slate-700 hover:text-[#0A7A74]"
            >
              Refund Policy
            </button>
          </div>
        )}
      </header>

      {/* ----------------- 2. MAIN OPD BOOKING CANVAS ----------------- */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {loadingMeta ? (
          <div className="min-h-[460px] flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-[#0A7A74]" />
            <p className="text-sm font-bold">Connecting to Brahm Shakti OPD Scheduler...</p>
          </div>
        ) : confirmed ? (
          /* ================= OFFICIAL OPD APPOINTMENT SLIP ================= */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-300 shadow-xl p-6 sm:p-9 space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-2 border-b border-slate-200 pb-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B2545]">
                Appointment Confirmed!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Your consultation token is registered in Brahm Shakti Hospital's official OPD queue.
              </p>
            </div>

            {/* Official Slip Details Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Appointment ID</span>
                <span className="font-mono font-black text-[#0B2545] text-base sm:text-lg">
                  {confirmed.appointmentId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Patient Name</span>
                <span className="font-bold text-slate-900">{confirmed.patientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Mobile Number</span>
                <span className="font-mono font-bold text-slate-900">{confirmed.patientPhone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Consulting Doctor</span>
                <span className="font-bold text-[#0A7A74] text-sm">{confirmed.doctorName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Speciality / Department</span>
                <span className="font-bold text-slate-800">{confirmed.departmentName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Date &amp; Time Slot</span>
                <span className="font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-lg">
                  {formattedDisplayDate} · {confirmed.timeSlot}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Consultation Mode</span>
                <span className="font-bold text-slate-800">
                  {confirmed.appointmentType || 'Direct Consultation'}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                <span className="text-slate-500 font-semibold">OPD Consultation Fee</span>
                <span className="font-black text-[#0A7A74] text-base sm:text-lg">
                  ₹{confirmed.fee || activeDoctor?.consultationFee || 700}{' '}
                  <span className="text-xs font-normal text-slate-400">(Pay at Hospital Counter)</span>
                </span>
              </div>
            </div>

            {/* Instruction Notice */}
            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl text-xs text-teal-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-teal-900">
                <Info className="w-4 h-4 text-[#0A7A74]" />
                <span>Patient Check-in Instructions:</span>
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px] sm:text-xs text-teal-800 pl-1">
                <li>Please report to the OPD Reception Counter 15 minutes prior to your time slot.</li>
                <li>
                  Show this digital slip or quote Appointment ID:{' '}
                  <strong className="font-mono font-bold text-teal-950">{confirmed.appointmentId}</strong>.
                </li>
                <li>Registration is completely FREE. Consultation fee is paid at the hospital counter.</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-[#0A7A74] hover:border-[#0A7A74] text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Appointment Slip</span>
              </button>
              <button
                type="button"
                onClick={handleResetBooking}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Another Appointment</span>
              </button>
              <Link
                to="/"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        ) : (
          /* ================= REDESIGNED 3-COLUMN BOOKING INTERFACE ================= */
          <div className="space-y-5 sm:space-y-6">
            {/* ----------------- BREADCRUMB & HERO BANNER ----------------- */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-50/90 via-sky-50/60 to-white border border-teal-100/70 p-5 sm:p-7 shadow-xs">
              {/* Background ambient medical pattern */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-end pr-8">
                <HeartPulse className="w-48 h-48 text-[#0A7A74]" />
              </div>

              <div className="relative z-10 max-w-2xl space-y-1.5">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                  <Link to="/" className="hover:text-[#0A7A74] transition-colors">
                    Home
                  </Link>
                  <span>&gt;</span>
                  <span className="text-[#0A7A74] font-bold">Book Appointment</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B2545] tracking-tight">
                  Book Your Appointment
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Find the right specialist and choose a convenient time.
                </p>
              </div>

              {/* ----------------- INTEGRATED SEARCH & FILTER BAR ----------------- */}
              <div className="relative z-10 mt-5 pt-1">
                <div className="bg-white rounded-2xl p-2 sm:p-2.5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-2">
                  {/* Search input with live suggestion popover */}
                  <div className="relative flex-1 flex items-center">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setDoctorPickerOpen(true);
                      }}
                      onFocus={() => setDoctorPickerOpen(true)}
                      placeholder="Search Doctor, Speciality..."
                      className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-transparent border-0 focus:outline-hidden"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm('');
                          setDoctorPickerOpen(false);
                        }}
                        className="absolute right-3 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Quick Doctor Search Dropdown Popover */}
                    {doctorPickerOpen && filteredDoctors.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 max-h-64 overflow-y-auto z-50 p-2 divide-y divide-slate-100">
                        {filteredDoctors.map((doc) => (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => {
                              setSelectedDoctorId(doc.id);
                              if (doc.departmentId) setSelectedDeptId(doc.departmentId);
                              setDoctorPickerOpen(false);
                              setSearchTerm('');
                            }}
                            className={`w-full flex items-center gap-3 p-2.5 text-left rounded-xl hover:bg-teal-50/70 transition-colors cursor-pointer ${
                              doc.id === selectedDoctorId ? 'bg-teal-50/90 font-bold' : ''
                            }`}
                          >
                            <img
                              src={doc.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'}
                              alt={doc.name}
                              className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-slate-900 truncate">
                                {doc.name}
                              </div>
                              <div className="text-[11px] text-[#0A7A74] truncate">
                                {doc.departmentName || doc.designation}
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                              ₹{doc.consultationFee || 700}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Specialities Dropdown */}
                  <div className="md:w-64 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-2">
                    <select
                      value={selectedDeptId}
                      onChange={(e) => {
                        const newDept = e.target.value;
                        setSelectedDeptId(newDept);
                        if (newDept) {
                          const docInDept = doctors.find(
                            (d) =>
                              d.departmentId === newDept ||
                              d.department?.toLowerCase() === newDept.toLowerCase()
                          );
                          if (docInDept) setSelectedDoctorId(docInDept.id);
                        }
                      }}
                      className="w-full px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-transparent border-0 focus:outline-hidden cursor-pointer"
                    >
                      <option value="">All Specialities</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Search Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setDoctorPickerOpen(false);
                      if (filteredDoctors.length > 0) {
                        setSelectedDoctorId(filteredDoctors[0].id);
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs sm:text-sm font-bold shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shrink-0 text-center"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* ----------------- THREE-COLUMN BENTO GRID ----------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
              {/* ================= COLUMN 1: DOCTOR CARD (Left ~30%) ================= */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
                {activeDoctor ? (
                  <>
                    {/* Doctor Portrait Image */}
                    <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3] sm:aspect-[1/1] max-h-64 mx-auto w-full border border-slate-200/80 shadow-2xs">
                      <img
                        src={activeDoctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600'}
                        alt={activeDoctor.name}
                        className="w-full h-full object-cover object-top"
                      />
                      {activeDoctor.category && (
                        <div className="absolute top-2.5 right-2.5 bg-emerald-600/90 text-white backdrop-blur-xs text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                          {activeDoctor.category}
                        </div>
                      )}
                    </div>

                    {/* Doctor Name & Speciality */}
                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-black text-[#0B2545] tracking-tight leading-tight">
                        {activeDoctor.name}
                      </h2>
                      <p className="text-xs sm:text-sm font-bold text-[#0A7A74]">
                        {activeDoctor.departmentName || activeDoctor.department || 'Internal Medicine & Diabetology'}
                      </p>
                      {/* Rating Badge */}
                      <div className="flex items-center gap-1.5 pt-0.5 text-xs text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{activeDoctor.rating || 4.9}</span>
                        <span className="text-slate-400 font-normal">
                          (120+ reviews)
                        </span>
                      </div>
                    </div>

                    {/* Doctor Key Metadata (Qualifications, Experience, Room) */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-700">
                      {activeDoctor.qualification && (
                        <div className="flex items-center gap-2.5">
                          <GraduationCap className="w-4 h-4 text-[#0A7A74] shrink-0" />
                          <span className="font-semibold text-slate-800">
                            {activeDoctor.qualification}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-[#0A7A74] shrink-0" />
                        <span className="font-semibold text-slate-800">
                          {activeDoctor.experienceYears
                            ? `${activeDoctor.experienceYears}+ years experience`
                            : '18+ years experience'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-[#0A7A74] shrink-0" />
                        <span className="font-semibold text-slate-800">
                          {activeDoctor.room || 'OPD Chamber 101, Block A'}
                        </span>
                      </div>
                    </div>

                    {/* View Full Profile Link Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setProfileModalOpen(true)}
                        className="w-full py-2.5 rounded-xl border border-teal-200 bg-teal-50/60 hover:bg-[#0A7A74] text-[#0A7A74] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <span>View Full Profile</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <User className="w-10 h-10 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">Select a doctor to view their profile</p>
                  </div>
                )}
              </div>

              {/* ================= COLUMN 2: BOOKING SELECTION (Center ~45%) ================= */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-5">
                {/* 1. Consultation Type Switcher (Direct vs Video) */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Direct Consultation Card */}
                  <button
                    type="button"
                    onClick={() => setConsultationMode('direct')}
                    className={`relative p-3.5 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${
                      consultationMode === 'direct'
                        ? 'border-[#0A7A74] bg-teal-50/40 shadow-xs ring-1 ring-[#0A7A74]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#0A7A74] text-white flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                        Direct Consultation
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        Visit Doctor in Person
                      </div>
                    </div>
                    {consultationMode === 'direct' && (
                      <div className="w-4 h-4 rounded-full bg-[#0A7A74] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>

                  {/* Video Consultation Card */}
                  <button
                    type="button"
                    onClick={() => setConsultationMode('video')}
                    className={`relative p-3.5 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${
                      consultationMode === 'video'
                        ? 'border-[#2563EB] bg-blue-50/40 shadow-xs ring-1 ring-[#2563EB]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                      <Video className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                        Video Consultation
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        Consult Online
                      </div>
                    </div>
                    {consultationMode === 'video' && (
                      <div className="w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                </div>

                {/* 2. Select Appointment Date */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900">
                      <CalendarDays className="w-4 h-4 text-[#0A7A74]" />
                      <span>Select Appointment Date</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#0A7A74]">
                      {formattedDisplayDate}
                    </span>
                  </div>

                  {/* Date Strip Carousel */}
                  <div className="relative flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrevDays}
                      disabled={dateStripStartIndex === 0}
                      className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 flex items-center justify-center shrink-0 shadow-2xs transition-all cursor-pointer"
                      aria-label="Previous dates"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div
                      ref={dateStripRef}
                      className="flex-1 grid grid-cols-7 gap-1 sm:gap-1.5"
                    >
                      {visibleDays.map((d) => {
                        const isSelected = d.iso === date;
                        return (
                          <button
                            key={d.iso}
                            type="button"
                            onClick={() => setDate(d.iso)}
                            className={`py-2 px-1 rounded-2xl text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#0A7A74] text-white shadow-md scale-102 font-bold'
                                : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                            }`}
                          >
                            <span
                              className={`text-[10px] uppercase font-bold ${
                                isSelected ? 'text-teal-100' : 'text-slate-500'
                              }`}
                            >
                              {d.dayName}
                            </span>
                            <span className="text-sm sm:text-base font-black my-0.5">
                              {d.dayNumber}
                            </span>
                            <span
                              className={`text-[9px] uppercase font-medium ${
                                isSelected ? 'text-teal-100' : 'text-slate-400'
                              }`}
                            >
                              {d.monthName}
                            </span>
                            <div
                              className={`w-1.5 h-1.5 rounded-full mt-1 ${
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
                      className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 flex items-center justify-center shrink-0 shadow-2xs transition-all cursor-pointer"
                      aria-label="Next dates"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 3. Select Time Slot */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900">
                      <Clock className="w-4 h-4 text-[#0A7A74]" />
                      <span>Select Time Slot</span>
                    </div>
                    {!isAuthenticated && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        Sign in / Register to Confirm
                      </span>
                    )}
                  </div>

                  {slotsLoading ? (
                    <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin text-[#0A7A74]" />
                      <span className="text-xs font-semibold">Loading available slots...</span>
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 text-center space-y-1">
                      <p className="font-bold">No slots available for this date.</p>
                      <p className="text-[11px] text-amber-700">Please choose another day.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {slots.map((s) => {
                        const isFull = s.isClosed || s.remaining <= 0;
                        const isSelected = selectedSlot === s.timeSlot;
                        return (
                          <button
                            key={s.timeSlot}
                            type="button"
                            disabled={isFull}
                            onClick={() => {
                              setSelectedSlot(s.timeSlot);
                            }}
                            className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                              isFull
                                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                                : isSelected
                                ? 'bg-[#0A7A74] border-[#0A7A74] text-white shadow-sm font-bold'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-[#0A7A74] hover:bg-teal-50/30 font-semibold'
                            }`}
                          >
                            <div className="text-xs font-bold leading-tight">
                              {s.timeSlot}
                              {isSelected && <span className="ml-1 text-[11px]">✓</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Slot Status Legend */}
                  <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0A7A74]" />
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                      <span>Unavailable</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= COLUMN 3: BOOKING SUMMARY (Right ~25%) ================= */}
              <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  {/* Teal Top Header Bar */}
                  <div className="bg-[#0A7A74] px-5 py-3 text-white">
                    <h3 className="font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-200" />
                      <span>Booking Summary</span>
                    </h3>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Mini Doctor Info Row */}
                    {activeDoctor && (
                      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <img
                          src={activeDoctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'}
                          alt={activeDoctor.name}
                          className="w-10 h-10 rounded-full object-cover object-top border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate">
                            {activeDoctor.name}
                          </h4>
                          <p className="text-[11px] font-semibold text-[#0A7A74] truncate">
                            {activeDoctor.departmentName || activeDoctor.designation}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Summary Metadata Details with Icons */}
                    <div className="space-y-3 text-xs">
                      {/* Date */}
                      <div className="flex items-start gap-2.5">
                        <Calendar className="w-4 h-4 text-[#0A7A74] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Date
                          </span>
                          <span className="font-bold text-slate-800">
                            {formattedDisplayDate}
                          </span>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-[#0A7A74] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Time Slot
                          </span>
                          <span className="font-bold text-slate-800">
                            {selectedSlot || 'Please select a slot'}
                          </span>
                        </div>
                      </div>

                      {/* Consultation Type */}
                      <div className="flex items-start gap-2.5">
                        <User className="w-4 h-4 text-[#0A7A74] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Consultation Type
                          </span>
                          <span className="font-bold text-slate-800">
                            {consultationMode === 'video' ? 'Video Consultation' : 'Direct Consultation'}
                          </span>
                        </div>
                      </div>

                      {/* Transparent Fee Structure */}
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Consultation Fee:</span>
                          <span className="font-bold text-slate-900">
                            ₹{activeDoctor?.consultationFee || 700}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Patient Registration:</span>
                          <span className="font-bold text-emerald-600">
                            FREE (₹0)
                          </span>
                        </div>
                        <div className="flex items-center justify-between font-black text-slate-900 pt-1 border-t border-dashed border-slate-200 text-sm">
                          <span>Pay at OPD Counter:</span>
                          <span className="text-[#0A7A74]">
                            ₹{activeDoctor?.consultationFee || 700}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Appointment CTA */}
                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={handleProceedOrConfirm}
                    disabled={!activeDoctor || !selectedSlot}
                    className="w-full py-3 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Confirm Appointment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ----------------- 4. HOSPITAL POLICY NOTICE BANNER ----------------- */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center shrink-0 border border-teal-200">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-800">
                    Registration Fee: ₹0 (100% Free)
                  </span>
                  <span className="mx-2 text-slate-300">|</span>
                  <span className="text-slate-600">
                    OPD Consultation: ₹{activeDoctor?.consultationFee || 700} payable at hospital counter.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRefundModalOpen(true)}
                className="text-[#0A7A74] font-bold hover:underline shrink-0 cursor-pointer"
              >
                Refund Policy: Refund available as per hospital policy →
              </button>
            </div>

            {/* ----------------- 5. TRUST & SECURITY STRIP ----------------- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {/* Badge 1: 100% Secure & Trusted */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0A7A74] flex items-center justify-center shrink-0 border border-teal-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                    100% Secure &amp; Trusted
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Your data is safe with us
                  </div>
                </div>
              </div>

              {/* Badge 2: Need Help */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0A7A74] flex items-center justify-center shrink-0 border border-teal-100">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                    Need Help? 011-42254000
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Mon - Sat, 9 AM - 6 PM
                  </div>
                </div>
              </div>

              {/* Badge 3: Email Support */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0A7A74] flex items-center justify-center shrink-0 border border-teal-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                    support@brahmshakti.com
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Official Hospital Helpdesk
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ----------------- 6. MOBILE STICKY CONFIRMATION BAR ----------------- */}
      {!confirmed && activeDoctor && (
        <div className="md:hidden sticky bottom-0 z-40 bg-white border-t border-slate-200 shadow-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={activeDoctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'}
              alt={activeDoctor.name}
              className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
            />
            <div className="min-w-0">
              <div className="text-xs font-black text-slate-900 truncate">
                {activeDoctor.name}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold truncate">
                {formattedDisplayDate} · {selectedSlot || 'Pick Slot'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleProceedOrConfirm}
            disabled={!selectedSlot}
            className="px-4 py-2.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold shrink-0 transition-all shadow-xs"
          >
            Confirm →
          </button>
        </div>
      )}

      {/* ----------------- 7. DEDICATED PORTAL FOOTER ----------------- */}
      <footer className="bg-white border-t border-slate-200 mt-8 py-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="font-semibold">
            &copy; 2026 Brahm Shakti Hospital &amp; Research Centre. All Rights Reserved.
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-300 bg-teal-50 text-[#0A7A74] font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-[#0A7A74]" />
            <span>NABH &amp; NABL Accredited Healthcare</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link to="/privacy-policy" className="hover:text-[#0A7A74] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-use" className="hover:text-[#0A7A74] transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </footer>

      {/* ================= MODAL 1: VIEW FULL DOCTOR PROFILE ================= */}
      {profileModalOpen && activeDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="bg-[#0A7A74] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-200" />
                <h3 className="text-base font-black">Doctor Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex flex-col sm:flex-row items-center gap-5 pb-4 border-b border-slate-200 text-center sm:text-left">
                <img
                  src={activeDoctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'}
                  alt={activeDoctor.name}
                  className="w-24 h-24 rounded-2xl object-cover object-top border-2 border-[#0A7A74]/30 shadow-xs"
                />
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-[#0B2545]">
                    {activeDoctor.name}
                  </h4>
                  <p className="text-xs font-bold text-[#0A7A74]">
                    {activeDoctor.designation || 'Senior Consultant'}
                  </p>
                  <p className="text-xs text-slate-600 font-semibold">
                    {activeDoctor.departmentName}
                  </p>
                  {activeDoctor.dmcNo && (
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[10px] font-bold text-[#0A7A74]">
                      DMC Registration: {activeDoctor.dmcNo}
                    </span>
                  )}
                </div>
              </div>

              {/* Bio */}
              {activeDoctor.bio && (
                <div className="space-y-1">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    About the Doctor
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {activeDoctor.bio}
                  </p>
                </div>
              )}

              {/* Specializations */}
              {activeDoctor.specializations && activeDoctor.specializations.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Clinical Specializations
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDoctor.specializations.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-teal-50 text-[#0A7A74] text-xs font-semibold border border-teal-100"
                      >
                        ✓ {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* OPD Details */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    OPD Chamber
                  </span>
                  <span className="font-bold text-slate-800">
                    {activeDoctor.room || 'Room 101, Block A'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    OPD Schedule
                  </span>
                  <span className="font-bold text-slate-800">
                    {activeDoctor.opdSchedule || 'Mon - Sat (09 AM - 01 PM)'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="w-full py-3 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
              >
                Continue Booking with {activeDoctor.name}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: PATIENT BOOKING VERIFICATION MODAL ================= */}
      {bookingModalOpen && activeDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto border border-slate-200">
            <div className="bg-[#0A7A74] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="text-base font-black">Patient Details &amp; Slot Confirmation</h3>
                <p className="text-xs text-teal-100 mt-0.5">
                  {activeDoctor.name} · {formattedDisplayDate} · {selectedSlot}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Age
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="e.g. 45"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    UHID (Optional)
                  </label>
                  <input
                    type="text"
                    value={uhid}
                    onChange={(e) => setUhid(e.target.value)}
                    placeholder="e.g. BSH-10294"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="patient@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Chief Complaint / Symptoms (Optional)
                </label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Briefly describe health concerns (e.g. fever for 3 days, joint pain)..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                />
              </div>

              {/* Summary note */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Consultation Type:</span>
                  <span className="font-bold text-slate-800">
                    {consultationMode === 'video' ? 'Video Consultation' : 'Direct OPD Visit'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Registration Fee:</span>
                  <span className="font-bold text-emerald-600">FREE (₹0)</span>
                </div>
                <div className="flex justify-between">
                  <span>Consultation Fee:</span>
                  <span className="font-bold text-[#0A7A74]">
                    ₹{activeDoctor.consultationFee || 700} (Pay at Hospital Counter)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs sm:text-sm font-black shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <span>Confirm &amp; Generate Slip</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: REFUND & RESCHEDULE POLICY ================= */}
      {refundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="bg-[#0A7A74] text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Hospital Refund &amp; Cancellation Policy</span>
              </h3>
              <button
                type="button"
                onClick={() => setRefundModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-900">
                Brahm Shakti Hospital's Patient-Friendly Policy:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-600">
                <li>
                  <strong>100% Free Registration:</strong> Registration on our portal is completely complimentary.
                </li>
                <li>
                  <strong>No Upfront Consultation Charge:</strong> Consultation fees are payable upon check-in at the hospital OPD counter.
                </li>
                <li>
                  <strong>Free Rescheduling:</strong> Patients may reschedule consultation date or slot without any penalty.
                </li>
                <li>
                  <strong>Doctor Unavailability:</strong> If a scheduled doctor is called for emergency surgery, patients are offered an immediate alternative senior consultant or priority rescheduling.
                </li>
              </ul>
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setRefundModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#0A7A74] text-white font-bold text-xs hover:bg-[#08635e] transition-colors cursor-pointer"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationPage;
