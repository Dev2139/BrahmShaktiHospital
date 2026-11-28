import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ArrowRight,
  Plus,
  Minus,
  Heart
} from 'lucide-react';

export const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [openSections, setOpenSections] = useState({
    patientCare: false,
    hospitalTrust: false,
    helpPolicies: false
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 4000);
    }
  };

  const patientCareLinks = [
    { label: 'OPD Appointment', path: '/bookappointment' },
    { label: 'In-Patient Services', path: '/services/ipd' },
    { label: 'Diagnostic Services', path: '/facilities' },
    { label: 'Specialist Doctors', path: '/doctors' },
    { label: 'Health Packages', path: '/services/opd' },
    { label: 'Wellness Programs', path: '/about' }
  ];

  const hospitalTrustLinks = [
    { label: 'About Brahm Shakti', path: '/about' },
    { label: 'Our Medical Team', path: '/doctors' },
    { label: 'Our Infrastructure', path: '/facilities' },
    { label: 'Quality & Safety', path: '/about/accreditations' },
    { label: 'Awards & Recognition', path: '/about/awards' },
    { label: 'Welines Testimonials', path: '/about' }
  ];

  const helpPoliciesLinks = [
    { label: 'Contact & Directions', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Use', path: '/terms-of-use' },
    { label: 'Patient Feedback', path: '/contact' },
    { label: 'Emergency: 7982897603', path: 'tel:7982897603', isExternal: true },
    { label: 'Helpline: 8423934205', path: 'tel:8423934205', isExternal: true }
  ];

  return (
    <footer className="relative w-full bg-[#F0FBFC] text-slate-800 overflow-hidden font-sans border-t-0">
      {/* Dynamic Cyan Wave Overlays in Background (Matching Reference Image) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft cyan gradient wave rising from bottom right & mid */}
        <svg
          viewBox="0 0 1440 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 right-0 w-full h-[260px] sm:h-[320px] object-cover pointer-events-none opacity-90"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CEF5FA" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#B6EEF6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#73E0EF" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="waveGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="60%" stopColor="#B6EEF6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0DAFD5" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="waveGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#015B73" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#018AAE" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Deep curving cyan back waves with completely smooth bottom transitions */}
          <path
            d="M0,230 C320,180 580,290 880,240 C1120,200 1300,100 1440,50 L1440,360 L0,360 Z"
            fill="url(#waveGrad1)"
          />
          <path
            d="M0,310 C380,270 700,310 1020,220 C1200,170 1340,90 1440,40 L1440,360 L0,360 Z"
            fill="url(#waveGrad2)"
          />
          <path
            d="M500,360 C750,320 1050,280 1260,210 C1340,180 1400,160 1440,130 L1440,360 Z"
            fill="url(#waveGradDark)"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10 pb-6 sm:pb-8">
        {/* Desktop 5-Column Grid with Vertical Column Dividers */}
        <div className="hidden lg:grid grid-cols-12 gap-0 divide-x divide-slate-200/90 items-start">
          
          {/* Column 1: Hospital Logo, Address, Contact, Socials */}
          <div className="col-span-3 pr-6 xl:pr-8 space-y-4">
            <Link to="/" className="inline-block" aria-label="Brahm Shakti Hospital Home">
              <img
                src="https://res.cloudinary.com/urzka7oz/image/upload/v1795869190/WhatsApp_Image_2026-11-28_at_12.03.33_PM-removebg-preview.png"
                alt="Brahm Shakti Hospital & Research Centre"
                className="h-12 xl:h-14 w-auto object-contain"
                loading="lazy"
              />
            </Link>

            {/* Address */}
            <div className="flex items-start gap-2 text-[12.5px] text-slate-600 leading-snug">
              <MapPin className="w-4 h-4 text-[#018AAE] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Brahm Shakti Hospital</p>
                <p className="text-[11px] text-[#018AAE] font-semibold">Institution Run By Brahm Shakti Trust · "WE TREAT HE CURES"</p>
                <p>U-1/78, Budh Vihar, Main Kanjhawala Road,</p>
                <p>Delhi-110086</p>
              </div>
            </div>

            {/* Phone & Email */}
            <div className="space-y-1.5 text-[12.5px] text-slate-600 leading-snug">
              <a href="tel:7982897603" className="flex items-center gap-2 hover:text-[#018AAE] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#018AAE] shrink-0" />
                <span>+91-7982897603 / 8423934205</span>
              </a>
              <a href="tel:6388554517" className="flex items-center gap-2 hover:text-[#018AAE] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#018AAE] shrink-0" />
                <span>+91-6388554517 (Desk)</span>
              </a>
              <a href="mailto:brahmshaktihospital@gmail.com" className="flex items-center gap-2 hover:text-[#018AAE] transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#018AAE] shrink-0" />
                <span>brahmshaktihospital@gmail.com</span>
              </a>
            </div>

            {/* Social Icons (Pill Badges under Column 1, exactly as in image) */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-[#EBF9FB] hover:bg-[#018AAE] text-slate-700 hover:text-white flex items-center justify-center transition-all shadow-2xs border border-[#CEF5FA]"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-[#EBF9FB] hover:bg-[#018AAE] text-slate-700 hover:text-white flex items-center justify-center transition-all shadow-2xs border border-[#CEF5FA]"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M21.58 7.19a2.76 2.76 0 0 0-1.95-1.96C17.9 4.75 12 4.75 12 4.75s-5.9 0-7.63.48A2.76 2.76 0 0 0 2.42 7.19 29.07 29.07 0 0 0 2 12c0 1.63.14 3.23.42 4.81.27.97 1.05 1.73 1.95 1.96 1.73.48 7.63.48 7.63.48s5.9 0 7.63-.48a2.76 2.76 0 0 0 1.95-1.96c.28-1.58.42-3.18.42-4.81 0-1.63-.14-3.23-.42-4.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-[#EBF9FB] hover:bg-[#018AAE] text-slate-700 hover:text-white flex items-center justify-center transition-all shadow-2xs border border-[#CEF5FA]"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-[#EBF9FB] hover:bg-[#018AAE] text-slate-700 hover:text-white flex items-center justify-center transition-all shadow-2xs border border-[#CEF5FA]"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="w-8 h-8 rounded-full bg-[#EBF9FB] hover:bg-[#018AAE] text-slate-700 hover:text-white flex items-center justify-center transition-all shadow-2xs border border-[#CEF5FA]"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Patient Care & Services */}
          <div className="col-span-2 px-5 xl:px-6 space-y-3">
            <h4 className="text-[14px] font-bold text-[#0B2545] tracking-tight">
              Patient Care &amp; Services
            </h4>
            <ul className="space-y-2 text-[12.5px] text-slate-700">
              {patientCareLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-2 hover:text-[#018AAE] transition-colors"
                  >
                    <span className="text-slate-400 font-bold">&gt;</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Hospital's Trust */}
          <div className="col-span-2 px-5 xl:px-6 space-y-3">
            <h4 className="text-[14px] font-bold text-[#0B2545] tracking-tight">
              Hospital's Trust
            </h4>
            <ul className="space-y-2 text-[12.5px] text-slate-700">
              {hospitalTrustLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-2 hover:text-[#018AAE] transition-colors"
                  >
                    <span className="text-slate-400 font-bold">&gt;</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Help & Policies */}
          <div className="col-span-2 px-5 xl:px-6 space-y-3">
            <h4 className="text-[14px] font-bold text-[#0B2545] tracking-tight">
              Help &amp; Policies
            </h4>
            <ul className="space-y-2 text-[12.5px] text-slate-700">
              {helpPoliciesLinks.map((item, idx) => (
                <li key={idx}>
                  {item.isExternal ? (
                    <a
                      href={item.path}
                      className="flex items-center gap-2 hover:text-[#018AAE] transition-colors"
                    >
                      <span className="text-slate-400 font-bold">&gt;</span>
                      <span>{item.label}</span>
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className="flex items-center gap-2 hover:text-[#018AAE] transition-colors"
                    >
                      <span className="text-slate-400 font-bold">&gt;</span>
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Stay Connected */}
          <div className="col-span-3 pl-6 xl:pl-8 space-y-3">
            <div>
              <h4 className="text-[14px] font-bold text-[#0B2545] tracking-tight">
                Stay Connected
              </h4>
              <p className="text-[12px] text-slate-600 mt-0.5">
                Get health tips and updates
              </p>
            </div>

            {/* Email Input Box with Rounded Teal Arrow Button */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-2 pt-1">
              <div className="flex items-center bg-white rounded-xl border border-slate-300 p-1 shadow-2xs">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 bg-transparent outline-none flex-1 min-w-0"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="w-8 h-8 rounded-lg bg-[#00828A] hover:bg-[#01686E] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {newsletterSubscribed && (
                <p className="text-[11px] font-bold text-[#00828A] animate-in fade-in">
                  ✓ Thank you for subscribing!
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Mobile Accordion View with matching styling */}
        <div className="lg:hidden space-y-4">
          {/* Logo & Contact details */}
          <div className="space-y-3 pb-3 border-b border-slate-200">
            <Link to="/" className="inline-block" aria-label="Brahm Shakti Hospital Home">
              <img
                src="https://res.cloudinary.com/urzka7oz/image/upload/v1795869190/WhatsApp_Image_2026-11-28_at_12.03.33_PM-removebg-preview.png"
                alt="Brahm Shakti Hospital"
                className="h-10 w-auto object-contain"
              />
            </Link>

            <div className="flex items-start gap-2 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-[#018AAE] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Brahm Shakti Hospital</p>
                <p className="text-[11px] text-[#018AAE] font-semibold">Institution Run By Brahm Shakti Trust · "WE TREAT HE CURES"</p>
                <p>U-1/78, Budh Vihar, Main Kanjhawala Road, Delhi-110086</p>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <p>+91-7982897603 / 8423934205</p>
              <p>+91-6388554517 (Desk)</p>
              <p>brahmshaktihospital@gmail.com</p>
            </div>
          </div>

          {/* Accordion 1 */}
          <div className="border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => toggleSection('patientCare')}
              className="w-full flex items-center justify-between text-xs font-bold text-[#0B2545] py-1.5"
            >
              <span>Patient Care &amp; Services</span>
              {openSections.patientCare ? <Minus className="w-3.5 h-3.5 text-[#018AAE]" /> : <Plus className="w-3.5 h-3.5 text-[#018AAE]" />}
            </button>
            {openSections.patientCare && (
              <ul className="space-y-2 pt-2 text-xs text-slate-600">
                {patientCareLinks.map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.path} className="flex items-center gap-1.5 hover:text-[#018AAE]">
                      <span className="text-slate-400 font-bold">&gt;</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Accordion 2 */}
          <div className="border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => toggleSection('hospitalTrust')}
              className="w-full flex items-center justify-between text-xs font-bold text-[#0B2545] py-1.5"
            >
              <span>Hospital's Trust</span>
              {openSections.hospitalTrust ? <Minus className="w-3.5 h-3.5 text-[#018AAE]" /> : <Plus className="w-3.5 h-3.5 text-[#018AAE]" />}
            </button>
            {openSections.hospitalTrust && (
              <ul className="space-y-2 pt-2 text-xs text-slate-600">
                {hospitalTrustLinks.map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.path} className="flex items-center gap-1.5 hover:text-[#018AAE]">
                      <span className="text-slate-400 font-bold">&gt;</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Accordion 3 */}
          <div className="border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => toggleSection('helpPolicies')}
              className="w-full flex items-center justify-between text-xs font-bold text-[#0B2545] py-1.5"
            >
              <span>Help &amp; Policies</span>
              {openSections.helpPolicies ? <Minus className="w-3.5 h-3.5 text-[#018AAE]" /> : <Plus className="w-3.5 h-3.5 text-[#018AAE]" />}
            </button>
            {openSections.helpPolicies && (
              <ul className="space-y-2 pt-2 text-xs text-slate-600">
                {helpPoliciesLinks.map((item, idx) => (
                  <li key={idx}>
                    {item.isExternal ? (
                      <a href={item.path} className="flex items-center gap-1.5 hover:text-[#018AAE]">
                        <span className="text-slate-400 font-bold">&gt;</span>
                        <span>{item.label}</span>
                      </a>
                    ) : (
                      <Link to={item.path} className="flex items-center gap-1.5 hover:text-[#018AAE]">
                        <span className="text-slate-400 font-bold">&gt;</span>
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Mobile Newsletter & Socials */}
          <div className="space-y-3 pt-1">
            <div>
              <h4 className="text-xs font-bold text-[#0B2545]">Stay Connected</h4>
              <p className="text-[11px] text-slate-500">Get health tips and updates</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex items-center bg-white rounded-xl border border-slate-300 p-1">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 bg-transparent outline-none flex-1 min-w-0"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="w-7 h-7 rounded-lg bg-[#00828A] text-white flex items-center justify-center cursor-pointer shrink-0"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Dark Teal Bottom Bar (Matching Reference Image) */}
      <div className="relative z-10 bg-[#014D5B] text-slate-200 py-3 px-4 sm:px-6 lg:px-10 border-t border-[#013f4a]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          {/* Copyright */}
          <p className="text-center md:text-left text-slate-300 font-normal text-[12px]">
            &copy; {new Date().getFullYear()} Brahm Shakti Hospital. All Rights Reserved.
          </p>

          {/* Policy Links & ECG Heart Beat Lifeline */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11.5px] text-slate-300">
            <Link to="/privacy-policy" className="hover:text-white hover:underline transition-colors">
              Privacy Policy
            </Link>
            <span className="opacity-40">|</span>
            <Link to="/terms-of-use" className="hover:text-white hover:underline transition-colors">
              Terms of Use
            </Link>
            <span className="opacity-40">|</span>
            <Link to="/refund-policy" className="hover:text-white hover:underline transition-colors">
              Refund Policy
            </Link>
            <span className="opacity-40">|</span>
            <Link to="/contact" className="hover:text-white hover:underline transition-colors">
              Contact Us
            </Link>

            {/* ECG Pulse Wave + Heart Badge */}
            <div className="flex items-center gap-1.5 pl-2 sm:pl-4 opacity-90 hover:opacity-100 transition-opacity">
              <svg
                className="w-10 sm:w-12 h-4 sm:h-5 text-[#73E0EF]"
                viewBox="0 0 60 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M0 10 H18 L22 3 L27 17 L32 7 L36 13 L39 10 H60" />
              </svg>
              <div className="w-6 h-6 rounded-full border border-[#73E0EF]/60 flex items-center justify-center bg-[#015B73]">
                <Heart className="w-3.5 h-3.5 text-[#73E0EF] fill-[#73E0EF]/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
