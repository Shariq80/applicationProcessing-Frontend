import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchDashboardData } from '../services/api';
import DashboardStats from '../components/DashboardStats';
import JobManagement from './JobManagement';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data: ' + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const handleGoogleAuth = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/google/url`);
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error getting Google auth URL:', error);
      setError('Failed to initiate Google authorization');
    }
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      {dashboardData ? (
        <>
          <DashboardStats data={dashboardData} />
        </>
      ) : (
        <div>No dashboard data available</div>
      )}
      <button
        onClick={handleGoogleAuth}
        className="mt-8 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Connect Google Account
      </button>
      <JobManagement />
    </div>
  );
}

export default Dashboard;
