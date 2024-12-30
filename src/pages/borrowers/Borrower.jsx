import React, { useState } from 'react';
import {
  ListItem, ListItemText, ListItemAvatar, Avatar,
  Dialog, DialogTitle, DialogContent, Divider,
  Button, Typography, Box, DialogActions
} from '@mui/material';

const Borrower = ({ id, name, subject }) => {
  const [open, setOpen] = useState(false);

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
          <Typography variant="h6" gutterBottom>Borrower Details</Typography>
          <Divider />
          <Box my={2}>
            <Typography gutterBottom><strong>Name:</strong> {name || 'N/A'}</Typography>
            <Typography gutterBottom><strong>Subject:</strong> {subject || 'N/A'}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#f5f5f5", display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={() => setOpen(false)} color="primary" sx={{ flex: 1 }}>Close</Button>
          <Button onClick={() => alert("Borrower Approved!")} color="success" sx={{ flex: 1 }}>Approve</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Borrower;
