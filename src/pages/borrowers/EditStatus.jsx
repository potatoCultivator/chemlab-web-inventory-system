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
import IconButton from '@mui/material/IconButton';
import { CameraOutlined } from '@ant-design/icons';
import { EditOutlined } from '@ant-design/icons';

export default function EditStatus() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false); // Add loading state
  const [image, setImage] = React.useState(null);
  const [item, setItem] = React.useState({
    name: '', // string
    capacity: 0, // number
    unit: 'kg', // string
    quantity: 0, // number,
    good_quantity: 0, // number
    damage_quantity: 0, // number
    current_quantity: 0, // number
    category: 'glassware', // string
    condition: 'Good', // string
    image: '', // string
    date: new Date()
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false); // Reset loading state
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <React.Fragment>
    <IconButton color="primary" size="large" onClick={handleClickOpen}>
        <EditOutlined />
    {/* <EditStatus/> */}
    </IconButton>
      {/* <Button variant="contained" onClick={handleClickOpen}>
        Add Tool/Equipment
      </Button> */}
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
        <DialogTitle>Edit Status</DialogTitle>
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
                    setItem(prevItem => ({ ...prevItem, good_quantity: value }));
                  }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button aria-hidden="true" onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button aria-hidden="true" disabled={loading}>Done</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}