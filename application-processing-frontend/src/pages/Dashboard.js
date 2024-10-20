import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardData } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
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

  const handleManageJobs = () => {
    navigate('/jobs');
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      {dashboardData ? (
        <div>
          {/* Display dashboard data here */}
          <p>Total Jobs: {dashboardData.totalJobs}</p>
          <p>Total Applications: {dashboardData.totalApplications}</p>
        </div>
      ) : (
        <div>No dashboard data available</div>
      )}
      <button
        onClick={handleManageJobs}
        className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Manage Jobs
      </button>
    </div>
  );
}

export default Dashboard;
