import React, { useState, useEffect } from 'react';
import {
  ListItem, ListItemText, ListItemAvatar, Avatar,
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Divider,
  CircularProgress, Tooltip, Zoom, Box, Slide,
} from '@mui/material';
import { getMonth, getYear, getWeekOfMonth, getDate } from 'date-fns';

import EditStatus from './EditStatus';
import { updateBorrower, fetchToolQuantities, updateToolQuantity, chartData } from 'pages/TE_Backend';

const BorrowerSlip = ({ borrower, status }) => {
  const [open, setOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [initialEquipment, setInitialEquipment] = useState(borrower.equipmentDetails);

  const handleUpdate = (updatedEquipment) => {
    setInitialEquipment((prev) =>
      prev.map((equipment) => (equipment.id === updatedEquipment.id ? updatedEquipment : equipment))
    );
  };

  useEffect(() => {
    console.log('Initial Equipment Updated:', initialEquipment);
  }, [initialEquipment]);

  const toggleDialog = (dialogType, value) => {
    switch (dialogType) {
      case "main": setOpen(value); break;
      case "loading": setIsLoading(value); break;
      case "reject": setRejectDialogOpen(value); break;
      default: break;
    }
  };

  const validateEquipment = async () => {
    for (const equipment of initialEquipment) {
      const quantities = await fetchToolQuantities(equipment.id);
      if (equipment.good_quantity > quantities.good_quantity) {
        alert(`Cannot approve. Equipment ${equipment.name} has insufficient quantity.`);
        return false;
      }
    }
    return true;
  };

  const handleApprove = async () => {
    if (!(await validateEquipment())) return;

    setIsApproving(true);
    toggleDialog("main", false);
    toggleDialog("loading", true);

    try {
      const updatedData = { isApproved: status === "pending return" ? "returned" : "admin approved" };
      let count = 0;

      for (const equipment of initialEquipment) {
        const { id, good_quantity, damaged_quantity = 0 } = equipment;
        const quantities = await fetchToolQuantities(id);

        count += good_quantity + damaged_quantity;

        const newQuantities = updatedData.isApproved === "returned"
          ? {
              current_quantity: quantities.current_quantity + good_quantity,
              good_quantity: quantities.good_quantity + good_quantity,
              damage_quantity: quantities.damage_quantity + damaged_quantity,
            }
          : {
              current_quantity: quantities.current_quantity - good_quantity,
              good_quantity: quantities.good_quantity - good_quantity,
              damage_quantity: quantities.damage_quantity + damaged_quantity,
            };

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
      toggleDialog("reject", false);
      toggleDialog("main", false);
    } catch (error) {
      console.error('Error rejecting borrower:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDialogActions = () => {
    if (status === "admin approved") return null;

    return (
      <DialogActions>
        {status === "pending return" ? (
          <>
            <Button onClick={() => toggleDialog("reject", true)} variant="text" sx={{ color: 'red', '&:hover': { color: 'darkred' } }}>
              Reject
            </Button>
            <Button onClick={handleApprove} variant="text" sx={{ color: 'green', '&:hover': { color: 'darkgreen' } }} disabled={isApproving}>
              Return Equipments
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => toggleDialog("main", false)} variant="text" sx={{ color: 'red', '&:hover': { color: 'darkred' } }}>
              Cancel
            </Button>
            <Button onClick={handleApprove} variant="text" sx={{ color: 'green', '&:hover': { color: 'darkgreen' } }} disabled={isApproving}>
              Approve
            </Button>
          </>
        )}
      </DialogActions>
    );
  };

  return (
    <>
      <Tooltip title="Click to view details" arrow TransitionComponent={Zoom} placement="right">
        <ListItem
          button
          onClick={() => toggleDialog("main", true)}
          sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}
        >
          <ListItemAvatar>
            <Avatar sx={{ backgroundColor: '#00796b', color: '#ffffff' }}>
              {borrower.borrowername.charAt(0).toUpperCase()}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={<Typography variant="h6">{borrower.borrowername}</Typography>}
            secondary={
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="textSecondary">
                  Course: {borrower.course} | Date: {borrower.date.toDate().toLocaleString()}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ minWidth: '120px', textAlign: 'right', fontWeight: 'bold' }}
                >
                  {borrower.subject}
                </Typography>
              </Box>
            }
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
            <strong>Subject:</strong> {borrower.subject}<br />
            <strong>Instructor:</strong> {borrower.instructor}<br />
            <strong>Date:</strong> {borrower.date.toDate().toLocaleString()}<br />
          </DialogContentText>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Capacity</TableCell>
                  {status === 'pending return' && <TableCell>Good Qty</TableCell>}
                  <TableCell>Qty</TableCell>
                  {status === 'pending return' && <TableCell>Damaged Qty</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {initialEquipment.map((equipment, id) => (
                  <TableRow key={id}>
                    <TableCell>{equipment.name}</TableCell>
                    <TableCell align='center'>{`${equipment.capacity} ${equipment.unit}`}</TableCell>
                    <TableCell align='center'>{equipment.good_quantity}</TableCell>
                    {status === 'pending return' && <TableCell align='center'>{equipment.damaged_quantity}</TableCell>}
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