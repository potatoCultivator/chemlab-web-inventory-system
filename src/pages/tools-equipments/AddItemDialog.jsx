import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';

export default function AddItemDialog({ onDone }) {
  const [open, setOpen] = React.useState(false);
  const [item, setItem] = React.useState({
    name: '',
    capacity: '',
    unit: 'kg',
    quantity: '',
    category: 'glassware',
    condition: '',
    date: ''
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDone = () => {
    // Perform any necessary actions here
    onDone(); // Call the onDone function to trigger the refresh
    handleClose();
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
            border: '2px solid #000', // Add border here
            boxShadow: 'none',
            backgroundColor: '#fff' // Add background color here
          }
        }}
      >
        <DialogTitle>Add Tool/Equipment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={item.name}
                onChange={(e) => setItem(prevItem => ({ ...prevItem, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Capacity"
                variant="outlined"
                value={item.capacity}
                onChange={(e) => setItem(prevItem => ({ ...prevItem, capacity: e.target.value }))}
                helperText="Please enter the capacity of the item"
              />
            </Grid>
            <Grid item xs={6}>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: '2px solid #000', // Add border here
                    },
                    '&:hover fieldset': {
                      borderColor: '#000', // Change border color on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#000', // Change border color when focused
                    },
                  },
                }}
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
        </DialogContent>
        <DialogActions>
          <Button aria-hidden="true" onClick={handleClose}>Cancel</Button>
          <Button aria-hidden="true" onClick={handleDone}>Done</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}