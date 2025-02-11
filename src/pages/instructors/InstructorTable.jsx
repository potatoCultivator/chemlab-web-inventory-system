import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { DeleteOutlined } from '@ant-design/icons';

// project import
import { fetchInstructors, deleteInstructorAcc } from '../Query';

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
  { id: 'subject', numeric: false, disablePadding: false, label: 'Subject' },
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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const unsubscribe = fetchInstructors((data) => {
      setRows(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching instructors:', error);
      setSnackbarMessage('Error fetching instructors. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
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
    setDeleteLoading(true);
    try {
      await deleteInstructorAcc(itemToDelete.id);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setSnackbarMessage('Account successfully deleted');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting instructor:', error);
      setSnackbarMessage(`Failed to delete instructor: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  return (
    <Box height={510}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <InstructorTableHead order={order} orderBy={orderBy} />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy)).map((row) => (
                <TableRow key={row.tracking_no}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.position}</TableCell>
                  <TableCell>{row.subject}</TableCell>
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

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs" // Set the maximum width to extra small
        fullWidth
        sx={{ '& .MuiDialog-paper': { width: '400px', maxWidth: '400px' } }} // Set fixed width
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography >Are you sure you want to delete this instructor?</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            This action cannot be undone, and the instructor will no longer have access to the mobile app if the account is deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Button onClick={handleDeleteCancel} color="primary" sx={{ flexGrow: 1, marginRight: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" sx={{ flexGrow: 1, marginLeft: 1 }} disabled={deleteLoading}>
              {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}