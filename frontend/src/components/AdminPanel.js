import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

const AdminPanel = () => {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <div
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Button component={Link} to="/applications" variant="contained" size="large" style={{ margin: '12px'}} >
          Applications
        </Button>
        <Button component={Link} to="/jobs" variant="contained" size="large" style={{ margin: '12px'}}>
          Jobs
        </Button>
        <Button component={Link} to="/users" variant="contained" size="large" style={{ margin: '12px'}}>
          Users
        </Button>
      </div>
    </Container>
  );
};

export default AdminPanel;
