import React, { useCallback } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Button,
  CardContent,
  Divider,
  Box,
  MenuItem,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Formik, Form, FastField, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MainCard from 'components/MainCard';
import './AccountableForm.css'; // Import custom CSS

const InvoiceForm = () => {
  const initialValues = {
    borrowerName: '',
    borrowerID: '',
    dateIssued: new Date(),
    dueDate: new Date(),
    issueID: '',
    equipmentName: '',
    quantity: 1,
    capacity: '',
    unit: 'ml',
    description: '',
    replaced: false,
  };

  const validationSchema = Yup.object().shape({
    borrowerName: Yup.string().required('Borrower Name is required'),
    borrowerID: Yup.string().required('Borrower ID is required'),
    quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
  });

  const handleSubmit = useCallback((values) => {
    console.log('Form data', values);
  }, []);

  return (
    <MainCard title="Invoice Form">
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, setFieldValue, resetForm }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6">Borrower Information</Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FastField
                    as={TextField}
                    fullWidth
                    label="Borrower Name"
                    name="borrowerName"
                    value={values.borrowerName}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="borrowerName" />}
                    error={Boolean(<ErrorMessage name="borrowerName" />)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FastField
                    as={TextField}
                    fullWidth
                    label="Borrower ID"
                    name="borrowerID"
                    value={values.borrowerID}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="borrowerID" />}
                    error={Boolean(<ErrorMessage name="borrowerID" />)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6">Issue Details</Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    selected={values.dateIssued}
                    onChange={(date) => setFieldValue('dateIssued', date)}
                    customInput={<TextField fullWidth label="Date Issued" />}
                    popperClassName="datepicker-popper"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    selected={values.dueDate}
                    onChange={(date) => setFieldValue('dueDate', date)}
                    customInput={<TextField fullWidth label="Due Date" />}
                    popperClassName="datepicker-popper"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6">Equipment Details</Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FastField
                    as={TextField}
                    fullWidth
                    label="Equipment Name"
                    name="equipmentName"
                    value={values.equipmentName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FastField
                    as={TextField}
                    fullWidth
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={values.quantity}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="quantity" />}
                    error={Boolean(<ErrorMessage name="quantity" />)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FastField
                    as={TextField}
                    fullWidth
                    label="Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button type="submit" variant="contained" color="primary">
                      Save
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </CardContent>
    </MainCard>
  );
};

export default InvoiceForm;
