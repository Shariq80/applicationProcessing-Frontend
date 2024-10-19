import { useMemo } from 'react';

export default function DashboardStats({ jobs, applications }) {
  const stats = useMemo(() => {
    const activeJobs = jobs.filter(job => job.active).length;
    const totalApplications = applications.length;
    const averageScore = applications.length > 0
      ? applications.reduce((sum, app) => sum + app.score, 0) / applications.length
      : 0;
    const shortlistedApplications = applications.filter(app => app.status === 'shortlisted').length;

    return {
      activeJobs,
      totalApplications,
      averageScore: averageScore.toFixed(2),
      shortlistedApplications,
    };
  }, [jobs, applications]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Active Jobs" value={stats.activeJobs} />
      <StatCard title="Total Applications" value={stats.totalApplications} />
      <StatCard title="Average Score" value={stats.averageScore} />
      <StatCard title="Shortlisted" value={stats.shortlistedApplications} />
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </div>
  );
}
