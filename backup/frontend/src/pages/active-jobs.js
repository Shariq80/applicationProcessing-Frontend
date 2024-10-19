import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { fetchJobs, fetchApplications } from '../utils/api';
import Link from 'next/link';

export default function ActiveJobs() {
  const { isAuthenticated } = useAuth();
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadActiveJobs();
    }
  }, [isAuthenticated]);

  const loadActiveJobs = async () => {
    try {
      setLoading(true);
      const jobs = await fetchJobs();
      setActiveJobs(jobs.filter(job => job.active));
    } catch (err) {
      setError('Failed to load active jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view active jobs</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Active Job Postings</h1>
      {loading ? (
        <p>Loading active jobs...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : activeJobs.length > 0 ? (
        <div className="space-y-4">
          {activeJobs.map(job => (
            <div key={job._id} className="bg-white p-4 rounded shadow