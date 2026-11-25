import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Mail,
  Phone,
  ArrowLeft,
  X,
  AlertCircle,
  KeyRound,
  Loader2,
  Menu,
  User,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const PatientTypePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthSession, isAuthenticated } = useAuth();

  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Preserve consultation booking parameters
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

  const handleSendRegisteredOtp = async (e) => {
    e.preventDefault();
    const cleanEmail = registeredEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSendingOtp(true);
    try {
      const res = await api.post('/auth/send-otp', {
        email: cleanEmail,
        type: 'registered_patient'
      });

      if (res.data?.success) {
        if (res.data.demoOtp) {
          setRegisteredOtp(res.data.demoOtp);
        }
        setOtpSent(true);
        setOtpTimer(60);
        setEnteredOtp('');
        toast.success(`Verification OTP sent to ${cleanEmail}`);
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      if (err.response?.status === 404 || err.response?.data?.userNotFound) {
        toast.error(
          err.response?.data?.message ||
            'No registered patient account found with this email. Please register as a new patient.',
          { duration: 5500 }
        );
      } else {
        toast.error(err.response?.data?.message || 'Failed to dispatch email OTP. Please try again.');
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResendRegisteredOtp = async () => {
    const cleanEmail = registeredEmail.trim().toLowerCase();
    try {
      const res = await api.post('/auth/send-otp', {
        email: cleanEmail,
        type: 'registered_patient'
      });
      if (res.data?.success) {
        if (res.data.demoOtp) {
          setRegisteredOtp(res.data.demoOtp);
        }
        setOtpTimer(60);
        toast.success(`New OTP sent to ${cleanEmail}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  const handleVerifyRegisteredOtp = async (e) => {
    e.preventDefault();
    if (!enteredOtp.trim() || enteredOtp.trim().length !== 6) {
      toast.error('Please enter the complete 6-digit OTP code.');
      return;
    }

    setVerifyingOtp(true);
    try {
      const cleanEmail = registeredEmail.trim().toLowerCase();
      const res = await api.post('/auth/verify-otp', {
        email: cleanEmail,
        otp: enteredOtp.trim(),
        type: 'registered_patient'
      });

      if (res.data?.success) {
        const patientUser = res.data.user || {
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'patient',
          uhid: 'BSH-2026-001'
        };
        const authToken = res.data.token || ('bsh_jwt_' + Date.now());

        setAuthSession(patientUser, authToken);

        toast.success(`Welcome back, ${patientUser.name}! Connecting you to hospital appointment portal...`);

        const returnUrl = `/bookappointment${queryString}`;
        setTimeout(() => {
          navigate(returnUrl, { replace: true });
        }, 700);
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      toast.error(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#018AAE] selection:text-white bg-[#E9F8FA]">
      {/* -------------------- 1. EXACT NAVBAR (UNCHANGED AS REQUESTED) -------------------- */}
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
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#018AAE]"
            >
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
            <Link
              to="/privacy-policy"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#018AAE]"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-use"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#018AAE]"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#018AAE]"
            >
              Contact Us
            </Link>
          </div>
        )}
      </header>

      {/* -------------------- 2. FULL BACKGROUND WITH ORGANIC MEDICAL WAVES & GRAPHICS -------------------- */}
      <main className="relative flex-1 flex items-center justify-center py-8 sm:py-14 lg:py-16 px-4 overflow-hidden">
        
        {/* Full Viewport Scaled Medical Vector Wave Artwork matching the reference image perfectly */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
          <svg
            className="w-full h-full object-cover"
            viewBox="0 0 1440 800"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E9F8FA" />
                <stop offset="50%" stopColor="#D8F3F7" />
                <stop offset="100%" stopColor="#C8EFF5" />
              </linearGradient>

              {/* 3-Color Wave Gradients matching extracted palette */}
              <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#CEF5FA" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#A5ECF5" stopOpacity="0.45" />
              </linearGradient>

              <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0DAFD5" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#018AAE" stopOpacity="0.25" />
              </linearGradient>

              <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#018AAE" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0B2545" stopOpacity="0.22" />
              </linearGradient>

              <linearGradient id="metalSteth" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="50%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>
            </defs>

            {/* Base Background Tint */}
            <rect width="1440" height="800" fill="url(#bgGrad)" />

            {/* Back Wave (Soft Ice Cyan) */}
            <path
              d="M-50 250 C 250 180, 500 320, 800 240 C 1100 160, 1350 280, 1500 220 L 1500 850 L -50 850 Z"
              fill="url(#wave1)"
            />

            {/* Middle Wave (Vibrant Medical Sky Blue) */}
            <path
              d="M-50 420 C 300 340, 650 520, 950 380 C 1200 270, 1380 440, 1500 360 L 1500 850 L -50 850 Z"
              fill="url(#wave2)"
            />

            {/* Foreground Deep Wave (Ocean Blue) */}
            <path
              d="M-50 560 C 280 480, 600 640, 920 540 C 1220 440, 1380 620, 1500 530 L 1500 850 L -50 850 Z"
              fill="url(#wave3)"
            />

            {/* Floating Soft Medical Crosses (+ symbols) matching reference image */}
            <g opacity="0.35">
              {/* Left Top Cross */}
              <rect x="90" y="120" width="8" height="32" rx="4" fill="#0DAFD5" />
              <rect x="78" y="132" width="32" height="8" rx="4" fill="#0DAFD5" />

              {/* Left Bottom Cross */}
              <rect x="70" y="400" width="6" height="24" rx="3" fill="#018AAE" />
              <rect x="61" y="409" width="24" height="6" rx="3" fill="#018AAE" />

              {/* Right Top Cross */}
              <rect x="1330" y="140" width="8" height="32" rx="4" fill="#0DAFD5" />
              <rect x="1318" y="152" width="32" height="8" rx="4" fill="#0DAFD5" />
            </g>

            {/* Left Side: Stethoscope Graphic (Matches exact layout in reference image) */}
            <g transform="translate(-10, 160)" opacity="0.75" className="hidden lg:block">
              {/* Stethoscope Tubing Loops */}
              <path
                d="M 60 40 C -10 140, 40 260, 140 240 C 230 220, 260 140, 200 80 C 140 20, 60 70, 40 160 C 20 250, 110 320, 190 310"
                stroke="#018AAE"
                strokeWidth="11"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 60 40 C -10 140, 40 260, 140 240 C 230 220, 260 140, 200 80 C 140 20, 60 70, 40 160 C 20 250, 110 320, 190 310"
                stroke="#0DAFD5"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
              />

              {/* Chest Piece Disc */}
              <g transform="translate(190, 310)">
                <circle cx="0" cy="0" r="30" fill="url(#metalSteth)" stroke="#CBD5E1" strokeWidth="3" />
                <circle cx="0" cy="0" r="23" fill="#FFFFFF" opacity="0.9" />
                <circle cx="0" cy="0" r="14" fill="#018AAE" />
                <circle cx="0" cy="0" r="6" fill="url(#metalSteth)" />
              </g>
            </g>

            {/* Right Side: Family Silhouette & ECG Wave (Matches exact right side of reference image) */}
            <g transform="translate(1180, 180)" opacity="0.32" className="hidden md:block">
              {/* Family: Father, Child with Heart, Mother */}
              {/* Left Figure (Child/Parent) */}
              <circle cx="40" cy="80" r="18" fill="#018AAE" />
              <path d="M 18 150 C 18 110, 62 110, 62 150 Z" fill="#018AAE" />

              {/* Center Figure (Child holding heart) */}
              <circle cx="100" cy="50" r="22" fill="#018AAE" />
              <path d="M 72 165 C 72 115, 128 115, 128 165 Z" fill="#018AAE" />
              {/* Heart in chest */}
              <path
                d="M 100 102 C 95 95, 87 95, 84 100 C 80 106, 85 114, 100 122 C 115 114, 120 106, 116 100 C 113 95, 105 95, 100 102 Z"
                fill="#FFFFFF"
              />

              {/* Right Figure (Parent) */}
              <circle cx="160" cy="85" r="16" fill="#018AAE" />
              <path d="M 140 150 C 140 115, 180 115, 180 150 Z" fill="#018AAE" />

              {/* Pulse ECG Line flowing underneath family */}
              <path
                d="M -120 180 L 10 180 L 30 160 L 45 205 L 60 145 L 75 195 L 90 180 L 260 180"
                stroke="#018AAE"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.7"
              />
            </g>
          </svg>
        </div>

        {/* -------------------- 3. EXACT CENTER CARD (MATCHING REFERENCE IMAGE) -------------------- */}
        <div className="relative z-10 w-full max-w-[620px] bg-white rounded-3xl p-6 sm:p-9 shadow-lg shadow-[#018AAE]/10 border border-slate-100">
          
          {/* Top Bar inside Card: Back to Selection & Registered Patient pill */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <Link
              to={`/bookappointment${queryString}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#018AAE] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Selection</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#018AAE]">
              <User className="w-3.5 h-3.5 text-[#018AAE]" />
              <span>Registered Patient</span>
            </div>
          </div>

          {/* Icon Circle (Mail Icon in Soft Mint/Cyan Circle) */}
          <div className="pt-6 pb-2 flex justify-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F9FB] border border-[#B6EEF6] flex items-center justify-center text-[#018AAE] shadow-2xs">
              <Mail className="w-6 h-6 stroke-[1.8]" />
            </div>
          </div>

          {!otpSent ? (
            /* ================= PHASE 1: EMAIL ADDRESS INPUT ================= */
            <div className="space-y-6 pt-1">
              {/* Title & Subtitle */}
              <div className="text-center space-y-1.5">
                <h1 className="text-xl sm:text-2xl font-black text-[#0B2545] tracking-tight">
                  Registered Patient Verification
                </h1>
                <p className="text-xs sm:text-[13px] text-slate-500 font-medium">
                  Enter your registered email address to receive an instant verification OTP.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSendRegisteredOtp} className="space-y-5">
                {/* Registered Email Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-800 block">
                    REGISTERED EMAIL ADDRESS *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={registeredEmail}
                      onChange={(e) => setRegisteredEmail(e.target.value)}
                      placeholder="e.g. patient@brahmshaktihospital.com"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-white text-slate-800 focus:border-[#018AAE] focus:ring-2 focus:ring-[#018AAE]/15 focus:outline-hidden transition-all shadow-2xs placeholder:text-slate-400"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium pt-0.5">
                    Enter the email address you used during your first registration.
                  </p>
                </div>

                {/* Demo Patient Account Pill (Matches reference image) */}
                <div className="p-3 bg-[#F4FBFD] border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <User className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Demo Patient Account:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRegisteredEmail('patient@brahmshaktihospital.com')}
                    className="text-[#018AAE] font-extrabold hover:underline cursor-pointer text-left sm:text-right"
                  >
                    Use patient@brahmshaktihospital.com
                  </button>
                </div>

                {/* Big Button: Send Email OTP (Matches rounded full pill in image) */}
                <button
                  type="submit"
                  disabled={sendingOtp}
                  className="w-full py-3.5 rounded-2xl bg-[#018AAE] hover:bg-[#007595] active:scale-[0.99] disabled:opacity-50 text-white text-xs sm:text-sm font-black transition-all shadow-md shadow-[#018AAE]/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {sendingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Email OTP...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Send Email OTP</span>
                      <span className="font-bold">&rarr;</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ================= PHASE 2: 6-DIGIT OTP VERIFICATION ================= */
            <div className="space-y-6 pt-1">
              <div className="text-center space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-black text-[#0B2545] tracking-tight">
                  Verify OTP Code
                </h2>
                <p className="text-xs text-slate-500">
                  A 6-digit verification code has been dispatched to:{' '}
                  <strong className="text-[#018AAE] font-bold">{registeredEmail}</strong>
                </p>
              </div>

              {/* Demo Helper if in Dev */}
              {registeredOtp && (
                <div className="p-2.5 bg-[#F4FBFD] border border-[#B6EEF6] rounded-xl text-xs text-[#013B4A] flex items-center justify-between max-w-sm mx-auto">
                  <div className="flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-[#018AAE]" />
                    <span>Verification Code:</span>
                  </div>
                  <span className="font-mono font-black text-sm text-[#018AAE] bg-white px-2.5 py-0.5 rounded border border-[#73E0EF]">
                    {registeredOtp}
                  </span>
                </div>
              )}

              <form onSubmit={handleVerifyRegisteredOtp} className="space-y-5 max-w-sm mx-auto">
                <div className="space-y-1.5 text-center">
                  <label className="text-xs font-bold text-slate-700 block">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-48 mx-auto text-center font-mono text-2xl tracking-[0.35em] px-3 py-2.5 rounded-xl border-2 border-slate-300 focus:border-[#018AAE] focus:outline-hidden shadow-2xs"
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
                      className="text-[#018AAE] font-bold hover:underline cursor-pointer"
                    >
                      Resend Email OTP
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={verifyingOtp || enteredOtp.length < 6}
                  className="w-full py-3.5 rounded-2xl bg-[#018AAE] hover:bg-[#007595] active:scale-[0.99] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-black transition-all shadow-md shadow-[#018AAE]/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {verifyingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify &amp; Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-xs text-slate-500 hover:text-[#018AAE] font-medium"
                  >
                    Change Email Address
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* -------------------- 4. EXACT FOOTER (MATCHING REFERENCE IMAGE) -------------------- */}
      <footer className="bg-white border-t border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="font-semibold text-slate-700">
            &copy; 2026 Brahm Shakti Hospital.
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-[#73E0EF] bg-[#F0FBFC] text-[#018AAE] font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-[#018AAE]" />
            <span>NABH &amp; NABL Accredited</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <a
              href="mailto:helpdesk@brahmshaktihospital.com"
              className="flex items-center gap-1.5 hover:text-[#018AAE] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#018AAE]" />
              <span>helpdesk@brahmshaktihospital.com</span>
            </a>
            <a
              href="tel:01122531683"
              className="flex items-center gap-1.5 text-rose-600 font-bold hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>011-22531683 / 7840089703</span>
            </a>
          </div>
        </div>
      </footer>

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

export default PatientTypePage;
