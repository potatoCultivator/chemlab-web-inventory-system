import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

// Sample data for the history
const historyData = [
  {
    id: 1,
    date: '2024-10-28',
    time: '10:00 AM',
    activity: 'Login',
    description: 'User logged in successfully.',
    status: 'Success',
  },
  {
    id: 2,
    date: '2024-10-27',
    time: '02:30 PM',
    activity: 'Update',
    description: 'Updated profile information.',
    status: 'Success',
  },
  // Add more history entries as needed
];

const HistoryTable = () => {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" align="center" sx={{ margin: 2 }}>
        History
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Activity Type</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {historyData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.time}</TableCell>
              <TableCell>{row.activity}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HistoryTable;
