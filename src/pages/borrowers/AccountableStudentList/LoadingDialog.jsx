import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, CircularProgress } from '@mui/material';

const LoadingDialog = ({ open }) => (
  <Dialog open={open}>
    <DialogTitle>{"Processing Request"}</DialogTitle>
    <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress color="secondary" />
    </DialogContent>
  </Dialog>
);
LoadingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default LoadingDialog;
