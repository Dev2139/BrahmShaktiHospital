import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  Compass,
  Train,
  Bus,
  Car,
  Plane,
  Building,
  Clock,
  Calendar,
  Phone,
  CalendarDays,
  ExternalLink,
  CheckCircle2,
  Share2,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function LocationGuidePage() {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchGuide = async () => {
      try {
        const res = await api.get('/location-guide');
        if (res.data?.success && res.data.data) {
          setGuide(res.data.data);
        }
      } catch (err) {
        console.warn('Using default location guide fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: guide?.title || 'Brahm Shakti Hospital Location & Directions',
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      toast.success('Location & directions link copied to clipboard!');
    }
  };

  const g = guide || {
    title: 'Location, Directions & How to Reach Brahm Shakti Hospital Delhi',
    date: '16 Jan 2026',
    author: 'BSH',
    overview:
      'Brahm Shakti Hospital is situated in the Budh Vihar, Rohini area of North-West Delhi, providing easy access to nearby localities and institutions through various transportation modes.',
    address: 'Brahm Shakti Hospital\nPocket C, Budh Vihar Phase I, Pooth Kurd, New Delhi, Delhi 110085',
    coordinates: '28.7199° North --- 77.0675° East',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.9754714488344!2d77.06745197631726!3d28.719894475619106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d06f6bf53bc47%3A0xe53be0c8fc0283f3!2sBrahm%20Shakti%20Hospital!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    googleMapsUrl: 'https://maps.google.com/?q=Brahm+Shakti+Hospital+Budh+Vihar+New+Delhi',
    prominentLocalities: [
      'Budh Vihar Phase I & II',
      'Rohini (Sectors 20, 21, 22, 23, 24, 25)',
      'Pooth Kurd & Sultanpuri',
      'Mangolpuri & Nangloi',
      'Pitampura & Prashant Vihar'
    ],
    prominentInstitutions: [
      'Udyog Nagar Metro Station (Green Line)',
      'Rithala Metro Station (Red Line)',
      'Rohini District Court Complex',
      'Delhi Institute of Rural Development (DIRD)',
      'Bal Bharati Public School'
    ],
    roadAccess:
      'Shankar Road from West, Pusa Road from East directions. Road connecting Pusa Road and Shankar Road has been named after the hospital. Easily accessed via Outer Ring Road (Rohini Sec 22/24 flyover) and Rohtak Road (NH-10 via Peeragarhi/Nangloi).',
    metroConnectivity:
      'Delhi Metro provides easy and affordable connectivity to Brahm Shakti Hospital through Green and Red lines. Nearest metro stations: Udyog Nagar Metro Station (1.8 km) and Rithala Metro Station (3.5 km). Continuous shared passenger vehicles, auto-rickshaws, and cycle-rickshaws are available at both metro stations.',
    busConnectivity:
      'Delhi Transport Corporation (DTC) routes serving Brahm Shakti Hospital are 208, 522A, 522CL, 721, 751, 753, AC-725, 940, 972, 990, 990A. Nearby bus stops are: Cprti / Delhi Jal Board (17 min walk), Budh Vihar Main Bus Stand (3 min walk).',
    cabConnectivity:
      'Popular cab services like Ola and UBER provide easy transport to Brahm Shakti Hospital with direct drop-off right at the emergency casualty ramp.',
    railwaysConnectivity:
      '• New Delhi Railway Station - NDLS: 18 km (direct metro or 35 mins by cab)\n• Old Delhi Railway Station (DLI): 17 km\n• Hazrat Nizamuddin Railway Station: 24 km\n• Shakur Basti Railway Station: 8 km (nearest suburban link)',
    airportConnectivity:
      'Indira Gandhi International Airport (IGI - Terminal 3 & 1): 22 km. Connected directly via Outer Ring Road or through Delhi Metro Airport Express with interchange at New Delhi / Green Line.'
  };

  return (
    <div className="min-h-screen bg-[#F4F8FA] pb-16">
      {/* Top Banner with Medical Palette */}
      <section className="relative bg-gradient-to-b from-teal-50/70 via-emerald-50/30 to-[#F8FAFC] border-b border-slate-200/80 py-10 sm:py-14 px-4 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0A7A74]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Link to="/" className="text-[#0A7A74] hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Hospital Home</span>
            </Link>
            <span>/</span>
            <span className="text-slate-400">Visitor Guide</span>
            <span>/</span>
            <span className="text-slate-700">Location &amp; Directions</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A7A74]/10 border border-[#0A7A74]/20 text-[#0A7A74] text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Campus Transit &amp; Navigation</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            {g.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="font-bold text-slate-700">{g.author}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#0A7A74]" />
              <span>{g.date}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Grid: Left Story Layout (Images 3, 4, 5) + Right Assistance Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Area */}
          <article className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-soft space-y-8">
            {/* Overview Paragraph */}
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              {g.overview}
            </p>

            {/* Address Block (Image 3) */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Address :
              </h2>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm sm:text-base font-semibold leading-relaxed whitespace-pre-line">
                {g.address}
              </div>
            </div>

            {/* Co-ordinates Block (Image 3) */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Co-ordinates :
              </h2>
              <p className="text-sm sm:text-base font-mono font-bold text-[#0A7A74]">
                {g.coordinates}
              </p>
            </div>

            {/* Interactive Google Maps Card (Image 3) */}
            <div className="rounded-3xl border border-slate-200/90 overflow-hidden shadow-soft bg-slate-100">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0A7A74] text-white flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Brahm Shakti Hospital</h3>
                    <p className="text-[11px] text-slate-500">Pocket C, Budh Vihar Phase I, New Delhi</p>
                  </div>
                </div>

                <a
                  href={g.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A7A74] hover:bg-[#08635e] text-white text-xs font-bold transition-all shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Open in Maps</span>
                </a>
              </div>

              <div className="h-72 sm:h-96 w-full">
                <iframe
                  title="Brahm Shakti Hospital Map Embed"
                  src={g.mapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Prominent Localities Nearby (Image 4) */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Prominent Localities nearby :
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(Array.isArray(g.prominentLocalities) ? g.prominentLocalities : [g.prominentLocalities]).map(
                  (loc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-3 rounded-xl bg-teal-50/50 border border-teal-100 text-xs sm:text-sm font-semibold text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#0A7A74] shrink-0" />
                      <span>{loc}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Prominent Institutions Nearby (Image 4) */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Prominent Institutions nearby :
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(Array.isArray(g.prominentInstitutions) ? g.prominentInstitutions : [g.prominentInstitutions]).map(
                  (inst, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800"
                    >
                      <Building className="w-4 h-4 text-[#0A7A74] shrink-0" />
                      <span>{inst}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Can be reached from (Image 4) */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Can be reached from :
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {g.roadAccess}
              </p>
            </div>

            {/* Local Connectivity (Image 4) */}
            <div className="space-y-5 pt-4 border-t border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Local Connectivity
              </h2>

              {/* Delhi Metro */}
              <div className="space-y-2 p-5 rounded-2xl bg-teal-50/40 border border-teal-100">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Train className="w-5 h-5 text-[#0A7A74]" />
                  <span>Delhi Metro</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {g.metroConnectivity}
                </p>
              </div>

              {/* DTC Buses */}
              <div className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Bus className="w-5 h-5 text-[#0A7A74]" />
                  <span>Delhi Transport Corporation Buses</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {g.busConnectivity}
                </p>
              </div>

              {/* Cabs / Taxis */}
              <div className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Car className="w-5 h-5 text-[#0A7A74]" />
                  <span>Cabs / Taxis</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {g.cabConnectivity}
                </p>
              </div>
            </div>

            {/* If you are travelling from outside Delhi (Image 5) */}
            <div className="space-y-5 pt-4 border-t border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                If you are travelling from outside Delhi
              </h2>

              {/* By Rail */}
              <div className="space-y-2">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <Train className="w-4 h-4 text-[#0A7A74]" />
                  <span>By Rail</span>
                </h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {g.railwaysConnectivity}
                </div>
              </div>

              {/* By Air */}
              <div className="space-y-2">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <Plane className="w-4 h-4 text-[#0A7A74]" />
                  <span>By Air</span>
                </h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {g.airportConnectivity}
                </div>
              </div>
            </div>
          </article>

          {/* Right Sidebar Assistance & Hospital Contacts */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Emergency Assistance Box */}
            <div className="bg-gradient-to-br from-[#0A7A74] to-[#08534f] text-white p-6 sm:p-7 rounded-3xl shadow-lg space-y-4">
              <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider inline-block">
                Emergency &amp; Casualty
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Arriving in Medical Emergency?
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Emergency casualty gate has a dedicated direct ramp and round-the-clock trauma resuscitation teams.
              </p>

              <div className="space-y-2.5 pt-2">
                <a
                  href="tel:7840089703"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white text-[#0A7A74] font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Casualty Helpline: 7840089703</span>
                </a>
                <Link
                  to="/consultation"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-colors"
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>Book OPD Consultation</span>
                </Link>
              </div>
            </div>

            {/* Hospital Campus Quick Facts */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-soft space-y-4">
              <h3 className="font-black text-slate-900 text-base pb-3 border-b border-slate-100">
                Hospital Campus Overview
              </h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#0A7A74] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Pocket C, Budh Vihar Phase I</strong>
                    <span>North-West Delhi - 110085</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#0A7A74] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">24 Hours / 7 Days Casualty</strong>
                    <span>OPD: Mon - Sat (09:00 AM - 05:00 PM)</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Building className="w-4 h-4 text-[#0A7A74] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">Brahm Shakti Trust Healthcare</strong>
                    <span>250-Bed Tertiary Care Medical Center</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
