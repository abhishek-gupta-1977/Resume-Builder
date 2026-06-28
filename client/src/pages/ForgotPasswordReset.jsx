import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../services/api";
import Button from "../components/Button";

const ForgotPasswordReset = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, otpCode } = location.state || {};

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  React.useEffect(() => {
    if (!email || !otpCode) {
      toast.error("Invalid reset request");
      navigate("/forgot-password/request");
    }
  }, [email, otpCode, navigate]);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error(
        "Password must contain uppercase, number, and special character",
      );
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password/reset", {
        email,
        otpCode,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Password reset failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="card max-w-md w-full p-8 animate-slide-up">
        <button
          onClick={() =>
            navigate("/forgot-password/verify-otp", { state: { email } })
          }
          className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Reset Password
          </h2>
          <p className="text-slate-600 mt-2">Create a new secure password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field pl-10 pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field pl-10 pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Password must contain at least one uppercase letter, one special
            character (!@#$&*), and one number
          </div>

          <Button type="submit" isLoading={loading}>
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordReset;
