import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';
import { fetchJobs, createJob, updateJob, deleteJob, fetchApplications } from '../services/api';

function JobManagement() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

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

  const handleDeleteJob = async (jobId) => {
    await deleteJob(jobId);
    loadJobs();
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setOpenDialog(true);
  };

  const handleViewApplications = (job) => {
    navigate(`/applications/${encodeURIComponent(job.title)}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Job Management</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => setOpenDialog(true)}
      >
        Create New Job
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
    </div>
  );
}

export default JobManagement;
