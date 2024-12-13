import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Select } from 'formik-mui';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

// Firestore
import { addEquipment, uploadImageAndGetUrl, checkEquipmentExists, updateStock } from 'pages/Query'; // Adjust the path as necessary

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  stocks: Yup.number().min(0, 'Stocks must be at least 0').required('Stocks are required'),
  capacity: Yup.number().min(0, 'Capacity must be at least 0').required('Capacity is required'),
  unit: Yup.string().required('Unit is required'),
  category: Yup.string().required('Category is required'),
  image: Yup.mixed().required('Image is required'),
});

export default function EquipmentForm({ onClose }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [data, setData] = useState({ firstname: '', lastname: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('userData');

    if (storedData) {
      setData(JSON.parse(storedData)); // Set data from local storage
      console.log('stored data', JSON.parse(storedData));
    } else {
      const fetchData = async () => {
        try {
          const userData = await fetchUserProfile();
          const { firstname, lastname } = userData;

          if (firstname && lastname) {
            setData({ firstname, lastname });
            localStorage.setItem('userData', JSON.stringify({ firstname, lastname })); // Save to local storage
          } else {
            console.error('Profile data is incomplete.');
            navigate('/404'); // Navigate to 404 page
          }
        } catch (err) {
          console.error('Error fetching data:', err);
          navigate('/404'); // Navigate to 404 page
        }
      };
      fetchData(); // Fetch data if not found in local storage
    }
  }, [navigate]);

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFieldValue('image', file); // Always update the form field
    }
  };

  const handleNameChange = async (event, setFieldValue) => {
    const name = event.target.value.trim();
    setFieldValue('name', name);

    if (name) {
      const exists = await checkEquipmentExists(name, values.unit, values.capacity);
      setNameError(exists ? 'Equipment with this name already exists.' : '');
    } else {
      setNameError('');
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      const historyEntry = {
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        addedBy: `${data.firstname} ${data.lastname}`, // Use the admin's first name and last name
        addedStock: values.stocks,
      };
  
      const existingEquipment = await checkEquipmentExists(values.name, values.unit, values.capacity);
      if (existingEquipment) {
        const newStock = existingEquipment.stocks + values.stocks;
        const newTotal = existingEquipment.total + values.stocks;
        await updateStock(existingEquipment.id, newStock, newTotal, historyEntry);
        alert('Equipment stock updated successfully!');
      } else {
        const imageUrl = await uploadImageAndGetUrl(values.image);
        const newEquipment = {
          name: values.name,
          stocks: values.stocks,
          total: values.stocks,
          capacity: values.capacity,
          unit: values.unit,
          category: values.category,
          image: imageUrl,
          dateAdded: new Date(),
          history: [historyEntry],
        };
        await addEquipment(newEquipment);
        alert('Equipment added successfully!');
      }
  
      resetForm();
      setPreviewImage(null);
      setNameError('');
      if (onClose) onClose(); // Call the onClose callback if provided
    } catch (error) {
      console.error('Error adding/updating equipment:', error);
      alert('Failed to add/update equipment. Please try again.');
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
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
      {({ setFieldValue }) => (
        <Form>
          <Box sx={{ width: '100%', backgroundColor: 'transparent', padding: 3, borderRadius: 2 }}>
            <Grid container spacing={3} alignItems="center">
              {/* Name Field */}
              <Grid item xs={2}>
                <Typography>Name:</Typography>
              </Grid>
              <Grid item xs={10}>
                <Field
                  component={TextField}
                  name="name"
                  fullWidth
                  placeholder="Enter the name of the item"
                  sx={{ backgroundColor: 'transparent' }}
                  onChange={(event) => handleNameChange(event, setFieldValue)}
                  error={!!nameError}
                  helperText={nameError}
                />
              </Grid>

              {/* Stocks Field */}
              <Grid item xs={2}>
                <Typography>Stocks:</Typography>
              </Grid>
              <Grid item xs={10}>
                <Field
                  component={TextField}
                  name="stocks"
                  type="number"
                  fullWidth
                  placeholder="Enter the stocks"
                  sx={{ backgroundColor: 'transparent' }}
                />
              </Grid>

              {/* Capacity Field */}
              <Grid item xs={2}>
                <Typography>Capacity:</Typography>
              </Grid>
              <Grid item xs={10}>
                <Field
                  component={TextField}
                  name="capacity"
                  type="number"
                  fullWidth
                  placeholder="Enter the capacity of the item"
                  sx={{ backgroundColor: 'transparent' }}
                />
              </Grid>

              {/* Unit Field */}
              <Grid item xs={2}>
                <Typography>Unit:</Typography>
              </Grid>
              <Grid item xs={10}>
                <Field
                  component={Select}
                  name="unit"
                  fullWidth
                  displayEmpty
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
                </Field>
              </Grid>

              {/* Category Field */}
              <Grid item xs={2}>
                <Typography>Category:</Typography>
              </Grid>
              <Grid item xs={10}>
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

              {/* Image Upload */}
              <Grid item xs={2}>
                <Typography>Image:</Typography>
              </Grid>
              <Grid item xs={10}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{ textAlign: 'left' }}
                >
                  Upload Image
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(event) => handleImageChange(event, setFieldValue)}
                  />
                </Button>
                {previewImage && (
                  <Box mt={2}>
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{ maxWidth: '100%', height: 'auto', borderRadius: 4 }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Box mt={3} textAlign="center">
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
}