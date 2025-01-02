import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  CardContent,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import 'react-datepicker/dist/react-datepicker.css'; // Import the default CSS
import './InvoiceForm.css'; // Import custom CSS
import { CalendarOutlined } from '@ant-design/icons';
import { get_Sched, uploadInvoice, get_SchedSub } from 'pages/Query';
import { Timestamp } from 'firebase/firestore';

const InvoiceForm = ({ invoice }) => {
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const [formValues, setFormValues] = useState({
    schedID: '',
    borrower: '',
    studentID: '',
    borrowerID: '',
    date_issued: new Date(),
    due_date: new Date(),
    issueID: `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}`,
    equipments: [],
    description: '',
    replaced: false,
    subject: '',
    teacher: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (invoice) {
      setFormValues({
        schedID: invoice.schedID || '',
        borrower: invoice.borrower || '',
        studentID: invoice.studentID || '',
        borrowerID: invoice.borrowerID || '',
        date_issued: invoice.date_issued ? new Date(invoice.date_issued.seconds * 1000) : new Date(),
        due_date: invoice.due_date ? new Date(invoice.due_date.seconds * 1000) : new Date(),
        issueID: invoice.issueID || `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}`,
        equipments: invoice.equipments || [],
        description: invoice.description || '',
        replaced: invoice.replaced || false,
        subject: invoice.subject || '',
        teacher: invoice.teacher || '',
      });
    }
  }, [invoice]);

  useEffect(() => {
    if (formValues.schedID) {
      get_SchedSub(formValues.schedID,
        (data) => {
          if (data) {
            setFormValues((prevValues) => ({
              ...prevValues,
              subject: data.subject,
              teacher: data.teacher,
            }));
          }
        },
        (error) => {
          setSnackbarMessage('Failed to fetch schedule subject');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      );
    }
  }, [formValues.schedID]);

  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => {
      let updatedValues = { ...prevValues, [field]: value };

      if (field === 'schedID') {
        const selectedSched = scheds.find((sched) => sched.id === value);
        if (selectedSched) {
          updatedValues.equipments = selectedSched.equipments || [];
        } else {
          updatedValues.equipments = [];
        }
      }

      return updatedValues;
    });
  };

  const handleSave = async () => {
    if (!formValues.schedID || !selectedBorrower || !formValues.due_date || !formValues.studentID || formValues.equipments.length === 0) {
      setSnackbarMessage('Please fill in all required fields!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    const updatedValues = {
      ...formValues,
      borrowerID: selectedBorrower.userId,
      date_issued: Timestamp.fromDate(formValues.date_issued),
      due_date: Timestamp.fromDate(formValues.due_date),
    };

    try {
      await uploadInvoice(updatedValues);  // Assuming this is a promise-based function
      setSnackbarMessage('Invoice uploaded successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      // Clear the form after saving
      setFormValues({
        schedID: '',
        borrower: '',
        studentID: '',
        borrowerID: '',
        date_issued: new Date(),
        due_date: new Date(),
        issueID: `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}`,
        equipments: [],
        description: '',
        replaced: false,
        subject: '',
        teacher: '',
      });
      setSelectedBorrower(null);
    } catch (error) {
      setSnackbarMessage('Error uploading invoice');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Error uploading invoice:', error);
    } finally {
      setLoading(false);  // This will stop the loading spinner
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <CardContent>
      <Grid container spacing={3}>
        {/* Date Issued */}
        <Grid item xs={12} md={6} lg={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Date Issued"
            value={formValues.date_issued.toISOString().split('T')[0]}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarOutlined />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Due Date */}
        <Grid item xs={12} md={6} lg={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Due Date"
            value={formValues.due_date.toISOString().split('T')[0]}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarOutlined />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Schedule Dropdown */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Subject"
            variant="outlined"
            value={`${formValues.subject} (${formValues.teacher})`}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        {/* Borrower Dropdown */}
        <Grid item xs={8}>
          <TextField
            fullWidth
            label="Borrower"
            variant="outlined"
            defaultValue={invoice ? invoice.borrower : ''}
            value={formValues.borrower}
          >
          </TextField>
        </Grid>

        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Student ID"
            variant="outlined"
            value={formValues.studentID}
            onChange={(e) => handleInputChange('studentID', e.target.value)}
          />
        </Grid>

        {/* Equipment Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Equipment Name</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formValues.equipments.map((equipment, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {equipment.name} {equipment.capacity} {equipment.unit}
                    </TableCell>
                    <TableCell align="center">
                      {equipment.qty}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Description Field */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={4} // Allows for multi-line input
            value={formValues.description}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            fullWidth
            disabled={loading} // Disable button while loading
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </Grid>
      </Grid>

      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </CardContent>
  );
};

import PropTypes from 'prop-types';

InvoiceForm.propTypes = {
  invoice: PropTypes.object,
};

export default InvoiceForm;