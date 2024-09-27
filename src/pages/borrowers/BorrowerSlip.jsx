import React, { useState } from 'react';
import { 
  List,
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Divider,
  IconButton 
} from '@mui/material';

import { EditOutlined } from '@ant-design/icons';


// firestore
import { updateBorrower } from 'pages/TE_Backend';

const BorrowerSlip = ({ borrower, status }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleApprove = async () => {
    try {
      await updateBorrower(borrower.id, {isApproved: status == "pending return"? "returned" : "admin approved"});
      console.log(`Borrower with ID ${borrower.id} has been approved`);
      handleClose();
    } catch (error) {
      console.error('Error approving borrower:', error);
    }
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
      <Divider />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            Borrower Slip
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Borrower Name:</strong> {borrower.borrowername}<br />
            <strong>Course:</strong> {borrower.course}<br />
            <strong>Instructor:</strong> {borrower.instructor}<br />
            <strong>Date:</strong> {borrower.date.toDate().toLocaleString()}<br />
            <strong>Equipment Details:</strong>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell> Qty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {borrower.equipmentDetails.map((equipment, eqIndex) => (
                    <TableRow key={eqIndex}>
                      <TableCell>{equipment.name}</TableCell>
                      <TableCell align='center'>{`${equipment.capacity} ${equipment.unit}`}</TableCell>
                      <TableCell align='center'>{equipment.good_quantity}</TableCell>
                      {status === 'pending return' && (
                        <TableCell align="right">
                          <IconButton color="primary" size="large">
                            <EditOutlined />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        {status !== 'pending return'? (
          <>
            <Button onClick={handleClose} variant="text" sx={{ color: 'red', borderColor: 'red' }}>
              Cancel
            </Button>
            <Button onClick={handleApprove} variant="text" sx={{ color: 'green', borderColor: 'green' }}>
              Approve
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleClose} variant="text" sx={{ color: 'red', borderColor: 'red' }}>
              Reject
            </Button>
            <Button onClick={handleApprove} variant="text" sx={{ color: 'green', borderColor: 'green' }}>
              Return Equipments
            </Button>
          </>
        )}
        </DialogActions>
      </Dialog>
    </>
  );
};

// pending
// approved
// declined
// approved admin
// declined admin 
// pending return
// returned

export default BorrowerSlip;