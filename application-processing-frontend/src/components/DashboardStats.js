// src/components/DashboardStats.js
import React from 'react';

function DashboardStats({ data }) {
  if (!data) return null;

  const {
    totalApplications = 0,
    totalJobs = 0,
  } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Total Applications</h2>
        <p className="text-3xl font-bold">{totalApplications}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Total Jobs</h2>
        <p className="text-3xl font-bold">{totalJobs}</p>
      </div>
    </div>
  );
}

export default DashboardStats;
