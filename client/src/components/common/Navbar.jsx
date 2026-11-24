import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  PhoneCall,
  Calendar,
  User,
  Menu,
  X,
  ChevronDown,
  Stethoscope,
  Building2,
  Search,
  FlaskConical,
  AlertTriangle,
  Zap,
  Droplets,
  Heart,
  FileText,
  Hospital,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { departmentsData, doctorsData } from '../../data/seedData';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [quickSearchModalOpen, setQuickSearchModalOpen] = useState(false);
  const [searchDept, setSearchDept] = useState('');
  const [searchDoctor, setSearchDoctor] = useState('');

  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isStaff, dashboardPath } = useAuth();

  const toggleMobileDropdown = (name) => {
    setMobileOpenDropdown((prev) => (prev === name ? null : name));
  };

  // Close open dropdowns and popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
        setEmergencyModalOpen(false);
        setQuickSearchModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter doctors by selected department in Quick Search
  const filteredDoctors = React.useMemo(() => {
    if (!searchDept) return doctorsData;
    return doctorsData.filter(
      (d) => d.departmentId === searchDept || d.department?.toLowerCase() === searchDept.toLowerCase()
    );
  }, [searchDept]);

  const handleQuickSearchSubmit = (e) => {
    e.preventDefault();
    setQuickSearchModalOpen(false);
    if (searchDoctor) {
      navigate(`/doctors?search=${encodeURIComponent(searchDoctor)}`);
    } else if (searchDept) {
      navigate(`/departments/${searchDept}`);
    } else {
      navigate('/doctors');
    }
  };

  // Dropdown menus (label -> items)
  const menus = {
    'Speciality': {
      match: ['/departments', '/doctors'],
      items: [
        { label: 'Departments', sub: 'Explore clinical departments', path: '/departments', icon: Building2 },
        { label: 'Doctors', sub: 'Find consultant specialist by name', path: '/doctors', icon: Stethoscope }
      ]
    },
    'About Us': {
      match: ['/about', '/facilities', '/services', '/search'],
      items: [
        { label: 'About the Hospital', sub: 'Heritage, mission & leadership', path: '/about', icon: Hospital },
        { label: 'Facilities & Diagnostics', sub: 'Labs, CT Scan & infrastructure', path: '/facilities', icon: FlaskConical },
        { label: 'Lab Test Results', sub: 'Online Oncquest Diagnostic Portal', path: 'https://itd.oncquest.net/oncquest/design/onlinelab', isExternal: true, icon: FileText },
        { label: 'Quick Search', sub: 'Search doctors, departments & services', path: '/search', icon: Search },
        { label: 'OPD Clinical Services', sub: 'Outpatient clinics & schedules', path: '/services/opd', icon: Stethoscope },
        { label: 'IPD Inpatient Care', sub: 'Rooms, ICU & admissions', path: '/services/ipd', icon: Building2 }
      ]
    }
  };

  const plainLinks = [
    { label: 'Contact Us', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isMenuActive = (menu) => menu.match.some((m) => location.pathname.startsWith(m));

  const navLinkClass = (active) =>
    `flex items-center gap-1.5 px-4 py-2 rounded-xl text-[15px] font-bold transition-all select-none ${
      active
        ? 'text-primary bg-primary-50 ring-1 ring-primary/20'
        : 'text-secondary hover:text-primary hover:bg-slate-100/80'
    }`;

  const appointmentTarget = '/bookappointment';

  return (
    <header ref={navRef} className="sticky top-0 z-50 w-full bg-white shadow-md transition-shadow">
      {/* Main White Navbar */}
      <nav className="bg-medical-white px-3 sm:px-6 py-2.5 sm:py-3 border-b border-medical-border/60">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          {/* Left: Hospital Logo (Wider and prominent) */}
          <div className="flex-1 flex items-center justify-start min-w-0">
            <Link to="/" className="flex items-center group shrink-0" aria-label="Brahm Shakti Hospital Home">
              <img
                src="https://res.cloudinary.com/urzka7oz/image/upload/v1795244093/WhatsApp_Image_2026-11-20_at_10.36.32_PM-removebg-preview.png"
                alt="Brahm Shakti Hospital"
                className="h-11 sm:h-13 md:h-15 lg:h-16 w-auto max-w-[240px] sm:max-w-[300px] md:max-w-[360px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                loading="eager"
              />
            </Link>
          </div>

          {/* Centered Navigation: Speciality, About Us, Find a Doctor, Search by Department, Quick Search, Contact Us */}
          <div className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 shrink-0">
            {/* 1. Speciality Dropdown */}
            {(() => {
              const label = 'Speciality';
              const menu = menus[label];
              const active = isMenuActive(menu);
              const isOpen = openMenu === label;
              return (
                <div key={label} className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(isOpen ? null : label);
                      setEmergencyModalOpen(false);
                      setQuickSearchModalOpen(false);
                    }}
                    className={`${navLinkClass(active || isOpen)} whitespace-nowrap cursor-pointer select-none`}
                  >
                    <span>{label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-elevated border border-medical-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      {menu.items.map((item) => {
                        const Icon = item.icon;
                        if (item.isExternal || item.path?.startsWith('http')) {
                          return (
                            <a
                              key={item.label + item.path}
                              href={item.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setOpenMenu(null)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:bg-primary-50 hover:text-primary transition-colors"
                            >
                              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                                <Icon className="w-4 h-4 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold leading-tight truncate">{item.label}</div>
                                <div className="text-[11px] text-medical-muted truncate">{item.sub}</div>
                              </div>
                            </a>
                          );
                        }
                        return (
                          <Link
                            key={item.label + item.path}
                            to={item.path}
                            onClick={() => setOpenMenu(null)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:bg-primary-50 hover:text-primary transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold leading-tight truncate">{item.label}</div>
                              <div className="text-[11px] text-medical-muted truncate">{item.sub}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 2. About Us Dropdown */}
            {(() => {
              const label = 'About Us';
              const menu = menus[label];
              const active = isMenuActive(menu);
              const isOpen = openMenu === label;
              return (
                <div key={label} className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(isOpen ? null : label);
                      setEmergencyModalOpen(false);
                      setQuickSearchModalOpen(false);
                    }}
                    className={`${navLinkClass(active || isOpen)} whitespace-nowrap cursor-pointer select-none`}
                  >
                    <span>{label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-elevated border border-medical-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      {menu.items.map((item) => {
                        const Icon = item.icon;
                        if (item.isExternal || item.path?.startsWith('http')) {
                          return (
                            <a
                              key={item.label + item.path}
                              href={item.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setOpenMenu(null)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:bg-primary-50 hover:text-primary transition-colors"
                            >
                              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                                <Icon className="w-4 h-4 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold leading-tight truncate">{item.label}</div>
                                <div className="text-[11px] text-medical-muted truncate">{item.sub}</div>
                              </div>
                            </a>
                          );
                        }
                        return (
                          <Link
                            key={item.label + item.path}
                            to={item.path}
                            onClick={() => setOpenMenu(null)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:bg-primary-50 hover:text-primary transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold leading-tight truncate">{item.label}</div>
                              <div className="text-[11px] text-medical-muted truncate">{item.sub}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 3. Find a Doctor */}
            <Link
              to="/doctors"
              className={`${navLinkClass(isActive('/doctors'))} whitespace-nowrap`}
            >
              <span>Find a Doctor</span>
            </Link>

            {/* 4. Search by Department */}
            <Link
              to="/departments"
              className={`${navLinkClass(isActive('/departments'))} whitespace-nowrap`}
            >
              <span>Search by Department</span>
            </Link>

            {/* 5. Quick Search */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuickSearchModalOpen(!quickSearchModalOpen);
                  setEmergencyModalOpen(false);
                  setOpenMenu(null);
                }}
                className={`flex items-center gap-1.5 px-3 xl:px-4 py-2 rounded-xl text-[14px] xl:text-[15px] font-bold transition-all cursor-pointer select-none ${
                  quickSearchModalOpen
                    ? 'text-primary bg-primary-50 ring-1 ring-primary/20'
                    : 'text-secondary hover:text-primary hover:bg-slate-100/80'
                }`}
              >
                <Search className="w-4 h-4 text-primary" />
                <span>Quick Search</span>
              </button>

              {quickSearchModalOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-80 sm:w-[350px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-6 sm:p-7 z-50 text-left animate-in fade-in zoom-in-95 duration-150"
                >
                  {/* Pointer triangle */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-slate-200" />

                  {/* Circular Teal Close Button */}
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setQuickSearchModalOpen(false)}
                    className="absolute -top-3.5 -right-3.5 w-8 h-8 rounded-full bg-[#0A7A74] hover:bg-[#075954] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer z-20"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <h3 className="text-lg font-bold text-slate-900 text-center mb-5 tracking-tight">
                    Quick Search
                  </h3>

                  <form onSubmit={handleQuickSearchSubmit} className="space-y-4">
                    {/* Department Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Department
                      </label>
                      <select
                        value={searchDept}
                        onChange={(e) => {
                          setSearchDept(e.target.value);
                          setSearchDoctor('');
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] cursor-pointer"
                      >
                        <option value="">Select Department</option>
                        {departmentsData.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Doctor Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Doctor
                      </label>
                      <select
                        value={searchDoctor}
                        onChange={(e) => setSearchDoctor(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:border-[#0A7A74] focus:ring-1 focus:ring-[#0A7A74] cursor-pointer"
                      >
                        <option value="">Select Doctor</option>
                        {filteredDoctors.map((doc) => (
                          <option key={doc.id} value={doc.name}>
                            {doc.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Orange Search Button */}
                    <button
                      type="submit"
                      className="w-full mt-5 py-3 rounded-xl bg-[#E06D2D] hover:bg-[#C95B1F] text-white font-bold text-sm shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-[0.98]"
                    >
                      Search
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* 6. Contact Us */}
            <Link
              to="/contact"
              className={`${navLinkClass(isActive('/contact'))} whitespace-nowrap`}
            >
              <span>Contact Us</span>
            </Link>
          </div>

          {/* Right: Book Appointment Pill + Mobile Toggle */}
          <div className="flex-1 flex items-center justify-end gap-2 shrink-0">
            <Link
              to={appointmentTarget}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-secondary hover:bg-medical-coolgray"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Accordion Dropdowns & The 4 Primary Navbars */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 mt-2 pt-3 pb-8 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto animate-in fade-in duration-200 bg-white px-3 sm:px-4">
            
            {/* THE 4 PRIMARY NAVBARS (Essential Healthcare Access - 2x2 Grid) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                  Primary Healthcare Navbars
                </span>
                <span className="text-[10px] text-slate-400 font-bold">4 Key Portals</span>
              </div>

              {/* 2x2 Grid of the 4 Essential Navbars */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {/* 1. Find a Doctor */}
                <Link
                  to="/doctors"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 hover:bg-teal-50/70 hover:border-teal-300 transition-all flex flex-col justify-between group active:scale-95 shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-100/80 text-[#0A7A74] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Search className="w-4 h-4 text-[#0A7A74]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#0A7A74] transition-colors leading-tight">
                      Find a Doctor
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      20+ DMC Specialists
                    </div>
                  </div>
                </Link>

                {/* 2. Search By Department */}
                <Link
                  to="/departments"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 hover:bg-teal-50/70 hover:border-teal-300 transition-all flex flex-col justify-between group active:scale-95 shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-100/80 text-[#0A7A74] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Building2 className="w-4 h-4 text-[#0A7A74]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#0A7A74] transition-colors leading-tight">
                      Departments
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      Specialty Clinical Wings
                    </div>
                  </div>
                </Link>

                {/* 3. Lab Result (Redirects to Oncquest Online Lab Portal) */}
                <a
                  href="https://itd.oncquest.net/oncquest/design/onlinelab"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 hover:bg-teal-50/70 hover:border-teal-300 transition-all flex flex-col justify-between group active:scale-95 shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-100/80 text-[#0A7A74] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <FlaskConical className="w-4 h-4 text-[#0A7A74]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#0A7A74] transition-colors leading-tight">
                      Lab Result
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      Online Oncquest Portal
                    </div>
                  </div>
                </a>

                {/* 4. 24x7 Emergency Trigger Accordion */}
                <button
                  type="button"
                  onClick={() => toggleMobileDropdown('emergency')}
                  className={`p-3 rounded-2xl text-left transition-all flex flex-col justify-between group active:scale-95 shadow-2xs border cursor-pointer ${
                    mobileOpenDropdown === 'emergency'
                      ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
                      : 'bg-rose-50/70 border-rose-200/80 hover:bg-rose-100/70'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform relative">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-rose-900 leading-tight flex items-center justify-between">
                      <span>Emergency</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-rose-600 transition-transform duration-200 ${mobileOpenDropdown === 'emergency' ? 'rotate-180' : ''}`} />
                    </div>
                    <div className="text-[10px] text-rose-700 mt-0.5 font-semibold leading-tight">
                      24x7 Casualty Desk
                    </div>
                  </div>
                </button>
              </div>

              {/* Emergency Numbers Accordion (opens right inside drawer) */}
              {mobileOpenDropdown === 'emergency' && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-2 animate-in fade-in duration-150">
                  <div className="text-[11px] font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                    <span>Emergency Helplines (Direct Tap to Call):</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    <a
                      href="tel:7840089703"
                      className="p-2.5 rounded-xl bg-white border border-rose-200 text-rose-700 font-bold flex items-center justify-between shadow-2xs hover:bg-rose-100/50"
                    >
                      <span>🚑 Mobile ICU Ambulance:</span>
                      <span className="text-slate-900 font-black">+91 7840089703</span>
                    </a>
                    <a
                      href="tel:01127531683"
                      className="p-2.5 rounded-xl bg-white border border-rose-200 text-rose-700 font-bold flex items-center justify-between shadow-2xs hover:bg-rose-100/50"
                    >
                      <span>🏥 Casualty &amp; Reception Desk:</span>
                      <span className="text-slate-900 font-black">011-27531683</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* INTERACTIVE DROPDOWN ACCORDIONS (Speciality, About Us, Quick Search) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="px-1 pb-0.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Menu Navigation &amp; Dropdowns
              </div>

              {/* 1. Speciality Dropdown Accordion */}
              <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => toggleMobileDropdown('speciality')}
                  className="w-full flex items-center justify-between p-3.5 text-left text-sm font-bold text-slate-900 hover:bg-slate-100/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0A7A74] flex items-center justify-center font-bold">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <span>Speciality</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${mobileOpenDropdown === 'speciality' ? 'rotate-180' : ''}`} />
                </button>

                {mobileOpenDropdown === 'speciality' && (
                  <div className="p-2 space-y-1 bg-white border-t border-slate-200/80 animate-in fade-in duration-150">
                    {menus['Speciality'].items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-teal-50 text-slate-800 hover:text-[#0A7A74] transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <div>
                            <div className="text-xs font-bold leading-tight">{item.label}</div>
                            <div className="text-[10px] text-slate-500 leading-tight">{item.sub}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. About Us Dropdown Accordion */}
              <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => toggleMobileDropdown('about')}
                  className="w-full flex items-center justify-between p-3.5 text-left text-sm font-bold text-slate-900 hover:bg-slate-100/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0A7A74] flex items-center justify-center font-bold">
                      <Hospital className="w-4 h-4" />
                    </div>
                    <span>About Us</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${mobileOpenDropdown === 'about' ? 'rotate-180' : ''}`} />
                </button>

                {mobileOpenDropdown === 'about' && (
                  <div className="p-2 space-y-1 bg-white border-t border-slate-200/80 animate-in fade-in duration-150">
                    {menus['About Us'].items.map((item) => {
                      const Icon = item.icon;
                      if (item.isExternal || item.path?.startsWith('http')) {
                        return (
                          <a
                            key={item.path}
                            href={item.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-teal-50 text-slate-800 hover:text-[#0A7A74] transition-colors"
                          >
                            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                              <Icon className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <div>
                              <div className="text-xs font-bold leading-tight">{item.label}</div>
                              <div className="text-[10px] text-slate-500 leading-tight">{item.sub}</div>
                            </div>
                          </a>
                        );
                      }
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-teal-50 text-slate-800 hover:text-[#0A7A74] transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <div>
                            <div className="text-xs font-bold leading-tight">{item.label}</div>
                            <div className="text-[10px] text-slate-500 leading-tight">{item.sub}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. Quick Search Interactive Dropdown Accordion */}
              <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => toggleMobileDropdown('quicksearch')}
                  className="w-full flex items-center justify-between p-3.5 text-left text-sm font-bold text-slate-900 hover:bg-slate-100/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0A7A74] flex items-center justify-center font-bold">
                      <Search className="w-4 h-4" />
                    </div>
                    <span>Quick Search</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${mobileOpenDropdown === 'quicksearch' ? 'rotate-180' : ''}`} />
                </button>

                {mobileOpenDropdown === 'quicksearch' && (
                  <div className="p-3 bg-white border-t border-slate-200/80 space-y-3 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Department
                      </label>
                      <select
                        value={searchDept}
                        onChange={(e) => {
                          setSearchDept(e.target.value);
                          setSearchDoctor('');
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-[#0A7A74]"
                      >
                        <option value="">All Clinical Departments</option>
                        {departmentsData.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Doctor Specialist
                      </label>
                      <select
                        value={searchDoctor}
                        onChange={(e) => setSearchDoctor(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-[#0A7A74]"
                      >
                        <option value="">All Consultant Doctors</option>
                        {filteredDoctors.map((doc) => (
                          <option key={doc.id} value={doc.name}>
                            {doc.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        handleQuickSearchSubmit(e);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#E06D2D] hover:bg-[#C95B1F] text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center"
                    >
                      Search Roster
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Contact Us Direct Link */}
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/90 text-sm font-bold text-slate-900 bg-slate-50/50 hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0A7A74] flex items-center justify-center font-bold">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <span>Contact Us</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Bottom Actions: Book Appointment & Login */}
            <div className="pt-2 flex flex-col gap-2.5 border-t border-slate-100">
              <Link
                to={appointmentTarget}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#0A7A74] hover:bg-[#08635e] text-white font-bold text-sm shadow-md transition-all active:scale-[0.99]"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment Online</span>
              </Link>

              {isAuthenticated ? (
                <Link
                  to="/patient/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-teal-300 bg-teal-50 text-[#0A7A74] text-xs font-bold transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Patient Portal</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-500 hover:text-[#0A7A74] transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Staff &amp; Patient Portal Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Connected Right Corner Tab: Lab Result & Emergency */}
      <div className="hidden lg:block absolute top-full left-0 right-0 pointer-events-none -mt-px z-40">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 flex justify-end">
          <div className="inline-flex items-center pointer-events-auto bg-white/95 backdrop-blur-md border-b border-x border-slate-200/90 shadow-md rounded-b-2xl divide-x divide-slate-100">
            {/* 1. Lab Result (Redirects to Oncquest Online Lab Portal) */}
            <a
              href="https://itd.oncquest.net/oncquest/design/onlinelab"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 text-xs xl:text-sm font-bold transition-all rounded-bl-2xl text-slate-700 hover:text-primary hover:bg-slate-50 cursor-pointer"
            >
              <FlaskConical className="w-4 h-4 text-primary transition-transform group-hover:scale-110" />
              <span>Lab Result</span>
            </a>

            {/* 2. Emergency Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEmergencyModalOpen(!emergencyModalOpen);
                  setQuickSearchModalOpen(false);
                  setOpenMenu(null);
                }}
                className={`group flex items-center gap-2 px-4 py-2 text-xs xl:text-sm font-bold transition-all rounded-br-2xl cursor-pointer ${
                  emergencyModalOpen
                    ? 'bg-rose-50 text-rose-700'
                    : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50/60'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                </span>
                <AlertTriangle className="w-4 h-4 text-rose-600 transition-transform group-hover:scale-110" />
                <span>Emergency</span>
              </button>

              {/* Emergency Popup attached below button */}
              {emergencyModalOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-full right-0 mt-3 w-80 sm:w-[350px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-6 sm:p-7 z-50 text-left animate-in fade-in zoom-in-95 duration-150"
                >
                  {/* Pointer triangle */}
                  <div className="absolute -top-2 right-8 w-4 h-4 bg-white rotate-45 border-t border-l border-slate-200" />

                  {/* Circular Teal Close Button */}
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setEmergencyModalOpen(false)}
                    className="absolute -top-3.5 -right-3.5 w-8 h-8 rounded-full bg-[#0A7A74] hover:bg-[#075954] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer z-20"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="space-y-6 pt-1">
                    {/* 24/7 Helpline */}
                    <div>
                      <h4 className="text-lg font-bold text-[#0A7A74] mb-2 tracking-wide flex items-center gap-2">
                        <PhoneCall className="w-4 h-4" />
                        24/7 Helpline
                      </h4>
                      <a
                        href="tel:7840089703"
                        className="text-base font-bold text-slate-900 hover:text-[#0A7A74] transition-colors block"
                      >
                        +91 7840089703
                      </a>
                    </div>

                    {/* Casualty & Reception */}
                    <div>
                      <h4 className="text-lg font-bold text-[#0A7A74] mb-2 tracking-wide">
                        Casualty &amp; Reception
                      </h4>
                      <div className="space-y-1 text-sm font-semibold text-slate-800">
                        <a href="tel:7840089703" className="block hover:text-[#0A7A74] transition-colors">+91 7840089703 (24x7)</a>
                        <a href="tel:01127531683" className="block hover:text-[#0A7A74] transition-colors">011-27531683 (Desk)</a>
                      </div>
                    </div>

                    {/* Emergency Ambulance */}
                    <div>
                      <h4 className="text-lg font-bold text-rose-600 mb-2 tracking-wide">
                        Emergency Ambulance
                      </h4>
                      <a
                        href="tel:7840089703"
                        className="text-base font-bold text-rose-600 hover:text-rose-700 transition-colors block"
                      >
                        +91 7840089703
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop & Centered Popups when open on Mobile */}
      {(emergencyModalOpen || quickSearchModalOpen) && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          {emergencyModalOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 relative text-center animate-in zoom-in-95 duration-150"
            >
              <button
                type="button"
                onClick={() => setEmergencyModalOpen(false)}
                className="absolute -top-3.5 -right-3.5 w-8 h-8 rounded-full bg-[#0A7A74] text-white flex items-center justify-center shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6 pt-1">
                <div>
                  <h4 className="text-lg font-bold text-[#0A7A74] mb-2">24/7 Helpline</h4>
                  <a href="tel:7840089703" className="text-sm font-semibold text-slate-800 block hover:text-[#0A7A74] transition-colors">+91 7840089703</a>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#0A7A74] mb-2">Casualty &amp; Reception</h4>
                  <div className="space-y-1 text-sm font-semibold text-slate-800">
                    <a href="tel:7840089703" className="block hover:text-[#0A7A74] transition-colors">+91 7840089703 (24x7)</a>
                    <a href="tel:01127531683" className="block hover:text-[#0A7A74] transition-colors">011-27531683 (Desk)</a>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#0A7A74] mb-2">Emergency Ambulance</h4>
                  <a href="tel:7840089703" className="text-sm font-semibold text-rose-600 block hover:text-rose-700 transition-colors">+91 7840089703</a>
                </div>
              </div>
            </div>
          )}

          {quickSearchModalOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 relative text-left animate-in zoom-in-95 duration-150"
            >
              <button
                type="button"
                onClick={() => setQuickSearchModalOpen(false)}
                className="absolute -top-3.5 -right-3.5 w-8 h-8 rounded-full bg-[#0A7A74] text-white flex items-center justify-center shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-slate-900 text-center mb-5">
                Quick Search
              </h3>

              <form onSubmit={handleQuickSearchSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Department
                  </label>
                  <select
                    value={searchDept}
                    onChange={(e) => {
                      setSearchDept(e.target.value);
                      setSearchDoctor('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white"
                  >
                    <option value="">Select Department</option>
                    {departmentsData.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Doctor
                  </label>
                  <select
                    value={searchDoctor}
                    onChange={(e) => setSearchDoctor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white"
                  >
                    <option value="">Select Doctor</option>
                    {filteredDoctors.map((doc) => (
                      <option key={doc.id} value={doc.name}>{doc.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full mt-5 py-3 rounded-xl bg-[#E06D2D] text-white font-bold text-sm shadow-md"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
