import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);

  useEffect(() => {
    // Check if mentor is logged in
    const mentorData = localStorage.getItem('mentor');
    const mentorToken = localStorage.getItem('mentorToken');

    if (!mentorData || !mentorToken) {
      navigate('/mentor/login');
      return;
    }

    try {
      const parsedMentor = JSON.parse(mentorData);
      setMentor(parsedMentor);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing mentor data:', error);
      toast.error('Authentication error. Please log in again.');
      navigate('/mentor/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('mentor');
    localStorage.removeItem('mentorToken');
    toast.success('Logged out successfully');
    navigate('/mentor/login');
  };

  // Mock data for ongoing sessions
  const ongoingSessions = [
    {
      id: 1,
      title: 'Introduction to React',
      duration: '1 hour left',
      participants: 'You and 3 others',
      time: '2:00 PM',
      color: 'from-pink-50 to-pink-100',
      borderColor: 'border-pink-300',
      textColor: 'text-pink-700'
    },
    {
      id: 2,
      title: 'How to become a manager?',
      duration: '2 hours left',
      participants: 'You and 5 others',
      time: '4:00 PM',
      color: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-700'
    },
    {
      id: 3,
      title: 'Discuss Project for Beginners',
      duration: '30 min left',
      participants: 'You and 2 others',
      time: '5:30 PM',
      color: 'from-green-50 to-green-100',
      borderColor: 'border-green-300',
      textColor: 'text-green-700'
    }
  ];

  // Mock data for pinned conversations
  const pinnedConversations = [
    {
      id: 1,
      name: 'Muskan Agarwal',
      avatar: 'https://i.pravatar.cc/150?img=1',
      message: 'Hey! Hardik, I wanna know more about filmmaking...',
      time: 'Today',
      verified: true
    },
    {
      id: 2,
      name: 'Karan Grover',
      avatar: 'https://i.pravatar.cc/150?img=2',
      message: 'Hey! Hardik, I am interested in learning about anim...',
      time: 'Today',
      verified: true
    },
    {
      id: 3,
      name: 'Yvonne',
      avatar: 'https://i.pravatar.cc/150?img=3',
      message: 'Hi Hardik, I am thinking to switch my career from...',
      time: 'Yesterday',
      verified: true
    },
    {
      id: 4,
      name: 'Toni Harks',
      avatar: 'https://i.pravatar.cc/150?img=4',
      message: 'Hi! Hardik, I am your professor, do to see you here!',
      time: '07/06/2021',
      verified: true
    }
  ];

  const nextSession = () => {
    setCurrentSessionIndex((prev) => (prev + 1) % ongoingSessions.length);
  };

  const prevSession = () => {
    setCurrentSessionIndex((prev) => (prev - 1 + ongoingSessions.length) % ongoingSessions.length);
  };

  const nextConversation = () => {
    setCurrentConversationIndex((prev) => Math.min(prev + 1, pinnedConversations.length - 1));
  };

  const prevConversation = () => {
    setCurrentConversationIndex((prev) => Math.max(prev - 1, 0));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-red-100 via-orange-50 to-red-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-2xl flex flex-col border-r border-gray-200">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              JobZee
            </span>
          </div>
        </div>

        {/* Profile Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col items-center">
            {mentor?.photo ? (
              <img
                src={mentor.photo}
                alt={mentor.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-blue-100 shadow-lg">
                <span className="text-white font-bold text-2xl">
                  {mentor?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <h3 className="mt-3 font-bold text-gray-900 text-lg">{mentor?.name}</h3>
            <p className="text-sm text-gray-500">Mentor</p>
            <span className="mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              Available for work
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
              My Activities
            </h4>
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeSection === 'dashboard'
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveSection('messages')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${activeSection === 'messages'
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="font-medium">Messages</span>
              <span className="absolute right-3 top-3 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => setActiveSection('calendar')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeSection === 'calendar'
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Calendar</span>
            </button>
            <button
              onClick={() => setActiveSection('sessions')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeSection === 'sessions'
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-medium">Info Session</span>
            </button>
          </div>

          <div className="mt-8 space-y-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
              Account Settings
            </h4>
            <button
              onClick={() => setActiveSection('personal')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeSection === 'personal'
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">Personal Info</span>
            </button>
            <button
              onClick={() => setActiveSection('security')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeSection === 'security'
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-medium">Login&Security</span>
            </button>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-300">
                {mentor?.photo ? (
                  <img src={mentor.photo} alt={mentor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {mentor?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Welcome & Sessions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-8 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Welcome Back, <span className="text-blue-600">{mentor?.name?.split(' ')[0] || 'Mentor'}</span>
                    </h2>
                    <p className="text-gray-600 leading-relaxed max-w-lg">
                      Manage all the things from single Dashboard. Set interval info sessions, record conversations and update your recommendations.
                    </p>
                  </div>
                  <div className="hidden lg:block">
                    <div className="w-48 h-48 relative">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        {/* Illustration of person waving */}
                        <circle cx="100" cy="60" r="30" fill="#FFB6C1" />
                        <rect x="70" y="90" width="60" height="80" rx="10" fill="#FF6B6B" />
                        <rect x="50" y="100" width="30" height="50" rx="10" fill="#FFB6C1" />
                        <rect x="120" y="90" width="30" height="50" rx="10" fill="#FFB6C1" />
                        <path d="M 120 110 Q 140 90 160 100" stroke="#FFB6C1" strokeWidth="8" fill="none" strokeLinecap="round" />
                        <circle cx="90" cy="55" r="3" fill="#333" />
                        <circle cx="110" cy="55" r="3" fill="#333" />
                        <path d="M 85 70 Q 100 75 115 70" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ongoing Info Sessions */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Ongoing Info Sessions</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={prevSession}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextSession}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ongoingSessions.map((session, index) => (
                    <div
                      key={session.id}
                      className={`bg-gradient-to-br ${session.color} rounded-xl p-5 border-2 ${session.borderColor} transition-all duration-300 hover:shadow-md ${index === currentSessionIndex ? 'ring-2 ring-blue-400' : ''
                        }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`px-3 py-1 ${session.textColor} bg-white rounded-full text-xs font-semibold`}>
                          {session.duration}
                        </div>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2 text-sm">{session.title}</h4>
                      <p className="text-xs text-gray-600 mb-3">{session.participants}</p>
                      <p className="text-xs text-gray-500">⏰ {session.time}</p>
                      <button className="mt-4 w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm transition-colors shadow-sm">
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Recommendations */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Your Recommendations</h3>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
                    See All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Books */}
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200 hover:shadow-md transition-all duration-300 cursor-pointer group">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">Books</h4>
                  </div>

                  {/* Videos */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer group">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">Videos</h4>
                  </div>

                  {/* Courses */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-md transition-all duration-300 cursor-pointer group">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">Courses</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Pinned Conversations */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Pinned Conversations</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={prevConversation}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      disabled={currentConversationIndex === 0}
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextConversation}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      disabled={currentConversationIndex === pinnedConversations.length - 1}
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {pinnedConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={conversation.avatar}
                          alt={conversation.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                        />
                        {conversation.verified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                            {conversation.name}
                          </h4>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conversation.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 group-hover:text-gray-900 transition-colors">
                          {conversation.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                  View All Messages
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MentorDashboard;