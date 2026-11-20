import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white text-slate-800 border-t border-slate-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-10">
          
          {/* Column 1: Hospital Identity, Contact, Socials, Accreditations */}
          <div className="space-y-5">
            {/* Logo & Tagline */}
            <div className="flex items-center gap-3">
              {/* SGRH Medical Emblem */}
              <div className="w-11 h-11 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
                  {/* Stylized human figure with welcoming arms */}
                  <circle cx="24" cy="11" r="5" fill="#E65100" />
                  <path
                    d="M14 18C15 23 20 25 24 25C28 25 33 23 34 18"
                    stroke="#E65100"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M24 25V39M18 43H30"
                    stroke="#0A7A74"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M17 28C14 31 13 36 13 41M31 28C34 31 35 36 35 41"
                    stroke="#0A7A74"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  SIR GANGA RAM HOSPITAL
                </h3>
                <p className="text-xs text-[#0A7A74] italic font-medium tracking-wide">
                  Trust of Generations
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="text-xs sm:text-[13px] text-slate-700 leading-relaxed space-y-0.5">
              <p className="font-bold text-slate-900">Sir Ganga Ram Hospital</p>
              <p>Sir Ganga Ram Hospital Marg,</p>
              <p>Rajinder Nagar, New Delhi,</p>
              <p>Delhi - 110060</p>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 text-xs sm:text-[13px]">
              <a
                href="mailto:gangaram@sgrh.com"
                className="flex items-center gap-2 text-slate-700 hover:text-[#0A7A74] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#0A7A74] shrink-0" />
                <span>gangaram@sgrh.com</span>
              </a>
              <a
                href="tel:+911142254000"
                className="flex items-center gap-2 text-slate-700 hover:text-[#0A7A74] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#0A7A74] shrink-0" />
                <span>+91 11-42254000</span>
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-2.5 pt-1">
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
            <div className="flex items-center gap-3 pt-2">
              {/* NABH Red Badge */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full border-2 border-red-600 bg-white flex flex-col items-center justify-center text-[8px] font-black text-red-600 shadow-xs">
                  <span>NABH</span>
                </div>
              </div>

              {/* NABH Green/Teal Badge */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full border-2 border-emerald-600 bg-white flex flex-col items-center justify-center text-[8px] font-black text-emerald-700 shadow-xs">
                  <span>NABH</span>
                </div>
              </div>

              {/* NABL Star Badge */}
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full border-2 border-blue-900 bg-white flex flex-col items-center justify-center shadow-xs">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-900 fill-current">
                    <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" />
                  </svg>
                </div>
                <span className="text-[9px] font-bold text-blue-900 mt-0.5">NABL</span>
              </div>
            </div>
          </div>

          {/* Column 2: For Patients & Visitors, For Vendors & Suppliers, News & Events */}
          <div className="space-y-6">
            <div>
              <h4 className="text-[14px] sm:text-[15px] font-bold text-slate-900 mb-3 tracking-tight">
                For Patients & Visitors
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-[13px] text-slate-600">
                <li>
                  <Link to="/consultation" className="hover:text-[#0A7A74] hover:underline transition-colors">
                    Request an Appointment
                  </Link>
                </li>
                <li>
                  <Link to="/doctors" className="hover:text-[#0A7A74] hover:underline transition-colors">
                    Specialists
                  </Link>
                </li>
                <li>
                  <Link to="/departments" className="hover:text-[#0A7A74] hover:underline transition-colors">
                    Medical Departments
                  </Link>
                </li>
                <li>
                  <Link to="/departments" className="hover:text-[#0A7A74] hover:underline transition-colors">
                    Specialty Clinics
                  </Link>
                </li>
                <li>
                  <Link to="/services/ipd" className="hover:text-[#0A7A74] hover:underline transition-colors">
                    Admissions & Discharge
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#0A7A74] hover:underline transition-colors">
                    Patients & Visitors Guide
                  </Link>
                </li>
                <li>
                  <Link to="/lab-results" className="hover:text-[#0A7A74] hover:underline transition-colors">
                    Lab Results
                  </Link>
                </li>
                <li>
                  <Link to="/services/opd" className="hover:text-[#0A7A74] hover:underline transition-colors">
                    EWS Care
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[14px] sm:text-[15px] font-bold text-slate-900 mb-2.5 tracking-tight">
                For Vendors & Suppliers
              </h4>
              <ul className="space-y-1 text-xs sm:text-[13px] text-slate-600">
                <li>
                  <Link to="/supplier/dashboard" className="hover:text-[#0A7A74] hover:underline transition-colors">
                    Tenders
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[14px] sm:text-[15px] font-bold text-slate-900 mb-2.5 tracking-tight">
                News & Events
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-[13px] text-slate-600">
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    Latest News and Achieves
                  </span>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    Newsletter for SGRH
                  </span>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    Newsletter for GRIPMER
                  </span>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    Newsletter for Microbiology
                  </span>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    Events
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: For Medical Professionals, For International Appointments, Career */}
          <div className="space-y-6">
            <div>
              <h4 className="text-[14px] sm:text-[15px] font-bold text-slate-900 mb-3 tracking-tight">
                For Medical Professionals
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-[13px] text-slate-600">
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    Research
                  </span>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    General Nursing & Midwifery Course (GNM) 2026
                  </span>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    Academic Programme
                  </span>
                </li>
                <li>
                  <Link to="/consultation" className="hover:text-[#0A7A74] hover:underline transition-colors">
                    Refer a Patient
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-[#0A7A74] hover:underline transition-colors">
                    Doctor's Portal
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[14px] sm:text-[15px] font-bold text-slate-900 mb-2.5 tracking-tight">
                For International Appointments
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-[13px] text-slate-600">
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    Patients Information
                  </span>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    Authorization Committee
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[14px] sm:text-[15px] font-bold text-slate-900 mb-2.5 tracking-tight">
                Career opportunities
              </h4>
              <ul className="space-y-1 text-xs sm:text-[13px] text-slate-600">
                <li>
                  <Link to="/contact" className="hover:text-[#0A7A74] hover:underline transition-colors">
                    Career
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 4: Additional Resources, Education and Research */}
          <div className="space-y-6">
            <div>
              <h4 className="text-[14px] sm:text-[15px] font-bold text-slate-900 mb-3 tracking-tight">
                Additional Resources
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-[13px] text-slate-600">
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    Life Certificate for Ex Employees
                  </span>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    Quality Policy
                  </span>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    Bio Medical Reports
                  </span>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    Organ Donation
                  </span>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    Ceiling Prices & other related PDFs
                  </span>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    Environmental Approval Compliance
                  </span>
                </li>
                <li>
                  <Link to="/services/opd" className="hover:text-[#0A7A74] hover:underline transition-colors">
                    Health Services
                  </Link>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    Sir Ganga Ram City Hospital
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[14px] sm:text-[15px] font-bold text-slate-900 mb-2.5 tracking-tight">
                Education and Research
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-[13px] text-slate-600">
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    Academics Program
                  </span>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-[#0A7A74] hover:underline transition-colors">
                    Research
                  </span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Clean subtle bottom bar */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Sir Ganga Ram Hospital. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Use</span>
            <span>·</span>
            <span>NABH Accredited</span>
            <span>·</span>
            <span>NABL Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
