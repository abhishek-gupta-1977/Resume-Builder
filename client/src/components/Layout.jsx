import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiHome } from 'react-icons/fi';

const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              <FiHome className="text-indigo-600" />
              ResumeBuilder
            </Link>
            
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 text-slate-700">
                    <FiUser />
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" className="px-4 py-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all">Login</Link>
                  <Link to="/signup" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;