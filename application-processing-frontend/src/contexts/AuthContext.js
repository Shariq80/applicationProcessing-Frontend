import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider mounted');
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token found, verifying...');
      verifyToken(token);
    } else {
      console.log('No token found');
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Token verification response:', response.data);
      if (response.data.success) {
        console.log('Token verified, setting user');
        setUser(response.data.user);
      } else {
        console.log('Token invalid, removing from storage');
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    console.log('Login attempt in AuthContext');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
      console.log('Login response:', response.data);
      if (response.data._id && response.data.email && response.data.token) {
        console.log('Login successful, setting user and token');
        const user = { _id: response.data._id, email: response.data.email };
        setUser(user);
        localStorage.setItem('token', response.data.token);
        return { success: true, user };
      } else {
        console.log('Login failed: Unexpected response format');
        return { success: false, message: 'Unexpected response format' };
      }
    } catch (error) {
      console.error('Error in login function:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'An error occurred during login' 
      };
    }
  };

  const logout = () => {
    console.log('Logging out');
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  console.log('AuthContext value:', value);

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
