import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldAlert, CheckCircle2, Phone, ArrowLeft, AlertTriangle } from 'lucide-react';

export const TermsOfUsePage = () => {
  return (
    <div className="min-h-screen bg-[#F0FBFC] space-y-10 sm:space-y-12 pb-20">
      {/* Header Banner - Seamless with Medical Theme & Common Background */}
      <section className="relative bg-gradient-to-r from-[#E0F8FC] via-[#F0FBFC] to-[#E9F9FC] border-b border-slate-200/60 py-10 sm:py-14 px-4 overflow-hidden">
        {/* Thematic Hospital / Medical Background Graphic */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="/images/banners/medical-bg-hospital.jpg"
            alt=""
            className="w-full h-full object-cover object-right sm:object-center opacity-25 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto space-y-3 relative z-10">
          {/* Breadcrumb & Pill - Clean, Centered, Fixed Alignment */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[#018AAE] hover:text-[#007595] uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <span className="text-slate-300">/</span>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#018AAE]/10 border border-[#018AAE]/25 text-[#018AAE] text-xs font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-[#018AAE]" />
              <span>Hospital Governance</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
            Terms of Use
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Terms, patient responsibilities, and conditions governing the use of Brahm Shakti Hospital's digital patient portal, appointment booking system, and hospital services.
          </p>
          <p className="text-xs text-slate-500">
            Last Updated: November 2026 · Managed by Brahm Shakti Trust (Regd.), Budh Vihar, New Delhi.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-10 text-slate-700 leading-relaxed text-sm sm:text-[15px]">

          {/* Section 1: Acceptance */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
              <span>1. Agreement to Terms</span>
            </h2>
            <p>
              By accessing, browsing, or utilizing the web portal of <strong>Brahm Shakti Hospital</strong> (accessible at brahmshaktihospital.netlify.app and official subdomains) or utilizing our appointment booking and diagnostic services, you agree to be bound by these Terms of Use and all applicable healthcare guidelines in Delhi, India.
            </p>
          </div>

          {/* Section 2: Medical Disclaimer */}
          <div className="space-y-3 p-5 rounded-2xl bg-amber-50/80 border border-amber-200">
            <h2 className="text-lg sm:text-xl font-black text-amber-900 tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>2. Emergency &amp; Medical Disclaimer</span>
            </h2>
            <p className="text-xs sm:text-sm text-amber-900/90">
              Information published on this website regarding specialties, surgical treatments, disease symptoms, and health guides is provided for educational and hospital transparency purposes only. <strong>It does not constitute formal medical diagnosis, clinical advice, or a physician-patient relationship.</strong>
            </p>
            <p className="text-xs sm:text-sm text-amber-900/90 font-medium">
              If you or someone in your care is experiencing an acute medical emergency, chest pain, difficulty breathing, or severe trauma, immediately contact our 24x7 Emergency Casualty Line at <strong>+91 7840089703</strong> or visit our 24-hour Casualty Desk at Pocket C, Budh Vihar Phase I directly.
            </p>
          </div>

          {/* Section 3: Appointments & Consultation Policies */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              3. Online Appointment Booking &amp; OPD Schedules
            </h2>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li>Online OPD slot booking reserves a consultation slot with the requested consultant subject to clinician availability and emergency surgeries.</li>
              <li>Doctor consultation schedules are subject to change without prior notice due to critical surgical emergencies or hospital rounds. In such cases, patients are promptly accommodated by visiting senior faculty or rescheduled at mutual convenience.</li>
              <li>Consultation tariffs and diagnostic fees charged by Brahm Shakti Hospital are subsidized under the charitable charter of <strong>Brahm Shakti Trust (Regd.)</strong>. All fees are clearly itemized on official printed computer receipts.</li>
            </ul>
          </div>

          {/* Section 4: Patient Rights & Conduct within Premises */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              4. Hospital Premises &amp; Patient Responsibilities
            </h2>
            <p>
              To maintain a safe, sterile, and respectful healing environment for all patients and medical professionals, visitors agree to adhere to the following hospital rules:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Silence &amp; Visitor Hours</h4>
                <p className="text-xs text-slate-500">Adhering strictly to designated IPD visiting hours (4:00 PM – 7:00 PM) to ensure uninterrupted healing and ICU sterility.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Zero Tolerance for Violence</h4>
                <p className="text-xs text-slate-500">Under the Delhi Medicare Service Personnel and Institutions Act, any verbal abuse, assault, or vandalism against medical staff is punishable by law.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <h4 className="font-bold text-slate-900 text-sm mb-1">No-Smoking Campus</h4>
                <p className="text-xs text-slate-500">The entire hospital building and surrounding grounds are strictly 100% tobacco, smoking, and alcohol-free zones.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Authentic Health Records</h4>
                <p className="text-xs text-slate-500">Patients and attendants must provide accurate previous medical histories, drug allergy records, and authentic identification documents.</p>
              </div>
            </div>
          </div>

          {/* Section 5: Diagnostic Reports & EMR Access */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              5. Diagnostic Lab Results &amp; UHID Security
            </h2>
            <p>
              Patients accessing laboratory reports or radiology scans via the website must safeguard their Unique Hospital ID (UHID) and registered mobile OTP. Brahm Shakti Hospital is not liable for unauthorized access resulting from the patient sharing login credentials or OTPs with third parties.
            </p>
          </div>

          {/* Section 6: Jurisdiction */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              6. Governing Law &amp; Legal Jurisdiction
            </h2>
            <p>
              These terms and any disputes relating to hospital services or portal access shall be governed exclusively by the laws of India and subject to the exclusive jurisdiction of the competent courts in <strong>New Delhi, Delhi, India</strong>.
            </p>
          </div>

          {/* Contact Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs sm:text-sm text-slate-800">
            <div className="font-bold text-slate-900">Hospital Administration &amp; Grievance Redressal</div>
            <div>Brahm Shakti Hospital, Pocket C, Budh Vihar Phase I, Pooth Kurd, New Delhi, Delhi, 110085</div>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a href="tel:01127531683" className="flex items-center gap-1.5 text-primary hover:underline font-semibold">
                <Phone className="w-4 h-4" />
                <span>011-27531683 (Admin Office)</span>
              </a>
              <Link to="/contact" className="text-primary hover:underline font-semibold">
                Contact Hospital Help Desk →
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default TermsOfUsePage;
