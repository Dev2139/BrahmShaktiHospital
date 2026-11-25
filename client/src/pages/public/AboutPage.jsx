import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Building2,
  Heart,
  Users,
  Target,
  Compass,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Sparkles,
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
  HelpCircle,
  Eye,
  ChevronRight
} from 'lucide-react';

// Topics mapping and metadata
export const ABOUT_TOPICS = [
  { id: 'overview', path: '/about', label: 'About Us Overview', shortLabel: 'Overview' },
  { id: 'hospital', path: '/about/hospital', label: 'About Brahm Shakti Hospital', shortLabel: 'Hospital Profile' },
  { id: 'trust', path: '/about/trust', label: 'About Brahm Shakti Trust', shortLabel: 'The Trust' },
  { id: 'history', path: '/about/history', label: 'History of the Hospital', shortLabel: 'History' },
  { id: 'vision-mission', path: '/about/vision-mission', label: 'Vision and Mission', shortLabel: 'Vision & Mission' },
  { id: 'awards', path: '/about/awards', label: 'Awards and Accolades', shortLabel: 'Awards & Accolades' },
  { id: 'leadership', path: '/about/leadership', label: 'Leadership & Governance', shortLabel: 'Leadership' },
  { id: 'charity', path: '/about/charity', label: 'Charity and Welfare Activities', shortLabel: 'Charity & Welfare' },
  { id: 'facilities', path: '/about/facilities', label: 'Facilities and Technologies', shortLabel: 'Facilities & Tech' },
  { id: 'accreditations', path: '/about/accreditations', label: 'Quality and Accreditations', shortLabel: 'Quality & Accreditations' },
  { id: 'patient-rights', path: '/about/patient-rights', label: 'Patient Rights and Responsibilities', shortLabel: 'Patient Rights & Duties' }
];

export const AboutPage = ({ section }) => {
  const params = useParams();
  const navigate = useNavigate();

  // Active section can come from prop or url parameter, default to overview
  const activeSectionId = section || params.section || 'overview';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSectionId]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Header with Brand Cyan & Teal Accents */}
      <section className="relative bg-gradient-to-br from-[#E0F8FC] via-[#F0FBFC] to-white border-b border-slate-200/80 py-10 sm:py-14 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0DAFD5]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#018AAE]/10 rounded-full blur-3xl pointer-events-none" />

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
                  {ABOUT_TOPICS.find((t) => t.id === activeSectionId)?.label || 'Details'}
                </span>
              </>
            )}
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#018AAE]/10 border border-[#018AAE]/25 text-[#018AAE] text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Brahm Shakti Hospital &amp; Research Centre</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
            {ABOUT_TOPICS.find((t) => t.id === activeSectionId)?.label || 'About Brahm Shakti Hospital'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            A 250-bedded multi-disciplinary tertiary healthcare institution managed by Brahm Shakti Trust (Regd.), dedicated to affordable clinical excellence, patient dignity, and charitable healthcare in Delhi NCR.
          </p>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-[#018AAE]" />
              250+ Inpatient Beds
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              NABH &amp; NABL Accredited
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
              <HeartHandshake className="w-4 h-4 text-[#E06D2D]" />
              Non-Profit Philanthropic Trust
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
              <Clock className="w-4 h-4 text-[#018AAE]" />
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
            {/* Dynamic Rendering Based on activeSectionId */}
            {activeSectionId === 'overview' && <OverviewSection />}
            {activeSectionId === 'hospital' && <HospitalSection />}
            {activeSectionId === 'trust' && <TrustSection />}
            {activeSectionId === 'history' && <HistorySection />}
            {activeSectionId === 'vision-mission' && <VisionMissionSection />}
            {activeSectionId === 'awards' && <AwardsSection />}
            {activeSectionId === 'leadership' && <LeadershipSection />}
            {activeSectionId === 'charity' && <CharitySection />}
            {activeSectionId === 'facilities' && <FacilitiesSection />}
            {activeSectionId === 'accreditations' && <AccreditationsSection />}
            {activeSectionId === 'patient-rights' && <PatientRightsSection />}
          </div>
        </div>
      </section>
    </div>
  );
};

/* --- INDIVIDUAL DETAILED SUB-COMPONENTS --- */

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
        Brahm Shakti Hospital is a premier 250-bedded super-specialty hospital situated in Budh Vihar, North-West Delhi. Governed by Brahm Shakti Trust (Regd.), the institution provides state-of-the-art medical and surgical intervention while upholding its deep-rooted ethos that quality healthcare must remain accessible and affordable to all.
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
        <div className="text-xs font-bold text-slate-800 mt-1">Specialist Doctors</div>
        <div className="text-[11px] text-slate-500 mt-0.5">DMC Certified Senior Consultants</div>
      </div>
      <div className="p-4 rounded-2xl bg-[#F0FBFC] border border-[#B6EEF6]/60">
        <div className="text-3xl font-black text-[#018AAE]">100%</div>
        <div className="text-xs font-bold text-slate-800 mt-1">Subsidized Trust Care</div>
        <div className="text-[11px] text-slate-500 mt-0.5">Charitable pricing structure</div>
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
          { title: 'NABH & NABL Standards', desc: 'Compliant with national safety protocols, zero-tolerance hospital infection controls, and verified diagnostic benchmarks.' },
          { title: 'Full-Spectrum Critical Care', desc: 'Advanced 30-bed ICU and CCU equipped with mechanical ventilators, invasive haemodynamic monitoring, and 24x7 intensivist presence.' },
          { title: 'Comprehensive Dialysis Wing', desc: 'Dedicated 20-bed haemodialysis unit supported by reverse osmosis water purification for high-flux renal care.' },
          { title: '24x7 Emergency & Trauma', desc: 'Always-ready casualty triage with rapid-response cardiac and neurological emergency support.' }
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

const HospitalSection = () => (
  <div className="space-y-8 animate-in fade-in duration-200">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#018AAE] mb-2">
        <Hospital className="w-4 h-4" />
        <span>Institution Profile</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        About Brahm Shakti Hospital &amp; Research Centre
      </h2>
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
        Established to deliver high-quality tertiary clinical services to the community, Brahm Shakti Hospital stands as an integrated health ecosystem offering preventive, diagnostic, therapeutic, and rehabilitative care under one roof.
      </p>
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Hospital Infrastructure &amp; Bed Capacity</h3>
      <p className="text-sm text-slate-600 leading-relaxed">
        The campus in Budh Vihar Phase I is architected to optimize patient recovery and hygienic sterility. It houses 250 operational inpatient beds segregated into intensive care units, coronary care units, neonatal ICU (Level III), high dependency units (HDU), semi-private rooms, and deluxe single suites.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <div className="text-2xl font-black text-[#018AAE]">250</div>
          <div className="text-xs font-bold text-slate-700 mt-1">Total Inpatient Beds</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <div className="text-2xl font-black text-[#018AAE]">30+</div>
          <div className="text-xs font-bold text-slate-700 mt-1">ICU &amp; Critical Beds</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <div className="text-2xl font-black text-[#018AAE]">20</div>
          <div className="text-xs font-bold text-slate-700 mt-1">Dialysis Stations</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <div className="text-2xl font-black text-[#018AAE]">4</div>
          <div className="text-xs font-bold text-slate-700 mt-1">Modular OT Suites</div>
        </div>
      </div>
    </div>

    <div className="space-y-4 pt-2">
      <h3 className="text-lg font-bold text-slate-900">Super-Specialty Departments</h3>
      <p className="text-sm text-slate-600 leading-relaxed">
        We host over 9 full clinical departments with cross-functional consultant teams:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          'Internal & Critical Care Medicine',
          'Cardiology & Interventional Cath Lab',
          'General & Advanced Laparoscopic Surgery',
          'Orthopaedics & Joint Replacement',
          'Obstetrics, Gynaecology & Infertility',
          'Paediatrics & Neonatology (NICU)',
          'Nephrology & Dialysis Unit',
          'Ophthalmology & Micro-Surgery',
          'ENT, Head & Neck Surgery'
        ].map((dept, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-[#F0FBFC]/80 border border-[#CEF5FA] text-xs font-bold text-slate-800 flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-[#018AAE] shrink-0" />
            <span>{dept}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TrustSection = () => (
  <div className="space-y-8 animate-in fade-in duration-200">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#018AAE] mb-2">
        <HeartHandshake className="w-4 h-4" />
        <span>Governing Trust</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        About Brahm Shakti Trust (Regd.)
      </h2>
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
        Brahm Shakti Trust is a registered non-profit charitable body established under the Indian Trusts Act. Founded with the sacred motto of serving humanity, the Trust finances and governs healthcare and educational welfare activities without distinction of caste, religion, or economic standing.
      </p>
    </div>

    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#F0FBFC] to-white border border-[#B6EEF6] space-y-4">
      <h3 className="text-base font-bold text-slate-900">Foundational Charter of the Trust</h3>
      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
        The Trust operates on a self-sustaining non-profit model. All revenues generated through hospital services are re-invested into updating medical technologies, subsidizing inpatient and outpatient charges for economically weaker sections (EWS), and conducting free village outreach camps.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200">
          <div className="font-bold text-xs text-[#018AAE]">Charitable OPD Programs</div>
          <p className="text-[11px] text-slate-600 mt-1">Concessionary consultations and zero-margin generic medicine distribution.</p>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200">
          <div className="font-bold text-xs text-[#018AAE]">Emergency Welfare Bed Quota</div>
          <p className="text-[11px] text-slate-600 mt-1">Reserved subsidized beds in General Ward and ICU for BPL / Ayushman patients.</p>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Trustees &amp; Governance Objectives</h3>
      <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
        <li className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#018AAE] shrink-0 mt-0.5" />
          <span>Maintain modern infrastructure and bring advanced quaternary care techniques to North-West Delhi.</span>
        </li>
        <li className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#018AAE] shrink-0 mt-0.5" />
          <span>Ensure ethical medical practices where patient welfare takes strict precedence over commercial targets.</span>
        </li>
        <li className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#018AAE] shrink-0 mt-0.5" />
          <span>Provide ongoing medical education, nursing development, and technical health training to local youth.</span>
        </li>
      </ul>
    </div>
  </div>
);

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
        From humble beginnings as a charitable dispensary to a 250-bedded multi-specialty institution, our journey reflects an unwavering commitment to patient healing and community health.
      </p>
    </div>

    {/* Timeline Component */}
    <div className="relative border-l-2 border-[#018AAE]/30 ml-4 space-y-8 py-2">
      {[
        {
          year: 'Inception & Vision',
          title: 'Founding of Brahm Shakti Trust',
          desc: 'The Trust was constituted by benevolent visionaries and medical professionals who recognized the absence of affordable multi-specialty healthcare in North-West Delhi.'
        },
        {
          year: 'Phase I Expansion',
          title: 'Establishment of 100-Bed Hospital in Budh Vihar',
          desc: 'Commenced full round-the-clock emergency, general surgery, maternity, and pediatric inpatient services with an emphasis on low-cost tariffs.'
        },
        {
          year: 'Critical Care Era',
          title: 'Launch of 30-Bed ICU & Dialysis Center',
          desc: 'Installed advanced mechanical ventilators, multipara cardiac monitors, and a 20-bed hemodialysis wing with reverse-osmosis water generation.'
        },
        {
          year: 'Scale & Upgradation',
          title: 'Expansion to 250 Beds & Modern Cath Lab',
          desc: 'Added modular laminar-airflow surgical suites, digital angiography catheterization lab, and comprehensive emergency trauma triage.'
        },
        {
          year: 'Present & Beyond',
          title: 'NABH Accreditation & Digital Healthcare',
          desc: 'Achieved full national healthcare accreditation standards, paperless electronic records, and modern teleconsultation connectivity.'
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

const VisionMissionSection = () => (
  <div className="space-y-8 animate-in fade-in duration-200">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#018AAE] mb-2">
        <Target className="w-4 h-4" />
        <span>Core Values</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        Vision, Mission and Core Values
      </h2>
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
        Our principles guide every diagnostic decision, surgical procedure, and patient interaction across Brahm Shakti Hospital.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Vision Card */}
      <div className="p-6 rounded-2xl bg-[#F0FBFC] border border-[#B6EEF6] space-y-3">
        <div className="w-10 h-10 rounded-xl bg-[#018AAE] text-white flex items-center justify-center">
          <Target className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Our Vision</h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          To be recognized as the most trusted healthcare landmark in Northern India, distinguished by ethical medical practices, innovative surgical excellence, and unwavering compassion for all socio-economic strata.
        </p>
      </div>

      {/* Mission Card */}
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

    {/* Core Values */}
    <div className="space-y-4 pt-4">
      <h3 className="text-lg font-bold text-slate-900">Our Pillars of Excellence</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Compassion', desc: 'Treating each patient with dignity, warmth, and genuine human care.' },
          { title: 'Integrity', desc: 'Transparent billing and honest, evidence-backed clinical opinions.' },
          { title: 'Affordability', desc: 'Ensuring financial hardship never denies a family life-saving treatment.' },
          { title: 'Excellence', desc: 'Adopting verified global clinical protocols and modern surgical technology.' }
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

const AwardsSection = () => (
  <div className="space-y-8 animate-in fade-in duration-200">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#018AAE] mb-2">
        <Award className="w-4 h-4" />
        <span>Recognitions</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        Awards, Recognitions &amp; Accolades
      </h2>
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
        Over the decades, Brahm Shakti Hospital has been recognized by national healthcare forums, civic councils, and medical societies for clinical excellence, community welfare, and outstanding patient satisfaction.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        {
          title: 'Excellence in Affordable Healthcare Award',
          issuedBy: 'Regional Healthcare Forum & North Delhi Medical Council',
          desc: 'Honored for delivering subsidized super-specialty surgery, ICU care, and 24x7 dialysis to semi-urban communities.'
        },
        {
          title: 'Outstanding Community Welfare & Free OPD Outreach',
          issuedBy: 'Delhi Social Welfare & Philanthropic Society',
          desc: 'Commended for conducting over 500+ free health screening camps and distributing free medicines across rural Delhi and Haryana.'
        },
        {
          title: 'Infection Prevention & Patient Safety Benchmark',
          issuedBy: 'Healthcare Quality Standards Council',
          desc: 'Awarded for maintaining rigorous HEPA laminar-airflow operating theater standards and zero-tolerance hospital acquired infection (HAI) rates.'
        },
        {
          title: 'Best Maternal & Child Care Unit (North-West Region)',
          issuedBy: 'Mother & Child Healthcare Association',
          desc: 'Recognized for 24x7 emergency cesarean support, high-risk pregnancy management, and Level-III NICU survival outcomes.'
        }
      ].map((award, i) => (
        <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900">{award.title}</h4>
            <div className="text-xs font-semibold text-[#018AAE] mt-0.5">{award.issuedBy}</div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{award.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LeadershipSection = () => (
  <div className="space-y-8 animate-in fade-in duration-200">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#018AAE] mb-2">
        <Users className="w-4 h-4" />
        <span>Executive Team</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        Leadership &amp; Governance
      </h2>
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
        Brahm Shakti Hospital is steered by an experienced board of medical administrators, senior clinician heads, and philanthropic trustees dedicated to medical ethics, quality improvement, and accessible healthcare.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[
        {
          name: 'Medical Superintendent',
          role: 'Chief Medical Administrator',
          qual: 'MBBS, MD (Hospital Administration)',
          bio: 'Oversees daily clinical governance, clinical safety guidelines, and statutory healthcare accreditations.'
        },
        {
          name: 'Head of Critical Care & ICU',
          role: 'Director of Intensive Care',
          qual: 'MBBS, MD, IDCCM, FCCP',
          bio: 'Directs the 30-bed intensive care complex, ECMO support, and round-the-clock emergency casualty desk.'
        },
        {
          name: 'Head of Surgical Services',
          role: 'Senior Consultant Laparoscopic Surgeon',
          qual: 'MBBS, MS, FIAGES, FALS',
          bio: 'Leads modular surgical theatres, minimally invasive procedures, and surgical safety checklists.'
        },
        {
          name: 'Chief of Nursing & Patient Care',
          role: 'Director of Nursing Services',
          qual: 'M.Sc. Nursing, NABH Assessor',
          bio: 'Directs 200+ trained nursing staff, bedside care protocols, and infection-control audits.'
        },
        {
          name: 'Chief Financial & Trust Officer',
          role: 'Director of Trust Administration',
          qual: 'FCA, Trust Advisory Council',
          bio: 'Ensures zero-leakage transparent billing, charitable subsidies, and community welfare fund allocations.'
        },
        {
          name: 'Head of Diagnostics & Pathology',
          role: 'Senior Pathologist & Lab Director',
          qual: 'MBBS, MD (Pathology)',
          bio: 'Heads automated biochemistry, haematology, microbiology, and NABL compliant diagnostic quality assurance.'
        }
      ].map((leader, i) => (
        <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#018AAE]/40 transition-colors">
          <div className="w-12 h-12 rounded-full bg-[#CEF5FA] text-[#018AAE] flex items-center justify-center font-black text-base mb-3">
            {leader.name.charAt(0)}
          </div>
          <h4 className="font-bold text-sm text-slate-900">{leader.name}</h4>
          <div className="text-xs font-bold text-[#018AAE] mt-0.5">{leader.role}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">{leader.qual}</div>
          <p className="text-xs text-slate-600 mt-3 leading-relaxed border-t border-slate-100 pt-2.5">{leader.bio}</p>
        </div>
      ))}
    </div>
  </div>
);

const CharitySection = () => (
  <div className="space-y-8 animate-in fade-in duration-200">
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#018AAE] mb-2">
        <Heart className="w-4 h-4" />
        <span>Philanthropy</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        Charity and Welfare Activities
      </h2>
      <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
        Guided by the foundational ethos of Brahm Shakti Trust (Regd.), our mission goes beyond the hospital walls. We actively run community welfare programs, free mobile clinics, and subsidized surgical drives.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Free Village Medical &amp; Eye Camps</h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Regular weekend health camps organized across semi-urban clusters of Delhi and Haryana, providing free blood sugar checks, ECG screenings, cataract diagnoses, and complimentary consultations.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="w-10 h-10 rounded-xl bg-[#CEF5FA] text-[#018AAE] flex items-center justify-center">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Subsidized Dialysis &amp; Renal Support</h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Through Trust endowment funding, chronic kidney failure patients receive life-sustaining hemodialysis sessions at deeply discounted and charitable rates, ensuring no patient discontinues treatment.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <FileCheck2 className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-slate-900">BPL &amp; EWS Inpatient Quota</h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Dedicated ward beds reserved for Below Poverty Line (BPL) families, providing completely free room rent, nursing care, and subsidized surgical consumables during emergencies.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
          <Activity className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Voluntary Blood Donation Drives</h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          In coordination with our licensed in-house blood center, community blood donation camps are organized regularly to ensure adequate voluntary component availability for thalassemia and trauma patients.
        </p>
      </div>
    </div>
  </div>
);

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
          title: 'Flat-Panel Digital Cath Lab',
          desc: 'High-resolution digital coronary angiography, primary angioplasty (PAMI), pacemaker implantations, and peripheral vascular stenting.'
        },
        {
          title: 'Modular Laminar-Flow Operation Theatres',
          desc: 'Ultra-clean HEPA air filtration with positive pressure systems, eliminating airborne microbial counts during complex joint replacements and neurosurgeries.'
        },
        {
          title: '30-Bed Adult ICU & CCU Complex',
          desc: 'Equipped with high-end Maquet / Dräger ventilators, continuous arterial line monitoring, central nursing telemetry, and dedicated blood gas analyzers.'
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
      <h3 className="text-base font-bold text-slate-900">Hospital Infection Control (HICC)</h3>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        Our dedicated Hospital Infection Control Committee continuously monitors sterilization cycles, hand hygiene compliance among clinical staff, microbiological air sampling of OT suites, and biomedical waste disposal in compliance with DPCC regulations.
      </p>
    </div>
  </div>
);

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
            <span><strong>Timely Settlement of Bills:</strong> Settle verified financial obligations promptly or liaise with the Trust welfare desk if subsidized assistance is required.</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default AboutPage;
