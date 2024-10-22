// src/components/JobList.js
import React from 'react';
import { Link } from 'react-router-dom';

function JobList({ jobs, onEdit, onDelete, onViewApplications }) {
  return (
    <ul className="divide-y divide-gray-200">
      {jobs.map((job) => (
        <li key={job._id} className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{job.title}</h3>
              <p className="text-gray-600">{job.description}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onViewApplications(job)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                View Applications
              </button>
              <button
                onClick={() => onEdit(job)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(job._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default JobList;
