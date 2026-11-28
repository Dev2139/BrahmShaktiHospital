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
  UserPlus,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const PatientTypePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthSession, isAuthenticated } = useAuth();

  // Mode: 'selection' (Book an Appointment: Are you a new or registered patient?) OR 'verification' (Registered Patient Verification)
  const [viewMode, setViewMode] = useState('selection');

  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
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

      {/* -------------------- 2. MAIN CONTAINER WITH UNIFIED HIGH-RES MEDICAL WALLPAPER -------------------- */}
      <main className="relative flex-1 flex items-center justify-center py-8 sm:py-12 lg:py-16 px-4 overflow-hidden">
        
        {/* Unified 2560x1440 Generated Medical Stethoscope & Cyan Wave Wallpaper */}
        {/* Real Photographic Medical Background with Cyan Curves */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center sm:bg-right-top bg-no-repeat pointer-events-none select-none opacity-90"
          style={{
            backgroundImage: 'url(/images/banners/medical-bg-doctor-shield.jpg)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/40 to-transparent pointer-events-none" />

        {/* ========================================================================= */}
        {/* SCREEN 1: "BOOK AN APPOINTMENT - ARE YOU A NEW OR REGISTERED PATIENT?"   */}
        {/* (Exact match to Laptop/Desktop View, Tablet View & Mobile View in image) */}
        {/* ========================================================================= */}
        {viewMode === 'selection' ? (
          <div className="relative z-10 w-full max-w-5xl mx-auto space-y-4">
            
            {/* Main Outer Floating Frame (Matches White Glass/Card container) */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 lg:p-12 border border-white shadow-xl shadow-[#018AAE]/10 space-y-8">
              
              {/* Header Title & Subtitle */}
              <div className="text-center space-y-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#018AAE] tracking-tight">
                  Book an Appointment
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  Are you a new or registered patient?
                </p>
              </div>

              {/* 2-Column Choice Cards (Matches Left & Right cards in reference image) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto">
                
                {/* 1. REGISTERED PATIENT CARD */}
                <div className="relative bg-white rounded-2xl border-2 border-slate-200/90 hover:border-[#018AAE] p-6 sm:p-7 flex flex-col items-center text-center space-y-4 transition-all shadow-xs hover:shadow-md group">
                  {/* Icon Circle */}
                  <div className="w-16 h-16 rounded-full bg-[#E9F8FA] border border-[#B6EEF6] flex items-center justify-center text-[#018AAE] shadow-2xs group-hover:scale-105 transition-transform">
                    <User className="w-7 h-7" />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5 flex-1">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#018AAE] transition-colors">
                      Registered Patient
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      I have already registered with Brahm Shakti Hospital. Fast sign-in via Email OTP.
                    </p>
                  </div>

                  {/* Action Button: Opens the Verification Screen */}
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('verification');
                      setOtpSent(false);
                    }}
                    className="w-full py-3 rounded-xl bg-[#018AAE] hover:bg-[#007595] active:scale-[0.99] text-white text-xs sm:text-sm font-black transition-all shadow-md shadow-[#018AAE]/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Registered Patient</span>
                    <span>&rarr;</span>
                  </button>
                </div>

                {/* 2. NEW PATIENT CARD */}
                <div className="relative bg-white rounded-2xl border-2 border-slate-200/90 hover:border-[#018AAE] p-6 sm:p-7 flex flex-col items-center text-center space-y-4 transition-all shadow-xs hover:shadow-md group">
                  {/* Icon Circle */}
                  <div className="w-16 h-16 rounded-full bg-[#E9F8FA] border border-[#B6EEF6] flex items-center justify-center text-[#018AAE] shadow-2xs group-hover:scale-105 transition-transform">
                    <UserPlus className="w-7 h-7" />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5 flex-1">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#018AAE] transition-colors">
                      New Patient
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      First visit to Brahm Shakti Hospital. Quick registration with Email OTP (No payment required).
                    </p>
                  </div>

                  {/* Action Button: Navigates to New Patient Registration */}
                  <Link
                    to={`/bookappointment/new-patient${queryString}`}
                    className="w-full py-3 rounded-xl bg-[#018AAE] hover:bg-[#007595] active:scale-[0.99] text-white text-xs sm:text-sm font-black transition-all shadow-md shadow-[#018AAE]/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>New Patient</span>
                    <span>&rarr;</span>
                  </Link>
                </div>

              </div>

              {/* Trust & Security Bullet Points (Matches right side under stethoscope in image) */}
              <div className="pt-2 max-w-md mx-auto space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#018AAE] text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span>Your information is secure and protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#018AAE] text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span>Quick and easy appointment booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#018AAE] text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSecurityModalOpen(true)}
                    className="text-[#018AAE] hover:underline font-bold cursor-pointer"
                  >
                    Security &amp; Fraud Prevention Notes
                  </button>
                </div>
              </div>

            </div>

            {/* Back to Slot & Doctor Selection link */}
            <div className="text-center pt-1">
              <Link
                to={`/bookappointment${queryString}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#018AAE] transition-colors"
              >
                <span>&larr;</span>
                <span>Back to Slot &amp; Doctor Selection</span>
              </Link>
            </div>

          </div>
        ) : (
          /* ========================================================================= */
          /* SCREEN 2: "REGISTERED PATIENT VERIFICATION" SCREEN                        */
          /* (Shown when user clicks "Registered Patient" button)                      */
          /* ========================================================================= */
          <div className="relative z-10 w-full max-w-[620px] bg-white rounded-3xl p-6 sm:p-9 shadow-xl shadow-[#018AAE]/15 border border-white">
            
            {/* Top Bar inside Card: Back to Selection & Registered Patient pill */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setViewMode('selection')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#018AAE] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Selection</span>
              </button>

              <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#018AAE]">
                <User className="w-3.5 h-3.5 text-[#018AAE]" />
                <span>Registered Patient</span>
              </div>
            </div>

            {/* Icon Circle (Mail Icon in Soft Cyan Circle matching reference) */}
            <div className="pt-6 pb-2 flex justify-center">
              <div className="w-14 h-14 rounded-full bg-[#E9F8FA] border border-[#B6EEF6] flex items-center justify-center text-[#018AAE] shadow-2xs">
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

                  {/* Demo Patient Account Pill */}
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

                  {/* Action Button: Send Email OTP */}
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
        )}

      </main>

      {/* -------------------- 3. EXACT FOOTER (MATCHING REFERENCE IMAGE) -------------------- */}
      <footer className="bg-white border-t border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="font-semibold text-slate-700 text-center md:text-left">
            &copy; 2026 Brahm Shakti Hospital.
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-[#73E0EF] bg-[#F0FBFC] text-[#018AAE] font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-[#018AAE]" />
            <span>NABH &amp; NABL Accredited</span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center md:justify-end gap-2 md:gap-4 text-xs font-medium w-full md:w-auto text-center">
            <a
              href="mailto:helpdesk@brahmshaktihospital.com"
              className="inline-flex items-center justify-center gap-1.5 hover:text-[#018AAE] transition-colors whitespace-nowrap text-center"
            >
              <Mail className="w-3.5 h-3.5 text-[#018AAE] shrink-0" />
              <span>helpdesk@brahmshaktihospital.com</span>
            </a>
            <a
              href="tel:01127531683"
              className="inline-flex items-center justify-center gap-1.5 text-rose-600 font-bold hover:underline whitespace-nowrap text-center"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>011-27531683 / 7840089703</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Security Notes Modal */}
      {securityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-[#018AAE]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-black text-base text-slate-800">Security &amp; Fraud Prevention Notes</h3>
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
                &bull; Brahm Shakti Hospital will never ask for your bank OTP, debit card PIN, or UPI passwords over phone or email.
              </p>
              <p>
                &bull; Registration is 100% free. Doctor consultation fee is paid directly at the hospital registration billing counter.
              </p>
              <p>
                &bull; Digital OTP verification is only used to secure your UHID and appointment records.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSecurityModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#018AAE] text-white text-xs font-bold cursor-pointer"
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

export default PatientTypePage;
