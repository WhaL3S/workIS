// PostedJob.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material';
import DeleteDialog from './DeleteDialog';

const PostedJob = ({ user }) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJobForEdit, setSelectedJobForEdit] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const employerId = user._id;

  useEffect(() => {
    const fetchPostedJobs = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/employers/${employerId}/jobs`);
        setPostedJobs(response.data);
      } catch (error) {
        console.error('Error fetching posted jobs:', error);
      }
    };

    fetchPostedJobs();
  }, [employerId]);

  const handleEditClick = (job) => {
    setSelectedJobForEdit(job);
  };

  const handleDeleteClick = (job) => {
    setSelectedJobForEdit(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteJob = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${selectedJobForEdit._id}`, {
        params: { user: user._id },
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <>
      {postedJobs.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', marginBottom: '150px' }}>
          <h2>Your Posted Jobs</h2>
          <ul style={{ listStyle: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {postedJobs.map((job) => (
              <li key={job._id} style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                <strong>{job.title}</strong> - {job.company} ({job.type}) -
                <Button
                  component={Link}
                  size="large"
                  to={job.applications.length >= 1 ? `/${job._id}/applications` : '#'}
                  disabled={job.applications.length < 1}
                  variant={job.applications.length < 1 ? "outlined" : "contained"}
                  color="success"
                  style={{ margin: '10px 5px' }}
                >
                  View Applications
                </Button>
                <Button
                  component={Link}
                  to={`/edit-job/${job._id}`} // Use the appropriate path for EditJob
                  variant="contained"
                  size="large"
                  style={{ margin: '10px 5px' }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleDeleteClick(job)}
                  style={{ margin: '10px 5px', backgroundColor: '#f44336', color: 'white' }}
                >
                  Delete
                </Button>
                {' '}
              </li>
            ))}
          </ul>
        </div>
      )}

      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDeleteJob}
      />
    </>
  );
};

export default PostedJob;
