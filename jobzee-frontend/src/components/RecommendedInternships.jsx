import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaRupeeSign, FaRobot, FaArrowRight } from 'react-icons/fa';
import API_BASE_URL from '../config/api';

const RecommendedInternships = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [basedOn, setBasedOn] = useState('popular');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('userToken');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/recommendations/internships/personalized?limit=6`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
        setBasedOn(data.basedOn || 'popular');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatStipend = (stipend, isUnpaid) => {
    if (isUnpaid) return 'Unpaid';
    if (!stipend || !stipend.amount) return 'Not specified';
    
    const symbol = stipend.currency === 'USD' ? '$' : stipend.currency === 'EUR' ? '€' : '₹';
    return `${symbol}${stipend.amount.toLocaleString()}/${stipend.period || 'month'}`;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-xl p-8 border border-purple-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FaRobot className="text-3xl text-purple-600" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Recommended For You
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            {basedOn === 'application_history' 
              ? '✨ Personalized based on your application history using KNN Algorithm'
              : '🌟 Popular opportunities curated just for you'
            }
          </p>
        </div>
        <div className="hidden md:block">
          <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-semibold text-purple-700 shadow-md">
            AI Powered
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((internship) => (
          <div
            key={internship._id}
            onClick={() => navigate(`/internships/${internship._id}`)}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-purple-300 transform hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                {internship.title}
              </h3>
              {internship.recommendationScore && (
                <span className="ml-2 px-2 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold rounded-full shadow-md flex-shrink-0">
                  {internship.recommendationScore}%
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4 font-medium">
              {internship.companyName || internship.employer?.companyName}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-700">
                <FaMapMarkerAlt className="mr-2 text-purple-500" />
                <span>{internship.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <FaClock className="mr-2 text-blue-500" />
                <span>{internship.duration} months</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <FaRupeeSign className="mr-2 text-green-500" />
                <span>{formatStipend(internship.stipend, internship.isUnpaid)}</span>
              </div>
            </div>

            {internship.skills && internship.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {internship.skills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {internship.skills.length > 3 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    +{internship.skills.length - 3}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">
                {internship.applicationsCount || 0} applicants
              </span>
              <div className="flex items-center text-purple-600 font-semibold text-sm group-hover:text-purple-700">
                View Details
                <FaArrowRight className="ml-1 text-xs group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/internships')}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
        >
          Explore All Internships
        </button>
      </div>
    </div>
  );
};

export default RecommendedInternships;
