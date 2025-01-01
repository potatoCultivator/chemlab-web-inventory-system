import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ListItem, ListItemText, ListItemAvatar, Avatar,
  Dialog, DialogTitle, DialogContent,
  Button, Typography, Box, DialogActions,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper
} from '@mui/material';

import { updatedBorrowerStatus, updateStocks } from '../Query';

const Borrower_Return = ({ schedID, id, name: initialName, equipments: initialEquipments, subject: initialSubject, onApprove }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [name, setName] = useState(initialName);
  const [subject, setSubject] = useState(initialSubject);
  const [equipments, setEquipments] = useState(initialEquipments); // State for equipments
  const [editing, setEditing] = useState(false); // State for editing

  const handleQtyChange = (index, value) => {
    const updatedEquipments = [...equipments];
    updatedEquipments[index].qty = value;
    setEquipments(updatedEquipments);
  };

  const handleApprove = async () => {
    setLoading(true); // Set loading to true
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
      console.log('Approving borrower:', id);
      await updatedBorrowerStatus(schedID, id, 'returned');
      alert("Borrower Approved!");
      setOpen(false);
      setName('');
      setSubject('');
      onApprove();
    } catch (error) {
      console.error("Error approving borrower: ", error);
      alert("Failed to approve borrower. Please try again.");
    } finally {
      setLoading(false); // Set loading to false
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
                  <TableCell>Equipment</TableCell>
                  <TableCell>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {equipments.map((equipment, index) => (
                  <TableRow key={equipment.id}>
                    <TableCell>{equipment.name}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={equipment.qty}
                        onChange={(e) => handleQtyChange(index, e.target.value)}
                        inputProps={{ min: 0 }}
                        disabled={!editing}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={() => setEditing(!editing)} color="secondary">
              {editing ? 'Save' : 'Edit'}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#f5f5f5", display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={() => setOpen(false)} color="primary" sx={{ flex: 1 }}>Close</Button>
          <Button onClick={handleApprove} color="success" sx={{ flex: 1 }} disabled={loading || editing}>
            {loading ? <CircularProgress size={24} /> : 'Approve'}
          </Button>
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
