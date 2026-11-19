import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  UserX,
  Stethoscope,
  Briefcase,
  FileText,
  MapPin,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const DoctorLeaveCalendarPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'list'

  // Current view month/year
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // November 2026

  // Modal State for adding new leave
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('2026-11-23');
  const [endDate, setEndDate] = useState('2026-11-25');
  const [substituteDoctor, setSubstituteDoctor] = useState('On-Call Emergency Specialist');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Selected date details modal
  const [dayModalDate, setDayModalDate] = useState(null);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [leavesRes, docsRes, deptsRes] = await Promise.all([
        api.get('/leaves').catch(() => ({ data: { success: false } })),
        api.get('/doctors').catch(() => ({ data: { success: false } })),
        api.get('/departments').catch(() => ({ data: { success: false } }))
      ]);

      if (leavesRes.data?.success) {
        setLeaves(leavesRes.data.data);
      } else {
        // Fallback demo leaves if offline
        setLeaves([
          {
            id: 'leave-001',
            doctorId: 'doc-ortho-03',
            doctorName: 'Dr. Dinesh Chand Sharma',
            departmentId: 'orthopaedics',
            departmentName: 'Orthopaedics & Joint Replacement',
            leaveType: 'Casual Leave',
            startDate: '2026-11-20',
            endDate: '2026-11-22',
            daysCount: 3,
            reason: 'Personal family obligation and out-of-town travel',
            substituteDoctor: 'Dr. Ravi Shankar Gupta',
            status: 'Approved'
          },
          {
            id: 'leave-002',
            doctorId: 'doc-gyn-01',
            doctorName: 'Dr. Manisha Jain',
            departmentId: 'gynae-obst',
            departmentName: 'Obstetrics & Gynaecology (Maternity)',
            leaveType: 'Conference / CME',
            startDate: '2026-11-25',
            endDate: '2026-11-27',
            daysCount: 3,
            reason: 'Attending National FOGSI Annual Obstetric Congress',
            substituteDoctor: 'Dr. Renu Gupta',
            status: 'Approved'
          },
          {
            id: 'leave-003',
            doctorId: 'doc-ped-02',
            doctorName: 'Dr. Satpal Yadav',
            departmentId: 'pediatrics',
            departmentName: 'Pediatrics & Neonatal Care (NICU)',
            leaveType: 'Medical Leave',
            startDate: '2026-11-18',
            endDate: '2026-11-21',
            daysCount: 4,
            reason: 'Viral bronchitis convalescence',
            substituteDoctor: 'Dr. Rupesh Sharma',
            status: 'Approved'
          },
          {
            id: 'leave-004',
            doctorId: 'doc-surg-02',
            doctorName: 'Dr. Rishabh Jain',
            departmentId: 'general-surgery',
            departmentName: 'General & Laparoscopic Surgery',
            leaveType: 'Casual Leave',
            startDate: '2026-11-28',
            endDate: '2026-11-30',
            daysCount: 3,
            reason: 'Family wedding event',
            substituteDoctor: 'Dr. Sanjeev Verma',
            status: 'Pending'
          },
          {
            id: 'leave-005',
            doctorId: 'doc-skin-02',
            doctorName: 'Dr. Swati Gupta',
            departmentId: 'skin',
            departmentName: 'Dermatology & Skin Care',
            leaveType: 'Vacation',
            startDate: '2026-12-05',
            endDate: '2026-12-09',
            daysCount: 5,
            reason: 'Annual family holiday',
            substituteDoctor: 'Dr. Anish Goel',
            status: 'Pending'
          }
        ]);
      }

      if (docsRes.data?.success) {
        setDoctors(docsRes.data.data);
        if (docsRes.data.data.length > 0 && !selectedDoctorId) {
          setSelectedDoctorId(docsRes.data.data[0].id);
        }
      }

      if (deptsRes.data?.success) {
        setDepartments(deptsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching leave calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Filter leaves
  const filteredLeaves = leaves.filter((l) => {
    if (selectedDept !== 'all' && l.departmentId !== selectedDept) return false;
    if (selectedStatus !== 'all' && l.status !== selectedStatus) return false;
    if (selectedType !== 'all' && l.leaveType !== selectedType) return false;
    return true;
  });

  // Calculate metrics
  const totalDoctorsCount = doctors.length || 20;
  const todayStr = '2026-11-20'; // Current simulated hospital date
  const onLeaveToday = leaves.filter(
    (l) => l.status === 'Approved' && l.startDate <= todayStr && l.endDate >= todayStr
  );
  const pendingApprovals = leaves.filter((l) => l.status === 'Pending');
  const onDutyCount = Math.max(0, totalDoctorsCount - onLeaveToday.length);

  // Month Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const resetToToday = () => {
    setCurrentDate(new Date(2026, 10, 1));
  };

  // Build calendar matrix
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Approve / Reject Leave
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/leaves/${id}`, { status: newStatus }).catch(() => null);
      setLeaves((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
      );
      toast.success(`Leave request ${newStatus.toLowerCase()} successfully`);
    } catch (err) {
      toast.error('Failed to update leave status');
    }
  };

  // Add / Apply Leave
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    const docObj = doctors.find((d) => d.id === selectedDoctorId);
    if (!docObj) {
      toast.error('Please select a doctor');
      return;
    }

    setSubmitting(true);
    const startD = new Date(startDate);
    const endD = new Date(endDate);
    const diffTime = Math.abs(endD - startD);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeavePayload = {
      id: `leave-${Date.now()}`,
      doctorId: docObj.id,
      doctorName: docObj.name,
      departmentId: docObj.departmentId,
      departmentName: docObj.departmentName,
      leaveType,
      startDate,
      endDate,
      daysCount: diffDays,
      reason: reason || 'Scheduled leave',
      substituteDoctor: substituteDoctor || 'On-Call Emergency Specialist',
      status: 'Approved',
      appliedOn: new Date().toISOString().split('T')[0]
    };

    try {
      await api.post('/leaves', newLeavePayload).catch(() => null);
      setLeaves((prev) => [newLeavePayload, ...prev]);
      toast.success(`Leave scheduled for ${docObj.name}`);
      setModalOpen(false);
      setReason('');
    } catch (err) {
      toast.error('Failed to schedule leave');
    } finally {
      setSubmitting(false);
    }
  };

  // Color helper by leave type
  const getBadgeStyle = (type, status) => {
    if (status === 'Pending') {
      return 'bg-amber-100 text-amber-900 border-amber-300';
    }
    switch (type) {
      case 'Casual Leave':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'Medical Leave':
        return 'bg-rose-100 text-rose-900 border-rose-200';
      case 'Conference / CME':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'Vacation':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Consultant Faculty Duty &amp; Roster</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Doctor Leave Calendar &amp; Duty Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Monitor doctor leaves, conference absences, emergency covering specialists, and daily clinic attendance across all 20 Brahm Shakti Hospital departments.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs sm:text-sm font-black transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Schedule Doctor Leave</span>
          </button>
        </div>
      </div>

      {/* 2. VIBRANT KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* On Duty Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-3xl shadow-lg shadow-emerald-600/20 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">
              Doctors on Duty Today
            </span>
            <div className="text-3xl font-black tracking-tight">
              {onDutyCount} <span className="text-base font-semibold text-emerald-200">/ {totalDoctorsCount}</span>
            </div>
            <div className="text-xs text-emerald-100 font-semibold flex items-center gap-1.5 pt-0.5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span>All 8 Specialties Staffed</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* On Leave Today */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-5 rounded-3xl shadow-lg shadow-amber-500/20 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-100">
              On Planned Leave
            </span>
            <div className="text-3xl font-black tracking-tight">
              {onLeaveToday.length} <span className="text-base font-semibold text-amber-200">Consultants</span>
            </div>
            <div className="text-xs text-amber-100 font-semibold pt-0.5">
              Duty Covered by Cross-Specialists
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <UserX className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-5 rounded-3xl shadow-lg shadow-indigo-600/20 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-100">
              Pending Approvals
            </span>
            <div className="text-3xl font-black tracking-tight">
              {pendingApprovals.length} <span className="text-base font-semibold text-indigo-200">Requests</span>
            </div>
            <div className="text-xs text-indigo-100 font-semibold pt-0.5">
              Requires Admin Sanction
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* 24x7 Emergency Cover */}
        <div className="bg-gradient-to-br from-rose-600 to-red-700 text-white p-5 rounded-3xl shadow-lg shadow-rose-600/20 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-100">
              Emergency Trauma Pool
            </span>
            <div className="text-3xl font-black tracking-tight">
              6 <span className="text-base font-semibold text-rose-200">On Call</span>
            </div>
            <div className="text-xs text-rose-100 font-semibold pt-0.5">
              Anaesthesia &amp; Surgery Ready
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* 3. CONTROLS, VIEW TOGGLE & FILTERS BAR */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-soft flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Month Navigator */}
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center min-w-44">
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              {monthNames[month]} {year}
            </h2>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              Hospital Master Schedule
            </span>
          </div>

          <button
            onClick={nextMonth}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={resetToToday}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Today
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end text-xs">
          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 text-slate-800 font-semibold focus:border-emerald-600 focus:outline-hidden"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 text-slate-800 font-semibold focus:border-emerald-600 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="Approved">Approved Leaves</option>
              <option value="Pending">Pending Review</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Calendar Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              List View
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN VIEW: CALENDAR GRID OR LIST VIEW */}
      {viewMode === 'calendar' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
          {/* Weekday Header */}
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center text-xs font-black text-slate-600 py-3 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 text-xs">
            {/* Empty days before start of month */}
            {[...Array(firstDayIndex)].map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[120px] bg-slate-50/50 p-2 text-slate-300"></div>
            ))}

            {/* Actual Month Days */}
            {[...Array(daysInMonth)].map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isToday = dateStr === todayStr;

              // Find leaves active on this day
              const dayLeaves = filteredLeaves.filter(
                (l) => l.startDate <= dateStr && l.endDate >= dateStr
              );

              return (
                <div
                  key={dayNum}
                  onClick={() => dayLeaves.length > 0 && setDayModalDate({ date: dateStr, leaves: dayLeaves })}
                  className={`min-h-[120px] p-2 sm:p-2.5 transition-colors flex flex-col justify-between ${
                    isToday ? 'bg-emerald-50/40 ring-2 ring-emerald-500 ring-inset' : 'hover:bg-slate-50/80'
                  } ${dayLeaves.length > 0 ? 'cursor-pointer' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        isToday ? 'bg-emerald-600 text-white font-black' : 'text-slate-700'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayLeaves.length > 0 && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {dayLeaves.length} on leave
                      </span>
                    )}
                  </div>

                  {/* Badges for doctors on leave this day */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayLeaves.slice(0, 2).map((l, lIdx) => (
                      <div
                        key={lIdx}
                        className={`text-[10px] font-bold p-1 rounded-lg border truncate ${getBadgeStyle(
                          l.leaveType,
                          l.status
                        )}`}
                        title={`${l.doctorName} - ${l.leaveType} (${l.status})`}
                      >
                        <span className="font-semibold">{l.doctorName.replace('Dr. ', '')}</span>
                        <span className="opacity-80 block text-[9px] -mt-0.5 truncate">
                          {l.leaveType}
                        </span>
                      </div>
                    ))}
                    {dayLeaves.length > 2 && (
                      <div className="text-[9px] font-bold text-emerald-700 text-center">
                        +{dayLeaves.length - 2} more doctors
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Doctor</th>
                  <th className="py-3.5 px-5 font-bold">Department</th>
                  <th className="py-3.5 px-5 font-bold">Leave Duration</th>
                  <th className="py-3.5 px-5 font-bold">Category &amp; Reason</th>
                  <th className="py-3.5 px-5 font-bold">Covering Specialist</th>
                  <th className="py-3.5 px-5 font-bold">Status</th>
                  <th className="py-3.5 px-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLeaves.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-emerald-600" />
                        <span>{l.doctorName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-emerald-700 font-semibold">
                      {l.departmentName}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900">
                        {l.startDate} to {l.endDate}
                      </div>
                      <div className="text-[10px] text-slate-400">({l.daysCount || 1} Days)</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border mb-1 ${getBadgeStyle(l.leaveType, l.status)}`}>
                        {l.leaveType}
                      </span>
                      <div className="text-[11px] text-slate-500 max-w-xs truncate">{l.reason}</div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-800 font-medium">
                      {l.substituteDoctor}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          l.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : l.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-1.5">
                      {l.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(l.id, 'Approved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(l.id, 'Rejected')}
                            className="px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-bold text-[10px] transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(l.id, 'Pending')}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[10px] transition-colors cursor-pointer"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. PENDING LEAVE APPLICATIONS ADMIN ACTION DECK */}
      {pendingApprovals.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border-2 border-amber-300/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Pending Leave Applications ({pendingApprovals.length})</h3>
                <p className="text-xs text-slate-500">Requires Medical Superintendent / Admin Sanction</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApprovals.map((req) => (
              <div key={req.id} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-sm">{req.doctorName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
                      {req.leaveType}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-emerald-800">{req.departmentName}</div>
                  <div className="text-xs text-slate-600 font-medium">
                    Dates: <strong>{req.startDate}</strong> to <strong>{req.endDate}</strong> ({req.daysCount} Days)
                  </div>
                  <div className="text-xs text-slate-500 italic">"{req.reason}"</div>
                  <div className="text-[11px] text-slate-600 pt-1">
                    Covering Doctor: <strong className="text-slate-800">{req.substituteDoctor}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-amber-200/60">
                  <button
                    onClick={() => handleUpdateStatus(req.id, 'Approved')}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sanction Leave</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                    className="flex-1 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: APPLY / SCHEDULE DOCTOR LEAVE */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Schedule Doctor Leave</h3>
                  <p className="text-xs text-slate-500">Record planned leaves &amp; assign shift cover</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
              {/* Doctor Select */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase text-slate-600 tracking-wider">
                  Select Consultant
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold focus:border-emerald-600 focus:outline-hidden"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.departmentName} ({d.category || 'In house'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Leave Type */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase text-slate-600 tracking-wider">
                  Leave Classification
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Medical Leave">Medical Leave</option>
                  <option value="Conference / CME">Conference / CME (National / International)</option>
                  <option value="Vacation">Annual Vacation</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                </select>
              </div>

              {/* Date Range in 2 Cols */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold uppercase text-slate-600 tracking-wider">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-semibold focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold uppercase text-slate-600 tracking-wider">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    min={startDate}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-semibold focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Covering Doctor */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase text-slate-600 tracking-wider">
                  Substitute Doctor on Duty (OPD &amp; Emergency Cover)
                </label>
                <input
                  type="text"
                  value={substituteDoctor}
                  onChange={(e) => setSubstituteDoctor(e.target.value)}
                  placeholder="e.g. Dr. Sanjeev Verma"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              {/* Reason */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase text-slate-600 tracking-wider">
                  Reason / Purpose
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  placeholder="e.g. Out of town for medical seminar / personal obligation"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md shadow-emerald-600/25 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Recording...' : 'Confirm Leave Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DAY DETAILS POPUP */}
      {dayModalDate && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Doctor Leaves for {dayModalDate.date}
                </h3>
                <p className="text-xs text-slate-500">{dayModalDate.leaves.length} Consultant(s) on Leave</p>
              </div>
              <button
                onClick={() => setDayModalDate(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {dayModalDate.leaves.map((l, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{l.doctorName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getBadgeStyle(l.leaveType, l.status)}`}>
                      {l.leaveType}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold">{l.departmentName}</div>
                  <div className="text-slate-600 text-[11px] italic">"{l.reason}"</div>
                  <div className="text-slate-500 text-[10px] pt-1">
                    Cover: <strong>{l.substituteDoctor}</strong> · Duration: {l.startDate} to {l.endDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorLeaveCalendarPage;
