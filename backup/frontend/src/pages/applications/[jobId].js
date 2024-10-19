import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { fetchApplications, processEmails, fetchAndProcessEmails } from '../../utils/api';
import ApplicationList from '../../components/ApplicationList';

export default function JobApplications() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { jobId } = router.query;
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isAuthenticated && jobId) {
      loadApplications();
    }
  }, [isAuthenticated, jobId]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const applicationsData = await fetchApplications(jobId);
      setApplications(applicationsData);
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessEmails = async () => {
    setIsProcessing(true);
    try {
      console.log('Processing emails for job:', jobId);
      const result = await fetchAndProcessEmails(jobId);
      console.log('Email processing result:', result);
      await loadApplications();
    } catch (err) {
      console.error('Error processing emails:', err);
      setError('Failed to process emails: ' + (err.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view applications</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Applications for Job ID: {jobId}</h1>
      <button
        onClick={handleProcessEmails}
        disabled={isProcessing}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Process New Emails'}
      </button>
      {loading ? (
        <p>Loading applications...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ApplicationList applications={applications} />
      )}
    </Layout>
  );
}
