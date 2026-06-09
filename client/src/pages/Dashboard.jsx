import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiUser, FiMail, FiCheckCircle, FiFileText, FiPlusCircle, 
  FiDownload, FiTrendingUp, FiStar, FiClock, FiArrowRight,
  FiBriefcase, FiLayout, FiZap, FiShield
} from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  
  // Dynamic greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Welcome Animation */}
        <div className="mb-10 animate-slide-down">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
                    {greeting}, {user?.name?.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-slate-500 mt-1">Welcome to your AI Resume Studio</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm border border-slate-200">
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  <FiShield className="text-indigo-500" />
                  {user?.isVerified ? 'Verified Account' : 'Verification Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid with Hover Effects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiUser className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Name</h3>
              <p className="text-xl font-bold text-slate-800 mt-1">{user?.name || 'User'}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiMail className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Email</h3>
              <p className="text-lg font-semibold text-slate-800 mt-1 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Status</h3>
              <p className={`text-xl font-bold mt-1 ${user?.isVerified ? 'text-green-600' : 'text-amber-600'}`}>
                {user?.isVerified ? 'Verified' : 'Pending'}
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiTrendingUp className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">AI Credits</h3>
              <p className="text-xl font-bold text-slate-800 mt-1">Unlimited</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Link to="/resume-builder" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FiPlusCircle className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Create New Resume</h3>
                  <p className="text-indigo-100 mt-2">Generate an AI-powered professional resume in minutes</p>
                </div>
                <FiArrowRight className="w-8 h-8 text-white/70 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          </Link>

          <Link to="/resumes" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FiFileText className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">My Resumes</h3>
                  <p className="text-purple-100 mt-2">View, edit, or export your saved resumes</p>
                </div>
                <FiArrowRight className="w-8 h-8 text-white/70 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        </div>

        {/* AI Feature Card with Glassmorphism */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl mb-8">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <FiZap className="w-6 h-6 text-yellow-300" />
                  <span className="text-yellow-300 font-semibold">AI Powered</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Transform Your Resume with Gemini AI
                </h2>
                <p className="text-indigo-100 text-lg leading-relaxed">
                  Our intelligent AI analyzes your experience and generates metrics-driven bullet points, 
                  compelling summaries, and ATS-optimized content tailored to your industry.
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  <Link to="/resume-builder" className="px-6 py-2.5 bg-white text-indigo-600 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                    Start Building
                  </Link>
                  <Link to="/resumes" className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-400 transition-all duration-300">
                    View Saved
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <FiZap className="w-16 h-16 text-white opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <FiStar className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1">Pro Tip</h3>
              <p className="text-slate-600">
                Tailor your resume for each job application! Use our AI suggestions to highlight 
                relevant keywords from job descriptions and increase your ATS score.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-slide-down {
          animation: slideDown 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;