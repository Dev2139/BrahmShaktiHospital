import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  User,
  ArrowLeft,
  Share2,
  CalendarDays,
  ChevronRight,
  Phone,
  Sparkles,
  ExternalLink,
  Eye,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchEventData();
  }, [id]);

  const fetchEventData = async () => {
    setLoading(true);
    try {
      const [singleRes, listRes] = await Promise.all([
        api.get(`/events/${id}`).catch(() => null),
        api.get('/events').catch(() => null)
      ]);

      if (singleRes?.data?.success && singleRes.data.data) {
        setEvent(singleRes.data.data);
      } else if (listRes?.data?.success && Array.isArray(listRes.data.data)) {
        // Fallback search in list by id or slug
        const found = listRes.data.data.find((e) => e._id === id || e.slug === id);
        if (found) setEvent(found);
      }

      if (listRes?.data?.success && Array.isArray(listRes.data.data)) {
        setAllEvents(listRes.data.data);
      }
    } catch (err) {
      console.error('Error loading event detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title || 'Brahm Shakti Hospital Event',
        text: event?.summary || '',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F8FA] py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="h-6 w-48 bg-slate-200 rounded-lg"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-96 bg-slate-200 rounded-3xl"></div>
              <div className="h-10 w-3/4 bg-slate-200 rounded-lg"></div>
              <div className="h-24 bg-slate-200 rounded-2xl"></div>
            </div>
            <div className="lg:col-span-4 space-y-4">
              <div className="h-64 bg-slate-200 rounded-3xl"></div>
              <div className="h-48 bg-slate-200 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[70vh] bg-[#F4F8FA] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-soft text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Event Not Found</h2>
          <p className="text-xs text-slate-500">
            The event you are looking for may have been archived or removed by hospital administration.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl bg-[#018AAE] hover:bg-[#007595] text-white text-xs font-bold transition-all shadow-md"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter other events (excluding the current one)
  const otherEvents = allEvents.filter((e) => e._id !== event._id && e.slug !== event.slug).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F4F8FA] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Link to="/" className="text-[#018AAE] hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Hospital Home</span>
            </Link>
            <span>/</span>
            <span className="text-slate-400">Events & Outreach</span>
            <span>/</span>
            <span className="text-slate-700 truncate max-w-xs">{event.title}</span>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#018AAE]" />
            <span>Share Event</span>
          </button>
        </div>

        {/* Main Content Layout: Left Story + Right "Other Events" Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Story Column */}
          <article className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden">
            {/* 1. Large Cover Photo */}
            <div className="relative w-full aspect-16/9 sm:aspect-21/9 bg-slate-900 overflow-hidden">
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://res.cloudinary.com/urzka7oz/image/upload/v1795183378/brahmshakti_event_hero_resized.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-white">
                <span className="px-3 py-1 rounded-full bg-[#018AAE] text-white text-[11px] font-bold shadow-sm">
                  {event.category || 'Hospital Event'}
                </span>
                <span className="text-xs text-white/90 font-semibold drop-shadow-md">
                  Brahm Shakti Trust Healthcare
                </span>
              </div>
            </div>

            {/* 2. Article Body & Metadata */}
            <div className="p-6 sm:p-10 space-y-6">
              {/* Event Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {event.title}
              </h1>

              {/* Metadata Strip */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-500 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                  <User className="w-4 h-4 text-[#018AAE]" />
                  <span>{event.author || 'Brahm Shakti Hospital'}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-slate-600">
                  <Calendar className="w-4 h-4 text-[#018AAE]" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-slate-600">
                  <Clock className="w-4 h-4 text-[#018AAE]" />
                  <span>{event.readTime || '3 min read'}</span>
                </div>
              </div>

              {/* Location Badge */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F0FBFC]/70 border border-teal-100 text-[#013B4A] text-xs">
                <MapPin className="w-4 h-4 text-[#018AAE] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-slate-900">Event Venue & Location:</strong>
                  <span className="text-slate-600">{event.location}</span>
                </div>
              </div>

              {/* Lead Summary Callout */}
              {event.summary && (
                <div className="p-5 rounded-2xl bg-slate-50 border-l-4 border-[#018AAE] text-slate-700 text-sm sm:text-base font-semibold leading-relaxed">
                  {event.summary}
                </div>
              )}

              {/* Detailed Narrative / Full Story */}
              <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
                {event.description.split('\n\n').map((paragraph, index) => {
                  if (!paragraph.trim()) return null;
                  return (
                    <p key={index} className="whitespace-pre-line text-slate-700 leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  );
                })}
              </div>

              {/* Additional Event Photos Gallery (as in Images 3 & 4) */}
              {Array.isArray(event.additionalImages) && event.additionalImages.length > 0 && (
                <div className="pt-8 space-y-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#018AAE]" />
                        <span>Event Highlights & Photo Gallery</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Memorable moments captured during this clinical program and community ceremony.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#018AAE] bg-[#018AAE]/10 px-2.5 py-1 rounded-full">
                      {event.additionalImages.length} Photos
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {event.additionalImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImage(imgUrl)}
                        className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 cursor-pointer shadow-xs hover:shadow-md transition-all"
                      >
                        <img
                          src={imgUrl}
                          alt={`${event.title} - photo ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://res.cloudinary.com/urzka7oz/image/upload/v1795179941/Proud_Indian_Flag_Group_Portrait.png';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md text-xs font-bold">
                            <Eye className="w-4 h-4" />
                            <span>Click to Enlarge</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Note */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#018AAE]" />
                  <span>Verified Medical Archive · Brahm Shakti Hospital (Regd.)</span>
                </div>
                <Link
                  to="/#events-section"
                  className="font-bold text-[#018AAE] hover:underline flex items-center gap-1"
                >
                  <span>Explore More Events</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>

          {/* Right Sidebar: "Other Events" (Matches Image 2) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* 1. Other Events Widget */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-soft space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Other Events
                </h2>
                <p className="text-xs text-slate-500">
                  Recent and upcoming milestones at Brahm Shakti Hospital
                </p>
              </div>

              {otherEvents.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No other events published yet.</p>
              ) : (
                <div className="space-y-4">
                  {otherEvents.map((item) => (
                    <Link
                      key={item._id}
                      to={`/events/${item.slug || item._id}`}
                      className="group flex items-start gap-3.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                    >
                      {/* Thumbnail */}
                      <div className="w-20 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                          onError={(e) => {
                            e.target.src = 'https://res.cloudinary.com/urzka7oz/image/upload/v1795183378/brahmshakti_event_hero_resized.jpg';
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <h3 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-[#018AAE] transition-colors leading-snug">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1 text-slate-500 font-medium">
                            <User className="w-3 h-3 text-[#018AAE]" />
                            <span className="truncate max-w-[80px]">BSH</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{item.date}</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Hospital Care & Appointment Assistance Box */}
            <div className="bg-gradient-to-br from-[#018AAE] to-[#08534f] text-white p-6 rounded-3xl shadow-lg shadow-[#018AAE]/15 space-y-4">
              <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider inline-block">
                24x7 Helpdesk & OPD
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Need Medical Advice or Specialist Consultation?
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Connect with our front desk casualty helpline or reserve an OPD consultation with our specialist doctors.
              </p>
              
              <div className="space-y-2.5 pt-2">
                <a
                  href="tel:7840089703"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white text-[#018AAE] font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Emergency: 7840089703</span>
                </a>
                <Link
                  to="/bookappointment"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-colors"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Book Hospital Appointment</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Lightbox Modal for Full-Resolution Photo Preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl p-2 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[80vh] flex items-center justify-center overflow-hidden rounded-2xl">
              <img
                src={selectedImage}
                alt="Enlarged Event Photo"
                className="max-h-[80vh] w-auto object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
