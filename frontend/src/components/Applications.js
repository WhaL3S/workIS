import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Typography, Alert } from '@mui/material';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/applications');
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to fetch applications.');
      }
    };

    fetchApplications();
  }, []);

  const handleDeleteApplication = async (applicationId) => {
    try {
      await axios.delete(`http://localhost:5000/api/applications/${applicationId}`);
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== applicationId)
      );
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  return (
    <div style={{margin: '150px', marginTop: '100px', justifyContent: 'center', alignContent: 'center', display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center'}}>
      {error && <Alert severity="error">{error}</Alert>}

      {applications.length === 0 && !error && (
        <Typography variant="body1">No applications available.</Typography>
      )}

      {applications.map((application) => (
        <Card key={application._id} style={{ marginBottom: '20px', minWidth: '600px'  }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {`${application.name} ${application.surname}`}
            </Typography>
            <Typography color="textSecondary">
              <b>Email:</b> {application.email}
            </Typography>
            <Typography color="textSecondary">
              <b>Resume:</b> {application.resume}
            </Typography>
            <Typography color="textSecondary">
              <b>Summary:</b> {application.summary}
            </Typography>

            <Button variant="contained" color="error" onClick={() => handleDeleteApplication(application._id)}>
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Applications;
