import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  MapPin,
  Calendar,
  Image as ImageIcon,
  Clock,
  Sparkles,
  Search,
  X,
  Eye,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  UploadCloud
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [additionalImages, setAdditionalImages] = useState(['']);
  const [category, setCategory] = useState('Hospital Event');
  const [author, setAuthor] = useState('Brahm Shakti Hospital Administration');

  // Sample presets for quick selection
  const PHOTO_PRESETS = [
    {
      label: 'Flag Ceremony Assembly',
      url: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795179941/Proud_Indian_Flag_Group_Portrait.png'
    },
    {
      label: 'Hospital Doctors Gathering',
      url: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795179942/Indian_Flag_Ceremony_Group_Photo.png'
    },
    {
      label: 'Annual Foundation Celebration',
      url: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795183378/brahmshakti_event_hero_resized.jpg'
    },
    {
      label: 'Clinical Team & Specialists',
      url: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795183537/WhatsApp_Image_2026-11-04_at_8.03.05_AM_2.jpg'
    },
    {
      label: 'Diagnostics & Equipment',
      url: 'https://res.cloudinary.com/urzka7oz/image/upload/v1795185835/WhatsApp_Image_2026-11-04_at_8.03.06_AM.jpg'
    }
  ];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
      toast.error('Failed to fetch events from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAddModal = () => {
    setEditingEventId(null);
    setTitle('');
    setCoverImage('');
    setLocation('Main Auditorium, Brahm Shakti Hospital, Pocket C, Budh Vihar, New Delhi');
    setDate(new Date().toISOString().split('T')[0]);
    setSummary('');
    setDescription('');
    setAdditionalImages(['']);
    setCategory('Hospital Event');
    setAuthor('Brahm Shakti Hospital Administration');
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEventId(event._id);
    setTitle(event.title || '');
    setCoverImage(event.coverImage || '');
    setLocation(event.location || '');
    setDate(event.date || '');
    setSummary(event.summary || '');
    setDescription(event.description || '');
    setAdditionalImages(
      Array.isArray(event.additionalImages) && event.additionalImages.length > 0
        ? [...event.additionalImages]
        : ['']
    );
    setCategory(event.category || 'Hospital Event');
    setAuthor(event.author || 'Brahm Shakti Hospital Administration');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEventId(null);
  };

  // Additional image URL helpers
  const handleAddImageField = () => {
    setAdditionalImages([...additionalImages, '']);
  };

  const handleAdditionalImageChange = (index, value) => {
    const updated = [...additionalImages];
    updated[index] = value;
    setAdditionalImages(updated);
  };

  const handleRemoveImageField = (index) => {
    const updated = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(updated.length > 0 ? updated : ['']);
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter the event name.');
      return;
    }
    if (!coverImage.trim()) {
      toast.error('Please provide a cover photo URL.');
      return;
    }
    if (!location.trim()) {
      toast.error('Please provide the event venue / location.');
      return;
    }
    if (!date) {
      toast.error('Please select an event date.');
      return;
    }
    if (!summary.trim()) {
      toast.error('Please enter a short summary about the event.');
      return;
    }
    if (!description.trim()) {
      toast.error('Please provide detailed text / story about the event.');
      return;
    }

    const cleanedAdditional = additionalImages.map((s) => s.trim()).filter((s) => s.length > 0);

    const payload = {
      title: title.trim(),
      coverImage: coverImage.trim(),
      location: location.trim(),
      date,
      summary: summary.trim(),
      description: description.trim(),
      additionalImages: cleanedAdditional,
      category,
      author
    };

    setSubmitting(true);
    try {
      if (editingEventId) {
        // Update
        const res = await api.put(`/events/${editingEventId}`, payload);
        if (res.data?.success) {
          toast.success('Event updated successfully!');
          closeModal();
          fetchEvents();
        }
      } else {
        // Create
        const res = await api.post('/events', payload);
        if (res.data?.success) {
          toast.success('New event created and published successfully!');
          closeModal();
          fetchEvents();
        }
      }
    } catch (err) {
      console.error('Error saving event:', err);
      toast.error(err.response?.data?.message || 'Failed to save event. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (id, eventTitle) => {
    if (!window.confirm(`Are you sure you want to delete the event: "${eventTitle}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await api.delete(`/events/${id}`);
      if (res.data?.success) {
        toast.success('Event deleted successfully.');
        setEvents(events.filter((e) => e._id !== id));
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      toast.error('Failed to delete event.');
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered Events
  const filteredEvents = events.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      (e.title && e.title.toLowerCase().includes(q)) ||
      (e.location && e.location.toLowerCase().includes(q)) ||
      (e.summary && e.summary.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0A7A74] to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-300">
              Hospital Outreach &amp; Public Relations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hospital Events &amp; Ceremonies Management
          </h1>
          <p className="text-xs text-slate-200">
            Publish, edit, and curate official Brahm Shakti Hospital events, health camps, and ceremonial milestones.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchEvents}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            title="Refresh Events"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Event</span>
          </button>
        </div>
      </div>

      {/* 2. Control Strip & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by name, location..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-[#0A7A74]"
          />
        </div>

        <div className="text-xs font-bold text-slate-500 self-start sm:self-auto">
          Showing <span className="text-slate-900 font-black">{filteredEvents.length}</span> of {events.length} published events
        </div>
      </div>

      {/* 3. Events List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-72 rounded-3xl bg-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-soft text-center space-y-3">
          <CalendarDays className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Events Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'No events matched your search query. Try clearing the search.'
              : 'No hospital events have been created yet. Click "+ Add New Event" to publish one.'}
          </p>
          {!searchQuery && (
            <button
              onClick={openAddModal}
              className="mt-2 px-4 py-2 rounded-xl bg-[#0A7A74] text-white text-xs font-bold cursor-pointer"
            >
              Add First Event
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <div
              key={evt._id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden flex flex-col justify-between group hover:border-[#0A7A74]/50 transition-all"
            >
              <div>
                {/* Cover Image */}
                <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                  <img
                    src={evt.coverImage}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://res.cloudinary.com/urzka7oz/image/upload/v1795183378/brahmshakti_event_hero_resized.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                      {evt.date}
                    </span>
                  </div>

                  {Array.isArray(evt.additionalImages) && evt.additionalImages.length > 0 && (
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#0A7A74]/90 backdrop-blur-md text-white text-[10px] font-bold shadow-xs">
                        +{evt.additionalImages.length} Photos
                      </span>
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0A7A74]">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>

                  <h3 className="font-black text-slate-900 text-base leading-snug line-clamp-2">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {evt.summary}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
                <Link
                  to={`/events/${evt.slug || evt._id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0A7A74] hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Preview ↗</span>
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(evt)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="Edit Event"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(evt._id, evt.title)}
                    disabled={deletingId === evt._id}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. ADD / EDIT EVENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden my-6">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-[#0A7A74] to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-lg">
                    {editingEventId ? 'Edit Hospital Event' : 'Add New Hospital Event'}
                  </h3>
                  <p className="text-xs text-slate-200">
                    Fields will be published to the public homepage &amp; event detail page
                  </p>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Scrollable Area */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {/* Field 1: Name of the Event */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1">
                  <span>Name of the Event</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. World Hospice and Palliative Care Day 2026"
                  required
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-[#0A7A74]"
                />
              </div>

              {/* Field 2: Cover Photo URL + Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>Cover Photo (Image URL)</span>
                    <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Direct image or Cloudinary link</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://res.cloudinary.com/... or web image URL"
                    required
                    className="flex-1 p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 font-medium focus:outline-hidden focus:border-[#0A7A74]"
                  />
                </div>

                {/* Quick Presets */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Or select from hospital verified media:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PHOTO_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCoverImage(preset.url)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                          coverImage === preset.url
                            ? 'bg-[#0A7A74] text-white border-[#0A7A74]'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Preview */}
                {coverImage && (
                  <div className="mt-2 relative rounded-2xl overflow-hidden border border-slate-200 aspect-21/9 bg-slate-100 max-h-48">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
                      Live Cover Preview
                    </span>
                  </div>
                )}
              </div>

              {/* Grid: Location & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Field 3: Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1">
                    <span>Venue / Location</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Main Auditorium, Brahm Shakti Hospital, Pocket C, Budh Vihar"
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 font-medium focus:outline-hidden focus:border-[#0A7A74]"
                  />
                </div>

                {/* Field 4: Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1">
                    <span>Event Date</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 font-medium focus:outline-hidden focus:border-[#0A7A74]"
                  />
                </div>
              </div>

              {/* Field 5: Summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>Summary / Short Overview</span>
                    <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Displayed on cards &amp; quotes</span>
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="e.g. A day of learning, clinical reflection, and compassionate healthcare at Brahm Shakti Hospital."
                  required
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 font-medium focus:outline-hidden focus:border-[#0A7A74]"
                />
              </div>

              {/* Field 6: Detailed Text / Narrative */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>Detailed Text &amp; Description</span>
                    <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Full story with paragraphs</span>
                </label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write the full event story here. Separate paragraphs with double enter (blank line) for clean reading layout..."
                  required
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 font-medium focus:outline-hidden focus:border-[#0A7A74]"
                />
              </div>

              {/* Field 7: Other Photos (Additional Images) */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-700 block">
                      Other Photos / Highlights Gallery (Optional)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Add additional event photographs to showcase ceremonies, awards, and participants
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImageField}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#0A7A74] text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {additionalImages.map((imgUrl, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="url"
                        value={imgUrl}
                        onChange={(e) => handleAdditionalImageChange(index, e.target.value)}
                        placeholder="https://... photo URL"
                        className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-[#0A7A74]"
                      />
                      {imgUrl && (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                          <img
                            src={imgUrl}
                            alt="thumb"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImageField(index)}
                        className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingEventId ? 'Update Event' : 'Publish Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventsPage;
