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
            {name ? name.charAt(0) : 'U'}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={<Typography variant="h6">{name || 'Unknown Borrower'}</Typography>}
          secondary={
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="textSecondary">
                {subject || 'N/A'}
              </Typography>
            </Box>
          }
        />
      </ListItem>

      <Divider />

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth aria-labelledby="main-dialog-title">
        <DialogTitle id="main-dialog-title" sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Invoice</DialogTitle>
        <DialogContent sx={{ padding: "20px" }}>
          <Typography variant="h6" gutterBottom>Borrower Details</Typography>
          <Divider />
          <Box my={2}>
            <Typography gutterBottom><strong>Name:</strong> {name || 'N/A'}</Typography>
            <Typography gutterBottom><strong>Subject:</strong> {subject || 'N/A'}</Typography>
            {/* Add other details if needed */}
          </Box>
          <Divider />
          <Box mt={2}>
            <Typography variant="body1" color="textSecondary" mt={1}>
              Please ensure that the borrower follows all ChemLab equipment handling guidelines. Contact the borrower if additional verification is required.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#f5f5f5" }}>
          <Button onClick={() => setOpen(false)} color="primary">Close</Button>
          <Button onClick={() => alert("Generating Invoice PDF...")} color="secondary">Generate Invoice</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Borrower;
