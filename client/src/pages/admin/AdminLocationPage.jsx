import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Save,
  RefreshCw,
  ExternalLink,
  Eye,
  CheckCircle2,
  Navigation,
  Train,
  Bus,
  Car,
  Plane,
  Building
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminLocationPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [prominentLocalities, setProminentLocalities] = useState('');
  const [prominentInstitutions, setProminentInstitutions] = useState('');
  const [roadAccess, setRoadAccess] = useState('');
  const [metroConnectivity, setMetroConnectivity] = useState('');
  const [busConnectivity, setBusConnectivity] = useState('');
  const [cabConnectivity, setCabConnectivity] = useState('');
  const [railwaysConnectivity, setRailwaysConnectivity] = useState('');
  const [airportConnectivity, setAirportConnectivity] = useState('');

  const fetchLocationData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/location-guide');
      if (res.data?.success && res.data.data) {
        const d = res.data.data;
        setTitle(d.title || '');
        setOverview(d.overview || '');
        setAddress(d.address || '');
        setCoordinates(d.coordinates || '');
        setMapEmbedUrl(d.mapEmbedUrl || '');
        setGoogleMapsUrl(d.googleMapsUrl || '');
        setProminentLocalities(
          Array.isArray(d.prominentLocalities) ? d.prominentLocalities.join('\n') : d.prominentLocalities || ''
        );
        setProminentInstitutions(
          Array.isArray(d.prominentInstitutions) ? d.prominentInstitutions.join('\n') : d.prominentInstitutions || ''
        );
        setRoadAccess(d.roadAccess || '');
        setMetroConnectivity(d.metroConnectivity || '');
        setBusConnectivity(d.busConnectivity || '');
        setCabConnectivity(d.cabConnectivity || '');
        setRailwaysConnectivity(d.railwaysConnectivity || '');
        setAirportConnectivity(d.airportConnectivity || '');
      }
    } catch (err) {
      console.error('Failed to load location guide:', err);
      toast.error('Failed to load location guide');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title,
        overview,
        address,
        coordinates,
        mapEmbedUrl,
        googleMapsUrl,
        prominentLocalities: prominentLocalities.split('\n').map((s) => s.trim()).filter(Boolean),
        prominentInstitutions: prominentInstitutions.split('\n').map((s) => s.trim()).filter(Boolean),
        roadAccess,
        metroConnectivity,
        busConnectivity,
        cabConnectivity,
        railwaysConnectivity,
        airportConnectivity
      };

      const res = await api.put('/location-guide', payload);
      if (res.data?.success) {
        toast.success('Location & directions guide successfully updated!');
      }
    } catch (err) {
      console.error('Failed to update location guide:', err);
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-12 animate-pulse">
        <div className="h-28 rounded-3xl bg-slate-200"></div>
        <div className="h-96 rounded-3xl bg-slate-200"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#018AAE] to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-300">
              Hospital Transit &amp; Campus Guide
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Location, Directions &amp; Transit Management
          </h1>
          <p className="text-xs text-slate-200">
            Update hospital physical address, coordinates, Google Maps embed, and multi-modal transit guides.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/location-and-directions"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>Live View ↗</span>
          </Link>
          <button
            onClick={fetchLocationData}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload</span>
          </button>
        </div>
      </div>

      {/* 2. Management Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft space-y-6">
          <h2 className="text-lg font-black text-slate-900 tracking-tight pb-3 border-b border-slate-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#018AAE]" />
            <span>Core Hospital Location &amp; Coordinates</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Title */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase text-slate-700">Guide Page Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-[#018AAE]"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">Physical Hospital Address</label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 font-medium focus:outline-hidden focus:border-[#018AAE]"
              />
            </div>

            {/* Coordinates */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">GPS Coordinates</label>
              <input
                type="text"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                placeholder="28.7199° North --- 77.0675° East"
                required
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 font-mono font-medium focus:outline-hidden focus:border-[#018AAE]"
              />
              <span className="text-[10px] text-slate-400">Format: Latitude North --- Longitude East</span>
            </div>

            {/* Overview */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase text-slate-700">Overview / Introduction</label>
              <textarea
                rows={3}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 font-medium focus:outline-hidden focus:border-[#018AAE]"
              />
            </div>
          </div>
        </div>

        {/* 3. Maps & Links */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft space-y-6">
          <h2 className="text-lg font-black text-slate-900 tracking-tight pb-3 border-b border-slate-100 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#018AAE]" />
            <span>Google Maps URLs &amp; Embed Preview</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">Google Maps Embed URL (iframe src)</label>
              <input
                type="url"
                value={mapEmbedUrl}
                onChange={(e) => setMapEmbedUrl(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-[#018AAE]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">Google Maps Direct Navigation Link</label>
              <input
                type="url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono focus:outline-hidden focus:border-[#018AAE]"
              />
            </div>
          </div>

          {mapEmbedUrl && (
            <div className="h-56 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <iframe
                title="Admin Map Embed Preview"
                src={mapEmbedUrl}
                className="w-full h-full border-0"
              />
            </div>
          )}
        </div>

        {/* 4. Localities & Institutions */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft space-y-6">
          <h2 className="text-lg font-black text-slate-900 tracking-tight pb-3 border-b border-slate-100 flex items-center gap-2">
            <Building className="w-5 h-5 text-[#018AAE]" />
            <span>Surrounding Areas &amp; Landmarks</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">
                Prominent Localities Nearby (one per line)
              </label>
              <textarea
                rows={5}
                value={prominentLocalities}
                onChange={(e) => setProminentLocalities(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 font-medium focus:outline-hidden focus:border-[#018AAE]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700">
                Prominent Institutions Nearby (one per line)
              </label>
              <textarea
                rows={5}
                value={prominentInstitutions}
                onChange={(e) => setProminentInstitutions(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 font-medium focus:outline-hidden focus:border-[#018AAE]"
              />
            </div>
          </div>
        </div>

        {/* 5. Transit Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft space-y-6">
          <h2 className="text-lg font-black text-slate-900 tracking-tight pb-3 border-b border-slate-100 flex items-center gap-2">
            <Car className="w-5 h-5 text-[#018AAE]" />
            <span>Local &amp; Outstation Connectivity</span>
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#018AAE]" />
                <span>Can Be Reached From (Road Directions)</span>
              </label>
              <textarea
                rows={2}
                value={roadAccess}
                onChange={(e) => setRoadAccess(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#018AAE]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5 text-[#018AAE]" />
                <span>Delhi Metro Connectivity</span>
              </label>
              <textarea
                rows={3}
                value={metroConnectivity}
                onChange={(e) => setMetroConnectivity(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#018AAE]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-[#018AAE]" />
                <span>DTC Bus Connectivity &amp; Routes</span>
              </label>
              <textarea
                rows={3}
                value={busConnectivity}
                onChange={(e) => setBusConnectivity(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#018AAE]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#018AAE]" />
                <span>Cabs &amp; Taxis</span>
              </label>
              <textarea
                rows={2}
                value={cabConnectivity}
                onChange={(e) => setCabConnectivity(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#018AAE]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5 text-[#018AAE]" />
                <span>Travelling Outside Delhi: Railways</span>
              </label>
              <textarea
                rows={4}
                value={railwaysConnectivity}
                onChange={(e) => setRailwaysConnectivity(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#018AAE]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-[#018AAE]" />
                <span>Travelling Outside Delhi: Airport</span>
              </label>
              <textarea
                rows={3}
                value={airportConnectivity}
                onChange={(e) => setAirportConnectivity(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#018AAE]"
              />
            </div>
          </div>
        </div>

        {/* 6. Save Button Bar */}
        <div className="flex items-center justify-end gap-3 sticky bottom-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md text-white shadow-2xl">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#018AAE] hover:bg-[#007595] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving Changes...' : 'Save & Update Location Guide'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLocationPage;
