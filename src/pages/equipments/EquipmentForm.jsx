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
import { Timestamp } from 'firebase/firestore';

// Firestore Functions
import {
  addEquipment,
  uploadImageAndGetUrl,
  checkEquipmentExists,
  updateStock,
} from 'pages/Query'; // Adjust the path as necessary

// Reusable Constants
const UNIT_OPTIONS = ['kg', 'g', 'L', 'mL', 'pcs'];
const CATEGORY_OPTIONS = [
  'glassware',
  'plasticware',
  'metalware',
  'heating',
  'measuring',
  'container',
  'separator',
  'mixing',
];

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  stocks: Yup.number()
    .min(0, 'Stocks must be at least 0')
    .required('Stocks are required'),
  capacity: Yup.number()
    .min(0, 'Capacity must be at least 0')
    .when('unit', {
      is: (unit) => unit !== 'pcs',
      then: Yup.number().required('Capacity is required for units other than pcs'),
    }),
  unit: Yup.string().oneOf(UNIT_OPTIONS).required('Unit is required'),
  category: Yup.string().oneOf(CATEGORY_OPTIONS).required('Category is required'),
  image: Yup.mixed().required('Image is required'),
});

export default function EquipmentForm({ onClose }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [adminData, setAdminData] = useState({ firstname: '', lastname: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('userData');

    if (storedData) {
      setAdminData(JSON.parse(storedData));
    } else {
      const fetchUserData = async () => {
        try {
          const userData = await fetchUserProfile();
          const { firstname, lastname } = userData;
          if (firstname && lastname) {
            setAdminData({ firstname, lastname });
            localStorage.setItem('userData', JSON.stringify({ firstname, lastname }));
          } else {
            throw new Error('Incomplete profile data');
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          navigate('/404');
        }
      };
      fetchUserData();
    }
  }, [navigate]);

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPreviewImage(URL.createObjectURL(file));
      setFieldValue('image', file);
    } else {
      alert('Please select a valid image file.');
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
        date: Timestamp.fromDate(new Date()),
        addedBy: `${adminData.firstname} ${adminData.lastname}`,
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
          ...values,
          stocks: values.stocks,
          total: values.stocks,
          image: imageUrl,
          dateAdded: Timestamp.fromDate(new Date()),
          history: [historyEntry],
        };
        await addEquipment(newEquipment);
        alert('Equipment added successfully!');
      }

      resetForm();
      setPreviewImage(null);
      setNameError('');
      if (onClose) onClose();
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
        unit: 'mL', // Set default unit to mL
        category: 'glassware', // Set default category to glassware
        image: null,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <Box sx={{ p: 3, borderRadius: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">Add Equipment</Typography>
              </Grid>

              <Grid item xs={12}>
                <Field
                  component={TextField}
                  name="name"
                  label="Name"
                  fullWidth
                  onChange={(e) => handleNameChange(e, setFieldValue)}
                  error={!!nameError}
                  helperText={nameError}
                />
              </Grid>

              <Grid item xs={6}>
                <Field
                  component={TextField}
                  name="stocks"
                  label="Stocks"
                  type="number"
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <Field
                  component={Select}
                  name="unit"
                  label="Unit"
                  fullWidth
                >
                  <MenuItem value="" disabled>
                    Select Unit
                  </MenuItem>
                  {UNIT_OPTIONS.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>

              <Grid item xs={12}>
                <Field
                  component={TextField}
                  name="capacity"
                  label="Capacity"
                  type="number"
                  fullWidth
                  disabled={values.unit === 'pcs'}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  component={Select}
                  name="category"
                  label="Category"
                  fullWidth
                >
                  <MenuItem value="" disabled>
                    Select Category
                  </MenuItem>
                  {CATEGORY_OPTIONS.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained" component="label" fullWidth>
                  Upload Image
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setFieldValue)}
                  />
                </Button>
                {previewImage && (
                  <Box mt={2}>
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{ maxWidth: '100%', borderRadius: 4 }}
                    />
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
