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
  CheckCircle2,
  Printer,
  ShieldCheck,
  PhoneCall,
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
  Info,
  X,
  MapPin,
  GraduationCap,
  Award,
  CalendarDays,
  Loader2,
  Check,
  Star,
  Menu,
  FileText,
  HeartPulse
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { departmentsData, doctorsData } from '../../data/seedData';

const todayISO = () => new Date().toISOString().split('T')[0];

// Standard time slots for OPD sessions
const DEFAULT_OPD_SLOTS = [
  { timeSlot: '08:00 AM - 08:30 AM', remaining: 3, isClosed: false },
  { timeSlot: '08:30 AM - 09:00 AM', remaining: 4, isClosed: false },
  { timeSlot: '09:00 AM - 09:30 AM', remaining: 5, isClosed: false },
  { timeSlot: '09:30 AM - 10:00 AM', remaining: 2, isClosed: false },
  { timeSlot: '10:00 AM - 10:30 AM', remaining: 4, isClosed: false },
  { timeSlot: '10:30 AM - 11:00 AM', remaining: 3, isClosed: false },
  { timeSlot: '11:00 AM - 11:30 AM', remaining: 1, isClosed: false },
  { timeSlot: '11:30 AM - 12:00 PM', remaining: 3, isClosed: false },
  { timeSlot: '12:00 PM - 12:30 PM', remaining: 4, isClosed: false },
  { timeSlot: '12:30 PM - 01:00 PM', remaining: 2, isClosed: false },
  { timeSlot: '02:00 PM - 02:30 PM', remaining: 5, isClosed: false },
  { timeSlot: '02:30 PM - 03:00 PM', remaining: 3, isClosed: false }
];

export const ConsultationPage = () => {
  const [searchParams] = useSearchParams();
  const preDoctor = searchParams.get('doctor') || '';
  const preDept = searchParams.get('specialty') || searchParams.get('department') || '';
  const preDate = searchParams.get('date') || todayISO();
  const preSlot = searchParams.get('slot') || '';

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Consultation mode: strictly onsite OPD visit (hospital visit)
  const consultationMode = 'direct';

  // Metadata
  const [departments, setDepartments] = useState(departmentsData || []);
  const [doctors, setDoctors] = useState(doctorsData || []);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // Department & Doctor linked dropdown selection
  const [selectedDeptId, setSelectedDeptId] = useState(preDept);
  const [selectedDoctorId, setSelectedDoctorId] = useState(preDoctor);

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

        // Determine initially selected doctor and department
        if (preDoctor) {
          const match = loadedDoctors.find(
            (d) => d.id === preDoctor || d.name?.toLowerCase().includes(preDoctor.toLowerCase())
          );
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

  // Doctors filtered by selected department
  const doctorsInDepartment = useMemo(() => {
    if (!selectedDeptId) return doctors;
    const filtered = doctors.filter(
      (d) =>
        d.departmentId === selectedDeptId ||
        d.department?.toLowerCase() === selectedDeptId.toLowerCase()
    );
    return filtered.length > 0 ? filtered : doctors;
  }, [doctors, selectedDeptId]);

  // Active selected doctor object
  const activeDoctor = useMemo(() => {
    if (!doctors || doctors.length === 0) return null;
    return (
      doctors.find((d) => d.id === selectedDoctorId) ||
      doctorsInDepartment[0] ||
      doctors[0]
    );
  }, [doctors, selectedDoctorId, doctorsInDepartment]);

  // When user changes department dropdown: update doctor dropdown to first doctor of that department
  const handleDepartmentChange = (newDeptId) => {
    setSelectedDeptId(newDeptId);
    if (newDeptId) {
      const matchDocs = doctors.filter(
        (d) =>
          d.departmentId === newDeptId ||
          d.department?.toLowerCase() === newDeptId.toLowerCase()
      );
      if (matchDocs.length > 0) {
        setSelectedDoctorId(matchDocs[0].id);
      }
    } else if (doctors.length > 0) {
      setSelectedDoctorId(doctors[0].id);
    }
  };

  // When user changes doctor dropdown: update department dropdown to that doctor's department
  const handleDoctorChange = (newDocId) => {
    setSelectedDoctorId(newDocId);
    const doc = doctors.find((d) => d.id === newDocId);
    if (doc?.departmentId) {
      setSelectedDeptId(doc.departmentId);
    }
  };

  // Generate upcoming days for the horizontal calendar strip
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

  // Visible window of days in the carousel strip (shows 7 at a time)
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

  // Sync selected date with visible strip if date is changed externally
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
        setSlots(DEFAULT_OPD_SLOTS);
        if (!selectedSlot) setSelectedSlot(DEFAULT_OPD_SLOTS[0].timeSlot);
      }
    } catch {
      setSlots(DEFAULT_OPD_SLOTS);
      if (!selectedSlot) setSelectedSlot(DEFAULT_OPD_SLOTS[0].timeSlot);
    } finally {
      setSlotsLoading(false);
    }
  }, [activeDoctor, date, preSlot, selectedSlot]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  // Formatted date string for display (e.g. "Mon, Nov 24, 2026")
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
    // Authenticated user: open patient details verification modal
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
        appointmentType: 'Direct OPD Consultation (Onsite)',
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
      {/* ----------------- 1. COMPACT PORTAL NAVBAR ----------------- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
          {/* Left: Hospital Brand & Portal Label */}
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
                <div className="text-[10px] font-medium text-[#0A7A74] italic leading-tight">
                  Trust of Generations
                </div>
              </div>
            </Link>
          </div>

          {/* Right: Portal Links (Exact match to reference image) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-xs sm:text-sm font-bold text-slate-800">
            <Link
              to="/"
              className="hover:text-[#0A7A74] transition-colors"
            >
              Back Home
            </Link>
            <button
              type="button"
              onClick={() => setRefundModalOpen(true)}
              className="hover:text-[#0A7A74] transition-colors cursor-pointer font-bold"
            >
              Refund Policy
            </button>
            <Link
              to="/privacy-policy"
              className="hover:text-[#0A7A74] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-use"
              className="hover:text-[#0A7A74] transition-colors"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              to="/contact"
              className="hover:text-[#0A7A74] transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to={isAuthenticated ? '/patient/dashboard' : '/bookappointment/patient-type'}
              className="text-[#0A7A74] font-black hover:underline transition-colors"
            >
              Patient Portal
            </Link>
          </nav>

          {/* Mobile Navigation Toggle Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to={isAuthenticated ? '/patient/dashboard' : '/bookappointment/patient-type'}
              className="text-[#0A7A74] text-xs font-black px-2 py-1"
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
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2.5 text-xs font-bold text-slate-800">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#0A7A74]"
            >
              Back Home
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setRefundModalOpen(true);
              }}
              className="block w-full text-left py-1 hover:text-[#0A7A74]"
            >
              Refund Policy
            </button>
            <Link
              to="/privacy-policy"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#0A7A74]"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-use"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#0A7A74]"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#0A7A74]"
            >
              Contact Us
            </Link>
            <Link
              to={isAuthenticated ? '/patient/dashboard' : '/bookappointment/patient-type'}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 text-[#0A7A74] font-black"
            >
              Patient Portal
            </Link>
          </div>
        )}
      </header>

      {/* ----------------- 2. MAIN COMPACT OPD BOOKING CANVAS ----------------- */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        {loadingMeta ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-7 h-7 animate-spin text-[#0A7A74]" />
            <p className="text-xs sm:text-sm font-bold">Connecting to Brahm Shakti OPD Scheduler...</p>
          </div>
        ) : confirmed ? (
          /* ================= OFFICIAL OPD APPOINTMENT SLIP ================= */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-300 shadow-xl p-5 sm:p-8 space-y-5 animate-in fade-in duration-200">
            <div className="text-center space-y-1.5 border-b border-slate-200 pb-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black text-[#0B2545]">
                Appointment Confirmed!
              </h1>
              <p className="text-xs text-slate-500">
                Your consultation token is registered in Brahm Shakti Hospital's official OPD queue.
              </p>
            </div>

            {/* Official Slip Details Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Appointment ID</span>
                <span className="font-mono font-black text-[#0B2545] text-base">
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
                <span className="font-bold text-[#0A7A74]">{confirmed.doctorName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Speciality / Department</span>
                <span className="font-bold text-slate-800">{confirmed.departmentName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Date &amp; Time Slot</span>
                <span className="font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-md">
                  {formattedDisplayDate} · {confirmed.timeSlot}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Consultation Mode</span>
                <span className="font-bold text-slate-800">
                  Direct OPD Consultation (Onsite Hospital Visit)
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-2.5">
                <span className="text-slate-500 font-semibold">OPD Consultation Fee</span>
                <span className="font-black text-[#0A7A74] text-base">
                  ₹{confirmed.fee || activeDoctor?.consultationFee || 700}{' '}
                  <span className="text-xs font-normal text-slate-400">(Pay at Hospital Counter)</span>
                </span>
              </div>
            </div>

            {/* Instruction Notice */}
            <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-teal-900">
                <Info className="w-4 h-4 text-[#0A7A74]" />
                <span>Patient Check-in Instructions:</span>
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-teal-800 pl-1">
                <li>Please report to the OPD Reception Counter 15 minutes prior to your time slot.</li>
                <li>
                  Show this digital slip or quote Appointment ID:{' '}
                  <strong className="font-mono font-bold text-teal-950">{confirmed.appointmentId}</strong>.
                </li>
                <li>Registration is completely FREE. Consultation fee is paid at the hospital counter.</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:text-[#0A7A74] hover:border-[#0A7A74] text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Appointment Slip</span>
              </button>
              <button
                type="button"
                onClick={handleResetBooking}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Another Appointment</span>
              </button>
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        ) : (
          /* ================= COMPACT HIGH-EFFICIENCY BOOKING WORKSPACE ================= */
          <div className="space-y-3 sm:space-y-4">
            {/* ----------------- UNIFIED TOP BAR: BREADCRUMB + 2 LINKED DROPDOWNS ----------------- */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 sm:p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Title & Onsite Tag */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                    <Link to="/" className="hover:text-[#0A7A74] transition-colors">
                      Home
                    </Link>
                    <span>&gt;</span>
                    <span className="text-[#0A7A74] font-bold">Book Appointment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-black text-[#0B2545] tracking-tight">
                      Book OPD Appointment
                    </h1>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 shrink-0">
                      Onsite Hospital Visit
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Select department and doctor to reserve your consultation slot.
                  </p>
                </div>

                {/* THE 2 LINKED DROPDOWNS: DEPARTMENT + DOCTOR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 lg:w-[620px] shrink-0">
                  {/* Dropdown 1: Department / Speciality */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Building className="w-3 h-3 text-[#0A7A74]" />
                      <span>1. Select Department</span>
                    </label>
                    <select
                      value={selectedDeptId}
                      onChange={(e) => handleDepartmentChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50/70 hover:bg-white text-xs font-bold text-slate-800 focus:bg-white focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden cursor-pointer transition-all shadow-2xs"
                    >
                      <option value="">All 9 Departments</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dropdown 2: Consulting Doctor */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <User className="w-3 h-3 text-[#0A7A74]" />
                      <span>2. Select Doctor</span>
                    </label>
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => handleDoctorChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50/70 hover:bg-white text-xs font-bold text-slate-800 focus:bg-white focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden cursor-pointer transition-all shadow-2xs"
                    >
                      {doctorsInDepartment.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} {doc.qualification ? `(${doc.qualification})` : ''} - {doc.departmentName || doc.department}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* ----------------- THREE-COLUMN BENTO GRID ----------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
              {/* ================= COLUMN 1: DOCTOR CARD (Left ~30%) ================= */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-3">
                {activeDoctor ? (
                  <>
                    {/* Doctor Portrait Image - Keeps exact box size, displays proper full face of the doctor */}
                    <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200/80 h-36 sm:h-44 w-full border border-slate-200/80 shadow-2xs flex items-center justify-center">
                      {/* Ambient blurred backdrop so background blends smoothly */}
                      {activeDoctor.image && (
                        <img
                          src={activeDoctor.image}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-25 pointer-events-none select-none"
                        />
                      )}
                      {/* Doctor face displayed fully and properly without cutting */}
                      <img
                        src={activeDoctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600'}
                        alt={activeDoctor.name}
                        className="relative z-10 h-full w-auto max-w-full object-contain object-center drop-shadow-xs"
                      />
                      {activeDoctor.category && (
                        <div className="absolute top-2 right-2 z-20 bg-emerald-600/90 text-white backdrop-blur-xs text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                          {activeDoctor.category}
                        </div>
                      )}
                    </div>

                    {/* Doctor Name & Speciality */}
                    <div className="space-y-0.5">
                      <h2 className="text-base sm:text-lg font-black text-[#0B2545] tracking-tight leading-snug">
                        {activeDoctor.name}
                      </h2>
                      <p className="text-xs font-bold text-[#0A7A74]">
                        {activeDoctor.departmentName || activeDoctor.department}
                      </p>
                      {/* Rating Badge */}
                      <div className="flex items-center gap-1.5 pt-0.5 text-xs text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{activeDoctor.rating || 4.9}</span>
                        <span className="text-slate-400 font-normal text-[11px]">
                          (120+ reviews)
                        </span>
                      </div>
                    </div>

                    {/* Doctor Metadata (Qualifications, Experience, Room) */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-700">
                      {activeDoctor.qualification && (
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-3.5 h-3.5 text-[#0A7A74] shrink-0" />
                          <span className="font-semibold text-slate-800 truncate">
                            {activeDoctor.qualification}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-[#0A7A74] shrink-0" />
                        <span className="font-semibold text-slate-800">
                          {activeDoctor.experienceYears
                            ? `${activeDoctor.experienceYears}+ years experience`
                            : '18+ years experience'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#0A7A74] shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">
                          {activeDoctor.room || 'OPD Chamber 101, Block A'}
                        </span>
                      </div>
                    </div>

                    {/* View Full Profile Link Button */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setProfileModalOpen(true)}
                        className="w-full py-2 rounded-xl border border-teal-200 bg-teal-50/60 hover:bg-[#0A7A74] text-[#0A7A74] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <span>View Full Profile</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center text-slate-400 space-y-1.5">
                    <User className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">Select a doctor to view profile</p>
                  </div>
                )}
              </div>

              {/* ================= COLUMN 2: BOOKING SELECTION (Center ~45%) ================= */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-4">
                {/* 1. Header with Onsite OPD Badge (Video Consultation removed completely) */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-[#0A7A74]" />
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      Select Appointment Date
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#0A7A74]">
                    {formattedDisplayDate}
                  </span>
                </div>

                {/* 2. Compact Date Strip Carousel */}
                <div className="relative flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevDays}
                    disabled={dateStripStartIndex === 0}
                    className="w-7 h-7 rounded-full border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 flex items-center justify-center shrink-0 shadow-2xs transition-all cursor-pointer"
                    aria-label="Previous dates"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div
                    ref={dateStripRef}
                    className="flex-1 grid grid-cols-7 gap-1"
                  >
                    {visibleDays.map((d) => {
                      const isSelected = d.iso === date;
                      return (
                        <button
                          key={d.iso}
                          type="button"
                          onClick={() => setDate(d.iso)}
                          className={`py-1.5 px-0.5 rounded-xl text-center flex flex-col items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#0A7A74] text-white shadow-xs font-bold'
                              : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                          }`}
                        >
                          <span
                            className={`text-[9px] uppercase font-bold ${
                              isSelected ? 'text-teal-100' : 'text-slate-500'
                            }`}
                          >
                            {d.dayName}
                          </span>
                          <span className="text-xs sm:text-sm font-black my-0.5">
                            {d.dayNumber}
                          </span>
                          <span
                            className={`text-[8px] uppercase font-medium ${
                              isSelected ? 'text-teal-100' : 'text-slate-400'
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
                    className="w-7 h-7 rounded-full border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 flex items-center justify-center shrink-0 shadow-2xs transition-all cursor-pointer"
                    aria-label="Next dates"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* 3. Select Time Slot */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-slate-900">
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
                    <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin text-[#0A7A74]" />
                      <span className="text-xs font-semibold">Loading available slots...</span>
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 text-center space-y-1">
                      <p className="font-bold">No slots available for this date.</p>
                      <p className="text-[11px] text-amber-700">Please choose another day.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
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
                            className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                              isFull
                                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                                : isSelected
                                ? 'bg-[#0A7A74] border-[#0A7A74] text-white shadow-xs font-bold'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-[#0A7A74] hover:bg-teal-50/30 font-semibold'
                            }`}
                          >
                            <div className="text-[11px] font-bold leading-tight">
                              {s.timeSlot}
                              {isSelected && <span className="ml-1 text-[10px]">✓</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Slot Status Legend */}
                  <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0A7A74]" />
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <span>Unavailable</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= COLUMN 3: BOOKING SUMMARY (Right ~25%) ================= */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between">
                <div>
                  {/* Teal Top Header Bar */}
                  <div className="bg-[#0A7A74] px-4 py-2.5 text-white">
                    <h3 className="font-extrabold text-xs sm:text-sm tracking-wide flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-teal-200" />
                      <span>Booking Summary</span>
                    </h3>
                  </div>

                  <div className="p-3.5 sm:p-4 space-y-3">
                    {/* Mini Doctor Info Row */}
                    {activeDoctor && (
                      <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                        <img
                          src={activeDoctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'}
                          alt={activeDoctor.name}
                          className="w-9 h-9 rounded-full object-cover object-top border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-slate-900 leading-tight truncate">
                            {activeDoctor.name}
                          </h4>
                          <p className="text-[10px] font-semibold text-[#0A7A74] truncate">
                            {activeDoctor.departmentName || activeDoctor.designation}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Summary Metadata Details with Icons */}
                    <div className="space-y-2 text-xs">
                      {/* Date */}
                      <div className="flex items-start gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#0A7A74] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">
                            Date
                          </span>
                          <span className="font-bold text-slate-800 text-[11px]">
                            {formattedDisplayDate}
                          </span>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#0A7A74] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">
                            Time Slot
                          </span>
                          <span className="font-bold text-slate-800 text-[11px]">
                            {selectedSlot || 'Select slot'}
                          </span>
                        </div>
                      </div>

                      {/* Consultation Type (Onsite Only) */}
                      <div className="flex items-start gap-2">
                        <User className="w-3.5 h-3.5 text-[#0A7A74] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">
                            Consultation Mode
                          </span>
                          <span className="font-bold text-slate-800 text-[11px]">
                            Direct Consultation (Onsite Visit)
                          </span>
                        </div>
                      </div>

                      {/* Transparent Fee Structure */}
                      <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-slate-600 text-[11px]">
                          <span>Consultation Fee:</span>
                          <span className="font-bold text-slate-900">
                            ₹{activeDoctor?.consultationFee || 700}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600 text-[11px]">
                          <span>Patient Registration:</span>
                          <span className="font-bold text-emerald-600">
                            FREE (₹0)
                          </span>
                        </div>
                        <div className="flex items-center justify-between font-black text-slate-900 pt-1 border-t border-dashed border-slate-200 text-xs sm:text-sm">
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
                <div className="p-3.5 sm:p-4 pt-0">
                  <button
                    type="button"
                    onClick={handleProceedOrConfirm}
                    disabled={!activeDoctor || !selectedSlot}
                    className="w-full py-2.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-extrabold shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Confirm Appointment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* ----------------- 4. COMPACT NOTICE & TRUST STRIP ----------------- */}
            <div className="bg-white rounded-xl border border-slate-200 px-3.5 py-2.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#0A7A74] shrink-0" />
                <span>
                  <strong>100% Free Registration:</strong> Subsidized OPD Consultation Fee of ₹{activeDoctor?.consultationFee || 700} is payable only at the hospital counter.
                </span>
              </div>
              <div className="flex items-center gap-4 shrink-0 font-medium">
                <span className="text-slate-500">
                  Helpdesk: <strong>011-42254000</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setRefundModalOpen(true)}
                  className="text-[#0A7A74] font-bold hover:underline cursor-pointer"
                >
                  Refund Policy →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ----------------- 5. MOBILE STICKY CONFIRMATION BAR ----------------- */}
      {!confirmed && activeDoctor && (
        <div className="md:hidden sticky bottom-0 z-40 bg-white border-t border-slate-200 shadow-xl px-3 py-2 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={activeDoctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'}
              alt={activeDoctor.name}
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
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
            className="px-3.5 py-2 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold shrink-0 transition-all shadow-xs"
          >
            Confirm →
          </button>
        </div>
      )}

      {/* ----------------- 6. COMPACT PORTAL FOOTER ----------------- */}
      <footer className="bg-white border-t border-slate-200 mt-4 py-3">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-slate-600">
          <div className="font-semibold">
            &copy; 2026 Brahm Shakti Hospital &amp; Research Centre. All Rights Reserved.
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-teal-300 bg-teal-50 text-[#0A7A74] font-bold text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0A7A74]" />
            <span>NABH &amp; NABL Accredited Healthcare</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-medium">
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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[88vh] overflow-y-auto border border-slate-200">
            <div className="bg-[#0A7A74] text-white px-5 py-3.5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-200" />
                <h3 className="text-sm font-black">Doctor Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4 pb-3 border-b border-slate-200">
                <img
                  src={activeDoctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'}
                  alt={activeDoctor.name}
                  className="w-20 h-20 rounded-2xl object-cover object-top border border-[#0A7A74]/30 shadow-xs shrink-0"
                />
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-base sm:text-lg font-black text-[#0B2545] leading-tight truncate">
                    {activeDoctor.name}
                  </h4>
                  <p className="text-xs font-bold text-[#0A7A74]">
                    {activeDoctor.designation || 'Senior Consultant'}
                  </p>
                  <p className="text-xs text-slate-600 font-semibold truncate">
                    {activeDoctor.departmentName}
                  </p>
                  {activeDoctor.dmcNo && (
                    <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full bg-teal-50 border border-teal-200 text-[10px] font-bold text-[#0A7A74]">
                      DMC: {activeDoctor.dmcNo}
                    </span>
                  )}
                </div>
              </div>

              {/* Bio */}
              {activeDoctor.bio && (
                <div className="space-y-1">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    About the Doctor
                  </h5>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {activeDoctor.bio}
                  </p>
                </div>
              )}

              {/* Specializations */}
              {activeDoctor.specializations && activeDoctor.specializations.length > 0 && (
                <div className="space-y-1.5">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Clinical Specializations
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDoctor.specializations.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-teal-50 text-[#0A7A74] text-[11px] font-semibold border border-teal-100"
                      >
                        ✓ {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* OPD Details */}
              <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">
                    OPD Chamber
                  </span>
                  <span className="font-bold text-slate-800 text-xs">
                    {activeDoctor.room || 'Room 101, Block A'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">
                    OPD Schedule
                  </span>
                  <span className="font-bold text-slate-800 text-xs">
                    {activeDoctor.opdSchedule || 'Mon - Sat (08 AM - 01 PM)'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Select &amp; Continue with {activeDoctor.name}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: PATIENT BOOKING CONFIRMATION FORM ================= */}
      {bookingModalOpen && activeDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="bg-[#0A7A74] text-white px-5 py-3.5 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="text-sm font-black">Confirm OPD Patient Details</h3>
                <p className="text-[11px] text-teal-100 mt-0.5">
                  {activeDoctor.name} · {formattedDisplayDate} · {selectedSlot}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="p-5 space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Age
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="e.g. 45"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    UHID (Optional)
                  </label>
                  <input
                    type="text"
                    value={uhid}
                    onChange={(e) => setUhid(e.target.value)}
                    placeholder="e.g. BSH-10294"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="patient@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Chief Complaint / Symptoms (Optional)
                </label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe health concerns (e.g. fever, joint pain, cough)..."
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                />
              </div>

              {/* Summary note */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Consultation:</span>
                  <span className="font-bold text-slate-800">Direct OPD Hospital Visit</span>
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

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-5 py-2 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
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
            <div className="bg-[#0A7A74] text-white px-5 py-3 flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold flex items-center gap-2">
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
            <div className="p-4 sm:p-5 space-y-2.5 text-xs text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-900">
                Brahm Shakti Hospital's Patient-Friendly Policy:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>
                  <strong>100% Free Registration:</strong> Registration on our portal is completely complimentary.
                </li>
                <li>
                  <strong>No Upfront Consultation Charge:</strong> Consultation fees are payable upon check-in at the hospital OPD counter.
                </li>
                <li>
                  <strong>Free Rescheduling:</strong> Patients may reschedule consultation date or slot anytime without penalty.
                </li>
                <li>
                  <strong>Doctor Unavailability:</strong> In case a scheduled consultant is called for emergency trauma surgery, an immediate alternate senior physician is assigned.
                </li>
              </ul>
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setRefundModalOpen(false)}
                  className="w-full py-2 rounded-xl bg-[#0A7A74] text-white font-bold text-xs hover:bg-[#08635e] transition-colors cursor-pointer"
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
