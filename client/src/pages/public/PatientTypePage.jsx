import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Clock,
  Lock,
  ArrowRight,
  User,
  UserPlus,
  Mail,
  Phone,
  ArrowLeft,
  X,
  AlertCircle,
  KeyRound,
  Loader2,
  CheckCircle2,
  Check,
  Menu,
  Heart,
  Activity,
  Home,
  Calendar
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Beautiful transparent clinical stethoscope artwork with glowing heart & ECG pulse
const MedicalStethoscopeArtwork = ({ className = 'w-full max-h-64' }) => (
  <svg
    viewBox="0 0 460 330"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="metallicTube" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="45%" stopColor="#0A7A74" />
        <stop offset="100%" stopColor="#08635e" />
      </linearGradient>
      <linearGradient id="chromeMetal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="30%" stopColor="#CBD5E1" />
        <stop offset="60%" stopColor="#94A3B8" />
        <stop offset="85%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
      <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="50%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#0A7A74" />
      </linearGradient>
      <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Soft subtle radial ambient glow */}
    <circle cx="260" cy="165" r="120" fill="#0A7A74" fillOpacity="0.05" />
    <circle cx="260" cy="165" r="80" fill="#0A7A74" fillOpacity="0.07" />

    {/* Glowing Cardiology Heart Graphic */}
    <g transform="translate(225, 90) scale(0.95)" filter="url(#softGlow)">
      <path
        d="M50 88 C20 55 0 35 0 20 C0 8 9 0 22 0 C32 0 42 7 50 18 C58 7 68 0 78 0 C91 0 100 8 100 20 C100 35 80 55 50 88 Z"
        fill="url(#heartGradient)"
        opacity="0.85"
      />
      {/* Heart glossy reflection */}
      <path
        d="M22 6 C14 6 8 12 8 20 C8 30 20 46 45 74 C34 56 26 42 26 30 C26 16 32 10 38 8 C32 6 26 6 22 6 Z"
        fill="#FFFFFF"
        opacity="0.32"
      />
    </g>

    {/* Dynamic ECG Heartbeat Pulse Wave flowing across */}
    <path
      d="M30 175 L160 175 L175 155 L188 205 L202 130 L218 215 L230 165 L245 182 L260 175 L430 175"
      stroke="#0A7A74"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.75"
    />
    <circle cx="202" cy="130" r="3.5" fill="#0A7A74" />
    <circle cx="218" cy="215" r="3" fill="#E11D48" />

    {/* Stethoscope Ear Tubes (Binaural Chrome) */}
    <path
      d="M80 65 C75 90 85 120 110 140 L128 155"
      stroke="url(#chromeMetal)"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M138 65 C143 90 133 120 110 140"
      stroke="url(#chromeMetal)"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />

    {/* Soft silicone ear tips */}
    <ellipse cx="78" cy="63" rx="5.5" ry="7.5" fill="#1E293B" />
    <ellipse cx="140" cy="63" rx="5.5" ry="7.5" fill="#1E293B" />

    {/* Binaural Spring connector */}
    <path d="M95 108 Q109 116 123 108" stroke="url(#chromeMetal)" strokeWidth="4" fill="none" />

    {/* Stethoscope Flexible Tubing looping smoothly */}
    <path
      d="M118 148 C118 185 85 235 100 265 C118 300 180 305 210 275 C240 245 220 195 250 185 C280 175 320 215 330 245 C338 270 320 290 295 295 C270 300 240 280 250 250"
      stroke="url(#metallicTube)"
      strokeWidth="8"
      strokeLinecap="round"
      fill="none"
      filter="drop-shadow(0 3px 6px rgba(0,0,0,0.12))"
    />

    {/* Chrome stem connector to chest piece */}
    <path d="M250 250 L252 240" stroke="url(#chromeMetal)" strokeWidth="6.5" strokeLinecap="round" />

    {/* Stethoscope Dual-Head Chest Piece */}
    <g transform="translate(252, 225)">
      <circle cx="20" cy="20" r="27" fill="url(#chromeMetal)" stroke="#94A3B8" strokeWidth="2" />
      <circle cx="20" cy="20" r="22" fill="#0B2545" />
      <circle cx="20" cy="20" r="19" fill="url(#chromeMetal)" opacity="0.4" />
      <circle cx="20" cy="20" r="15" fill="#0A7A74" />
      <circle cx="20" cy="20" r="6.5" fill="url(#chromeMetal)" />
      <ellipse cx="15" cy="14" rx="9" ry="4.5" fill="#FFFFFF" opacity="0.45" transform="rotate(-30 15 14)" />
    </g>

    {/* Subtle floating medical crosses */}
    <g opacity="0.3" transform="translate(45, 220)">
      <rect x="5" y="0" width="3.5" height="14" rx="1.75" fill="#0A7A74" />
      <rect x="0" y="5" width="14" height="3.5" rx="1.75" fill="#0A7A74" />
    </g>
    <g opacity="0.22" transform="translate(385, 65)">
      <rect x="6" y="0" width="3.5" height="15" rx="1.75" fill="#0A7A74" />
      <rect x="0" y="6" width="15" height="3.5" rx="1.75" fill="#0A7A74" />
    </g>
  </svg>
);

// Beautiful SVG illustration for Registered Patient Verification
const RegisteredPatientIllustration = ({ className = 'w-auto h-24' }) => (
  <svg
    viewBox="0 0 320 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="regShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0D9488" />
        <stop offset="100%" stopColor="#0A7A74" />
      </linearGradient>
      <linearGradient id="regLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#99F6E4" />
        <stop offset="100%" stopColor="#5EEAD4" />
      </linearGradient>
      <filter id="regCardShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0A7A74" floodOpacity="0.12" />
      </filter>
    </defs>

    {/* Background Soft Organic Leaves & Glow */}
    <ellipse cx="160" cy="115" rx="90" ry="75" fill="#E6FFFA" />

    {/* Left Leaf Accent */}
    <path
      d="M85 105 C70 88 70 65 88 60 C106 55 110 78 96 95 C90 102 88 105 85 105 Z"
      fill="url(#regLeafGrad)"
      opacity="0.8"
    />

    {/* Right Leaf Accent */}
    <path
      d="M235 105 C250 88 250 65 232 60 C214 55 210 78 224 95 C230 102 232 105 235 105 Z"
      fill="url(#regLeafGrad)"
      opacity="0.8"
    />

    {/* Patient ID Card Base */}
    <g filter="url(#regCardShadow)">
      <rect x="95" y="38" width="130" height="135" rx="16" fill="#FFFFFF" stroke="#0A7A74" strokeWidth="2" />
      {/* Top Header Strip */}
      <path d="M96 54 C96 45 103 39 112 39 L208 39 C217 39 224 45 224 54 L224 68 L96 68 Z" fill="#0A7A74" />
      <circle cx="115" cy="53.5" r="3.5" fill="#FFFFFF" />
      <rect x="126" y="51.5" width="55" height="4" rx="2" fill="#FFFFFF" />

      {/* User Silhouette Avatar */}
      <circle cx="130" cy="98" r="14" fill="#E6FFFA" stroke="#0A7A74" strokeWidth="1.5" />
      <circle cx="130" cy="94" r="5" fill="#0A7A74" />
      <path d="M121 106 C121 102 125 100 130 100 C135 100 139 102 139 106 Z" fill="#0A7A74" />

      {/* Profile Lines / Info Lines */}
      <rect x="154" y="90" width="56" height="4.5" rx="2" fill="#94A3B8" />
      <rect x="154" y="100" width="42" height="4" rx="2" fill="#CBD5E1" />
      <rect x="110" y="124" width="100" height="4" rx="2" fill="#E2E8F0" />
      <rect x="110" y="134" width="75" height="4" rx="2" fill="#E2E8F0" />
      <rect x="110" y="144" width="60" height="4" rx="2" fill="#E2E8F0" />
    </g>

    {/* Secure Shield Overlay with Checkmark */}
    <g transform="translate(182, 110)">
      <path
        d="M26 0 C40 0 52 5 52 5 C52 28 40 48 26 56 C12 48 0 28 0 5 C0 5 12 0 26 0 Z"
        fill="url(#regShieldGrad)"
        filter="url(#regCardShadow)"
      />
      <path
        d="M26 3 C38 3 48 7 48 7 C48 27 38 45 26 52 C14 45 4 27 4 7 C4 7 14 3 26 3 Z"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeOpacity="0.4"
        fill="none"
      />
      <path
        d="M17 26 L23 32 L35 20"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export const PatientTypePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthSession, isAuthenticated, user } = useAuth();

  // 'choose' | 'registered-otp'
  const [viewMode, setViewMode] = useState('choose');
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Preserve consultation booking parameters (doctor, date, mode, slot, etc.)
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';

  // Registered Patient Email OTP State
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registeredOtp, setRegisteredOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  const handleSendRegisteredOtp = (e) => {
    e.preventDefault();
    if (!registeredEmail.trim() || !registeredEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSendingOtp(true);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setRegisteredOtp(code);
      setOtpSent(true);
      setOtpTimer(60);
      setEnteredOtp('');
      setSendingOtp(false);
      toast.success(`Verification OTP sent to ${registeredEmail.trim()}`);
    }, 400);
  };

  const handleResendRegisteredOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setRegisteredOtp(code);
    setOtpTimer(60);
    toast.success(`New OTP sent to ${registeredEmail.trim()}`);
  };

  const handleVerifyRegisteredOtp = (e) => {
    e.preventDefault();
    if (!enteredOtp.trim() || enteredOtp.trim() !== registeredOtp) {
      toast.error('Invalid OTP code. Please check the 6-digit code shown below.');
      return;
    }

    setVerifyingOtp(true);
    setTimeout(() => {
      const cleanEmail = registeredEmail.trim().toLowerCase();
      const patientName =
        cleanEmail === 'patient@brahmshaktihospital.com'
          ? 'Ramesh Kumar (Patient)'
          : cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

      const patientUser = {
        name: patientName,
        email: cleanEmail,
        role: 'patient',
        phone: '9871023456',
        uhid: `BSH-2026-${Math.floor(10000 + Math.random() * 90000)}`
      };

      setAuthSession(patientUser, 'bsh_jwt_' + Date.now());

      toast.success(`Welcome back, ${patientName}! Redirecting to appointment booking...`);

      const returnUrl = `/bookappointment${queryString}`;
      setTimeout(() => {
        navigate(returnUrl, { replace: true });
      }, 700);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F0F8F9] text-slate-800 flex flex-col font-sans selection:bg-[#0A7A74] selection:text-white">
      {/* -------------------- 1. NAVBAR (IDENTICAL TO BOOK APPOINTMENT PAGE) -------------------- */}
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
                <div className="text-[10px] font-medium text-[#0A7A74] italic leading-tight">
                  Trust of Generations
                </div>
              </div>
            </Link>
          </div>

          {/* Right: Portal Links (Identical match to Book Appointment page navbar) */}
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

      {/* -------------------- 2. BREADCRUMB & HEADER SECTION -------------------- */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-[#0A7A74] transition-colors">
            <Home className="w-3 h-3 text-[#0A7A74]" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <Link to={`/bookappointment${queryString}`} className="hover:text-[#0A7A74] transition-colors">
            Book Appointment
          </Link>
          <span>/</span>
          <span className="text-slate-800">
            {viewMode === 'registered-otp' ? 'Registered Patient Sign-in' : 'Patient Type'}
          </span>
        </div>

        {/* Dynamic Stepper Bar (Active in registered OTP view) */}
        {viewMode === 'registered-otp' ? (
          <div className="flex items-center gap-3 text-xs">
            <div className={`flex items-center gap-1.5 font-bold ${!otpSent ? 'text-[#0A7A74]' : 'text-slate-400'}`}>
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  otpSent
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0A7A74] text-white'
                }`}
              >
                {otpSent ? '✓' : '1'}
              </span>
              <span className="text-[11px] sm:text-xs">Registered Email</span>
            </div>

            <div className="w-6 sm:w-10 h-0.5 bg-slate-300"></div>

            <div className={`flex items-center gap-1.5 font-bold ${otpSent ? 'text-[#0A7A74]' : 'text-slate-400'}`}>
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  otpSent
                    ? 'bg-[#0A7A74] text-white ring-2 ring-[#0A7A74]/20'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                2
              </span>
              <span className="text-[11px] sm:text-xs">Email OTP</span>
            </div>
          </div>
        ) : (
          <div className="text-[11px] font-bold text-slate-400 hidden sm:block">
            Step 1 of 2: Patient Classification
          </div>
        )}
      </div>

      {/* Page Title & Subtitle */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-3">
        <h1 className="text-xl sm:text-2xl font-black text-[#0A7A74] tracking-tight leading-tight">
          {viewMode === 'registered-otp' ? 'Sign In as Registered Patient' : 'Book an Appointment'}
        </h1>
        <p className="text-[11px] sm:text-xs font-medium text-slate-600">
          {viewMode === 'registered-otp'
            ? 'Enter your registered email address to access your hospital records and confirm your OPD slot.'
            : 'Are you a new or registered patient? Choose an option to proceed with your booking.'}
        </p>
      </div>

      {/* -------------------- 3. MAIN CONTENT -------------------- */}
      {viewMode === 'choose' ? (
        /* ================= VIEW 1: ARE YOU A NEW OR REGISTERED PATIENT ================= */
        <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex items-center justify-center">
          <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* LEFT / CENTER PANEL: Classification Cards */}
              <div className="lg:col-span-7 xl:col-span-7 p-6 sm:p-10 lg:p-12 space-y-7 relative z-10">
                <div className="text-center sm:text-left space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B2545]">
                    Select Patient Category
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Registered patients can sign in via instant OTP without re-entering personal details.
                  </p>
                </div>

                {/* The 2 Patient Classification Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Card 1: Registered Patient */}
                  <div className="p-5 sm:p-6 rounded-2xl border-2 border-slate-200 hover:border-[#0A7A74] hover:shadow-md transition-all flex flex-col justify-between items-center text-center space-y-4 bg-white group">
                    <div className="w-14 h-14 rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center border border-teal-200 group-hover:scale-105 transition-transform">
                      <User className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5 flex-1 flex flex-col justify-center">
                      <h3 className="font-extrabold text-slate-900 text-base">
                        Registered Patient
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        I have already registered with Brahm Shakti Hospital. Fast sign-in via Email OTP.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setRegisteredOtp('');
                        setEnteredOtp('');
                        setViewMode('registered-otp');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                    >
                      <span>Registered Patient</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card 2: New Patient */}
                  <div className="p-5 sm:p-6 rounded-2xl border-2 border-slate-200 hover:border-[#0A7A74] hover:shadow-md transition-all flex flex-col justify-between items-center text-center space-y-4 bg-white group">
                    <div className="w-14 h-14 rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center border border-teal-200 group-hover:scale-105 transition-transform">
                      <UserPlus className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5 flex-1 flex flex-col justify-center">
                      <h3 className="font-extrabold text-slate-900 text-base">
                        New Patient
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        First visit to Brahm Shakti Hospital. Quick registration with Email OTP (No payment required).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/bookappointment/new-patient${queryString}`)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                    >
                      <span>New Patient</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* TABLET / MOBILE VIEW ONLY: 3 Security Checkmarks rendered below cards */}
                <div className="lg:hidden pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center shrink-0 border border-teal-200">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="font-semibold">Your information is secure and protected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center shrink-0 border border-teal-200">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="font-semibold">Quick and easy appointment booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center shrink-0 border border-teal-200">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setSecurityModalOpen(true)}
                      className="font-bold text-[#0A7A74] hover:underline"
                    >
                      Security &amp; Fraud Prevention Notes
                    </button>
                  </div>
                </div>

                {/* Back Link */}
                <div className="pt-1 text-center sm:text-left">
                  <Link
                    to={`/bookappointment${queryString}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A7A74] transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Slot &amp; Doctor Selection</span>
                  </Link>
                </div>
              </div>

              {/* RIGHT PANEL (DESKTOP VIEW): Pure Transparent Stethoscope & Cardiology Heart Artwork */}
              <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 relative self-stretch bg-gradient-to-br from-sky-50/60 via-teal-50/40 to-white flex-col justify-between p-8 xl:p-10 border-l border-slate-100 overflow-hidden">
                <div className="relative w-full flex-1 flex items-center justify-center min-h-[240px]">
                  <MedicalStethoscopeArtwork className="w-full max-h-64 drop-shadow-sm select-none" />
                </div>

                <div className="space-y-3 pt-3 z-10 text-xs text-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#0A7A74] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="font-bold text-slate-800">
                      Your information is secure and protected
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#0A7A74] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="font-bold text-slate-800">
                      Quick and easy appointment booking
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#0A7A74] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setSecurityModalOpen(true)}
                      className="font-bold text-[#0A7A74] hover:underline cursor-pointer text-left"
                    >
                      Security &amp; Fraud Prevention Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* ================= VIEW 2: REGISTERED PATIENT EMAIL OTP VERIFICATION (REDESIGNED BENTO GRID) ================= */
        <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 xl:gap-6 items-start">
            {/* ================= LEFT COLUMN: SIGN-IN JOURNEY CARD ================= */}
            <div className="lg:col-span-4 xl:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
              {/* Top Compact Illustration */}
              <div className="w-full flex items-center justify-center py-0.5">
                <RegisteredPatientIllustration className="w-auto h-24 select-none drop-shadow-xs" />
              </div>

              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Quick sign-in journey
                </h2>
              </div>

              {/* Vertical Timeline Stepper */}
              <div className="relative pl-1 space-y-3.5">
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200"></div>

                {/* Step 1 */}
                <div className="relative flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 z-10 shadow-2xs transition-colors ${
                      !otpSent ? 'bg-[#0A7A74]' : 'bg-emerald-600'
                    }`}
                  >
                    {otpSent ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Mail className="w-3.5 h-3.5" />}
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    <h3 className="text-xs font-bold text-slate-900">
                      1. Enter registered email
                    </h3>
                    <p className="text-[10px] text-slate-500 leading-snug">
                      Directly connects your existing UHID and patient profile.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 z-10 shadow-2xs transition-colors ${
                      otpSent ? 'bg-[#0A7A74]' : 'bg-slate-300'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    <h3 className="text-xs font-bold text-slate-900">
                      2. Instant OTP verification
                    </h3>
                    <p className="text-[10px] text-slate-500 leading-snug">
                      Receive a secure 6-digit passcode in your email inbox.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 z-10 shadow-2xs bg-slate-300">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    <h3 className="text-xs font-bold text-slate-900">
                      3. Confirm appointment
                    </h3>
                    <p className="text-[10px] text-slate-500 leading-snug">
                      Your consultation slot is reserved without filling repetitive forms.
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlight Privacy Card */}
              <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/80 space-y-0.5 text-slate-800">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#0A7A74]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0A7A74] shrink-0" />
                  <span>Fast, secure &amp; 100% free</span>
                </div>
                <p className="text-[10px] text-slate-600 pl-5 leading-snug">
                  No password required. Instant OTP-based authentication.
                </p>
              </div>

              {/* Time Estimate */}
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Usually takes under 1 minute</span>
              </div>
            </div>

            {/* ================= RIGHT COLUMN: FORM OR OTP CARD ================= */}
            <div className="lg:col-span-8 xl:col-span-8">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 lg:p-6 space-y-4">
                {!otpSent ? (
                  /* ---------------- PHASE 1: EMAIL ADDRESS INPUT ---------------- */
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <button
                        type="button"
                        onClick={() => setViewMode('choose')}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A7A74] transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Patient Category</span>
                      </button>
                      <span className="text-[11px] font-bold text-slate-500">Step 1 of 2</span>
                    </div>

                    <form onSubmit={handleSendRegisteredOtp} className="space-y-4">
                      {/* Section Heading */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
                          <div className="w-5 h-5 rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center border border-teal-200 shrink-0">
                            <Mail className="w-3 h-3" />
                          </div>
                          <h3 className="text-[11px] font-black tracking-wider text-[#0A7A74] uppercase">
                            REGISTERED EMAIL IDENTIFICATION
                          </h3>
                        </div>

                        {/* Input Field */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 block">
                            Registered Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={registeredEmail}
                            onChange={(e) => setRegisteredEmail(e.target.value)}
                            placeholder="e.g. patient@brahmshaktihospital.com"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm font-medium bg-white text-slate-800 focus:border-[#0A7A74] focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                          />
                          <p className="text-[10px] text-slate-500">
                            Enter the email address you used during your hospital registration or previous OPD visits.
                          </p>
                        </div>
                      </div>

                      {/* Demo Quick-Fill Pill */}
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <span className="font-semibold text-slate-700">Demo Patient Account:</span>
                        <button
                          type="button"
                          onClick={() => setRegisteredEmail('patient@brahmshaktihospital.com')}
                          className="text-[#0A7A74] font-bold hover:underline cursor-pointer text-left sm:text-right"
                        >
                          Use patient@brahmshaktihospital.com
                        </button>
                      </div>

                      {/* 100% Free / Benefits Box */}
                      <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-xl p-2.5 text-xs text-slate-800 space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="font-bold">
                            Existing UHID and medical records will be automatically linked.
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="text-[11px] text-slate-600">
                            Patient registration is <strong className="text-emerald-700 font-bold">100% FREE</strong>. Subsidized doctor consultation fee is payable at the hospital OPD counter.
                          </span>
                        </div>
                      </div>

                      {/* Bottom Action Row */}
                      <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setViewMode('choose')}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A7A74] transition-colors order-2 sm:order-1"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Back to Patient Category</span>
                        </button>

                        <button
                          type="submit"
                          disabled={sendingOtp}
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] disabled:opacity-50 text-white text-xs sm:text-sm font-black transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] order-1 sm:order-2"
                        >
                          {sendingOtp ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Sending Email OTP...</span>
                            </>
                          ) : (
                            <>
                              <span>Send Email OTP</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* ---------------- PHASE 2: OTP VERIFICATION INPUT ---------------- */
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A7A74] transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Change Email Address</span>
                      </button>
                      <span className="text-[11px] font-bold text-slate-500">Step 2 of 2</span>
                    </div>

                    <div className="text-center space-y-1.5 pt-1">
                      <div className="w-12 h-12 mx-auto rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center border border-teal-200">
                        <Mail className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900">
                        Verify Your Email Address
                      </h3>
                      <p className="text-xs text-slate-600 max-w-md mx-auto">
                        We have dispatched a 6-digit OTP code to:{' '}
                        <strong className="text-[#0A7A74] font-bold">{registeredEmail}</strong>
                      </p>
                    </div>

                    {/* Demonstration OTP Helper Banner */}
                    <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center justify-between max-w-md mx-auto">
                      <div className="flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4 text-[#0A7A74]" />
                        <span>Demo Verification Code:</span>
                      </div>
                      <span className="font-mono font-black text-sm text-[#0A7A74] bg-white px-2 py-0.5 rounded border border-teal-300">
                        {registeredOtp}
                      </span>
                    </div>

                    <form onSubmit={handleVerifyRegisteredOtp} className="space-y-5 max-w-md mx-auto">
                      <div className="space-y-1.5 text-center">
                        <label className="text-xs font-bold text-slate-700 block">
                          Enter 6-Digit Verification Code *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder="• • • • • •"
                          className="w-48 mx-auto text-center font-mono text-2xl tracking-[0.35em] px-3 py-2 rounded-xl border-2 border-slate-300 focus:border-[#0A7A74] focus:outline-hidden shadow-2xs"
                        />
                      </div>

                      <div className="text-center text-xs text-slate-500">
                        {otpTimer > 0 ? (
                          <span>
                            Resend OTP in <strong>{otpTimer}s</strong>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendRegisteredOtp}
                            className="text-[#0A7A74] font-bold hover:underline cursor-pointer"
                          >
                            Resend Email OTP
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={verifyingOtp || enteredOtp.length < 6}
                        className="w-full py-2.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-black transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {verifyingOtp ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Verifying &amp; Redirecting...</span>
                          </>
                        ) : (
                          <>
                            <span>Verify OTP &amp; Proceed to Appointment</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* -------------------- 3. DEDICATED PORTAL FOOTER -------------------- */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-3.5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="font-semibold">&copy; 2026 Brahm Shakti Hospital.</div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-300 bg-teal-50 text-[#0A7A74] font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-[#0A7A74]" />
            <span>NABH &amp; NABL Accredited</span>
          </div>

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

      {/* Refund Policy Modal */}
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
                <strong>1. Registration:</strong> Patient registration is completely FREE of charge. We do not collect registration fees.
              </p>
              <p>
                <strong>2. Doctor Availability:</strong> If the doctor is called for emergency surgery, appointments are rescheduled at zero fee or consultation is adjusted at the counter.
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

      {/* Security Notes Modal */}
      {securityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-[#0A7A74]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-black text-base text-slate-800">Security &amp; Fraud Prevention</h3>
              </div>
              <button
                type="button"
                onClick={() => setSecurityModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                • Brahm Shakti Hospital will never ask for your bank OTP, debit card PIN, or UPI passwords over phone or email.
              </p>
              <p>
                • Registration is 100% free. Doctor consultation fee is paid directly at the hospital registration billing counter.
              </p>
              <p>
                • Digital OTP verification is only used to secure your UHID and appointment records.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSecurityModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#0A7A74] text-white text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientTypePage;
