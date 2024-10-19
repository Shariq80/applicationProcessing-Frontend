import { useState, useEffect } from 'react';
import { fetchJobs, createJob, updateJob, deleteJob } from '../utils/api';

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchJobs();
      setJobs(data);
      setError(null);
    } catch (err) {
      setError('Failed to load jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addJob = async (jobData) => {
    try {
      const newJob = await createJob(jobData);
      setJobs([...jobs, newJob]);
      return newJob;
    } catch (err) {
      setError('Failed to add job');
      console.error(err);
    }
  };

  const editJob = async (id, updates) => {
    try {
      const updatedJob = await updateJob(id, updates);
      setJobs(jobs.map(job => job._id === id ? updatedJob : job));
      return updatedJob;
    } catch (err) {
      setError('Failed to update job');
      console.error(err);
    }
  };

  const removeJob = async (id) => {
    try {
      await deleteJob(id);
      setJobs(jobs.filter(job => job._id !== id));
    } catch (err) {
      setError('Failed to delete job');
      console.error(err);
    }
  };

  return { jobs, loading, error, loadJobs, addJob, editJob, removeJob };
};