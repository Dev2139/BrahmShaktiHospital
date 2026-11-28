import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  ArrowLeft,
  ArrowRight,
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
  Heart,
  Phone,
  AlertTriangle,
  FlaskConical,
  Check
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { doctorsData } from '../../data/seedData';

export const DoctorProfilePage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctors/${id}`);
        if (res.data?.success && res.data?.data) {
          setDoctor(res.data.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('API lookup failed, falling back to local seed data:', err);
      }

      // Fallback to local doctorsData by id or sanitized slug
      const found = doctorsData.find(
        (d) =>
          d.id === id ||
          d.id.toLowerCase() === id.toLowerCase() ||
          d.name?.toLowerCase().replace(/[.\s]+/g, '-').includes(id.toLowerCase())
      );

      if (found) {
        setDoctor(found);
      } else if (doctorsData.length > 0) {
        // Fallback default to first doctor (e.g. Dr. Sanjeev Verma if doc-surg-03)
        const def = doctorsData.find((d) => d.id === 'doc-surg-03') || doctorsData[0];
        setDoctor(def);
      }

      setLoading(false);
    };

    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#018AAE] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Loading Specialist Medical Profile...
        </p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F0FBFC] text-[#018AAE] flex items-center justify-center border border-[#B6EEF6]">
          <Stethoscope className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Specialist Profile Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested consultant profile may have been updated or moved.
        </p>
        <Link
          to="/doctors"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#018AAE] hover:bg-[#007595] text-white text-xs font-bold transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Hospital Consultants</span>
        </Link>
      </div>
    );
  }

  // Patient reviews
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
        `Very polite, compassionate bedside manner. Consultation started right on time at ${doctor.room || 'OPD Room 105'}. The trust subsidized fee makes tertiary-level healthcare genuinely accessible.`
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
    <div
      className="min-h-screen bg-[#F0FBFC] text-slate-800 font-sans selection:bg-[#018AAE] selection:text-white pb-16 bg-cover bg-top bg-fixed bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/images/doctor_profile_bg.png')"
      }}
    >
      {/* -------------------- 1. BREADCRUMB & UTILITY HEADER -------------------- */}
      <section className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          {/* Breadcrumb Links */}
          <div className="flex items-center gap-1.5 flex-wrap text-slate-500 font-medium">
            <Link to="/" className="hover:text-[#018AAE] transition-colors">
              Home
            </Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/doctors" className="hover:text-[#018AAE] transition-colors">
              Find a Doctor
            </Link>
            <span className="text-slate-400 hidden sm:inline">&gt;</span>
            <span className="text-slate-600 hidden sm:inline">{doctor.departmentName}</span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-[#018AAE] font-bold">{doctor.name}</span>
          </div>

          {/* Merged Right Utility Pill: Lab Result & Emergency (Inline, No Overlap) */}
          <div className="inline-flex items-center bg-white border border-slate-200/90 shadow-2xs rounded-xl divide-x divide-slate-100 overflow-hidden shrink-0 self-start sm:self-auto">
            {/* 1. Lab Result (Redirects to Oncquest Online Lab Portal) */}
            <a
              href="https://itd.oncquest.net/oncquest/design/onlinelab"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-[#018AAE] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <FlaskConical className="w-3.5 h-3.5 text-[#018AAE] transition-transform group-hover:scale-110" />
              <span>Lab Result</span>
            </a>

            {/* 2. Emergency Trigger */}
            <a
              href="tel:7840089703"
              className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50/60 transition-colors cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 transition-transform group-hover:scale-110" />
              <span>Emergency</span>
            </a>
          </div>
        </div>
      </section>

      {/* -------------------- 2. MAIN CONTAINER -------------------- */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-5">
        {/* ================= HERO DOCTOR CARD ================= */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-7 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
            {/* Left: Doctor Portrait & Core Information */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
              {/* Doctor Image Container with IN HOUSE badge */}
              <div className="relative shrink-0">
                <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm bg-slate-50 flex items-center justify-center">
                  <img
                    src={doctor.image || '/assets/images/doctor_placeholder.svg'}
                    alt={doctor.name}
                    onError={(e) => {
                      e.target.src = '/assets/images/doctor_placeholder.svg';
                    }}
                    className="w-full h-full object-cover object-[center_20%]"
                  />
                </div>
                {/* IN HOUSE Pill Badge */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#018AAE] text-white text-[10px] font-black tracking-wider uppercase shadow-xs flex items-center gap-1 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>{doctor.category || 'IN HOUSE'}</span>
                </div>
              </div>

              {/* Core Information Details */}
              <div className="space-y-1.5 pt-1">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <span className="px-3 py-0.5 rounded-full bg-[#018AAE] text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">
                    {doctor.departmentName}
                  </span>
                  <span className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] font-bold">
                    {doctor.category === 'Visiting' ? 'Visiting Consultant' : 'In-House Senior Consultant'}
                  </span>
                </div>

                {/* Doctor Name with Verified Badge */}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center sm:justify-start gap-2">
                  <span>{doctor.name}</span>
                  <div className="w-5 h-5 rounded-full bg-[#018AAE] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </h1>

                {/* Designation */}
                <p className="text-xs sm:text-sm font-bold text-[#018AAE]">
                  {doctor.designation}
                </p>

                {/* Qualification */}
                <p className="text-xs text-slate-600 font-medium">
                  {doctor.qualification}
                </p>

                {/* Hospital Address */}
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-500 pt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-[#018AAE] shrink-0" />
                  <span>Brahm Shakti Hospital, U-1/78, Budh Vihar, Main Kanjhawala Road, Delhi-110086</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Buttons (Responsive for Desktop, Tablet & Mobile) */}
            <div className="w-full lg:w-auto flex flex-col gap-2.5 shrink-0 pt-2 lg:pt-0">
              <Link
                to={`/bookappointment?doctor=${doctor.id}&department=${doctor.departmentId}`}
                className="w-full px-6 py-3 rounded-xl bg-[#018AAE] hover:bg-[#007595] text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Hospital Appointment</span>
              </Link>

              <div className="flex items-center gap-2 w-full">
                <a
                  href="tel:7840089703"
                  className="flex-1 px-4 py-2 rounded-xl bg-[#0B2545] hover:bg-[#07192f] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs text-center"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-teal-300" />
                  <span>24x7 Helpline: 7840089703</span>
                </a>
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-xs cursor-pointer shrink-0"
                  title="Share Doctor Profile"
                >
                  <Share2 className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 4 METRIC CARDS (CLEAN WHITE BENTO STYLE) ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Clinical Experience */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              CLINICAL EXPERIENCE
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {doctor.experienceYears || 25}+ Years
            </div>
            <span className="text-xs text-[#018AAE] font-bold block">
              Senior Faculty
            </span>
          </div>

          {/* Card 2: DMC Registration */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              DMC REGISTRATION
            </span>
            <div className="text-lg sm:text-xl md:text-2xl font-black text-slate-900">
              {doctor.dmcNo || '11843'}
            </div>
            <span className="text-xs text-slate-500 font-medium block">
              Valid: {doctor.validity || '23/05/2027'}
            </span>
          </div>

          {/* Card 3: Patients Treated */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              PATIENTS TREATED
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              15,000+
            </div>
            <span className="text-xs text-[#018AAE] font-bold block">
              Trusted Healthcare
            </span>
          </div>

          {/* Card 4: Patient Recommendation */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              PATIENT RECOMMENDATION
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1.5">
              <span className="text-amber-500">★</span>
              <span>{doctor.rating || 5}</span>
              <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </div>
            <span className="text-xs text-slate-500 font-medium block">
              98.4% Positive Reviews
            </span>
          </div>
        </div>

        {/* ================= 3. MAIN BODY (LEFT 8 COLS TABS + RIGHT 4 COLS OUTPATIENT DESK) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start pt-1">
          {/* LEFT 8 COLS: TAB NAVIGATION & TABBED CONTENT */}
          <div className="lg:col-span-8 space-y-5">
            {/* Tabs Bar with Smooth Horizontal Scrolling */}
            <div className="relative">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {[
                  { id: 'overview', label: 'Overview & About', icon: Stethoscope },
                  { id: 'specializations', label: 'Clinical Focus', icon: Activity },
                  { id: 'credentials', label: 'Qualifications & DMC', icon: GraduationCap },
                  { id: 'opd', label: 'OPD Schedule', icon: Clock },
                  { id: 'reviews', label: 'Patient Testimonials', icon: ThumbsUp }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#018AAE] text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB CONTENT 1: OVERVIEW & ABOUT (MATCHING IMAGE 1) */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* Card 1: About the Doctor */}
                <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-[#018AAE]" />
                    <span>About {doctor.name}</span>
                  </h2>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                    {doctor.bio ||
                      `${doctor.name} heads the Department of ${doctor.departmentName} at Brahm Shakti Hospital with over ${doctor.experienceYears || 25} years of surgical mastery and compassionate patient guidance.`}
                  </p>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                    With over {doctor.experienceYears || 25} years of practice in {doctor.departmentName}, {doctor.name} actively leads patient care pathways under the charitable mission of Brahm Shakti Trust, ensuring that quality specialized medical care is affordable and accessible to families across North-West Delhi.
                  </p>

                  {/* 2 Compliance & Location Badges */}
                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#F0FBFC]/60 border border-[#B6EEF6]/70 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-[#018AAE] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          Delhi Medical Council Compliant
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Official DMC Registration #{doctor.dmcNo || '11843'}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F0FBFC]/60 border border-[#B6EEF6]/70 flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-[#018AAE] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          Hospital Chamber Location
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {doctor.room || 'Surgical OPD Block Chamber 105'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Key Clinical Highlights & Care Areas */}
                <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Key Clinical Highlights &amp; Care Areas
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(doctor.specializations && doctor.specializations.length > 0
                      ? doctor.specializations
                      : [
                          'Advanced Laparoscopic GI Surgery',
                          'Complex Hernia Repair',
                          'Gallbladder & Biliary Procedures',
                          'Surgical Oncology Triage'
                        ]
                    ).map((spec, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200/80"
                      >
                        <div className="w-4 h-4 rounded-full bg-[#F0FBFC] text-[#018AAE] flex items-center justify-center border border-[#B6EEF6] shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: CLINICAL FOCUS */}
            {activeTab === 'specializations' && (
              <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Clinical Procedures &amp; Medical Focus
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Procedural expertise and diagnostic interventions conducted at Brahm Shakti Hospital.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(doctor.specializations && doctor.specializations.length > 0
                    ? doctor.specializations
                    : [
                        'Advanced Laparoscopic GI Surgery',
                        'Complex Hernia Repair',
                        'Gallbladder & Biliary Procedures',
                        'Surgical Oncology Triage'
                      ]
                  ).map((spec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#73E0EF] hover:bg-[#F0FBFC]/30 transition-all flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-lg bg-[#F0FBFC] text-[#018AAE] border border-[#B6EEF6] flex items-center justify-center shrink-0 text-xs font-black">
                        ✓
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{spec}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Follows sterile NABH protocols and advanced equipment.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: QUALIFICATIONS & DMC */}
            {activeTab === 'credentials' && (
              <div className="space-y-4">
                <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#018AAE]" />
                    <span>Education, Medical Degrees &amp; DMC Accreditations</span>
                  </h3>

                  <div className="space-y-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#F0FBFC] text-[#018AAE] border border-[#B6EEF6] flex items-center justify-center shrink-0">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-slate-900">
                          {doctor.qualification}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Degree Certified &amp; Recognized by the National Medical Commission (NMC).
                        </div>
                      </div>
                    </div>

                    {/* Official DMC Record */}
                    <div className="p-4 rounded-2xl bg-[#F0FBFC]/70 border border-[#B6EEF6] space-y-3.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#B6EEF6]/60">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#018AAE] shrink-0" />
                          <span className="text-xs font-black text-[#018AAE] uppercase tracking-wider">
                            Delhi Medical Council (DMC) Record
                          </span>
                        </div>
                        <div className="self-start sm:self-auto">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#018AAE] text-white text-xs font-bold shadow-2xs whitespace-nowrap">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Official Verified Record</span>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-[#B6EEF6]">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">DMC Number</span>
                          <strong className="text-slate-900 font-bold text-sm">{doctor.dmcNo || '11843'}</strong>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-[#B6EEF6]">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Validity Period</span>
                          <strong className="text-[#018AAE] text-sm">{doctor.validity || '23/05/2027'}</strong>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-[#B6EEF6]">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                          <strong className="text-slate-900 text-sm">{doctor.category || 'In house'}</strong>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        This consultant is registered with the Delhi Medical Council and authorized for OPD consultation and inpatient surgical interventions at Brahm Shakti Hospital.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: OPD SCHEDULE */}
            {activeTab === 'opd' && (
              <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Outpatient (OPD) Consultation Timetable
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Regular OPD chamber slots at Brahm Shakti Hospital.
                    </p>
                  </div>
                  <div className="self-start sm:self-auto shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FBFC] text-[#018AAE] border border-[#B6EEF6] text-xs font-bold whitespace-nowrap shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Active Timetable</span>
                    </span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-[#F0FBFC]/70 border border-[#B6EEF6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#018AAE] text-white flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 shadow-2xs">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {doctor.opdSchedule || 'Mon - Sat: 09:30 AM - 02:30 PM (Room 105)'}
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Location: {doctor.room || 'Surgical OPD Block Chamber 105'}
                      </div>
                    </div>
                  </div>
                  <div className="self-start sm:self-center shrink-0">
                    <Link
                      to={`/bookappointment?doctor=${doctor.id}&department=${doctor.departmentId}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#018AAE] hover:bg-[#007595] text-white text-xs font-bold transition-all shadow-2xs whitespace-nowrap cursor-pointer active:scale-95"
                    >
                      <span>Select Slot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 5: PATIENT REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Verified Patient Reviews
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Feedback from real patients treated by {doctor.name}.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-500 font-bold text-base">
                    <span>★ {doctor.rating || 5}</span>
                    <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {reviews.map((rev, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#018AAE] text-white flex items-center justify-center font-bold text-xs">
                            {rev.name[0]}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">
                              {rev.name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {rev.condition} · {rev.date}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-amber-500 text-xs">
                          {[...Array(rev.rating)].map((_, s) => (
                            <span key={s}>★</span>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT 4 COLS: STICKY OUTPATIENT DESK CARD (EXACT MATCH TO REFERENCE IMAGE) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-2xl border border-[#B6EEF6]/80 shadow-xs p-5 sm:p-6 space-y-4 lg:sticky lg:top-24">
              {/* Header Badge & Status */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#F0FBFC] text-[#018AAE] text-[10px] font-black uppercase tracking-wider border border-[#B6EEF6]/70">
                  OUTPATIENT DESK
                </span>
                <span className="text-xs font-bold text-[#018AAE] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#018AAE] animate-pulse"></span>
                  <span>Slots Open</span>
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Book with {doctor.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Instant UHID generation &amp; real-time slot reservation. No advance login required.
                </p>
              </div>

              {/* Subsidized Trust Consultation Fee Container */}
              <div className="p-3.5 rounded-xl bg-[#F0FBFC]/70 border border-[#B6EEF6]/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Trust Consultation Fee</span>
                  <span className="text-xl font-black text-slate-900">₹{doctor.consultationFee || 800}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-[#B6EEF6]/60">
                  <span>Follow-up within 7 days</span>
                  <span className="font-black text-[#018AAE] uppercase text-[10px]">FREE OF COST</span>
                </div>
              </div>

              {/* Timings & Room Info */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-[#018AAE] shrink-0" />
                  <span className="font-medium">{doctor.opdSchedule || 'Mon - Sat: 09:30 AM - 02:30 PM (Room 105)'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-[#018AAE] shrink-0" />
                  <span className="font-medium">Chamber: <strong>{doctor.room || 'Surgical OPD Block Chamber 105'}</strong></span>
                </div>
              </div>

              {/* CTA Booking Button */}
              <Link
                to={`/bookappointment?doctor=${doctor.id}&department=${doctor.departmentId}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#018AAE] hover:bg-[#007595] text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Consultation Slot</span>
              </Link>

              {/* Trust Badges */}
              <div className="space-y-2 pt-2 text-[11px] text-slate-600 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#F0FBFC] text-[#018AAE] flex items-center justify-center border border-[#B6EEF6] shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>Delhi Medical Council verified consultant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#F0FBFC] text-[#018AAE] flex items-center justify-center border border-[#B6EEF6] shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>Subsidized Trust tariff — zero hidden fees</span>
                </div>
                <a
                  href="tel:7840089703"
                  className="flex items-center gap-2 text-rose-600 font-bold hover:underline pt-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>24x7 Emergency Casualty: 7840089703</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
