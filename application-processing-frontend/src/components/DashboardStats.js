// src/components/DashboardStats.js
import React from 'react';

function DashboardStats({ data }) {
  if (!data) return null;

  const {
    totalApplications = 0,
    processedApplications = 0,
    averageScore = 0,
  } = data;

  const processedPercentage = totalApplications > 0
    ? ((processedApplications / totalApplications) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Total Applications</h2>
        <p className="text-3xl font-bold">{totalApplications}</p>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Processed Applications</h2>
        <p className="text-3xl font-bold">{processedApplications} ({processedPercentage}%)</p>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Average Score</h2>
        <p className="text-3xl font-bold">{averageScore.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default DashboardStats;
