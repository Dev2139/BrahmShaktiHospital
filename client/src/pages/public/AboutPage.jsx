import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Users,
  Target,
  Compass,
  CheckCircle2,
  Clock,
  MapPin,
  PhoneCall,
  Activity,
  HeartHandshake,
  Stethoscope,
  Microscope,
  FileCheck2,
  ScrollText,
  BadgeCheck,
  ChevronRight,
  Sparkles,
  Calendar,
  Mail,
  UserCheck
} from 'lucide-react';
import { departmentsData, doctorsData } from '../../data/seedData';

// Filtered and Updated Topics List
export const ABOUT_TOPICS = [
  { id: 'overview', path: '/about', label: 'About Us Overview', shortLabel: 'Overview' },
  { id: 'hospital', path: '/about/hospital', label: 'About Brahm Shakti Hospital', shortLabel: 'Hospital Profile' },
  { id: 'history', path: '/about/history', label: 'History of the Hospital', shortLabel: 'History' },
  { id: 'vision-mission', path: '/about/vision-mission', label: 'Vision and Mission', shortLabel: 'Vision & Mission' },
  { id: 'leadership', path: '/about/leadership', label: 'Leadership & Governance', shortLabel: 'Leadership & Staff' },
  { id: 'facilities', path: '/about/facilities', label: 'Facilities and Technologies', shortLabel: 'Facilities & Tech' },
  { id: 'accreditations', path: '/about/accreditations', label: 'Quality and Accreditations', shortLabel: 'Quality & Accreditations' },
  { id: 'patient-rights', path: '/about/patient-rights', label: 'Patient Rights and Responsibilities', shortLabel: 'Patient Charter' }
];

export const AboutPage = ({ section }) => {
  const params = useParams();

  // Determine active section cleanly
  const activeSectionId = section || params.section || 'overview';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSectionId]);

  const currentTopic = ABOUT_TOPICS.find((t) => t.id === activeSectionId) || ABOUT_TOPICS[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Header with Medical Waves & Hospital Campus Visual */}
      <section className="relative bg-gradient-to-r from-[#E0F8FC] via-[#F0FBFC] to-[#E9F9FC] border-b border-slate-200/80 py-10 sm:py-14 px-4 overflow-hidden">
        {/* Thematic Medical Background Graphic (Matching User Upload) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="/images/banners/medical-bg-hospital.jpg"
            alt=""
            className="w-full h-full object-cover object-right sm:object-center opacity-40 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/" className="hover:text-[#018AAE] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/about" className="hover:text-[#018AAE] transition-colors">About Us</Link>
            {activeSectionId !== 'overview' && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#018AAE] font-bold">
                  {currentTopic.label}
                </span>
              </>
            )}
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#018AAE]/10 border border-[#018AAE]/25 text-[#018AAE] text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Brahm Shakti Hospital &amp; Research Centre</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
            {currentTopic.label}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            A 250-bedded multi-disciplinary tertiary healthcare institution located in Budh Vihar, Rohini, New Delhi, dedicated to clinical excellence, ethical medical practice, and round-the-clock emergency support.
          </p>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-[#018AAE]" />
              250+ Inpatient Beds
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              NABH &amp; NABL Standards
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
              <UserCheck className="w-4 h-4 text-[#018AAE]" />
              20+ DMC Specialist Consultants
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
              <Clock className="w-4 h-4 text-[#E06D2D]" />
              24x7 Emergency &amp; Trauma Care
            </span>
          </div>
        </div>
      </section>

      {/* Main Container with Sidebar Navigation + Content */}
      <section className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4">
              <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-3 py-2 border-b border-slate-100 mb-2">
                About Sections
              </div>
              <nav className="space-y-1">
                {ABOUT_TOPICS.map((topic) => {
                  const isActive = activeSectionId === topic.id;
                  return (
                    <Link
                      key={topic.id}
                      to={topic.path}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        isActive
                          ? 'bg-[#018AAE] text-white shadow-md shadow-[#018AAE]/20'
                          : 'text-slate-700 hover:bg-[#F0FBFC] hover:text-[#018AAE]'
                      }`}
                    >
                      <span className="truncate">{topic.label}</span>
                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'translate-x-1 text-white' : 'text-slate-400'}`} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Quick Contact & Emergency Box */}
            <div className="bg-gradient-to-br from-[#018AAE] to-[#015B73] rounded-2xl text-white p-5 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-200">
                <PhoneCall className="w-4 h-4" />
                <span>24/7 Helpline Desk</span>
              </div>
              <h4 className="text-base font-bold leading-tight">Need Medical Assistance or Admission?</h4>
              <p className="text-xs text-teal-100 leading-relaxed">
                Connect directly with our 24x7 casualty and admission triage desk.
              </p>
              <div className="space-y-1.5 pt-1">
                <a
                  href="tel:01127531683"
                  className="block text-center py-2 px-3 rounded-xl bg-white text-[#018AAE] font-black text-xs hover:bg-slate-100 transition-colors shadow-2xs"
                >
                  Call: 011-27531683
                </a>
                <Link
                  to="/bookappointment"
                  className="block text-center py-2 px-3 rounded-xl bg-[#0DAFD5] text-white font-bold text-xs hover:bg-[#0aa0c4] transition-colors shadow-2xs"
                >
                  Book OPD Appointment
                </Link>
              </div>
            </div>
          </div>

          {/* Right Main Content Pane */}
          <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8">
            {activeSectionId === 'overview' && <OverviewSection />}
            {activeSectionId === 'hospital' && <HospitalSection />}
            {activeSectionId === 'history' && <HistorySection />}
            {activeSectionId === 'vision-mission' && <VisionMissionSection />}
            {activeSectionId === 'leadership' && <LeadershipSection />}
            {activeSectionId === 'facilities' && <FacilitiesSection />}
            {activeSectionId === 'accreditations' && <AccreditationsSection />}
            {activeSectionId === 'patient-rights' && <PatientRightsSection />}
          </div>
        </div>
      </section>
    </div>
  );
};

/* --- SECTION 1: OVERVIEW --- */
const OverviewSection = () => (
  <div className="space-y-8 animate-in fade-in duration-200">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#018AAE] mb-2">
        <Sparkles className="w-4 h-4" />
        <span>Institution Overview</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        Excellence in Healthcare, Compassion in Service
      </h2>
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
        Brahm Shakti Hospital is a premier 250-bedded super-specialty hospital situated at Pocket C, Budh Vihar, North-West Delhi. The hospital provides state-of-the-art diagnostic, surgical, and therapeutic medical interventions across all major clinical disciplines.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 rounded-2xl bg-[#F0FBFC] border border-[#B6EEF6]/60">
        <div className="text-3xl font-black text-[#018AAE]">250+</div>
        <div className="text-xs font-bold text-slate-800 mt-1">Multi-Specialty Beds</div>
        <div className="text-[11px] text-slate-500 mt-0.5">ICU, HDU, Level-III NICU &amp; Suites</div>
      </div>
      <div className="p-4 rounded-2xl bg-[#F0FBFC] border border-[#B6EEF6]/60">
        <div className="text-3xl font-black text-[#018AAE]">20+</div>
        <div className="text-xs font-bold text-slate-800 mt-1">Consultant Specialists</div>
        <div className="text-[11px] text-slate-500 mt-0.5">DMC Certified Senior Clinicians</div>
      </div>
      <div className="p-4 rounded-2xl bg-[#F0FBFC] border border-[#B6EEF6]/60">
        <div className="text-3xl font-black text-[#018AAE]">24x7</div>
        <div className="text-xs font-bold text-slate-800 mt-1">Active Casualty &amp; Blood Bank</div>
        <div className="text-[11px] text-slate-500 mt-0.5">Emergency Trauma Desk</div>
      </div>
    </div>

    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <img
        src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"
        alt="Brahm Shakti Hospital Modern Campus"
        className="w-full h-64 sm:h-80 object-cover"
      />
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Key Institutional Highlights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'NABH & NABL Standards', desc: 'Compliant with national safety protocols, sterile infection controls, and verified diagnostic benchmarks.' },
          { title: 'Full-Spectrum Critical Care', desc: 'Advanced 30-bed ICU and CCU equipped with mechanical ventilators, invasive haemodynamic monitoring, and 24x7 intensivist presence.' },
          { title: '20-Bed Dialysis Center', desc: 'Dedicated haemodialysis unit supported by dual-stage reverse osmosis water purification for high-flux renal care.' },
          { title: '24x7 Emergency & Trauma', desc: 'Always-ready casualty triage with rapid-response cardiac and surgical emergency support.' }
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#018AAE] shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-slate-900">{item.title}</div>
              <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* --- SECTION 2: ABOUT BRAHM SHAKTI HOSPITAL (Rich Institutional Profile) --- */
const HospitalSection = () => (
  <div className="space-y-8 animate-in fade-in duration-200">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#018AAE] mb-2">
        <Building2 className="w-4 h-4" />
        <span>Institution Profile</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        About Brahm Shakti Hospital &amp; Research Centre
      </h2>
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
        Brahm Shakti Hospital &amp; Research Centre is a multi-specialty tertiary care hospital situated at Pocket C, Budh Vihar Phase I, Rohini, New Delhi. Established to bring accessible, affordable, and high-tech tertiary healthcare to North-West Delhi, the hospital serves as an integrated medical hub offering preventive, curative, and emergency medical services under one roof.
      </p>
    </div>

    {/* Key Hospital Statistics */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
        <div className="text-2xl sm:text-3xl font-black text-[#018AAE]">250</div>
        <div className="text-xs font-bold text-slate-700 mt-1">Inpatient Beds</div>
        <div className="text-[11px] text-slate-500">Total Capacity</div>
      </div>
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
        <div className="text-2xl sm:text-3xl font-black text-[#018AAE]">30+</div>
        <div className="text-xs font-bold text-slate-700 mt-1">ICU &amp; Critical Beds</div>
        <div className="text-[11px] text-slate-500">Ventilator Supported</div>
      </div>
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
        <div className="text-2xl sm:text-3xl font-black text-[#018AAE]">20</div>
        <div className="text-xs font-bold text-slate-700 mt-1">Dialysis Stations</div>
        <div className="text-[11px] text-slate-500">24x7 Renal Wing</div>
      </div>
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
        <div className="text-2xl sm:text-3xl font-black text-[#018AAE]">4</div>
        <div className="text-xs font-bold text-slate-700 mt-1">Modular OT Suites</div>
        <div className="text-[11px] text-slate-500">HEPA Filtered</div>
      </div>
    </div>

    {/* Location & Infrastructure Description */}
    <div className="p-6 rounded-2xl bg-[#F0FBFC] border border-[#B6EEF6] space-y-3">
      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-[#018AAE]" />
        <span>Location &amp; Campus Layout</span>
      </h3>
      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
        Located conveniently along the main arterial corridor of Budh Vihar Phase I (near Rohini Sector 20/22), the hospital building features a ground-level zero-wait casualty ambulance bay, multi-tier inpatient wards, modular surgical theatres, and isolated critical care wings designed with positive air pressure to eliminate cross-infections.
      </p>
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
          📍 Address: Pocket C, B-Block, NIT-3 Phase-1, Rohini, New Delhi - 110085
        </span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
          📞 24x7 Emergency: +91-7840089703
        </span>
      </div>
    </div>

    {/* Clinical Departments Overview */}
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Clinical Departments &amp; Specialities</h3>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        Brahm Shakti Hospital operates 9 active clinical departments staffed by dedicated medical consultants:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {departmentsData.map((dept) => (
          <Link
            key={dept.id}
            to={`/departments/${dept.id}`}
            className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#018AAE] hover:bg-[#F0FBFC] transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-[#018AAE] transition-colors">
                {dept.name}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#018AAE] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Lead: {dept.headOfDepartment}
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

/* --- SECTION 3: HISTORY --- */
const HistorySection = () => (
  <div className="space-y-8 animate-in fade-in duration-200">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#018AAE] mb-2">
        <ScrollText className="w-4 h-4" />
        <span>Chronicle of Growth</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        History of Brahm Shakti Hospital
      </h2>
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
        Established with a visionary goal to bring modern healthcare infrastructure to North-West Delhi, Brahm Shakti Hospital has grown steadily into a trusted tertiary institution.
      </p>
    </div>

    {/* Timeline Component */}
    <div className="relative border-l-2 border-[#018AAE]/30 ml-4 space-y-8 py-2">
      {[
        {
          year: 'Foundational Vision',
          title: 'Establishment of Hospital Services in Budh Vihar',
          desc: 'Commenced primary outpatient clinics, maternal care, and emergency first aid to serve the semi-urban localities of Rohini and Budh Vihar.'
        },
        {
          year: 'Inpatient Expansion',
          title: 'Launch of 100-Bed Multi-Specialty Facility',
          desc: 'Expanded inpatient surgical theatres, round-the-clock emergency casualty desk, and intensive pediatric and gynecological wards.'
        },
        {
          year: 'Critical Care Era',
          title: 'Commissioning of 30-Bed Critical Care ICU & Dialysis Wing',
          desc: 'Added high-end Dräger and Maquet mechanical ventilators, multi-channel central monitoring, and 20-bed hemodialysis services.'
        },
        {
          year: 'Advanced Surgical Era',
          title: 'Modular HEPA Operating Theatres & 250 Beds',
          desc: 'Constructed 4 ultra-clean laminar airflow modular operating theatres for complex laparoscopic and orthopedic joint surgeries.'
        },
        {
          year: 'Modern Era',
          title: 'Digital Healthcare & Quality Standards',
          desc: 'Integrated paperless hospital management, automated central diagnostic laboratory, and enhanced round-the-clock ambulance trauma fleet.'
        }
      ].map((milestone, idx) => (
        <div key={idx} className="relative pl-6">
          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#018AAE] border-4 border-white shadow-xs" />
          <div className="text-xs font-bold text-[#018AAE] uppercase tracking-wider">{milestone.year}</div>
          <h4 className="text-base font-bold text-slate-900 mt-0.5">{milestone.title}</h4>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{milestone.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

/* --- SECTION 4: VISION AND MISSION --- */
const VisionMissionSection = () => (
  <div className="space-y-8 animate-in fade-in duration-200">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#018AAE] mb-2">
        <Target className="w-4 h-4" />
        <span>Core Values</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        Vision, Mission and Guiding Principles
      </h2>
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
        Our core clinical philosophy guides each medical decision, surgical procedure, and patient interaction at Brahm Shakti Hospital.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 rounded-2xl bg-[#F0FBFC] border border-[#B6EEF6] space-y-3">
        <div className="w-10 h-10 rounded-xl bg-[#018AAE] text-white flex items-center justify-center">
          <Target className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Our Vision</h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          To be recognized as the premier trusted healthcare landmark in Northern India, distinguished by ethical medical practices, innovative surgical excellence, and compassionate clinical care for patients from all walks of life.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[#F0FBFC] border border-[#B6EEF6] space-y-3">
        <div className="w-10 h-10 rounded-xl bg-[#0DAFD5] text-white flex items-center justify-center">
          <Compass className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Our Mission</h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          To deliver comprehensive, subsidized, and prompt tertiary clinical care utilizing modern biomedical technology, certified infection prevention protocols, and continuous patient-centric empathy.
        </p>
      </div>
    </div>

    <div className="space-y-4 pt-4">
      <h3 className="text-lg font-bold text-slate-900">Our Pillars of Excellence</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Compassion', desc: 'Treating each patient and family with warmth, dignity, and empathy.' },
          { title: 'Integrity', desc: 'Honest clinical advice, zero hidden fees, and evidence-backed therapy.' },
          { title: 'Affordability', desc: 'Ensuring advanced medical care remains within reach of the community.' },
          { title: 'Clinical Safety', desc: 'Adhering to strict hygiene, infection prevention, and surgical checklists.' }
        ].map((v, i) => (
          <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <h4 className="font-bold text-sm text-[#018AAE]">{v.title}</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* --- SECTION 5: LEADERSHIP & GOVERNANCE (DEPARTMENT-WISE DOCTORS & STAFF DIRECTORY) --- */
const LeadershipSection = () => {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');

  // Executive Administration Leaders
  const hospitalLeadership = [
    {
      name: 'Dr. B.R. Sharma',
      role: 'Medical Superintendent & Director of Medical Services',
      qual: 'MBBS, MD (Hospital Administration)',
      experience: '28+ Years',
      bio: 'Directs statutory clinical governance, quality protocols, and hospital operations.'
    },
    {
      name: 'Dr. Gaurav Kaushik',
      role: 'Head of Critical Care, Anaesthesiology & ICU',
      qual: 'MBBS, MD (Anaesthesiology), IDCCM',
      experience: '18+ Years',
      bio: 'Heads the 30-bed ICU and emergency resuscitation team with 24x7 intensivist presence.'
    },
    {
      name: 'Dr. Sanjeev Verma',
      role: 'Head of Surgical Services & OT Complex',
      qual: 'MBBS, MS (General Surgery), FIAGES',
      experience: '25+ Years',
      bio: 'Oversees 4 modular surgical theatres, minimally invasive laparoscopy, and emergency surgical triage.'
    },
    {
      name: 'Dr. S.K. Goyal',
      role: 'Chief of Medical Operations & Internal Medicine',
      qual: 'MBBS, MD (Internal Medicine)',
      experience: '32+ Years',
      bio: 'Senior physician leading adult multi-system illness management and diabetic clinics.'
    }
  ];

  // Group Doctors and Staff by Department
  const filteredDoctors = selectedDeptFilter === 'all'
    ? doctorsData
    : doctorsData.filter((d) => d.departmentId === selectedDeptFilter);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#018AAE] mb-2">
          <Users className="w-4 h-4" />
          <span>Staff Directory</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Leadership, Medical Faculty &amp; Staff Directory
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
          Explore the clinical and administrative leadership team along with the comprehensive department-wise roster of specialist doctors and healthcare professionals serving at Brahm Shakti Hospital.
        </p>
      </div>

      {/* Hospital Executive Board */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BadgeCheck className="w-5 h-5 text-[#018AAE]" />
          <span>Hospital Medical Administration</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hospitalLeadership.map((leader, i) => (
            <div key={i} className="p-4 rounded-2xl bg-gradient-to-br from-[#F0FBFC] to-white border border-[#B6EEF6] shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900">{leader.name}</h4>
                  <div className="text-xs font-bold text-[#018AAE] mt-0.5">{leader.role}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{leader.qual} · {leader.experience}</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#018AAE] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {leader.name.split(' ')[1]?.[0] || 'D'}
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed border-t border-slate-200/60 pt-2">
                {leader.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Department-wise Filter Buttons */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Department-Wise Doctor &amp; Clinical Staff Directory
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredDoctors.length} verified clinical professionals
            </p>
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              type="button"
              onClick={() => setSelectedDeptFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedDeptFilter === 'all'
                  ? 'bg-[#018AAE] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Departments
            </button>
            {departmentsData.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDeptFilter(d.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedDeptFilter === liquidDeptId(d.id) || selectedDeptFilter === d.id
                    ? 'bg-[#018AAE] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d.name.split('&')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor and Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#018AAE]/60 transition-all shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={doc.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'}
                  alt={doc.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                />
                <div className="min-w-0 flex-1">
                  <div className="inline-block px-2 py-0.5 rounded-md bg-[#CEF5FA]/80 text-[#018AAE] text-[10px] font-bold mb-1">
                    {doc.departmentName || doc.department}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 truncate">{doc.name}</h4>
                  <div className="text-xs text-slate-600 font-medium truncate">{doc.designation}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{doc.qualification}</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-[11px] text-slate-500 font-medium">
                  {doc.experienceYears ? `${doc.experienceYears}+ Yrs Exp` : 'Consultant'} · DMC: {doc.dmcNo || 'Regd'}
                </div>
                <Link
                  to={`/doctors/${doc.id}`}
                  className="inline-flex items-center gap-1 font-bold text-[#018AAE] hover:underline"
                >
                  <span>Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper for department filtering
const liquidDeptId = (id) => id;

/* --- SECTION 6: FACILITIES AND TECHNOLOGIES --- */
const FacilitiesSection = () => (
  <div className="space-y-8 animate-in fade-in duration-200">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#018AAE] mb-2">
        <Building2 className="w-4 h-4" />
        <span>Medical Infrastructure</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        Facilities and Technologies
      </h2>
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
        Brahm Shakti Hospital integrates precision diagnostic systems and surgical infrastructure to deliver rapid clinical interventions with minimal post-operative recovery periods.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[
        {
          title: 'Modular Laminar-Flow Operation Theatres',
          desc: 'Ultra-clean HEPA air filtration with positive pressure systems, eliminating airborne microbial counts during complex joint replacements and laparoscopic procedures.'
        },
        {
          title: '30-Bed Adult ICU & CCU Complex',
          desc: 'Equipped with high-end Maquet / Dräger mechanical ventilators, continuous arterial line monitoring, central nursing telemetry, and blood gas analysis.'
        },
        {
          title: '20-Bed Advanced Hemodialysis Wing',
          desc: 'Continuous dual-stage reverse osmosis water treatment, bicarbonate dialysate delivery, and isolated stations for infectious safety.'
        },
        {
          title: 'Level-III Neonatal Intensive Care (NICU)',
          desc: 'Giraffe infant warmers, LED phototherapy units, neonatal bubble CPAP, and synchronized ventilation for premature neonates.'
        },
        {
          title: 'Automated 24x7 Diagnostic Pathology',
          desc: 'Partnership with Oncquest Diagnostics for comprehensive automated biochemistry, immunology, blood gases, and molecular testing.'
        },
        {
          title: 'High-Frequency Digital Radiology (DR)',
          desc: 'Low-radiation digital radiography, portable bedside X-ray units, and Color Doppler 3D/4D ultrasonography for rapid reporting.'
        }
      ].map((fac, i) => (
        <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-[#018AAE] mb-2" />
          <h4 className="font-bold text-sm sm:text-base text-slate-900">{fac.title}</h4>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{fac.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

/* --- SECTION 7: QUALITY AND ACCREDITATIONS --- */
const AccreditationsSection = () => (
  <div className="space-y-8 animate-in fade-in duration-200">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#018AAE] mb-2">
        <ShieldCheck className="w-4 h-4" />
        <span>Quality Benchmarks</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        Quality and Accreditations
      </h2>
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
        Patient safety, clinical outcomes, and transparent healthcare administration are the bedrock of Brahm Shakti Hospital. We adhere to stringent national quality assurance standards.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#F0FBFC] to-white border border-[#B6EEF6] space-y-3">
        <div className="w-12 h-12 rounded-xl bg-[#018AAE] text-white flex items-center justify-center font-black">
          NABH
        </div>
        <h3 className="text-lg font-bold text-slate-900">NABH Standards Compliance</h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Rigorous clinical protocols validated against National Accreditation Board for Hospitals &amp; Healthcare Providers (NABH) standards, encompassing safe medication administration, patient identification protocols, surgical safety checklists, and incident reporting.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#F0FBFC] to-white border border-[#B6EEF6] space-y-3">
        <div className="w-12 h-12 rounded-xl bg-[#0DAFD5] text-white flex items-center justify-center font-black">
          NABL
        </div>
        <h3 className="text-lg font-bold text-slate-900">NABL Quality Diagnostic Standards</h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Pathology and laboratory investigations adhere strictly to National Accreditation Board for Testing and Calibration Laboratories (NABL) guidelines with daily multi-level internal quality controls (IQC) and external quality assurance schemes (EQAS).
        </p>
      </div>
    </div>

    <div className="space-y-3 pt-2">
      <h3 className="text-base font-bold text-slate-900">Hospital Infection Control Committee (HICC)</h3>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        Our dedicated Hospital Infection Control Committee continuously monitors sterilization cycles, hand hygiene compliance among clinical staff, microbiological air sampling of OT suites, and biomedical waste disposal in compliance with DPCC regulations.
      </p>
    </div>
  </div>
);

/* --- SECTION 8: PATIENT RIGHTS & RESPONSIBILITIES --- */
const PatientRightsSection = () => (
  <div className="space-y-8 animate-in fade-in duration-200">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#018AAE] mb-2">
        <FileCheck2 className="w-4 h-4" />
        <span>Patient Charter</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        Patient Rights and Responsibilities
      </h2>
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
        At Brahm Shakti Hospital, we believe informed patients make the best partners in healthcare. Every patient admitted or treated at our facility is protected under our transparent Patient Charter.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Patient Rights */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-base">
          <CheckCircle2 className="w-5 h-5" />
          <span>Patient Rights</span>
        </div>
        <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-[#018AAE] font-bold">•</span>
            <span><strong>Right to Respect &amp; Dignity:</strong> Receive considerate, respectful care regardless of race, caste, gender, religion, or ability to pay.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#018AAE] font-bold">•</span>
            <span><strong>Right to Informed Consent:</strong> Understand diagnosis, proposed treatment alternatives, expected outcomes, and risks before signing consent.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#018AAE] font-bold">•</span>
            <span><strong>Right to Privacy &amp; Confidentiality:</strong> Complete confidentiality of medical examination, treatment, and medical records.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#018AAE] font-bold">•</span>
            <span><strong>Right to Financial Transparency:</strong> Access clear, itemized billing explanations and cost estimates prior to planned admissions.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#018AAE] font-bold">•</span>
            <span><strong>Right to Second Opinion:</strong> Seek a consultation or medical opinion from another qualified specialist without hesitation.</span>
          </li>
        </ul>
      </div>

      {/* Patient Responsibilities */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[#018AAE] font-bold text-base">
          <ShieldCheck className="w-5 h-5" />
          <span>Patient Responsibilities</span>
        </div>
        <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-[#018AAE] font-bold">•</span>
            <span><strong>Accurate Medical History:</strong> Provide complete and accurate information about past illnesses, medications, and allergies.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#018AAE] font-bold">•</span>
            <span><strong>Compliance with Treatment:</strong> Follow the prescribed therapeutic and nursing care plan developed by your doctors.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#018AAE] font-bold">•</span>
            <span><strong>Respect Hospital Policies:</strong> Observe visitor policies, smoking prohibitions, and quiet hours to promote healing for all patients.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#018AAE] font-bold">•</span>
            <span><strong>Respect Healthcare Staff:</strong> Treat doctors, nurses, technicians, and fellow patients with courtesy and mutual respect.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#018AAE] font-bold">•</span>
            <span><strong>Timely Settlement of Bills:</strong> Settle verified financial obligations promptly upon discharge.</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default AboutPage;
