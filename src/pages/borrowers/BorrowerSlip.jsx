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
          <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
            <FileTextOutlined />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={<Typography variant="subtitle1">Order #002434</Typography>} secondary="Today, 2:00 AM" />
        <ListItemSecondaryAction>
          <Stack alignItems="flex-end">
            <Typography variant="subtitle1" noWrap>
              + $1,430
            </Typography>
            <Typography variant="h6" color="secondary" noWrap>
              78%
            </Typography>
          </Stack>
        </ListItemSecondaryAction>
      </ListItemButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Details about Order #002434</Typography>
          {/* Add more details as needed */}
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