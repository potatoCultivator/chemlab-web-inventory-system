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
} from '@mui/material';
import MainCard from 'components/MainCard';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Make sure to import the CSS
import './InvoiceForm.css'; // Import custom CSS

import { get_Sched, uploadInvoice, get_Borrowers } from 'pages/Query';

const InvoiceForm = () => {
  const [scheds, setScheds] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [equipments, setEquipments] = useState([]);
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

  // Fetch borrowers using get_Borrowers
  useEffect(() => {
    if (formValues.schedID) {
      get_Borrowers(formValues.schedID, 
        (fetchedBorrowers) => setBorrowers(fetchedBorrowers),
        (error) => console.error('Error fetching borrowers:', error)
      );
    }
    console.log('Borrowers:', borrowers);
  }, [formValues.schedID]);  // Trigger this effect when schedID changes
  

  // Fetch schedules using get_Sched
  useEffect(() => {
    get_Sched(
      (fetchedSchedules) => setScheds(fetchedSchedules),
      (error) => console.error('Error fetching schedules:', error)
    );
  }, []);

  // Update borrowers and equipments when schedule changes
  useEffect(() => {
    if (formValues.schedID) {
      const selectedSched = scheds.find((sched) => sched.id === formValues.schedID);
      if (selectedSched) {
        setEquipments(selectedSched.equipments || []);
      }
    } else {
      setEquipments([]);
    }
  }, [formValues.schedID, scheds]);

  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (selectedBorrower) {
      formValues.borrowerID = selectedBorrower.userId; // Make sure userID exists
      console.log(formValues); // Check the formValues before saving
    } else {
      console.error('No borrower selected!');
    }
  };
  

  return (
    <MainCard title="Invoice Form">
      <CardContent>
        <Grid container spacing={3}>
          {/* Date Picker for Date Issued */}
          <Grid item xs={6} md={6} lg={6}>
            <DatePicker
              selected={formValues.dateIssued}
              onChange={(date) => handleInputChange('dateIssued', date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select Date Issued"
              className="date-picker"
              customInput={
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Date Issued"
                  InputProps={{
                    readOnly: true,  // Prevent manual input
                  }}
                />
              }
            />
          </Grid>

          {/* Date Picker for Due Date */}
          <Grid item xs={6} md={6} lg={6}>
            <DatePicker
              selected={formValues.dueDate}
              onChange={(date) => handleInputChange('dueDate', date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select Due Date"
              className="date-picker"
              customInput={
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Due Date"
                  InputProps={{
                    readOnly: true,  // Prevent manual input
                  }}
                />
              }
            />
          </Grid>

          {/* Schedule Dropdown */}
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Schedule"
              variant="outlined"
              value={formValues.schedID}
              onChange={(e) => handleInputChange('schedID', e.target.value)}
            >
              {scheds.map((sched) => (
                <MenuItem key={sched.id} value={sched.id}>
                  {sched.subject} ({sched.teacher})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Borrower Dropdown */}
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Borrower"
              variant="outlined"
              value={formValues.borrower}
              onChange={(e) => {
                const selected = borrowers.find(borrower => borrower.name === e.target.value);
                setSelectedBorrower(selected); // Store the full borrower object
                handleInputChange('borrower', e.target.value); // Store the name in formValues
              }}
            >
              {borrowers.map((borrower, index) => (
                <MenuItem key={index} value={borrower.name}>
                  {borrower.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Equipment Table */}
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Equipment Name</TableCell>
                    <TableCell align='center'>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {equipments.map((equipment, index) => (
                    <TableRow key={index}>
                      <TableCell>{equipment.name}{' '}{equipment.capacity}{equipment.unit}</TableCell>
                      <TableCell align='center'>{equipment.qty}</TableCell>
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
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </Grid>

          {/* Save Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
};

export default InvoiceForm;
