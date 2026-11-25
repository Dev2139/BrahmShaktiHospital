import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Phone,
  Mail,
  Calendar,
  Clock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  X,
  Filter,
  User,
  Building2,
  FileText
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/enquiries');
      if (res.data.success) {
        setInquiries(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
      toast.error('Failed to load inquiries list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await api.patch(`/enquiries/${id}`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Inquiry marked as ${newStatus.replace('_', ' ')}`);
        setInquiries((prev) =>
          prev.map((item) => (item._id === id || item.referenceNumber === id ? { ...item, status: newStatus } : item))
        );
        if (selectedInquiry && (selectedInquiry._id === id || selectedInquiry.referenceNumber === id)) {
          setSelectedInquiry((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      toast.error('Failed to update inquiry status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry record?')) return;
    try {
      const res = await api.delete(`/enquiries/${id}`);
      if (res.data.success) {
        toast.success('Inquiry record deleted');
        setInquiries((prev) => prev.filter((item) => item._id !== id && item.referenceNumber !== id));
        if (selectedInquiry && (selectedInquiry._id === id || selectedInquiry.referenceNumber === id)) {
          setSelectedInquiry(null);
        }
      }
    } catch (err) {
      toast.error('Failed to delete inquiry');
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      inq.fullName?.toLowerCase().includes(q) ||
      inq.phone?.includes(q) ||
      inq.email?.toLowerCase().includes(q) ||
      inq.department?.toLowerCase().includes(q) ||
      inq.referenceNumber?.toLowerCase().includes(q) ||
      inq.message?.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: inquiries.length,
    received: inquiries.filter((i) => i.status === 'received').length,
    inReview: inquiries.filter((i) => i.status === 'in_review' || i.status === 'acknowledged').length,
    resolved: inquiries.filter((i) => i.status === 'resolved').length
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Resolved</span>;
      case 'in_review':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800">In Review</span>;
      case 'acknowledged':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">Acknowledged</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Received (New)</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-medical-border shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Hospital Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-secondary tracking-tight">
            Patient &amp; Visitor Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-medical-muted mt-1">
            Real-time contact messages and consultation inquiries submitted through the Brahm Shakti Hospital portal.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Inquiries</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-medical-border shadow-xs">
          <div className="text-xs text-medical-muted font-bold uppercase tracking-wider">Total Inquiries</div>
          <div className="text-2xl sm:text-3xl font-black text-secondary mt-1">{stats.total}</div>
        </div>
        <div className="bg-amber-50/70 p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-xs">
          <div className="text-xs text-amber-800 font-bold uppercase tracking-wider">New (Uncontacted)</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-900 mt-1">{stats.received}</div>
        </div>
        <div className="bg-sky-50/70 p-4 sm:p-5 rounded-2xl border border-sky-200 shadow-xs">
          <div className="text-xs text-sky-800 font-bold uppercase tracking-wider">Under Review</div>
          <div className="text-2xl sm:text-3xl font-black text-sky-900 mt-1">{stats.inReview}</div>
        </div>
        <div className="bg-emerald-50/70 p-4 sm:p-5 rounded-2xl border border-emerald-200 shadow-xs">
          <div className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Resolved</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1">{stats.resolved}</div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-medical-border shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name, phone, email, subject, reference..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-primary text-xs sm:text-sm text-slate-800"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Inquiries' },
            { id: 'received', label: 'New / Received' },
            { id: 'in_review', label: 'In Review' },
            { id: 'resolved', label: 'Resolved' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List / Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-medical-border p-12 text-center text-slate-400 animate-pulse">
          Loading inquiries from database...
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-medical-border p-12 text-center space-y-3">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No Inquiries Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search || statusFilter !== 'all'
              ? 'Try adjusting your search criteria or filter options.'
              : 'New contact and consultation inquiries submitted by patients will appear here.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-medical-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 border-b border-medical-border text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Ref Number</th>
                  <th className="py-3.5 px-4">Patient / Sender</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Department / Subject</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInquiries.map((inq) => (
                  <tr key={inq._id || inq.referenceNumber} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                      {inq.referenceNumber || 'BSH-000000'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{inq.fullName}</div>
                      <div className="text-[11px] text-slate-400 capitalize">{inq.type?.replace('_', ' ')}</div>
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <a
                        href={`tel:${inq.phone}`}
                        className="flex items-center gap-1.5 text-primary font-bold hover:underline"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{inq.phone}</span>
                      </a>
                      {inq.email && (
                        <a
                          href={`mailto:${inq.email}`}
                          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 hover:underline"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[140px]">{inq.email}</span>
                        </a>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{inq.department || 'General'}</div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">{inq.message || '—'}</p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(inq.status)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-xs">
                      {new Date(inq.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedInquiry(inq)}
                          className="p-1.5 rounded-lg bg-[#F0FBFC] hover:bg-[#CEF5FA] text-primary transition-colors cursor-pointer"
                          title="View Full Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(inq._id || inq.referenceNumber)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-6 relative animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-primary block">
                  {selectedInquiry.referenceNumber}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {selectedInquiry.fullName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              <div>
                <span className="text-slate-400 block font-semibold">Phone</span>
                <a href={`tel:${selectedInquiry.phone}`} className="text-primary font-bold hover:underline flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{selectedInquiry.phone}</span>
                </a>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Email</span>
                <a href={`mailto:${selectedInquiry.email}`} className="text-slate-700 font-semibold hover:underline flex items-center gap-1 mt-0.5 truncate">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{selectedInquiry.email || 'None provided'}</span>
                </a>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Subject / Department</span>
                <span className="font-bold text-slate-800 block mt-0.5">{selectedInquiry.department || 'General'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Received On</span>
                <span className="font-bold text-slate-800 block mt-0.5">
                  {new Date(selectedInquiry.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Patient Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Message Content
              </label>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                {selectedInquiry.message || 'No written message provided.'}
              </div>
            </div>

            {/* Status Change Controls */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Update Status
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'received', label: 'Mark as Received' },
                  { id: 'in_review', label: 'Mark In Review' },
                  { id: 'resolved', label: 'Mark Resolved' }
                ].map((s) => (
                  <button
                    key={s.id}
                    disabled={updatingId === (selectedInquiry._id || selectedInquiry.referenceNumber)}
                    onClick={() => handleStatusChange(selectedInquiry._id || selectedInquiry.referenceNumber, s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedInquiry.status === s.id
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiriesPage;
