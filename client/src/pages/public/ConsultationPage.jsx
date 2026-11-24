import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Check
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const todayISO = () => new Date().toISOString().split('T')[0];

// Official verified doctor roster of Brahm Shakti Hospital (DMC registered)
const PORTAL_DOCTOR_NAMES = [
  'Dr. S.K. Goyal',
  'Dr. Vineet Mittal',
  'Dr. Sanjeev Verma',
  'Dr. Rishabh Jain',
  'Dr. Kapil Goyal',
  'Dr. Dinesh Chand Sharma',
  'Dr. Ravi Shankar Gupta',
  'Dr. Manvi Aggarwal',
  'Dr. Monika Kumawat',
  'Dr. Manisha Jain',
  'Dr. Renu Gupta',
  'Dr. Swati Gupta',
  'Dr. Avnish Goyal',
  'Dr. Manju Bansal',
  'Dr. Hitesh Aggarwal',
  'Dr. Rupesh',
  'Dr. Sunil',
  'Dr. Nishant Verma',
  'Dr. Disha Menani',
  'Dr. Sunil Gandhi',
  'Dr. Dharmender Chaudhary',
  'Dr. Rajesh Kumar',
  'Dr. Monika Kumar',
  'Dr. Anil Solanki'
];

// Clean vector doctor silhouette matching the reference portal illustration
const DoctorSilhouette = ({ className = 'w-40 h-40' }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} drop-shadow-sm`}
  >
    {/* Soft light-blue background circle / rounded box */}
    <rect width="200" height="200" rx="28" fill="#E8F4F8" />
    
    {/* Shoulders / Body with White Lab Coat */}
    <path
      d="M36 200 C36 156 60 144 86 142 L114 142 C140 144 164 156 164 200 Z"
      fill="#F8FAFC"
      stroke="#DCE5EC"
      strokeWidth="2"
    />
    
    {/* Inner Navy Shirt & Tie */}
    <path d="M88 142 L100 168 L112 142 Z" fill="#0B2545" />
    <path d="M96 150 L100 188 L104 150 Z" fill="#2563EB" />
    
    {/* White Coat Lapels */}
    <path d="M60 148 L88 178 L80 200 L44 200 Z" fill="#FFFFFF" />
    <path d="M140 148 L112 178 L120 200 L156 200 Z" fill="#FFFFFF" />
    
    {/* Doctor Neck */}
    <rect x="88" y="112" width="24" height="34" rx="4" fill="#E5A672" />
    
    {/* Doctor Head */}
    <ellipse cx="100" cy="92" rx="32" ry="38" fill="#F0BA8B" />
    
    {/* Professional Doctor Hair */}
    <path
      d="M68 90 C66 66 82 52 100 52 C118 52 134 66 132 90 C128 72 118 64 100 64 C82 64 72 72 68 90 Z"
      fill="#2A2F35"
    />
    
    {/* Subtle facial outline */}
    <ellipse cx="88" cy="94" rx="3" ry="4" fill="#2A2F35" />
    <ellipse cx="112" cy="94" rx="3" ry="4" fill="#2A2F35" />
    <path d="M96 102 C98 106 102 106 104 102" stroke="#D99B6A" strokeWidth="2" strokeLinecap="round" />
    <path d="M92 116 C96 120 104 120 108 116" stroke="#C88456" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Stethoscope around neck */}
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
    {/* Stethoscope Chest Piece */}
    <circle cx="100" cy="184" r="8" fill="#94A3B8" stroke="#475569" strokeWidth="2.5" />
    <circle cx="100" cy="184" r="3.5" fill="#0A7A74" />
  </svg>
);

export const ConsultationPage = () => {
  const [searchParams] = useSearchParams();
  const preDoctor = searchParams.get('doctor') || '';
  const preDept = searchParams.get('specialty') || searchParams.get('department') || '';

  const { isAuthenticated, isLoading, user, isStaff, dashboardPath } = useAuth();
  const navigate = useNavigate();

  // Mode: search by doctor or search by speciality (as shown in reference image tabs)
  const [activeTab, setActiveTab] = useState(preDoctor || !preDept ? 'doctor' : 'specialty');
  const [consultationMode, setConsultationMode] = useState('direct'); // 'direct' or 'video'

  // Metadata
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // Filters
  const [selectedDeptId, setSelectedDeptId] = useState(preDept);
  const [selectedDoctorId, setSelectedDoctorId] = useState(preDoctor);
  const [doctorSearchText, setDoctorSearchText] = useState('');

  // Date and slot selection
  const [date, setDate] = useState(todayISO());
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');

  // Patient Booking form
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [symptoms, setSymptoms] = useState('');
  const [uhid, setUhid] = useState('');

  // UI Modals & State
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [photoViewMode, setPhotoViewMode] = useState('silhouette'); // 'silhouette' or 'real'

  // Autofill patient details if user is logged in
  useEffect(() => {
    if (user) {
      if (user.name && !patientName) setPatientName(user.name);
      if (user.email && !patientEmail) setPatientEmail(user.email);
      if (user.phone && !patientPhone) setPatientPhone(user.phone);
      if (user.uhid && !uhid) setUhid(user.uhid);
    }
  }, [user]);

  // Fetch departments and doctors
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          api.get('/departments'),
          api.get('/doctors')
        ]);
        if (deptRes.data.success) setDepartments(deptRes.data.data);
        if (docRes.data.success) {
          const all = docRes.data.data || [];
          const ordered = PORTAL_DOCTOR_NAMES
            .map((name) => all.find((d) => d.name === name))
            .filter(Boolean);
          const finalDocs = ordered.length > 0
            ? [...ordered, ...all.filter((d) => !ordered.some((o) => o.id === d.id))]
            : all;
          setDoctors(finalDocs);

          const initial = finalDocs.find((d) => d.id === preDoctor) || finalDocs[0];
          if (initial) setSelectedDoctorId(initial.id);
        }
      } catch (err) {
        console.error('Error loading consultation directory:', err);
        toast.error('Unable to load doctors list. Please refresh.');
      } finally {
        setLoadingMeta(false);
      }
    };
    fetchMeta();
  }, [preDoctor]);

  // Doctors filtered by selected department
  const filteredDoctorsByDept = useMemo(() => {
    if (!selectedDeptId) return doctors;
    return doctors.filter((d) => d.departmentId === selectedDeptId || d.department?.toLowerCase() === selectedDeptId.toLowerCase());
  }, [doctors, selectedDeptId]);

  // Filtered doctors list for search
  const visibleDoctorsList = useMemo(() => {
    const base = activeTab === 'specialty' ? filteredDoctorsByDept : doctors;
    if (!doctorSearchText.trim()) return base;
    const q = doctorSearchText.toLowerCase();
    return base.filter((d) =>
      d.name?.toLowerCase().includes(q) ||
      d.departmentName?.toLowerCase().includes(q) ||
      d.designation?.toLowerCase().includes(q)
    );
  }, [activeTab, filteredDoctorsByDept, doctors, doctorSearchText]);

  // Selected active doctor object
  const activeDoctor = useMemo(() => {
    return doctors.find((d) => d.id === selectedDoctorId) || doctors[0] || null;
  }, [doctors, selectedDoctorId]);

  // When changing department in specialty mode, ensure selected doctor matches
  useEffect(() => {
    if (activeTab === 'specialty' && selectedDeptId && filteredDoctorsByDept.length > 0) {
      if (!filteredDoctorsByDept.some((d) => d.id === selectedDoctorId)) {
        setSelectedDoctorId(filteredDoctorsByDept[0].id);
      }
    }
  }, [activeTab, selectedDeptId, filteredDoctorsByDept, selectedDoctorId]);

  // Load live DB slots for active doctor and date
  const loadSlots = useCallback(async () => {
    if (!selectedDoctorId || !date) return;
    setSlotsLoading(true);
    setSelectedSlot('');
    try {
      const res = await api.get('/appointments/slots', { params: { doctorId: selectedDoctorId, date } });
      if (res.data.success && Array.isArray(res.data.data)) {
        setSlots(res.data.data);
        const firstOpen = res.data.data.find((s) => s.remaining > 0 && !s.isClosed);
        if (firstOpen) setSelectedSlot(firstOpen.timeSlot);
      } else {
        setSlots([]);
      }
    } catch (err) {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, [selectedDoctorId, date]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  // Date stepper
  const shiftDate = (deltaDays) => {
    const current = new Date(date + 'T00:00:00');
    current.setDate(current.getDate() + deltaDays);
    const nextStr = current.toISOString().split('T')[0];
    if (nextStr < todayISO()) {
      toast.error('Cannot select past dates.');
      return;
    }
    setDate(nextStr);
  };

  // Format date as DD/MM/YYYY for display (matching reference image)
  const formatDisplayDate = (isoStr) => {
    if (!isoStr) return '';
    const [y, m, d] = isoStr.split('-');
    return `${d}/${m}/${y}`;
  };

  // Open the patient booking verification form
  const handleProceedToBook = () => {
    if (!activeDoctor) {
      toast.error('Please select a doctor.');
      return;
    }
    if (!isAuthenticated) {
      // User is not logged in: redirect to patient type selection (Image 2)
      navigate(
        `/bookappointment/patient-type?doctor=${activeDoctor.id}&department=${activeDoctor.departmentId}&date=${date}&mode=${consultationMode}&slot=${encodeURIComponent(selectedSlot || '')}`
      );
      return;
    }
    if (!selectedSlot) {
      toast.error('Please select an available consultation slot.');
      return;
    }
    setBookingModalOpen(true);
  };

  // Handle appointment submission (Completely Public, No Login Required)
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
        appointmentType: consultationMode === 'video' ? 'Video Consultation' : 'OPD Consultation',
        symptoms: symptoms.trim() || undefined,
        fee: activeDoctor.consultationFee || 700,
        registrationFee: 0,
        paymentMethod: 'Pay at Hospital Counter'
      };

      const res = await api.post('/appointments', payload);
      if (res.data.success) {
        setBookingModalOpen(false);
        setConfirmed(res.data.data);
        toast.success('Appointment Confirmed Successfully!');
      }
    } catch (err) {
      console.error('Booking error:', err);
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
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
    <div className="min-h-screen bg-[#F4F7F9] text-[#1E293B] flex flex-col font-sans selection:bg-[#0A7A74] selection:text-white">
      {/* -------------------- DEDICATED PORTAL NAVBAR -------------------- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Left: Hospital Brand & Tagline */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group" title="Brahm Shakti Hospital Home">
              <img
                src="https://res.cloudinary.com/urzka7oz/image/upload/v1795244093/WhatsApp_Image_2026-11-20_at_10.36.32_PM-removebg-preview.png"
                alt="Brahm Shakti Hospital"
                className="h-10 sm:h-12 w-auto object-contain"
              />
              <div className="hidden sm:block border-l border-slate-200 pl-3">
                <div className="text-xs font-black tracking-wider text-[#0B2545] uppercase">
                  OPD Appointment Portal
                </div>
                <div className="text-[11px] font-medium text-[#0A7A74] italic">
                  Trust of Generations
                </div>
              </div>
            </Link>
          </div>

          {/* Right: Portal Links (Matching Reference UI) */}
          <nav className="flex items-center gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm font-semibold text-slate-700">
            <Link
              to="/"
              className="hidden md:inline-block hover:text-[#0A7A74] transition-colors"
            >
              Back Home
            </Link>
            <button
              type="button"
              onClick={() => setRefundModalOpen(true)}
              className="hover:text-[#0A7A74] transition-colors cursor-pointer"
            >
              Refund Policy
            </button>
            <Link
              to="/privacy-policy"
              className="hidden lg:inline-block hover:text-[#0A7A74] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-use"
              className="hidden lg:inline-block hover:text-[#0A7A74] transition-colors"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              to="/contact"
              className="hidden sm:inline-block hover:text-[#0A7A74] transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to={isAuthenticated ? '/patient/dashboard' : '/bookappointment/patient-type'}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0A7A74]/10 hover:bg-[#0A7A74] text-[#0A7A74] hover:text-white font-bold transition-all border border-[#0A7A74]/20"
            >
              <User className="w-3.5 h-3.5" />
              <span>{isAuthenticated ? (user?.name?.split(' ')[0] ? `${user.name.split(' ')[0]}'s Portal` : 'Patient Portal') : 'Patient Portal'}</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* -------------------- MAIN OPD BOOKING CANVAS -------------------- */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loadingMeta ? (
          <div className="min-h-[500px] flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-[#0A7A74]" />
            <p className="text-sm font-bold">Connecting to Brahm Shakti OPD Scheduler...</p>
          </div>
        ) : confirmed ? (
          /* ---------------- OFFICIAL OPD APPOINTMENT SLIP ---------------- */
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-md p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-2 border-b border-slate-200 pb-5">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black text-[#0B2545]">Appointment Confirmed!</h1>
              <p className="text-xs text-slate-500">
                Your consultation token is registered in the official Hospital OPD System.
              </p>
            </div>

            {/* Official Slip Details Card */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Appointment ID</span>
                <span className="font-mono font-black text-[#0B2545] text-base">{confirmed.appointmentId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Patient Name</span>
                <span className="font-bold text-slate-800">{confirmed.patientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Mobile Number</span>
                <span className="font-mono font-bold text-slate-800">{confirmed.patientPhone}</span>
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
                <span className="font-bold text-slate-900 bg-emerald-100/70 text-emerald-800 px-2.5 py-1 rounded-md">
                  {formatDisplayDate(confirmed.date)} · {confirmed.timeSlot}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Consultation Mode</span>
                <span className="font-bold text-slate-800">{confirmed.appointmentType || 'Direct OPD Visit'}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                <span className="text-slate-500 font-semibold">Registration &amp; Doctor Fee</span>
                <span className="font-black text-[#0A7A74] text-base">₹{confirmed.fee || 700} (Pay at Counter)</span>
              </div>
            </div>

            {/* Instruction Notice */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <p className="font-bold">Important Instructions for Patient:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                <li>Please report to the OPD reception counter 15 minutes prior to your time slot.</li>
                <li>Show this digital appointment confirmation or quote Appointment ID: <strong className="font-mono">{confirmed.appointmentId}</strong>.</li>
                <li>Registration is completely FREE. Consultation fee is payable at the hospital OPD counter.</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-[#0A7A74] hover:border-[#0A7A74] text-xs font-bold transition-all shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Appointment Slip</span>
              </button>
              <button
                type="button"
                onClick={handleResetBooking}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs font-bold transition-all shadow-xs"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Another Appointment</span>
              </button>
              <Link
                to="/"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Hospital Home</span>
              </Link>
            </div>
          </div>
        ) : (
          /* ---------------- TWO-PANEL OPD BOOKING INTERFACE ---------------- */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ================= LEFT COLUMN: SEARCH & DOCTOR PROFILE ================= */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Search By Tabs (Exactly matching Ganga Ram Reference) */}
              <div className="grid grid-cols-2 text-xs sm:text-sm font-bold border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('doctor');
                    setDoctorSearchText('');
                  }}
                  className={`py-3.5 px-3 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'doctor'
                      ? 'bg-[#0A7A74] text-white'
                      : 'bg-[#F1F5F9] text-[#0A7A74] hover:bg-slate-200/70'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Search By Doctor</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('specialty');
                    setDoctorSearchText('');
                  }}
                  className={`py-3.5 px-3 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'specialty'
                      ? 'bg-[#0A7A74] text-white'
                      : 'bg-[#F1F5F9] text-[#0A7A74] hover:bg-slate-200/70'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Search By Speciality</span>
                </button>
              </div>

              {/* Search Filter Controls */}
              <div className="p-4 space-y-3 bg-white">
                {activeTab === 'specialty' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Select Department / Speciality
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDeptId}
                        onChange={(e) => setSelectedDeptId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                      >
                        <option value="">-- All Departments --</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Search Doctor Dropdown Combobox */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {activeTab === 'specialty' ? 'Select Doctor in Speciality' : 'Search Doctor'}
                  </label>
                  <div className="relative flex items-center">
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                    >
                      <option value="">-- Search Doctor --</option>
                      {visibleDoctorsList.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} {doc.departmentName ? `(${doc.departmentName})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quick Doctor Name Filter Input */}
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400" />
                  <input
                    type="text"
                    value={doctorSearchText}
                    onChange={(e) => setDoctorSearchText(e.target.value)}
                    placeholder="Type doctor or disease name to filter..."
                    className="w-full pl-8 pr-8 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-xs text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-[#0A7A74] focus:outline-hidden"
                  />
                  {doctorSearchText && (
                    <button
                      type="button"
                      onClick={() => setDoctorSearchText('')}
                      className="absolute right-2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Teal Header: Doctor Profile Card (Exact reference style) */}
              <div className="border-t border-slate-200">
                <div className="bg-[#0A7A74] px-4 py-2.5 flex items-center justify-between text-white">
                  <h2 className="text-xs sm:text-sm font-bold tracking-wide">Doctor Profile</h2>
                  {activeDoctor && (
                    <span className="text-[10px] font-semibold bg-white/15 px-2 py-0.5 rounded">
                      DMC Registered
                    </span>
                  )}
                </div>

                {activeDoctor ? (
                  <div className="p-5 space-y-4">
                    {/* Centered Doctor Avatar / Photo (with illustration / real toggle) */}
                    <div className="flex flex-col items-center text-center">
                      <div className="relative group">
                        {photoViewMode === 'silhouette' || !activeDoctor.image ? (
                          <DoctorSilhouette className="w-36 h-36" />
                        ) : (
                          <img
                            src={activeDoctor.image}
                            alt={activeDoctor.name}
                            className="w-36 h-36 rounded-2xl object-cover object-top border-2 border-slate-200 shadow-sm"
                          />
                        )}
                        {activeDoctor.image && (
                          <button
                            type="button"
                            onClick={() =>
                              setPhotoViewMode(photoViewMode === 'silhouette' ? 'real' : 'silhouette')
                            }
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-white border border-slate-300 text-[10px] font-bold text-slate-600 shadow-xs hover:border-[#0A7A74] hover:text-[#0A7A74] transition-colors"
                          >
                            {photoViewMode === 'silhouette' ? 'Show Photo' : 'Show Silhouette'}
                          </button>
                        )}
                      </div>

                      {/* Carousel Indicator Dots (from reference) */}
                      <div className="flex items-center gap-1.5 mt-4">
                        <span className="w-4 h-1 rounded-full bg-[#0A7A74]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      </div>

                      {/* Doctor Name & Designation */}
                      <h3 className="text-lg font-black text-[#0B2545] mt-2 leading-snug">
                        {activeDoctor.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#0A7A74]">
                        {activeDoctor.designation || 'Senior Consultant'}
                      </p>
                      <span className="mt-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold">
                        {activeDoctor.departmentName || activeDoctor.department}
                      </span>
                    </div>

                    {/* Detailed Metadata Grid */}
                    <div className="border-t border-slate-200 pt-3 divide-y divide-slate-100 text-xs">
                      {activeDoctor.qualification && (
                        <div className="py-2 flex items-start gap-2.5">
                          <GraduationCap className="w-4 h-4 text-[#0A7A74] shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Qualification</span>
                            <span className="font-bold text-slate-800">{activeDoctor.qualification}</span>
                          </div>
                        </div>
                      )}
                      {activeDoctor.dmcNo && (
                        <div className="py-2 flex items-start gap-2.5">
                          <Award className="w-4 h-4 text-[#0A7A74] shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">DMC Registration</span>
                            <span className="font-bold text-slate-800">DMC-{activeDoctor.dmcNo}</span>
                          </div>
                        </div>
                      )}
                      <div className="py-2 flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-[#0A7A74] shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">OPD Chamber Room</span>
                          <span className="font-bold text-slate-800">{activeDoctor.room || 'Room 102, Ground Floor OPD'}</span>
                        </div>
                      </div>
                      <div className="py-2 flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-[#0A7A74] shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">OPD Timings</span>
                          <span className="font-bold text-slate-800">{activeDoctor.opdSchedule || 'Mon - Sat (09:00 AM - 02:00 PM)'}</span>
                        </div>
                      </div>
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-slate-500 font-bold">OPD Consultation Fee:</span>
                        <span className="font-black text-[#0A7A74] text-sm">
                          ₹{activeDoctor.consultationFee || 700} <span className="text-[10px] font-normal text-slate-400">(Trust Rate)</span>
                        </span>
                      </div>
                    </div>

                    {activeDoctor.bio && (
                      <div className="bg-slate-50 rounded-lg p-3 text-[11px] text-slate-600 leading-relaxed border border-slate-200">
                        <span className="font-bold text-slate-800 block mb-0.5">Clinical Note:</span>
                        {activeDoctor.bio}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <User className="w-10 h-10 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">Select a doctor to view their profile</p>
                  </div>
                )}
              </div>
            </div>

            {/* ================= RIGHT COLUMN: CONSULTATION TYPE, DATE, SLOTS & NOTICE ================= */}
            <div className="lg:col-span-7 space-y-5">
              {/* Consultation Mode Cards (Direct Consultation vs Video Consultation) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Direct Consultation Card */}
                <button
                  type="button"
                  onClick={() => setConsultationMode('direct')}
                  className={`p-4 rounded-xl border-2 text-left flex items-center gap-3.5 transition-all cursor-pointer bg-white ${
                    consultationMode === 'direct'
                      ? 'border-[#0A7A74] ring-2 ring-[#0A7A74]/15 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-[#0A7A74] text-white flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-[#0A7A74] underline decoration-2 underline-offset-2">
                      Direct Consultation
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Visit Doctor in Person
                    </div>
                  </div>
                </button>

                {/* Video Consultation Card */}
                <button
                  type="button"
                  onClick={() => setConsultationMode('video')}
                  className={`p-4 rounded-xl border-2 text-left flex items-center gap-3.5 transition-all cursor-pointer bg-white ${
                    consultationMode === 'video'
                      ? 'border-[#2563EB] ring-2 ring-[#2563EB]/15 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-[#2563EB] underline decoration-2 underline-offset-2">
                      Video Consultation
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Consult Online
                    </div>
                  </div>
                </button>
              </div>

              {/* Date Navigation Bar (Exact reference layout with < DD/MM/YYYY >) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => shiftDate(-1)}
                  className="w-10 h-10 rounded-full bg-[#0A7A74] hover:bg-[#08635e] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
                  title="Previous Day"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="relative flex items-center">
                  <input
                    type="date"
                    min={todayISO()}
                    value={date}
                    onChange={(e) => setDate(e.target.value || todayISO())}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                    title="Click to choose date"
                  />
                  <div className="flex items-center gap-2.5 px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 font-mono font-bold text-sm text-slate-800">
                    <span>{formatDisplayDate(date)}</span>
                    <CalendarDays className="w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => shiftDate(1)}
                  className="w-10 h-10 rounded-full bg-[#0A7A74] hover:bg-[#08635e] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
                  title="Next Day"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Time Slots Grid */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs sm:text-sm font-bold text-slate-800">
                    Select Available Consultation Slot:
                  </div>
                  <div className="text-xs text-[#0A7A74] font-bold">
                    {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                {!isAuthenticated && (
                  <div className="p-2.5 rounded-lg bg-teal-50/70 border border-teal-200 text-xs text-[#0A7A74] font-medium flex items-center justify-between">
                    <span>Available OPD slots shown below. Click <strong>Proceed to Book</strong> to sign in or register.</span>
                    <span className="text-[10px] bg-[#0A7A74] text-white px-2 py-0.5 rounded font-bold">Login to Reserve</span>
                  </div>
                )}

                {slotsLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-[#0A7A74]" />
                    <span className="text-xs font-semibold">Checking live doctor availability...</span>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="p-6 rounded-xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-amber-900 font-semibold text-center space-y-1">
                    <p>No available OPD slots on {formatDisplayDate(date)} for this consultant.</p>
                    <p className="text-[11px] text-amber-700">Please choose another date or another doctor.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {slots.map((slot) => {
                      const isFull = slot.isClosed || slot.remaining <= 0;
                      const isSelected = selectedSlot === slot.timeSlot;
                      return (
                        <button
                          key={slot.timeSlot}
                          type="button"
                          disabled={isFull || !isAuthenticated}
                          onClick={() => {
                            if (!isAuthenticated) {
                              toast('Please click Proceed to Book to sign in or register.', { icon: 'ℹ️' });
                              return;
                            }
                            setSelectedSlot(slot.timeSlot);
                          }}
                          title={!isAuthenticated ? 'Sign in or register to select slot' : undefined}
                          className={`p-2.5 rounded-lg border text-center transition-all ${
                            !isAuthenticated
                              ? 'bg-slate-50 border-slate-200 text-slate-700 opacity-80 cursor-not-allowed'
                              : isFull
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-[#0A7A74] border-[#0A7A74] text-white shadow-sm cursor-pointer'
                              : 'bg-white border-slate-300 text-slate-800 hover:border-[#0A7A74] hover:bg-[#0A7A74]/5 cursor-pointer'
                          }`}
                        >
                          <div className="text-xs font-black">{slot.timeSlot}</div>
                          <div
                            className={`text-[10px] font-semibold mt-0.5 ${
                              isSelected ? 'text-white/80' : isFull ? 'text-slate-400' : 'text-emerald-600'
                            }`}
                          >
                            {isFull ? 'Full' : `${slot.remaining} left`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    Selected Slot:{' '}
                    <strong className="text-[#0A7A74] font-bold">
                      {isAuthenticated
                        ? selectedSlot || 'None selected'
                        : 'Sign in / Register required to select slot'}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleProceedToBook}
                    disabled={!activeDoctor || (isAuthenticated && !selectedSlot)}
                    className="px-5 py-2.5 rounded-lg bg-[#0A7A74] hover:bg-[#08635e] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Book</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ================= PATIENT GUIDANCE CALLOUT (FREE REGISTRATION) ================= */}
              <div className="bg-emerald-50/70 border-l-4 border-emerald-600 rounded-r-xl p-4 shadow-xs text-xs sm:text-sm space-y-1">
                <p className="text-slate-800 font-bold">
                  ✓ Patient Registration is <strong className="text-emerald-700 font-black">100% FREE</strong> of charge.
                </p>
                <p className="text-slate-700">
                  • Subsidized trust consultation fee is payable only when visiting the doctor at the hospital OPD counter.
                </p>
                <p className="text-slate-600 text-[11px]">
                  • OPD consultations include complimentary follow-up within 10 days of your visit.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* -------------------- DEDICATED PORTAL FOOTER -------------------- */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          {/* Left: Copyright */}
          <div className="font-semibold">
            &copy; 2026 Brahm Shakti Hospital.
          </div>

          {/* Center: NABH & NABL Badge (Matching Reference) */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-300 bg-teal-50 text-[#0A7A74] font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-[#0A7A74]" />
            <span>NABH &amp; NABL Accredited</span>
          </div>

          {/* Right: Contact Helpdesk */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <a
              href="mailto:helpdesk@brahmshaktihospital.com"
              className="flex items-center gap-1.5 hover:text-[#0A7A74] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#0A7A74]" />
              <span>helpdesk@brahmshaktihospital.com</span>
            </a>
            <a
              href="tel:01127531683"
              className="flex items-center gap-1.5 text-rose-600 font-bold hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>011-27531683 / 7840089703</span>
            </a>
          </div>
        </div>
      </footer>

      {/* ================= FAST PATIENT BOOKING MODAL (NO LOGIN REQUIRED) ================= */}
      {bookingModalOpen && activeDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[92vh] overflow-y-auto border border-slate-200">
            {/* Modal Header */}
            <div className="bg-[#0A7A74] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black">Patient Details &amp; Slot Confirmation</h3>
                <p className="text-xs text-teal-100 mt-0.5">
                  {activeDoctor.name} · {formatDisplayDate(date)} · {selectedSlot}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
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
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
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
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
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
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
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
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Symptoms / Reason for Consultation (optional)
                </label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms or previous diagnosis..."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden resize-none"
                />
              </div>

              {/* Fee Breakdown Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Hospital Registration Fee:</span>
                  <span className="font-bold text-emerald-700">FREE (₹0)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Doctor Consultation Fee:</span>
                  <span className="font-bold text-slate-800">₹{activeDoctor.consultationFee || 700}</span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between font-black text-slate-900 text-sm">
                  <span>Total Payable at Counter:</span>
                  <span className="text-[#0A7A74]">₹{activeDoctor.consultationFee || 700}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-3.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] disabled:opacity-50 text-white text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming Appointment...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm &amp; Generate OPD Slip</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-400 text-center">
                By confirming, you agree to Brahm Shakti Hospital's OPD visit guidelines. No prior login required.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* ================= REFUND POLICY MODAL ================= */}
      {refundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-[#0A7A74]">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-black text-base text-slate-800">OPD Refund Policy</h3>
              </div>
              <button
                type="button"
                onClick={() => setRefundModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>1. Registration:</strong> Patient registration is completely free of charge. No upfront fees are collected online.
              </p>
              <p>
                <strong>2. Doctor Rescheduling:</strong> If the consulting doctor is called for emergency surgery or is indisposed, patient appointments will be rescheduled to the next available slot at no additional charge.
              </p>
              <p>
                <strong>3. Cancellation:</strong> Cancellation requests must be made at least 2 hours before the scheduled slot by calling our OPD desk at <strong>011-27531683</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setRefundModalOpen(false)}
              className="w-full py-2.5 rounded-lg bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs font-bold transition-colors"
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
