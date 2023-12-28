import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/jobsearch`);
  };

  return (
    <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", textAlign: 'center', maxWidth: '500px', margin: 'auto'}}>
      <h1>Welcome to WorkIS</h1>
      <p>Explore exciting job opportunities and take the next step in your career with WorkIS.</p>
      <p>Our platform connects talented individuals with their dream jobs, making the job search process seamless and efficient.</p>
      <p>Your next career move is just a click away!</p>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Button variant="contained" onClick={handleSearch} size="large" style={{ marginLeft: '10px'}}>
          Start Searching
        </Button>
      </div>
    </div>
  );
};

export default Home;
