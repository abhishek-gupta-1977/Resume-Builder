import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiFileText,
  FiEdit,
  FiDownload,
  FiPlus,
  FiLoader,
} from "react-icons/fi";
import api from "../services/api";
import toast from "react-hot-toast";

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportingId, setExportingId] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await api.get("/resume");
      setResumes(response.data.data);
    } catch (error) {
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (resumeId, fullName) => {
    setExportingId(resumeId);
    try {
      const response = await api.get(`/resume/${resumeId}/export`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fullName || "resume"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("PDF exported successfully");
    } catch (error) {
      toast.error("Export failed. Please try again.");
    } finally {
      setExportingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          My Resumes
        </h1>
        <Link
          to="/resume-builder"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
        >
          <FiPlus className="w-5 h-5" /> Create New
        </Link>
      </div>

      {resumes.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-slate-100 shadow-lg">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFileText className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            No resumes yet
          </h2>
          <p className="text-slate-500 mb-6">
            Create your first AI‑powered resume in minutes.
          </p>
          <Link
            to="/resume-builder"
            className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-md"
          >
            Build Resume
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-bold text-slate-800 line-clamp-1">
                    {resume.title ||
                      resume.personalDetails?.fullName ||
                      "Untitled"}
                  </h2>
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <FiFileText className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-slate-500 text-sm mb-4">
                  {resume.personalDetails?.fullName || "No name"} • Updated{" "}
                  {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-4 pt-3 border-t border-slate-100">
                  <Link
                    to={`/resume/${resume._id}/edit`}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition text-sm font-medium"
                  >
                    <FiEdit className="w-4 h-4" /> Edit
                  </Link>
                  <button
                    onClick={() =>
                      handleExport(resume._id, resume.personalDetails?.fullName)
                    }
                    disabled={exportingId === resume._id}
                    className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 transition text-sm font-medium disabled:opacity-50"
                  >
                    {exportingId === resume._id ? (
                      <FiLoader className="animate-spin w-4 h-4" />
                    ) : (
                      <FiDownload className="w-4 h-4" />
                    )}
                    Export
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeList;
