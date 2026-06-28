import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import api from "../services/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await api.post("/auth/verify-email", { token });
        if (response.data.success) {
          setStatus("success");
          setMessage(response.data.message);
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(response.data.message);
        }
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="card max-w-md w-full p-8 text-center animate-slide-up">
        {status === "loading" && (
          <>
            <FiLoader className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Verifying Email
            </h2>
            <p className="text-slate-600">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">Success!</h2>
            <p className="text-slate-600 mb-4">{message}</p>
            <p className="text-sm text-slate-500">
              Redirecting to login page...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Verification Failed
            </h2>
            <p className="text-slate-600 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
