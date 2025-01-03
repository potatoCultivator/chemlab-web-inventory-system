import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Select } from 'formik-mui';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete'; // Import Autocomplete
import debounce from 'lodash/debounce'; // Import debounce
import Dialog from '@mui/material/Dialog'; // Import Dialog
import DialogActions from '@mui/material/DialogActions'; // Import DialogActions
import DialogContent from '@mui/material/DialogContent'; // Import DialogContent
import DialogContentText from '@mui/material/DialogContentText'; // Import DialogContentText
import DialogTitle from '@mui/material/DialogTitle'; // Import DialogTitle
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';

// Firestore
import { addEquipment, uploadImageAndGetUrl, checkEquipmentExists, updateStock, fetchAllEquipments } from 'pages/Query';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  stocks: Yup.number().min(0, 'Stocks must be at least 0').required('Stocks are required'),
  capacity: Yup.number().when('unit', {
    is: (unit) => unit === 'pcs',
    then: () => Yup.number().nullable(),
    otherwise: () => Yup.number()
      .min(0, 'Capacity must be at least 0')
      .required('Capacity is required')
  }),
  unit: Yup.string().required('Unit is required'),
  category: Yup.string().required('Category is required'),
  image: Yup.mixed().required('Image is required'),
});

export default function EquipmentForm({ onClose }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [data, setData] = useState({ firstname: '', lastname: '' });
  const [equipmentNames, setEquipmentNames] = useState([]); // State to store equipment names
  const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('userData');

    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      const fetchData = async () => {
        try {
          const userData = await fetchUserProfile();
          const { firstname, lastname } = userData;

          if (firstname && lastname) {
            setData({ firstname, lastname });
            localStorage.setItem('userData', JSON.stringify({ firstname, lastname }));
          } else {
            console.error('Profile data is incomplete.');
            navigate('/404');
          }
        } catch (err) {
          console.error('Error fetching data:', err);
          navigate('/404');
        }
      };
      fetchData();
    }
  }, [navigate]);

  const fetchEquipmentNames = async (query) => {
    try {
      const equipment = await fetchAllEquipments();
      if (Array.isArray(equipment)) {
        const names = equipment
          .map(item => item.name)
          .filter(name => name.toLowerCase().includes(query.toLowerCase()));
        setEquipmentNames(names);
      } else {
        console.error('Fetched equipment is not an array');
      }
    } catch (error) {
      console.error('Error fetching equipment names:', error);
    }
  };

  const debouncedFetchEquipmentNames = debounce(fetchEquipmentNames, 300);

  const handleNameChange = async (event, setFieldValue, values) => {
    const name = event.target.value.trim().toLowerCase();
    setFieldValue('name', name);

    if (name) {
      debouncedFetchEquipmentNames(name);
      const exists = await checkEquipmentExists(name, values.unit, values.capacity);
      setNameError(exists ? 'Equipment with this name already exists.' : '');
    } else {
      setNameError('');
    }
  };

  const handleNameSelect = async (event, value, setFieldValue) => {
    if (value) {
      const existingEquipment = await checkEquipmentExists(value.toLowerCase(), '', '');
      if (existingEquipment) {
        setFieldValue('name', existingEquipment.name);
        setFieldValue('stocks', existingEquipment.stocks);
        setFieldValue('capacity', existingEquipment.capacity);
        setFieldValue('unit', existingEquipment.unit);
        setFieldValue('category', existingEquipment.category);
        setPreviewImage(existingEquipment.image);
      }
    }
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFieldValue('image', file);
    }
  };

  const handleUnitChange = (event, setFieldValue) => {
    const unit = event.target.value;
    setFieldValue('unit', unit);
    if (unit === 'pcs') {
      setFieldValue('capacity', null);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      const historyEntry = {
        date: Timestamp.fromDate(new Date()),
        addedBy: `${data.firstname} ${data.lastname}`,
        addedStock: values.stocks,
      };
  
      // Check if an existing item with the same name and unit exists
      const existingEquipment = await checkEquipmentExists(values.name, values.unit, values.capacity);
  
      if (existingEquipment) {
        // Show dialog if equipment already exists
        setDialogOpen(true);
      } else {
        // If item doesn't exist, add a new one
        const imageUrl = await uploadImageAndGetUrl(values.image);
        const newEquipment = {
          name: values.name,
          stocks: values.stocks,
          total: values.stocks,
          capacity: values.unit === 'pcs' ? null : values.capacity,
          unit: values.unit,
          category: values.category,
          image: imageUrl,
          dateAdded: Timestamp.fromDate(new Date()),
          history: [historyEntry],
        };
        await addEquipment(newEquipment);
        alert('Equipment added successfully!');
  
        // Reset the form after submission
        resetForm();
        setPreviewImage(null);
        setNameError('');
        if (onClose) onClose();
      }
    } catch (error) {
      console.error('Error adding/updating equipment:', error);
      alert('Failed to add/update equipment. Please try again.');
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Formik
        initialValues={{
          name: '',
          stocks: '',
          capacity: '',
          unit: '',
          category: '',
          image: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <Box sx={{ width: '100%', backgroundColor: 'transparent', padding: 3, borderRadius: 2 }}>
              <Grid container spacing={3} direction={{ xs: 'column', sm: 'row' }}>
                {/* Name and Stocks Fields */}
                <Grid item xs={12} sm={6}>
                  <Typography>Name:</Typography>
                  <Autocomplete
                    freeSolo
                    options={equipmentNames}
                    onInputChange={(event, newInputValue) => handleNameChange({ target: { value: newInputValue } }, setFieldValue, values)}
                    onChange={(event, value) => handleNameSelect(event, value, setFieldValue)}
                    renderInput={(params) => (
                      <Field
                        {...params}
                        component={TextField}
                        name="name"
                        fullWidth
                        placeholder="Enter the name of the item"
                        sx={{ backgroundColor: 'transparent' }}
                        error={!!nameError}
                        helperText={nameError}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>Stocks:</Typography>
                  <Field
                    component={TextField}
                    name="stocks"
                    type="number"
                    fullWidth
                    placeholder="Enter the stocks"
                    sx={{ backgroundColor: 'transparent' }}
                  />
                </Grid>

                {/* Unit and Capacity Fields */}
                <Grid item xs={12} sm={6}>
                  <Typography>Unit:</Typography>
                  <Field
                    component={Select}
                    name="unit"
                    fullWidth
                    displayEmpty
                    onChange={(event) => handleUnitChange(event, setFieldValue)}
                    inputProps={{ 'aria-label': 'Select unit' }}
                    sx={{ backgroundColor: 'transparent' }}
                  >
                    <MenuItem value="" disabled>
                      Please select the unit of measurement
                    </MenuItem>
                    <MenuItem value="kg">kg</MenuItem>
                    <MenuItem value="g">g</MenuItem>
                    <MenuItem value="L">L</MenuItem>
                    <MenuItem value="mL">mL</MenuItem>
                    <MenuItem value="pcs">pcs</MenuItem>
                    <MenuItem value="cm">cm</MenuItem>
                    <MenuItem value="in">inches (in)</MenuItem>
                    <MenuItem value="mm">mm</MenuItem>
                    <MenuItem value="m">meters (m)</MenuItem>
                    <MenuItem value="ft">feet (ft)</MenuItem>
                  </Field>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>Capacity:</Typography>
                  <Field
                    component={TextField}
                    name="capacity"
                    type="number"
                    fullWidth
                    disabled={values.unit === 'pcs'}
                    placeholder="Enter the capacity of the item"
                    sx={{ backgroundColor: 'transparent' }}
                  />
                </Grid>

                {/* Category Field */}
                <Grid item xs={12} sm={6}>
                  <Typography>Category:</Typography>
                  <Field
                    component={Select}
                    name="category"
                    fullWidth
                    displayEmpty
                    inputProps={{ 'aria-label': 'Select category' }}
                    sx={{ backgroundColor: 'transparent' }}
                  >
                    <MenuItem value="" disabled>
                      Please select the category
                    </MenuItem>
                    <MenuItem value="glassware">Glassware</MenuItem>
                    <MenuItem value="plasticware">Plasticware</MenuItem>
                    <MenuItem value="metalware">Metalware</MenuItem>
                    <MenuItem value="heating">Heating</MenuItem>
                    <MenuItem value="measuring">Measuring</MenuItem>
                    <MenuItem value="container">Container</MenuItem>
                    <MenuItem value="separator">Separation Equipment</MenuItem>
                    <MenuItem value="mixing">Mixing & Stirring</MenuItem>
                  </Field>
                </Grid>

                {/* Image Upload Field */}
                <Grid item xs={12} sm={6}>
                  <Typography>Image:</Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageChange(event, setFieldValue)}
                    style={{ display: 'block', marginBottom: '1rem' }}
                  />
                  {previewImage && (
                    <Box
                      component="img"
                      src={previewImage}
                      alt="Preview"
                      sx={{
                        maxWidth: '100%',
                        maxHeight: 200,
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        marginBottom: '1rem',
                      }}
                    />
                  )}
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      startIcon={loading && <CircularProgress size={20} />}
                    >
                      {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>

      {/* Dialog for existing equipment */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Equipment Exists</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            An equipment item with the same name, unit, and capacity already exists. Please modify the details or search for the equipment in the table to add stock.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
