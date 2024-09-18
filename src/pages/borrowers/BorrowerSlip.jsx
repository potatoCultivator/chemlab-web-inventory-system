import React, { useState } from 'react';
import { ListItem, ListItemText, ListItemAvatar, Avatar, List, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@mui/material';

const BorrowerSlip = ({ borrower }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ListItem button onClick={handleClickOpen}>
        <ListItemAvatar>
          <Avatar>{borrower.borrowername.charAt(0).toUpperCase()}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={borrower.borrowername}
          secondary={
            <>
              <Typography component="span" variant="body2" color="textPrimary">
                Course: {borrower.course}
              </Typography>
              <br />
              <Typography component="span" variant="body2" color="textPrimary">
                Date: {borrower.date.toDate().toLocaleString()}
              </Typography>
            </>
          }
        />
        <List>
          {borrower.equipmentDetails.slice(0, 2).map((equipment, eqIndex) => (
            <ListItem key={eqIndex}>
              <ListItemText
                primary={equipment.name}
                secondary={`Capacity: ${equipment.capacity} ${equipment.unit}, Current Quantity: ${equipment.current_quantity}`}
              />
            </ListItem>
          ))}
          {borrower.equipmentDetails.length > 2 && (
            <ListItem>
              <ListItemText
                primary={
                  <Typography color="primary">
                    and {borrower.equipmentDetails.length - 2} more...
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </ListItem>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Borrower Slip</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Borrower Name:</strong> {borrower.borrowername}<br />
            <strong>Course:</strong> {borrower.course}<br />
            <strong>Instructor:</strong> {borrower.instructor}<br />
            <strong>Date:</strong> {borrower.date.toDate().toLocaleString()}<br />
            <strong>Equipment Details:</strong>
            <List>
              {borrower.equipmentDetails.map((equipment, eqIndex) => (
                <ListItem key={eqIndex}>
                  <ListItemText
                    primary={equipment.name}
                    secondary={`Capacity: ${equipment.capacity} ${equipment.unit}, Current Quantity: ${equipment.current_quantity}`}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose} color="primary" variant="outlined">
            Close
          </Button> */}
          <Button onClick={handleClose} variant="outlined" sx={{ color: 'red', borderColor: 'red' }}>
            Reject
          </Button>
          <Button onClick={handleClose} variant="outlined" sx={{ color: 'green', borderColor: 'green' }}>
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BorrowerSlip;