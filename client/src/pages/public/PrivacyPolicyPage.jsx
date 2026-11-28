import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, FileText, CheckCircle2, Phone, Mail, ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage = () => {
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
              <Lock className="w-3.5 h-3.5 text-[#018AAE]" />
              <span>Legal &amp; Data Protection</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Brahm Shakti Hospital &amp; Research Centre (Managed by Brahm Shakti Trust) is committed to protecting the confidentiality, dignity, and personal health data of our patients, visitors, and website users.
          </p>
          <p className="text-xs text-slate-500">
            Effective Date: November 2026 · Compliant with Indian Information Technology Act (2000), Digital Personal Data Protection Act (DPDP 2023), and NABH Patient Safety Standards.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-10 text-slate-700 leading-relaxed text-sm sm:text-[15px]">

          {/* Section 1: Overview */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              When you use our portal, register as an inpatient or outpatient, request an appointment, or access digital lab results, Brahm Shakti Hospital collects relevant clinical and demographic information necessary to provide tertiary healthcare services:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li><strong>Personal Identifiers:</strong> Patient Full Name, Age, Gender, Date of Birth, Guardian / Attendant Details, Government Identity proofs (Aadhaar, Voter ID, Passport for international travelers).</li>
              <li><strong>Contact Information:</strong> Residential Address, Mobile Telephone Number, Emergency Contact, and Email ID.</li>
              <li><strong>Clinical &amp; Health Records:</strong> Medical history, consultation notes, prescription history, diagnostic laboratory results, radiology imaging (X-Ray, CT Scan, Ultrasound), and surgical consent records.</li>
              <li><strong>Financial &amp; Billing Data:</strong> Payment transaction receipts, insurance TPA claims, and government scheme beneficiary IDs (Ayushman Bharat, ECHS, CGHS where applicable).</li>
            </ul>
          </div>

          {/* Section 2: How We Use Your Information */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-primary shrink-0" />
              <span>2. Purpose of Data Processing</span>
            </h2>
            <p>
              Your data is collected strictly for lawful medical, diagnostic, and administrative purposes in accordance with Indian healthcare regulations:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Clinical Excellence &amp; Triage
                </h4>
                <p className="text-xs text-slate-500">Delivering accurate clinical consultations, surgical planning, emergency casualty response, and continuous medical monitoring.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Digital Lab &amp; Prescriptions
                </h4>
                <p className="text-xs text-slate-500">Allowing patients to securely view, download, and verify computerized pathology and biochemistry reports via Unique Hospital ID (UHID).</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Statutory Healthcare Reporting
                </h4>
                <p className="text-xs text-slate-500">Fulfilling mandatory public health reporting obligations mandated by the Directorate of Health Services (DGHS) and Delhi Medical Council.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Emergency Contact &amp; Reminders
                </h4>
                <p className="text-xs text-slate-500">Sending SMS reminders for upcoming OPD follow-ups, immunization schedules, blood donor matching, and critical clinical alerts.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Confidentiality & Zero Data Selling */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              3. Patient Confidentiality &amp; No Commercial Sharing
            </h2>
            <p>
              Brahm Shakti Hospital operates under the philanthropic ethos of <strong>Brahm Shakti Trust (Regd.)</strong>. We do <strong>NOT</strong> sell, rent, lease, or trade personal or medical records to pharmaceutical marketing agencies, third-party advertisers, or data brokers under any circumstances.
            </p>
            <p>
              Data is disclosed only to treating healthcare professionals, authorized diagnostic personnel, legal authorities when subpoenaed under valid court orders, or insurance TPAs upon the patient's explicit written authorization for cashless claim settlement.
            </p>
          </div>

          {/* Section 4: Data Security Protocols */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              4. Technical &amp; Infrastructure Safeguards
            </h2>
            <p>
              All patient portal communications, appointments, and diagnostic data transmissions are encrypted using standard Transport Layer Security (TLS 1.3 / HTTPS). Our Electronic Medical Records (EMR) are stored within protected, role-based access-controlled environments audited under NABH standards.
            </p>
          </div>

          {/* Section 5: Patient Rights & Redressal */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              5. Your Rights &amp; Medical Record Requests
            </h2>
            <p>
              Under medical ethics and consumer laws, patients have the right to inspect their diagnostic records, request physical discharge summaries, seek second opinions, and request corrections to their demographic data.
            </p>
            <p>
              For any medical record inquiries, data corrections, or grievances, please contact our Hospital Information &amp; Medical Records Department (MRD):
            </p>
            <div className="p-5 rounded-2xl bg-[#F0FBFC]/70 border border-[#B6EEF6]/80 space-y-2 text-xs sm:text-sm text-slate-800">
              <div className="font-bold text-slate-900">Brahm Shakti Hospital Grievance &amp; Privacy Officer</div>
              <div>U-1/78, Budh Vihar, Main Kanjhawala Road, Delhi-110086</div>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a href="mailto:brahmshaktihospital@gmail.com" className="flex items-center gap-1.5 text-primary hover:underline font-semibold">
                  <Mail className="w-4 h-4" />
                  <span>brahmshaktihospital@gmail.com</span>
                </a>
                <a href="tel:7982897603" className="flex items-center gap-1.5 text-primary hover:underline font-semibold">
                  <Phone className="w-4 h-4" />
                  <span>7982897603 / 8423934205</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
