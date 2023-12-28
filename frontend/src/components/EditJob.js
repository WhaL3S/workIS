import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobDetails, setJobDetails] = useState({});

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
        setJobDetails(response.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleUpdateJob = async () => {
    try {
      await axios.put(`http://localhost:5000/api/jobs/${jobId}`, jobDetails);
      navigate('/');
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleChange = (field, value) => {
    setJobDetails((prevDetails) => ({ ...prevDetails, [field]: value }));
  };

  return (
    <div style={{ verticalAlign: 'center', display: 'flex', flexDirection: 'column', margin: '100px 400px' }}>
      <h2 style={{alignText: 'center'}}>Edit Job</h2>
      <TextField
        label="Title"
        value={jobDetails.title || ''}
        onChange={(e) => handleChange('title', e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={jobDetails.description || ''}
        onChange={(e) => handleChange('description', e.target.value)}
        multiline
        fullWidth
        margin="normal"
      />
      <TextField
        label="Location"
        value={jobDetails.location || ''}
        onChange={(e) => handleChange('location', e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Salary"
        value={jobDetails.salary || ''}
        onChange={(e) => handleChange('salary', e.target.value)}
        type="number"
        fullWidth
        margin="normal"
        inputProps={{ min: 0 }}
      />
      <TextField
        label="Company"
        value={jobDetails.company || ''}
        onChange={(e) => handleChange('company', e.target.value)}
        fullWidth
        margin="normal"
      />
      <RadioGroup
        row
        aria-label="Type"
        name="type"
        value={jobDetails.type || ''}
        onChange={(e) => handleChange('type', e.target.value)}
        required
      >
        <FormControlLabel
          value="Part-time"
          control={<Radio />}
          label="Part-time"
        />
        <FormControlLabel
          value="Full-time"
          control={<Radio />}
          label="Full-time"
        />
        <FormControlLabel
          value="Flexible"
          control={<Radio />}
          label="Flexible"
        />
      </RadioGroup>

      <Button onClick={handleUpdateJob} color="primary">
        Confirm
      </Button>
    </div>
  );
};

export default EditJob;
