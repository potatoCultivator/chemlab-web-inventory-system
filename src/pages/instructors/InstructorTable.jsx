import React, { useEffect, useState } from 'react';
import { fetchInstructors } from '../TE_Backend';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

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
  ,
  { 
    id: 'edit_delete',
    numeric: false,
    disablePadding: false,
    label: 'Edit / Delete' 
  }
];

export default function InstructorTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function getInstructors() {
      const data = await fetchInstructors();
      const formattedData = data.map((instructor, index) => 
        createData(index + 1, instructor.name, instructor.position, instructor.department, instructor.email)
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
                align={['email', 'department'].includes(headCell.id) ? 'center' : (headCell.id === 'edit_delete' ? 'right' : (headCell.numeric ? 'right' : 'left'))}
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
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.position}</TableCell>
              <TableCell align="center">{row.department}</TableCell>
              <TableCell align="center">{row.email}</TableCell>
              <TableCell align="right">
                <IconButton color="primary" size="large" onClick={() => handleEditClick(row)}>
                  <EditOutlined />
                </IconButton>
                <IconButton color="error" size="large" onClick={() => handleDeleteClick(row)}>
                  <DeleteOutlined />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}