import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const DeleteDialog = ({ open, onClose, onDelete }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Job</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete the job?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDelete} color="primary">
          Confirm
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
