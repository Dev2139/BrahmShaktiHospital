import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  Clock,
  IndianRupee,
  CheckCircle2,
  Stethoscope,
  ExternalLink,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const DepartmentManagementPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Super Specialty');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [facilitiesOffered, setFacilitiesOffered] = useState('');
  const [services, setServices] = useState('');
  const [techniques, setTechniques] = useState('');
  const [consultationCharges, setConsultationCharges] = useState('800');
  const [opdTimings, setOpdTimings] = useState('Mon - Sat: 09:00 AM - 05:00 PM');
  const [headOfDepartment, setHeadOfDepartment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      if (res.data.success) {
        setDepartments(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenAddModal = () => {
    setEditingDept(null);
    setName('');
    setCode('');
    setCategory('Super Specialty');
    setShortDescription('');
    setDescription('');
    setFacilitiesOffered('');
    setServices('');
    setTechniques('');
    setConsultationCharges('800');
    setOpdTimings('Mon - Sat: 09:00 AM - 05:00 PM');
    setHeadOfDepartment('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (dept) => {
    setEditingDept(dept);
    setName(dept.name || '');
    setCode(dept.code || '');
    setCategory(dept.category || 'Clinical Specialties');
    setShortDescription(dept.shortDescription || '');
    setDescription(dept.description || '');
    setFacilitiesOffered(dept.facilitiesOffered || (Array.isArray(dept.features) ? dept.features.join('\n') : ''));
    setServices(Array.isArray(dept.services) ? dept.services.join('\n') : (dept.services || ''));
    setTechniques(dept.techniques || '');
    setConsultationCharges(String(dept.consultationCharges || 800));
    setOpdTimings(dept.opdTimings || 'Mon - Sat: 09:00 AM - 05:00 PM');
    setHeadOfDepartment(dept.headOfDepartment || '');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !code) {
      toast.error('Department name and code are required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        code,
        category,
        shortDescription,
        description,
        facilitiesOffered,
        services,
        techniques,
        consultationCharges: Number(consultationCharges),
        opdTimings,
        headOfDepartment
      };

      if (editingDept) {
        await api.put(`/departments/${editingDept.id}`, payload);
        toast.success('Department updated successfully');
      } else {
        await api.post('/departments', payload);
        toast.success('Department added successfully');
      }

      setModalOpen(false);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save department');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-secondary tracking-tight">Clinical Departments & Specialties</h2>
          <p className="text-xs text-medical-muted">
            Configure hospital clinical disciplines, detailed narratives, facilities offered, and specialists overview.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Departments Table */}
      {loading ? (
        <div className="h-64 rounded-2xl bg-white border border-medical-border animate-shimmer"></div>
      ) : (
        <div className="bg-white rounded-2xl border border-medical-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Code</th>
                  <th className="py-3.5 px-5 font-bold">Department Name</th>
                  <th className="py-3.5 px-5 font-bold">Category</th>
                  <th className="py-3.5 px-5 font-bold">Department Head</th>
                  <th className="py-3.5 px-5 font-bold">OPD Schedule</th>
                  <th className="py-3.5 px-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border text-secondary">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-medical-coolgray transition-colors">
                    <td className="py-3.5 px-5 font-bold text-primary">
                      {dept.code}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-secondary text-sm">
                      {dept.name}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded bg-primary-50 text-primary text-[10px] font-bold">
                        {dept.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-medical-muted">
                      {dept.headOfDepartment || 'Senior Clinical Director'}
                    </td>
                    <td className="py-3.5 px-5 text-medical-muted">
                      {dept.opdTimings}
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2">
                      <Link
                        to={`/departments/${dept.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F0FBFC] hover:bg-[#018AAE] hover:text-white text-[#018AAE] font-bold transition-all text-[11px] border border-[#B6EEF6]"
                        title="View Public Department Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Page</span>
                      </Link>
                      <button
                        onClick={() => handleOpenEditModal(dept)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-medical-coolgray hover:bg-primary hover:text-white text-secondary font-bold transition-all text-[11px] border border-medical-border"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-medical-border pb-3">
              <h3 className="text-lg font-bold text-secondary">
                {editingDept ? `Edit Department: ${editingDept.name}` : 'Add Clinical Department'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-medical-muted font-bold text-sm hover:text-slate-900">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Department Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anaesthesiology, Pain & Perioperative Medicine"
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="ANES"
                    required
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                  >
                    <option value="Super Specialty">Super Specialty</option>
                    <option value="Surgical Specialties">Surgical Specialties</option>
                    <option value="Clinical Specialties">Clinical Specialties</option>
                    <option value="Emergency & Critical Care">Emergency & Critical Care</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Head of Department / Clinical Chairperson</label>
                  <input
                    type="text"
                    value={headOfDepartment}
                    onChange={(e) => setHeadOfDepartment(e.target.value)}
                    placeholder="Dr. Senior Consultant Name"
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-medical-muted">Clinical Introduction / Summary</label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Overview paragraph displayed at the top of the department page..."
                  className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-medical-muted">About the Department (Comprehensive Reading Narrative)</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Full clinical background, decades of existence, faculty excellence, academic framework, and clinical milestones..."
                  className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-medical-muted">Facilities Offered</label>
                <textarea
                  rows={3}
                  value={facilitiesOffered}
                  onChange={(e) => setFacilitiesOffered(e.target.value)}
                  placeholder="Clinical services, DNB training, Fellowship training, specialized ICUs, modular operation theaters, etc..."
                  className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-medical-muted">Key Services (Enter one service per line)</label>
                <textarea
                  rows={3}
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  placeholder="1. Clinical Anesthesia&#10;2. Postoperative Pain Service&#10;3. Critical Care Management"
                  className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-medical-muted">State-of-the-art Techniques (Optional)</label>
                <textarea
                  rows={2}
                  value={techniques}
                  onChange={(e) => setTechniques(e.target.value)}
                  placeholder="Modern clinical monitoring, non-invasive cardiac output management, robotic assisted techniques..."
                  className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">OPD Schedule Timings</label>
                  <input
                    type="text"
                    value={opdTimings}
                    onChange={(e) => setOpdTimings(e.target.value)}
                    placeholder="Mon - Sat: 09:00 AM - 05:00 PM"
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase text-medical-muted">Consultation Fee (₹ - Internal Record)</label>
                  <input
                    type="number"
                    value={consultationCharges}
                    onChange={(e) => setConsultationCharges(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-medical-border text-secondary font-bold focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-secondary text-secondary font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagementPage;