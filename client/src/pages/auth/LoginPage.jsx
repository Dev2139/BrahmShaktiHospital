import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  PhoneCall,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  HeartPulse,
  Building2,
  CheckCircle2,
  Crown,
  Droplet,
  Pill,
  Zap
} from 'lucide-react';
import { useAuth, getDashboardForRole, isStaffRole } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedDemoRole, setSelectedDemoRole] = useState(null);

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getRedirectDest = () => {
    // 1. Check ?redirect= URL parameter
    const searchParams = new URLSearchParams(location.search);
    const redirectParam = searchParams.get('redirect');
    if (redirectParam) return decodeURIComponent(redirectParam);

    // 2. Check location.state?.from
    if (!location.state?.from) return null;
    if (typeof location.state.from === 'string') return location.state.from;
    const pathname = location.state.from.pathname || '';
    const search = location.state.from.search || '';
    return pathname + search;
  };

  const from = getRedirectDest();

  // If already authenticated and visiting login, redirect staff to their dashboard and patients to intended destination
  useEffect(() => {
    if (isAuthenticated) {
      const userRole = user?.role;
      const isStaff = isStaffRole(userRole);
      const dest = isStaff ? getDashboardForRole(userRole) : (from || '/patient/dashboard');
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, user, from, navigate]);

  const slides = [
    {
      image: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795291620/Gemini_Generated_Image_vy2ssdvy2ssdvy2s.png',
      badge: 'Surgical & Emergency Excellence',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      title: 'NABH-Accredited 250+ Bedded Tertiary Healthcare',
      desc: 'State-of-the-art 4K modular surgical suites, advanced Level-III intensive care units, and round-the-clock emergency casualty trauma resuscitation.',
      tag: '24x7 Emergency Lifeline · 7840089703'
    },
    {
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1600',
      badge: 'Maternity & Pediatric Care',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-400/30',
      title: 'Compassionate Mother & Level-III NICU Center',
      desc: 'Specialized neonatal intensive incubators, painless labour suites, and tender clinical expertise safeguarding mothers and premature infants.',
      tag: 'Dedicated Level-III NICU & Radiant Warmers'
    },
    {
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1600',
      badge: 'DMC Specialist Consultants',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      title: 'Certified Medical Consultants & Trust Ethos',
      desc: '20+ In-house and visiting super-specialist consultants registered with the Delhi Medical Council, offering subsidized care under Brahm Shakti Trust.',
      tag: 'Delhi Medical Council Verified Doctors'
    }
  ];

  // Auto-rotate hero images
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  // The 6 Demo Roles requested by the user
  const demoRoles = [
    {
      id: 'superadmin',
      label: 'Super Admin',
      icon: Crown,
      email: 'superadmin@brahmshaktihospital.com',
      password: 'SuperAdmin@123',
      color: 'hover:bg-purple-600 hover:text-white border-purple-200 text-purple-800 bg-purple-50/70',
      activeColor: 'bg-purple-700 text-white border-purple-700 shadow-sm',
      badge: 'IT & System Admin'
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: Building2,
      email: 'admin@brahmshaktihospital.com',
      password: 'Admin@123',
      color: 'hover:bg-slate-900 hover:text-white border-slate-200 text-slate-800 bg-slate-50',
      activeColor: 'bg-slate-900 text-white border-slate-900 shadow-sm',
      badge: 'Hospital Admin'
    },
    {
      id: 'doctor',
      label: 'Doctor',
      icon: Stethoscope,
      email: 'doctor@brahmshaktihospital.com',
      password: 'Doctor@123',
      color: 'hover:bg-[#0A7A74] hover:text-white border-teal-200 text-[#0A7A74] bg-teal-50/70',
      activeColor: 'bg-[#0A7A74] text-white border-[#0A7A74] shadow-sm',
      badge: 'Dr. S.K. Goyal'
    },
    {
      id: 'bloodbank',
      label: 'Blood Bank',
      icon: Droplet,
      email: 'bloodbank@brahmshaktihospital.com',
      password: 'BloodBank@123',
      color: 'hover:bg-rose-600 hover:text-white border-rose-200 text-rose-700 bg-rose-50/70',
      activeColor: 'bg-rose-600 text-white border-rose-600 shadow-sm',
      badge: 'Blood Bank Desk'
    },
    {
      id: 'pharmacy',
      label: 'Pharmacy',
      icon: Pill,
      email: 'pharmacist@brahmshaktihospital.com',
      password: 'Pharmacist@123',
      color: 'hover:bg-emerald-600 hover:text-white border-emerald-200 text-emerald-800 bg-emerald-50/70',
      activeColor: 'bg-emerald-600 text-white border-emerald-600 shadow-sm',
      badge: 'Chief Pharmacist'
    },
    {
      id: 'patient',
      label: 'Patient',
      icon: User,
      email: 'patient@brahmshaktihospital.com',
      password: 'Patient@123',
      color: 'hover:bg-blue-600 hover:text-white border-blue-200 text-blue-700 bg-blue-50/70',
      activeColor: 'bg-blue-600 text-white border-blue-600 shadow-sm',
      badge: 'Registered UHID'
    }
  ];

  const handleDemoAutofill = (role) => {
    setEmail(role.email);
    setPassword(role.password);
    setSelectedDemoRole(role.id);
    toast.success(`Loaded credentials for ${role.label}`);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter official email and password');
      return;
    }

    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (res?.success) {
      const userRole = res.user?.role;
      const isStaff = isStaffRole(userRole);
      const dest = isStaff ? getDashboardForRole(userRole) : (from || '/patient/dashboard');
      navigate(dest, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">
      {/* LEFT PANEL: Showcase Slider (Responsive: Compact on mobile, Full-screen on desktop) */}
      <div className="lg:w-1/2 relative min-h-[260px] sm:min-h-[380px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden bg-slate-900 select-none">
        {/* Background Slides with Cross-Fade */}
        {slides.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activeSlide === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            } transition-transform duration-7000`}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Rich multi-stop gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-transparent to-slate-950/40" />
          </div>
        ))}

        {/* Top Branding Header over Image */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center group" aria-label="Brahm Shakti Hospital Home">
            <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-lg group-hover:scale-105 transition-transform">
              <img
                src="https://res.cloudinary.com/urzka7oz/image/upload/v1795244093/WhatsApp_Image_2026-11-20_at_10.36.32_PM-removebg-preview.png"
                alt="Brahm Shakti Hospital"
                className="h-8 sm:h-10 md:h-11 w-auto object-contain"
              />
            </div>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>NABH &amp; DMC Accredited</span>
          </span>
        </div>

        {/* Floating Quick Trust Cards (Desktop & Tablet Hero) */}
        <div className="relative z-10 my-auto py-6 lg:py-10 space-y-4 lg:space-y-6">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold backdrop-blur-md transition-all duration-500 shadow-lg ${slides[activeSlide].badgeColor}`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>{slides[activeSlide].badge}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white tracking-tight leading-[1.18] drop-shadow-md">
            {slides[activeSlide].title}
          </h1>

          <p className="hidden sm:block text-xs sm:text-sm lg:text-base text-slate-300 max-w-xl leading-relaxed drop-shadow-sm font-medium">
            {slides[activeSlide].desc}
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{slides[activeSlide].tag}</span>
          </div>
        </div>

        {/* Bottom Slide Controls & Indicators */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
          {/* Pill Indicators */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeSlide === i
                    ? 'w-8 bg-emerald-400 shadow-md shadow-emerald-400/50'
                    : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Prev / Next buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              title="Previous Photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              title="Next Photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Modern Clean Login Form (Mobile Optimized) */}
      <div className="lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-white min-h-[500px] lg:min-h-screen">
        <div className="max-w-md w-full space-y-6">
          {/* Header Title */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              <Stethoscope className="w-3.5 h-3.5 text-[#0A7A74]" />
              <span>Official Hospital Management Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sign In to Your Account
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Select your role for 1-click test credentials or sign in with your hospital account.
            </p>
          </div>

          {/* Quick Demo Access: ALL 6 ROLES (Super Admin, Admin, Doctor, Blood Bank, Pharmacy, Patient) */}
          <div className="space-y-2.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>1-Click Demo Login Credentials</span>
              </span>
              <span className="text-emerald-700 font-bold lowercase text-[10px] bg-emerald-100/80 px-2 py-0.5 rounded-full">
                active accounts
              </span>
            </div>

            {/* 6 Responsive Role Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {demoRoles.map((role) => {
                const IconComponent = role.icon;
                const isSelected = selectedDemoRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleDemoAutofill(role)}
                    className={`p-2.5 rounded-xl border text-left transition-all shadow-2xs flex flex-col justify-between cursor-pointer active:scale-95 ${
                      isSelected
                        ? role.activeColor
                        : role.color
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <IconComponent className="w-4 h-4 shrink-0" />
                      <span className="text-[9px] uppercase tracking-wider font-extrabold opacity-80 truncate">
                        {role.id}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-xs leading-snug truncate">
                        {role.label}
                      </div>
                      <div className="text-[10px] opacity-75 truncate">
                        {role.badge}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-600 tracking-wider flex items-center justify-between">
                <span>Email / Username</span>
                <span className="text-[10px] text-emerald-600 font-semibold normal-case">Staff or UHID linked</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSelectedDemoRole(null);
                  }}
                  placeholder="name@brahmshaktihospital.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium placeholder-slate-400 focus:border-[#0A7A74] focus:ring-2 focus:ring-[#0A7A74]/20 focus:outline-hidden transition-all bg-white"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                  Password
                </label>
                <span className="text-[10px] text-emerald-600 font-semibold">Protected with bcrypt</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setSelectedDemoRole(null);
                  }}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium placeholder-slate-400 focus:border-[#0A7A74] focus:ring-2 focus:ring-[#0A7A74]/20 focus:outline-hidden transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Help */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-300 text-[#0A7A74] focus:ring-[#0A7A74]"
                />
                <span className="font-medium">Remember me</span>
              </label>
              <a
                href="tel:7840089703"
                className="text-[#0A7A74] font-bold hover:underline"
              >
                Help Desk?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0A7A74] via-teal-700 to-[#0A7A74] hover:from-[#08635e] hover:to-teal-800 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-teal-700/25 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-[0.99]"
            >
              <KeyRound className="w-4 h-4" />
              <span>{submitting ? 'Verifying Credentials...' : 'Sign In to Hospital Portal'}</span>
            </button>
          </form>

          {/* Quick Consultation Without Login & Register Route */}
          <div className="pt-4 border-t border-slate-200 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>Patient seeking doctor consultation?</span>
              <Link
                to="/bookappointment"
                className="text-[#0A7A74] font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Book without Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center justify-between text-slate-500">
              <span>New patient to Brahm Shakti Hospital?</span>
              <Link
                to="/register"
                state={{ from }}
                className="text-teal-700 font-bold hover:underline"
              >
                Create Patient Account ↗
              </Link>
            </div>
          </div>

          {/* Footer Security Badges */}
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit SSL Encrypted Portal</span>
            </span>
            <span className="text-slate-400">
              Budh Vihar Phase I, New Delhi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;