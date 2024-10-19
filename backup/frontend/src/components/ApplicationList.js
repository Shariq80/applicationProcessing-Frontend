export default function ApplicationList({ applications }) {
    return (
      <div className="space-y-4">
        {applications.map((application) => (
          <div key={application._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{application.applicantEmail}</h3>
            <p className="text-gray-600">Score: {application.score}</p>
            <p className="text-gray-600">Summary: {application.summary}</p>
            <div className="mt-2">
              <h4 className="font-medium">Missing Skills:</h4>
              <ul className="list-disc list-inside">
                {application.missingSkills.map((skill, index) => (
                  <li key={index} className="text-gray-600">{skill}</li>
                ))}
              </ul>
            </div>
            <a href={`/api/download-resume?emailId=${application.emailId}`} className="mt-2 inline-block text-blue-500 hover:text-blue-700">
              Download Resume
            </a>
          </div>
        ))}
      </div>
    );
  }