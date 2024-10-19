import { useState } from 'react';

export default function JobList({ jobs, onJobUpdate, onJobDelete }) {
  const [editingJob, setEditingJob] = useState(null);

  const handleStatusChange = async (id, active) => {
    await onJobUpdate(id, { active });
  };

  const handleEdit = (job) => {
    setEditingJob(job);
  };

  const handleSave = async (job) => {
    await onJobUpdate(job._id, job);
    setEditingJob(null);
  };

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job._id} className="bg-white p-4 rounded shadow">
          {editingJob && editingJob._id === job._id ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editingJob.title}
                onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <textarea
                value={editingJob.description}
                onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows="3"
              />
              <button onClick={() => handleSave(editingJob)} className="bg-blue-500 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={job.active}
                    onChange={(e) => handleStatusChange(job._id, e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
                <div>
                  <button 
                    onClick={() => onJobUpdate(job._id, { ...job })} 
                    className="btn btn-primary mr-2"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onJobDelete(job._id)} 
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
