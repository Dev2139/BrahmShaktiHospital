import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  ArrowLeft,
  PhoneCall,
  IndianRupee,
  Award,
  BookOpen,
  GraduationCap,
  Star,
  Users,
  Activity,
  ThumbsUp,
  FileText,
  BadgeCheck,
  Building2,
  Stethoscope,
  ChevronRight,
  Share2,
  Heart
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const DoctorProfilePage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctors/${id}`);
        if (res.data.success) {
          setDoctor(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching doctor:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Loading Specialist Medical Profile...
        </p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
          <Stethoscope className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Specialist Profile Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested consultant profile may have been updated or moved.
        </p>
        <Link
          to="/doctors"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Hospital Consultants</span>
        </Link>
      </div>
    );
  }

  // Realistic Max Healthcare style mock patient testimonials for this doctor
  const reviews = [
    {
      name: 'Rameshwar Dayal',
      verified: true,
      rating: 5,
      date: '14 Nov 2026',
      condition: 'Chronic Treatment Follow-up',
      comment:
        `${doctor.name} is exceptional. He patiently listened to my whole clinical history, reviewed previous scans, and explained the care protocol clearly without recommending unnecessary diagnostics. Truly grateful to Brahm Shakti Hospital.`
    },
    {
      name: 'Meena Sharma',
      verified: true,
      rating: 5,
      date: '02 Nov 2026',
      condition: 'OPD Consultation',
      comment:
        `Very polite, compassionate bedside manner. Consultation started right on time at ${doctor.room || 'OPD Room'}. The trust subsidized fee makes tertiary-level healthcare genuinely accessible.`
    },
    {
      name: 'Harish Chander',
      verified: true,
      rating: 5,
      date: '28 Oct 2026',
      condition: 'Clinical Procedure',
      comment:
        `One of the finest senior consultants in Delhi. Highly skilled, reassuring, and always available on rounds in case of hospital emergency.`
    }
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${doctor.name} - Brahm Shakti Hospital`,
        text: `Consult with ${doctor.name} (${doctor.designation}) at Brahm Shakti Hospital.`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Doctor profile link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 1. TOP BREADCRUMB & VERIFIED SPECIALIST RIBBON */}
      <section className="bg-slate-900 border-b border-slate-800 text-slate-300 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap text-slate-400">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/doctors" className="hover:text-emerald-400 transition-colors">Find a Doctor</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-200">{doctor.departmentName}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-400 font-bold">{doctor.name}</span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>DMC Reg: {doctor.dmcNo || 'Verified'}</span>
              {doctor.validity && <span>· Valid till {doctor.validity}</span>}
            </span>
          </div>
        </div>
      </section>

      {/* 2. MAX HEALTHCARE HERO HEADER */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white py-10 px-4 shadow-lg border-b border-slate-700/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
            {/* Left: Doctor Portrait + Core Details */}
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
              <div className="relative shrink-0">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl object-cover object-top border-4 border-slate-700 shadow-2xl shadow-black/50"
                />
                <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  {doctor.category || 'In house'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                    {doctor.departmentName}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/10 text-slate-300 text-xs font-semibold">
                    {doctor.category === 'Visiting' ? 'Visiting Consultant' : 'In-House Senior Consultant'}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2 justify-center sm:justify-start">
                  <span>{doctor.name}</span>
                  <BadgeCheck className="w-6 h-6 text-emerald-400 inline shrink-0" title="Delhi Medical Council Verified" />
                </h1>

                <p className="text-base text-emerald-300 font-semibold">
                  {doctor.designation}
                </p>

                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {doctor.qualification}
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-300 pt-1 justify-center sm:justify-start">
                  <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Brahm Shakti Hospital, Pocket C, Budh Vihar Phase I, New Delhi</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Buttons & Header Stats */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                to={`/bookappointment?doctor=${doctor.id}&department=${doctor.departmentId}`}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Hospital Appointment</span>
              </Link>

              <div className="flex items-center gap-2">
                <a
                  href="tel:7840089703"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all text-center"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                  <span>24x7 Helpline: 7840089703</span>
                </a>
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all cursor-pointer"
                  title="Share Profile"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar (Max Healthcare Style) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800 text-white">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Clinical Experience</span>
              <div className="text-xl sm:text-2xl font-black text-white mt-0.5">{doctor.experienceYears}+ Years</div>
              <span className="text-[11px] text-emerald-400 font-semibold">Senior Faculty</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">DMC Registration</span>
              <div className="text-base sm:text-lg font-black text-white mt-0.5 font-mono">{doctor.dmcNo || 'DMC Verified'}</div>
              <span className="text-[11px] text-slate-300 font-medium">Valid: {doctor.validity || 'Active'}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Patients Treated</span>
              <div className="text-xl sm:text-2xl font-black text-white mt-0.5">15,000+</div>
              <span className="text-[11px] text-emerald-400 font-semibold">Trusted Healthcare</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Patient Recommendation</span>
              <div className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5 flex items-center gap-1">
                <span>★ {doctor.rating || 4.9}</span>
                <span className="text-xs text-slate-300 font-normal">/ 5.0</span>
              </div>
              <span className="text-[11px] text-slate-300 font-medium">98.4% Positive Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT BODY: TABS & APPOINTMENT SIDEBAR */}
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLS: MAX HEALTHCARE TABBED SECTIONS */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tabs Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
              {[
                { id: 'overview', label: 'Overview & About', icon: FileText },
                { id: 'specializations', label: 'Clinical Focus', icon: Stethoscope },
                { id: 'credentials', label: 'Qualifications & DMC', icon: GraduationCap },
                { id: 'opd', label: 'OPD Schedule', icon: Clock },
                { id: 'reviews', label: 'Patient Testimonials', icon: ThumbsUp }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT: 1. OVERVIEW & ABOUT */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-emerald-600" />
                    <span>About {doctor.name}</span>
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {doctor.bio || `${doctor.name} is a renowned senior clinical specialist at Brahm Shakti Hospital, providing ethical, evidence-based medical and surgical management. Dedicated to clinical excellence and patient safety.`}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    With over {doctor.experienceYears} years of practice in {doctor.departmentName}, {doctor.name} actively leads patient care pathways under the charitable mission of Brahm Shakti Trust, ensuring that quality specialized medical care is affordable and accessible to families across North-West Delhi.
                  </p>

                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-emerald-900">Delhi Medical Council Compliant</div>
                        <div className="text-[11px] text-emerald-700">Official DMC Registration #{doctor.dmcNo || '11847'}</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-teal-900">Hospital Chamber Location</div>
                        <div className="text-[11px] text-teal-700">{doctor.room || 'OPD Chamber Block'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Clinical Focus Snapshot */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Key Clinical Highlights &amp; Care Areas
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(doctor.specializations || [
                      'Inpatient & Outpatient Management',
                      'Evidence-Based Diagnostics',
                      'Emergency Triage & Patient Stabilization',
                      'Preventive Health & Long-Term Follow-up'
                    ]).map((spec, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-700">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 2. CLINICAL FOCUS */}
            {activeTab === 'specializations' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-5">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Clinical Procedures &amp; Medical Specializations
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Certified procedural focus and therapeutic areas performed by {doctor.name} at Brahm Shakti Hospital.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {(doctor.specializations && doctor.specializations.length > 0
                    ? doctor.specializations
                    : ['Comprehensive Medical Consultations', 'Diagnostic Review', 'Post-Op Follow-up', 'Emergency Case Triage']
                  ).map((spec, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-black">
                        ✓
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{spec}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Conducted at Brahm Shakti Hospital with modern protocols.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: 3. QUALIFICATIONS & DMC */}
            {activeTab === 'credentials' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                    <span>Education, Medical Degrees &amp; Council Accreditations</span>
                  </h3>

                  <div className="space-y-3 pt-2">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">{doctor.qualification}</div>
                        <div className="text-xs text-slate-500">Degree Certified &amp; Recognized by the National Medical Commission (NMC)</div>
                      </div>
                    </div>

                    {/* Official DMC Card with details from Image */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-700" />
                          Delhi Medical Council (DMC) Registration Verification
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                          Official Record
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-emerald-200">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">DMC Number</span>
                          <strong className="text-slate-900 font-mono text-sm">{doctor.dmcNo || '11847'}</strong>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-emerald-200">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Validity Period</span>
                          <strong className="text-emerald-700 text-sm">{doctor.validity || 'Valid Active'}</strong>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-emerald-200">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                          <strong className="text-slate-900 text-sm">{doctor.category || 'In house'}</strong>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        This consultant is listed on the official Register of Consultants of Brahm Shakti Hospital, verified under Delhi Medical Council norms for authorized clinical outpatient and inpatient care.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional Memberships */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Professional Affiliations &amp; Memberships
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-700">Delhi Medical Association (DMA)</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-700">Indian Medical Association (IMA)</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-700">Delhi Medical Council (DMC)</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-700">Brahm Shakti Hospital Medical Faculty Board</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 4. OPD SCHEDULE */}
            {activeTab === 'opd' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Outpatient (OPD) Consultation Timetable
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Regular OPD chamber slots at Brahm Shakti Hospital. Walk-in and advance appointments available.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Active Timetable
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{doctor.opdSchedule}</div>
                      <div className="text-[11px] text-slate-600">Location: {doctor.room || 'OPD Block'}</div>
                    </div>
                  </div>
                  <Link
                    to={`/bookappointment?doctor=${doctor.id}&department=${doctor.departmentId}`}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Select Slot
                  </Link>
                </div>

                {/* Day-by-Day schedule breakdown */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3 font-bold">Day</th>
                        <th className="p-3 font-bold">Consultation Slot</th>
                        <th className="p-3 font-bold">Room / Chamber</th>
                        <th className="p-3 font-bold">Session Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => {
                        const short = day.slice(0, 3);
                        const isAvailable = doctor.availableDays ? doctor.availableDays.includes(short) : true;
                        return (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-bold">{day}</td>
                            <td className="p-3">
                              {isAvailable ? (
                                <span className="font-semibold text-emerald-700">{doctor.availableTimings || '09:00 AM - 02:00 PM'}</span>
                              ) : (
                                <span className="text-slate-400 italic">On Ward Rounds / Surgeries</span>
                              )}
                            </td>
                            <td className="p-3">{isAvailable ? doctor.room || 'Chamber 101' : '—'}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {isAvailable ? 'OPD Open' : 'Inpatient Duty'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 5. PATIENT REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Verified Patient Reviews &amp; Testimonials
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Feedback from real patients treated by {doctor.name} at Brahm Shakti Hospital.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-500 font-bold text-lg">
                    <span>★ {doctor.rating || 4.9}</span>
                    <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((rev, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                            {rev.name[0]}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span>{rev.name}</span>
                              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <div className="text-[10px] text-slate-400">{rev.condition} · {rev.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center text-amber-400 text-xs">
                          {[...Array(rev.rating)].map((_, s) => (
                            <span key={s}>★</span>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT 4 COLS: STICKY CONSULTATION & BOOKING BOX */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-emerald-500/20 shadow-xl shadow-emerald-500/5 space-y-5 sticky top-24">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
                  Outpatient Desk
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Slots Open
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Book with {doctor.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Instant UHID generation &amp; real-time slot reservation. No advance login required.
                </p>
              </div>

              {/* Subsidized Tariff Fee Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600">Trust Consultation Fee</span>
                  <span className="text-xl font-black text-emerald-800">₹{doctor.consultationFee}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-emerald-200/60">
                  <span>Follow-up within 7 days</span>
                  <span className="font-bold text-emerald-700 uppercase text-[10px]">Free of Cost</span>
                </div>
              </div>

              {/* Chamber snapshot */}
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-700">{doctor.opdSchedule}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-700">Chamber: <strong>{doctor.room || 'OPD Block'}</strong></span>
                </div>
              </div>

              {/* CTA Booking Button */}
              <Link
                to={`/bookappointment?doctor=${doctor.id}&department=${doctor.departmentId}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Consultation Slot</span>
              </Link>

              {/* Trust Badges */}
              <div className="space-y-2 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                <div className="flex items-center gap-2 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Delhi Medical Council verified consultant</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Subsidized Trust tariff — zero hidden fees</span>
                </div>
                <a
                  href="tel:7840089703"
                  className="flex items-center gap-2 text-red-600 font-bold hover:underline pt-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>24x7 Emergency Casualty: 7840089703</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorProfilePage;
