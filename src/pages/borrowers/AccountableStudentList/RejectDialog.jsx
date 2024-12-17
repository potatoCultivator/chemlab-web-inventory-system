import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

const RejectDialog = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{"Confirm Rejection"}</DialogTitle>
    <DialogContent>
      <DialogContentText>Are you sure you want to reject this request?</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">Cancel</Button>
      <Button color="secondary" autoFocus>Reject</Button>
    </DialogActions>
  </Dialog>
);

RejectDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RejectDialog;
