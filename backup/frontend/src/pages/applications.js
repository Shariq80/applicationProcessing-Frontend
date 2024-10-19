import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { fetchApplications } from '../utils/api';

export default function Applications() {
  const { isAuthenticated } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadApplications();
    }
  }, [isAuthenticated]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const applicationsData = await fetchApplications();
      setApplications(applicationsData);
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
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
      <h1 className="text-3xl font-bold mb-8">Applications</h1>
      {loading ? (
        <p>Loading applications...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : applications.length > 0 ? (
        <ul>
          {applications.map(app => (
            <li key={app._id} className="mb-4 p-4 border rounded">
              <h2 className="text-xl font-semibold">{app.applicantName}</h2>
              <p>Email: {app.applicantEmail}</p>
              <p>Job: {app.jobTitle}</p>
              <p>Score: {app.score}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No applications found.</p>
      )}
    </Layout>
  );
}
