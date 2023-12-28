import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Typography, Alert } from '@mui/material';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div style={{margin: '150px', marginTop: '100px', justifyContent: 'center', alignContent: 'center', display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
      {error && <Alert severity="error">{error}</Alert>}

      {users?.length === 0 && !error && <Typography variant="body1">No users available.</Typography>}

      {users.map((user) => (
        <Card key={user._id} style={{ marginBottom: '20px', textAlign: 'center', minWidth: '600px' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {user.username}
            </Typography>
            <Typography color="textSecondary">
              <b>Email:</b> {user.email}
            </Typography>
            <Typography color="textSecondary">
              <b>Role:</b> {user.role}
            </Typography>

            <Button variant="contained" color="error" onClick={() => handleDeleteUser(user._id)}>
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Users;
