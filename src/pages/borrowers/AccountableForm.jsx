import React, { useCallback } from 'react';
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

const InvoiceForm = ({ schedID, id, student, equipments }) => {
  const initialValues = {
    schedID,
    borrowerName: student,
    studentID: '',
    borrowerID: id,
    dateIssued: new Date(),
    dueDate: new Date(),
    issueID: '',
    equipmentName: '',
    quantity: 1,
    equipments,
    description: '',
    replaced: false,
  };

  const validationSchema = Yup.object().shape({
    borrowerName: Yup.string().required('Borrower Name is required'),
    studentID: Yup.string().required('Student ID is required'),
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
                  <Typography variant="h6" gutterBottom>Borrower Information</Typography>
                  <Divider />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FastField
                    as={TextField}
                    fullWidth
                    label="Borrower Name"
                    name="borrowerName"
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
                              name={`equipments[${index}].quantity`}
                              type="number"
                              value={values.equipments[index].quantity}
                              onChange={handleChange}
                              helperText={<ErrorMessage name={`equipments[${index}].quantity`} />}
                              error={Boolean(<ErrorMessage name={`equipments[${index}].quantity`} />)}
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
                    <Button type="submit" variant="contained" color="primary">
                      Save
                    </Button>
                    <Button type="button" variant="outlined" color="secondary" onClick={resetForm}>
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
    quantity: PropTypes.number.isRequired,
    capacity: PropTypes.string,
    unit: PropTypes.string,
  })).isRequired,
};

export default InvoiceForm;
