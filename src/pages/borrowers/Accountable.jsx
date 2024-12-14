    import React, { useState } from 'react';
    import {
      ListItem, ListItemText, ListItemAvatar, Avatar,
      Dialog, DialogTitle, DialogContent, Divider,
      Button, Typography, Table, TableBody,
      TableCell, TableContainer, TableHead, TableRow, Box, DialogActions,
    } from '@mui/material';
    
    const AccountableTemplate = ({ borrower = {} }) => {
      const [open, setOpen] = useState(false);
    
      const formatDate = (date) => {
        if (!date) return 'N/A';
        if (date.toDate) return date.toDate().toLocaleString(); // Firestore Timestamp
        return new Date(date).toLocaleString(); // Regular Date or string
      };
    
      return (
        <>
          <ListItem button onClick={() => setOpen(true)} sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}>
            <ListItemAvatar>
              <Avatar sx={{ backgroundColor: '#00796b', color: '#ffffff' }} />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="h6">{borrower.borrowername || 'Unknown Borrower'}</Typography>}
              secondary={
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="textSecondary">
                    Course: {borrower.course || 'N/A'} | Date: {formatDate(borrower.date)}
                  </Typography>
                  <Typography variant="body2" sx={{ minWidth: '120px', textAlign: 'right', fontWeight: 'bold' }}>
                    {borrower.subject || 'N/A'}
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
                <Typography gutterBottom><strong>Name:</strong> {borrower.borrowername || 'N/A'}</Typography>
                <Typography gutterBottom><strong>Course:</strong> {borrower.course || 'N/A'}</Typography>
                <Typography gutterBottom><strong>Date:</strong> {formatDate(borrower.date)}</Typography>
                <Typography><strong>Equipment:</strong></Typography>
                <TableContainer>
                  <Table size="small" sx={{ mt: 1 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {borrower.equipmentDetails?.map((equipment, id) => (
                        <TableRow key={id}>
                          <TableCell>{equipment.name}</TableCell>
                          <TableCell>{equipment.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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
    
    export default AccountableTemplate;