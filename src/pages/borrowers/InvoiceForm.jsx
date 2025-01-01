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
  IconButton,
  CircularProgress,
} from '@mui/material';
import MainCard from 'components/MainCard';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the default CSS
import './InvoiceForm.css'; // Import custom CSS
import { CalendarOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
// import EditIcon from '@mui/icons-material/Edit';
// import SaveIcon from '@mui/icons-material/Save';

import { get_Sched, uploadInvoice, get_Borrowers } from 'pages/Query';
import { Timestamp } from 'firebase/firestore';

const InvoiceForm = () => {
  const [scheds, setScheds] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  // const [equipments, setEquipments] = useState([]);
  const [formValues, setFormValues] = useState({
    schedID: '',
    borrower: '',
    studentID: '',
    borrowerID: '',
    dateIssued: new Date(),
    dueDate: new Date(),
    issueID: `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}`,
    equipments: [],
    description: '',
    replaced: false,
  });
  const [editRowIndex, setEditRowIndex] = useState(null);

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
    if (!formValues.schedID || !selectedBorrower || !formValues.dueDate) {
      console.error('Required fields are missing!');
      return;
    }
  
    setLoading(true);
  
    const updatedValues = {
      ...formValues,
      borrowerID: selectedBorrower.userId,
      dateIssued: Timestamp.fromDate(formValues.dateIssued),
      dueDate: Timestamp.fromDate(formValues.dueDate),
    };
  
    try {
      await uploadInvoice(updatedValues);  // Assuming this is a promise-based function
      console.log('Invoice uploaded successfully');
      // Clear the form after saving
      setFormValues({
        schedID: '',
        borrower: '',
        studentID: '',
        borrowerID: '',
        dateIssued: new Date(),
        dueDate: new Date(),
        issueID: `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}`,
        equipments: [],
        description: '',
        replaced: false,
      });
      setSelectedBorrower(null);
    } catch (error) {
      console.error('Error uploading invoice:', error);
    } finally {
      setLoading(false);  // This will stop the loading spinner
    }
  };
  
  

  return (
      <CardContent>
        <Grid container spacing={3}>
          {/* Date Picker for Date Issued */}
          <Grid item xs={12} md={6} lg={6}>
            <DatePicker
              selected={formValues.dateIssued}
              onChange={(date) => handleInputChange('dateIssued', date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select Date Issued"
              className="datepicker-popper"
              disabled
              customInput={
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Date Issued"
                  InputProps={{
                    readOnly: true,  // Prevent manual input
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
              }
              locale="en" // Add locale prop here
            />
          </Grid>

          {/* Date Picker for Due Date */}
          <Grid item xs={12} md={6} lg={6}>
            <DatePicker
              selected={formValues.dueDate}
              onChange={(date) => handleInputChange('dueDate', date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select Due Date"
              className="datepicker-popper"
              customInput={
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Due Date"
                  InputProps={{
                    readOnly: true,  // Prevent manual input
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
              }
              locale="en" // Add locale prop here
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
          <Grid item xs={8}>
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
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formValues.equipments.map((equipment, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {equipment.name} {equipment.capacity} {equipment.unit}
                      </TableCell>
                      <TableCell align="center">
                        {editRowIndex === index ? (
                          <TextField
                            type="number"
                            variant="outlined"
                            size="small"
                            value={equipment.qty}
                            onChange={(e) => {
                              const updatedQty = e.target.value;
                              setFormValues((prevValues) => {
                                const updatedEquipments = [...prevValues.equipments];
                                updatedEquipments[index].qty = updatedQty;
                                return { ...prevValues, equipments: updatedEquipments };
                              });
                            }}
                            inputProps={{ min: 0, max: equipment.qty }}
                          />
                        ) : (
                          equipment.qty
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {editRowIndex === index ? (
                          <IconButton
                            onClick={() => setEditRowIndex(null)}
                          >
                            <SaveOutlined />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => setEditRowIndex(index)}
                          >
                            <EditOutlined />
                          </IconButton>
                        )}
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
              onChange={(e) => handleInputChange('description', e.target.value)}
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
      </CardContent>
  );
};

export default InvoiceForm;