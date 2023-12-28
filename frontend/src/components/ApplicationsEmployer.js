import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { Alert, Card, CardContent, List, ListItem, Paper, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const ApplicationsEmployer = () => {
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  let { jobId } = useParams();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/${jobId}/applications`, {
          params: { page: currentPage },
        });
        setApplications(response.data.applications);

        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to fetch applications.');
      }
    };

    fetchApplications();
  }, [jobId, currentPage]);

  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      {applications.length === 0 && !error && (
        <Typography variant="body1">No applications available for this job.</Typography>
      )}
        <div style={{display: "flex",justifyContent: "center",alignItems: "center",textAlign: "center",verticalAlign: "middle", flexDirection: 'column' }}>
            <Paper elevation={3} style={{ 
                padding: '20px', 
                margin: '40px 0 150px 0', 
                width: '40%', 
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                verticalAlign: "middle",
                flexDirection: 'column',
                
                }}>
                {applications.length > 0 && (
                <>
                    <List>
                    {applications.map((application) => (
                        <ListItem key={application._id} style={{ marginBottom: '20px' }}>
                            <Card>
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
                                </CardContent>
                            </Card>
                        </ListItem>
                    ))}
                    </List>

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
                </>
                )}
            </Paper>
        </div>
    </div>
  );
};

export default ApplicationsEmployer;
