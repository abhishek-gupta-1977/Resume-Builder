import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const resumeAPI = {
  // Generate new resume from user input
  generate: (data) => api.post('/resume/generate', data),
  
  // Update existing resume
  update: (resumeId, data) => api.put(`/resume/${resumeId}`, data),
  
  // Export as PDF (returns blob)
  exportPdf: async (resumeId) => {
    const response = await api.get(`/resume/${resumeId}/export`, {
      responseType: 'blob'
    });
    return response;
  },
  
 
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default api;