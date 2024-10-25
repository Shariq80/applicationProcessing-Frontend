import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApplicationDetails from '../components/ApplicationDetails';
import ApplicationList from '../components/ApplicationList';
import { fetchApplications, fetchAndProcessEmails, downloadAttachment, deleteApplication, fetchJobs, fetchJobById, parseResume } from '../services/api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      if (!jobTitle) {
        throw new Error('Job title is undefined');
      }
      const encodedJobTitle = encodeURIComponent(jobTitle);
      const applicationsResponse = await fetchApplications(encodedJobTitle, startDate, endDate);
      setApplications(applicationsResponse.data);
      console.log('Applications data:', applicationsResponse.data);

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
  }, [jobTitle, startDate, endDate]);

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
      if (err.response && err.response.status === 404) {
        setError('Attachment not found. The file may have been deleted or moved.');
      } else {
        setError('Failed to download attachment. Please try again later.');
      }
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      await deleteApplication(applicationId);
      setSelectedApplication(null); // Close the modal
      await loadApplications(); // Refresh the application list
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

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
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
      <div className="mb-4 flex items-center">
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          className="mr-2 p-2 border rounded"
        />
        <DatePicker
          selected={endDate}
          onChange={date => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="End Date"
          className="mr-2 p-2 border rounded"
        />
        <button
          onClick={loadApplications}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Filter
        </button>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleProcessEmails}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Process New Emails'}
      </button>
      <ApplicationList
        applications={applications}
        onSelect={setSelectedApplication}
        onDownloadAttachment={handleDownloadAttachment}
        onViewDetails={handleViewDetails}
      />
      {selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
            <ApplicationDetails
              application={selectedApplication}
              onDownloadAttachment={handleDownloadAttachment}
              onDeleteApplication={handleDeleteApplication}
              onClose={() => setSelectedApplication(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationReview;
