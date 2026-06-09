import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiArrowRight, FiArrowLeft, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { resumeAPI } from '../services/api';
import Button from '../components/Button';

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [personalDetails, setPersonalDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: ''
  });
  
  const [education, setEducation] = useState([{ degree: '', institution: '', year: '' }]);
  const [experience, setExperience] = useState([{ company: '', role: '', duration: '', description: '' }]);
  const [projects, setProjects] = useState([{ title: '', techStack: '', description: '' }]);
  const [skills, setSkills] = useState('');
  const [title, setTitle] = useState('');

  const addItem = (setter, items) => setter([...items, {}]);
  const removeItem = (setter, items, index) => setter(items.filter((_, i) => i !== index));
  const updateItem = (setter, items, index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setter(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      personalDetails,
      education: education.filter(e => e.degree && e.institution),
      experience: experience.filter(e => e.company && e.role),
      projects: projects.filter(p => p.title),
      skills: skills.split(',').map(s => s.trim()).filter(s => s),
      title: title || `${personalDetails.fullName}'s Resume`
    };
    
    try {
      const response = await resumeAPI.generate(payload);
      if (response.data.success) {
        toast.success('Resume generated successfully!');
        navigate(`/resume/${response.data.data._id}/edit`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4 animate-slide-in">
            <h2 className="text-2xl font-bold text-slate-800">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name *" value={personalDetails.fullName} onChange={e => setPersonalDetails({...personalDetails, fullName: e.target.value})} className="input-field" required />
              <input type="email" placeholder="Email *" value={personalDetails.email} onChange={e => setPersonalDetails({...personalDetails, email: e.target.value})} className="input-field" />
              <input type="tel" placeholder="Phone" value={personalDetails.phone} onChange={e => setPersonalDetails({...personalDetails, phone: e.target.value})} className="input-field" />
              <input type="text" placeholder="Location (City, Country)" value={personalDetails.location} onChange={e => setPersonalDetails({...personalDetails, location: e.target.value})} className="input-field" />
              <input type="url" placeholder="Website / Portfolio" value={personalDetails.website} onChange={e => setPersonalDetails({...personalDetails, website: e.target.value})} className="input-field md:col-span-2" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-slide-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Education</h2>
            {education.map((edu, idx) => (
              <div key={idx} className="relative border border-slate-200 rounded-xl p-4 mb-4 bg-white/50 backdrop-blur-sm transition-all hover:shadow-md">
                {idx > 0 && (
                  <button type="button" onClick={() => removeItem(setEducation, education, idx)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition">
                    <FiTrash2 />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input placeholder="Degree" value={edu.degree} onChange={e => updateItem(setEducation, education, idx, 'degree', e.target.value)} className="input-field" />
                  <input placeholder="Institution" value={edu.institution} onChange={e => updateItem(setEducation, education, idx, 'institution', e.target.value)} className="input-field" />
                  <input placeholder="Year of Completion" value={edu.year} onChange={e => updateItem(setEducation, education, idx, 'year', e.target.value)} className="input-field" />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addItem(setEducation, education)} className="text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
              <FiPlus /> Add Education
            </button>
          </div>
        );
      case 3:
        return (
          <div className="animate-slide-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Work Experience</h2>
            {experience.map((exp, idx) => (
              <div key={idx} className="relative border border-slate-200 rounded-xl p-4 mb-4 bg-white/50 backdrop-blur-sm transition-all hover:shadow-md">
                {idx > 0 && (
                  <button type="button" onClick={() => removeItem(setExperience, experience, idx)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition">
                    <FiTrash2 />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input placeholder="Company" value={exp.company} onChange={e => updateItem(setExperience, experience, idx, 'company', e.target.value)} className="input-field" />
                  <input placeholder="Role / Title" value={exp.role} onChange={e => updateItem(setExperience, experience, idx, 'role', e.target.value)} className="input-field" />
                  <input placeholder="Duration (e.g., Jan 2020 - Present)" value={exp.duration} onChange={e => updateItem(setExperience, experience, idx, 'duration', e.target.value)} className="input-field" />
                  <textarea placeholder="Key responsibilities (raw)" value={exp.description} onChange={e => updateItem(setExperience, experience, idx, 'description', e.target.value)} className="input-field md:col-span-2" rows="2" />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addItem(setExperience, experience)} className="text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
              <FiPlus /> Add Experience
            </button>
          </div>
        );
      case 4:
        return (
          <div className="animate-slide-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Projects</h2>
            {projects.map((proj, idx) => (
              <div key={idx} className="relative border border-slate-200 rounded-xl p-4 mb-4 bg-white/50 backdrop-blur-sm transition-all hover:shadow-md">
                {idx > 0 && (
                  <button type="button" onClick={() => removeItem(setProjects, projects, idx)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition">
                    <FiTrash2 />
                  </button>
                )}
                <div className="grid grid-cols-1 gap-3">
                  <input placeholder="Project Title" value={proj.title} onChange={e => updateItem(setProjects, projects, idx, 'title', e.target.value)} className="input-field" />
                  <input placeholder="Tech Stack (comma separated)" value={proj.techStack} onChange={e => updateItem(setProjects, projects, idx, 'techStack', e.target.value)} className="input-field" />
                  <textarea placeholder="Description / your contributions" value={proj.description} onChange={e => updateItem(setProjects, projects, idx, 'description', e.target.value)} className="input-field" rows="2" />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addItem(setProjects, projects)} className="text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
              <FiPlus /> Add Project
            </button>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4 animate-slide-in">
            <h2 className="text-2xl font-bold text-slate-800">Skills & Title</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Resume Title (optional)</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input-field" placeholder="e.g., Full Stack Developer Resume" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Skills (comma separated)</label>
              <textarea value={skills} onChange={e => setSkills(e.target.value)} className="input-field" rows="3" placeholder="JavaScript, React, Node.js, Python, MongoDB, ..." />
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
              <p className="text-sm text-indigo-800 flex items-start gap-2">
                <span className="text-lg">✨</span>
                Once you generate, AI will enhance your experiences and projects into STAR‑format bullet points and create a professional summary.
              </p>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Stepper with animation */}
        <div className="flex items-center justify-between mb-10">
          {[1,2,3,4,5].map(num => (
            <div key={num} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= num ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}>
                {num}
              </div>
              {num < 5 && (
                <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-500 ${step > num ? 'bg-indigo-600' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-100 p-8 transition-all">
          <form onSubmit={handleSubmit}>
            {renderStep()}
            
            <div className="flex justify-between mt-10 pt-4 border-t border-slate-100">
              {step > 1 && (
                <button type="button" onClick={prevStep} className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-indigo-300 transition-all flex items-center gap-2">
                  <FiArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              {step < 5 ? (
                <button type="button" onClick={nextStep} className={`px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 ${step === 1 ? 'ml-auto' : ''}`}>
                  Next <FiArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Button type="submit" isLoading={loading} className="ml-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Generate AI Resume
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      {/* Animation keyframes */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ResumeBuilder;