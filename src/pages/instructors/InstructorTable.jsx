import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { DeleteOutlined } from '@ant-design/icons';

// project import
import { fetchInstructors, deleteInstructorAcc } from '../TE_Backend';

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
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'position', numeric: false, disablePadding: false, label: 'Position' },
  { id: 'department', numeric: false, disablePadding: false, label: 'Department' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'delete', numeric: false, disablePadding: false, label: 'Delete' }
];

function InstructorTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={['email', 'department'].includes(headCell.id) ? 'center' : (headCell.id === 'delete' ? 'right' : (headCell.numeric ? 'right' : 'left'))}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

InstructorTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

export default function InstructorTable() {
  const order = 'asc';
  const orderBy = 'name';
  const [rows, setRows] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = fetchInstructors((data) => {
      setRows(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching instructors:', error);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteInstructorAcc(itemToDelete.id);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      console.log(`Instructor with ID ${itemToDelete.id} has been deleted`);
    } catch (error) {
      console.error('Error deleting instructor:', error);
      alert(`Failed to delete instructor: ${error.message}`);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleEditClick = (row) => {
    // Implement the edit functionality here
    console.log('Editing instructor:', row);
  };

  return (
    <Box>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <InstructorTableHead order={order} orderBy={orderBy} />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy)).map((row) => (
                <TableRow key={row.tracking_no}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.position}</TableCell>
                  <TableCell align="center">{row.department}</TableCell>
                  <TableCell align="center">{row.email}</TableCell>
                  <TableCell align="right">
                    <IconButton color="error" size="large" onClick={() => handleDeleteClick(row)}>
                      <DeleteOutlined />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this instructor?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" sx={{ color: 'rgba(255, 0, 0, 0.7)' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function createData(tracking_no, id, name, position, department, email) {
  return { tracking_no, id, name, position, department, email };
}