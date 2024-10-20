import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApplicationList from '../components/ApplicationList';
import ApplicationDetails from '../components/ApplicationDetails';
import { fetchApplications, fetchAndProcessEmails, updateApplicationStatus } from '../services/api';

function ApplicationReview() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadApplications();
  }, [jobId]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await fetchApplications(jobId);
      setApplications(response.data);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessEmails = async () => {
    setIsProcessing(true);
    try {
      console.log('Starting to process emails for job:', jobId);
      const response = await fetchAndProcessEmails(jobId);
      console.log('Email processing response:', response);
      await loadApplications();
      console.log('Applications reloaded after processing emails');
    } catch (err) {
      console.error('Error processing emails:', err);
      setError(`Failed to process emails: ${err.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const updatedApplication = await updateApplicationStatus(applicationId, newStatus);
      setApplications(applications.map(app => 
        app._id === updatedApplication._id ? updatedApplication : app
      ));
      if (selectedApplication && selectedApplication._id === updatedApplication._id) {
        setSelectedApplication(updatedApplication);
      }
    } catch (err) {
      setError('Failed to update application status');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Application Review for Job {jobId}</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleProcessEmails}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Process New Emails'}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ApplicationList
          applications={applications}
          onSelect={setSelectedApplication}
        />
        {selectedApplication && (
          <ApplicationDetails
            application={selectedApplication}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </div>
    </div>
  );
}

export default ApplicationReview;