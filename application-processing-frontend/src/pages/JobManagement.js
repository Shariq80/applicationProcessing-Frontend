import React, { useState, useEffect } from 'react';
import JobList from '../components/JobList';
import JobForm from '../components/JobForm';
import { fetchJobs, createJob, updateJob, deleteJob } from '../services/api';

function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const response = await fetchJobs();
    setJobs(response.data);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Job Management</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => setOpenDialog(true)}
      >
        Create New Job
      </button>
      <JobList jobs={jobs} onEdit={handleEditJob} onDelete={handleDeleteJob} />
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
