import React, { useCallback, useState } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Button,
  CardContent,
  Divider,
  Box,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Formik, Form, FastField, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MainCard from 'components/MainCard';
import './AccountableForm.css'; // Import custom CSS

import { uploadInvoice } from 'pages/Query';

const InvoiceForm = ({ schedID, id, student, equipments }) => {
  const [loading, setLoading] = useState(false);

  if (!id) {
    console.error('Error: borrowerID is undefined');
    return <div>Error: borrowerID is undefined</div>;
  }

  const initialValues = {
    schedID,
    borrower: student,
    studentID: '',
    borrowerID: id, // Ensure borrowerID is correctly set
    dateIssued: new Date(),
    dueDate: new Date(),
    issueID: `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}`,
    equipments,
    description: '',
    replaced: false,
  };

  const validationSchema = Yup.object().shape({
    studentID: Yup.string().required('Student ID is required'),
    dueDate: Yup.date().required('Due Date is required'),
  });

  const handleSubmit = useCallback(async (values, { resetForm }) => {
    setLoading(true);
    try {
      await uploadInvoice(values);
      console.log('Form data', values);
      resetForm(); // Reset the form after successful upload
    } catch (error) {
      console.error('Error uploading invoice:', error);
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // Request was made but no response received
        console.error('Request data:', error.request);
      } else {
        // Something else happened
        console.error('Error message:', error.message);
      }
    } finally {
      setLoading(false);
    }
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
                  <Typography variant="h6" gutterBottom>Borrower Information</Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FastField
                    as={TextField}
                    fullWidth
                    label="Borrower Name"
                    name="borrowerName"
                    defaultValue={student} 
                    value={values.borrowerName}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FastField
                    as={TextField}
                    fullWidth
                    label="Student ID"
                    name="studentID"
                    value={values.studentID}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="studentID" />}
                    error={Boolean(<ErrorMessage name="studentID" />)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Issue Details</Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    selected={values.dateIssued}
                    onChange={(date) => setFieldValue('dateIssued', date)}
                    disabled
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
                  <ErrorMessage name="dueDate" component="div" className="error-message" />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Equipment Details</Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <table className="equipment-table">
                    <thead>
                      <tr>
                        <th>Equipment Name</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipments.map((equipment, index) => (
                        <tr key={index}>
                          <td>{equipment.name} {equipment.capacity}{equipment.unit}</td>
                          <td>
                            <FastField
                              as={TextField}
                              fullWidth
                              name={`equipments[${index}].qty`}
                              type="number"
                              value={values.equipments[index].qty}
                              onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                if (value >= 1 && value <= equipment.qty) {
                                  handleChange(e);
                                }
                              }}
                              inputProps={{ min: 1, max: equipment.qty }}
                              helperText={<ErrorMessage name={`equipments[${index}].qty`} />}
                              error={Boolean(<ErrorMessage name={`equipments[${index}].qty`} />)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                      {loading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button type="button" variant="outlined" color="secondary" onClick={resetForm} disabled={loading}>
                      Reset
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

import PropTypes from 'prop-types';

InvoiceForm.propTypes = {
  schedID: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  student: PropTypes.string.isRequired,
  equipments: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    qty: PropTypes.number.isRequired,
    capacity: PropTypes.string,
    unit: PropTypes.string,
  })).isRequired,
};

export default InvoiceForm;