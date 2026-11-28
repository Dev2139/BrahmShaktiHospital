import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Home,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  PhoneCall,
  Check,
  Plus,
  Minus,
  Users,
  Stethoscope,
  Activity,
  Heart,
  Baby,
  Ear,
  Sparkles,
  Droplet,
  FlaskConical,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import { departmentsData, doctorsData } from '../../data/seedData';

// Specific icons mapping for each specialty
const getDepartmentIcon = (deptId, className = 'w-6 h-6') => {
  const id = (deptId || '').toLowerCase();
  if (id.includes('medicine') || id.includes('internal')) {
    return <Stethoscope className={className} />;
  }
  if (id.includes('surg') || id.includes('general')) {
    // Medical cross / hospital icon
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 6v12M6 12h12" />
        <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
      </svg>
    );
  }
  if (id.includes('diabet') || id.includes('metabol') || id.includes('sugar')) {
    return <Droplet className={className} />;
  }
  if (id.includes('cardio') || id.includes('heart')) {
    return <Heart className={className} />;
  }
  if (id.includes('ortho') || id.includes('bone') || id.includes('joint')) {
    // Knee joint / bone skeleton icon
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="9" cy="5" r="2.5" />
        <circle cx="15" cy="5" r="2.5" />
        <path d="M12 7.5v9" />
        <circle cx="9" cy="19" r="2.5" />
        <circle cx="15" cy="19" r="2.5" />
      </svg>
    );
  }
  if (id.includes('gynae') || id.includes('obst') || id.includes('mater')) {
    // Mother & pregnant / womb stylized icon
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="5" r="3" />
        <path d="M9 10a5 5 0 0 1 6 0v7a3 3 0 0 1-6 0z" />
      </svg>
    );
  }
  if (id.includes('ped') || id.includes('child') || id.includes('baby')) {
    return <Baby className={className} />;
  }
  if (id.includes('ent') || id.includes('ear') || id.includes('throat')) {
    return <Ear className={className} />;
  }
  if (id.includes('skin') || id.includes('derma')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2C8 6 6 10 6 14a6 6 0 0 0 12 0c0-4-2-8-6-12z" />
        <path d="M12 12v5" />
      </svg>
    );
  }
  return <Activity className={className} />;
};

export const DepartmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [department, setDepartment] = useState(null);
  const [allDepartments, setAllDepartments] = useState([]);
  const [departmentDoctors, setDepartmentDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mobile Accordion state for "About the Department"
  const [aboutAccordionOpen, setAboutAccordionOpen] = useState(false);

  // Active doctor carousel index for mobile view
  const [mobileDocIndex, setMobileDocIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchData = async () => {
      setLoading(true);
      try {
        const [singleDeptRes, allDeptsRes, allDocsRes] = await Promise.all([
          api.get(`/departments/${id}`).catch(() => null),
          api.get('/departments').catch(() => null),
          api.get('/doctors').catch(() => null)
        ]);

        // 1. All Departments for the top navigation bar
        let deptList = [];
        if (allDeptsRes?.data?.success && Array.isArray(allDeptsRes.data.data)) {
          deptList = allDeptsRes.data.data;
        } else {
          deptList = departmentsData || [];
        }
        setAllDepartments(deptList);

        // 2. Target Department
        let currentDept = null;
        if (singleDeptRes?.data?.success && singleDeptRes.data.data) {
          currentDept = singleDeptRes.data.data;
        } else {
          currentDept = deptList.find(
            (d) => d.id === id || d.code?.toLowerCase() === id?.toLowerCase()
          );
        }
        if (!currentDept && deptList.length > 0) {
          currentDept = deptList[0];
        }
        setDepartment(currentDept);

        // 3. Match Doctors to this Department
        let allDocs = [];
        if (allDocsRes?.data?.success && Array.isArray(allDocsRes.data.data)) {
          allDocs = allDocsRes.data.data;
        } else {
          allDocs = doctorsData || [];
        }

        const deptKey = (currentDept?.id || id || '').toLowerCase();
        const deptCode = (currentDept?.code || '').toLowerCase();
        const deptName = (currentDept?.name || '').toLowerCase();

        const matched = allDocs.filter((doc) => {
          const docDeptId = (doc.departmentId || '').toLowerCase();
          const docDeptName = (doc.departmentName || doc.department || '').toLowerCase();
          return (
            docDeptId === deptKey ||
            docDeptId === deptCode ||
            docDeptName.includes(deptName) ||
            deptName.includes(docDeptName)
          );
        });

        if (matched.length > 0) {
          setDepartmentDoctors(matched);
        } else {
          // If no specific match, show 3 doctors as in the reference design
          setDepartmentDoctors(allDocs.slice(0, 3));
        }
      } catch (err) {
        console.error('Error loading department detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#F4FBFD] py-20 px-4 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#018AAE] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-[70vh] bg-[#F4FBFD] py-20 px-4 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900">Department Not Found</h2>
          <p className="text-slate-500 text-xs">The requested medical specialty could not be found.</p>
          <Link
            to="/departments"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#018AAE] hover:bg-[#007595] text-white text-xs font-bold transition-all shadow-sm"
          >
            Explore Departments
          </Link>
        </div>
      </div>
    );
  }

  // Facilities list from data
  const facilitiesList = department.facilitiesOffered
    ? department.facilitiesOffered.split('\n').map((s) => s.trim()).filter(Boolean)
    : Array.isArray(department.features) && department.features.length > 0
    ? department.features
    : [
        'Advanced Adult Intensive Medical Care',
        'Comprehensive Diabetology & Metabolic Clinic',
        'Hypertension & Cardiovascular Risk Assessment',
        'Dedicated Geriatric & Elderly Care Protocols'
      ];

  // Key Services list from data
  const keyServicesList = Array.isArray(department.services) && department.services.length > 0
    ? department.services
    : typeof department.services === 'string' && department.services.trim()
    ? department.services.split('\n').map((s) => s.trim()).filter(Boolean)
    : [
        'General Medicine',
        'Diabetes Care',
        'Hypertension Management',
        'Preventive Health Checkups',
        'Fever & Pyrexia Clinical Workup'
      ];

  // About description
  const aboutText =
    department.description ||
    `Brahm Shakti Hospital's Department of ${department.name} is the clinical backbone of outpatient and inpatient diagnostics. Led by senior physician specialists, the department specializes in adult general health, metabolic syndrome, diabetic foot clinics, and fever triage. Our team adheres to stringent statutory medical standards to ensure precision and rapid recovery.`;

  return (
    <div className="min-h-screen bg-[#F4FBFD] text-slate-800 flex flex-col font-sans selection:bg-[#018AAE] selection:text-white overflow-x-hidden w-full max-w-full min-w-0">
      {/* ----------------- 1. SUB-HEADER / BREADCRUMB STRIP ----------------- */}
      <div className="bg-white border-b border-slate-100 py-2 sm:py-2.5 px-3 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2 text-xs w-full min-w-0">
          {/* Breadcrumb Left */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-slate-500 font-medium min-w-0 flex-1 overflow-hidden">
            <Link to="/" className="hover:text-[#018AAE] flex items-center gap-1 shrink-0">
              <Home className="w-3.5 h-3.5 text-[#018AAE]" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
            <Link to="/departments" className="hover:text-[#018AAE] shrink-0">
              <span className="hidden xs:inline">Departments</span>
              <span className="xs:hidden">Depts</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
            <span className="text-slate-800 font-bold truncate min-w-0 flex-1">
              {department.name}
            </span>
          </div>

          {/* Merged Right Utility Pill: Lab Result & Emergency (Inline, No Overlap) */}
          <div className="inline-flex items-center bg-white border border-slate-200/90 shadow-2xs rounded-xl divide-x divide-slate-100 overflow-hidden shrink-0">
            {/* 1. Lab Result (Redirects to Oncquest Online Lab Portal) */}
            <a
              href="https://itd.oncquest.net/oncquest/design/onlinelab"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-slate-700 hover:text-[#018AAE] hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            >
              <FlaskConical className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#018AAE] transition-transform group-hover:scale-110 shrink-0" />
              <span>Lab Result</span>
            </a>

            {/* 2. Emergency Trigger */}
            <a
              href="tel:7840089703"
              className="group flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50/60 transition-colors cursor-pointer shrink-0"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-600 transition-transform group-hover:scale-110 shrink-0" />
              <span>Emergency</span>
            </a>
          </div>
        </div>
      </div>

      {/* ----------------- 2. TOP HORIZONTAL DEPARTMENTS STRIP (WITH ICONS) ----------------- */}
      {/* Desktop & Tablet: Horizontal Grid/Scroll Bar */}
      <div className="hidden md:block bg-white border-b border-slate-200 shadow-2xs py-3 px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar w-full max-w-full">
        <div className="max-w-[1440px] mx-auto flex items-center gap-2.5 min-w-max">
          {allDepartments.map((dept) => {
            const isSelected = dept.id === department.id;
            return (
              <Link
                key={dept.id}
                to={`/departments/${dept.id}`}
                className={`flex flex-col items-center justify-center px-4 py-2.5 rounded-2xl transition-all text-center min-w-[110px] max-w-[140px] group ${
                  isSelected
                    ? 'bg-[#018AAE] text-white shadow-md shadow-[#018AAE]/25 scale-[1.02]'
                    : 'bg-white hover:bg-[#F0FBFC] border border-slate-200/90 text-slate-700 hover:text-[#018AAE] hover:border-[#0DAFD5]'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 transition-colors ${
                    isSelected ? 'text-white' : 'text-[#018AAE] group-hover:text-[#0DAFD5]'
                  }`}
                >
                  {getDepartmentIcon(dept.id, 'w-5 h-5')}
                </div>
                <span
                  className={`text-[11px] font-black leading-tight line-clamp-2 ${
                    isSelected ? 'text-white' : 'text-slate-800 group-hover:text-[#018AAE]'
                  }`}
                >
                  {dept.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile: Specialty Selector Dropdown (Exact match to Mobile View in uploaded image) */}
      <div className="md:hidden bg-white px-4 py-2.5 border-b border-slate-200 w-full max-w-full min-w-0">
        <div className="relative w-full min-w-0">
          <div className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 shadow-2xs min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="text-[#018AAE] shrink-0">
                {getDepartmentIcon(department.id, 'w-4 h-4')}
              </div>
              <span className="truncate">{department.name}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
          </div>
          <select
            value={department.id}
            onChange={(e) => navigate(`/departments/${e.target.value}`)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Select Hospital Department"
          >
            {allDepartments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ----------------- 3. MAIN CONTENT SECTION (MATCHING REFERENCE IMAGE) ----------------- */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 min-w-0">
        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full min-w-0">
          
          {/* ================= LEFT COLUMN: "OUR SPECIALISTS" CARD ================= */}
          <div className="lg:col-span-4 xl:col-span-4 w-full min-w-0">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden w-full min-w-0">
              {/* Card Header (Matches teal/ocean header in image) */}
              <div className="bg-[#018AAE] px-4 sm:px-5 py-3 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <h3 className="text-xs sm:text-sm font-black tracking-wide uppercase">
                    Our Specialists
                  </h3>
                </div>

                {/* Mobile Arrows for browsing doctors */}
                <div className="md:hidden flex items-center gap-1 text-white/80">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileDocIndex((prev) =>
                        prev > 0 ? prev - 1 : Math.max(0, departmentDoctors.length - 1)
                      )
                    }
                    className="p-1 hover:text-white"
                    aria-label="Previous Specialist"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileDocIndex((prev) =>
                        prev < departmentDoctors.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="p-1 hover:text-white"
                    aria-label="Next Specialist"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Specialists List / Carousel Content */}
              <div className="p-4 sm:p-5">
                {/* Desktop View: Grid of doctors (Matches 3 doctors in row in image) */}
                <div className="hidden sm:grid sm:grid-cols-3 gap-3">
                  {departmentDoctors.slice(0, 3).map((doc, idx) => {
                    const fallbackColors = [
                      'from-amber-100 to-rose-100',
                      'from-sky-100 to-teal-100',
                      'from-rose-100 to-pink-100'
                    ];
                    return (
                      <Link
                        key={doc.id || idx}
                        to={`/doctors/${doc.id}`}
                        className="group flex flex-col items-center text-center focus:outline-hidden"
                      >
                        {/* Doctor Photo Frame */}
                        <div
                          className={`w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-b ${
                            fallbackColors[idx % 3]
                          } border border-slate-100 shadow-2xs group-hover:shadow group-hover:border-[#018AAE] transition-all`}
                        >
                          <img
                            src={doc.image || '/assets/images/doctor_placeholder.svg'}
                            alt={doc.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = '/assets/images/doctor_placeholder.svg';
                            }}
                          />
                        </div>
                        {/* Doctor Name */}
                        <span className="text-[11px] font-bold text-slate-800 group-hover:text-[#018AAE] transition-colors mt-2 line-clamp-2 px-1 leading-snug">
                          {doc.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile View: 3 items flex row / slider (Matching mobile image) */}
                <div className="sm:hidden flex items-center justify-around gap-2 w-full min-w-0">
                  {departmentDoctors.slice(0, 3).map((doc, idx) => (
                    <Link
                      key={doc.id || idx}
                      to={`/doctors/${doc.id}`}
                      className="group flex flex-col items-center text-center w-1/3 min-w-0"
                    >
                      <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img
                          src={doc.image || '/assets/images/doctor_placeholder.svg'}
                          alt={doc.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.target.src = '/assets/images/doctor_placeholder.svg';
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 mt-1.5 line-clamp-2 leading-tight">
                        {doc.name}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Hospital Helpdesk & Queries (Direct match to reference) */}
                <div className="mt-5 pt-4 border-t border-slate-100 text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#018AAE]">
                    <PhoneCall className="w-3.5 h-3.5 text-[#018AAE]" />
                    <span>HOSPITAL HELPDESK &amp; QUERIES</span>
                  </div>
                  <div>
                    <a
                      href="tel:7982897603"
                      className="text-xs sm:text-sm font-black text-slate-800 hover:text-[#018AAE] transition-colors"
                    >
                      7982897603 / 8423934205 / 6388554517
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: DEPARTMENT READING CONTENT ================= */}
          <div className="lg:col-span-8 xl:col-span-8 w-full min-w-0 space-y-6">
            
            {/* Top Heading Section (Matches exact typography and teal bar in image) */}
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm overflow-hidden">
              {/* Faint Stethoscope/Medical Watermark Illustration on the right */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden sm:block">
                <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
                  <path
                    d="M30 60 C30 120 70 160 100 160 C130 160 170 120 170 60"
                    stroke="#018AAE"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="160" r="14" fill="#0DAFD5" />
                  <path d="M100 160v30" stroke="#018AAE" strokeWidth="10" />
                  <circle cx="100" cy="190" r="22" stroke="#018AAE" strokeWidth="8" fill="white" />
                </svg>
              </div>

              <div className="relative z-10 space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-[#0DAFD5]">
                  Department of
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#018AAE] tracking-tight leading-tight">
                  {department.name}
                </h1>

                {department.headOfDepartment && (
                  <div className="text-xs sm:text-sm font-semibold text-slate-700 pt-0.5">
                    <span className="text-slate-500 font-bold">Clinical Chairperson / Head: </span>
                    <span className="text-[#018AAE] font-extrabold">{department.headOfDepartment}</span>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-slate-600 pt-2 leading-relaxed max-w-2xl">
                  {department.shortDescription ||
                    'Comprehensive clinical diagnosis, outpatient consultation, emergency medical evaluation, and specialized care pathways.'}
                </p>
              </div>
            </div>

            {/* Content Card with Desktop View & Mobile Collapsible Accordion */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              {/* 1. About the Department (Desktop always open; Mobile collapsible accordion with +/- icon) */}
              <div className="space-y-2.5">
                {/* Mobile Accordion Header */}
                <button
                  type="button"
                  onClick={() => setAboutAccordionOpen(!aboutAccordionOpen)}
                  className="sm:hidden w-full flex items-center justify-between text-left py-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-[#018AAE]" />
                    <h2 className="text-sm font-black text-[#018AAE] tracking-tight">
                      About the Department
                    </h2>
                  </div>
                  <div className="text-[#018AAE]">
                    {aboutAccordionOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Desktop Section Header */}
                <div className="hidden sm:flex items-center gap-2">
                  <span className="w-1.5 h-4 rounded-full bg-[#018AAE]" />
                  <h2 className="text-base sm:text-lg font-black text-[#018AAE] tracking-tight">
                    About the Department
                  </h2>
                </div>

                {/* About Content: On mobile controlled by accordion, on desktop always visible */}
                <div className={`${aboutAccordionOpen ? 'block' : 'hidden'} sm:block`}>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify sm:text-left">
                    {aboutText}
                  </p>
                </div>
              </div>

              {/* 2. Grid of Facilities Offered & Key Services */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Facilities Offered */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-[#018AAE]" />
                    <h3 className="text-sm sm:text-base font-black text-[#018AAE] tracking-tight">
                      Facilities Offered
                    </h3>
                  </div>

                  <ul className="space-y-2">
                    {facilitiesList.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700">
                        <Check className="w-4 h-4 text-[#018AAE] stroke-[2.5] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Services */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-[#018AAE]" />
                    <h3 className="text-sm sm:text-base font-black text-[#018AAE] tracking-tight">
                      Key Services
                    </h3>
                  </div>

                  <ul className="space-y-2">
                    {keyServicesList.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700">
                        <Check className="w-4 h-4 text-[#018AAE] stroke-[2.5] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailPage;
