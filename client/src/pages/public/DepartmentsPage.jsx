import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Clock,
  Sparkles,
  Stethoscope,
  Eye,
  Baby,
  Ear,
  Activity,
  Heart,
  Droplet,
  Grid,
  RotateCcw
} from 'lucide-react';
import api from '../../services/api';
import { departmentsData } from '../../data/seedData';

// Department Icon Resolver (Matches Image 2 & DepartmentDetailPage)
const getDepartmentIcon = (deptId, className = 'w-5 h-5') => {
  const id = (deptId || '').toLowerCase();
  if (id === 'all') {
    return <Grid className={className} />;
  }
  if (id.includes('medicine') || id.includes('internal')) {
    return <Stethoscope className={className} />;
  }
  if (id.includes('surg') || id.includes('general')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 6v12M6 12h12" />
        <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
      </svg>
    );
  }
  if (id.includes('ortho') || id.includes('bone') || id.includes('joint')) {
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
  if (id.includes('eye') || id.includes('ophthalm')) {
    return <Eye className={className} />;
  }
  if (id.includes('gynae') || id.includes('obst') || id.includes('mater')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="5" r="3" />
        <path d="M9 10a5 5 0 0 1 6 0v7a3 3 0 0 1-6 0z" />
      </svg>
    );
  }
  if (id.includes('skin') || id.includes('derma')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2C8 6 6 10 6 14a6 6 0 0 0 12 0c0-4-2-8-6-12z" />
        <path d="M12 12v5" />
      </svg>
    );
  }
  if (id.includes('ent') || id.includes('ear') || id.includes('throat')) {
    return <Ear className={className} />;
  }
  if (id.includes('ped') || id.includes('child') || id.includes('baby')) {
    return <Baby className={className} />;
  }
  if (id.includes('anaesth') || id.includes('critical')) {
    return <Activity className={className} />;
  }
  return <Activity className={className} />;
};

export const DepartmentsPage = () => {
  const [departments, setDepartments] = useState(departmentsData || []);
  const [loading, setLoading] = useState(true);
  const [selectedDeptId, setSelectedDeptId] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const iconStripRef = useRef(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments');
        if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
          setDepartments(res.data.data);
        } else {
          setDepartments(departmentsData);
        }
      } catch (err) {
        console.warn('Error fetching departments, using seed data fallback:', err);
        setDepartments(departmentsData);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const categories = ['all', 'Clinical Specialties', 'Surgical Specialties', 'Critical Services'];

  // Scroll controls for horizontal department icon strip (Matches Image 2)
  const scrollIconStrip = (direction) => {
    if (iconStripRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      iconStripRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filter departments by selected icon card and category
  const filteredDepts = departments.filter((d) => {
    if (selectedDeptId !== 'all' && d.id !== selectedDeptId) {
      return false;
    }
    if (selectedCategory !== 'all' && d.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const activeDepartmentObj = departments.find((d) => d.id === selectedDeptId);

  return (
    <div className="min-h-screen bg-[#F0FBFC] space-y-6 sm:space-y-10 pb-20">
      {/* 1. Hero Banner with Provided Medical Background Texture & Clinical Stethoscope Visual */}
      <section
        className="relative border-b border-slate-200/80 pt-8 pb-10 sm:py-12 md:py-14 px-4 sm:px-6 lg:px-8 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(240, 251, 252, 0.94) 0%, rgba(240, 251, 252, 0.82) 50%, rgba(240, 251, 252, 0.92) 100%), url('/assets/images/medical_bg_1.jpg')`
        }}
      >
        {/* Soft Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#018AAE]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-cyan-200/25 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-10 relative z-10">
          {/* Left Text Column */}
          <div className="space-y-3.5 max-w-2xl flex-1 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-[#018AAE] border border-[#B6EEF6] text-xs font-bold uppercase tracking-wider shadow-2xs backdrop-blur-xs">
              <Building2 className="w-3.5 h-3.5 text-[#018AAE]" />
              <span>Clinical Departments</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0B2545] tracking-tight leading-tight">
              Hospital Departments &amp; Clinical Centers
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal max-w-xl">
              Explore Brahm Shakti Hospital's 9 core clinical departments offering comprehensive outpatient consultation, day-care procedures, and inpatient tertiary surgical care.
            </p>
          </div>

          {/* Right Visual: Stethoscope with Medical Plus Accents */}
          <div className="relative w-full md:w-auto md:shrink-0 flex items-center justify-center md:justify-end">
            <div className="relative w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[360px] md:max-w-[380px] lg:max-w-[420px] aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-xs border border-teal-100/90 bg-white/80 backdrop-blur-xs flex items-center justify-center group">
              {/* Floating Teal Medical Plus Background Accents */}
              <div className="absolute top-2.5 left-4 text-teal-300/70 font-black text-2xl select-none">+</div>
              <div className="absolute top-3 right-8 text-teal-400/60 font-black text-3xl select-none">+</div>
              <div className="absolute bottom-3 left-1/4 text-teal-200/80 font-black text-xl select-none">+</div>

              {/* Realistic Clinical Stethoscope Image */}
              <img
                src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80&w=800"
                alt="Brahm Shakti Hospital Clinical Stethoscope"
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 select-none"
              />

              {/* Gentle gradient wash for seamless integration */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-teal-900/5 to-teal-50/30 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Horizontal Department Icon Cards Filter Strip (Exact match to Image 2 pattern) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200/90 shadow-2xs p-2 sm:p-2.5 mb-6">
          <div className="flex items-center gap-2">
            {/* Scroll Left Button (<) */}
            <button
              type="button"
              onClick={() => scrollIconStrip('left')}
              aria-label="Scroll departments left"
              className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-slate-50 hover:bg-[#EBF8FA] border border-slate-200/90 text-slate-600 hover:text-[#018AAE] flex items-center justify-center shrink-0 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </button>

            {/* Horizontally Scrollable Department Cards */}
            <div
              ref={iconStripRef}
              className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1 flex-1"
            >
              {/* "All Departments" Card */}
              <button
                type="button"
                onClick={() => setSelectedDeptId('all')}
                className={`flex flex-col items-center justify-center px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl transition-all text-center min-w-[110px] sm:min-w-[125px] max-w-[140px] shrink-0 cursor-pointer group ${
                  selectedDeptId === 'all'
                    ? 'bg-[#018AAE] text-white shadow-md shadow-[#018AAE]/25 scale-[1.02]'
                    : 'bg-white hover:bg-[#F0FBFC] border border-slate-200/90 text-slate-700 hover:text-[#018AAE] hover:border-[#0DAFD5]'
                }`}
              >
                <div
                  className={`w-7 sm:w-8 h-7 sm:h-8 rounded-xl flex items-center justify-center mb-1 transition-colors ${
                    selectedDeptId === 'all' ? 'text-white' : 'text-[#018AAE] group-hover:text-[#0DAFD5]'
                  }`}
                >
                  <Grid className="w-4 sm:w-5 h-4 sm:h-5" />
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-black leading-tight line-clamp-2 ${
                    selectedDeptId === 'all' ? 'text-white' : 'text-slate-800 group-hover:text-[#018AAE]'
                  }`}
                >
                  All Departments
                </span>
              </button>

              {/* 9 Department Cards */}
              {departments.map((dept) => {
                const isSelected = selectedDeptId === dept.id;
                return (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => setSelectedDeptId(dept.id)}
                    className={`flex flex-col items-center justify-center px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl transition-all text-center min-w-[115px] sm:min-w-[130px] max-w-[145px] shrink-0 cursor-pointer group ${
                      isSelected
                        ? 'bg-[#018AAE] text-white shadow-md shadow-[#018AAE]/25 scale-[1.02]'
                        : 'bg-white hover:bg-[#F0FBFC] border border-slate-200/90 text-slate-700 hover:text-[#018AAE] hover:border-[#0DAFD5]'
                    }`}
                  >
                    <div
                      className={`w-7 sm:w-8 h-7 sm:h-8 rounded-xl flex items-center justify-center mb-1 transition-colors ${
                        isSelected ? 'text-white' : 'text-[#018AAE] group-hover:text-[#0DAFD5]'
                      }`}
                    >
                      {getDepartmentIcon(dept.id, 'w-4 sm:w-5 h-4 sm:h-5')}
                    </div>
                    <span
                      className={`text-[11px] sm:text-xs font-black leading-tight line-clamp-2 ${
                        isSelected ? 'text-white' : 'text-slate-800 group-hover:text-[#018AAE]'
                      }`}
                    >
                      {dept.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Right Button (>) */}
            <button
              type="button"
              onClick={() => scrollIconStrip('right')}
              aria-label="Scroll departments right"
              className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-slate-50 hover:bg-[#EBF8FA] border border-slate-200/90 text-slate-600 hover:text-[#018AAE] flex items-center justify-center shrink-0 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Active Filter Status Bar */}
        {selectedDeptId !== 'all' && activeDepartmentObj && (
          <div className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-teal-100 shadow-2xs mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filtered by:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF8FA] text-[#018AAE] text-xs font-black">
                {getDepartmentIcon(activeDepartmentObj.id, 'w-3.5 h-3.5')}
                <span>{activeDepartmentObj.name}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDeptId('all')}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-[#018AAE] cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Show All Departments</span>
            </button>
          </div>
        )}

        {/* 3. Department Cards Bento Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : filteredDepts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/90 space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No departments match the selected filter</h3>
            <button
              type="button"
              onClick={() => { setSelectedDeptId('all'); setSelectedCategory('all'); }}
              className="px-4 py-2 rounded-xl bg-[#018AAE] text-white text-xs font-bold hover:bg-[#007595] transition-colors"
            >
              View All Departments
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredDepts.map((dept) => {
              const code = dept.code || (dept.id ? dept.id.slice(0, 4).toUpperCase() : 'DEPT');
              const fee = dept.consultationCharges || 800;

              return (
                <div
                  key={dept.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container with Floating Dark Navy Category Badge */}
                    <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                      <img
                        src={dept.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'}
                        alt={dept.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-lg bg-[#0B2545]/90 text-white backdrop-blur-xs text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs">
                        {dept.category || 'Clinical Specialties'}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 space-y-2">
                      {/* Meta Row: Department Code & Consultation Fee */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black tracking-wider text-[#018AAE] uppercase">
                          {code}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          Fee: <strong className="text-[#018AAE] font-black text-sm">₹{fee}</strong>
                        </span>
                      </div>

                      {/* Department Name */}
                      <h3 className="text-lg sm:text-xl font-black text-[#0B2545] tracking-tight group-hover:text-[#018AAE] transition-colors leading-snug">
                        {dept.name}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2">
                        {dept.shortDescription || dept.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0">
                    <Link
                      to={`/departments/${dept.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#018AAE] text-[#018AAE] hover:bg-[#018AAE] hover:text-white text-xs sm:text-sm font-bold transition-all shadow-2xs group/btn"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default DepartmentsPage;
