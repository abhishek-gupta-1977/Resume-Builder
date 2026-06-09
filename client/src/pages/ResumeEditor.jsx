import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiSave, FiDownload, FiArrowLeft, FiLoader, FiGrid, FiPlus, FiTrash2, FiEye } from 'react-icons/fi';
import api from '../services/api';
import Button from '../components/Button';

// Your template definitions
const TEMPLATES = {
  modern: {
    primaryColor: "#1e3a8a", // indigo-900
    secondaryColor: "#475569", // slate-600
    accentColor: "#666666",
    fontHeader: "Helvetica-Bold",
    fontSubheader: "Helvetica-Oblique",
    fontBody: "Helvetica",
    titleFontSize: 24,
    sectionFontSize: 14,
    bodyFontSize: 10,
    showBorderLines: true,
    layout: "standard",
  },
  classic: {
    primaryColor: "#2c3e50",
    secondaryColor: "#7f8c8d",
    accentColor: "#555555",
    fontHeader: "Times-Bold",
    fontSubheader: "Times-Italic",
    fontBody: "Times-Roman",
    titleFontSize: 22,
    sectionFontSize: 13,
    bodyFontSize: 10,
    showBorderLines: false,
    layout: "standard",
  },
  minimal: {
    primaryColor: "#000000",
    secondaryColor: "#333333",
    accentColor: "#666666",
    fontHeader: "Helvetica-Bold",
    fontSubheader: "Helvetica",
    fontBody: "Helvetica",
    titleFontSize: 20,
    sectionFontSize: 12,
    bodyFontSize: 9,
    showBorderLines: false,
    layout: "compact",
  },
  creative: {
    primaryColor: "#d97706", // amber-600
    secondaryColor: "#b45309", // orange-700
    accentColor: "#78350f", // amber-900
    fontHeader: "Helvetica-Bold",
    fontSubheader: "Helvetica-Oblique",
    fontBody: "Helvetica",
    titleFontSize: 28,
    sectionFontSize: 16,
    bodyFontSize: 10,
    showBorderLines: true,
    layout: "standard",
  },
  elegant: {
    primaryColor: "#7c3aed", // violet-600
    secondaryColor: "#a78bfa", // violet-400
    accentColor: "#4c1d95", // violet-900
    fontHeader: "Times-Bold",
    fontSubheader: "Times-Italic",
    fontBody: "Times-Roman",
    titleFontSize: 26,
    sectionFontSize: 15,
    bodyFontSize: 10,
    showBorderLines: true,
    layout: "standard",
  },
  tech: {
    primaryColor: "#0ea5e9", // sky-500
    secondaryColor: "#0284c7", // sky-600
    accentColor: "#082f49", // sky-950
    fontHeader: "Helvetica-Bold",
    fontSubheader: "Helvetica-Oblique",
    fontBody: "Helvetica",
    titleFontSize: 22,
    sectionFontSize: 13,
    bodyFontSize: 10,
    showBorderLines: false,
    layout: "standard",
  },
  executive: {
    primaryColor: "#0f172a", // slate-900
    secondaryColor: "#334155", // slate-700
    accentColor: "#1e293b", // slate-800
    fontHeader: "Helvetica-Bold",
    fontSubheader: "Helvetica",
    fontBody: "Helvetica",
    titleFontSize: 20,
    sectionFontSize: 12,
    bodyFontSize: 9,
    showBorderLines: false,
    layout: "compact",
  },
  fresh: {
    primaryColor: "#059669", // emerald-600
    secondaryColor: "#10b981", // emerald-500
    accentColor: "#064e3b", // emerald-900
    fontHeader: "Helvetica-Bold",
    fontSubheader: "Helvetica-Oblique",
    fontBody: "Helvetica",
    titleFontSize: 24,
    sectionFontSize: 14,
    bodyFontSize: 10,
    showBorderLines: true,
    layout: "standard",
  },
  dark: {
    primaryColor: "#ffffff",
    secondaryColor: "#cbd5e1",
    accentColor: "#94a3b8",
    fontHeader: "Helvetica-Bold",
    fontSubheader: "Helvetica",
    fontBody: "Helvetica",
    titleFontSize: 24,
    sectionFontSize: 14,
    bodyFontSize: 10,
    showBorderLines: false,
    layout: "standard",
  },
};

const ResumeEditor = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const [professionalSummary, setProfessionalSummary] = useState('');
  const [enhancedExperience, setEnhancedExperience] = useState([]);
  const [enhancedProjects, setEnhancedProjects] = useState([]);
  const [roleSuggestions, setRoleSuggestions] = useState('');

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [updatingTemplate, setUpdatingTemplate] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(true);

  useEffect(() => {
    fetchResume();
    fetchTemplates();
  }, [resumeId]);

  const fetchResume = async () => {
    try {
      const response = await api.get(`/resume/${resumeId}`);
      const data = response.data.data;
      setResume(data);
      setSelectedTemplate(data.template || 'modern');
      if (data.aiFields) {
        setProfessionalSummary(data.aiFields.professionalSummary || '');
        setEnhancedExperience(data.aiFields.enhancedExperience || []);
        setEnhancedProjects(data.aiFields.enhancedProjects || []);
        setRoleSuggestions(data.aiFields.roleBasedSuggestions || '');
      }
    } catch (error) {
      toast.error('Failed to load resume');
      navigate('/resumes');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/resume/templates/list');
      setTemplates(response.data.data);
    } catch (error) {
      toast.error('Failed to load templates');
    } finally {
      setTemplatesLoading(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const updatedAiFields = {
        professionalSummary,
        enhancedExperience,
        enhancedProjects,
        roleBasedSuggestions: roleSuggestions,
      };
      const response = await api.put(`/resume/${resumeId}`, { aiFields: updatedAiFields });
      toast.success('Resume updated successfully');
      setResume(response.data.data);
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const response = await api.get(`/resume/${resumeId}/export`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resume?.personalDetails?.fullName || 'resume'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PDF exported');
    } catch (error) {
      toast.error('PDF export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleTemplateChange = async (templateName) => {
    if (!resume) return;
    if (templateName === selectedTemplate) return;
    setUpdatingTemplate(true);
    try {
      const response = await api.put(`/resume/${resumeId}/template`, { template: templateName });
      setSelectedTemplate(templateName);
      setResume((prev) => ({ ...prev, template: templateName }));
      toast.success(`Template changed to ${templateName}`);
    } catch (error) {
      toast.error('Failed to update template');
    } finally {
      setUpdatingTemplate(false);
    }
  };

  // Bullet handlers (unchanged)
  const updateExperienceBullet = (expIdx, bulletIdx, newText) => {
    const updated = [...enhancedExperience];
    updated[expIdx].bulletPoints[bulletIdx] = newText;
    setEnhancedExperience(updated);
  };
  const addExperienceBullet = (expIdx) => {
    const updated = [...enhancedExperience];
    updated[expIdx].bulletPoints.push('New bullet point');
    setEnhancedExperience(updated);
  };
  const removeExperienceBullet = (expIdx, bulletIdx) => {
    const updated = [...enhancedExperience];
    updated[expIdx].bulletPoints = updated[expIdx].bulletPoints.filter((_, i) => i !== bulletIdx);
    setEnhancedExperience(updated);
  };
  const updateProjectBullet = (projIdx, bulletIdx, newText) => {
    const updated = [...enhancedProjects];
    updated[projIdx].aiBulletPoints[bulletIdx] = newText;
    setEnhancedProjects(updated);
  };
  const addProjectBullet = (projIdx) => {
    const updated = [...enhancedProjects];
    updated[projIdx].aiBulletPoints.push('New bullet point');
    setEnhancedProjects(updated);
  };
  const removeProjectBullet = (projIdx, bulletIdx) => {
    const updated = [...enhancedProjects];
    updated[projIdx].aiBulletPoints = updated[projIdx].aiBulletPoints.filter((_, i) => i !== bulletIdx);
    setEnhancedProjects(updated);
  };

  // Preview component using inline styles from selected template
  const ResumePreview = () => {
    const template = TEMPLATES[selectedTemplate] || TEMPLATES.modern;
    const {
      primaryColor,
      secondaryColor,
      accentColor,
      fontHeader,
      fontSubheader,
      fontBody,
      titleFontSize,
      sectionFontSize,
      bodyFontSize,
      showBorderLines,
      layout,
    } = template;

    const sectionBorder = showBorderLines ? `1px solid ${secondaryColor}20` : 'none';
    const isDark = selectedTemplate === 'dark';

    return (
      <div
        style={{
          fontFamily: fontBody,
          fontSize: `${bodyFontSize}px`,
          color: primaryColor,
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ borderBottom: sectionBorder, paddingBottom: '0.5rem', marginBottom: '1rem' }}>
          <h1
            style={{
              fontFamily: fontHeader,
              fontSize: `${titleFontSize}px`,
              color: primaryColor,
              marginBottom: '0.25rem',
            }}
          >
            {resume?.personalDetails?.fullName}
          </h1>
          <p style={{ fontSize: `${bodyFontSize + 1}px`, color: secondaryColor }}>
            {resume?.personalDetails?.email}
            {resume?.personalDetails?.phone && ` • ${resume.personalDetails.phone}`}
            {resume?.personalDetails?.location && ` • ${resume.personalDetails.location}`}
          </p>
        </div>

        {professionalSummary && (
          <div style={{ marginBottom: '1rem' }}>
            <h2
              style={{
                fontFamily: fontSubheader,
                fontSize: `${sectionFontSize}px`,
                color: primaryColor,
                borderBottom: sectionBorder,
                display: 'inline-block',
                marginBottom: '0.5rem',
              }}
            >
              Professional Summary
            </h2>
            <p style={{ fontSize: `${bodyFontSize}px`, color: secondaryColor, marginTop: '0.25rem' }}>
              {professionalSummary}
            </p>
          </div>
        )}

        {enhancedExperience.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <h2
              style={{
                fontFamily: fontSubheader,
                fontSize: `${sectionFontSize}px`,
                color: primaryColor,
                borderBottom: sectionBorder,
                display: 'inline-block',
                marginBottom: '0.5rem',
              }}
            >
              Experience
            </h2>
            {enhancedExperience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontFamily: fontHeader, fontSize: `${bodyFontSize + 2}px`, color: primaryColor }}>
                  {exp.role}
                </h3>
                <p style={{ fontSize: `${bodyFontSize}px`, color: accentColor, marginBottom: '0.25rem' }}>
                  {exp.company}
                </p>
                <ul style={{ marginLeft: '1rem', listStyleType: 'disc' }}>
                  {exp.bulletPoints.map((bullet, bIdx) => (
                    <li key={bIdx} style={{ fontSize: `${bodyFontSize}px`, color: secondaryColor }}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {enhancedProjects.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <h2
              style={{
                fontFamily: fontSubheader,
                fontSize: `${sectionFontSize}px`,
                color: primaryColor,
                borderBottom: sectionBorder,
                display: 'inline-block',
                marginBottom: '0.5rem',
              }}
            >
              Projects
            </h2>
            {enhancedProjects.map((proj, idx) => (
              <div key={idx} style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontFamily: fontHeader, fontSize: `${bodyFontSize + 2}px`, color: primaryColor }}>
                  {proj.title}
                </h3>
                <ul style={{ marginLeft: '1rem', listStyleType: 'disc' }}>
                  {proj.aiBulletPoints.map((bullet, bIdx) => (
                    <li key={bIdx} style={{ fontSize: `${bodyFontSize}px`, color: secondaryColor }}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {resume?.skills?.length > 0 && (
          <div>
            <h2
              style={{
                fontFamily: fontSubheader,
                fontSize: `${sectionFontSize}px`,
                color: primaryColor,
                borderBottom: sectionBorder,
                display: 'inline-block',
                marginBottom: '0.5rem',
              }}
            >
              Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {resume.skills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: `${bodyFontSize - 1}px`,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {roleSuggestions && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: `${accentColor}10`,
              borderRadius: '0.5rem',
              fontSize: `${bodyFontSize - 1}px`,
              color: accentColor,
            }}
          >
            <strong>💡 AI Suggestion:</strong> {roleSuggestions}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  if (!resume) {
    return <div className="text-center py-20 text-red-600">Resume not found</div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/resumes')}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-all hover:gap-3"
          >
            <FiArrowLeft /> Back to Resumes
          </button>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 hover:border-indigo-400"
            >
              <FiEye /> {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <div className="relative">
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                disabled={updatingTemplate || templatesLoading}
                className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer pr-10"
              >
                {templatesLoading && <option>Loading templates...</option>}
                {!templatesLoading && templates.length === 0 && <option>No templates</option>}
                {Object.keys(TEMPLATES).map((name) => (
                  <option key={name} value={name}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </option>
                ))}
              </select>
              <FiGrid className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
              {updatingTemplate && (
                <FiLoader className="absolute right-8 top-1/2 transform -translate-y-1/2 animate-spin text-indigo-600" />
              )}
            </div>
            <Button onClick={handleExportPDF} isLoading={exporting} variant="outline" className="border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 rounded-xl px-5 py-2.5 shadow-sm">
              <FiDownload className="mr-2" /> Export PDF
            </Button>
            <Button onClick={handleUpdate} isLoading={saving} className="text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl px-5 py-2.5 shadow-md hover:shadow-lg">
              <FiSave className="mr-2" /> Save Changes
            </Button>
          </div>
        </div>

        {/* Visual Template Gallery */}
        {!templatesLoading && Object.keys(TEMPLATES).length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <FiGrid className="text-indigo-500" /> Choose a different design
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {Object.keys(TEMPLATES).map((name) => (
                <button
                  key={name}
                  onClick={() => handleTemplateChange(name)}
                  disabled={updatingTemplate}
                  className={`group relative flex items-center justify-center p-2 rounded-lg border transition-all duration-200 ${
                    selectedTemplate === name
                      ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50/30'
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm font-medium text-slate-700 capitalize">{name}</span>
                  {selectedTemplate === name && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Two‑column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor (left) */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 space-y-8">
            {/* Personal Header */}
            <div className="border-b border-slate-200 pb-4">
              <h1 className="text-3xl font-bold text-slate-800">{resume.personalDetails.fullName}</h1>
              <p className="text-slate-600 mt-1 flex flex-wrap gap-2">
                <span>{resume.personalDetails.email}</span>
                {resume.personalDetails.phone && <span>• {resume.personalDetails.phone}</span>}
                {resume.personalDetails.location && <span>• {resume.personalDetails.location}</span>}
              </p>
            </div>

            {/* Professional Summary */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">Professional Summary</h2>
              <textarea
                value={professionalSummary}
                onChange={(e) => setProfessionalSummary(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                rows="4"
              />
            </div>

            {/* Experience */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">Experience</h2>
              {enhancedExperience.map((exp, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-5 mb-5 bg-white/40 shadow-sm">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg text-slate-800">{exp.role}</h3>
                    <p className="text-indigo-600">{exp.company}</p>
                  </div>
                  <div className="space-y-2">
                    {exp.bulletPoints.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 group">
                        <span className="text-indigo-600 mt-2">•</span>
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => updateExperienceBullet(idx, bIdx, e.target.value)}
                          className="flex-1 py-1.5 px-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          onClick={() => removeExperienceBullet(idx, bIdx)}
                          className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addExperienceBullet(idx)} className="text-sm text-indigo-600 flex items-center gap-1 mt-2">
                      <FiPlus /> Add bullet point
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">Projects</h2>
              {enhancedProjects.map((proj, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-5 mb-5 bg-white/40 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{proj.title}</h3>
                  <div className="space-y-2">
                    {proj.aiBulletPoints.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 group">
                        <span className="text-indigo-600 mt-2">•</span>
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => updateProjectBullet(idx, bIdx, e.target.value)}
                          className="flex-1 py-1.5 px-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          onClick={() => removeProjectBullet(idx, bIdx)}
                          className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addProjectBullet(idx)} className="text-sm text-indigo-600 flex items-center gap-1 mt-2">
                      <FiPlus /> Add bullet point
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills?.map((skill, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Suggestions */}
            {roleSuggestions && (
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-xl border border-amber-200">
                <h3 className="font-semibold text-amber-800 flex items-center gap-2">
                  <span>💡</span> AI Suggestions
                </h3>
                <p className="text-amber-700 text-sm mt-1">{roleSuggestions}</p>
              </div>
            )}
          </div>

          {/* Preview (right) */}
          <div className={`${showPreview ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-slate-800">Live Preview</h2>
                <span className="text-xs text-slate-500 bg-white/60 px-2 py-1 rounded-full capitalize">
                  {selectedTemplate} template
                </span>
              </div>
              <ResumePreview />
              <p className="text-xs text-slate-400 mt-3 text-center">
                Styles update instantly when you change the template.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;