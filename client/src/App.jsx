import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPasswordRequest from "./pages/ForgotPasswordRequest";
import ForgotPasswordVerifyOtp from "./pages/ForgotPasswordVerifyOtp";
import ForgotPasswordReset from "./pages/ForgotPasswordReset";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumeList from "./pages/ResumeList";
import ResumeEditor from "./pages/ResumeEditor";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
              path="/forgot-password/request"
              element={<ForgotPasswordRequest />}
            />
            <Route
              path="/forgot-password/verify-otp"
              element={<ForgotPasswordVerifyOtp />}
            />
            <Route
              path="/forgot-password/reset"
              element={<ForgotPasswordReset />}
            />
            <Route
              path="/resume-builder"
              element={
                <ProtectedRoute>
                  <ResumeBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resumes"
              element={
                <ProtectedRoute>
                  <ResumeList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume/:resumeId/edit"
              element={
                <ProtectedRoute>
                  <ResumeEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
              borderRadius: "12px",
            },
            success: {
              style: {
                background: "#10b981",
              },
            },
            error: {
              style: {
                background: "#ef4444",
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
