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

export const deleteApplication = async (applicationId) => {
  try {
    const response = await api.delete(`/applications/${applicationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting application:', error);
    throw error;
  }
};

export const fetchDashboardData = async () => {
  try {
    console.log('Fetching dashboard data from:', `${API_URL}/dashboard`);
    const token = localStorage.getItem('token');
    console.log('Using token:', token);
    
    const response = await axios.get(`${API_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Dashboard data response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error.response || error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
  }
};

export const fetchJobById = async (jobId) => {
  try {
    const response = await api.get('/jobs');
    const job = response.data.find(job => job._id === jobId);
    if (!job) {
      throw new Error('Job not found');
    }
    return job;
  } catch (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
};

export const downloadResume = async (applicationId) => {
  try {
    const response = await api.get(`/applications/${applicationId}/attachment`, {
      responseType: 'blob',
    });
    return response;
  } catch (error) {
    console.error('Error downloading resume:', error);
    throw error;
  }
};

export const parseResume = async (applicationId) => {
  try {
    const response = await api.post(`/applications/${applicationId}/parse-resume`);
    return response.data;
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
};

export const downloadAttachment = async (applicationId, attachmentId) => {
  try {
    const response = await api.get(`/applications/${applicationId}/attachment/${attachmentId}`, {
      responseType: 'blob',
    });
    return response;
  } catch (error) {
    console.error('Error downloading attachment:', error);
    throw error;
  }
};

export default api;
