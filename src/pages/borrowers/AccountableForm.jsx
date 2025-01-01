import React, { useState, useEffect } from 'react';
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
import MainCard from 'components/MainCard';
import './AccountableForm.css'; // Import custom CSS

import { uploadInvoice } from 'pages/Query';

const InvoiceForm = ({ schedID, id, student, equipments }) => {
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    schedID: '',
    borrower: '',
    studentID: '',
    borrowerID: '',
    dateIssued: new Date(),
    dueDate: new Date(),
    issueID: '',
    equipments: [],
    description: '',
    replaced: false,
  });

  useEffect(() => {
    const initialValues = {
      schedID,
      borrower: Array.isArray(student) && student.length > 0 ? student[0].id : '',
      studentID: '',
      borrowerID: '',
      dateIssued: new Date(),
      dueDate: new Date(),
      issueID: `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}`,
      equipments,
      description: '',
      replaced: false,
    };
    setFormValues(initialValues);
  }, [schedID, student, equipments]);

  // Ensure student is an array
  const students = Array.isArray(student) ? student.map((borrower) => ({
    value: borrower.id,
    label: borrower.name,
  })) : [];

  if (!id) {
    console.error('Error: borrowerID is undefined');
    return <div>Error: borrowerID is undefined</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleDateChange = (name, date) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: date,
    }));
  };

  const handleQtyChange = (index, value) => {
    const updatedEquipments = [...formValues.equipments];
    updatedEquipments[index].qty = value;
    setFormValues((prevValues) => ({
      ...prevValues,
      equipments: updatedEquipments,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await uploadInvoice(formValues);
      console.log('Form data', formValues);
    } catch (error) {
      console.error('Error uploading invoice:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainCard title="Invoice Form">
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Borrower Information</Typography>
              <Divider />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Borrower Name"
                name="borrower"
                value={formValues.borrower}
                onChange={handleChange}
                required
              >
                {students.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Student ID"
                name="studentID"
                value={formValues.studentID}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Issue Details</Typography>
              <Divider />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                selected={formValues.dateIssued}
                onChange={(date) => handleDateChange('dateIssued', date)}
                disabled
                customInput={<TextField fullWidth label="Date Issued" />}
                popperClassName="datepicker-popper"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                selected={formValues.dueDate}
                onChange={(date) => handleDateChange('dueDate', date)}
                customInput={<TextField fullWidth label="Due Date" />}
                popperClassName="datepicker-popper"
                required
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
                  {formValues.equipments.map((equipment, index) => (
                    <tr key={index}>
                      <td>{equipment.name} {equipment.capacity}{equipment.unit}</td>
                      <td>
                        <TextField
                          fullWidth
                          name={`equipments[${index}].qty`}
                          type="number"
                          value={equipment.qty}
                          onChange={(e) => handleQtyChange(index, e.target.value)}
                          inputProps={{ min: 1, max: equipment.qty }}
                          required
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formValues.description}
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
                <Button type="button" variant="outlined" color="secondary" onClick={() => setFormValues(initialValues)} disabled={loading}>
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </MainCard>
  );
};

import PropTypes from 'prop-types';

InvoiceForm.propTypes = {
  schedID: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  student: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    PropTypes.string,
  ]).isRequired,
  equipments: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    qty: PropTypes.number.isRequired,
    capacity: PropTypes.string,
    unit: PropTypes.string,
  })).isRequired,
};

export default InvoiceForm;