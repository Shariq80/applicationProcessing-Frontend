export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };
  
  export const calculateAverageScore = (applications) => {
    if (applications.length === 0) return 0;
    const sum = applications.reduce((acc, app) => acc + app.score, 0);
    return (sum / applications.length).toFixed(2);
  };
  
  export const sortApplications = (applications, sortBy = 'score', order = 'desc') => {
    return [...applications].sort((a, b) => {
      if (order === 'asc') {
        return a[sortBy] - b[sortBy];
      } else {
        return b[sortBy] - a[sortBy];
      }
    });
  };