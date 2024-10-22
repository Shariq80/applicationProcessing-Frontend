import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApplicationDetails from '../components/ApplicationDetails';
import { fetchApplications, fetchAndProcessEmails, downloadResume, deleteApplication, fetchJobs , fetchJobById, parseResume, downloadAttachment } from '../services/api';

function ApplicationReview() {
  const { jobTitle } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [job, setJob] = useState(null);
  const [parsingApplications, setParsingApplications] = useState({});

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      if (!jobTitle) {
        throw new Error('Job title is undefined');
      }
      const encodedJobTitle = encodeURIComponent(jobTitle);
      const applicationsResponse = await fetchApplications(encodedJobTitle);
      setApplications(applicationsResponse.data);

      // Fetch all jobs and find the one matching the title
      const allJobsResponse = await fetchJobs();
      const matchingJob = allJobsResponse.data.find(job => job.title === jobTitle);
      if (!matchingJob) {
        throw new Error('Job not found');
      }
      const jobResponse = await fetchJobById(matchingJob._id);
      setJob(jobResponse);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [jobTitle]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleProcessEmails = async () => {
    setIsProcessing(true);
    try {
      const response = await fetchAndProcessEmails(jobTitle);
      await loadApplications();
    } catch (err) {
      setError(`Failed to process emails: ${err.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAttachment = async (applicationId, attachmentId) => {
    try {
      const response = await downloadAttachment(applicationId, attachmentId);
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/['"]/g, '') || `attachment_${attachmentId}`
        : `attachment_${attachmentId}`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading attachment:', err);
      setError('Failed to download attachment. Please try again. Error: ' + err.message);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      await deleteApplication(applicationId);
      await loadApplications();
    } catch (err) {
      setError('Failed to delete application. Please try again.');
    }
  };

  const handleParseResume = async (applicationId) => {
    setParsingApplications(prev => ({ ...prev, [applicationId]: true }));
    try {
      await parseResume(applicationId);
      await loadApplications();
    } catch (err) {
      setError(`Failed to parse resume: ${err.message || 'Unknown error'}`);
    } finally {
      setParsingApplications(prev => ({ ...prev, [applicationId]: false }));
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
      <h1 className="text-3xl font-bold mb-4">Application Review for Job: {jobTitle}</h1>
      {job && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Job Description:</h2>
          <p className="text-gray-700">{job.description}</p>
        </div>
      )}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleProcessEmails}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Process New Emails'}
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Applicant Email
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{application.applicantEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{application.score}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedApplication(application)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDeleteApplication(application._id)}
                    className="text-red-600 hover:text-red-900 mr-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleDownloadAttachment(application._id, application.attachmentId)}
                    className="text-green-600 hover:text-green-900 mr-2"
                  >
                    Download Resume
                  </button>
                  {!application.resumeText && (
                    <button
                      onClick={() => handleParseResume(application._id)}
                      className="text-yellow-600 hover:text-yellow-900"
                      disabled={parsingApplications[application._id]}
                    >
                      {parsingApplications[application._id] ? 'Parsing...' : 'Parse Resume'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
            <ApplicationDetails
              application={selectedApplication}
              onDownloadAttachment={handleDownloadAttachment}
            />
            <button
              onClick={() => setSelectedApplication(null)}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationReview;
