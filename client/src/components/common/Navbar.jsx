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
  Hospital
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { departmentsData, doctorsData } from '../../data/seedData';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [quickSearchModalOpen, setQuickSearchModalOpen] = useState(false);
  const [searchDept, setSearchDept] = useState('');
  const [searchDoctor, setSearchDoctor] = useState('');

  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isStaff, dashboardPath } = useAuth();

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
      match: ['/about', '/facilities', '/services', '/lab-results', '/search'],
      items: [
        { label: 'About the Hospital', sub: 'Heritage, mission & leadership', path: '/about', icon: Hospital },
        { label: 'Facilities & Diagnostics', sub: 'Labs, CT Scan & infrastructure', path: '/facilities', icon: FlaskConical },
        { label: 'Lab Test Results', sub: 'Retrieve reports with UHID & mobile', path: '/lab-results', icon: FileText },
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

  const appointmentTarget = isStaff
    ? (dashboardPath || '/admin/dashboard')
    : (isAuthenticated ? '/appointments' : '/login?redirect=/appointments');

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

          {/* Centered Navigation (Speciality, About Us, Quick Search, Contact Us) */}
          <div className="hidden lg:flex items-center justify-center gap-1.5 xl:gap-2.5 shrink-0">
            {/* 1 & 2: Speciality & About Us Dropdowns */}
            {Object.entries(menus).map(([label, menu]) => {
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
            })}

            {/* 3. Quick Search (Positioned between About Us and Contact Us) */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuickSearchModalOpen(!quickSearchModalOpen);
                  setEmergencyModalOpen(false);
                  setOpenMenu(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[15px] font-bold transition-all cursor-pointer select-none ${
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

            {/* 4. Contact Us */}
            {plainLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${navLinkClass(isActive(link.path))} whitespace-nowrap`}
              >
                {link.label}
              </Link>
            ))}
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

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-medical-border mt-3 pt-3 pb-6 space-y-1 max-h-[calc(100vh-90px)] overflow-y-auto animate-in fade-in duration-200">
            <div className="px-4 pb-1 text-[10px] font-black uppercase tracking-wider text-medical-muted">Departments & Care</div>
            <Link to="/departments" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-semibold text-secondary hover:bg-medical-coolgray">Departments</Link>
            <Link to="/doctors" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-semibold text-secondary hover:bg-medical-coolgray">Doctors</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-semibold text-secondary hover:bg-medical-coolgray">About Us</Link>
            <Link to="/facilities" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-semibold text-secondary hover:bg-medical-coolgray">Facilities & Diagnostics</Link>
            <Link to="/lab-results" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-semibold text-secondary hover:bg-medical-coolgray">Lab Test Results</Link>
            
            {/* Quick Search trigger in mobile drawer */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setQuickSearchModalOpen(true);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-base font-semibold text-secondary hover:bg-medical-coolgray flex items-center justify-between"
            >
              <span>Quick Search</span>
              <Zap className="w-4 h-4 text-primary" />
            </button>

            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-base font-semibold text-secondary hover:bg-medical-coolgray">Contact Us</Link>

            <div className="pt-2 pb-1 border-t border-medical-border/60">
              <Link to="/services/opd" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-secondary hover:bg-medical-coolgray font-medium">OPD Clinical Services</Link>
              <Link to="/services/ipd" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-secondary hover:bg-medical-coolgray font-medium">IPD Inpatient Admissions</Link>
            </div>

            <div className="pt-3 px-2 flex flex-col gap-2.5">
              <Link
                to={appointmentTarget}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-white font-bold text-sm shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </Link>

              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-medical-muted hover:text-primary transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Staff & Patient Login</span>
                </Link>
              )}

              {/* Mobile Drawer Emergency Popup Trigger */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setEmergencyModalOpen(true);
                }}
                className="mt-2 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-xs w-full text-left cursor-pointer"
              >
                <div className="flex items-center gap-2 text-status-error font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>24x7 Emergency Line</span>
                </div>
                <span className="text-secondary font-black">
                  7840089703
                </span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Quick Action Strip (Horizontally Scrollable Chips for Mobile & Tablet) */}
      <div className="lg:hidden bg-slate-50/95 border-t border-slate-200/90 px-3 py-2 overflow-x-auto scrollbar-none shadow-2xs">
        <div className="flex items-center gap-2 min-w-max">
          <Link
            to="/doctors"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs hover:border-primary hover:text-primary active:scale-95 transition-all"
          >
            <Search className="w-3.5 h-3.5 text-primary" />
            <span>Find Doctor</span>
          </Link>
          <Link
            to="/departments"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs hover:border-primary hover:text-primary active:scale-95 transition-all"
          >
            <Stethoscope className="w-3.5 h-3.5 text-primary" />
            <span>Departments</span>
          </Link>
          <a
            href="tel:7840089703"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 shadow-2xs hover:bg-rose-100 active:scale-95 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>24x7 Emergency</span>
          </a>
          <Link
            to="/lab-results"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs hover:border-primary hover:text-primary active:scale-95 transition-all"
          >
            <FlaskConical className="w-3.5 h-3.5 text-primary" />
            <span>Lab Results</span>
          </Link>
          <Link
            to={appointmentTarget}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0A7A74] text-white text-xs font-bold shadow-2xs hover:bg-[#075954] active:scale-95 transition-all"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Slot</span>
          </Link>
        </div>
      </div>

      {/* Quick Access Strip (second row with popups - 4 equal columns) */}
      <div className="hidden lg:block bg-medical-white border-t border-medical-border/70 shadow-sm relative">
        <div className="max-w-[1400px] mx-auto px-6 relative">
          <div className="grid grid-cols-4 relative">
            {/* 1. Find a Doctor */}
            <Link
              to="/doctors"
              className="group flex items-center justify-center gap-2.5 py-3.5 transition-colors hover:bg-primary-50"
            >
              <Search className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-secondary group-hover:text-primary transition-colors">Find a Doctor</span>
            </Link>

            {/* 2. Search By Department */}
            <Link
              to="/departments"
              className="group flex items-center justify-center gap-2.5 py-3.5 transition-colors hover:bg-primary-50 border-l border-medical-border/70"
            >
              <Stethoscope className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-secondary group-hover:text-primary transition-colors">Search By Department</span>
            </Link>

            {/* 3. Lab Result */}
            <Link
              to="/lab-results"
              className="group flex items-center justify-center gap-2.5 py-3.5 transition-colors hover:bg-primary-50 border-l border-medical-border/70"
            >
              <FlaskConical className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-secondary group-hover:text-primary transition-colors">Lab Result</span>
            </Link>

            {/* 4. Emergency Trigger */}
            <div className="relative border-l border-medical-border/70">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEmergencyModalOpen(!emergencyModalOpen);
                  setQuickSearchModalOpen(false);
                  setOpenMenu(null);
                }}
                className={`w-full group flex items-center justify-center gap-2.5 py-3.5 transition-colors cursor-pointer ${
                  emergencyModalOpen ? 'bg-primary-50' : 'hover:bg-primary-50'
                }`}
              >
                <AlertTriangle className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-secondary group-hover:text-primary transition-colors">Emergency</span>
              </button>

              {/* Emergency Popup */}
              {emergencyModalOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 sm:w-[350px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-6 sm:p-7 z-50 text-center animate-in fade-in zoom-in-95 duration-150"
                >
                  {/* Pointer triangle */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-slate-200" />

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
                      <h4 className="text-lg font-bold text-[#0A7A74] mb-2 tracking-wide">
                        24/7 Helpline
                      </h4>
                      <a
                        href="tel:7840089703"
                        className="text-base font-bold text-slate-900 hover:text-[#0A7A74] transition-colors block"
                      >
                        +91 7840089703
                      </a>
                    </div>

                    {/* Casualty */}
                    <div>
                      <h4 className="text-lg font-bold text-[#0A7A74] mb-2 tracking-wide">
                        Casualty & Reception
                      </h4>
                      <div className="space-y-1 text-sm font-semibold text-slate-800">
                        <a href="tel:7840089703" className="block hover:text-[#0A7A74] transition-colors">+91 7840089703 (24x7)</a>
                        <a href="tel:01127531683" className="block hover:text-[#0A7A74] transition-colors">011-27531683 (Desk)</a>
                      </div>
                    </div>

                    {/* Ambulance */}
                    <div>
                      <h4 className="text-lg font-bold text-[#0A7A74] mb-2 tracking-wide">
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
