import React, { useEffect, useState } from 'react';
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
import { format } from 'date-fns';
import { fetchBorrowers } from 'pages/TE_Backend';

const HistoryTable = () => {
  const [borrowers, setBorrowers] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchBorrowers(setBorrowers);
    return () => unsubscribe;
  }, []);

  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" align="center" sx={{ margin: 2 }}>
        History
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align='center'>Borrower</TableCell>
            <TableCell align='center'>Status</TableCell>
            <TableCell align='center'>Instructor</TableCell>
            <TableCell align='center'>Subject</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {borrowers.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                {
                  row.date && row.date.toDate ? 
                  format(row.date.toDate(), 'yyyy-MM-dd') : 'N/A'
                }
              </TableCell>
              <TableCell align='center'>{row.borrowername}</TableCell>
              <TableCell align='center'>
                {['pending return', 'admin approved'].includes(row.isApproved)
                  ? 'in use'
                  : row.isApproved}
              </TableCell>
              <TableCell align='center'>{row.instructor}</TableCell>
              <TableCell align='center'>{row.subject}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HistoryTable;
