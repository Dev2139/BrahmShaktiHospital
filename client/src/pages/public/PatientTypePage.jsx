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
  Activity
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
                <div className="text-xs font-black tracking-wider text-[#0B2545] uppercase leading-tight">
                  OPD APPOINTMENT PORTAL
                </div>
                <div className="text-[11px] font-medium text-[#0A7A74] italic leading-tight">
                  Trust of Generations
                </div>
              </div>
            </Link>
          </div>

          {/* Right: Portal Links (Identical match to Book Appointment page navbar) */}
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

      {/* -------------------- 2. MAIN BENTO CARD (MATCHING REFERENCE IMAGE 2) -------------------- */}
      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        {viewMode === 'choose' ? (
          /* ================= VIEW 1: ARE YOU A NEW OR REGISTERED PATIENT ================= */
          <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* LEFT / CENTER PANEL: Classification Cards */}
              <div className="lg:col-span-7 xl:col-span-7 p-6 sm:p-10 lg:p-12 space-y-7 relative z-10">
                {/* Header Titles */}
                <div className="text-center sm:text-left space-y-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A7A74] tracking-tight">
                    Book an Appointment
                  </h1>
                  <p className="text-sm sm:text-base font-bold text-slate-800">
                    Are you a new or registered patient?
                  </p>
                </div>

                {/* The 2 Patient Classification Cards (Clean, Balanced, No "Recommended" Badge) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Card 1: Registered Patient */}
                  <div className="p-5 sm:p-6 rounded-2xl border-2 border-slate-200 hover:border-[#0A7A74] hover:shadow-md transition-all flex flex-col justify-between items-center text-center space-y-4 bg-white group">
                    <div className="w-14 h-14 rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center border border-teal-200 group-hover:scale-105 transition-transform">
                      <User className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5 flex-1 flex flex-col justify-center">
                      <h2 className="font-extrabold text-slate-900 text-base">
                        Registered Patient
                      </h2>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        I have already registered with Brahm Shakti Hospital. Fast sign-in via Email OTP.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewMode('registered-otp')}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                    >
                      <span>Registered Patient</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card 2: New Patient (No Recommended Badge, matching clean styling) */}
                  <div className="p-5 sm:p-6 rounded-2xl border-2 border-slate-200 hover:border-[#0A7A74] hover:shadow-md transition-all flex flex-col justify-between items-center text-center space-y-4 bg-white group">
                    <div className="w-14 h-14 rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center border border-teal-200 group-hover:scale-105 transition-transform">
                      <UserPlus className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5 flex-1 flex flex-col justify-center">
                      <h2 className="font-extrabold text-slate-900 text-base">
                        New Patient
                      </h2>
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
                {/* Transparent Stethoscope + Heart + ECG Wave Illustration (No rectangular background) */}
                <div className="relative w-full flex-1 flex items-center justify-center min-h-[240px]">
                  <MedicalStethoscopeArtwork className="w-full max-h-64 drop-shadow-sm select-none" />
                </div>

                {/* Desktop 3 Checkmark Items */}
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
        ) : (
          /* ================= VIEW 2: REGISTERED PATIENT EMAIL OTP VERIFICATION ================= */
          <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('choose')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A7A74] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Selection</span>
              </button>
              <span className="text-xs font-bold text-[#0A7A74]">Registered Patient</span>
            </div>

            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 mx-auto rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center border border-teal-200">
                <Mail className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-[#0B2545]">Registered Patient Verification</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Enter your registered email address to receive an instant verification OTP.
              </p>
            </div>

            {!otpSent ? (
              /* Email Input Form */
              <form onSubmit={handleSendRegisteredOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Registered Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={registeredEmail}
                    onChange={(e) => setRegisteredEmail(e.target.value)}
                    placeholder="e.g. patient@brahmshaktihospital.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] focus:outline-hidden"
                  />
                  <p className="text-[11px] text-slate-400">
                    Enter the email address you used during your first registration.
                  </p>
                </div>

                {/* Quick Demo Hint */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
                  <span>Demo Patient Account:</span>
                  <button
                    type="button"
                    onClick={() => setRegisteredEmail('patient@brahmshaktihospital.com')}
                    className="text-[#0A7A74] font-bold hover:underline"
                  >
                    Use patient@brahmshaktihospital.com
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={sendingOtp}
                  className="w-full py-3 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] disabled:opacity-50 text-white text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
              </form>
            ) : (
              /* OTP Code Input Form */
              <form onSubmit={handleVerifyRegisteredOtp} className="space-y-5 text-center">
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#0A7A74]" />
                    <span>Demo Test OTP:</span>
                  </div>
                  <span className="font-mono font-black text-sm text-[#0A7A74] bg-white px-2 py-0.5 rounded border border-teal-300">
                    {registeredOtp}
                  </span>
                </div>

                <div className="space-y-1.5 text-center">
                  <label className="text-xs font-bold text-slate-700 block">
                    Enter 6-Digit Verification Code sent to {registeredEmail} *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-48 mx-auto text-center font-mono text-2xl tracking-[0.4em] px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-[#0A7A74] focus:outline-hidden"
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
                      className="text-[#0A7A74] font-bold hover:underline"
                    >
                      Resend Email OTP
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={verifyingOtp || enteredOtp.length < 6}
                  className="w-full py-3 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
            )}
          </div>
        )}
      </main>

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
