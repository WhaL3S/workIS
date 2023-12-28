import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Typography, Alert } from '@mui/material';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs');
        setJobs(response.data.jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to fetch jobs.');
      }
    };

    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <div style={{ margin: '150px', marginTop: '100px', justifyContent: 'center', alignContent: 'center', display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center'}}>
      {error && <Alert severity="error">{error}</Alert>}

      {jobs.length === 0 && !error && <Typography variant="body1">No jobs available.</Typography>}

      {jobs.map((job) => (
        <Card key={job._id} style={{ marginBottom: '20px', minWidth: '600px'  }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {job.title}
            </Typography>
            <Typography color="textSecondary">
              <b>Company:</b> {job.company}
            </Typography>
            <Typography color="textSecondary">
              <b>Location:</b> {job.location}
            </Typography>
            <Typography color="textSecondary">
              <b>Type:</b> {job.type}
            </Typography>
            <Typography color="textSecondary">
              <b>Salary:</b> {job.salary}
            </Typography>

            <Button variant="contained" color="error" onClick={() => handleDeleteJob(job._id)}>
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Jobs;
