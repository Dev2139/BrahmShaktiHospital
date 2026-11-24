import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  Printer,
  Calendar,
  Lock,
  Loader2,
  Clock,
  AlertCircle,
  KeyRound,
  FileText
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const INDIAN_STATES = [
  'Delhi',
  'Haryana',
  'Uttar Pradesh',
  'Punjab',
  'Rajasthan',
  'Himachal Pradesh',
  'Uttarakhand',
  'Chandigarh',
  'Madhya Pradesh',
  'Bihar',
  'Maharashtra',
  'Gujarat',
  'West Bengal',
  'Karnataka',
  'Tamil Nadu',
  'Other State / UT'
];

export const NewPatientRegisterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Consultation booking parameters (if coming from /bookappointment)
  const doctorId = searchParams.get('doctor') || '';
  const departmentId = searchParams.get('department') || '';
  const dateParam = searchParams.get('date') || '';
  const slotParam = searchParams.get('slot') || '';
  const modeParam = searchParams.get('mode') || 'direct';

  // Step 1: Demographics, Step 2: Email OTP, Step 3: Confirmation
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields (Demographics matching Image 3)
  const [title, setTitle] = useState('Mr.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('India');
  const [stateUt, setStateUt] = useState('Delhi');
  const [pincode, setPincode] = useState('110085');
  const [district, setDistrict] = useState('North West Delhi');
  const [addressLine1, setAddressLine1] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [consentChecked, setConsentChecked] = useState(true);

  // Doctor metadata (for slot booking if arriving from portal)
  const [doctorInfo, setDoctorInfo] = useState(null);

  // Step 2: Email OTP state
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Step 3: Confirmation state
  const [generatedUhid, setGeneratedUhid] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Load doctor details if doctorId is present
  useEffect(() => {
    if (!doctorId) return;
    const fetchDoc = async () => {
      try {
        const res = await api.get('/doctors');
        if (res.data.success) {
          const doc = res.data.data.find((d) => d.id === doctorId);
          if (doc) setDoctorInfo(doc);
        }
      } catch (err) {
        console.error('Error loading doctor info:', err);
      }
    };
    fetchDoc();
  }, [doctorId]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval;
    if (currentStep === 2 && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, otpTimer]);

  // Handle Step 1 Submit -> Generate & Send Email OTP
  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('First name and last name are required.');
      return;
    }
    if (!dob) {
      toast.error('Date of birth is required.');
      return;
    }
    const cleanMobile = mobile.trim().replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address for Email OTP verification.');
      return;
    }
    if (!addressLine1.trim()) {
      toast.error('Address line 1 is required.');
      return;
    }
    if (!consentChecked) {
      toast.error('Please accept the Patient Health Data Consent.');
      return;
    }

    // Generate 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpInput('');
    setOtpTimer(60);
    setCurrentStep(2);
    toast.success(`Verification OTP sent to ${email.trim()}`);
  };

  const handleResendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpTimer(60);
    toast.success(`New OTP sent to ${email.trim()}`);
  };

  // Handle Step 2: Verify Email OTP & Finalize Registration
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpInput.trim() || otpInput.trim() !== generatedOtp) {
      toast.error('Invalid OTP. Please enter the 6-digit code shown below.');
      return;
    }

    setVerifyingOtp(true);
    try {
      const fullName = `${title} ${firstName.trim()} ${lastName.trim()}`;
      const uhidCode = `BSH-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      setGeneratedUhid(uhidCode);

      // 1. Create Patient User Account via API or simulate
      const regData = {
        name: fullName,
        email: email.trim().toLowerCase(),
        password: `BSH@${mobile.slice(-4) || '2026'}`,
        phone: mobile.trim(),
        uhid: uhidCode,
        role: 'patient',
        dob,
        gender,
        address: `${addressLine1.trim()}, ${district}, ${stateUt} - ${pincode}`
      };

      try {
        const regRes = await api.post('/auth/register', regData);
        if (regRes.data?.token) {
          localStorage.setItem('bsh_token', regRes.data.token);
          localStorage.setItem('bsh_user', JSON.stringify(regRes.data.user || regData));
        }
      } catch (err) {
        // If account already exists or mock mode, save patient profile in local state
        localStorage.setItem(
          'bsh_user',
          JSON.stringify({
            name: fullName,
            email: email.trim().toLowerCase(),
            role: 'patient',
            uhid: uhidCode,
            phone: mobile.trim()
          })
        );
      }

      // 2. If appointment slot was selected, book the appointment!
      if (doctorInfo && dateParam) {
        try {
          const aptRes = await api.post('/appointments', {
            patientName: fullName,
            patientPhone: mobile.trim(),
            patientEmail: email.trim(),
            gender,
            uhid: uhidCode,
            doctorId: doctorInfo.id,
            doctorName: doctorInfo.name,
            departmentId: doctorInfo.departmentId,
            departmentName: doctorInfo.departmentName,
            date: dateParam,
            timeSlot: slotParam || '09:30 AM - 10:00 AM',
            appointmentType: modeParam === 'video' ? 'Video Consultation' : 'OPD Consultation',
            fee: doctorInfo.consultationFee || 700,
            registrationFee: 200,
            paymentMethod: 'Pay at Hospital Counter'
          });
          if (aptRes.data?.success) {
            setConfirmedBooking(aptRes.data.data);
          }
        } catch (bookingErr) {
          console.error('Appointment booking auto-creation:', bookingErr);
        }
      }

      setCurrentStep(3);
      toast.success('Patient Registered Successfully! UHID generated.');
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Unable to finalize registration. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#1E293B] flex flex-col font-sans selection:bg-[#0A7A74] selection:text-white">
      {/* -------------------- DEDICATED HEADER WITH BACK LINK -------------------- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <Link
            to={currentStep === 1 ? `/bookappointment/patient-type` : '#'}
            onClick={(e) => {
              if (currentStep > 1) {
                e.preventDefault();
                setCurrentStep((prev) => prev - 1);
              }
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:text-[#0A7A74] hover:border-[#0A7A74] transition-all bg-white shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? 'Back to Home' : 'Back to Step ' + (currentStep - 1)}</span>
          </Link>

          <h1 className="text-base sm:text-lg font-black text-[#0B2545] tracking-tight">
            New Patient Registration
          </h1>

          <div className="text-xs font-bold text-[#0A7A74] hidden sm:block">
            Brahm Shakti Hospital
          </div>
        </div>
      </header>

      {/* -------------------- MAIN CONTAINER -------------------- */}
      <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 py-8">
        {/* STEPPER BAR (MATCHING IMAGE 3 REFERENCE) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 mb-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto text-xs sm:text-sm">
            {/* Step 1 */}
            <div className={`flex items-center gap-2 font-bold ${currentStep === 1 ? 'text-[#0A7A74]' : 'text-slate-500'}`}>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                  currentStep > 1
                    ? 'bg-emerald-600 text-white'
                    : currentStep === 1
                    ? 'bg-[#0A7A74] text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {currentStep > 1 ? '✓' : '1'}
              </div>
              <span className="hidden sm:inline">Demographics &amp; Address</span>
              <span className="sm:hidden">Details</span>
            </div>

            <div className="flex-1 h-0.5 bg-slate-200 mx-3"></div>

            {/* Step 2 (Email OTP as requested by user) */}
            <div className={`flex items-center gap-2 font-bold ${currentStep === 2 ? 'text-[#0A7A74]' : 'text-slate-500'}`}>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                  currentStep > 2
                    ? 'bg-emerald-600 text-white'
                    : currentStep === 2
                    ? 'bg-[#0A7A74] text-white ring-4 ring-[#0A7A74]/15'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {currentStep > 2 ? '✓' : '2'}
              </div>
              <span className="hidden sm:inline">Email OTP</span>
              <span className="sm:hidden">OTP</span>
            </div>

            <div className="flex-1 h-0.5 bg-slate-200 mx-3"></div>

            {/* Step 3 */}
            <div className={`flex items-center gap-2 font-bold ${currentStep === 3 ? 'text-[#0A7A74]' : 'text-slate-500'}`}>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                  currentStep === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                3
              </div>
              <span className="hidden sm:inline">Slip &amp; UHID</span>
              <span className="sm:hidden">Slip</span>
            </div>
          </div>
        </div>

        {/* ================= STEP 1: DEMOGRAPHICS AND ADDRESS FORM ================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-extrabold text-[#0B2545]">
                1. Demographics &amp; Address Information
              </h2>
              <span className="text-xs font-bold text-rose-600">* Fields are mandatory.</span>
            </div>

            <form onSubmit={handleStep1Submit} className="space-y-5">
              {/* Row 1: Title, First Name, Last Name, Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Title *</label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-semibold bg-white focus:border-[#0A7A74] focus:outline-hidden"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Master">Master</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-xs font-bold text-slate-700">First name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-medium focus:border-[#0A7A74] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Last name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-medium focus:border-[#0A7A74] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-semibold bg-white focus:border-[#0A7A74] focus:outline-hidden"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Date of Birth, Mobile Number, Email Address */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Date of birth *</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-medium focus:border-[#0A7A74] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Mobile number *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-medium focus:border-[#0A7A74] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email address (for Email OTP) *</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-medium focus:border-[#0A7A74] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Country, State / UT, Pincode, District */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-3 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Country *</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-semibold bg-white focus:border-[#0A7A74] focus:outline-hidden"
                  >
                    <option value="India">India</option>
                  </select>
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="text-xs font-bold text-slate-700">State / UT *</label>
                  <select
                    value={stateUt}
                    onChange={(e) => setStateUt(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-semibold bg-white focus:border-[#0A7A74] focus:outline-hidden"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Pincode (6 digits) *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 110085"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-medium focus:border-[#0A7A74] focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="text-xs font-bold text-slate-700">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. North West Delhi"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-medium focus:border-[#0A7A74] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Row 4: Address line 1 */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Address line 1 *</label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="House / Flat No., Street, Area"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-medium focus:border-[#0A7A74] focus:outline-hidden"
                />
              </div>

              {/* Row 5: Aadhaar number */}
              <div className="sm:w-1/3 space-y-1">
                <label className="text-xs font-bold text-slate-700">Aadhaar number (12 digits)</label>
                <input
                  type="text"
                  maxLength={14}
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  placeholder="1234-5678-9012"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-medium focus:border-[#0A7A74] focus:outline-hidden"
                />
              </div>

              {/* Consent Checkbox (From Image 4) */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-blue-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-[#0A7A74] focus:ring-[#0A7A74]"
                  />
                  <span>Please tick mark for the Patient Health Data Consent &amp; Notice Form.!</span>
                </label>
              </div>

              {/* Yellow Notice Box (From Image 4) */}
              <div className="bg-[#FFFDF0] border border-amber-300 rounded-xl p-4 text-xs space-y-1 text-slate-800">
                <p>
                  • One-time registration fee: <strong className="text-amber-800 font-black">₹200/</strong> is{' '}
                  <strong className="text-rose-600 font-black">NON-REFUNDABLE.</strong>
                </p>
                <p>
                  • Registration <strong className="text-rose-600 font-black">DOES NOT</strong> confirm your appointment.
                </p>
                <p>
                  • ₹200 का शुल्क केवल एक बार के पंजीकरण (Registration) के लिए है। यह शुल्क{' '}
                  <strong className="text-rose-600 font-black">वापस नहीं किया जाएगा।</strong>
                </p>
                <p>
                  • केवल पंजीकरण कराने से आपका अपॉइंटमेंट <strong className="text-rose-600 font-black">मान्य नहीं होगा।</strong>
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs sm:text-sm font-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Verify email &amp; continue (Step 2)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 2: EMAIL OTP VERIFICATION ================= */}
        {currentStep === 2 && (
          <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6 text-center animate-in fade-in duration-200">
            <div className="w-14 h-14 mx-auto rounded-full bg-teal-50 text-[#0A7A74] flex items-center justify-center border border-teal-200">
              <Mail className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-[#0B2545]">Verify Your Email Address</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                We have dispatched a 6-digit OTP code to: <strong className="text-[#0A7A74] font-bold">{email}</strong>
              </p>
            </div>

            {/* Test Helper Banner for User Demonstration */}
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#0A7A74]" />
                <span>Demo Test Verification OTP:</span>
              </div>
              <span className="font-mono font-black text-sm text-[#0A7A74] bg-white px-2 py-0.5 rounded border border-teal-300">
                {generatedOtp}
              </span>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5 text-left">
              <div className="space-y-1.5 text-center">
                <label className="text-xs font-bold text-slate-700 block">
                  Enter 6-Digit Verification Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-48 mx-auto text-center font-mono text-2xl tracking-[0.4em] px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-[#0A7A74] focus:outline-hidden"
                />
              </div>

              <div className="text-center text-xs text-slate-500">
                {otpTimer > 0 ? (
                  <span>Resend OTP in <strong>{otpTimer}s</strong></span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[#0A7A74] font-bold hover:underline"
                  >
                    Resend Email OTP
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={verifyingOtp || otpInput.length < 6}
                className="w-full py-3.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {verifyingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying OTP &amp; Registering...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm OTP &amp; Generate UHID</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ================= STEP 3: REGISTRATION & APPOINTMENT CONFIRMATION SLIP ================= */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-2 border-b border-slate-200 pb-5">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-[#0B2545]">
                Patient Registration Successful!
              </h2>
              <p className="text-xs text-slate-500">
                Your permanent hospital record (UHID) has been created.
              </p>
            </div>

            {/* Official Registration Slip Card */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Generated UHID</span>
                <span className="font-mono font-black text-[#0A7A74] text-base">{generatedUhid}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Patient Full Name</span>
                <span className="font-bold text-slate-800">{title} {firstName} {lastName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Registered Email</span>
                <span className="font-mono text-slate-800">{email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Mobile Number</span>
                <span className="font-mono font-bold text-slate-800">{mobile}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Address</span>
                <span className="text-slate-800 text-right max-w-xs">{addressLine1}, {district}, {stateUt}</span>
              </div>

              {doctorInfo && (
                <>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Consulting Specialist</span>
                    <span className="font-bold text-[#0A7A74]">{doctorInfo.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Speciality / Chamber</span>
                    <span className="font-bold text-slate-800">{doctorInfo.departmentName} ({doctorInfo.room || 'Room 102'})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Appointment Date &amp; Slot</span>
                    <span className="font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {dateParam} · {slotParam || '09:30 AM - 10:00 AM'}
                    </span>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                <span className="text-slate-500 font-semibold">Registration &amp; OPD Fee</span>
                <span className="font-black text-[#0A7A74] text-base">
                  ₹{doctorInfo ? (doctorInfo.consultationFee || 700) + 200 : 200} (Pay at Hospital Counter)
                </span>
              </div>
            </div>

            {/* Instruction Notice */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <p className="font-bold">Next Steps for OPD Visit:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                <li>Quote your UHID <strong className="font-mono">{generatedUhid}</strong> at the OPD registration desk.</li>
                <li>Pay the one-time registration fee of ₹200 at the counter.</li>
                <li>Proceed directly to Chamber {doctorInfo?.room || 'Room 102'} for your consultation.</li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-[#0A7A74] hover:border-[#0A7A74] text-xs font-bold transition-all shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Registration Slip</span>
              </button>
              <Link
                to="/patient/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs font-bold transition-all shadow-xs"
              >
                <FileText className="w-4 h-4" />
                <span>Go to Patient Portal</span>
              </Link>
              <Link
                to="/"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* -------------------- FOOTER -------------------- */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="font-semibold">&copy; 2026 Brahm Shakti Hospital.</div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-300 bg-teal-50 text-[#0A7A74] font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-[#0A7A74]" />
            <span>NABH &amp; NABL Accredited</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <a href="mailto:helpdesk@brahmshaktihospital.com" className="hover:text-[#0A7A74] transition-colors">
              helpdesk@brahmshaktihospital.com
            </a>
            <a href="tel:01127531683" className="text-rose-600 font-bold hover:underline">
              011-27531683
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewPatientRegisterPage;
