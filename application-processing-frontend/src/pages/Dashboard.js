import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardStats from '../components/DashboardStats';
import { fetchDashboardData } from '../services/api';

function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        console.log('Fetching dashboard data...');
        const data = await fetchDashboardData();
        console.log('Dashboard data received:', data);
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data: ' + err.message);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.email}</h1>
      {dashboardData ? (
        <DashboardStats data={dashboardData} />
      ) : (
        <div>No dashboard data available</div>
      )}
    </div>
  );
}

export default Dashboard;
