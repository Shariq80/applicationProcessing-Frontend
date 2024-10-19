import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import JobList from '../components/JobList';
import JobForm from '../components/JobForm';
import { useAuth } from '../context/AuthContext';
import { fetchJobs, createJob } from '../utils/api';

export default function Jobs() {
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadJobs();
    }
  }, [isAuthenticated]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await fetchJobs();
      setJobs(jobsData);
    } catch (err) {
      setError('Failed to load jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (jobData) => {
    try {
      await createJob(jobData);
      await loadJobs();
    } catch (err) {
      setError('Failed to create job');
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to manage jobs</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Manage Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Create New Job</h2>
          <JobForm onSubmit={handleCreateJob} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Job Listings</h2>
          {loading ? (
            <p>Loading jobs...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <JobList jobs={jobs} onJobUpdate={loadJobs} />
          )}
        </div>
      </div>
    </Layout>
  );
}
