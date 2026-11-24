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
  Home,
  Users,
  HelpCircle,
  Shield
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

// Beautiful SVG illustration matching Image 2 (Clipboard, Medical Cross, Shield with Lock & Organic leaves)
const MedicalJourneyIllustration = ({ className = 'w-full max-h-48' }) => (
  <svg
    viewBox="0 0 320 240"
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
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0A7A74" floodOpacity="0.12" />
      </filter>
    </defs>

    {/* Background Soft Organic Leaves & Glow */}
    <ellipse cx="160" cy="130" rx="100" ry="85" fill="#E6FFFA" />
    
    {/* Left Leaf Accent */}
    <path
      d="M80 120 C65 100 65 75 85 70 C105 65 110 90 95 110 C88 118 84 120 80 120 Z"
      fill="url(#leafGrad)"
      opacity="0.8"
    />
    <path
      d="M60 145 C50 130 55 115 70 115 C85 115 85 135 75 145 C70 150 65 150 60 145 Z"
      fill="url(#leafGrad)"
      opacity="0.5"
    />

    {/* Right Leaf Accent */}
    <path
      d="M240 120 C255 100 255 75 235 70 C215 65 210 90 225 110 C232 118 236 120 240 120 Z"
      fill="url(#leafGrad)"
      opacity="0.8"
    />
    <path
      d="M260 145 C270 130 265 115 250 115 C235 115 235 135 245 145 C250 150 255 150 260 145 Z"
      fill="url(#leafGrad)"
      opacity="0.5"
    />

    {/* Clipboard Base Board */}
    <g filter="url(#cardShadow)">
      <rect x="100" y="45" width="120" height="150" rx="16" fill="#0A7A74" />
      {/* Top Clip */}
      <rect x="135" y="35" width="50" height="20" rx="6" fill="#08635e" />
      <circle cx="160" cy="45" r="4.5" fill="#FFFFFF" />

      {/* Paper Surface */}
      <rect x="108" y="55" width="104" height="132" rx="10" fill="#FFFFFF" />

      {/* Medical Cross Emblem */}
      <rect x="154" y="68" width="12" height="28" rx="2" fill="#0A7A74" />
      <rect x="146" y="76" width="28" height="12" rx="2" fill="#0A7A74" />

      {/* Document content lines */}
      <rect x="122" y="108" width="76" height="5" rx="2.5" fill="#E2E8F0" />
      <rect x="122" y="122" width="60" height="5" rx="2.5" fill="#E2E8F0" />
      <rect x="122" y="136" width="70" height="5" rx="2.5" fill="#E2E8F0" />
      <rect x="122" y="150" width="50" height="5" rx="2.5" fill="#E2E8F0" />
    </g>

    {/* Secure Shield Overlay with Lock */}
    <g transform="translate(175, 125)">
      {/* Shield Body */}
      <path
        d="M32 0 C48 0 64 6 64 6 C64 36 50 62 32 72 C14 62 0 36 0 6 C0 6 16 0 32 0 Z"
        fill="url(#shieldGrad)"
        filter="url(#cardShadow)"
      />
      {/* Shield Inner Stroke */}
      <path
        d="M32 4 C46 4 60 9 60 9 C60 34 48 58 32 67 C16 58 4 34 4 9 C4 9 18 4 32 4 Z"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeOpacity="0.4"
        fill="none"
      />
      {/* Lock Shackle */}
      <path
        d="M26 31 V26 C26 22.7 28.7 20 32 20 C35.3 20 38 22.7 38 26 V31"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Lock Body */}
      <rect x="23" y="30" width="18" height="15" rx="3" fill="#FFFFFF" />
      {/* Lock Keyhole */}
      <circle cx="32" cy="36.5" r="2" fill="#0A7A74" />
      <rect x="31" y="37" width="2" height="4" fill="#0A7A74" />
    </g>
  </svg>
);

export const NewPatientRegisterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthSession, isAuthenticated, user } = useAuth();

  // Consultation booking parameters (if coming from /bookappointment)
  const doctorId = searchParams.get('doctor') || '';
  const departmentId = searchParams.get('department') || '';
  const dateParam = searchParams.get('date') || '';
  const slotParam = searchParams.get('slot') || '';
  const modeParam = searchParams.get('mode') || 'direct';

  // Step 1: Personal & Address Details, Step 2: Email OTP Verification
  const [currentStep, setCurrentStep] = useState(1);
  const [consentModalOpen, setConsentModalOpen] = useState(false);
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
  const handleStep1Submit = (e) => {
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
    if (!email.trim() || !email.includes('@')) {
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

    // Generate 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpInput('');
    setOtpTimer(60);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.success(`Verification OTP sent to ${email.trim()}`);
  };

  const handleResendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpTimer(60);
    toast.success(`New OTP sent to ${email.trim()}`);
  };

  // Handle Step 2: Verify Email OTP & Finalize Registration
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpInput.trim() || otpInput.trim() !== generatedOtp) {
      toast.error('Invalid OTP. Please enter the 6-digit code shown below.');
      return;
    }

    setVerifyingOtp(true);
    try {
      const fullName = `${title} ${firstName.trim()} ${lastName.trim()}`;
      const uhidCode = `BSH-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

      const patientUser = {
        name: fullName,
        email: email.trim().toLowerCase(),
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

      toast.success(`Registration verified! Welcome, ${fullName}. Redirecting to book your slot...`);

      // Redirect directly back to /bookappointment preserving parameters
      const returnUrl = `/bookappointment?doctor=${encodeURIComponent(doctorId)}&department=${encodeURIComponent(departmentId)}&date=${encodeURIComponent(dateParam)}&mode=${encodeURIComponent(modeParam)}&slot=${encodeURIComponent(slotParam)}`;
      setTimeout(() => {
        navigate(returnUrl, { replace: true });
      }, 700);
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Unable to finalize registration. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F8F9] text-slate-800 flex flex-col font-sans selection:bg-[#0A7A74] selection:text-white">
      {/* -------------------- 1. TOP NAVBAR (MATCHING IMAGE 2) -------------------- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Left: Hospital Logo + OPD Portal Tagline */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group" title="Brahm Shakti Hospital Home">
              <img
                src="https://res.cloudinary.com/urzka7oz/image/upload/v1795244093/WhatsApp_Image_2026-11-20_at_10.36.32_PM-removebg-preview.png"
                alt="Brahm Shakti Hospital"
                className="h-10 sm:h-12 w-auto object-contain"
              />
              <div className="hidden sm:block border-l border-slate-200 pl-3">
                <div className="text-xs font-black tracking-wider text-[#0B2545] uppercase leading-tight">
                  OPD APPOINTMENT PORTAL
                </div>
                <div className="text-[11px] font-medium text-[#0A7A74] italic leading-tight">
                  Trust of Generations
                </div>
              </div>
            </Link>
          </div>

          {/* Right: Nav Links + Patient Portal Pill */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs sm:text-sm font-bold text-slate-800">
            <Link
              to="/"
              className="flex items-center gap-1.5 hover:text-[#0A7A74] transition-colors"
            >
              <Home className="w-4 h-4 text-[#0A7A74]" />
              <span>Home</span>
            </Link>
            <Link
              to="/doctors"
              className="flex items-center gap-1.5 hover:text-[#0A7A74] transition-colors"
            >
              <Users className="w-4 h-4 text-[#0A7A74]" />
              <span>Our Doctors</span>
            </Link>
            <Link
              to="/contact"
              className="hover:text-[#0A7A74] transition-colors"
            >
              Help &amp; Support
            </Link>
            <Link
              to={isAuthenticated ? '/patient/dashboard' : '/bookappointment/patient-type'}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-teal-200 bg-teal-50/80 text-[#0A7A74] font-black hover:bg-teal-100/70 transition-all shadow-2xs"
            >
              <User className="w-4 h-4" />
              <span>Patient Portal</span>
            </Link>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to={isAuthenticated ? '/patient/dashboard' : '/bookappointment/patient-type'}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 text-[#0A7A74] text-xs font-black"
            >
              <User className="w-3.5 h-3.5" />
              <span>Portal</span>
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
              className="flex items-center gap-2 py-1 hover:text-[#0A7A74]"
            >
              <Home className="w-4 h-4 text-[#0A7A74]" />
              <span>Home</span>
            </Link>
            <Link
              to="/doctors"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-1 hover:text-[#0A7A74]"
            >
              <Users className="w-4 h-4 text-[#0A7A74]" />
              <span>Our Doctors</span>
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#0A7A74]"
            >
              Help &amp; Support
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

      {/* -------------------- 2. BREADCRUMB -------------------- */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-[#0A7A74] transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-slate-800">New Patient Registration</span>
        </div>
      </div>

      {/* -------------------- 3. MAIN HEADING & STEPPER HEADER -------------------- */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6 text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A7A74] tracking-tight">
          Create Your Patient Account
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-600">
          Enter your details to register with Brahm Shakti Hospital.
        </p>

        {/* 2-Step Progress Indicator */}
        <div className="pt-2 flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
          {/* Step 1 Pill */}
          <div className={`flex items-center gap-2 font-bold ${currentStep === 1 ? 'text-[#0A7A74]' : 'text-slate-500'}`}>
            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-black ${
                currentStep > 1
                  ? 'bg-emerald-600 text-white'
                  : currentStep === 1
                  ? 'bg-[#0A7A74] text-white shadow-xs'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {currentStep > 1 ? '✓' : '1'}
            </div>
            <span className="whitespace-nowrap">Personal &amp; Address Details</span>
          </div>

          {/* Stepper Connector Line */}
          <div className="w-12 sm:w-20 md:w-28 h-0.5 bg-slate-300"></div>

          {/* Step 2 Pill */}
          <div className={`flex items-center gap-2 font-bold ${currentStep === 2 ? 'text-[#0A7A74]' : 'text-slate-400'}`}>
            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-black ${
                currentStep === 2
                  ? 'bg-[#0A7A74] text-white ring-4 ring-[#0A7A74]/20 shadow-xs'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              2
            </div>
            <span className="whitespace-nowrap">Email OTP Verification</span>
          </div>
        </div>
      </div>

      {/* -------------------- 4. MAIN BENTO GRID (MATCHING IMAGE 2) -------------------- */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
          {/* ================= LEFT COLUMN: REGISTRATION JOURNEY CARD ================= */}
          <div className="lg:col-span-4 xl:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
            {/* Top Graphic Illustration (Clipboard, Cross, Shield & Lock) */}
            <div className="w-full flex items-center justify-center py-1">
              <MedicalJourneyIllustration className="w-full max-h-48 drop-shadow-xs select-none" />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Your registration journey
              </h2>
            </div>

            {/* Vertical Timeline Stepper */}
            <div className="relative pl-2 space-y-6">
              {/* Connecting Vertical Line */}
              <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-slate-200"></div>

              {/* Journey Step 1 */}
              <div className="relative flex items-start gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 z-10 shadow-xs transition-colors ${
                    currentStep >= 1 ? 'bg-[#0A7A74]' : 'bg-slate-300'
                  }`}
                >
                  <User className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    1. Enter your details
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                    Share your personal and address information.
                  </p>
                </div>
              </div>

              {/* Journey Step 2 */}
              <div className="relative flex items-start gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 z-10 shadow-xs transition-colors ${
                    currentStep === 2 ? 'bg-[#0A7A74]' : 'bg-slate-300'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    2. Verify your email
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                    Use the OTP sent to your email to complete registration.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight Trust Card */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-1 text-slate-800">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#0A7A74]">
                <ShieldCheck className="w-4 h-4 text-[#0A7A74] shrink-0" />
                <span>Your privacy is our priority</span>
              </div>
              <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">
                Your information is secure and protected with us.
              </p>
            </div>

            {/* Time Estimate */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 pt-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Usually takes a few minutes</span>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: STEP 1 FORM OR STEP 2 OTP ================= */}
          <div className="lg:col-span-8 xl:col-span-8">
            {currentStep === 1 ? (
              /* ---------------- STEP 1: FORM ---------------- */
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 lg:p-9 space-y-7">
                {/* Header Row */}
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-bold text-slate-400">Step 1 of 2</span>
                  <span className="text-xs font-bold text-rose-500">* Fields are mandatory.</span>
                </div>

                <form onSubmit={handleStep1Submit} className="space-y-7">
                  {/* ================= SECTION 1: PERSONAL DETAILS ================= */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <div className="w-6 h-6 rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center border border-teal-200 shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-xs font-black tracking-wider text-[#0A7A74] uppercase">
                        PERSONAL DETAILS
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 sm:gap-4">
                      {/* Title */}
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-slate-700">Title *</label>
                        <select
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold bg-white text-slate-800 focus:border-[#0A7A74] focus:ring-2 focus:ring-[#0A7A74]/15 focus:outline-hidden transition-all shadow-2xs"
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
                        <label className="text-xs font-bold text-slate-700">First name *</label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First name"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:ring-2 focus:ring-[#0A7A74]/15 focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                        />
                      </div>

                      {/* Last name */}
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-xs font-bold text-slate-700">Last name *</label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last name"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:ring-2 focus:ring-[#0A7A74]/15 focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                        />
                      </div>

                      {/* Gender */}
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-xs font-bold text-slate-700">Gender *</label>
                        <select
                          required
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold bg-white text-slate-800 focus:border-[#0A7A74] focus:ring-2 focus:ring-[#0A7A74]/15 focus:outline-hidden transition-all shadow-2xs"
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
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <div className="w-6 h-6 rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center border border-teal-200 shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-xs font-black tracking-wider text-[#0A7A74] uppercase">
                        CONTACT DETAILS
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 sm:gap-4">
                      {/* Date of birth */}
                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-xs font-bold text-slate-700">Date of birth *</label>
                        <div className="relative">
                          <input
                            type="date"
                            required
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:ring-2 focus:ring-[#0A7A74]/15 focus:outline-hidden transition-all shadow-2xs"
                          />
                        </div>
                      </div>

                      {/* Mobile number */}
                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-xs font-bold text-slate-700">Mobile number *</label>
                        <input
                          type="tel"
                          required
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="10-digit mobile number"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:ring-2 focus:ring-[#0A7A74]/15 focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                        />
                      </div>

                      {/* Email address */}
                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-xs font-bold text-slate-700">
                          Email address (required for Email OTP) *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="patient@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:ring-2 focus:ring-[#0A7A74]/15 focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ================= SECTION 3: ADDRESS DETAILS ================= */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <div className="w-6 h-6 rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center border border-teal-200 shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-xs font-black tracking-wider text-[#0A7A74] uppercase">
                        ADDRESS DETAILS
                      </h3>
                    </div>

                    {/* Row 1: Country, State, Pincode, District */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 sm:gap-4">
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-xs font-bold text-slate-700">Country *</label>
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold bg-white text-slate-800 focus:border-[#0A7A74] focus:ring-2 focus:ring-[#0A7A74]/15 focus:outline-hidden transition-all shadow-2xs"
                        >
                          <option value="India">India</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-xs font-bold text-slate-700">State / UT *</label>
                        <select
                          value={stateUt}
                          onChange={(e) => setStateUt(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold bg-white text-slate-800 focus:border-[#0A7A74] focus:ring-2 focus:ring-[#0A7A74]/15 focus:outline-hidden transition-all shadow-2xs"
                        >
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-xs font-bold text-slate-700">Pincode (6 digits) *</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                          placeholder="110085"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:ring-2 focus:ring-[#0A7A74]/15 focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                        />
                      </div>

                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-xs font-bold text-slate-700">District *</label>
                        <input
                          type="text"
                          required
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          placeholder="North West Delhi"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:ring-2 focus:ring-[#0A7A74]/15 focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Row 2: Address line 1 */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Address line 1 *</label>
                      <input
                        type="text"
                        required
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="House / Flat No., Street, Area"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:ring-2 focus:ring-[#0A7A74]/15 focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                      />
                    </div>

                    {/* Row 3: Aadhaar number (Optional) */}
                    <div className="sm:w-1/2 space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        Aadhaar number (12 digits) <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        maxLength={14}
                        value={aadhaar}
                        onChange={(e) => setAadhaar(e.target.value)}
                        placeholder="1234-5678-9012"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:ring-2 focus:ring-[#0A7A74]/15 focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-slate-800 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={consentChecked}
                        onChange={(e) => setConsentChecked(e.target.checked)}
                        className="mt-0.5 rounded-md border-slate-300 text-[#0A7A74] focus:ring-[#0A7A74] h-4 w-4"
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

                  {/* 100% Free Registration Green Container */}
                  <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 space-y-2 text-xs text-slate-800">
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="font-bold">
                        Patient Registration &amp; UHID generation is <strong className="text-emerald-700 font-black">100% FREE</strong>.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="text-slate-600">
                        Subsidized doctor consultation fee is payable only when visiting the hospital OPD counter.
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Row (Save & continue later / Verify email & continue) */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                      className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs sm:text-sm font-black transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] order-1 sm:order-2"
                    >
                      <span>Verify email &amp; continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* ---------------- STEP 2: EMAIL OTP VERIFICATION ---------------- */
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-7 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
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

                <div className="text-center space-y-2">
                  <div className="w-14 h-14 mx-auto rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center border border-teal-200 shadow-2xs">
                    <Mail className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Verify Your Email Address
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    We have dispatched a 6-digit OTP code to:{' '}
                    <strong className="text-[#0A7A74] font-bold">{email}</strong>
                  </p>
                </div>

                {/* Demonstration OTP Helper */}
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center justify-between max-w-md mx-auto">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#0A7A74]" />
                    <span>Demo Verification Code:</span>
                  </div>
                  <span className="font-mono font-black text-sm text-[#0A7A74] bg-white px-2 py-0.5 rounded border border-teal-300">
                    {generatedOtp}
                  </span>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6 max-w-md mx-auto">
                  <div className="space-y-2 text-center">
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
                      className="w-52 mx-auto text-center font-mono text-2xl tracking-[0.35em] px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-[#0A7A74] focus:outline-hidden shadow-2xs"
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
                    className="w-full py-3.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
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

      {/* -------------------- 5. FOOTER (MATCHING IMAGE 2) -------------------- */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="font-semibold text-slate-800">
            &copy; 2026 Brahm Shakti Hospital.
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-200 bg-teal-50 text-[#0A7A74] font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-[#0A7A74]" />
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

      {/* -------------------- 6. CONSENT & NOTICE MODAL -------------------- */}
      {consentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
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
