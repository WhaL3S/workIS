import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const JobList = ({ user, isEmployee }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [applicationData, setApplicationData] = useState({
    name: '',
    surname: '',
    summary: '',
    resume: '',
  });

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobs", {
        params: { searchTerm: searchQuery, page: 1 }
      });
      setJobs(response.data.jobs);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setSearchPerformed(true);
      setSelectedJob(response.data.jobs.length > 0 ? response.data.jobs[0] : null);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleJobClick = (job) => {
    if (selectedJob !== job) {
      setSelectedJob(job);
    }
  };

  const handlePageChange = async (newPage) => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobs", {
        params: { searchTerm: searchQuery, page: newPage }
      });
      setJobs(response.data.jobs);
      setCurrentPage(newPage);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };
  
  useEffect(() => {
    if (jobs.length > 0) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs]);

  const shortenDescription = (description, maxLength = 100) => {
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength) + '...';
  };

  const handleApplyClick = () => {
    if (!user) {
      setApplicationMessage("Please log in to apply for a job");
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleApplicationSubmit = async () => {
    try {
      if (applicationData.name === ''
        || applicationData.surname === ''
        || applicationData.summary === ''
        || applicationData.resume === '') {
          setApplicationMessage('All fields are required');
        } else {
          await axios.post(`http://localhost:5000/api/${selectedJob._id}/applications`, {
            jobId: selectedJob._id,
            applicantId: user._id,
            email: user.email,
            ...applicationData,
          });
    
          setApplicationMessage('Application submitted successfully!');
        }
    } catch (error) {
      if (error?.response?.data?.message === "You have already applied to this job"){
        setApplicationMessage('You have already applied to this job');
      } else {
        setApplicationMessage('Application submission failed.');
      }
      
      console.error('Error submitting application:', error);
    } finally {
      setApplicationData({
        name: '',
        surname: '',
        summary: '',
        resume: '',
      });
      handleModalClose();
      setTimeout(() => setApplicationMessage(''), 2000);
    }
  };

  return (
    <>
     {applicationMessage ? ( 
        <Alert variant='standard' size="large" severity={
          applicationMessage === 'Application submitted successfully!' 
          ? "success" 
          : (applicationMessage === 'Please log in to apply for a job'
            ? "info"
            : "error")} 
          sx={{ position: "absolute", top: "45%", left: "50%", transform: "translate(-50%, -50%)"}}>
          {applicationMessage}
        </Alert>
      ) : (
          <div style={{  maxWidth: '1000px', margin: 'auto', marginBottom: '100px', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', marginTop: searchPerformed ? '0' : '30%', width: searchPerformed ? '60%' : '80%', transition: ' 0.5s ease' }}>
              <Input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for jobs"
                style={{
                  width: '100%',
                  padding: '8px',
                  marginRight: searchPerformed ? '8px' : '0',
                  transition: '0.5s ease',
                }}
              />
              <Button
                variant="contained"
                size="large"
                onClick={handleSearch}
                style={{
                  marginLeft: '10px'
                }}
              >
                Search
              </Button>
            </div>
      
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ flex: 1, width: '40%', marginRight: '8px'}}>
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    style={{
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      margin: '20px 5px',
                      padding: '10px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleJobClick(job)}
                  >
                    <h3 style={{ marginBottom: '5px' }}>{job.title}</h3>
                    <p style={{ color: '#555' }}>{job.location} - {job.type}</p>
                    <p>{shortenDescription(job.description)}</p>
                  </div>
                ))}
                {totalPages > 1 && (
                  <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? 'contained' : 'outlined'}
                        size="small"
                        style={{ margin: '0 5px' }}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
      
              {selectedJob && (
                <div
                  style={{
                    flex: 1,
                    width: '60%',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    margin: '20px 5px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    maxHeight: '600px',
                    position: 'sticky',
                    top: '20px',
                  }}
                >
                  <h3>{selectedJob.title}</h3>
                  <p style={{ margin: '0px' }}><b>Location:</b> {selectedJob.location}</p>
                  <p style={{ margin: '0px' }}><b>Type:</b> {selectedJob.type}</p>
                  <p style={{ margin: '0px' }}><b>Location:</b> {selectedJob.location}</p>
                  <p style={{ margin: '0px' }}><b>Salary:</b> {selectedJob.salary} Euro</p>
                  <p style={{ margin: '0px' }}><b>Company:</b> {selectedJob.company}</p>
                  <p style={{ margin: '0px' }}><b>Employer:</b> {selectedJob.employer.username}</p>
                  <p style={{ margin: '20px 5px', textAlign: 'justify' }}>{selectedJob.description}</p>
                  {isEmployee &&
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleApplyClick}
                      style={{ margin: '10px 5px' }}
                    >
                      Apply
                    </Button>
                  }
                  <Dialog open={isModalOpen} onClose={handleModalClose} style={{padding: '5px'}}>
                  <DialogTitle>Apply to {selectedJob.title}</DialogTitle>
                  <DialogContent>
                    <TextField
                      required
                      type="text"
                      margin='normal'
                      value={applicationData.name}
                      onChange={(e) => setApplicationData({ ...applicationData, name: e.target.value })}
                      placeholder="Your Name"
                      fullWidth
                    />
                    <TextField
                      type="text"
                      margin='normal'
                      value={applicationData.surname}
                      onChange={(e) => setApplicationData({ ...applicationData, surname: e.target.value })}
                      placeholder="Your Surname"
                      fullWidth
                      required
                    />
                    <TextField
                      type="text"
                      margin='normal'
                      value={applicationData.resume}
                      onChange={(e) => setApplicationData({ ...applicationData, resume: e.target.value })}
                      placeholder="Link to your Resume"
                      fullWidth
                      required
                    />
                    <TextField
                      type="text"
                      margin='normal'
                      value={applicationData.summary}
                      onChange={(e) => setApplicationData({ ...applicationData, summary: e.target.value })}
                      placeholder="Your Summary (shortly tell about your achievements and/or plans)"
                      fullWidth
                      multiline
                      required
                    />
                    {!!(applicationData.name && applicationData.surname && applicationData.resume && applicationData.summary) 
                      ? null 
                      : <p style={{color: 'red', textAlign: 'right' }}>All fields are required</p>}
                  </DialogContent> 
                  <DialogActions>
                  <Button onClick={!!(applicationData.name && applicationData.surname && applicationData.resume && applicationData.summary) 
                      ? handleApplicationSubmit 
                      : null} variant="contained" color="primary" style={{margin: '8px 16px 16px 8px'}}>
                      Submit Application
                    </Button>
                    <Button onClick={handleModalClose} variant="contained" color="primary" style={{margin: '8px 16px 16px 8px'}}>
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
                </div>
              )}
            </div>
        </div>
      )}
    </>
  );
};

export default JobList;
