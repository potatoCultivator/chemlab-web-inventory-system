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
import { UploadOutlined } from '@ant-design/icons'; 
import { CameraOutlined, DeleteOutlined } from '@ant-design/icons';

// firebase import
import uploadTE from '../TE_Backend.jsx';

export default function AddItemDialog({ onDone }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false); // Add loading state
  const [image, setImage] = React.useState(null);
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

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
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
              <Grid item xs={3}>
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

               {/* Image Upload Field */}
               {/* <Grid item xs={3}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="raised-button-file">
                  <Button variant="outlined" component="span">
                    Upload Image
                  </Button>
                </label>
              </Grid> */}

              {/* <Grid item xs={3} sx={{ textAlign: 'center', marginTop: 2 }}> */}
              <Grid item xs={12} sm={6} md={4} lg={3} sx={{ textAlign: 'center', marginTop: 0 }}>
              {image ? (
                  // Display the image preview when an image is selected
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Selected"
                      style={{ 
                        width: '100%', 
                        maxWidth: '200px', 
                        height: 'auto', 
                        objectFit: 'cover', 
                        marginBottom: '10px', 
                        borderRadius: '8px', 
                        border: '1px solid #ccc' }}
                    />
                    <Button variant="contained" component="label" color="secondary">
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </Button>
                  </Box>
                ) : (
                  // Display the upload button if no image is selected
                  <Button
                    component="label"
                    variant="outlined"
                    color="primary"
                    sx={{
                      border: '2px dashed #ccc',
                      padding: 2,
                      borderRadius: '8px',
                      backgroundColor: '#f5f5f5',
                      '&:hover': {
                        backgroundColor: '#e0e0e0',
                      },
                    }}
                  >
                    <CameraOutlined style={{ fontSize: 50, marginRight: 8 }} />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </Button>
                )}
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