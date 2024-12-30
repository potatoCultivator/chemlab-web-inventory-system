import React, { useState } from 'react';
import {
  ListItem, ListItemText, ListItemAvatar, Avatar,
  Dialog, DialogTitle, DialogContent, 
  Button, Typography, Box, DialogActions
} from '@mui/material';

import { updatedBorrowerStatus } from '../Query';

const Borrower_Return = ({ schedID, id, name, subject, onApprove }) => {
  const [open, setOpen] = useState(false);

  const handleApprove = async (status) => {
    try {
      await updatedBorrowerStatus(schedID, id, status);
      alert(`Borrower ${status === 'returned' ? 'Returned' : 'Broke'} the item!`);
      generateInvoice(status);
      setOpen(false);
      onApprove();
    } catch (error) {
      console.error(`Error updating borrower status to ${status}: `, error);
      alert(`Failed to update borrower status. Please try again.`);
    }
  };

  const generateInvoice = (status) => {
    const invoiceContent = `
      <h1>Invoice</h1>
      <p><strong>Name:</strong> ${name || 'N/A'}</p>
      <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
      <p><strong>Status:</strong> ${status === 'returned' ? 'Returned' : 'Broke'}</p>
    `;
    const newWindow = window.open();
    newWindow.document.write(invoiceContent);
    newWindow.print();
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
          <Button onClick={() => handleApprove('returned')} color="success" sx={{ flex: 1 }}>Return</Button>
          <Button onClick={() => handleApprove('broke')} color="error" sx={{ flex: 1 }}>Broke</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Borrower_Return;
