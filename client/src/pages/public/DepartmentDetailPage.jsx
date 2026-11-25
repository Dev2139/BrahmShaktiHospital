import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  PhoneCall,
  Calendar,
  Sparkles,
  Award,
  Stethoscope,
  ShieldCheck
} from 'lucide-react';
import api from '../../services/api';
import { departmentsData, doctorsData } from '../../data/seedData';

export const DepartmentDetailPage = () => {
  const { id } = useParams();

  const [department, setDepartment] = useState(null);
  const [departmentDoctors, setDepartmentDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchData = async () => {
      setLoading(true);
      try {
        const [singleDeptRes, allDocsRes] = await Promise.all([
          api.get(`/departments/${id}`).catch(() => null),
          api.get('/doctors').catch(() => null)
        ]);

        let currentDept = null;
        if (singleDeptRes?.data?.success && singleDeptRes.data.data) {
          currentDept = singleDeptRes.data.data;
        } else {
          // Fallback from seed data
          currentDept = (departmentsData || []).find(
            (d) => d.id === id || d.code?.toLowerCase() === id?.toLowerCase()
          );
        }
        setDepartment(currentDept);

        // Fetch doctors and match to this department
        let allDocs = [];
        if (allDocsRes?.data?.success && Array.isArray(allDocsRes.data.data)) {
          allDocs = allDocsRes.data.data;
        } else {
          allDocs = doctorsData || [];
        }

        const deptKey = currentDept?.id || id;
        const deptCode = currentDept?.code?.toLowerCase() || '';
        const deptName = currentDept?.name?.toLowerCase() || '';

        const matched = allDocs.filter((doc) => {
          const docDeptId = (doc.departmentId || '').toLowerCase();
          const docDeptName = (doc.departmentName || doc.department || '').toLowerCase();
          return (
            docDeptId === deptKey.toLowerCase() ||
            docDeptId === deptCode ||
            docDeptName.includes(deptName) ||
            deptName.includes(docDeptName)
          );
        });

        // If no direct matches, show departmental doctors or first few clinical doctors
        if (matched.length > 0) {
          setDepartmentDoctors(matched);
        } else {
          const fallbackMatches = allDocs.filter((doc) =>
            doc.departmentId === 'medicine' || doc.departmentId === 'anesthesia'
          );
          setDepartmentDoctors(fallbackMatches.length > 0 ? fallbackMatches : allDocs.slice(0, 8));
        }
      } catch (err) {
        console.error('Error fetching department details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#F4F8FA] py-16 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#018AAE] border-t-transparent rounded-full animate-spin"></div>
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#018AAE] text-white text-xs font-bold shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Departments</span>
          </Link>
        </div>
      </div>
    );
  }

  // Format facilities list
  const facilitiesList = department.facilitiesOffered
    ? department.facilitiesOffered.split('\n').map((s) => s.trim()).filter(Boolean)
    : (Array.isArray(department.features) && department.features.length > 0
        ? department.features
        : [
            'Dedicated Outpatient & Inpatient Clinical Suites',
            'Full Diagnostic and Multi-disciplinary Referral Support',
            'Advanced Patient Monitoring & Sterile Treatment Rooms',
            'Round-the-clock Emergency Casualty & Critical Care Backup'
          ]);

  // Format services list
  const servicesList = Array.isArray(department.services) && department.services.length > 0
    ? department.services
    : (typeof department.services === 'string' && department.services.trim()
        ? department.services.split('\n').map((s) => s.trim()).filter(Boolean)
        : [
            'Specialized Diagnostic Evaluation & Comprehensive Workup',
            'Evidence-based Medical Management & Prescription Reviews',
            'Preventive Screenings & Longitudinal Health Protocols',
            'Inter-departmental Consultation for Complex Systemic Pathologies'
          ]);

  // Format about paragraphs
  const aboutParagraphs = department.description
    ? department.description.split('\n\n').filter(Boolean)
    : [
        `The clinical and academic milieu at Brahm Shakti Hospital is nurtured and promoted by the Department of ${department.name} under the leadership of our senior faculty and Board of Medical Management. Over the years, the department has grown into a comprehensive center of clinical excellence, entrusted with delivering patient-first recovery and precision care.`,
        `Coordinating the clinical, outpatient, and inpatient programs of the hospital, our medical consultants adhere to stringent healthcare guidelines established by national statutory bodies. Periodic clinical audits, peer reviews, and multi-disciplinary case conferences ensure that high safety and quality standards are maintained across every case.`,
        `The consultants and clinical staff are actively engaged in patient counseling, preventive health guidance, and emergency coverage, fulfilling Brahm Shakti Hospital’s mission of clinical excellence with compassion, dignity, and integrity.`
      ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-[#F8FAFC] border-b border-slate-200/80 py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link to="/" className="text-[#018AAE] hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/departments" className="text-slate-500 hover:text-[#018AAE]">
            Departments
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-bold">{department.name}</span>
        </div>
      </div>

      {/* Main Layout Matching Reference Images (Left: Specialists Doctors Grid ONLY | Right: Detailed Reading Content) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Specialists Doctor List ONLY (Matches Image 2 & 3) */}
          <aside className="lg:col-span-4 xl:col-span-4 space-y-4">
            <div className="border-b-2 border-[#018AAE] pb-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#018AAE] tracking-tight">
                Specialists
              </h2>
            </div>

            {departmentDoctors.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No specialists listed for this department.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 gap-3.5 sm:gap-4 pt-2">
                {departmentDoctors.map((doc) => (
                  <Link
                    key={doc.id}
                    to={`/doctors/${doc.id}`}
                    className="group flex flex-col items-center text-center focus:outline-hidden"
                    title={`View profile of ${doc.name}`}
                  >
                    {/* Doctor Portrait Photo */}
                    <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs group-hover:shadow-md group-hover:border-[#018AAE] transition-all">
                      <img
                        src={doc.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600'}
                        alt={doc.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600';
                        }}
                      />
                    </div>
                    {/* Doctor Name (No prices, clean layout) */}
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#018AAE] transition-colors mt-2 line-clamp-2 px-1">
                      {doc.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* Quick Contact Desk */}
            <div className="mt-8 pt-4 border-t border-slate-200 space-y-1.5 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Hospital Helpdesk &amp; Queries
              </span>
              <a
                href="tel:01127531683"
                className="text-slate-800 font-bold hover:text-[#018AAE] flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#018AAE]" />
                <span>011-27531683 / 7840089703</span>
              </a>
            </div>
          </aside>

          {/* Right Main Column: Reading Narrative (Matches Image 2 & 3) */}
          <section className="lg:col-span-8 xl:col-span-8 space-y-6 sm:space-y-8">
            {/* Department Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#018AAE] tracking-tight leading-tight">
                Department of {department.name}
              </h1>
              {department.headOfDepartment && (
                <div className="mt-2 text-xs sm:text-sm font-semibold text-slate-600">
                  <span className="text-[#018AAE] font-bold">Clinical Chairperson / Head: </span>
                  <span>{department.headOfDepartment}</span>
                </div>
              )}
            </div>

            {/* Clinical Overview / Lead Paragraph */}
            {department.shortDescription && (
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                {department.shortDescription}
              </p>
            )}

            {/* About the Department Section */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#018AAE] tracking-tight">
                About the Department
              </h2>
              <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-3.5">
                {aboutParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {/* State-of-the-art Techniques (if present) */}
            {department.techniques && (
              <div className="space-y-3 pt-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#018AAE] tracking-tight">
                  State-of-the-art Techniques
                </h2>
                <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                  {department.techniques}
                </div>
              </div>
            )}

            {/* Facilities Offered Section */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#018AAE] tracking-tight">
                Facilities Offered
              </h2>
              <div className="space-y-2.5">
                {facilitiesList.map((facility, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#018AAE] mt-2 shrink-0" />
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                      {facility}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Services Section */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#018AAE] tracking-tight">
                Key Services
              </h2>
              <div className="space-y-3">
                {servicesList.map((srv, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-[#018AAE] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                      {srv}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Consultation Call-to-Action (No OPD fees mentioned) */}
            <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#018AAE] to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-black">
                  Schedule a Consultation with {department.name} Specialists
                </h3>
                <p className="text-xs text-slate-200">
                  Book direct digital slots with senior hospital faculty. Zero waiting time at the OPD desk.
                </p>
              </div>

              <Link
                to={`/bookappointment?department=${department.id}`}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md shrink-0 cursor-pointer"
              >
                Book an Appointment
              </Link>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default DepartmentDetailPage;