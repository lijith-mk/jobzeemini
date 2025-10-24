import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';
import InternshipCard from '../components/InternshipCard';
import { toast } from 'react-toastify';

import API_BASE_URL from '../config/api';
const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stipendFilter, setStipendFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'Technology & IT',
    'Marketing & Sales',
    'Finance & Accounting',
    'Human Resources',
    'Design & Creative',
    'Content & Writing',
    'Operations',
    'Consulting',
    'Research & Development',
    'Other'
  ];

  const durations = ['1-3 months', '3-6 months', '6+ months'];
  const stipendRanges = ['Unpaid', '1-10k', '10-25k', '25k+'];

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    filterInternships();
  }, [internships, searchTerm, locationFilter, categoryFilter, stipendFilter, durationFilter]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/internships`);
      const data = await response.json();
      
      if (response.ok && (data.success || Array.isArray(data.internships))) {
        const list = Array.isArray(data.internships) ? data.internships : (data.data || []);
        setInternships(Array.isArray(list) ? list : []);
      } else {
        toast.error(data.message || 'Failed to fetch internships');
        setInternships([]);
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
      toast.error('Error loading internships');
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  const filterInternships = () => {
    const source = Array.isArray(internships) ? internships : [];
    let filtered = [...source];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(internship =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (internship.employer?.name && internship.employer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (internship.employer?.companyName && internship.employer.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(internship =>
        internship.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(internship =>
        internship.category === categoryFilter
      );
    }

    // Stipend filter
    if (stipendFilter) {
      filtered = filtered.filter(internship => {
        if (stipendFilter === 'Unpaid') return internship.isUnpaid;
        if (stipendFilter === '1-10k') return !internship.isUnpaid && internship.stipend?.amount >= 1000 && internship.stipend?.amount <= 10000;
        if (stipendFilter === '10-25k') return !internship.isUnpaid && internship.stipend?.amount > 10000 && internship.stipend?.amount <= 25000;
        if (stipendFilter === '25k+') return !internship.isUnpaid && internship.stipend?.amount > 25000;
        return true;
      });
    }

    // Duration filter
    if (durationFilter) {
      filtered = filtered.filter(internship => {
        if (durationFilter === '1-3 months') return internship.duration >= 1 && internship.duration <= 3;
        if (durationFilter === '3-6 months') return internship.duration > 3 && internship.duration <= 6;
        if (durationFilter === '6+ months') return internship.duration > 6;
        return true;
      });
    }

    setFilteredInternships(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setCategoryFilter('');
    setStipendFilter('');
    setDurationFilter('');
  };

  const getUniqueLocations = () => {
    const locations = internships.map(internship => internship.location).filter(Boolean);
    return [...new Set(locations)];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading internships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Internships</h1>
          <p className="text-gray-600">Discover amazing internship opportunities to kickstart your career</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search internships by title, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <FaFilter />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-1" />
                    Location
                  </label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Locations</option>
                    {getUniqueLocations().map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Stipend Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaRupeeSign className="inline mr-1" />
                    Stipend Range
                  </label>
                  <select
                    value={stipendFilter}
                    onChange={(e) => setStipendFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Stipends</option>
                    {stipendRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>

                {/* Duration Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select
                    value={durationFilter}
                    onChange={(e) => setDurationFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Durations</option>
                    {durations.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {filteredInternships.length} internship{filteredInternships.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Internships Grid */}
        {filteredInternships.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No internships found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((internship) => (
              <InternshipCard key={internship._id} internship={internship} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Internships;