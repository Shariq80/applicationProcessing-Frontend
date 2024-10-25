import React, { useState, useEffect } from 'react';
import JobForm from '../components/JobForm';
import { fetchJobs, createJob, updateJob, deleteJob, fetchApplications } from '../services/api';
import { useNavigate } from 'react-router-dom';

function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const navigate = useNavigate();

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
        setJobs(jobs.filter(job => job._id !== deleteConfirmation));
        setDeleteConfirmation(null);
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setOpenDialog(true);
  };

  const handleSubmitJob = async (jobData) => {
    if (editingJob) {
      await handleUpdateJob(jobData);
    } else {
      await handleCreateJob(jobData);
    }
    setShowForm(false);
  };

  const handleViewApplications = (job) => {
    navigate(`/applications/${encodeURIComponent(job.title)}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Management</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setEditingJob(null);
            setOpenDialog(true);
          }}
        >
          Add New Job
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                S.No
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
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
            {jobs.map((job, index) => (
              <tr key={job._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{index + 1}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {job.updatedAt && new Date(job.updatedAt).getTime() !== new Date(job.createdAt).getTime()
                      ? `Updated at ${new Date(job.updatedAt).toLocaleString()}`
                      : new Date(job.createdAt).toLocaleString()}
                  </div>
                </td>
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

      {/* Modal for creating/editing jobs */}
      {openDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">{editingJob ? 'Edit Job' : 'Create New Job'}</h2>
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

      {/* Delete confirmation modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this job?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteJob}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobManagement;
