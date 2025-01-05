import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { SearchOutlined, MailOutlined, EyeOutlined, ClearOutlined, EditOutlined } from '@ant-design/icons';
import { Timestamp } from 'firebase/firestore';
import Invoice from './invoice';
import { getInvoices } from 'pages/Query';
import InvoiceForm from './InvoiceForm';

const LiableStudentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewInvoice, setViewInvoice] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [invoices, setInvoices] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);

  useEffect(() => {
    const unsubscribe = getInvoices(
      (data) => setInvoices(data),
      (error) => {
        setSnackbarMessage('Failed to fetch invoices');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    );

    return () => unsubscribe();
  }, []);

  console.log('invoices: ' + invoices.length);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleClearSearch = () => setSearchQuery('');

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setSearchQuery('');
    setSelectedStudent(null);
    setViewInvoice(false);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setViewInvoice(true);
  };

  const handleReturnToTable = () => {
    setViewInvoice(false);
    setSelectedStudent(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSendReminder = (student) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSnackbarMessage('Reminder Sent');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    }, 1000);
  };

  const handleEditStudent = (student) => {
    setStudentToEdit(student);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setStudentToEdit(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const uniqueInvoices = Array.from(new Set(invoices.map(student => student.issueID)))
    .map(id => invoices.find(student => student.issueID === id));

  const filteredData = uniqueInvoices.filter((student) => {
    return (
      student.borrower.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus === 'All' || student.replaced === filterStatus)
    );
  });

  return (
    <Box sx={{ p: 4, backgroundColor: 'transparent', minHeight: '40vh' }}>
      {!viewInvoice && (
        <>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
            Liable Students
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4, color: '#666' }}>
            Manage and track students responsible for damaged, lost, or unreturned laboratory items.
          </Typography>
        </>
      )}

      {!viewInvoice && (
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            variant="outlined"
            placeholder="Search by Name"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <>
                  <IconButton onClick={handleClearSearch}>
                    <ClearOutlined style={{ fontSize: '20px', color: '#f44336' }} />
                  </IconButton>
                  <SearchOutlined style={{ fontSize: '20px', color: '#3f51b5' }} />
                </>
              ),
            }}
            fullWidth
            sx={{ backgroundColor: '#ffffff', borderRadius: 1 , height: 10}}
          />
          <Select
            value={filterStatus}
            onChange={handleFilterChange}
            displayEmpty
            sx={{ width: 150, backgroundColor: '#ffffff', borderRadius: 1 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value={false}>Pending</MenuItem>
            <MenuItem value={true}>Settled</MenuItem>
          </Select>
        </Box>
      )}

      {viewInvoice ? (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'right', mt: 2, mb: 1 }}>
            <Button
              onClick={handleReturnToTable}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  color: 'white',
                },
              }}
            >
              Return to Table
            </Button>
          </Box>
          <Invoice student={selectedStudent} />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1, mb: 4 }} style={{ maxHeight: '510px', overflowY: 'auto' }}>
          <Table aria-label="table" stickyHeader>
            <TableHead sx={{ backgroundColor: '#e0e0e0' }}>
              <TableRow style={{ backgroundColor: '#f5f5f5', position: 'sticky', top: 0, zIndex: 1 }}>
                <TableCell>Borrower</TableCell>
                <TableCell>Borrower ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date Issued</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((student) => (
                <TableRow key={student.issueID}>
                  <TableCell>{student.borrower}</TableCell>
                  <TableCell>{student.studentID}</TableCell>
                  <TableCell>
                    <Chip
                      label={student.replaced === true ? 'Settled' : 'Pending'}
                      color={student.replaced === true ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{formatDate(student.date_issued, false)}</TableCell>
                  <TableCell>{formatDate(student.due_date, false)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(student)}
                        sx={{
                          color: '#2196f3',
                          '&:hover': {
                            color: '#0d47a1',
                          },
                        }}
                      >
                        <EyeOutlined style={{ fontSize: '20px' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEditStudent(student)}
                        sx={{
                          color: '#4caf50',
                          '&:hover': {
                            color: '#2e7d32',
                          },
                        }}
                      >
                        <EditOutlined style={{ fontSize: '20px' }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Borrower</DialogTitle>
          <InvoiceForm invoice={studentToEdit}/>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Feedback */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LiableStudentsPage;