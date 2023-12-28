import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

const MyApplications = ({ user }) => {
  const [userApplications, setUserApplications] = useState([]);

  const fetchUserApplications = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${user._id}/applications`);
      setUserApplications(response.data);
    } catch (error) {
      console.error('Error fetching user applications:', error);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      await axios.delete(`http://localhost:5000/api/applications/${applicationId}`);
      // After deletion, fetch updated user applications
      fetchUserApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  useEffect(() => {
    fetchUserApplications();
  }, [user._id]);

  return (
    <div style={{ marginTop: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', marginBottom: '150px' }}>
      <h2>Your Applications</h2>
      <ul style={{ listStyle: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0px' }}>
        {userApplications.map((application) => (
          <li key={application._id} style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
            <strong>Job Title:</strong> {application.jobId.title} <br />
            <strong>Company:</strong> {application.jobId.company} <br />
            <strong>Application Status:</strong> Applied <br />
            <Button
              size="large"
              variant="contained"
              style={{ margin: '10px 0px', backgroundColor: '#f44336', color: 'white' }}
              onClick={() => handleDeleteApplication(application._id)}
            >
              Delete Application
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyApplications;
