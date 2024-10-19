import { useState, useEffect } from 'react';
import { fetchJobs } from '../utils/api';

export default function ActiveJobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await fetchJobs();
      setJobs(jobsData.filter(job => job.active));
    } catch (err) {
      setError('Failed to load jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading active jobs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-gray-600">{job.description}</p>
          </div>
        ))
      ) : (
        <p>No active job postings at the moment.</p>
      )}
    </div>
  );
}
