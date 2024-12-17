import React, { Component } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import Accountable from './Accountable'; // Assuming Accountable is your component

class FulfillList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      borrowers: [
        {
          borrowername: 'John Doe',
          course: 'Chemistry',
          date: new Date(),
          subject: 'Organic Chemistry',
          equipmentDetails: [
            { name: 'Lab Coat', quantity: 1 },
            { name: 'Beakers', quantity: 3 },
          ],
        },
        {
          borrowername: 'Jane Smith',
          course: 'Physics',
          date: new Date(),
          subject: 'Electromagnetism',
          equipmentDetails: [
            { name: 'Safety Glasses', quantity: 2 },
            { name: 'Magnet', quantity: 1 },
          ],
        },
        {
          borrowername: 'Alice Johnson',
          course: 'Biology',
          date: new Date(),
          subject: 'Genetics',
          equipmentDetails: [
            { name: 'Microscope', quantity: 1 },
            { name: 'Slides', quantity: 10 },
          ],
        },
        {
          borrowername: 'Bob Brown',
          course: 'Mathematics',
          date: new Date(),
          subject: 'Calculus',
          equipmentDetails: [
            { name: 'Calculator', quantity: 1 },
            { name: 'Graph Paper', quantity: 5 },
          ],
        },
        {
          borrowername: 'Charlie Davis',
          course: 'Engineering',
          date: new Date(),
          subject: 'Mechanics',
          equipmentDetails: [
            { name: 'Wrench', quantity: 2 },
            { name: 'Screwdriver', quantity: 3 },
          ],
        },
        {
          borrowername: 'Diana Evans',
          course: 'Computer Science',
          date: new Date(),
          subject: 'Algorithms',
          equipmentDetails: [
            { name: 'Laptop', quantity: 1 },
            { name: 'Mouse', quantity: 1 },
          ],
        },
        {
          borrowername: 'Ethan Foster',
          course: 'Chemistry',
          date: new Date(),
          subject: 'Inorganic Chemistry',
          equipmentDetails: [
            { name: 'Test Tubes', quantity: 5 },
            { name: 'Bunsen Burner', quantity: 1 },
          ],
        },
        {
          borrowername: 'Fiona Green',
          course: 'Physics',
          date: new Date(),
          subject: 'Quantum Mechanics',
          equipmentDetails: [
            { name: 'Laser Pointer', quantity: 1 },
            { name: 'Prism', quantity: 1 },
          ],
        },
        {
          borrowername: 'George Harris',
          course: 'Biology',
          date: new Date(),
          subject: 'Microbiology',
          equipmentDetails: [
            { name: 'Petri Dishes', quantity: 10 },
            { name: 'Agar', quantity: 5 },
          ],
        },
        {
          borrowername: 'Hannah Irving',
          course: 'Mathematics',
          date: new Date(),
          subject: 'Statistics',
          equipmentDetails: [
            { name: 'Calculator', quantity: 1 },
            { name: 'Ruler', quantity: 1 },
          ],
        },
        {
          borrowername: 'Ian Jackson',
          course: 'Engineering',
          date: new Date(),
          subject: 'Thermodynamics',
          equipmentDetails: [
            { name: 'Thermometer', quantity: 1 },
            { name: 'Heat Gun', quantity: 1 },
          ],
        },
        {
          borrowername: 'Julia King',
          course: 'Computer Science',
          date: new Date(),
          subject: 'Data Structures',
          equipmentDetails: [
            { name: 'Laptop', quantity: 1 },
            { name: 'External Hard Drive', quantity: 1 },
          ],
        },
        {
          borrowername: 'Kevin Lewis',
          course: 'Chemistry',
          date: new Date(),
          subject: 'Physical Chemistry',
          equipmentDetails: [
            { name: 'Spectrometer', quantity: 1 },
            { name: 'Cuvettes', quantity: 5 },
          ],
        },
        {
          borrowername: 'Laura Miller',
          course: 'Physics',
          date: new Date(),
          subject: 'Astrophysics',
          equipmentDetails: [
            { name: 'Telescope', quantity: 1 },
            { name: 'Star Chart', quantity: 1 },
          ],
        },
        {
          borrowername: 'Michael Nelson',
          course: 'Biology',
          date: new Date(),
          subject: 'Ecology',
          equipmentDetails: [
            { name: 'Field Notebook', quantity: 1 },
            { name: 'Binoculars', quantity: 1 },
          ],
        },
        {
          borrowername: 'Nina Owens',
          course: 'Mathematics',
          date: new Date(),
          subject: 'Linear Algebra',
          equipmentDetails: [
            { name: 'Calculator', quantity: 1 },
            { name: 'Textbook', quantity: 1 },
          ],
        },
        {
          borrowername: 'Oscar Perez',
          course: 'Engineering',
          date: new Date(),
          subject: 'Circuits',
          equipmentDetails: [
            { name: 'Multimeter', quantity: 1 },
            { name: 'Breadboard', quantity: 1 },
          ],
        },
        {
          borrowername: 'Paula Quinn',
          course: 'Computer Science',
          date: new Date(),
          subject: 'Operating Systems',
          equipmentDetails: [
            { name: 'Laptop', quantity: 1 },
            { name: 'USB Drive', quantity: 1 },
          ],
        },
        {
          borrowername: 'Quincy Roberts',
          course: 'Chemistry',
          date: new Date(),
          subject: 'Analytical Chemistry',
          equipmentDetails: [
            { name: 'Pipettes', quantity: 5 },
            { name: 'Flasks', quantity: 3 },
          ],
        },
        {
          borrowername: 'Rachel Scott',
          course: 'Physics',
          date: new Date(),
          subject: 'Thermodynamics',
          equipmentDetails: [
            { name: 'Thermometer', quantity: 1 },
            { name: 'Heat Gun', quantity: 1 },
          ],
        },
      ],
    };
  }

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  render() {
    const { searchQuery, borrowers } = this.state;
    const filteredBorrowers = borrowers.filter((borrower) =>
      borrower.borrowername.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <>
        <Box sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1, width: '100%', padding: 0, marginBottom: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            Borrower List
          </Typography>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={this.handleSearchChange}
            sx={{ width: '100%' }}
          />
        </Box>
        <Box sx={{ height: 505, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
          {filteredBorrowers.map((borrower) => (
            <Box key={borrower.borrowername} sx={{ width: '100%' }}>
              <Accountable borrower={borrower} />
            </Box>
          ))}
        </Box>
      </>
    );
  }
}

export default FulfillList;