import React, { useState, useEffect } from 'react';
import {
  List, ListItem, ListItemText, ListItemAvatar, Avatar,
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Divider,
  CircularProgress, Grid, Tooltip, Zoom, Fade, Box, Slide,
} from '@mui/material';
import { format, getMonth, getYear, getWeekOfMonth, getDate } from 'date-fns';
import { EditOutlined } from '@ant-design/icons';

import EditStatus from './EditStatus';
import { updateBorrower, fetchToolQuantities, updateToolQuantity, chartData } from 'pages/TE_Backend';

const BorrowerSlip = ({ borrower, status }) => {
  const [open, setOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [initialEquipment, setInitialEquipment] = useState(borrower.equipmentDetails);

  const handleUpdate = (updatedEquipment) => {
    console.log('Updating Equipment:', updatedEquipment); // Debugging statement
    setInitialEquipment((prev) =>
      prev.map((equipment) => (equipment.id === updatedEquipment.id ? updatedEquipment : equipment))
    );
  };

  // Log the updated state after it changes
  useEffect(() => {
    console.log('Initial Equipment Updated:', initialEquipment); // Debugging statement
  }, [initialEquipment]);

  const toggleDialog = (dialogType, value) => {
    switch (dialogType) {
      case "main": setOpen(value); break;
      case "loading": setIsLoading(value); break;
      case "edit": setEditDialogOpen(value); break;
      case "reject": setRejectDialogOpen(value); break;
      default: break;
    }
  };

  // const handleApprove = async () => {
  //   setIsApproving(true);
  //   toggleDialog("main", false);
  //   toggleDialog("loading", true);
  //   setIsEmpty(false);

  //   try {
  //     const updatedData = { isApproved: status === "pending return" ? "returned" : "admin approved" };
  //     let count = 0;

  //     if (Array.isArray(borrower.equipmentDetails)) {
  //       for (const equipment of borrower.equipmentDetails) {
  //         const { id, good_quantity, damaged_quantity = 0 } = equipment;
  //         const quantities = await fetchToolQuantities(id);

  //         if (quantities.good_quantity < good_quantity) {
  //           setIsEmpty(true);
  //           console.error(`Error: Equipment ID ${id} has insufficient quantity`);
  //           return;
  //         }

  //         let newQuantities;
  //         if(updatedData.isApproved === "returned") {
  //             newQuantities = {
  //             current_quantity: quantities.current_quantity + good_quantity,
  //             good_quantity: quantities.good_quantity + good_quantity,
  //             damage_quantity: quantities.damage_quantity + damaged_quantity,
  //           };
  //         } else {
  //               newQuantities = {
  //               current_quantity: quantities.current_quantity - good_quantity,
  //               good_quantity: quantities.good_quantity - good_quantity,
  //               damage_quantity: quantities.damage_quantity + damaged_quantity,
  //           }
  //         }
  //         console.log('New Quantities:', newQuantities);
  //         await updateToolQuantity(id, newQuantities.current_quantity, newQuantities.good_quantity, newQuantities.damage_quantity);
  //       }

  //       const now = new Date();
  //       const data = {
  //         status: updatedData.isApproved === "returned" ? "returned" : "borrowed",
  //         count,
  //         date: now,
  //         day: getDate(now),
  //         month: getMonth(now) + 1,
  //         year: getYear(now),
  //         weekOfMonth: getWeekOfMonth(now),
  //       };
  //       await chartData(data);
  //       await updateBorrower(borrower.id, updatedData);
  //       console.log(`Borrower with ID ${borrower.id} has been ${updatedData.isApproved}`);
  //     } else {
  //       console.error('Error: equipmentDetails is not an array or is undefined');
  //     }
  //   } catch (error) {
  //     console.error('Error approving borrower:', error);
  //   } finally {
  //     setIsApproving(false);
  //     setIsLoading(false);
  //   }
  // };

  const handleApprove = async () => {
    setIsApproving(true);
    toggleDialog("main", false);
    toggleDialog("loading", true);
    setIsEmpty(false);

    try {
      const updatedData = { isApproved: status === "pending return" ? "returned" : "admin approved" };
      let count = 0;

      for (const equipment of initialEquipment) {
        const { id, good_quantity, damaged_quantity = 0 } = equipment;
        const quantities = await fetchToolQuantities(id);

        if (quantities.good_quantity < good_quantity) {
          setIsEmpty(true);
          console.error(`Error: Equipment ID ${id} has insufficient quantity`);
          return;
        }

        let newQuantities;
        if(updatedData.isApproved === "returned") {
            newQuantities = {
            current_quantity: quantities.current_quantity + good_quantity,
            good_quantity: quantities.good_quantity + good_quantity,
            damage_quantity: quantities.damage_quantity + damaged_quantity,
          };
        } else {
              newQuantities = {
              current_quantity: quantities.current_quantity - good_quantity,
              good_quantity: quantities.good_quantity - good_quantity,
              damage_quantity: quantities.damage_quantity + damaged_quantity,
          }
        }
        console.log('New Quantities:', newQuantities);
        await updateToolQuantity(id, newQuantities.current_quantity, newQuantities.good_quantity, newQuantities.damage_quantity);
      }

      const now = new Date();
      const data = {
        status: updatedData.isApproved === "returned" ? "returned" : "borrowed",
        count,
        date: now,
        day: getDate(now),
        month: getMonth(now) + 1,
        year: getYear(now),
        weekOfMonth: getWeekOfMonth(now),
      };
      await chartData(data);
      await updateBorrower(borrower.id, updatedData);
      console.log(`Borrower with ID ${borrower.id} has been ${updatedData.isApproved}`);
    } catch (error) {
      console.error('Error approving borrower:', error);
    } finally {
      setIsApproving(false);
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const updatedEquipmentDetails = initialEquipment.map((equipment) => ({
        id: equipment.id,
        good_quantity: parseInt(equipment.good_quantity, 10),
        damaged_quantity: parseInt(equipment.damaged_quantity, 10),
        capacity: equipment.capacity,
        name: equipment.name,
        unit: equipment.unit,
      }));

      await updateBorrower(borrower.id, { isApproved: 'rejected', equipmentDetails: updatedEquipmentDetails });
      console.log(`Borrower with ID ${borrower.id} has been rejected`);
      toggleDialog("reject", false);
      toggleDialog("main", false);
    } catch (error) {
      console.error('Error rejecting borrower:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDialogActions = () => (
    <DialogActions>
      {status === "pending return" ? (
        <>
          <Button onClick={() => toggleDialog("reject", true)} variant="text" sx={{ color: 'red', '&:hover': { color: 'darkred' } }}>Reject</Button>
          <Button onClick={handleApprove} variant="text" sx={{ color: 'green', '&:hover': { color: 'darkgreen' } }} disabled={isApproving}>Return Equipments</Button>
        </>
      ) : (
        <>
          <Button onClick={() => toggleDialog("main", false)} variant="text" sx={{ color: 'red', '&:hover': { color: 'darkred' } }}>Cancel</Button>
          <Button onClick={handleApprove} variant="text" sx={{ color: 'green', '&:hover': { color: 'darkgreen' } }} disabled={isApproving}>Approve</Button>
        </>
      )}
    </DialogActions>
  );

  return (
    <>
      <Tooltip title="Click to view details" arrow TransitionComponent={Zoom} placement="right">
        <ListItem button onClick={() => toggleDialog("main", true)} sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}>
          <ListItemAvatar>
            <Avatar sx={{ backgroundColor: '#00796b', color: '#ffffff' }}>{borrower.borrowername.charAt(0).toUpperCase()}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={<Typography variant="h6">{borrower.borrowername}</Typography>}
            secondary={<Typography variant="body2" color="textSecondary">Course: {borrower.course} | Date: {borrower.date.toDate().toLocaleString()}</Typography>}
          />
        </ListItem>
      </Tooltip>
      <Divider />

      <Dialog open={open} onClose={() => toggleDialog("main", false)} TransitionComponent={Slide} transitionDuration={{ enter: 400, exit: 300 }}>
        <DialogTitle>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Borrower Slip</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Borrower Name:</strong> {borrower.borrowername}<br />
            <strong>Course:</strong> {borrower.course}<br />
            <strong>Instructor:</strong> {borrower.instructor}<br />
            <strong>Date:</strong> {borrower.date.toDate().toLocaleString()}<br />
          </DialogContentText>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Good Qty</TableCell>
                  <TableCell>Damaged Qty</TableCell>
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
                        <EditStatus onSave={handleUpdate} initialEquipment={equipment} />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        {renderDialogActions()}
      </Dialog>

      <Dialog open={isLoading}>
        <DialogTitle>{"Processing Request"}</DialogTitle>
        <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress color="secondary" />
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onClose={() => toggleDialog("reject", false)}>
        <DialogTitle>{"Confirm Rejection"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to reject this request?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => toggleDialog("reject", false)} color="primary">Cancel</Button>
          <Button onClick={handleReject} color="secondary" autoFocus>Reject</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BorrowerSlip;