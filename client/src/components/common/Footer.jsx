import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white text-slate-800 border-t border-slate-200 pt-8 sm:pt-12 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 pb-6 sm:pb-10">
          
          {/* Column 1: Hospital Identity, Contact, Socials, Accreditations */}
          <div className="space-y-4 sm:space-y-5">
            {/* Hospital Logo (Standalone branding graphic) */}
            <Link to="/" className="inline-block" aria-label="Brahm Shakti Hospital Home">
              <img
                src="https://res.cloudinary.com/urzka7oz/image/upload/v1795244093/WhatsApp_Image_2026-11-20_at_10.36.32_PM-removebg-preview.png"
                alt="Brahm Shakti Hospital"
                className="h-12 sm:h-14 w-auto object-contain"
                loading="lazy"
              />
            </Link>

            {/* Address */}
            <div className="text-xs sm:text-[13px] text-slate-700 leading-relaxed space-y-0.5">
              <p className="font-bold text-slate-900">Brahm Shakti Hospital</p>
              <p>Pocket C, Budh Vihar Phase I,</p>
              <p>Pooth Kurd, New Delhi,</p>
              <p>Delhi - 110085</p>
            </div>

            {/* Contact Details */}
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-[13px]">
              <a
                href="mailto:enquiry@brahmshaktihospital.com"
                className="flex items-center gap-2 text-slate-700 hover:text-[#0A7A74] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#0A7A74] shrink-0" />
                <span className="truncate">enquiry@brahmshaktihospital.com</span>
              </a>
              <a
                href="tel:7840089703"
                className="flex items-center gap-2 text-slate-700 hover:text-[#0A7A74] transition-colors font-medium"
              >
                <Phone className="w-4 h-4 text-[#0A7A74] shrink-0" />
                <span>+91 7840089703 (Emergency)</span>
              </a>
              <a
                href="tel:01127531683"
                className="flex items-center gap-2 text-slate-700 hover:text-[#0A7A74] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#0A7A74] shrink-0" />
                <span>011-27531683 (Reception)</span>
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-2 pt-0.5">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#0A7A74] text-slate-700 hover:text-white flex items-center justify-center transition-colors shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#0A7A74] text-slate-700 hover:text-white flex items-center justify-center transition-colors shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M21.58 7.19a2.76 2.76 0 0 0-1.95-1.96C17.9 4.75 12 4.75 12 4.75s-5.9 0-7.63.48A2.76 2.76 0 0 0 2.42 7.19 29.07 29.07 0 0 0 2 12c0 1.63.14 3.23.42 4.81.27.97 1.05 1.73 1.95 1.96 1.73.48 7.63.48 7.63.48s5.9 0 7.63-.48a2.76 2.76 0 0 0 1.95-1.96c.28-1.58.42-3.18.42-4.81 0-1.63-.14-3.23-.42-4.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#0A7A74] text-slate-700 hover:text-white flex items-center justify-center transition-colors shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#0A7A74] text-slate-700 hover:text-white flex items-center justify-center transition-colors shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#0A7A74] text-slate-700 hover:text-white flex items-center justify-center transition-colors shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            {/* Accreditation Badges (NABH, NABH, NABL) */}
            <div className="flex items-center gap-3 pt-1">
              {/* NABH Red Badge */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-red-600 bg-white flex flex-col items-center justify-center text-[7.5px] sm:text-[8px] font-black text-red-600 shadow-xs">
                  <span>NABH</span>
                </div>
              </div>

              {/* NABH Green/Teal Badge */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-emerald-600 bg-white flex flex-col items-center justify-center text-[7.5px] sm:text-[8px] font-black text-emerald-700 shadow-xs">
                  <span>NABH</span>
                </div>
              </div>

              {/* NABL Star Badge */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-blue-900 bg-white flex flex-col items-center justify-center shadow-xs">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-900 fill-current">
                    <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" />
                  </svg>
                </div>
                <span className="text-[8.5px] sm:text-[9px] font-bold text-blue-900 mt-0.5">NABL</span>
              </div>
            </div>
          </div>

          {/* Column 2: Clinical Services & Patient Care */}
          <div className="space-y-4">
            <h4 className="text-[13px] sm:text-[15px] font-bold text-slate-900 mb-2 sm:mb-3 tracking-tight">
              Patient Care & Services
            </h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-2 gap-y-2 text-xs sm:text-[13px] text-slate-600">
              <li>
                <Link to="/appointments" className="hover:text-[#0A7A74] hover:underline transition-colors">
                  Book an Appointment
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-[#0A7A74] hover:underline transition-colors">
                  Find a Specialist
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-[#0A7A74] hover:underline transition-colors">
                  Clinical Departments
                </Link>
              </li>
              <li>
                <Link to="/services/opd" className="hover:text-[#0A7A74] hover:underline transition-colors">
                  OPD Clinical Services
                </Link>
              </li>
              <li>
                <Link to="/services/ipd" className="hover:text-[#0A7A74] hover:underline transition-colors">
                  IPD Inpatient Care
                </Link>
              </li>
              <li>
                <Link to="/lab-results" className="hover:text-[#0A7A74] hover:underline transition-colors">
                  Lab Test Results
                </Link>
              </li>
              <li>
                <Link to="/blood-bank" className="hover:text-[#0A7A74] hover:underline transition-colors">
                  Blood Bank Availability
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#0A7A74] hover:underline transition-colors">
                  24x7 Emergency Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hospital & Trust Governance */}
          <div className="space-y-4">
            <h4 className="text-[13px] sm:text-[15px] font-bold text-slate-900 mb-2 sm:mb-3 tracking-tight">
              Hospital & Trust
            </h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-2 gap-y-2 text-xs sm:text-[13px] text-slate-600">
              <li>
                <Link to="/about" className="hover:text-[#0A7A74] hover:underline transition-colors">
                  About Brahm Shakti
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#0A7A74] hover:underline transition-colors">
                  Brahm Shakti Trust (Regd.)
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-[#0A7A74] hover:underline transition-colors">
                  Facilities & Diagnostics
                </Link>
              </li>
              <li>
                <Link to="/pharmacy" className="hover:text-[#0A7A74] hover:underline transition-colors">
                  Hospital Pharmacy
                </Link>
              </li>
              <li>
                <Link to="/blood-bank/donate" className="hover:text-[#0A7A74] hover:underline transition-colors">
                  Donate Blood
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-[#0A7A74] hover:underline transition-colors">
                  Quick Search Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#0A7A74] hover:underline transition-colors">
                  Staff & Doctor Login
                </Link>
              </li>
              <li>
                <Link to="/supplier/dashboard" className="hover:text-[#0A7A74] hover:underline transition-colors">
                  Suppliers & Tenders
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Help, Guidance & Policies */}
          <div className="space-y-4">
            <h4 className="text-[13px] sm:text-[15px] font-bold text-slate-900 mb-2 sm:mb-3 tracking-tight">
              Help & Policies
            </h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-2 gap-y-2 text-xs sm:text-[13px] text-slate-600">
              <li>
                <Link to="/contact" className="hover:text-[#0A7A74] hover:underline transition-colors">
                  Contact & Directions
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#0A7A74] hover:underline transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-use" className="hover:text-[#0A7A74] hover:underline transition-colors font-medium">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#0A7A74] hover:underline transition-colors">
                  Patient Guide & FAQs
                </Link>
              </li>
              <li>
                <a href="tel:7840089703" className="hover:text-rose-600 font-semibold transition-colors">
                  Emergency: 7840089703
                </a>
              </li>
              <li>
                <a href="tel:01127531683" className="hover:text-[#0A7A74] transition-colors">
                  Reception: 011-27531683
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Clean subtle bottom bar */}
        <div className="pt-4 sm:pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 sm:gap-3">
          <p className="text-center sm:text-left">© {new Date().getFullYear()} Brahm Shakti Hospital. Managed by Brahm Shakti Trust (Regd.). All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px]">
            <Link to="/privacy-policy" className="hover:text-[#0A7A74] hover:underline transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms-of-use" className="hover:text-[#0A7A74] hover:underline transition-colors">Terms of Use</Link>
            <span>·</span>
            <span className="text-slate-400">NABH Accredited</span>
            <span>·</span>
            <span className="text-slate-400">NABL Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
