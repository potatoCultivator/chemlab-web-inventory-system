import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';

// project import
import AddItem from './AddItem';

export default function AddItemDialog() {
  const [open, setOpen] = React.useState(false);
  const [item, setItem] = React.useState({
    name: '',
    capacity: '',
    unit: '',
    quantity: '',
    category: '',
    condition: '',
    date: ''
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Add Tool/Equipment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the form below.
          </DialogContentText>
          <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField 
            fullWidth 
            label="Tools/Equipment" 
            variant="outlined" 
            value={item.name} 
            onChange={(e) => setItem(prevItem => ({ ...prevItem, name: e.target.value }))}/>
          </Grid>

          <Grid item xs={6}>
            <TextField 
            fullWidth 
            label="Quantity" 
            variant="outlined" 
            value={item.quantity}
             onChange={(e) => setItem(prevItem => ({ ...prevItem, quantity: e.target.value }))}/>
          </Grid>
          
          <Grid item xs={6}>
            <TextField 
            fullWidth 
            label="Capacity" 
            variant="outlined" 
            value={item.capacity}
            onChange={(e) => setItem(prevItem => ({ ...prevItem, capacity: e.target.value }))}/>
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
            helperText="unit of measurement">
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="L">L</option>
                <option value="mL">mL</option>
            </TextField>
          </Grid>
        </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Done</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}