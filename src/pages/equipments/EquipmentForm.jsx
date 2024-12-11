import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Select } from 'formik-mui';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import * as Yup from 'yup';

// Firestore
import { addEquipment, uploadImageAndGetUrl, checkEquipmentExists } from 'pages/Query'; // Adjust the path as necessary

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  quantity: Yup.number().min(0, 'Quantity must be at least 0').required('Quantity is required'),
  capacity: Yup.number().min(0, 'Capacity must be at least 0').required('Capacity is required'),
  unit: Yup.string().required('Unit is required'),
  category: Yup.string().required('Category is required'),
  image: Yup.mixed().required('Image is required'),
});

export default function EquipmentForm() {
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFieldValue('image', file);
    }
  };

  const handleNameChange = async (event, setFieldValue) => {
    const name = event.target.value;
    setFieldValue('name', name);

    // Check if the equipment name already exists in the database
    const exists = await checkEquipmentExists(name);
    if (exists) {
      setNameError('Equipment with this name already exists.');
    } else {
      setNameError('');
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (nameError) {
      setSubmitting(false);
      return;
    }

    setLoading(true);
    console.log(values);
    try {
      // Upload image to Firebase Storage and get the URL
      const imageUrl = await uploadImageAndGetUrl(values.image);
      console.log('imageUrl: ', imageUrl);

      // Add equipment to Firestore
      await addEquipment({
        name: values.name,
        quantity: values.quantity,
        capacity: values.capacity,
        unit: values.unit,
        category: values.category,
        image: imageUrl,
        dateAdded: new Date(),
      });

      alert('Equipment added successfully!');
      resetForm();
      setPreviewImage(null);
    } catch (error) {
      console.error('Error adding equipment:', error);
      alert('Failed to add equipment. Please try again.');
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name: '',
        quantity: '',
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

              {/* Quantity Field */}
              <Grid item xs={2}>
                <Typography>Quantity:</Typography>
              </Grid>
              <Grid item xs={10}>
                <Field
                  component={TextField}
                  name="quantity"
                  type="number"
                  fullWidth
                  placeholder="Enter the quantity"
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
                  component={TextField}
                  name="unit"
                  fullWidth
                  placeholder="Please select the unit of measurement"
                  sx={{ backgroundColor: 'transparent' }}
                />
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