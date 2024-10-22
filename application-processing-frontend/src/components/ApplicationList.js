// src/components/ApplicationList.js
import React from 'react';
import { FaPaperclip } from 'react-icons/fa';

function ApplicationList({ applications, onSelect, onViewAttachments }) {
  return (
    <ul className="divide-y divide-gray-200">
      {applications.map((application) => (
        <li
          key={application._id}
          className="py-4 cursor-pointer hover:bg-gray-50"
          onClick={() => onSelect(application)}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {application.applicantEmail}
              </p>
              <p className="text-sm text-gray-500 truncate">
                Score: {application.score}
              </p>
            </div>
            <div className="flex items-center">
              {application.hasAttachments && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewAttachments(application);
                  }}
                  className="mr-2 text-blue-500 hover:text-blue-700"
                >
                  <FaPaperclip />
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ApplicationList;
