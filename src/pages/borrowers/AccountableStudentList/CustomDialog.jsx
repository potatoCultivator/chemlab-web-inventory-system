import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Grid,
} from '@mui/material';

const CustomDialog = ({ open, onClose, name, church, sector }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>
      <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>Pending</Typography>
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        <strong>Name:</strong> {name}<br />
        <strong>Church:</strong> {church}<br />
        <strong>Sector:</strong> {sector}<br />
      </DialogContentText>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Church</TableCell>
              <TableCell>Sector</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{name}</TableCell>
              <TableCell>{church}</TableCell>
              <TableCell>{sector}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </DialogContent>
    <DialogActions>
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <Button onClick={onClose} variant="text" sx={{ color: 'red', width: '100%', '&:hover': { color: 'darkred' } }}>
            Cancel
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="text" sx={{ color: 'green', width: '100%', '&:hover': { color: 'darkgreen' } }}>
            Approve
          </Button>
        </Grid>
      </Grid>
    </DialogActions>
  </Dialog>
);

CustomDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  church: PropTypes.string.isRequired,
  sector: PropTypes.string.isRequired,
};

export default CustomDialog;