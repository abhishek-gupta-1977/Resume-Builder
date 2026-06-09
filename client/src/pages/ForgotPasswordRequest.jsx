import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';
import Button from '../components/Button';

const ForgotPasswordRequest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password/request', { email });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/forgot-password/verify-otp', { state: { email } });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="card max-w-md w-full p-8 animate-slide-up">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <FiArrowLeft /> Back to Login
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Forgot Password?
          </h2>
          <p className="text-slate-600 mt-2">Enter your email to receive a 6-digit OTP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <Button type="submit" isLoading={loading}>
            Send OTP Code
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordRequest;