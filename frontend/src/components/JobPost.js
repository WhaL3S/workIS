import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Alert } from '@mui/material';

const JobPost = ({ user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [company, setCompany] = useState('');
  const [type, setType] = useState('Part-time');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isFormCollapsed, setFormCollapsed] = useState(false);
  const employerId = user._id;

  const handlePostJob = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      // Assuming you have an API endpoint for posting jobs
      await axios.post("http://localhost:5000/api/jobs", {
        title,
        description,
        location,
        type,
        salary: parseInt(salary),
        company,
        employer: employerId,
      });

      setSuccessMessage('Job posted successfully!');
      setTitle('');
      setDescription('');
      setLocation('');
      setType('');
      setSalary('');
      setCompany('');
    } catch (error) {
      setErrorMessage('Posting job failed');
      console.error('Error posting job:', error);
    }
  };

  const handleToggleForm = () => {
    setFormCollapsed((prev) => !prev);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {!isFormCollapsed && (
      <form
        style={{ maxWidth: '600px', margin: 'auto', padding: '20px', textAlign: 'center', width: '50%' }}
        onSubmit={handlePostJob}
      >
        <h2>Job Posting</h2>
        <div style={{ marginBottom: '20px' }}>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Job Title"
            fullWidth
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Job Description"
            multiline
            fullWidth
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Job Location"
            fullWidth
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Input
            type="number"
            value={salary}
            onChange={(e) => setSalary(parseInt(e.target.value, 10))}
            placeholder="Salary"
            fullWidth
            required
            inputProps={{ min: 0 }} 
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
            fullWidth
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <RadioGroup
            row
            aria-label="Type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <FormControlLabel
              value="Part-time"
              control={<Radio />}
              label="Part-time"
              checked={type === 'Part-time'}
            />
            <FormControlLabel
              value="Full-time"
              control={<Radio />}
              label="Full-time"
              checked={type === 'Full-time'}
            />
            <FormControlLabel
              value="Flexible"
              control={<Radio />}
              label="Flexible"
              checked={type === 'Flexible'}
            />
          </RadioGroup>
        </div>
        <Button variant="contained" size="large" type="submit" style={{ width: "100%" }}>
          Post Job
        </Button>
        {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
      </form>
      )}
      <Button variant="contained" onClick={handleToggleForm} style={{ maxWidth: '150px', margin: 'auto', width: '20%', marginTop: isFormCollapsed ? '80px' : '' }}>
        {isFormCollapsed ? 'Expand ▼' : 'Collapse ▲'}
      </Button>
    </div>
  );
};

export default JobPost;
