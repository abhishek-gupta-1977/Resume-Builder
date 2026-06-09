import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiKey, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';
import Button from '../components/Button';

const ForgotPasswordVerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  React.useEffect(() => {
    if (!email) {
      toast.error('Please request OTP first');
      navigate('/forgot-password/request');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password/verify-otp', { email, otpCode });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/forgot-password/reset', { state: { email, otpCode } });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password/request', { email });
      if (response.data.success) {
        toast.success('New OTP sent to your email');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="card max-w-md w-full p-8 animate-slide-up">
        <button
          onClick={() => navigate('/forgot-password/request')}
          className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Verify OTP
          </h2>
          <p className="text-slate-600 mt-2">Enter the 6-digit code sent to your email</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">OTP Code</label>
            <div className="relative">
              <FiKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="input-field pl-10 text-center text-2xl tracking-widest"
                placeholder="000000"
                required
              />
            </div>
          </div>

          <Button type="submit" isLoading={loading}>
            Verify OTP
          </Button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={handleResendOtp}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordVerifyOtp;