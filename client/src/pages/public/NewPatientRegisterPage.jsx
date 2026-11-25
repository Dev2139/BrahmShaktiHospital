import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
  Lock,
  Loader2,
  Clock,
  AlertCircle,
  KeyRound,
  FileText,
  User,
  MapPin,
  Check,
  Menu,
  X,
  Home
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const INDIAN_STATES = [
  'Delhi',
  'Haryana',
  'Uttar Pradesh',
  'Punjab',
  'Rajasthan',
  'Himachal Pradesh',
  'Uttarakhand',
  'Chandigarh',
  'Madhya Pradesh',
  'Bihar',
  'Maharashtra',
  'Gujarat',
  'West Bengal',
  'Karnataka',
  'Tamil Nadu',
  'Other State / UT'
];

// Compact SVG illustration matching Image 2 (Clipboard, Medical Cross, Shield with Lock & Organic leaves)
const MedicalJourneyIllustration = ({ className = 'w-auto h-24' }) => (
  <svg
    viewBox="0 0 320 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0D9488" />
        <stop offset="100%" stopColor="#0A7A74" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#99F6E4" />
        <stop offset="100%" stopColor="#5EEAD4" />
      </linearGradient>
      <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0A7A74" floodOpacity="0.12" />
      </filter>
    </defs>

    {/* Background Soft Organic Leaves & Glow */}
    <ellipse cx="160" cy="115" rx="90" ry="75" fill="#E6FFFA" />

    {/* Left Leaf Accent */}
    <path
      d="M85 105 C70 88 70 65 88 60 C106 55 110 78 96 95 C90 102 88 105 85 105 Z"
      fill="url(#leafGrad)"
      opacity="0.8"
    />

    {/* Right Leaf Accent */}
    <path
      d="M235 105 C250 88 250 65 232 60 C214 55 210 78 224 95 C230 102 232 105 235 105 Z"
      fill="url(#leafGrad)"
      opacity="0.8"
    />

    {/* Clipboard Base Board */}
    <g filter="url(#cardShadow)">
      <rect x="105" y="32" width="110" height="138" rx="14" fill="#0A7A74" />
      {/* Top Clip */}
      <rect x="136" y="24" width="48" height="18" rx="5" fill="#08635e" />
      <circle cx="160" cy="33" r="3.5" fill="#FFFFFF" />

      {/* Paper Surface */}
      <rect x="112" y="42" width="96" height="120" rx="8" fill="#FFFFFF" />

      {/* Medical Cross Emblem */}
      <rect x="155" y="52" width="10" height="24" rx="2" fill="#0A7A74" />
      <rect x="148" y="59" width="24" height="10" rx="2" fill="#0A7A74" />

      {/* Document content lines */}
      <rect x="124" y="88" width="72" height="4.5" rx="2" fill="#E2E8F0" />
      <rect x="124" y="100" width="56" height="4.5" rx="2" fill="#E2E8F0" />
      <rect x="124" y="112" width="65" height="4.5" rx="2" fill="#E2E8F0" />
      <rect x="124" y="124" width="45" height="4.5" rx="2" fill="#E2E8F0" />
    </g>

    {/* Secure Shield Overlay with Lock */}
    <g transform="translate(172, 108)">
      {/* Shield Body */}
      <path
        d="M28 0 C42 0 56 5 56 5 C56 31 44 54 28 63 C12 54 0 31 0 5 C0 5 14 0 28 0 Z"
        fill="url(#shieldGrad)"
        filter="url(#cardShadow)"
      />
      {/* Shield Inner Stroke */}
      <path
        d="M28 3.5 C40 3.5 52 8 52 8 C52 30 42 51 28 59 C14 51 4 30 4 8 C4 8 16 3.5 28 3.5 Z"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeOpacity="0.4"
        fill="none"
      />
      {/* Lock Shackle */}
      <path
        d="M23 27 V23 C23 20 25.5 17.5 28 17.5 C30.5 17.5 33 20 33 23 V27"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Lock Body */}
      <rect x="20" y="26" width="16" height="13" rx="2.5" fill="#FFFFFF" />
      {/* Lock Keyhole */}
      <circle cx="28" cy="31.5" r="1.5" fill="#0A7A74" />
      <rect x="27.2" y="32" width="1.6" height="3.5" fill="#0A7A74" />
    </g>
  </svg>
);

export const NewPatientRegisterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthSession, isAuthenticated } = useAuth();

  // Consultation booking parameters (if coming from /bookappointment)
  const doctorId = searchParams.get('doctor') || '';
  const departmentId = searchParams.get('department') || '';
  const dateParam = searchParams.get('date') || '';
  const slotParam = searchParams.get('slot') || '';
  const modeParam = searchParams.get('mode') || 'direct';

  // Step 1: Personal & Address Details, Step 2: Email OTP Verification
  const [currentStep, setCurrentStep] = useState(1);
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form Fields (Demographics matching Image 2)
  const [title, setTitle] = useState('Mr.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('India');
  const [stateUt, setStateUt] = useState('Delhi');
  const [pincode, setPincode] = useState('110085');
  const [district, setDistrict] = useState('North West Delhi');
  const [addressLine1, setAddressLine1] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [consentChecked, setConsentChecked] = useState(true);

  // Doctor metadata (for slot booking if arriving from portal)
  const [doctorInfo, setDoctorInfo] = useState(null);

  // Step 2: Email OTP state
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Load doctor details if doctorId is present
  useEffect(() => {
    if (!doctorId) return;
    const fetchDoc = async () => {
      try {
        const res = await api.get('/doctors');
        if (res.data.success) {
          const doc = res.data.data.find((d) => d.id === doctorId);
          if (doc) setDoctorInfo(doc);
        }
      } catch (err) {
        console.error('Error loading doctor info:', err);
      }
    };
    fetchDoc();
  }, [doctorId]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval;
    if (currentStep === 2 && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, otpTimer]);

  // Handle Step 1 Submit -> Generate & Send Email OTP
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('First name and last name are required.');
      return;
    }
    if (!gender) {
      toast.error('Please select a gender.');
      return;
    }
    if (!dob) {
      toast.error('Date of birth is required.');
      return;
    }
    const cleanMobile = mobile.trim().replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      toast.error('Please enter a valid email address for Email OTP verification.');
      return;
    }
    if (!addressLine1.trim()) {
      toast.error('Address line 1 is required.');
      return;
    }
    if (!consentChecked) {
      toast.error('Please accept the Patient Health Data Consent.');
      return;
    }

    try {
      const fullName = `${title} ${firstName.trim()} ${lastName.trim()}`;
      const res = await api.post('/auth/send-otp', {
        email: cleanEmail,
        type: 'new_patient',
        name: fullName
      });

      if (res.data?.success) {
        if (res.data.demoOtp) {
          setGeneratedOtp(res.data.demoOtp);
        }
        setOtpInput('');
        setOtpTimer(60);
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.success(`Verification OTP sent to ${cleanEmail}`);
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      toast.error(err.response?.data?.message || 'Failed to send OTP to email. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const fullName = `${title} ${firstName.trim()} ${lastName.trim()}`;
      const res = await api.post('/auth/send-otp', {
        email: cleanEmail,
        type: 'new_patient',
        name: fullName
      });
      if (res.data?.success) {
        if (res.data.demoOtp) {
          setGeneratedOtp(res.data.demoOtp);
        }
        setOtpTimer(60);
        toast.success(`New OTP sent to ${cleanEmail}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  // Handle Step 2: Verify Email OTP & Finalize Registration
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpInput.trim() || otpInput.trim().length !== 6) {
      toast.error('Please enter the 6-digit code received on your email.');
      return;
    }

    setVerifyingOtp(true);
    try {
      const cleanEmail = email.trim().toLowerCase();

      // Verify OTP with backend
      const verifyRes = await api.post('/auth/verify-otp', {
        email: cleanEmail,
        otp: otpInput.trim(),
        type: 'new_patient'
      });

      if (!verifyRes.data?.success) {
        toast.error(verifyRes.data?.message || 'Invalid or expired OTP.');
        setVerifyingOtp(false);
        return;
      }

      const fullName = `${title} ${firstName.trim()} ${lastName.trim()}`;
      const uhidCode = `BSH-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

      const patientUser = {
        name: fullName,
        email: cleanEmail,
        phone: mobile.trim(),
        uhid: uhidCode,
        role: 'patient',
        dob,
        gender,
        address: `${addressLine1.trim()}, ${district}, ${stateUt} - ${pincode}`
      };

      let authToken = 'bsh_jwt_' + Date.now();
      try {
        const regRes = await api.post('/auth/register', {
          ...patientUser,
          password: `BSH@${mobile.slice(-4) || '2026'}`
        });
        if (regRes.data?.token) {
          authToken = regRes.data.token;
        }
      } catch (err) {
        // Fallback for offline/mock demo
      }

      // Establish authenticated session for this patient
      setAuthSession(patientUser, authToken);

      toast.success(`Registration verified! Welcome, ${fullName}. Connecting to appointment booking...`);

      // Redirect directly back to /bookappointment preserving parameters
      const returnUrl = `/bookappointment?doctor=${encodeURIComponent(doctorId)}&department=${encodeURIComponent(departmentId)}&date=${encodeURIComponent(dateParam)}&mode=${encodeURIComponent(modeParam)}&slot=${encodeURIComponent(slotParam)}`;
      setTimeout(() => {
        navigate(returnUrl, { replace: true });
      }, 700);
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.response?.data?.message || 'Unable to finalize registration. Please check the OTP and try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F8F9] text-slate-800 flex flex-col font-sans selection:bg-[#0A7A74] selection:text-white">
      {/* ----------------- 1. NAVBAR (EXACT MATCH TO BOOK APPOINTMENT PAGE) ----------------- */}
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

          {/* Right: Portal Links (Identical to Book Appointment Page) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-xs sm:text-sm font-bold text-slate-800">
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

          {/* Mobile Menu Button */}
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
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 text-xs font-bold text-slate-800">
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

      {/* ----------------- 2. COMPACT HEADER & BREADCRUMB ----------------- */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-[#0A7A74] transition-colors">
            <Home className="w-3 h-3 text-[#0A7A74]" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-slate-800">New Patient Registration</span>
        </div>

        {/* Compact Stepper (Top Right on wide screens, centered on mobile) */}
        <div className="flex items-center gap-3 text-xs">
          <div className={`flex items-center gap-1.5 font-bold ${currentStep === 1 ? 'text-[#0A7A74]' : 'text-slate-400'}`}>
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                currentStep > 1
                  ? 'bg-emerald-600 text-white'
                  : currentStep === 1
                  ? 'bg-[#0A7A74] text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {currentStep > 1 ? '✓' : '1'}
            </span>
            <span className="text-[11px] sm:text-xs">Personal &amp; Address</span>
          </div>

          <div className="w-6 sm:w-10 h-0.5 bg-slate-300"></div>

          <div className={`flex items-center gap-1.5 font-bold ${currentStep === 2 ? 'text-[#0A7A74]' : 'text-slate-400'}`}>
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                currentStep === 2
                  ? 'bg-[#0A7A74] text-white ring-2 ring-[#0A7A74]/20'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              2
            </span>
            <span className="text-[11px] sm:text-xs">Email OTP</span>
          </div>
        </div>
      </div>

      {/* Title (Compact) */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-3">
        <h1 className="text-xl sm:text-2xl font-black text-[#0A7A74] tracking-tight leading-tight">
          Create Your Patient Account
        </h1>
        <p className="text-[11px] sm:text-xs font-medium text-slate-600">
          Enter your details to register with Brahm Shakti Hospital.
        </p>
      </div>

      {/* ----------------- 3. COMPACT MAIN BENTO GRID (LESS SCROLL) ----------------- */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 xl:gap-6 items-start">
          {/* ================= LEFT COLUMN: REGISTRATION JOURNEY CARD ================= */}
          <div className="lg:col-span-4 xl:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
            {/* Top Compact Illustration */}
            <div className="w-full flex items-center justify-center py-0.5">
              <MedicalJourneyIllustration className="w-auto h-24 select-none drop-shadow-xs" />
            </div>

            <div>
              <h2 className="text-sm font-black text-slate-900">
                Your registration journey
              </h2>
            </div>

            {/* Vertical Timeline Stepper (Tightened spacing) */}
            <div className="relative pl-1 space-y-3.5">
              <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200"></div>

              {/* Journey Step 1 */}
              <div className="relative flex items-start gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 z-10 shadow-2xs transition-colors ${
                    currentStep >= 1 ? 'bg-[#0A7A74]' : 'bg-slate-300'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-xs font-bold text-slate-900">
                    1. Enter your details
                  </h3>
                  <p className="text-[10px] text-slate-500 leading-snug">
                    Share your personal and address information.
                  </p>
                </div>
              </div>

              {/* Journey Step 2 */}
              <div className="relative flex items-start gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 z-10 shadow-2xs transition-colors ${
                    currentStep === 2 ? 'bg-[#0A7A74]' : 'bg-slate-300'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-xs font-bold text-slate-900">
                    2. Verify your email
                  </h3>
                  <p className="text-[10px] text-slate-500 leading-snug">
                    Use the OTP sent to your email to complete registration.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight Privacy Card (Compact) */}
            <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/80 space-y-0.5 text-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#0A7A74]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0A7A74] shrink-0" />
                <span>Your privacy is our priority</span>
              </div>
              <p className="text-[10px] text-slate-600 pl-5 leading-snug">
                Your information is secure and protected with us.
              </p>
            </div>

            {/* Time Estimate */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Usually takes a few minutes</span>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: STEP 1 FORM OR STEP 2 OTP ================= */}
          <div className="lg:col-span-8 xl:col-span-8">
            {currentStep === 1 ? (
              /* ---------------- STEP 1: FORM (COMPACT, LESS SCROLL) ---------------- */
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 lg:p-6 space-y-4">
                {/* Header Notice */}
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500">Step 1 of 2</span>
                  <span className="text-[11px] font-bold text-rose-500">* Fields are mandatory.</span>
                </div>

                <form onSubmit={handleStep1Submit} className="space-y-3.5">
                  {/* ================= SECTION 1: PERSONAL DETAILS ================= */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
                      <div className="w-5 h-5 rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center border border-teal-200 shrink-0">
                        <User className="w-3 h-3" />
                      </div>
                      <h3 className="text-[11px] font-black tracking-wider text-[#0A7A74] uppercase">
                        PERSONAL DETAILS
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3">
                      {/* Title */}
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Title *</label>
                        <select
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white text-slate-800 focus:border-[#0A7A74] focus:outline-hidden transition-all shadow-2xs"
                        >
                          <option value="Mr.">Mr.</option>
                          <option value="Mrs.">Mrs.</option>
                          <option value="Ms.">Ms.</option>
                          <option value="Master">Master</option>
                          <option value="Dr.">Dr.</option>
                        </select>
                      </div>

                      {/* First name */}
                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">First name *</label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First name"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                        />
                      </div>

                      {/* Last name */}
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Last name *</label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last name"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                        />
                      </div>

                      {/* Gender */}
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Gender *</label>
                        <select
                          required
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white text-slate-800 focus:border-[#0A7A74] focus:outline-hidden transition-all shadow-2xs"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* ================= SECTION 2: CONTACT DETAILS ================= */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
                      <div className="w-5 h-5 rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center border border-teal-200 shrink-0">
                        <Phone className="w-3 h-3" />
                      </div>
                      <h3 className="text-[11px] font-black tracking-wider text-[#0A7A74] uppercase">
                        CONTACT DETAILS
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3">
                      {/* Date of birth */}
                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Date of birth *</label>
                        <input
                          type="date"
                          required
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:outline-hidden transition-all shadow-2xs"
                        />
                      </div>

                      {/* Mobile number */}
                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Mobile number *</label>
                        <input
                          type="tel"
                          required
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="10-digit mobile number"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                        />
                      </div>

                      {/* Email address */}
                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          Email address (required for OTP) *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="patient@example.com"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ================= SECTION 3: ADDRESS DETAILS ================= */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
                      <div className="w-5 h-5 rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center border border-teal-200 shrink-0">
                        <MapPin className="w-3 h-3" />
                      </div>
                      <h3 className="text-[11px] font-black tracking-wider text-[#0A7A74] uppercase">
                        ADDRESS DETAILS
                      </h3>
                    </div>

                    {/* Row 1: Country, State, Pincode, District */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3">
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Country *</label>
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white text-slate-800 focus:border-[#0A7A74] focus:outline-hidden transition-all shadow-2xs"
                        >
                          <option value="India">India</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">State / UT *</label>
                        <select
                          value={stateUt}
                          onChange={(e) => setStateUt(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white text-slate-800 focus:border-[#0A7A74] focus:outline-hidden transition-all shadow-2xs"
                        >
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Pincode (6 digits) *</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                          placeholder="110085"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                        />
                      </div>

                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">District *</label>
                        <input
                          type="text"
                          required
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          placeholder="North West Delhi"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Row 2: Address line 1 (8 cols) + Aadhaar (4 cols) on same line to eliminate scrolling */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3">
                      <div className="sm:col-span-8 space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Address line 1 *</label>
                        <input
                          type="text"
                          required
                          value={addressLine1}
                          onChange={(e) => setAddressLine1(e.target.value)}
                          placeholder="House / Flat No., Street, Area"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                        />
                      </div>

                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          Aadhaar (12 digits) <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          maxLength={14}
                          value={aadhaar}
                          onChange={(e) => setAadhaar(e.target.value)}
                          placeholder="1234-5678-9012"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Consent Checkbox (Compact 1-liner) */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={consentChecked}
                        onChange={(e) => setConsentChecked(e.target.checked)}
                        className="rounded border-slate-300 text-[#0A7A74] focus:ring-[#0A7A74] h-3.5 w-3.5"
                      />
                      <span>
                        Please tick mark for the Patient Health Data{' '}
                        <button
                          type="button"
                          onClick={() => setConsentModalOpen(true)}
                          className="text-[#0A7A74] underline hover:text-[#08635e] cursor-pointer"
                        >
                          Consent &amp; Notice Form.!
                        </button>
                      </span>
                    </label>
                  </div>

                  {/* 100% Free Registration Banner (Condensed) */}
                  <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-xl p-2.5 text-xs text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="font-bold">
                        Patient Registration is <strong className="text-emerald-700 font-black">100% FREE</strong> (Zero Fee).
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600">
                      Doctor consultation fee is payable only at hospital OPD counter.
                    </span>
                  </div>

                  {/* Bottom Action Row (Save & continue later / Verify email & continue) */}
                  <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/bookappointment/patient-type')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A7A74] transition-colors order-2 sm:order-1"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Save and continue later</span>
                    </button>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs sm:text-sm font-black transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] order-1 sm:order-2"
                    >
                      <span>Verify email &amp; continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* ---------------- STEP 2: EMAIL OTP VERIFICATION ---------------- */
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A7A74] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Personal &amp; Address Details</span>
                  </button>
                  <span className="text-xs font-bold text-[#0A7A74]">Step 2 of 2</span>
                </div>

                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 mx-auto rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center border border-teal-200">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Verify Your Email Address
                  </h2>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    We have dispatched a 6-digit OTP code to:{' '}
                    <strong className="text-[#0A7A74] font-bold">{email}</strong>
                  </p>
                </div>

                {/* Demonstration OTP Helper */}
                <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center justify-between max-w-md mx-auto">
                  <div className="flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-[#0A7A74]" />
                    <span>Demo Verification Code:</span>
                  </div>
                  <span className="font-mono font-black text-sm text-[#0A7A74] bg-white px-2 py-0.5 rounded border border-teal-300">
                    {generatedOtp}
                  </span>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-5 max-w-md mx-auto">
                  <div className="space-y-1.5 text-center">
                    <label className="text-xs font-bold text-slate-700 block">
                      Enter 6-Digit Email OTP *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-48 mx-auto text-center font-mono text-2xl tracking-[0.35em] px-3 py-2 rounded-xl border-2 border-slate-300 focus:border-[#0A7A74] focus:outline-hidden shadow-2xs"
                    />
                  </div>

                  <div className="text-center text-xs text-slate-500">
                    {otpTimer > 0 ? (
                      <span>Resend OTP in <strong>{otpTimer}s</strong></span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-[#0A7A74] font-bold hover:underline cursor-pointer"
                      >
                        Resend Email OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={verifyingOtp || otpInput.length < 6}
                    className="w-full py-2.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-black transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {verifyingOtp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying &amp; Generating UHID...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration &amp; Proceed</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ----------------- 4. COMPACT FOOTER ----------------- */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-3">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs text-slate-600">
          <div className="font-semibold text-slate-800">
            &copy; 2026 Brahm Shakti Hospital.
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-teal-200 bg-teal-50 text-[#0A7A74] font-bold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0A7A74]" />
            <span>NABH &amp; NABL Accredited</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <a
              href="mailto:helpdesk@brahmshaktihospital.com"
              className="inline-flex items-center gap-1 hover:text-[#0A7A74] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>helpdesk@brahmshaktihospital.com</span>
            </a>
            <a
              href="tel:01127531683"
              className="inline-flex items-center gap-1 text-rose-600 font-bold hover:underline"
            >
              <Phone className="w-3.5 h-3.5 text-rose-500" />
              <span>011-27531683</span>
            </a>
          </div>
        </div>
      </footer>

      {/* ----------------- 5. REFUND POLICY MODAL ----------------- */}
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
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>1. Registration:</strong> Patient registration and UHID creation is 100% FREE. No registration fees are collected.
              </p>
              <p>
                <strong>2. Doctor Availability:</strong> If the consulting doctor is called for emergency care, appointments may be rescheduled at no additional cost.
              </p>
              <p>
                <strong>3. Cancellation:</strong> Appointments can be cancelled or rescheduled up to 2 hours prior to the booked slot from your Patient Portal.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRefundModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#0A7A74] text-white text-xs font-bold cursor-pointer"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* ----------------- 6. CONSENT & NOTICE MODAL ----------------- */}
      {consentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0A7A74]" />
                <h3 className="font-black text-slate-900 text-base">
                  Patient Health Data Consent &amp; Notice Form
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setConsentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2.5 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed">
              <p>
                <strong>1. Data Confidentiality:</strong> Brahm Shakti Hospital &amp; Research Centre is committed to safeguarding patient privacy. Medical records and demographic information are stored securely in compliance with the Digital Personal Data Protection (DPDP) standards.
              </p>
              <p>
                <strong>2. Use of Information:</strong> The personal information provided during registration (Name, Phone, Email, Address, and Date of Birth) is exclusively used for hospital patient identification, generating your permanent Unique Hospital Identification (UHID), and OPD consultation scheduling.
              </p>
              <p>
                <strong>3. Free Registration:</strong> Registration and generation of your UHID is 100% free of charge. No online payment is requested or collected for creating a patient profile.
              </p>
              <p>
                <strong>4. Communication:</strong> You agree to receive critical OPD appointment confirmations, slot reminders, and diagnostic report notifications via Email and SMS.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setConsentModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs font-bold transition-all"
              >
                I Understand &amp; Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPatientRegisterPage;
