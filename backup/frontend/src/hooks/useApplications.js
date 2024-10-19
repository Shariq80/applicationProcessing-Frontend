import { useState, useEffect } from 'react';
import { fetchApplications, processEmails } from '../utils/api';

export const useApplications = (jobId) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (jobId) {
      loadApplications(jobId);
    }
  }, [jobId]);

  const loadApplications = async (id) => {
    try {
      setLoading(true);
      const data = await fetchApplications(id);
      setApplications(data);
      setError(null);
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processNewEmails = async () => {
    try {
      setLoading(true);
      const result = await processEmails(jobId);
      setApplications(result.applications);
      setError(null);
      return result.message;
    } catch (err) {
      setError('Failed to process new emails');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { applications, loading, error, loadApplications, processNewEmails };
};