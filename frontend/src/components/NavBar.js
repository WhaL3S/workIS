import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = ({ handleLogout, isLoggedIn, isAdmin, isEmployer, isEmployee }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/');
  };

  return (
    <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          WorkIS
        </Link>
      </Typography>
      <div>
          {isLoggedIn && (
            isAdmin ? (
            <>
              <Button component={Link} to="/admin-panel" color="inherit" variant="outlined" sx={{ marginRight: 2 }}>
                Admin panel
              </Button>
              <Button onClick={handleLogoutClick} color="inherit" variant="outlined">
                Logout
               </Button>
            </>) : null ||
            isEmployee ?       
            <>
              <Button component={Link} to="/my-applications" color="inherit" variant="outlined" sx={{ marginRight: 2 }}>
                My applications
              </Button>
              <Button component={Link} to="/jobsearch" color="inherit" variant="outlined" sx={{ marginRight: 2 }}>
                Find a job
              </Button>
              <Button onClick={handleLogoutClick} color="inherit" variant="outlined">
                Logout
              </Button>
            </> : null ||
            isEmployer ?     
            <>
              <Button component={Link} to="/post-job" color="inherit" variant="outlined" sx={{ marginRight: 2 }}>
                Post a job
              </Button>
              <Button component={Link} to="/my-jobs" color="inherit" variant="outlined" sx={{ marginRight: 2 }}>
                My jobs
              </Button>
              <Button onClick={handleLogoutClick} color="inherit" variant="outlined">
                Logout
              </Button>
            </> : null
          )}
          {!isLoggedIn && (
            <>
              <Button component={Link} to="/login" color="inherit" variant="outlined" sx={{ marginRight: 2 }}>
                Login
              </Button>
              <Button component={Link} to="/register" color="inherit" variant="outlined">
                Register
              </Button>
            </>
          )}
            
      </div>
    </Toolbar>
  </AppBar>
  );
};

export default NavBar;
