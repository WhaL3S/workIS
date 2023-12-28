import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import JobList from './components/JobList';
import JobPost from './components/JobPost';
import PrivateRoute from './components/PrivateRoute'; 
import Register from './components/Register';
import axios from 'axios';
import AdminPanel from './components/AdminPanel';
import Applications from './components/Applications';
import PostedJob from './components/PostedJob';
import EditJob from './components/EditJob';
import Jobs from './components/Jobs';
import Users from './components/Users';
import ApplicationsEmployer from './components/ApplicationsEmployer';
import MyApplications from './components/MyApplications';
import { Alert } from '@mui/material';

const App = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployer, setIsEmployer] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user?.role === 'Admin') {
      setIsAdmin(true);
      setIsEmployer(false);
      setIsEmployee(false);
    } else if (user?.role === 'Employee') {
      setIsAdmin(false);
      setIsEmployer(false);
      setIsEmployee(true);
    } else if (user?.role === 'Employer') {
      setIsAdmin(false);
      setIsEmployer(true);
      setIsEmployee(false);
    }
  }, [user])

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      verifyTokenWithBackend(storedToken)
        .catch(() => {
          
          localStorage.removeItem('token');
          return (
            <>
               <Alert severity="error" sx={{ mt: 2 }}>
                Session expired. Please log in again.
              </Alert>
            </>
          );
        } );

        setData(storedToken);
    }
  }, []);

  const handleLogin = (token, user) => {
    localStorage.setItem('token', token);
    setUser(user);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const setData = async (storedToken) => {
    const res = await axios.get("http://localhost:5000/api/user", {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${storedToken}`,
    }});

    setUser(res?.data?.user);
  }
  
  const verifyTokenWithBackend = async (token) => {
    return new Promise((resolve, reject) => {
      const backendEndpoint = 'http://localhost:5000/api/verify-token';
      fetch(backendEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            resolve();
          } else {
            reject();
          }
        })
        .catch(() => reject());
    });
  };

  return (
    <>
      <NavBar handleLogout={handleLogout} isLoggedIn={user} isAdmin={isAdmin} isEmployee={isEmployee} isEmployer={isEmployer} />
      <Routes>

        <Route path="/jobsearch" element={<JobList user={user} isEmployee={isEmployee} />} />

        <Route path='/my-applications' element={<PrivateRoute isLoggedIn={user} isAllowed={isEmployee} />}>
          <Route path="/my-applications" element={<MyApplications user={user} />} />
        </Route >
        
        <Route path='/post-job' element={<PrivateRoute isLoggedIn={user} isAllowed={isEmployer} />}>
          <Route path='/post-job' element={<JobPost user={user} />} />
        </Route >
        <Route path='/my-jobs' element={<PrivateRoute isLoggedIn={user} isAllowed={isEmployer} />}>
          <Route path='/my-jobs' element={<PostedJob user={user} />} />
        </Route >
        <Route path='/:jobId/applications' element={<PrivateRoute isLoggedIn={user} isAllowed={isEmployer} />}>
          <Route
              path="/:jobId/applications"
              element={<ApplicationsEmployer />}
            />
        </Route >

        <Route path="/edit-job/:jobId" element={<PrivateRoute isLoggedIn={user} isAllowed={isEmployer || isAdmin} />}>
          <Route path="/edit-job/:jobId" element={<EditJob />} />
        </Route >

        <Route path='/admin-panel' element={<PrivateRoute isLoggedIn={user} isAllowed={isAdmin} />}>
          <Route path='/admin-panel' element={<AdminPanel />} />
        </Route >

        <Route path='/users' element={<PrivateRoute isLoggedIn={user} isAllowed={isAdmin} />}>
          <Route path='/users' element={<Users />} />
        </Route >

        <Route path='/jobs' element={<PrivateRoute isLoggedIn={user} isAllowed={isAdmin} />}>
          <Route path='/jobs' element={<Jobs />} />
        </Route >

        <Route path='/applications' element={<PrivateRoute isLoggedIn={user} isAllowed={isAdmin} />}>
          <Route path='/applications' element={<Applications />} />
        </Route >
        
        <Route path='/login' element={<PrivateRoute isLoggedIn={!user} isAllowed={true} />}>
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        </Route>
        <Route path='/register' element={<PrivateRoute isLoggedIn={!user} isAllowed={true} />}>
          <Route path="/register" element={<Register />} />
        </Route>
      
        <Route path="/*" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
