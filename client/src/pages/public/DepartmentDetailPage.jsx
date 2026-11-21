import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  Stethoscope,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  ArrowLeft,
  Search,
  BookOpen,
  Award,
  Users,
  Building2,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { departmentsData, doctorsData } from '../../data/seedData';

export const DepartmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allDepartments, setAllDepartments] = useState(departmentsData || []);
  const [department, setDepartment] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState('');

  // Fetch all departments & active department data
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchData = async () => {
      setLoading(true);
      try {
        const [deptListRes, singleDeptRes, docRes] = await Promise.all([
          api.get('/departments').catch(() => null),
          api.get(`/departments/${id}`).catch(() => null),
          api.get(`/doctors?department=${id}`).catch(() => null)
        ]);

        if (deptListRes?.data?.success && Array.isArray(deptListRes.data.data)) {
          setAllDepartments(deptListRes.data.data);
        }

        if (singleDeptRes?.data?.success && singleDeptRes.data.data) {
          setDepartment(singleDeptRes.data.data);
        } else {
          // Fallback from seed data
          const found = (departmentsData || []).find((d) => d.id === id);
          if (found) setDepartment(found);
        }

        if (docRes?.data?.success && Array.isArray(docRes.data.data)) {
          setDoctors(docRes.data.data);
        } else {
          // Fallback doctors from seed data
          const matchedDocs = (doctorsData || []).filter((d) => d.departmentId === id);
          setDoctors(matchedDocs);
        }
      } catch (err) {
        console.error('Error fetching department details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Filtered sidebar departments
  const filteredSidebarDepts = allDepartments.filter((d) =>
    d.name?.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#F4F8FA] py-16 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#0A7A74] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-[70vh] bg-[#F4F8FA] py-20 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-soft text-center space-y-4">
          <h2 className="text-2xl font-black text-slate-900">Department Not Found</h2>
          <p className="text-slate-500 text-xs">The requested medical specialty could not be located.</p>
          <Link
            to="/departments"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A7A74] text-white text-xs font-bold shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Departments</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F8FA] pb-20">
      {/* Refined Medical Breadcrumb & Title Banner */}
      <section className="relative bg-gradient-to-b from-teal-50/70 via-emerald-50/30 to-[#F8FAFC] border-b border-slate-200/80 py-8 sm:py-12 px-4 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0A7A74]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-2.5 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Link to="/" className="text-[#0A7A74] hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Hospital Home</span>
            </Link>
            <span>/</span>
            <Link to="/departments" className="text-slate-500 hover:text-[#0A7A74]">
              Departments
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">{department.name}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="px-3 py-1 rounded-full bg-[#0A7A74]/10 border border-[#0A7A74]/20 text-[#0A7A74] text-xs font-bold uppercase tracking-wider">
              {department.category || 'Clinical Specialty'}
            </span>
            {department.code && (
              <span className="text-xs font-bold text-slate-500">Code: {department.code}</span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {department.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            {department.shortDescription || department.description}
          </p>
        </div>
      </section>

      {/* Main Grid Matching Image 2: Left Department Sidebar + Right Reading Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar (Matches Image 2 exactly) */}
          <aside className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-soft space-y-6">
            {/* Specialists Header Link */}
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <Link
                to="/doctors"
                className="text-base sm:text-lg font-black text-[#0A7A74] hover:underline flex items-center gap-1.5"
              >
                <Users className="w-4 h-4" />
                <span>Specialists Roster →</span>
              </Link>
            </div>

            {/* Departments Heading & Live Search */}
            <div className="space-y-3">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Departments
              </h2>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  placeholder="Search Department e.g. Medicine"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#0A7A74]"
                />
              </div>
            </div>

            {/* Department Navigation List (Pills with Bullet Point) */}
            <nav className="space-y-1 max-h-[560px] overflow-y-auto pr-1">
              {filteredSidebarDepts.map((d) => {
                const isActive = d.id === department.id;
                return (
                  <Link
                    key={d.id}
                    to={`/departments/${d.id}`}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-[#0A7A74] text-white shadow-sm'
                        : 'text-slate-700 hover:text-[#0A7A74] hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-white' : 'bg-slate-400'}`} />
                    <span className="truncate">{d.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Quick Contact Box */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Direct OPD Helpdesk
              </span>
              <a
                href="tel:01127531683"
                className="text-slate-800 font-bold hover:text-[#0A7A74] flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#0A7A74]" />
                <span>011-27531683 / 7840089703</span>
              </a>
            </div>
          </aside>

          {/* Right Main Detailed Narrative Area (Matches Image 2) */}
          <main className="lg:col-span-8 space-y-8">
            {/* Primary Department Narrative & Academic Framework */}
            <article className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-soft space-y-6">
              {/* Department Lead Header */}
              <div className="pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0A7A74] block">
                    Clinical Governance &amp; Care
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                    {department.name}
                  </h2>
                </div>

                {department.headOfDepartment && (
                  <div className="px-3.5 py-2 rounded-2xl bg-teal-50 border border-teal-100 text-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Clinical Chairperson</span>
                    <strong className="text-slate-900 font-bold">{department.headOfDepartment}</strong>
                  </div>
                )}
              </div>

              {/* Detailed Reading Paragraphs (Structured Matching Image 2) */}
              <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
                <p>
                  The clinical and academic milieu at Brahm Shakti Hospital is nurtured and promoted by the Department of {department.name} under the leadership of our senior faculty and Board of Medical Management. Started as a core clinical foundation under the stewardship of Brahm Shakti Trust, the department has grown into a full-fledged tertiary care center of excellence, entrusted with delivering patient-first recovery and precision diagnosis.
                </p>

                <p>
                  Coordinating the clinical and outpatient care programs of the department, our medical faculty adheres to stringent clinical guidelines established by national statutory bodies. Periodic clinical audits, mortality and morbidity reviews, and multi-disciplinary case conferences ensure that quality standards are maintained across every inpatient admission and outpatient consultation.
                </p>

                <p>
                  Arranging regular academic lectures, surgical clinical demonstrations, and symposia by visiting national faculty, the department has had the privilege of hosting recognized senior specialists. This academic exposure ensures that resident doctors, nursing staff, and technicians remain abreast of international best practices, pharmacological advancements, and modern diagnostic algorithms.
                </p>

                {/* Bulleted Clinical Research & CME Tasks */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0A7A74] mt-2 shrink-0" />
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Encouraging academic activities in the hospital such as conducting clinical case discussions, evidence-based workshops, and participation in state and national medical conferences.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0A7A74] mt-2 shrink-0" />
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Ensuring that all clinical consultants and residents complete certified Continuing Medical Education (CME) hours recognized by the Delhi Medical Council (DMC) for continuous professional excellence.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0A7A74] mt-2 shrink-0" />
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Providing compassionate, subsidized healthcare under charitable trust tariffs, ensuring high-tech tertiary clinical care remains accessible to all families in North-West Delhi.
                    </p>
                  </div>
                </div>

                <p className="pt-2">
                  The consultants and clinical fellows are actively engaged in patient counseling, ethical care standards, and round-the-clock emergency casualty coverage, fulfilling Brahm Shakti Hospital’s commitment to healthcare with compassion, dignity, and integrity.
                </p>
              </div>

              {/* Procedures & Services Badges */}
              {department.services && department.services.length > 0 && (
                <div className="pt-6 border-t border-slate-100 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0A7A74]" />
                    <span>Specialized Procedures Performed</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {department.services.map((srv, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0A7A74] shrink-0" />
                        <span>{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Consultant Specialists Roster in this Department */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Consultant Doctors in {department.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    DMC verified senior clinicians available for daily OPD consultations
                  </p>
                </div>
              </div>

              {doctors.length === 0 ? (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
                  General OPD faculty available daily. Please visit the hospital registration desk.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-soft flex flex-col justify-between group hover:border-[#0A7A74]/50 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={doctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600'}
                          alt={doctor.name}
                          className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600';
                          }}
                        />
                        <div className="min-w-0 space-y-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block ${
                            doctor.category === 'Visiting' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {doctor.category || 'In house'}
                          </span>
                          <h4 className="font-bold text-slate-900 text-base leading-snug">{doctor.name}</h4>
                          <p className="text-xs text-[#0A7A74] font-semibold">{doctor.designation}</p>
                          <p className="text-[11px] text-slate-500">{doctor.qualification}</p>
                          <div className="pt-1 flex items-center justify-between text-xs font-bold text-slate-700">
                            <span>Fee: <strong className="text-[#0A7A74]">₹{doctor.consultationFee || 700}</strong></span>
                            {doctor.dmcNo && <span className="text-[10px] text-slate-400 font-mono">DMC #{doctor.dmcNo}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                        <Link
                          to={`/doctors/${doctor.id}`}
                          className="flex-1 py-2 text-center rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                        >
                          Profile
                        </Link>
                        <Link
                          to={`/consultation?doctor=${doctor.id}&department=${department.id}`}
                          className="flex-1 py-2 text-center rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs font-bold transition-all shadow-xs"
                        >
                          Book Slot
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Subsidized Trust Tariffs Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-[#0A7A74] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Trust Subsidized OPD
                </span>
                <h3 className="text-xl sm:text-2xl font-black">
                  ₹{department.consultationCharges || 700} Consultation Fee
                </h3>
                <p className="text-xs text-slate-200">
                  Charitable hospital tariff under Brahm Shakti Trust (Regd.) with zero hidden charges.
                </p>
              </div>

              <Link
                to={`/consultation?department=${department.id}`}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md shrink-0 cursor-pointer"
              >
                Book OPD Consultation
              </Link>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
};

export default DepartmentDetailPage;
