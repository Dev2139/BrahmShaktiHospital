import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Stethoscope,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [submitting, setSubmitting] = useState(false);
  const [activeSlide, setActiveSlide] = useState(1);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 3 high-impact healthcare hero images with distinct stories
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600',
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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const getRedirectDest = () => {
    if (!location.state?.from) return null;
    if (typeof location.state.from === 'string') return location.state.from;
    const pathname = location.state.from.pathname || '';
    const search = location.state.from.search || '';
    return pathname + search;
  };

  const from = getRedirectDest();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Full legal name, email and password are required');
      return;
    }

    setSubmitting(true);
    const res = await register({
      name,
      email,
      phone,
      password,
      bloodGroup,
      role: 'patient'
    });
    setSubmitting(false);

    if (res?.success) {
      navigate(from || '/patient/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">
      {/* LEFT PANEL: 3-Image Showcase Slider */}
      <div className="lg:w-1/2 relative min-h-[460px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 overflow-hidden bg-slate-900 select-none">
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
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/40" />
          </div>
        ))}

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Activity className="w-6 h-6 text-emerald-400 stroke-[2.4]" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-tight block">
                BRAHM SHAKTI
              </span>
              <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase block -mt-1">
                Hospital &amp; Research Center
              </span>
            </div>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            NABH &amp; DMC Accredited
          </span>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 my-auto py-10 space-y-6">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold backdrop-blur-md transition-all duration-500 shadow-lg ${slides[activeSlide].badgeColor}`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>{slides[activeSlide].badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] drop-shadow-md">
            {slides[activeSlide].title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed drop-shadow-sm font-medium">
            {slides[activeSlide].desc}
          </p>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{slides[activeSlide].tag}</span>
          </div>
        </div>

        {/* Bottom Slide Controls */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between">
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Registration Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white min-h-screen">
        <div className="max-w-md w-full space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Digital Health Registry</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Create Patient Account
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Join Brahm Shakti Hospital's patient health portal to manage appointments, digital prescriptions, lab results, and billing receipts.
            </p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            {/* Full Legal Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium placeholder-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all bg-white"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium placeholder-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all bg-white"
                />
              </div>
            </div>

            {/* Phone & Blood Group in 2 cols */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                  Mobile Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91-9876543210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium placeholder-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all bg-white"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium placeholder-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer pt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{submitting ? 'Creating Patient Profile...' : 'Complete Patient Registration'}</span>
            </button>
          </form>

          {/* Quick Consultation Without Login & Sign In Link */}
          <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>Already registered with Brahm Shakti?</span>
              <Link to="/login" state={{ from }} className="text-emerald-700 font-bold hover:underline">
                Sign In to Portal ↗
              </Link>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Need consultation right now?</span>
              <Link to="/consultation" className="text-teal-700 font-bold hover:underline inline-flex items-center gap-1">
                <span>Book without Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
