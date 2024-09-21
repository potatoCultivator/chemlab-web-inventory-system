import React, { useEffect, useState } from 'react';
import { fetchInstructors } from '../TE_Backend';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function createData(tracking_no, name, position, department, email) {
  return { tracking_no, name, position, department, email };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { 
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name' 
  },
  { 
    id: 'position',
    numeric: false,
    disablePadding: false,
    label: 'Position' 
  },
  { 
    id: 'department',
    numeric: false,
    disablePadding: false, 
    label: 'Department' 
  },
  { 
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'Email' 
  }
];

export default function InstructorTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function getInstructors() {
      const data = await fetchInstructors();
      const formattedData = data.map((instructor, index) => 
        createData(index + 1, `${instructor.firstname} ${instructor.lastname}`, instructor.position, instructor.department, instructor.email)
      );
      setRows(formattedData);
    }

    getInstructors();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                align={headCell.numeric ? 'right' : 'left'}
                padding={headCell.disablePadding ? 'none' : 'normal'}
              >
                {headCell.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {stableSort(rows, getComparator('asc', 'name')).map((row, index) => (
            <TableRow key={row.tracking_no}>
              {/* <TableCell component="th" scope="row" padding="none">
                {row.tracking_no}
              </TableCell> */}
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.position}</TableCell>
              <TableCell>{row.department}</TableCell>
              <TableCell>{row.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}