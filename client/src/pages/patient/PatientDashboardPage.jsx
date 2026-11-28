import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  CreditCard,
  FileText,
  Activity,
  CheckCircle2,
  Phone,
  PhoneCall,
  Printer,
  X,
  RefreshCw,
  Loader2,
  LogOut,
  LayoutDashboard,
  Headphones,
  FlaskConical,
  Receipt,
  Plus,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Download,
  Building2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const PatientDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Active navigation tab matching screenshot:
  // 'dashboard' | 'appointments' | 'payments' | 'labs' | 'support'
  const [activeTab, setActiveTab] = useState('dashboard');

  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reschedule modal state
  const [rescheduleFor, setRescheduleFor] = useState(null);
  const [rsDate, setRsDate] = useState('');
  const [rsSlot, setRsSlot] = useState('');
  const [rsSlots, setRsSlots] = useState([]);
  const [rsLoading, setRsLoading] = useState(false);
  const [rsSubmitting, setRsSubmitting] = useState(false);

  // Quick inquiry state for support tab
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSending, setSupportSending] = useState(false);

  // Fetch appointments and billing for this patient
  const fetchPatientData = async () => {
    try {
      const [aptRes, invRes] = await Promise.all([
        api.get('/appointments').catch(() => ({ data: { success: false, data: [] } })),
        api.get('/billing/invoices').catch(() => ({ data: { success: false, data: [] } }))
      ]);
      if (aptRes.data?.success) setAppointments(aptRes.data.data || []);
      if (invRes.data?.success) setInvoices(invRes.data.data || []);
    } catch (err) {
      console.error('Error fetching patient portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  const loadSlots = async (doctorId, date) => {
    if (!doctorId || !date) return;
    setRsLoading(true);
    setRsSlot('');
    try {
      const res = await api.get('/appointments/slots', { params: { doctorId, date } });
      if (res.data?.success) setRsSlots(res.data.data || []);
      else setRsSlots([]);
    } catch (err) {
      setRsSlots([]);
    } finally {
      setRsLoading(false);
    }
  };

  const handleCancel = async (apt) => {
    if (!window.confirm(`Cancel appointment ${apt.appointmentId} with Dr. ${apt.doctorName}?`)) return;
    try {
      const res = await api.put(`/appointments/${apt.appointmentId || apt._id}/cancel`, {
        cancellationReason: 'Cancelled by patient'
      });
      if (res.data?.success) {
        toast.success('Appointment cancelled successfully');
        fetchPatientData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleReschedule = async () => {
    if (!rsDate || !rsSlot) {
      toast.error('Select a new date and slot');
      return;
    }
    setRsSubmitting(true);
    try {
      const res = await api.put(`/appointments/${rescheduleFor.appointmentId || rescheduleFor._id}/reschedule`, {
        date: rsDate,
        timeSlot: rsSlot
      });
      if (res.data?.success) {
        toast.success('Appointment rescheduled successfully');
        setRescheduleFor(null);
        fetchPatientData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reschedule appointment');
    } finally {
      setRsSubmitting(false);
    }
  };

  const handleSendSupport = (e) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportSending(true);
    setTimeout(() => {
      setSupportSending(false);
      setSupportMessage('');
      toast.success('Your inquiry has been sent to the Hospital OPD Helpdesk. A coordinator will contact you shortly.');
    }, 500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // User identifiers
  const patientDisplayName = user?.name || 'Dev Patel';
  const firstName = patientDisplayName.split(' ')[0] || 'Patient';
  const patientUhid = user?.uhid || user?.patientId || '3850971';
  const avatarLetter = (firstName[0] || 'P').toUpperCase();

  // Mock Lab Reports for verified patient view
  const labReports = [
    {
      id: 'LAB-2026-8812',
      testName: 'Complete Blood Count (CBC) with Platelet Workup',
      date: '2026-11-20',
      status: 'Ready',
      normalRange: 'All parameters normal'
    },
    {
      id: 'LAB-2026-8794',
      testName: 'Lipid Profile & Serum Cholesterol',
      date: '2026-11-15',
      status: 'Ready',
      normalRange: 'Cholesterol within healthy limits'
    },
    {
      id: 'LAB-2026-8620',
      testName: 'Fasting Blood Glucose & HbA1c Glycated Hemoglobin',
      date: '2026-11-10',
      status: 'Ready',
      normalRange: 'HbA1c: 5.6% (Normal Non-Diabetic)'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-[#1E293B] flex flex-col font-sans selection:bg-[#018AAE] selection:text-white">
      {/* ================= DEDICATED PATIENT PORTAL HEADER (EXACT REFERENCE) ================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          {/* Left: Hospital Logo + Tagline */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group" title="Brahm Shakti Hospital Home">
              <img
                src="https://res.cloudinary.com/urzka7oz/image/upload/v1795244093/WhatsApp_Image_2026-11-20_at_10.36.32_PM-removebg-preview.png"
                alt="Brahm Shakti Hospital"
                className="h-10 sm:h-12 w-auto object-contain"
              />
              <div className="hidden sm:block border-l border-slate-200 pl-3">
                <div className="text-xs font-black tracking-wider text-[#0B2545] uppercase">
                  Patient Portal
                </div>
                <div className="text-[11px] font-medium text-[#018AAE] italic">
                  Trust of Generations
                </div>
              </div>
            </Link>
          </div>

          {/* Right: Patient Badge + Logout Button */}
          <div className="flex items-center gap-3">
            {/* Patient Badge Pill */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl py-1.5 px-3 flex items-center gap-2.5 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-[#018AAE] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {avatarLetter}
              </div>
              <div className="min-w-0 text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight truncate">
                  {patientDisplayName}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 truncate">
                  Reg No: <span className="font-mono text-[#018AAE]">{patientUhid}</span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:border-rose-400 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-white"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN TWO-COLUMN PORTAL LAYOUT ================= */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT SIDEBAR (EXACT MATCH TO SCREENSHOT) ================= */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3 space-y-1.5">
              {/* 1. Dashboard Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#018AAE] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard</span>
              </button>

              {/* 2. Appointment History Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('appointments')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'appointments'
                    ? 'bg-[#018AAE] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Appointment History</span>
              </button>

              {/* 3. Payment History Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('payments')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'payments'
                    ? 'bg-[#018AAE] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>Payment History</span>
              </button>

              {/* 4. Lab Reports Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('labs')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'labs'
                    ? 'bg-[#018AAE] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FlaskConical className="w-4 h-4 shrink-0" />
                <span>Lab Reports</span>
              </button>

              {/* 5. Support / Helpdesk Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('support')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                  activeTab === 'support'
                    ? 'bg-[#018AAE] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Headphones className="w-4 h-4 shrink-0" />
                <span>Support / Helpdesk</span>
              </button>
            </div>

            {/* Bottom Teal Emergency Contact Card (Matching Screenshot) */}
            <div className="bg-[#018AAE] text-white rounded-2xl p-4 shadow-sm space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4 text-white" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-teal-100">
                  Emergency Contact
                </div>
              </div>
              <a
                href="tel:01127531683"
                className="block text-sm font-black hover:underline tracking-tight pt-1"
              >
                011-27531683 / 7840089703
              </a>
            </div>

            {/* Quick Link to Book Appointment */}
            <Link
              to="/bookappointment"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-[#018AAE] text-[#018AAE] hover:bg-[#018AAE] hover:text-white font-bold text-xs transition-all shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Appointment</span>
            </Link>
          </aside>

          {/* ================= RIGHT MAIN CONTENT AREA ================= */}
          <div className="lg:col-span-9 space-y-6">
            {/* Welcome Banner (Matching Screenshot) */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Welcome,</span>
                <span className="text-[#018AAE]">{firstName}</span>
                <span className="text-2xl">👋</span>
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-500">
                Registration No:{' '}
                <strong className="text-slate-800 font-mono text-sm">{patientUhid}</strong>
              </p>
            </div>

            {/* ================= VIEW 1: DASHBOARD (QUICK ACTIONS & SUMMARY) ================= */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* QUICK ACTIONS CARD (EXACT REFERENCE MATCH) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 border-t-4 border-t-amber-500">
                  <h2 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider">
                    Quick Actions
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {/* 1. Appointment History Card */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('appointments')}
                      className="p-5 rounded-xl border border-slate-200 hover:border-[#018AAE] hover:shadow-md transition-all flex flex-col items-center text-center gap-3 bg-white cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#F0FBFC] text-[#018AAE] group-hover:bg-[#018AAE] group-hover:text-white flex items-center justify-center transition-colors">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        Appointment History
                      </span>
                    </button>

                    {/* 2. Payment History Card */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('payments')}
                      className="p-5 rounded-xl border border-slate-200 hover:border-[#018AAE] hover:shadow-md transition-all flex flex-col items-center text-center gap-3 bg-white cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#F0FBFC] text-[#018AAE] group-hover:bg-[#018AAE] group-hover:text-white flex items-center justify-center transition-colors">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        Payment History
                      </span>
                    </button>

                    {/* 3. Lab Reports Card */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('labs')}
                      className="p-5 rounded-xl border border-slate-200 hover:border-[#018AAE] hover:shadow-md transition-all flex flex-col items-center text-center gap-3 bg-white cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#F0FBFC] text-[#018AAE] group-hover:bg-[#018AAE] group-hover:text-white flex items-center justify-center transition-colors">
                        <FlaskConical className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        Lab Reports
                      </span>
                    </button>

                    {/* 4. Support / Helpdesk Card */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('support')}
                      className="p-5 rounded-xl border border-slate-200 hover:border-[#018AAE] hover:shadow-md transition-all flex flex-col items-center text-center gap-3 bg-white cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#F0FBFC] text-[#018AAE] group-hover:bg-[#018AAE] group-hover:text-white flex items-center justify-center transition-colors">
                        <Headphones className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        Support / Helpdesk
                      </span>
                    </button>
                  </div>

                  {/* Second Row of Quick Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Consultation Invoice Card */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('payments')}
                      className="p-4 rounded-xl border border-slate-200 hover:border-[#018AAE] hover:shadow-md transition-all flex items-center gap-3.5 bg-white cursor-pointer text-left group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-[#F0FBFC] text-[#018AAE] group-hover:bg-[#018AAE] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-800">
                          Consultation Invoices &amp; Receipts
                        </div>
                        <div className="text-[11px] text-slate-500">
                          View &amp; print OPD consultation payment vouchers
                        </div>
                      </div>
                    </button>

                    {/* Book Appointment Card */}
                    <Link
                      to="/bookappointment"
                      className="p-4 rounded-xl border border-slate-200 hover:border-[#018AAE] hover:shadow-md transition-all flex items-center gap-3.5 bg-white text-left group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-[#F0FBFC] text-[#018AAE] group-hover:bg-[#018AAE] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-800">
                          Schedule New Appointment
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Book senior consultant with instant confirmation
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Upcoming Appointments Summary */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider">
                      Upcoming Consultations
                    </h3>
                    <Link
                      to="/bookappointment"
                      className="text-xs font-bold text-[#018AAE] hover:underline"
                    >
                      Book Another Slot →
                    </Link>
                  </div>

                  {loading ? (
                    <div className="py-8 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#018AAE]" />
                    </div>
                  ) : appointments.filter((a) => a.status === 'Confirmed' || a.status === 'Pending').length === 0 ? (
                    <div className="py-8 text-center text-slate-500 space-y-3">
                      <Calendar className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="text-xs font-semibold">No upcoming appointments scheduled.</p>
                      <Link
                        to="/bookappointment"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#018AAE] text-white text-xs font-bold shadow-xs hover:bg-[#007595]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Book an Appointment</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {appointments
                        .filter((a) => a.status === 'Confirmed' || a.status === 'Pending')
                        .map((apt) => (
                          <div
                            key={apt.appointmentId || apt._id}
                            className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
                          >
                            <div className="space-y-0.5">
                              <div className="font-bold text-slate-900">{apt.doctorName}</div>
                              <div className="text-xs text-slate-500">
                                {apt.departmentName} ·{' '}
                                <span className="font-semibold text-emerald-700">
                                  {apt.date} · {apt.timeSlot}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                                {apt.status}
                              </span>
                              <button
                                type="button"
                                onClick={() => window.print()}
                                className="px-3 py-1 rounded-lg border border-slate-300 text-slate-700 hover:text-[#018AAE] text-xs font-semibold"
                              >
                                Print Slip
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= VIEW 2: APPOINTMENT HISTORY ================= */}
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h2 className="text-base font-black text-slate-900">Appointment History</h2>
                    <p className="text-xs text-slate-500">Record of your past and active doctor consultations.</p>
                  </div>
                  <Link
                    to="/bookappointment"
                    className="px-4 py-2 rounded-lg bg-[#018AAE] hover:bg-[#007595] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Book Appointment</span>
                  </Link>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#018AAE]" />
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <Calendar className="w-10 h-10 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">No appointments found in your patient record.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((apt) => (
                      <div
                        key={apt.appointmentId || apt._id}
                        className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-[#018AAE]">
                              {apt.appointmentId}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                apt.status === 'Confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : apt.status === 'Completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>
                          <div className="font-bold text-slate-900 text-sm">{apt.doctorName}</div>
                          <div className="text-xs text-slate-500">
                            {apt.departmentName} ·{' '}
                            <span className="font-semibold text-slate-700">
                              {apt.date} · {apt.timeSlot}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-[#018AAE]">
                            Fee: ₹{apt.fee || 700} (Subsidized Trust Rate)
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:text-[#018AAE] text-xs font-bold transition-colors bg-white shadow-2xs"
                          >
                            Print Slip
                          </button>
                          {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                            <button
                              type="button"
                              onClick={() => handleCancel(apt)}
                              className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors bg-white shadow-2xs"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= VIEW 3: PAYMENT HISTORY ================= */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h2 className="text-base font-black text-slate-900">Payment &amp; Billing History</h2>
                    <p className="text-xs text-slate-500">Official vouchers and consultation fee receipts.</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Registration: FREE (₹0)
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Sample / Real Receipts */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                    <div className="space-y-1">
                      <div className="font-mono text-xs font-black text-[#018AAE]">
                        RCP-2026-OPD-7819
                      </div>
                      <div className="font-bold text-slate-900">
                        OPD Doctor Consultation Fee (Subsidized Trust Rate)
                      </div>
                      <div className="text-xs text-slate-500">
                        Payment Mode: Hospital OPD Counter · Date: 2026-11-20
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                      <span className="text-base font-black text-slate-900">₹700</span>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3 py-1 rounded-lg border border-slate-300 text-slate-700 hover:text-[#018AAE] text-xs font-semibold bg-white"
                      >
                        Print Voucher
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                    <div className="space-y-1">
                      <div className="font-mono text-xs font-black text-[#018AAE]">
                        RCP-2026-REG-0001
                      </div>
                      <div className="font-bold text-slate-900">
                        Patient UHID Registration &amp; EMR Account Setup
                      </div>
                      <div className="text-xs text-slate-500">
                        Complimentary Trust Service · Status: Confirmed Active
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                      <span className="text-sm font-bold text-emerald-700">FREE (₹0)</span>
                      <span className="text-[10px] text-slate-400">Complimentary</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= VIEW 4: LAB REPORTS ================= */}
            {activeTab === 'labs' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <h2 className="text-base font-black text-slate-900">Diagnostic &amp; Pathology Reports</h2>
                    <p className="text-xs text-slate-500">NABL Accredited laboratory investigation results.</p>
                  </div>
                  <a
                    href="https://itd.oncquest.net/oncquest/design/onlinelab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#018AAE] text-[#018AAE] hover:bg-[#018AAE] hover:text-white text-xs font-bold transition-all"
                  >
                    <span>Oncquest Lab Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="space-y-3">
                  {labReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 text-xs sm:text-sm"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-500">{report.id}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {report.status}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900">{report.testName}</div>
                        <div className="text-xs text-slate-500">
                          Date: {report.date} · <span className="text-emerald-700 font-medium">{report.normalRange}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-[#018AAE] hover:border-[#018AAE] text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= VIEW 5: SUPPORT / HELPDESK ================= */}
            {activeTab === 'support' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 animate-in fade-in duration-150">
                <div className="pb-3 border-b border-slate-200">
                  <h2 className="text-base font-black text-slate-900">Hospital Patient Helpdesk</h2>
                  <p className="text-xs text-slate-500">24x7 Support channels, helplines, and consultation inquiries.</p>
                </div>

                {/* Contact Helpline Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-xs text-slate-800">24x7 Casualty &amp; Emergency</div>
                    <a href="tel:01127531683" className="block font-black text-sm text-rose-600 hover:underline">
                      011-27531683
                    </a>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-[#F0FBFC] text-[#018AAE] flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-xs text-slate-800">OPD Appointments Desk</div>
                    <a href="tel:7840089703" className="block font-black text-sm text-[#018AAE] hover:underline">
                      +91-7840089703
                    </a>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-xs text-slate-800">Official Helpdesk Email</div>
                    <a href="mailto:helpdesk@brahmshaktihospital.com" className="block font-bold text-xs text-blue-700 hover:underline">
                      helpdesk@brahmshaktihospital.com
                    </a>
                  </div>
                </div>

                {/* Direct Patient Inquiry Form */}
                <form onSubmit={handleSendSupport} className="space-y-3 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Submit Inquiry / Request Callback
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Describe your inquiry, doctor consultation query, or report assistance needed..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:border-[#018AAE] focus:outline-hidden resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={supportSending}
                      className="px-6 py-2.5 rounded-xl bg-[#018AAE] hover:bg-[#007595] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {supportSending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      <span>Send Inquiry</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ================= DEDICATED PORTAL FOOTER ================= */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="font-semibold text-center md:text-left">&copy; 2026 Brahm Shakti Hospital.</div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#73E0EF] bg-[#F0FBFC] text-[#018AAE] font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-[#018AAE]" />
            <span>NABH &amp; NABL Accredited</span>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-end gap-2 md:gap-4 text-xs font-medium w-full md:w-auto text-center">
            <a href="mailto:helpdesk@brahmshaktihospital.com" className="inline-flex items-center justify-center gap-1.5 hover:text-[#018AAE] transition-colors whitespace-nowrap text-center">
              <Mail className="w-3.5 h-3.5 text-[#018AAE] shrink-0" />
              <span>helpdesk@brahmshaktihospital.com</span>
            </a>
            <a href="tel:01127531683" className="inline-flex items-center justify-center gap-1.5 text-rose-600 font-bold hover:underline whitespace-nowrap text-center">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>011-27531683 / 7840089703</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PatientDashboardPage;
