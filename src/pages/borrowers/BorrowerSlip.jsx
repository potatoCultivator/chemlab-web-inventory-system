import React, { useState } from 'react';
import { 
    ListItemButton, 
    ListItemAvatar, 
    ListItemText, 
    ListItemSecondaryAction, 
    Avatar, 
    Typography, 
    Stack, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button 
} from '@mui/material';
import { FileTextOutlined } from '@ant-design/icons';

export default function BorrowerSlip() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ListItemButton divider onClick={handleClickOpen}>
        <ListItemAvatar>
          <Avatar sx={{ color: 'primary.main', bgcolor: 'success.lighter' }}>
            <FileTextOutlined />
          </Avatar>
        </ListItemAvatar>
        <ListItemText 
          primary={<Typography variant="subtitle1" sx={{ fontSize: '1.25rem' }}>Borrower Slip: #002434</Typography>} 
          secondary={<Typography variant="body2" sx={{ fontSize: '1rem' }}>Today, 2:00 AM</Typography>} 
        />
        <ListItemSecondaryAction>
          <Stack alignItems="flex-end">
          <Typography variant="h6" noWrap sx={{ fontSize: '1.2rem', color: '#66bb6a' }}>
              Approved
            </Typography>
          </Stack>
        </ListItemSecondaryAction>
      </ListItemButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Borrower Slip Details</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ fontSize: '1.25rem' }}>Borrower Slip #002434</Typography>
          <Typography variant="body2" sx={{ marginTop: '1rem' }}>
            <strong>Student Name:</strong> John Doe
          </Typography>
          <Typography variant="body2">
            <strong>Group Number:</strong> 5
          </Typography>
          <Typography variant="body2">
            <strong>Instructor's Name:</strong> Dr. Smith
          </Typography>
          <Typography variant="body2" sx={{ marginTop: '1rem' }}>
            <strong>Chem Lab Tools and Equipment Used:</strong>
          </Typography>
          <ul>
            <li>Beaker - Capacity: 500ml, Unit: ml, Qty: 3</li>
            <li>Test Tubes - Capacity: 50ml, Unit: ml, Qty: 10</li>
            <li>Bunsen Burner - Capacity: N/A, Unit: N/A, Qty: 2</li>
            <li>Graduated Cylinder - Capacity: 100ml, Unit: ml, Qty: 1</li>
            <li>Pipette - Capacity: 10ml, Unit: ml, Qty: 5</li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}