import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  FileText,
  AlertCircle,
  Phone,
  Edit2,
  Camera,
  Save,
  ExternalLink,
  Sparkles,
  MapPin,
  Languages,
  Award,
  ShieldCheck,
  Building2,
  Eye,
  RefreshCw,
  Bell,
  Pin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const DoctorDashboardPage = () => {
  const { user, updateUserData } = useAuth();

  // Navigation tab: 'queue' or 'profile'
  const [activeTab, setActiveTab] = useState('queue');

  // Appointments
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [selectedApt, setSelectedApt] = useState(null);
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Doctor Clinical Notices & Circulars
  const [doctorNotices, setDoctorNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);

  // Doctor Profile state
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Profile Form state
  const [form, setForm] = useState({
    name: '',
    designation: '',
    departmentId: '',
    departmentName: '',
    qualification: '',
    experienceYears: 10,
    phone: '',
    email: '',
    dmcNo: '',
    consultationFee: 700,
    room: '',
    availableTimings: '',
    opdSchedule: '',
    availableDays: [],
    specializations: '',
    languages: '',
    image: '',
    bio: ''
  });

  // Fetch doctor profile
  const fetchDoctorProfile = async () => {
    setLoadingProfile(true);
    try {
      let foundDoc = null;

      // 1. If user has doctorId, try direct fetch
      if (user?.doctorId) {
        const res = await api.get(`/doctors/${user.doctorId}`).catch(() => null);
        if (res?.data?.success && res.data.data) {
          foundDoc = res.data.data;
        }
      }

      // 2. If not found, fetch all doctors and find by email or name
      if (!foundDoc) {
        const allDocsRes = await api.get('/doctors').catch(() => null);
        if (allDocsRes?.data?.success && Array.isArray(allDocsRes.data.data)) {
          const userEmail = (user?.email || '').toLowerCase();
          const userName = (user?.name || '').toLowerCase();

          foundDoc = allDocsRes.data.data.find(
            (d) =>
              (d.email && d.email.toLowerCase() === userEmail) ||
              (d.name && userName.includes(d.name.toLowerCase())) ||
              (d.name && d.name.toLowerCase().includes(userName))
          );

          // Fallback to first doctor if demo account
          if (!foundDoc && allDocsRes.data.data.length > 0) {
            foundDoc = allDocsRes.data.data[0];
          }
        }
      }

      if (foundDoc) {
        setDoctorProfile(foundDoc);
        setForm({
          name: foundDoc.name || '',
          designation: foundDoc.designation || '',
          departmentId: foundDoc.departmentId || '',
          departmentName: foundDoc.departmentName || '',
          qualification: foundDoc.qualification || '',
          experienceYears: foundDoc.experienceYears || 10,
          phone: foundDoc.phone || '',
          email: foundDoc.email || '',
          dmcNo: foundDoc.dmcNo || '',
          consultationFee: foundDoc.consultationFee || 700,
          room: foundDoc.room || '',
          availableTimings: foundDoc.availableTimings || '09:00 AM - 02:00 PM',
          opdSchedule: foundDoc.opdSchedule || 'Mon - Sat: 09:00 AM - 02:00 PM',
          availableDays: Array.isArray(foundDoc.availableDays) ? foundDoc.availableDays : ['Mon', 'Wed', 'Fri'],
          specializations: Array.isArray(foundDoc.specializations)
            ? foundDoc.specializations.join(', ')
            : foundDoc.specializations || '',
          languages: Array.isArray(foundDoc.languages)
            ? foundDoc.languages.join(', ')
            : foundDoc.languages || 'English, Hindi',
          image: foundDoc.image || '',
          bio: foundDoc.bio || ''
        });
      }
    } catch (err) {
      console.error('Error fetching doctor profile:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Fetch appointments
  const fetchDoctorAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const res = await api.get('/appointments');
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching doctor appointments:', err);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const fetchDoctorNotices = async () => {
    try {
      const docId = doctorProfile?.id || user?.doctorId || '';
      const res = await api.get(`/news?audience=doctors&doctorId=${docId}`);
      if (res.data?.success && Array.isArray(res.data.data)) {
        setDoctorNotices(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load doctor circulars:', err);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
    fetchDoctorProfile();
    fetchDoctorNotices();
  }, [user, doctorProfile?.id]);

  // Handle Note Save
  const handleSaveNotes = async (e) => {
    e.preventDefault();
    if (!selectedApt) return;

    try {
      const res = await api.put(`/appointments/${selectedApt.appointmentId}`, {
        doctorNotes: clinicalNotes,
        status: 'Completed'
      });
      if (res.data.success) {
        toast.success('Clinical notes recorded & appointment marked completed.');
        setSelectedApt(null);
        fetchDoctorAppointments();
      }
    } catch (err) {
      toast.error('Failed to save clinical notes');
    }
  };

  // Toggle Day helper
  const toggleDay = (day) => {
    setForm((prev) => {
      const days = prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day];
      return { ...prev, availableDays: days };
    });
  };

  // Save Doctor Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!doctorProfile?.id) {
      toast.error('Doctor profile identifier not found.');
      return;
    }

    setSavingProfile(true);
    try {
      const payload = {
        name: form.name.trim(),
        designation: form.designation.trim(),
        departmentName: form.departmentName.trim(),
        qualification: form.qualification.trim(),
        experienceYears: Number(form.experienceYears) || 10,
        phone: form.phone.trim(),
        email: form.email.trim(),
        dmcNo: form.dmcNo.trim(),
        consultationFee: Number(form.consultationFee) || 700,
        room: form.room.trim(),
        availableTimings: form.availableTimings.trim(),
        opdSchedule: form.opdSchedule.trim(),
        availableDays: form.availableDays,
        specializations: form.specializations
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        languages: form.languages
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        image: form.image.trim(),
        bio: form.bio.trim()
      };

      const res = await api.put(`/doctors/${doctorProfile.id}`, payload);
      if (res.data.success) {
        toast.success('Profile details & photo updated successfully in database!');
        setDoctorProfile(res.data.data);

        // Update top navbar and auth state
        if (updateUserData) {
          updateUserData({
            name: payload.name,
            avatar: payload.image
          });
        }
      }
    } catch (err) {
      console.error('Error updating doctor profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Doctor Info */}
      <div className="bg-gradient-to-r from-secondary via-secondary to-primary p-6 sm:p-8 rounded-3xl text-white shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5 z-10">
          {/* Doctor Avatar with Hover Badge */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-accent/40 bg-white/10 shadow-lg">
              <img
                src={form.image || doctorProfile?.image || user?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600'}
                alt={doctorProfile?.name || user?.name || 'Doctor'}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600';
                }}
              />
            </div>
            <button
              onClick={() => setActiveTab('profile')}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-accent text-accent-dark shadow-md hover:scale-110 transition-transform"
              title="Edit Profile Picture"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">
                Clinical Practitioner
              </span>
              {doctorProfile?.dmcNo && (
                <span className="text-[10px] text-slate-300 font-mono">DMC #{doctorProfile.dmcNo}</span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              {doctorProfile?.name || user?.name || 'Doctor'}
            </h2>
            <p className="text-xs text-slate-200">
              {doctorProfile?.designation || 'Senior Consultant'} · {doctorProfile?.departmentName || 'Brahm Shakti Hospital'}
            </p>
          </div>
        </div>

        {/* Quick Nav / Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
              activeTab === 'profile'
                ? 'bg-accent text-accent-dark shadow-lg ring-2 ring-white/30'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile &amp; Photo</span>
          </button>

          {doctorProfile?.id && (
            <Link
              to={`/doctors/${doctorProfile.id}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-white text-secondary hover:bg-slate-100 font-bold text-xs flex items-center gap-2 transition-all shadow-md"
              title="View Public Profile Page"
            >
              <ExternalLink className="w-4 h-4 text-primary" />
              <span>Public Profile ↗</span>
            </Link>
          )}

          <Link
            to="/admin/leaves"
            className="px-4 py-2.5 rounded-2xl bg-white/10 text-white hover:bg-white/20 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <Calendar className="w-4 h-4 text-accent" />
            <span>Leave Calendar</span>
          </Link>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-medical-border pb-2">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'queue'
              ? 'bg-primary text-white shadow-sm'
              : 'text-secondary hover:bg-medical-coolgray'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Patient Consultations ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-primary text-white shadow-sm'
              : 'text-secondary hover:bg-medical-coolgray'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Doctor Profile &amp; Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'notices'
              ? 'bg-primary text-white shadow-sm'
              : 'text-secondary hover:bg-medical-coolgray'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Clinical Circulars &amp; Notices ({doctorNotices.length})</span>
        </button>
      </div>

      {/* Tab 1: OPD Queue Table */}
      {activeTab === 'queue' && (
        <div className="bg-white rounded-2xl border border-medical-border shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-medical-border">
            <div>
              <h3 className="text-base font-bold text-secondary">My Assigned Patient Queue</h3>
              <p className="text-xs text-medical-muted">Review patient complaints, add clinical notes, and complete OPD consultations.</p>
            </div>
            <span className="text-xs font-bold text-primary">{appointments.length} Consultations</span>
          </div>

          {loadingAppointments ? (
            <div className="h-48 rounded-xl bg-medical-coolgray animate-shimmer"></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-bold">Slot Time</th>
                    <th className="py-3 px-4 font-bold">Patient Details</th>
                    <th className="py-3 px-4 font-bold">Symptoms / Chief Complaint</th>
                    <th className="py-3 px-4 font-bold">Type</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold text-right">Consultation Record</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-medical-border text-secondary">
                  {appointments.map((apt) => (
                    <tr key={apt.appointmentId} className="hover:bg-medical-coolgray/50">
                      <td className="py-3 px-4 font-bold text-primary">
                        {apt.timeSlot}
                        <span className="block text-[10px] text-medical-muted font-normal">{apt.date}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-secondary">{apt.patientName}</div>
                        <div className="text-[10px] text-medical-muted">{apt.patientAge} Yrs · {apt.gender} · {apt.patientPhone}</div>
                      </td>
                      <td className="py-3 px-4 text-medical-slate italic max-w-xs truncate">
                        "{apt.symptoms || 'General clinical review'}"
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {apt.appointmentType}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          apt.status === 'Completed' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-status-success'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedApt(apt);
                            setClinicalNotes(apt.doctorNotes || '');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-[11px] transition-all shadow-xs"
                        >
                          {apt.doctorNotes ? 'Edit Notes' : 'Examine & Note'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Doctor Profile & Settings Editor */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-medical-border shadow-soft p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-medical-border pb-5">
            <div>
              <h3 className="text-xl font-black text-secondary">Doctor Profile &amp; Image Settings</h3>
              <p className="text-xs text-medical-muted">
                Update your verified profile picture, clinical designations, OPD timings, and public credentials.
              </p>
            </div>

            {doctorProfile?.id && (
              <Link
                to={`/doctors/${doctorProfile.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F0FBFC] border border-[#B6EEF6] text-[#018AAE] text-xs font-bold hover:bg-[#018AAE] hover:text-white transition-all self-start sm:self-auto"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Public Profile ↗</span>
              </Link>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* 1. Profile Picture Editor Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-50/60 via-slate-50 to-teal-50/30 border border-slate-200 space-y-4">
              <span className="text-xs font-bold text-[#018AAE] uppercase tracking-wider block">
                Doctor Profile Picture
              </span>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Live Preview */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-[#018AAE] shadow-md bg-white shrink-0">
                  <img
                    src={form.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600'}
                    alt="Doctor preview"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600';
                    }}
                  />
                </div>

                <div className="space-y-2 flex-1 w-full text-xs">
                  <label className="font-bold text-slate-700 block">
                    Profile Image URL (Cloudinary or Direct Image URL)
                  </label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://res.cloudinary.com/.../doctor-photo.png"
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-medium focus:border-primary focus:outline-hidden"
                  />
                  <p className="text-[11px] text-slate-500">
                    Paste your Cloudinary image link or any secure image URL. Changes will render across hospital banners and department pages immediately upon saving.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Personal & Professional Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-600">Doctor Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Dr. S.K. Goyal"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-primary focus:outline-hidden font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-600">Designation</label>
                <input
                  type="text"
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  placeholder="Senior Consultant Physician"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-600">Department Name</label>
                <input
                  type="text"
                  value={form.departmentName}
                  onChange={(e) => setForm({ ...form, departmentName: e.target.value })}
                  placeholder="Internal Medicine & Diabetology"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-600">Medical Qualification</label>
                <input
                  type="text"
                  value={form.qualification}
                  onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                  placeholder="MBBS, MD (Medicine), DM"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-600">Experience (Years)</label>
                <input
                  type="number"
                  value={form.experienceYears}
                  onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                  min={1}
                  max={60}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-600">DMC Registration No.</label>
                <input
                  type="text"
                  value={form.dmcNo}
                  onChange={(e) => setForm({ ...form, dmcNo: e.target.value })}
                  placeholder="11847"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-600">Direct Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91-9811234001"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-600">Official Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="doctor@brahmshaktihospital.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-600">OPD Chamber / Room</label>
                <input
                  type="text"
                  value={form.room}
                  onChange={(e) => setForm({ ...form, room: e.target.value })}
                  placeholder="Chamber 101, Block A"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            {/* 3. OPD Timings & Available Days */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-600">OPD Timings Range</label>
                <input
                  type="text"
                  value={form.availableTimings}
                  onChange={(e) => setForm({ ...form, availableTimings: e.target.value })}
                  placeholder="09:00 AM - 02:00 PM"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-600">OPD Schedule Summary Text</label>
                <input
                  type="text"
                  value={form.opdSchedule}
                  onChange={(e) => setForm({ ...form, opdSchedule: e.target.value })}
                  placeholder="Mon - Sat: 09:00 AM - 02:00 PM (Room 101)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            {/* Available Days Checkboxes */}
            <div className="space-y-2 text-xs pt-1">
              <label className="font-bold uppercase text-slate-600 block">Available OPD Days</label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => {
                  const isChecked = form.availableDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                        isChecked
                          ? 'bg-[#018AAE] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {day} {isChecked && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Specializations & Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-600">
                  Specializations (Comma-separated)
                </label>
                <input
                  type="text"
                  value={form.specializations}
                  onChange={(e) => setForm({ ...form, specializations: e.target.value })}
                  placeholder="Diabetes, Hypertension, Metabolic Syndrome, Fever Triage"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-600">
                  Languages Spoken (Comma-separated)
                </label>
                <input
                  type="text"
                  value={form.languages}
                  onChange={(e) => setForm({ ...form, languages: e.target.value })}
                  placeholder="English, Hindi, Punjabi"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            {/* 5. Clinical Bio */}
            <div className="space-y-1 text-xs pt-1">
              <label className="font-bold uppercase text-slate-600">Doctor Biography &amp; Clinical Narrative</label>
              <textarea
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Comprehensive overview of clinical experience, medical philosophy, procedural expertise, and patient care commitment..."
                className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 focus:border-primary focus:outline-hidden"
              ></textarea>
            </div>

            {/* Submit & Publish Button */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#018AAE]" />
                <span>Changes will update live across public doctors list, search, and department pages.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={fetchDoctorProfile}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#018AAE] hover:bg-[#007595] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingProfile ? 'Saving Changes...' : 'Save & Publish Profile'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Clinical Circulars & Administrative Notices for Doctors */}
      {activeTab === 'notices' && (
        <div className="bg-white rounded-3xl border border-medical-border shadow-soft p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-medical-border">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Internal Medical Governance &amp; Directives</span>
              </div>
              <h3 className="text-xl font-black text-secondary">Clinical Bulletins &amp; Doctor Circulars</h3>
              <p className="text-xs text-medical-muted">
                Official medical protocols, audit announcements, and alerts distributed to hospital clinicians.
              </p>
            </div>
            <button
              onClick={fetchDoctorNotices}
              className="p-2 rounded-xl border border-medical-border text-secondary hover:bg-medical-coolgray self-start sm:self-auto cursor-pointer"
              title="Refresh Bulletins"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {doctorNotices.length === 0 ? (
            <div className="py-12 text-center text-medical-muted">
              <Bell className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-bold">No active circulars at this moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {doctorNotices.map((notice) => (
                <div
                  key={notice.id || notice._id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 hover:border-[#018AAE]/50 hover:bg-slate-50/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0 border border-slate-700 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-teal-300">
                        {notice.date ? new Date(notice.date).toLocaleDateString('en-US', { month: 'short' }) : 'NOV'}
                      </span>
                      <span className="text-base font-black leading-none mt-0.5">
                        {notice.date ? new Date(notice.date).getDate() : '22'}
                      </span>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {notice.refNumber && (
                          <span className="font-mono text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {notice.refNumber}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#F0FBFC] text-[#018AAE] border border-[#B6EEF6]/60">
                          {notice.category}
                        </span>
                        {notice.audience === 'specific_doctors' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Directly Assigned to You
                          </span>
                        )}
                        {notice.isNewBadge && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {notice.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {notice.summary || notice.excerpt}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedNotice(notice)}
                    className="px-4 py-2 rounded-xl bg-[#018AAE] text-white text-xs font-bold hover:bg-[#007595] transition-colors shrink-0 self-end sm:self-center cursor-pointer"
                  >
                    Read Circular
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notice Detail Modal for Doctor */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-medical-border">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {selectedNotice.refNumber || 'BSH/NOTICE'}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#F0FBFC] text-[#018AAE]">
                  {selectedNotice.category}
                </span>
              </div>
              <button onClick={() => setSelectedNotice(null)} className="text-medical-muted font-bold text-sm">✕</button>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-black text-secondary leading-snug">
                {selectedNotice.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-medical-muted">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  {selectedNotice.date}
                </span>
                <span>•</span>
                <span>By: {selectedNotice.author || 'Hospital Administration'}</span>
              </div>

              <div className="p-4 rounded-2xl bg-medical-coolgray font-mono text-xs text-secondary leading-relaxed whitespace-pre-line border border-medical-border">
                {selectedNotice.content || selectedNotice.summary}
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-5 py-2 rounded-xl bg-secondary text-white font-bold text-xs"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Notes Drawer / Modal */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-medical-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase">{selectedApt.appointmentId}</span>
                <h3 className="text-lg font-bold text-secondary">Clinical Record for {selectedApt.patientName}</h3>
              </div>
              <button onClick={() => setSelectedApt(null)} className="text-medical-muted font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleSaveNotes} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-medical-coolgray space-y-1">
                <div className="text-secondary font-bold">Chief Symptoms Reported:</div>
                <p className="text-medical-muted italic">"{selectedApt.symptoms || 'None reported'}"</p>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-medical-muted">Physician Clinical Findings &amp; Diagnosis</label>
                <textarea
                  rows={4}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Vitals: BP, Pulse. Examination findings, formal diagnosis, clinical follow-up timeline..."
                  required
                  className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden resize-none"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedApt(null)}
                  className="px-5 py-2.5 rounded-xl border border-secondary text-secondary font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-md"
                >
                  Save Notes &amp; Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboardPage;