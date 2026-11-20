import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  PhoneCall,
  Calendar,
  User,
  Menu,
  X,
  ChevronDown,
  Activity,
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
  const { isAuthenticated } = useAuth();

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
    `flex items-center gap-1 px-3.5 py-2 rounded-lg text-[15px] font-semibold transition-colors ${
      active ? 'text-primary' : 'text-secondary hover:text-primary'
    }`;

  const appointmentTarget = isAuthenticated ? '/appointments' : '/login?redirect=/appointments';

  return (
    <header ref={navRef} className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Main White Navbar */}
      <nav className="bg-medical-white px-3 sm:px-6 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center gap-3">
          {/* Hospital Logo & Brand Title */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-xl font-extrabold tracking-tight text-secondary truncate">
                  BRAHM SHAKTI
                </span>
                <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-accent text-accent-dark font-bold uppercase tracking-wider shrink-0">
                  HOSPITAL
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-semibold text-primary tracking-wide -mt-0.5 hidden sm:block truncate">
                250-Bedded Tertiary Healthcare · Caring for you for Life
              </p>
            </div>
          </Link>

          {/* Centered Navigation With Click-To-Open Persistent Dropdowns */}
          <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
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
                    className={`${navLinkClass(active)} whitespace-nowrap cursor-pointer select-none`}
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

          {/* Right Side: Book Appointment Pill + Mobile Toggle */}
          <div className="flex items-center gap-2 shrink-0 lg:flex-1 lg:justify-end">
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
                  View Helplines
                </span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Quick Access Strip (second row with popups) */}
      <div className="hidden lg:block bg-medical-white border-t border-medical-border/70 shadow-sm relative">
        <div className="max-w-[1400px] mx-auto px-6 relative">
          <div className="grid grid-cols-5 relative">
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

              {/* Emergency Popup (as shown in Screenshot 1) */}
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
                        href="tel:01142254000"
                        className="text-sm font-semibold text-slate-800 hover:text-[#0A7A74] transition-colors block"
                      >
                        +91-11-4225 4000
                      </a>
                    </div>

                    {/* Casualty */}
                    <div>
                      <h4 className="text-lg font-bold text-[#0A7A74] mb-2 tracking-wide">
                        Casualty
                      </h4>
                      <div className="space-y-1 text-sm font-semibold text-slate-800">
                        <a href="tel:01142251097" className="block hover:text-[#0A7A74] transition-colors">+91-11-4225 1097</a>
                        <a href="tel:01142251098" className="block hover:text-[#0A7A74] transition-colors">+91-11-4225 1098</a>
                        <a href="tel:01142251099" className="block hover:text-[#0A7A74] transition-colors">+91-11-4225 1099</a>
                      </div>
                    </div>

                    {/* Ambulance */}
                    <div>
                      <h4 className="text-lg font-bold text-[#0A7A74] mb-2 tracking-wide">
                        Ambulance
                      </h4>
                      <a
                        href="tel:01142253030"
                        className="text-sm font-semibold text-slate-800 hover:text-[#0A7A74] transition-colors block"
                      >
                        +91-11-4225 3030
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Quick Search Trigger */}
            <div className="relative border-l border-medical-border/70">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuickSearchModalOpen(!quickSearchModalOpen);
                  setEmergencyModalOpen(false);
                  setOpenMenu(null);
                }}
                className={`w-full group flex items-center justify-center gap-2.5 py-3.5 transition-colors cursor-pointer ${
                  quickSearchModalOpen ? 'bg-primary-50' : 'hover:bg-primary-50'
                }`}
              >
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-secondary group-hover:text-primary transition-colors">Quick Search</span>
              </button>

              {/* Quick Search Popup (as shown in Screenshot 2) */}
              {quickSearchModalOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-full right-2 mt-3 w-80 sm:w-[350px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-6 sm:p-7 z-50 text-left animate-in fade-in zoom-in-95 duration-150"
                >
                  {/* Pointer triangle pointing up to Quick Search tab */}
                  <div className="absolute -top-2 right-16 w-4 h-4 bg-white rotate-45 border-t border-l border-slate-200" />

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
                  <a href="tel:01142254000" className="text-sm font-semibold text-slate-800 block">+91-11-4225 4000</a>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#0A7A74] mb-2">Casualty</h4>
                  <div className="space-y-1 text-sm font-semibold text-slate-800">
                    <a href="tel:01142251097" className="block">+91-11-4225 1097</a>
                    <a href="tel:01142251098" className="block">+91-11-4225 1098</a>
                    <a href="tel:01142251099" className="block">+91-11-4225 1099</a>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#0A7A74] mb-2">Ambulance</h4>
                  <a href="tel:01142253030" className="text-sm font-semibold text-slate-800 block">+91-11-4225 3030</a>
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
