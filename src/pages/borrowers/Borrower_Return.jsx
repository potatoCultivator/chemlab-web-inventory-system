import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ListItem, ListItemText, ListItemAvatar, Avatar,
  Dialog, DialogTitle, DialogContent,
  Button, Typography, Box, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField
} from '@mui/material';

import { updatedBorrowerStatus, updateStocks } from '../Query';
import InvoiceForm from './AccountableForm';
// import { get_ID_Name_Sched } from '../Query';

const Borrower_Return = ({ schedID, userId, name: initialName, equipments: initialEquipments, subject: initialSubject, onApprove }) => {
  const [open, setOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false); // State for InvoiceForm
  const [name, setName] = useState(initialName);
  const [subject, setSubject] = useState(initialSubject);
  const [equipments, setEquipments] = useState(initialEquipments);
  const [isEditing, setIsEditing] = useState(false);

  const handleQtyChange = (id, newQty) => {
    setEquipments((prevEquipments) =>
      prevEquipments.map((equipment) =>
        equipment.id === id ? { ...equipment, qty: newQty } : equipment
      )
    );
  };

  const toggleEditSave = () => {
    setIsEditing(!isEditing);
  };

  const handleApprove = async () => {
    try {
      for (const equipment of equipments) {
        const qty = Number(equipment.qty);
        if (isNaN(qty) || qty <= 0) {
          console.warn(`Skipping equipment with invalid qty: ${equipment.id}`);
          continue; // Skip invalid qty
        }
        console.log('Updating stock:', equipment.id, qty);
        await updateStocks(equipment.id, qty); // Ensure value is a valid number
      }
      console.log('Approving borrower:', userId);
      await updatedBorrowerStatus(schedID, userId, 'returned');
      alert("Borrower Approved!");
      setOpen(false);
      setName('');
      setSubject('');
      onApprove();
    } catch (error) {
      console.error("Error approving borrower: ", error);
      alert("Failed to approve borrower. Please try again.");
    }
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Equipment Name</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {equipments.map((equipment) => (
                  <TableRow key={equipment.id}>
                    <TableCell>{equipment.name}</TableCell>
                    <TableCell align="right">
                      {isEditing ? (
                        <TextField
                          type="number"
                          value={equipment.qty}
                          onChange={(e) => handleQtyChange(equipment.id, e.target.value)}
                          inputProps={{ min: 0 }}
                        />
                      ) : (
                        equipment.qty
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box my={2} display="flex" justifyContent="center">
            <Button onClick={toggleEditSave} color="primary">
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#f5f5f5", display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={() => setOpen(false)} color="primary" sx={{ flex: 1 }}>Close</Button>
          <Button onClick={() => setInvoiceOpen(true)} color="secondary" sx={{ flex: 1 }}>Invoice</Button> {/* New Invoice Button */}
          <Button onClick={handleApprove} color="success" sx={{ flex: 1 }}>Approve</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={invoiceOpen} onClose={() => setInvoiceOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Invoice Form</DialogTitle>
        <DialogContent sx={{ padding: "20px" }}>
          <InvoiceForm 
            schedID={schedID}
            id={userId}
            student={name}
            equipments={equipments}
          /> {/* Display InvoiceForm */}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#f5f5f5" }}>
          <Button onClick={() => setInvoiceOpen(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
Borrower_Return.propTypes = {
  schedID: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  equipments: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    qty: PropTypes.number.isRequired
  })).isRequired,
  subject: PropTypes.string,
  onApprove: PropTypes.func.isRequired
};

export default Borrower_Return;