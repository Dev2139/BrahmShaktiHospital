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
  CheckCircle2
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const PatientTypePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthSession, isAuthenticated, user } = useAuth();

  // 'choose' | 'registered-otp'
  const [viewMode, setViewMode] = useState('choose');
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);

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
      // Derive patient details
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

      // Set logged-in session in AuthContext
      setAuthSession(patientUser, 'bsh_jwt_' + Date.now());

      toast.success(`Welcome back, ${patientName}! Redirecting to appointment booking...`);

      // Redirect immediately back to /bookappointment with doctor/date params preserved
      const returnUrl = `/bookappointment${queryString}`;
      setTimeout(() => {
        navigate(returnUrl, { replace: true });
      }, 700);
    }, 400);
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
            <Link to="/" className="hidden md:inline-block hover:text-[#0A7A74] transition-colors">
              Back Home
            </Link>
            <button
              type="button"
              onClick={() => setRefundModalOpen(true)}
              className="hover:text-[#0A7A74] transition-colors cursor-pointer"
            >
              Refund Policy
            </button>
            <Link to="/privacy-policy" className="hidden lg:inline-block hover:text-[#0A7A74] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-use" className="hidden lg:inline-block hover:text-[#0A7A74] transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/contact" className="hidden sm:inline-block hover:text-[#0A7A74] transition-colors">
              Contact Us
            </Link>
            <Link
              to={isAuthenticated ? '/patient/dashboard' : '/login'}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0A7A74]/10 hover:bg-[#0A7A74] text-[#0A7A74] hover:text-white font-bold transition-all border border-[#0A7A74]/20"
            >
              <User className="w-3.5 h-3.5" />
              <span>{isAuthenticated ? (user?.name?.split(' ')[0] ? `${user.name.split(' ')[0]}'s Portal` : 'Patient Portal') : 'Patient Portal'}</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* -------------------- MAIN CLASSIFICATION CARD (IMAGE 2 REFERENCE) -------------------- */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-12 sm:py-20 flex items-center justify-center">
        {viewMode === 'choose' ? (
          /* ================= VIEW 1: ARE YOU A NEW OR REGISTERED PATIENT ================= */
          <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-12 text-center space-y-8 animate-in fade-in duration-200">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A7A74] tracking-tight">
                Book an Appointment
              </h1>
              <p className="text-base sm:text-lg font-bold text-slate-800">
                Are you a new or registered patient?
              </p>
            </div>

            {/* Two Large Selection Cards (Reference Image 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Registered Patient Card */}
              <div className="p-6 rounded-2xl border-2 border-slate-200 hover:border-[#0A7A74] hover:shadow-md transition-all flex flex-col justify-between items-center text-center space-y-4 bg-slate-50/50">
                <div className="w-12 h-12 rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center border border-teal-200">
                  <User className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-extrabold text-slate-900 text-base">Registered Patient</h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    I have already registered with Brahm Shakti Hospital. Fast sign-in via Email OTP.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('registered-otp')}
                  className="w-full py-3 px-5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-sm font-black transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Registered Patient</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* New Patient Card */}
              <div className="p-6 rounded-2xl border-2 border-slate-200 hover:border-[#0A7A74] hover:shadow-md transition-all flex flex-col justify-between items-center text-center space-y-4 bg-slate-50/50">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-extrabold text-slate-900 text-base">New Patient</h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    First visit to Brahm Shakti Hospital. Quick registration with Email OTP (No payment required).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/bookappointment/new-patient${queryString}`)}
                  className="w-full py-3 px-5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-sm font-black transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>New Patient</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Security Badges (From Reference Image) */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5 text-teal-800">
                <ShieldCheck className="w-4 h-4 text-[#0A7A74]" />
                <span>Your information is secure and protected</span>
              </div>
              <span className="hidden sm:inline text-slate-300">|</span>
              <div className="flex items-center gap-1.5 text-teal-800">
                <Clock className="w-4 h-4 text-[#0A7A74]" />
                <span>Quick and easy appointment booking.</span>
              </div>
              <span className="hidden sm:inline text-slate-300">|</span>
              <button
                type="button"
                onClick={() => setSecurityModalOpen(true)}
                className="flex items-center gap-1.5 text-[#0A7A74] hover:underline font-bold cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Security &amp; Fraud Prevention Notes</span>
              </button>
            </div>

            {/* Back link */}
            <div className="pt-2">
              <Link
                to={`/bookappointment${queryString}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A7A74] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Slot &amp; Doctor Selection</span>
              </Link>
            </div>
          </div>
        ) : (
          /* ================= VIEW 2: REGISTERED PATIENT EMAIL OTP VERIFICATION ================= */
          <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-6 animate-in fade-in duration-200">
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
                  className="w-full py-3.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] disabled:opacity-50 text-white text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
                    <span>Resend OTP in <strong>{otpTimer}s</strong></span>
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
                  className="w-full py-3.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
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

      {/* -------------------- DEDICATED PORTAL FOOTER -------------------- */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="font-semibold">&copy; 2026 Brahm Shakti Hospital.</div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-300 bg-teal-50 text-[#0A7A74] font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-[#0A7A74]" />
            <span>NABH &amp; NABL Accredited</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <a href="mailto:helpdesk@brahmshaktihospital.com" className="flex items-center gap-1.5 hover:text-[#0A7A74] transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#0A7A74]" />
              <span>helpdesk@brahmshaktihospital.com</span>
            </a>
            <a href="tel:01127531683" className="flex items-center gap-1.5 text-rose-600 font-bold hover:underline">
              <Phone className="w-3.5 h-3.5" />
              <span>011-27531683 / 7840089703</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Refund Policy Modal */}
      {refundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
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
                <strong>1. Registration:</strong> Patient registration is completely FREE of charge. We do not collect registration fees.
              </p>
              <p>
                <strong>2. Doctor Availability:</strong> If the doctor is called for emergency surgery, appointments are rescheduled at zero fee or consultation is adjusted at the counter.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRefundModalOpen(false)}
              className="w-full py-2.5 rounded-lg bg-[#0A7A74] text-white text-xs font-bold"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Security Notes Modal */}
      {securityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-[#0A7A74]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-black text-base text-slate-800">Security &amp; Fraud Prevention</h3>
              </div>
              <button
                type="button"
                onClick={() => setSecurityModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
              <p>• Brahm Shakti Hospital will never ask for your bank OTP, debit card PIN, or UPI passwords over phone or email.</p>
              <p>• Registration is 100% free. Doctor consultation fee is paid directly at the hospital registration billing counter (Block A, Ground Floor).</p>
              <p>• Digital OTP verification is only used to secure your UHID and appointment records.</p>
            </div>
            <button
              type="button"
              onClick={() => setSecurityModalOpen(false)}
              className="w-full py-2.5 rounded-lg bg-[#0A7A74] text-white text-xs font-bold"
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
