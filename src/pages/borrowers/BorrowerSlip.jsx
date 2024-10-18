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
  CircularProgress,
  Grid
} from '@mui/material';
import Slide from '@mui/material/Slide';

import { EditOutlined } from '@ant-design/icons';

import EditStatus from './EditStatus';

// firestore
import { updateBorrower, fetchToolQuantities, updateToolQuantity } from 'pages/TE_Backend';

const BorrowerSlip = ({ borrower, status }) => {
  const [open, setOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false); // State for edit dialog
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false); // State for reject confirmation dialog

  const [initialEquipment, setInitialEquipment] = useState(borrower.equipmentDetails);

  const handleUpdate = (updatedEquipment) => {
    setInitialEquipment((prevEquipment) =>
      prevEquipment.map((equipment) =>
        equipment.id === updatedEquipment.id ? updatedEquipment : equipment
      )
    );
    console.log('Updated equipment:', initialEquipment);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseDialog = () => {
    setIsLoading(false);
  };

  const handleApprove = async () => {
    setIsApproving(true);
    handleClose();
    setIsLoading(true);
    setIsEmpty(false);
  
    try {
      const updatedData = { isApproved: status === "pending return" ? "returned" : "admin approved" };
  
      if (updatedData.isApproved === "admin approved") {
        if (Array.isArray(borrower.equipmentDetails)) {
          // First, check all tools for their quantities
          for (const equipment of borrower.equipmentDetails) {
            const { id, good_quantity } = equipment;
            console.log(`Checking Equipment ID: ${id}, Good Quantity: ${good_quantity}`);
  
            // Fetch the current quantity of the tool
            const quantities = await fetchToolQuantities(id);
  
            if (quantities.good_quantity < 1) {
              setIsEmpty(true);
              console.error(`Error: Equipment ID ${id} cannot be borrowed as its good quantity is less than 1`);
              setIsApproving(false);
              // setIsLoading(false);
              return; // Exit the function to prevent approval
            }
          }
  
          // If all tools are available, update their quantities
          for (const equipment of borrower.equipmentDetails) {
            const { id, good_quantity } = equipment;
            const quantities = await fetchToolQuantities(id);
            await updateToolQuantity(id, quantities.current_quantity - good_quantity, quantities.good_quantity - good_quantity);
          }
        } else {
          console.error('Error: equipmentDetails is not an array or is undefined');
          setIsApproving(false);
          setIsLoading(false);
          return; // Exit the function to prevent approval
        }
      }
  
      await updateBorrower(borrower.id, updatedData);
      console.log(`Borrower with ID ${borrower.id} has been approved`);
      handleClose();
    } catch (error) {
      console.error('Error approving borrower:', error);
    } finally {
      setIsApproving(false);
      // setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleRejectClick = () => {
    setRejectDialogOpen(true);
  };

  const handleRejectDialogClose = () => {
    setRejectDialogOpen(false);
  };

  const handleConfirmReject = async () => {
    setIsLoading(true);
    try {
      const updatedEquipmentDetails = initialEquipment.map((equipment) => ({
        id: equipment.id,
        good_quantity: equipment.good_quantity,
        damaged_quantity: equipment.damaged_quantity,
      }));

      const updatedData = {
        isApproved: 'rejected',
        equipmentDetails: updatedEquipmentDetails,
      };

      await updateBorrower(borrower.id, updatedData);
      console.log(`Borrower with ID ${borrower.id} has been rejected`);
      setRejectDialogOpen(false);
      setOpen(false);
    } catch (error) {
      console.error('Error rejecting borrower:', error);
    } finally {
      setIsLoading(false);
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
                    <TableCell> good qty</TableCell>
                    <TableCell> damaged qty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {initialEquipment.map((equipment, id) => (
                    <TableRow key={id}>
                      <TableCell>{equipment.name}</TableCell>
                      <TableCell align='center'>{`${equipment.capacity} ${equipment.unit}`}</TableCell>
                      <TableCell align='center'>{equipment.good_quantity}</TableCell>
                      <TableCell align='center'>{equipment.damaged_quantity}</TableCell>
                      {status === 'pending return' && (
                        <TableCell align="right">
                            <EditStatus onSave={handleUpdate} initialEquipment={equipment}/>
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
          {status === 'admin approved' ? null : (
            status !== 'pending return' ? (
              <>
                <Button onClick={handleClose} variant="text" sx={{ color: 'red', borderColor: 'red' }}>
                  Cancel
                </Button>
                <Button onClick={handleApprove} variant="text" sx={{ color: 'green', borderColor: 'green' }} disabled={isApproving}>
                  Approve
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleRejectClick} variant="text" sx={{ color: 'red', borderColor: 'red' }}>
                  Reject
                </Button>
                <Button onClick={handleApprove} variant="text" sx={{ color: 'green', borderColor: 'green' }} disabled={isApproving}>
                  Return Equipments
                </Button>
              </>
            )
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Equipment Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* Add your form or content for editing equipment details here */}
            Edit form content goes here.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditDialogClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isLoading}
        // TransitionComponent={Transition}
        keepMounted
        onClose={isLoading}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirming Borrower Request"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          {isEmpty ? (
              <p>Some Equipment is out of stock</p>
            ) : (
              <Grid container justifyContent="center" alignItems="center" style={{ height: '100px' }}>
                <CircularProgress />
                <p>Please wait...</p>
              </Grid>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {isEmpty ?  <Button onClick={handleCloseDialog}>Close</Button> : null}
        </DialogActions>
      </Dialog>

      <Dialog open={rejectDialogOpen} onClose={handleRejectDialogClose}>
        <DialogTitle>Confirm Rejection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reject this borrower's request?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmReject} color="primary">
            Confirm
          </Button>
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