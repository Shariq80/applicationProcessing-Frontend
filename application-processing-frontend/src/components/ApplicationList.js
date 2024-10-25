// src/components/ApplicationList.js
import React, { useState } from 'react';
import { FaPaperclip, FaSort, FaSortUp, FaSortDown, FaEye } from 'react-icons/fa';
import { format, isValid } from 'date-fns';

function ApplicationList({ applications, onSelect, onDownloadAttachment, onViewDetails }) {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const sortedApplications = [...applications].sort((a, b) => {
    if (sortField === 'receivedDate') {
      const dateA = new Date(a.receivedDate);
      const dateB = new Date(b.receivedDate);
      if (isValid(dateA) && isValid(dateB)) {
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      // Handle invalid dates (put them at the end)
      if (!isValid(dateA)) return 1;
      if (!isValid(dateB)) return -1;
      return 0;
    }
    if (sortField === 'score') {
      return sortDirection === 'asc' ? a.score - b.score : b.score - a.score;
    }
    return 0;
  });

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Serial Number
          </th>
          <th 
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('receivedDate')}
          >
            Date {getSortIcon('receivedDate')}
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Applicant Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Email ID
          </th>
          <th 
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('score')}
          >
            Score {getSortIcon('score')}
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {sortedApplications.map((application, index) => (
          <tr key={application._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {application.receivedDate && isValid(new Date(application.receivedDate))
                ? format(new Date(application.receivedDate), 'MM/dd/yyyy')
                : 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {application.applicantName || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {application.applicantEmail || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {application.score !== undefined ? application.score : 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(application);
                }}
                className="text-indigo-600 hover:text-indigo-900 mr-2"
              >
                <FaEye />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadAttachment(application._id, application.attachmentId);
                }}
                className="text-indigo-600 hover:text-indigo-900"
              >
                <FaPaperclip />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ApplicationList;
