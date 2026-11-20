import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  Eye,
  Layers,
  UploadCloud
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminGalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // Form State
  const [formImage, setFormImage] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCaption, setFormCaption] = useState('');
  const [formCategory, setFormCategory] = useState('events');
  const [formCategoryLabel, setFormCategoryLabel] = useState('Hospital Events');

  const CATEGORY_OPTIONS = [
    { id: 'events', label: 'Hospital Events & Ceremonies' },
    { id: 'campus', label: 'Campus & Infrastructure' },
    { id: 'ot', label: 'Operation Theatres' },
    { id: 'icu', label: 'ICU & Critical Care' },
    { id: 'dialysis', label: 'Dialysis Wing' },
    { id: 'diagnostics', label: 'Diagnostics & Pathology' }
  ];

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await api.get('/gallery');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setGalleryItems(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load gallery:', err);
      toast.error('Failed to load gallery images from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleOpenAddModal = () => {
    setFormImage('');
    setFormTitle('');
    setFormCaption('');
    setFormCategory('events');
    setFormCategoryLabel('Hospital Events');
    setIsAddModalOpen(true);
  };

  const handleCategorySelect = (e) => {
    const val = e.target.value;
    setFormCategory(val);
    const found = CATEGORY_OPTIONS.find((c) => c.id === val);
    if (found) setFormCategoryLabel(found.label);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formImage.trim()) {
      toast.error('Please enter a valid Image URL');
      return;
    }
    if (!formTitle.trim()) {
      toast.error('Please enter a title for the photo');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/gallery', {
        image: formImage.trim(),
        title: formTitle.trim(),
        caption: formCaption.trim(),
        category: formCategory,
        categoryLabel: formCategoryLabel,
        order: galleryItems.length + 1
      });

      if (res.data?.success) {
        toast.success('Photo added to gallery successfully!');
        setIsAddModalOpen(false);
        fetchGallery();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add photo to database';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the website gallery?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await api.delete(`/gallery/${id}`);
      if (res.data?.success) {
        toast.success('Photo removed from gallery');
        setGalleryItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove photo';
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-semibold text-[#0A7A74] mb-2">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>LANDING PAGE MEDIA MANAGER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Photo Gallery Management
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Add, preview, and remove photos displayed on the live Brahm Shakti Hospital landing page cover flow gallery. Changes update the database and website in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={fetchGallery}
            className="p-3 rounded-2xl border border-slate-200 text-slate-600 hover:text-[#0A7A74] hover:bg-slate-50 transition-colors"
            title="Refresh Gallery"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0A7A74]' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0A7A74] hover:bg-[#08625d] text-white text-sm font-semibold shadow-md shadow-[#0A7A74]/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Photo</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Photos</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{galleryItems.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0A7A74] flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Database Status</div>
            <div className="text-sm font-bold text-emerald-600 mt-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>MongoDB Atlas Synced</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Display Mode</div>
            <div className="text-sm font-bold text-slate-900 mt-1.5">3D Cover Flow Carousel</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#0A7A74] mx-auto" />
          <p className="text-sm text-slate-500">Loading gallery photos from database...</p>
        </div>
      ) : galleryItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#0A7A74] flex items-center justify-center mx-auto">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No photos in the gallery yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Add photos using Cloudinary or online image links to populate the landing page gallery.
          </p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A7A74] text-white text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Photo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryItems.map((item, idx) => {
            const itemId = item._id || item.id || idx;
            const isDeleting = deletingId === itemId;

            return (
              <div
                key={itemId}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors" />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide">
                      {item.categoryLabel || item.category || 'Hospital'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewPhoto(item)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Enlarge preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="text-[11px] font-bold text-[#0A7A74] uppercase tracking-wider">
                      Slide #{idx + 1}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.caption || 'No description provided'}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <a
                    href={item.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-[#0A7A74] font-medium"
                  >
                    <span>Open link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => handleDelete(itemId, item.title)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isDeleting ? 'Removing...' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Photo Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add Photo to Gallery</h3>
                <p className="text-xs text-slate-500">Provide an image URL to publish directly to the landing page</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://res.cloudinary.com/... or web image link"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A7A74] text-xs sm:text-sm"
                />
              </div>

              {/* Live Preview If image URL is entered */}
              {formImage.trim() && (
                <div className="relative h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={formImage.trim()}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold">
                    Live Preview
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Photo Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Flag Ceremony & Leadership Gathering"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A7A74] text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={handleCategorySelect}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A7A74] text-xs sm:text-sm bg-white"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Caption / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Senior consultants and surgical teams assembled at Brahm Shakti Hospital campus."
                  value={formCaption}
                  onChange={(e) => setFormCaption(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0A7A74] text-xs sm:text-sm resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0A7A74] hover:bg-[#08625d] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#0A7A74]/20 disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{submitting ? 'Saving to Database...' : 'Save to Gallery'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center z-10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative max-h-[65vh] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={previewPhoto.image}
                alt={previewPhoto.title}
                className="w-full h-full max-h-[65vh] object-contain"
              />
            </div>
            <div className="p-6 bg-white space-y-2">
              <div className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-teal-50 text-[#0A7A74] border border-teal-200">
                {previewPhoto.categoryLabel || previewPhoto.category || 'Hospital'}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{previewPhoto.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600">{previewPhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGalleryPage;
