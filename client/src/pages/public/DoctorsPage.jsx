import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  Check,
  Stethoscope,
  Clock,
  ShieldCheck,
  MapPin,
  Calendar,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const HOSPITAL_LOCATIONS = [
  { id: 'main-campus', label: 'Brahm Shakti Hospital, Budh Vihar Main Campus' },
  { id: 'super-specialty', label: 'Super Specialty OPD Block' },
  { id: 'mother-child', label: 'Mother & Child Healthcare Wing' },
  { id: 'casualty-trauma', label: 'Casualty & Critical Trauma Centre' },
  { id: 'dialysis-center', label: 'Dialysis & Nephrology Wing' },
  { id: 'ayurveda-wing', label: 'Ayurveda & Rehabilitation Wing' },
  { id: 'diagnostic-center', label: 'Diagnostic & Imaging Center' }
];

const SPECIALTY_LIST = [
  { id: 'medicine', label: 'Internal Medicine & Diabetology' },
  { id: 'general-surgery', label: 'General & Laparoscopic Surgery' },
  { id: 'gynecology', label: 'Obstetrics & Gynaecology' },
  { id: 'pediatrics', label: 'Pediatrics & Neonatology' },
  { id: 'orthopedics', label: 'Orthopaedics & Joint Surgery' },
  { id: 'anesthesia', label: 'Anesthesiology & Critical Care' },
  { id: 'skin', label: 'Dermatology & Skin Care' },
  { id: 'ophthalmology', label: 'Ophthalmology (Eye Care)' }
];

// Helper to determine gender if not explicitly present in legacy fields
const getDoctorGender = (doc) => {
  if (doc.gender) return doc.gender;
  const femaleNames = ['manisha', 'renu', 'disha', 'swati', 'monika'];
  const nameLower = doc.name?.toLowerCase() || '';
  for (const f of femaleNames) {
    if (nameLower.includes(f)) return 'Female';
  }
  return 'Male';
};

export const DoctorsPage = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search by doctor
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Filter state
  const [sortBy, setSortBy] = useState('experience'); // 'experience' | 'earliest' | 'fee'
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState(
    searchParams.get('department') && searchParams.get('department') !== 'all'
      ? [searchParams.get('department')]
      : []
  );
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Accordion toggle state
  const [accordions, setAccordions] = useState({
    sort: true,
    location: true,
    speciality: true,
    gender: true,
    category: true
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const [docRes, deptRes] = await Promise.all([
          api.get('/doctors'),
          api.get('/departments')
        ]);
        if (docRes.data.success) setDoctors(docRes.data.data);
        if (deptRes.data.success) setDepartments(deptRes.data.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const toggleAccordion = (key) => {
    setAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleLocation = (locLabel) => {
    setSelectedLocations((prev) =>
      prev.includes(locLabel) ? prev.filter((l) => l !== locLabel) : [...prev, locLabel]
    );
  };

  const toggleSpecialty = (specId) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specId) ? prev.filter((s) => s !== specId) : [...prev, specId]
    );
  };

  const toggleGender = (gender) => {
    setSelectedGenders((prev) =>
      prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
    );
  };

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSortBy('experience');
    setSelectedLocations([]);
    setSelectedSpecialties([]);
    setSelectedGenders([]);
    setSelectedCategories([]);
  };

  const hasActiveFilters =
    searchQuery ||
    sortBy !== 'experience' ||
    selectedLocations.length > 0 ||
    selectedSpecialties.length > 0 ||
    selectedGenders.length > 0 ||
    selectedCategories.length > 0;

  // Filtered & Sorted Doctors
  const filteredDoctors = useMemo(() => {
    let result = [...doctors];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((doc) => {
        const nameMatch = doc.name?.toLowerCase().includes(q);
        const desigMatch = doc.designation?.toLowerCase().includes(q);
        const deptMatch = doc.departmentName?.toLowerCase().includes(q);
        const dmcMatch = doc.dmcNo?.toLowerCase().includes(q);
        const specMatch = doc.specializations?.some((s) => s.toLowerCase().includes(q));
        return nameMatch || desigMatch || deptMatch || dmcMatch || specMatch;
      });
    }

    // Specialty filter
    if (selectedSpecialties.length > 0) {
      result = result.filter((doc) =>
        selectedSpecialties.some(
          (specId) =>
            doc.departmentId === specId ||
            doc.departmentName?.toLowerCase().includes(specId.toLowerCase())
        )
      );
    }

    // Gender filter
    if (selectedGenders.length > 0) {
      result = result.filter((doc) => selectedGenders.includes(getDoctorGender(doc)));
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((doc) =>
        selectedCategories.includes(doc.category || 'In house')
      );
    }

    // Sorting
    if (sortBy === 'experience') {
      result.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
    } else if (sortBy === 'fee') {
      result.sort((a, b) => (a.consultationFee || 700) - (b.consultationFee || 700));
    } else if (sortBy === 'earliest') {
      // Prioritize in-house consultants with daily OPD availability
      result.sort((a, b) => {
        const aCount = a.availableDays ? a.availableDays.length : 5;
        const bCount = b.availableDays ? b.availableDays.length : 5;
        return bCount - aCount;
      });
    }

    return result;
  }, [doctors, searchQuery, selectedSpecialties, selectedGenders, selectedCategories, sortBy]);

  const filteredLocationsList = useMemo(() => {
    if (!locationSearch.trim()) return HOSPITAL_LOCATIONS;
    return HOSPITAL_LOCATIONS.filter((l) =>
      l.label.toLowerCase().includes(locationSearch.toLowerCase().trim())
    );
  }, [locationSearch]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      {/* Top Breadcrumb & Search Bar Strip (Matching Max Healthcare) */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-slate-400">—</span>
            <span className="text-slate-900 font-bold">Doctors</span>
          </nav>

          {/* Search by Doctor Input Box */}
          <div className="relative w-full sm:w-80 md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Doctor"
              className="w-full pl-10 pr-9 py-2 sm:py-2.5 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#0B2545] focus:ring-1 focus:ring-[#0B2545] shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Two-Column Container */}
      <div className="max-w-7xl mx-auto px-4 pt-6 sm:pt-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4 flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Filter className="w-4 h-4 text-primary" />
            <span>Filter Doctors ({filteredDoctors.length} available)</span>
          </div>
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="px-3.5 py-1.5 rounded-lg bg-[#0B2545] text-white text-xs font-bold transition-all"
          >
            {mobileFilterOpen ? 'Hide Filters ▲' : 'Show Filters ▼'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          {/* Left Column: Filters Sidebar */}
          <aside
            className={`w-full lg:w-72 xl:w-80 shrink-0 space-y-4 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
              {/* Filter Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h2 className="text-base font-bold text-slate-900">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-semibold text-primary hover:text-primary-hover hover:underline cursor-pointer"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* 1. Sort Accordion */}
              <div className="py-4 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => toggleAccordion('sort')}
                  className="w-full flex items-center justify-between text-sm font-bold text-slate-800 hover:text-primary transition-colors text-left cursor-pointer"
                >
                  <span>Sort</span>
                  {accordions.sort ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {accordions.sort && (
                  <div className="mt-3 space-y-2.5">
                    <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="sort_radio"
                        checked={sortBy === 'experience'}
                        onChange={() => setSortBy('experience')}
                        className="w-4 h-4 text-[#0B2545] border-slate-300 focus:ring-[#0B2545] cursor-pointer"
                      />
                      <span>Experience: High to Low</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="sort_radio"
                        checked={sortBy === 'earliest'}
                        onChange={() => setSortBy('earliest')}
                        className="w-4 h-4 text-[#0B2545] border-slate-300 focus:ring-[#0B2545] cursor-pointer"
                      />
                      <span>Earliest Availability</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="sort_radio"
                        checked={sortBy === 'fee'}
                        onChange={() => setSortBy('fee')}
                        className="w-4 h-4 text-[#0B2545] border-slate-300 focus:ring-[#0B2545] cursor-pointer"
                      />
                      <span>Consultation Fee: Low to High</span>
                    </label>
                  </div>
                )}
              </div>

              {/* 2. Location Accordion */}
              <div className="py-4 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => toggleAccordion('location')}
                  className="w-full flex items-center justify-between text-sm font-bold text-slate-800 hover:text-primary transition-colors text-left cursor-pointer"
                >
                  <span>Location</span>
                  {accordions.location ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {accordions.location && (
                  <div className="mt-3 space-y-3">
                    {/* Location nested search */}
                    <div className="relative">
                      <input
                        type="text"
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        placeholder="Search location..."
                        className="w-full px-3 py-1.5 pr-7 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-primary text-slate-700"
                      />
                      {locationSearch && (
                        <button
                          type="button"
                          onClick={() => setLocationSearch('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Scrollable list with scrollbar accent matching screenshot */}
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-slate-100">
                      {filteredLocationsList.map((loc) => {
                        const isChecked = selectedLocations.includes(loc.label);
                        return (
                          <label
                            key={loc.id}
                            className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none hover:text-slate-900"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleLocation(loc.label)}
                              className="mt-0.5 rounded border-slate-300 text-[#0B2545] focus:ring-[#0B2545] cursor-pointer"
                            />
                            <span className="leading-tight">{loc.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Speciality Accordion */}
              <div className="py-4 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => toggleAccordion('speciality')}
                  className="w-full flex items-center justify-between text-sm font-bold text-slate-800 hover:text-primary transition-colors text-left cursor-pointer"
                >
                  <span>Speciality</span>
                  {accordions.speciality ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {accordions.speciality && (
                  <div className="mt-3 max-h-52 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                    {SPECIALTY_LIST.map((spec) => {
                      const isChecked = selectedSpecialties.includes(spec.id);
                      return (
                        <label
                          key={spec.id}
                          className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none hover:text-slate-900"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSpecialty(spec.id)}
                            className="mt-0.5 rounded border-slate-300 text-[#0B2545] focus:ring-[#0B2545] cursor-pointer"
                          />
                          <span className="leading-tight">{spec.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. Gender Accordion */}
              <div className="py-4 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => toggleAccordion('gender')}
                  className="w-full flex items-center justify-between text-sm font-bold text-slate-800 hover:text-primary transition-colors text-left cursor-pointer"
                >
                  <span>Gender</span>
                  {accordions.gender ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {accordions.gender && (
                  <div className="mt-3 space-y-2.5">
                    {['Male', 'Female'].map((gender) => {
                      const isChecked = selectedGenders.includes(gender);
                      return (
                        <label
                          key={gender}
                          className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none hover:text-slate-900"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleGender(gender)}
                            className="rounded border-slate-300 text-[#0B2545] focus:ring-[#0B2545] cursor-pointer"
                          />
                          <span>{gender}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 5. Consultant Category Accordion */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion('category')}
                  className="w-full flex items-center justify-between text-sm font-bold text-slate-800 hover:text-primary transition-colors text-left cursor-pointer"
                >
                  <span>Consultant Category</span>
                  {accordions.category ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {accordions.category && (
                  <div className="mt-3 space-y-2.5">
                    {[
                      { id: 'In house', label: 'In-House Consultants' },
                      { id: 'Visiting', label: 'Visiting Consultants' }
                    ].map((cat) => {
                      const isChecked = selectedCategories.includes(cat.id);
                      return (
                        <label
                          key={cat.id}
                          className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none hover:text-slate-900"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCategory(cat.id)}
                            className="rounded border-slate-300 text-[#0B2545] focus:ring-[#0B2545] cursor-pointer"
                          />
                          <span>{cat.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Right Column: Doctors Available */}
          <main className="flex-1 min-w-0 space-y-5">
            {/* Header: Doctors Available */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div className="flex items-baseline gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Doctors Available
                </h1>
                <span className="text-xs sm:text-sm text-slate-500 font-medium">
                  ({filteredDoctors.length} found)
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Showing DMC-verified consultants
              </div>
            </div>

            {/* Active Filters Pills (if any) */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 text-xs font-medium">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="hover:text-status-danger"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedSpecialties.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-medium"
                  >
                    Specialty: {s}
                    <button
                      onClick={() => toggleSpecialty(s)}
                      className="hover:text-status-danger"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedGenders.map((g) => (
                  <span
                    key={g}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium"
                  >
                    {g}
                    <button
                      onClick={() => toggleGender(g)}
                      className="hover:text-status-danger"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedCategories.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium"
                  >
                    {c}
                    <button
                      onClick={() => toggleCategory(c)}
                      className="hover:text-status-danger"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-primary font-bold hover:underline ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Doctor Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-200 p-5 h-64 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
                <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No Doctors Match Your Filters</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Try clearing some filter criteria, broadening your search term, or browsing all clinical departments.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#0B2545] text-white text-xs font-bold hover:bg-[#123661] transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredDoctors.map((doc) => {
                  const gender = getDoctorGender(doc);
                  return (
                    <div
                      key={doc.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between group"
                    >
                      {/* Top Row: Left Image & Right Doctor Details */}
                      <div className="flex items-start gap-4">
                        {/* Doctor Photo & View Profile Link */}
                        <div className="shrink-0 flex flex-col items-center">
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="w-28 h-32 sm:w-32 sm:h-36 rounded-xl object-cover object-top border border-slate-200 bg-slate-100 shadow-2xs"
                          />
                          <Link
                            to={`/doctors/${doc.id}`}
                            className="text-[#0284c7] hover:text-[#0369a1] hover:underline text-xs font-semibold text-center mt-2.5 block cursor-pointer transition-colors"
                          >
                            View Profile
                          </Link>
                        </div>

                        {/* Doctor Information */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <Link
                            to={`/doctors/${doc.id}`}
                            className="text-base sm:text-lg font-bold text-[#0B2545] hover:text-primary transition-colors leading-snug line-clamp-2 block cursor-pointer"
                          >
                            {doc.name}
                          </Link>

                          <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                            {doc.designation}
                          </p>

                          <p className="text-xs text-slate-800 font-semibold pt-1">
                            {doc.departmentName || doc.speciality}
                          </p>

                          <p className="text-xs text-slate-600">
                            Experience: <strong className="text-slate-800 font-semibold">{doc.experienceYears}+ Years</strong>
                          </p>

                          <p className="text-xs text-slate-600">
                            Gender: <span className="text-slate-800">{gender}</span>
                          </p>

                          {/* DMC License & Category Badges */}
                          <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                            {doc.dmcNo && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                DMC {doc.dmcNo}
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                doc.category === 'Visiting'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {doc.category || 'In house'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Fee & Book an Appointment Button */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                        <div className="text-xs text-slate-500 font-medium">
                          Consultation: <strong className="text-primary font-bold">₹{doc.consultationFee || 700}</strong>
                        </div>

                        <Link
                          to={isAuthenticated ? `/appointments?doctor=${doc.id}` : `/login?redirect=${encodeURIComponent(`/appointments?doctor=${doc.id}`)}`}
                          className="px-5 py-2.5 bg-[#0B2545] hover:bg-[#123661] text-white text-xs sm:text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow flex items-center justify-center shrink-0 cursor-pointer"
                        >
                          Book an Appointment
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;
