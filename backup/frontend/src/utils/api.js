import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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

export const fetchJobs = async () => {
  const response = await api.get('/jobs');
  return response.data;
};

export const createJob = async (jobData) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

export const fetchApplications = async (jobId) => {
  const response = await api.get(`/applications?jobId=${jobId}`);
  return response.data.applications;
};

export const processEmails = async (activeJobId) => {
  const response = await api.post('/process-emails', { activeJobId });
  return response.data;
};

export default api;
