import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = () => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;

export const checkAuth = async () => {
  try {
    const response = await api.get('/auth/check');
    return response.data.isAuthenticated;
  } catch (error) {
    console.error('Error checking auth status:', error);
    return false;
  }
};

export const fetchJobs = () => api.get('/jobs');
export const createJob = (jobData) => api.post('/jobs', jobData);
export const updateJob = (id, jobData) => api.put(`/jobs/${id}`, jobData);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);

export const fetchApplications = (jobId) => api.get(`/applications/${jobId}`);
export const fetchAndProcessEmails = async (jobId) => {
  try {
    console.log('Sending request to process emails for job:', jobId);
    const response = await api.post(`/applications/${jobId}/process-emails`);
    console.log('Response from processing emails:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in fetchAndProcessEmails:', error.response || error);
    throw error;
  }
};

export default api;
