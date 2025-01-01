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
} from '@mui/material';
import { SearchOutlined, MailOutlined, EyeOutlined, ClearOutlined } from '@ant-design/icons';
import { Timestamp } from 'firebase/firestore';
import Invoice from './invoice';
import { getInvoices } from 'pages/Query';

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

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleClearSearch = () => setSearchQuery('');

  const handleFilterChange = (e) => setFilterStatus(e.target.value);

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

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      // hour: 'numeric',
      // minute: 'numeric',
      // hour12: true,
    });
  };

  const filteredData = invoices.filter((student) => {
    return (
      student.borrower.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus === 'All' || student.status === filterStatus)
    );
  });

  return (
    <Box sx={{ p: 4, backgroundColor: 'transparent', minHeight: '100vh' }}>
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
            placeholder="Search by Name or ID"
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
            sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
          />
          <Select
            value={filterStatus}
            onChange={handleFilterChange}
            displayEmpty
            sx={{ width: 150, backgroundColor: '#ffffff', borderRadius: 1 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Settled">Settled</MenuItem>
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
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1, mb: 4 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#e0e0e0' }}>
              <TableRow>
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
                <TableRow key={student.borrowerID}>
                  <TableCell>{student.borrower}</TableCell>
                  <TableCell>{student.studentID}</TableCell>
                  <TableCell>
                    <Chip
                      label={student.replaced === true ? 'Settled' : 'Pending'}
                      color={student.replaced === true ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{formatDate(student.dateIssued, false)}</TableCell>
                  <TableCell>{formatDate(student.dueDate, false)}</TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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