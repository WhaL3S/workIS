import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const EditDialog = ({ open, onClose, onUpdate, jobDetails }) => {
  const { title: initialTitle, location: initialLocation, type: initialType, description: initialDescription, salary: initialSalary, company: initialCompany } = jobDetails;
  
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [location, setLocation] = useState(initialLocation);
  const [salary, setSalary] = useState(initialSalary);
  const [company, setCompany] = useState(initialCompany);
  const [type, setType] = useState(initialType || 'Part-time');

  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setLocation(initialLocation);
    setSalary(initialSalary);
    setCompany(initialCompany);
    if (initialType !== undefined) {
      setType(initialType);
    }
  }, [initialTitle, initialDescription, initialLocation, initialSalary, initialCompany, initialType]);

  const handleConfirm = () => {
    onUpdate({
      title,
      description,
      location,
      salary,
      company,
      type,
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Job</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          fullWidth
          margin="normal"
        />
        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          type="number"
          fullWidth
          margin="normal"
          inputProps={{ min: 0 }}
        />
        <TextField
          label="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          fullWidth
          margin="normal"
        />
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
