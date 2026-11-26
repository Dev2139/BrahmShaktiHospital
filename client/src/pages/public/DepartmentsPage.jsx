import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ArrowRight,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { departmentsData } from '../../data/seedData';

export const DepartmentsPage = () => {
  const [departments, setDepartments] = useState(departmentsData || []);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const filterScrollRef = useRef(null);

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

  const filteredDepts = selectedCategory === 'all'
    ? departments
    : departments.filter((d) => d.category === selectedCategory);

  const scrollFilterRight = () => {
    if (filterScrollRef.current) {
      filterScrollRef.current.scrollBy({ left: 160, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FBFC] space-y-8 sm:space-y-12 pb-20">
      {/* 1. Hero Banner with Medical Wave & Stethoscope Visual (Matches Image 2 & 3) */}
      <section className="relative bg-gradient-to-r from-teal-50/80 via-emerald-50/40 to-cyan-50/60 border-b border-slate-200/80 pt-8 pb-10 sm:py-12 md:py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Soft Ambient Glows & Medical Plus Accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#018AAE]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-10 relative z-10">
          {/* Left Text Column */}
          <div className="space-y-3.5 max-w-2xl flex-1 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FBFC] text-[#018AAE] border border-[#B6EEF6]/80 text-xs font-bold uppercase tracking-wider shadow-2xs">
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

          {/* Right Visual: Stethoscope with Medical Plus Accents (Matches Image 2 & 3) */}
          <div className="relative w-full md:w-auto md:shrink-0 flex items-center justify-center md:justify-end">
            <div className="relative w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[360px] md:max-w-[380px] lg:max-w-[420px] aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-xs border border-teal-100/90 bg-white/70 backdrop-blur-xs flex items-center justify-center group">
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

      {/* 2. Main Grid with Category Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Pills with Mobile Scroll Control (Matches Image 2 & 3) */}
        <div className="flex items-center gap-2 mb-8 sm:mb-10">
          <div
            ref={filterScrollRef}
            className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1 flex-1"
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#018AAE] text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-200/90 hover:border-[#018AAE] hover:text-[#018AAE] shadow-2xs'
                  }`}
                >
                  {cat === 'all' ? 'All Departments' : cat}
                </button>
              );
            })}
          </div>

          {/* Mobile Scroll Arrow Button (Matches Image 3) */}
          <button
            type="button"
            onClick={scrollFilterRight}
            aria-label="Scroll categories right"
            className="sm:hidden w-9 h-9 rounded-full bg-white border border-slate-200/90 text-slate-600 flex items-center justify-center shrink-0 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        {/* 3. Department Cards Bento Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
            ))}
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

                  {/* Bottom Action Button (Matches Image 2 & Image 3) */}
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
