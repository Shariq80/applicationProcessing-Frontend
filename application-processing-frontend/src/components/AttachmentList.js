import React from 'react';
import { FaFile, FaFilePdf, FaFileWord, FaFileImage, FaDownload } from 'react-icons/fa';

const getFileIcon = (fileType) => {
  switch (fileType) {
    case 'application/pdf':
      return <FaFilePdf />;
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return <FaFileWord />;
    case 'image/jpeg':
    case 'image/png':
      return <FaFileImage />;
    default:
      return <FaFile />;
  }
};

function AttachmentList({ attachments, onDownload }) {
  if (!attachments || attachments.length === 0) {
    return <p>No attachments available.</p>;
  }

  return (
    <ul className="divide-y divide-gray-200">
      {attachments.map((attachment) => (
        <li key={attachment._id} className="py-3 flex justify-between items-center">
          <div className="flex items-center">
            {getFileIcon(attachment.fileType)}
            <span className="ml-2">{attachment.filename}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500 mr-4">{attachment.fileSize} bytes</span>
            <button
              onClick={() => onDownload(attachment._id)}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaDownload />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default AttachmentList;
