import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ListItem, ListItemText, ListItemAvatar, Avatar,
  Dialog, DialogTitle, DialogContent,
  Button, Typography, Box, DialogActions
} from '@mui/material';

import { updatedBorrowerStatus, updateStocks } from '../Query';
// import { get_ID_Name_Sched } from '../Query';

const Borrower = ({ schedID, id, name: initialName, equipments, subject: initialSubject, onApprove }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [subject, setSubject] = useState(initialSubject);

  const handleApprove = async () => {
    try {
      for (const equipment of equipments) {
        const qty = Number(equipment.qty);
        if (isNaN(qty) || qty <= 0) {
          console.warn(`Skipping equipment with invalid qty: ${equipment.id}`);
          continue; // Skip invalid qty
        }
        console.log('Updating stock:', equipment.id, qty);
        await updateStocks(equipment.id, -qty); // Ensure value is a valid number
      }
      await updatedBorrowerStatus(schedID, id, 'approved');
      alert("Borrower Approved!");
      setOpen(false);
      setName('');
      setSubject('');
      onApprove();
    } catch (error) {
      console.error("Error approving borrower: ", error);
      alert("Failed to approve borrower. Please try again.");
    }
  };
  
  

  return (
    <>
      <ListItem button onClick={() => setOpen(true)} sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}>
        <ListItemAvatar>
          <Avatar sx={{ backgroundColor: '#00796b', color: '#ffffff' }}>
            {name?.charAt(0) || 'U'}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={<Typography variant="h6">{name || 'Unknown Borrower'}</Typography>}
          secondary={<Typography variant="body2" color="textSecondary">{subject || 'N/A'}</Typography>}
        />
      </ListItem>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Invoice</DialogTitle>
        <DialogContent sx={{ padding: "20px" }}>
          <Box my={2}>
            <Typography gutterBottom><strong>Name:</strong> {name || 'N/A'}</Typography>
            <Typography gutterBottom><strong>Subject:</strong> {subject || 'N/A'}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#f5f5f5", display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={() => setOpen(false)} color="primary" sx={{ flex: 1 }}>Close</Button>
          <Button onClick={handleApprove} color="success" sx={{ flex: 1 }}>Approve</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
Borrower.propTypes = {
  schedID: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  equipments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    qty: PropTypes.number.isRequired
  })).isRequired,
  subject: PropTypes.string,
  onApprove: PropTypes.func.isRequired
};

export default Borrower;
