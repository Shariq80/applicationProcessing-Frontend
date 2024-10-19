import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const loginWithGoogle = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/google/url`);
    window.location.href = response.data.url;
  } catch (error) {
    console.error('Error initiating Google login:', error);
    throw error;
  }
};

export const handleGoogleCallback = async (code) => {
  try {
    const response = await axios.post(`${API_URL}/auth/google/callback`, { code });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return user;
  } catch (error) {
    console.error('Error handling Google callback:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  // You might want to decode the JWT token here to get user information
  // For simplicity, we're just returning a boolean indicating if a token exists
  return { isAuthenticated: true };
};