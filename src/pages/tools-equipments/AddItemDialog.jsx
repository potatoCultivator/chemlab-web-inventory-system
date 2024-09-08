import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import { Box } from '@mui/system';

// firebase import
import uploadTE from '../TE_Backend.jsx';

export default function AddItemDialog({ onDone }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false); // Add loading state
  const [item, setItem] = React.useState({
    name: '',
    capacity: '',
    unit: 'kg',
    quantity: '',
    current_quantity: '',
    category: 'glassware',
    condition: 'good_condition',
    date: ''
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false); // Reset loading state
  };

  const handleDone = async () => {
    setLoading(true); // Set loading state to true
    try {
      await uploadTE(item); // Call the uploadTE function to add the item to Firestore
      onDone();
      handleClose();
    } catch (error) {
      console.error('Error uploading item:', error);
      setLoading(false); // Reset loading state in case of error
    }
  };

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen}>
        Add Tool/Equipment
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            border: 'none', // Add border here
            boxShadow: 'none',
            backgroundColor: '#fff' // Add background color here
          }
        }}
      >
        <DialogTitle>Add Tool/Equipment</DialogTitle>
        <Box mt={0.5}/>
        <DialogContent>
          {loading ? (
            <Grid container justifyContent="center" alignItems="center" style={{ height: '100px' }}>
              <CircularProgress />
              <p>Please wait...</p>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  value={item.name}
                  onChange={(e) => {setItem(prevItem => ({ ...prevItem, name: e.target.value }))}}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  variant="outlined"
                  type='number'
                  value={item.quantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    setItem(prevItem => ({ ...prevItem, quantity: value }));
                    setItem(prevItem => ({ ...prevItem, current_quantity: value }));
                  }}
                  helperText="Please enter the capacity of the item"
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Capacity"
                  variant="outlined"
                  type='number'
                  value={item.capacity}
                  onChange={(e) => setItem(prevItem => ({ ...prevItem, capacity: e.target.value }))}
                  helperText="Please enter the capacity of the item"
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Unit"
                  variant="outlined"
                  select
                  value={item.unit}
                  onChange={(e) => setItem(prevItem => ({ ...prevItem, unit: e.target.value }))}
                  SelectProps={{ native: true }}
                  helperText="Please select the unit of measurement"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="L">L</option>
                  <option value="mL">mL</option>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Category"
                  variant="outlined"
                  select
                  value={item.category}
                  onChange={(e) => setItem(prevItem => ({ ...prevItem, category: e.target.value }))}
                  SelectProps={{ native: true }}
                  helperText="Please select the category"
                >
                  <option value="all">All</option>
                  <option value="glassware">Glassware</option>
                  <option value="plasticware">Plasticware</option>
                  <option value="metalware">Metalware</option>
                  <option value="heating">Heating</option>
                  <option value="measuring">Measuring</option>
                  <option value="container">Container</option>
                  <option value="separator">Separation Equipment</option>
                  <option value="mixing">Mixing & Stirring</option>
                </TextField>
              </Grid>
              {/* Add other fields as necessary */}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button aria-hidden="true" onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button aria-hidden="true" onClick={handleDone} disabled={loading}>Done</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}