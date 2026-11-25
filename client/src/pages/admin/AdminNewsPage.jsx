import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Search,
  X,
  Eye,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Pin,
  Calendar,
  Building2,
  Users,
  Stethoscope,
  Globe,
  Tag,
  ShieldCheck,
  Send,
  Layers,
  Clock
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminNewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [previewNotice, setPreviewNotice] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Patient Advisory');
  const [refNumber, setRefNumber] = useState('');
  const [audience, setAudience] = useState('patients'); // 'all', 'patients', 'doctors', 'specific_doctors'
  const [selectedDoctorIds, setSelectedDoctorIds] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPinned, setIsPinned] = useState(false);
  const [isNewBadge, setIsNewBadge] = useState(true);
  const [status, setStatus] = useState('published');
  const [author, setAuthor] = useState('Brahm Shakti Hospital Administration');

  const CATEGORIES = [
    'Patient Advisory',
    'Public Notice',
    'OPD Schedule',
    'Clinical Advisory',
    'Administrative Circular',
    'Health Campaign',
    'Statutory Notice'
  ];

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/news?allAudience=true');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setNewsList(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load notices:', err);
      toast.error('Could not load circulars');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setDoctorsList(res.data.data);
      }
    } catch (err) {
      console.warn('Doctors list load fallback:', err);
    }
  };

  useEffect(() => {
    fetchNotices();
    fetchDoctors();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setSummary('');
    setContent('');
    setCategory('Patient Advisory');
    setRefNumber(`BSH/PUB/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`);
    setAudience('patients');
    setSelectedDoctorIds([]);
    setDate(new Date().toISOString().split('T')[0]);
    setIsPinned(false);
    setIsNewBadge(true);
    setStatus('published');
    setAuthor('Medical Superintendent Office');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id || item._id);
    setTitle(item.title || '');
    setSummary(item.summary || item.excerpt || '');
    setContent(item.content || item.summary || item.excerpt || '');
    setCategory(item.category || 'Patient Advisory');
    setRefNumber(item.refNumber || '');
    setAudience(item.audience || 'all');
    setSelectedDoctorIds(Array.isArray(item.targetDoctorIds) ? item.targetDoctorIds : []);
    setDate(item.date || new Date().toISOString().split('T')[0]);
    setIsPinned(Boolean(item.isPinned));
    setIsNewBadge(item.isNewBadge !== undefined ? Boolean(item.isNewBadge) : true);
    setStatus(item.status || 'published');
    setAuthor(item.author || 'Brahm Shakti Hospital Administration');
    setIsModalOpen(true);
  };

  const toggleDoctorSelection = (docId) => {
    setSelectedDoctorIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      toast.error('Please fill in both the circular Title and Summary.');
      return;
    }

    if (audience === 'specific_doctors' && selectedDoctorIds.length === 0) {
      toast.error('Please select at least one doctor for specific distribution.');
      return;
    }

    // Resolve doctor names
    const doctorNames = doctorsList
      .filter((d) => selectedDoctorIds.includes(d.id || d._id))
      .map((d) => d.name);

    const payload = {
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim() || summary.trim(),
      category,
      refNumber: refNumber.trim() || `BSH/PUB/${new Date().getFullYear()}/001`,
      audience,
      targetDoctorIds: selectedDoctorIds,
      targetDoctorNames: doctorNames,
      date,
      isPinned,
      isNewBadge,
      status,
      author: author.trim() || 'Brahm Shakti Hospital Administration'
    };

    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/news/${editingId}`, payload);
        toast.success('Official circular updated successfully!');
      } else {
        await api.post('/news', payload);
        toast.success('New circular published & distributed!');
      }
      setIsModalOpen(false);
      await fetchNotices();
    } catch (err) {
      console.error('Error saving circular:', err);
      toast.error(err.response?.data?.message || 'Failed to save notice circular.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    const id = item.id || item._id;
    if (!window.confirm(`Are you sure you want to delete notice "${item.title}"?`)) return;

    setDeletingId(id);
    try {
      await api.delete(`/news/${id}`);
      toast.success('Notice circular removed.');
      await fetchNotices();
    } catch (err) {
      console.error('Error deleting notice:', err);
      toast.error('Failed to delete circular.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredNotices = newsList.filter((item) => {
    const matchesSearch =
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.refNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.summary || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (audienceFilter === 'all') return true;
    return item.audience === audienceFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FBFC] text-[#018AAE] text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Institutional Governance & Notice Distribution</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Hospital Circulars & Announcements
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Distribute official clinical orders, public health advisories, and notices targeted to{' '}
              <strong className="text-slate-700">Patients</strong>,{' '}
              <strong className="text-slate-700">All Doctors</strong>, or{' '}
              <strong className="text-slate-700">Specific Clinicians</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={fetchNotices}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#018AAE] hover:bg-[#007595] text-white text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Issue New Circular</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Toolbar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Audience Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Notices' },
              { id: 'patients', label: 'Patients (Landing Page)' },
              { id: 'doctors', label: 'All Doctors' },
              { id: 'specific_doctors', label: 'Specific Doctors' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAudienceFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  audienceFilter === tab.id
                    ? 'bg-[#018AAE] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars, ref no..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018AAE]/20 focus:border-[#018AAE]"
            />
          </div>
        </div>
      </div>

      {/* Circulars List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-[#018AAE]" />
            <p className="text-xs text-slate-400 mt-2">Loading official notices...</p>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="py-16 text-center px-4">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No circulars match this view</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Click "Issue New Circular" above to post a government-style notification for patients or doctors.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotices.map((item) => {
              const id = item.id || item._id;
              const isDeleting = deletingId === id;

              // Audience styling badge
              let audienceBadge = null;
              if (item.audience === 'patients') {
                audienceBadge = (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    <Users className="w-3 h-3" />
                    <span>Patients (Home Page)</span>
                  </span>
                );
              } else if (item.audience === 'doctors') {
                audienceBadge = (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                    <Stethoscope className="w-3 h-3" />
                    <span>All Doctors</span>
                  </span>
                );
              } else if (item.audience === 'specific_doctors') {
                const count = (item.targetDoctorIds || []).length;
                audienceBadge = (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                    <Stethoscope className="w-3 h-3" />
                    <span>Specific Doctors ({count})</span>
                  </span>
                );
              } else {
                audienceBadge = (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                    <Globe className="w-3 h-3" />
                    <span>All Audiences</span>
                  </span>
                );
              }

              return (
                <div
                  key={id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Date Block */}
                    <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shrink-0 border border-slate-700 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-teal-300">
                        {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short' }) : 'NOV'}
                      </span>
                      <span className="text-base sm:text-lg font-black leading-none mt-0.5">
                        {item.date ? new Date(item.date).getDate() : '22'}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.refNumber && (
                          <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {item.refNumber}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#F0FBFC] text-[#018AAE] border border-[#B6EEF6]/80">
                          {item.category}
                        </span>
                        {audienceBadge}
                        {item.isPinned && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-rose-50 text-rose-600 text-[10px] font-bold">
                            <Pin className="w-3 h-3 fill-rose-600" />
                            <span>Pinned</span>
                          </span>
                        )}
                        {item.isNewBadge && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black tracking-wider uppercase animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>

                      <h2 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 leading-snug">
                        {item.title}
                      </h2>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.summary || item.excerpt}
                      </p>

                      {item.audience === 'specific_doctors' && item.targetDoctorNames?.length > 0 && (
                        <div className="text-[11px] text-amber-700 font-medium">
                          <strong>Targeted to:</strong> {item.targetDoctorNames.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewNotice(item)}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="View Notice Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-lg border border-slate-200 text-[#018AAE] hover:bg-[#F0FBFC] hover:border-[#73E0EF] transition-colors"
                      title="Edit Notice"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={isDeleting}
                      className="p-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#F0FBFC] text-[#018AAE] flex items-center justify-center font-bold">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {editingId ? 'Edit Official Circular' : 'Issue New Hospital Circular'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Target this announcement to patients, all doctors, or specific clinicians.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Circular Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Circular Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Winter Seasonal Respiratory Care & Free OPD Nebulization Desk..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#018AAE]/20 focus:border-[#018AAE]"
                />
              </div>

              {/* Category & Reference Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Notice Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#018AAE]/20 focus:border-[#018AAE]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Reference Number (Government Style)
                  </label>
                  <input
                    type="text"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    placeholder="e.g. BSH/ADM/2026/104"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#018AAE]/20 focus:border-[#018AAE]"
                  />
                </div>
              </div>

              {/* AUDIENCE DISTRIBUTION PICKER */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  Target Audience & Distribution *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'all', label: 'All Audiences', desc: 'Public & all' },
                    { id: 'patients', label: 'Patients Only', desc: 'Landing page' },
                    { id: 'doctors', label: 'All Doctors', desc: 'Clinical staff' },
                    { id: 'specific_doctors', label: 'Specific Doctors', desc: 'Select roster' }
                  ].map((aud) => (
                    <button
                      key={aud.id}
                      type="button"
                      onClick={() => setAudience(aud.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        audience === aud.id
                          ? 'bg-[#018AAE] text-white border-[#018AAE] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{aud.label}</div>
                      <div className={`text-[10px] mt-0.5 ${audience === aud.id ? 'text-teal-100' : 'text-slate-400'}`}>
                        {aud.desc}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Specific Doctors Multi-Select */}
                {audience === 'specific_doctors' && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Select Target Clinicians ({selectedDoctorIds.length} selected):</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedDoctorIds(doctorsList.map((d) => d.id || d._id))
                        }
                        className="text-[11px] text-[#018AAE] hover:underline"
                      >
                        Select All
                      </button>
                    </div>
                    <div className="max-h-44 overflow-y-auto space-y-1.5 p-2 bg-white rounded-lg border border-slate-200">
                      {doctorsList.map((doc) => {
                        const docId = doc.id || doc._id;
                        const isSelected = selectedDoctorIds.includes(docId);
                        return (
                          <label
                            key={docId}
                            className={`flex items-center gap-2.5 p-2 rounded-md text-xs cursor-pointer transition-colors ${
                              isSelected ? 'bg-[#F0FBFC]/80 text-[#018AAE] font-semibold' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleDoctorSelection(docId)}
                              className="w-4 h-4 text-[#018AAE] rounded focus:ring-0 cursor-pointer"
                            />
                            <div className="flex items-center justify-between flex-1">
                              <span>{doc.name}</span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {doc.specialty || doc.department}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Summary / Excerpt */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Summary / Short Abstract *
                </label>
                <textarea
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="2-3 sentence overview displayed on the notice board..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#018AAE]/20 focus:border-[#018AAE]"
                />
              </div>

              {/* Detailed Circular Order / Content */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Full Circular Text / Official Notification Order
                </label>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Full text of the circular, guidelines, duty orders, or patient instructions..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#018AAE]/20 focus:border-[#018AAE]"
                />
              </div>

              {/* Date, Author, Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Date of Circular
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#018AAE]/20 focus:border-[#018AAE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Medical Superintendent / Hospital Administration"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#018AAE]/20 focus:border-[#018AAE]"
                  />
                </div>
              </div>

              {/* Checkbox Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 text-[#018AAE] rounded focus:ring-0"
                  />
                  <span>Pin Notice to Top of Board</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewBadge}
                    onChange={(e) => setIsNewBadge(e.target.checked)}
                    className="w-4 h-4 text-[#018AAE] rounded focus:ring-0"
                  />
                  <span>Show Pulsing "NEW" Tag</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#018AAE] hover:bg-[#007595] text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Saving...' : editingId ? 'Update Notice' : 'Publish & Distribute'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notice Preview Modal */}
      {previewNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {previewNotice.refNumber || 'BSH/NOTICE'}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#F0FBFC] text-[#018AAE]">
                  {previewNotice.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewNotice(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                {previewNotice.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-slate-500 pb-3 border-b border-slate-100">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#018AAE]" />
                  {previewNotice.date}
                </span>
                <span>•</span>
                <span>Issued by: {previewNotice.author || 'Hospital Administration'}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-mono whitespace-pre-line">
                {previewNotice.content || previewNotice.summary}
              </div>

              <div className="pt-3 text-right">
                <button
                  type="button"
                  onClick={() => setPreviewNotice(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Close Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsPage;
