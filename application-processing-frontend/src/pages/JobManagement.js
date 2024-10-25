import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';
import { fetchJobs, createJob, updateJob, deleteJob, fetchApplications } from '../services/api';

function JobManagement() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const response = await fetchJobs();
    console.log('Fetched jobs:', response.data);
    
    const jobsWithApplicationCount = await Promise.all(response.data.map(async (job) => {
      const applicationsResponse = await fetchApplications(encodeURIComponent(job.title));
      return { ...job, applicationCount: applicationsResponse.data.length };
    }));

    console.log('Jobs with application count:', jobsWithApplicationCount);
    setJobs(jobsWithApplicationCount);
  };

  const handleCreateJob = async (jobData) => {
    await createJob(jobData);
    loadJobs();
    setOpenDialog(false);
  };

  const handleUpdateJob = async (jobData) => {
    await updateJob(editingJob._id, jobData);
    loadJobs();
    setOpenDialog(false);
    setEditingJob(null);
  };

  const handleDeleteJob = (jobId) => {
    setDeleteConfirmation(jobId);
  };

  const confirmDeleteJob = async () => {
    if (deleteConfirmation) {
      try {
        await deleteJob(deleteConfirmation);
        // The backend should handle deleting associated applications
        setJobs(jobs.filter(job => job._id !== deleteConfirmation));
        setDeleteConfirmation(null);
      } catch (error) {
        console.error('Error deleting job:', error);
        // Handle error (e.g., show an error message to the user)
      }
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setOpenDialog(true);
  };

  const handleViewApplications = (job) => {
    navigate(`/applications/${encodeURIComponent(job.title)}`);
  };

  const handleSubmitJob = async (jobData) => {
    if (editingJob) {
      await handleUpdateJob(jobData);
    } else {
      await handleCreateJob(jobData);
    }
    setShowForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Job Management</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => {
          setEditingJob(null);
          setShowForm(true);
        }}
      >
        Add New Job
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Applications
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{job.applicationCount !== undefined ? job.applicationCount : 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewApplications(job)}
                    className="text-green-600 hover:text-green-900 mr-2"
                  >
                    View Applications
                  </button>
                  <button
                    onClick={() => handleEditJob(job)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {openDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {editingJob ? 'Edit Job' : 'Create New Job'}
            </h3>
            <JobForm
              job={editingJob}
              onSubmit={editingJob ? handleUpdateJob : handleCreateJob}
              onCancel={() => {
                setOpenDialog(false);
                setEditingJob(null);
              }}
            />
          </div>
        </div>
      )}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this job?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteJob}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showForm && (
        <JobForm
          job={editingJob}
          onSubmit={handleSubmitJob}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default JobManagement;
