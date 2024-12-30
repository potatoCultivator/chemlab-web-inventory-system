import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  Chip,
} from '@mui/material';
import { SearchOutlined, MailOutlined, EyeOutlined, ClearOutlined } from '@ant-design/icons';
import { Timestamp } from 'firebase/firestore';

const LiableStudentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const sampleData = [
    {
      borrower: 'blah blah',
      borrowerID: '0fXKGlajQiKcMzLWjZ7V',
      date_issued: Timestamp.fromDate(new Date('December 30, 2024 at 5:18:39 PM UTC+8')),
      description: 'fdgufdshvjdzbvsdlgvdsyvdsuidsdzhfs',
      due_date: Timestamp.fromDate(new Date('December 30, 2024 at 5:19:43 PM UTC+8')),
      equipments: {
        capacity: '20',
        image: 'https://firebasestorage.googleapis.com/v0/b/chemlabims-d3c76.appspot.com/o/equipments%2Fbeaker.webp?alt=media&token=0e38b1db-2db6-4404-90c8-33c07e52eee5',
        name: 'beaker',
        qty: '5',
        unit: 'ml',
      },
      issue_id: 'bkadfsjfks',
      replaced: false,
      status: 'Pending',
    },
    {
      borrower: 'Jane Smith',
      borrowerID: '2024-002',
      date_issued: Timestamp.fromDate(new Date('November 28, 2024 at 5:18:39 PM UTC+8')),
      description: 'Chemical Solution',
      due_date: Timestamp.fromDate(new Date('November 28, 2024 at 5:19:43 PM UTC+8')),
      equipments: {
        capacity: '500',
        image: 'https://firebasestorage.googleapis.com/v0/b/chemlabims-d3c76.appspot.com/o/equipments%2Fchemical_solution.webp?alt=media&token=0e38b1db-2db6-4404-90c8-33c07e52eee5',
        name: 'chemical solution',
        qty: '2',
        unit: 'ml',
      },
      issue_id: 'bkadfsjfks',
      replaced: true,
      status: 'Settled',
    },
  ];

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleClearSearch = () => setSearchQuery('');

  const handleFilterChange = (e) => setFilterStatus(e.target.value);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
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

  const filteredData = sampleData.filter((student) => {
    return (
      student.borrower.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus === 'All' || student.status === filterStatus)
    );
  });

  return (
    <Box sx={{ p: 4, backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Liable Students
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 4, color: '#666' }}>
        Manage and track students responsible for damaged, lost, or unreturned laboratory items.
      </Typography>

      {/* Search and Filters */}
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
          sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
        />
        <Select
          value={filterStatus}
          onChange={handleFilterChange}
          displayEmpty
          sx={{ width: 150, backgroundColor: '#f9f9f9', borderRadius: 1 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Settled">Settled</MenuItem>
        </Select>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1, mb: 4 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#e0e0e0' }}>
            <TableRow>
              <TableCell>Borrower</TableCell>
              <TableCell>Borrower ID</TableCell>
              <TableCell>Liability</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Issued</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((student) => (
              <TableRow key={student.borrowerID}>
                <TableCell>{student.borrower}</TableCell>
                <TableCell>{student.borrowerID}</TableCell>
                <TableCell>{student.description}</TableCell>
                <TableCell>{student.equipments.qty}</TableCell>
                <TableCell>
                  <Chip
                    label={student.status}
                    color={student.status === 'Settled' ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{student.date_issued.toDate().toLocaleString()}</TableCell>
                <TableCell>{student.due_date.toDate().toLocaleString()}</TableCell>
                <TableCell>
                  <Tooltip title="Send Reminder">
                    <IconButton size="small" onClick={() => handleSendReminder(student)} disabled={loading}>
                      <MailOutlined style={{ fontSize: '20px', color: '#ff9800' }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => handleViewDetails(student)}>
                      <EyeOutlined style={{ fontSize: '20px', color: '#2196f3' }} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Student Details */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold', fontSize: '1.5rem' }}>Liability Details</DialogTitle>
        <DialogContent>
          {selectedStudent ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontSize: '1.25rem' }}>Invoice</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontSize: '1rem' }}><strong>Borrower:</strong> {selectedStudent.borrower}</Typography>
                <Typography variant="body1" sx={{ fontSize: '1rem' }}><strong>Borrower ID:</strong> {selectedStudent.borrowerID}</Typography>
                <Typography variant="body1" sx={{ fontSize: '1rem' }}><strong>Date Issued:</strong> {selectedStudent.date_issued.toDate().toLocaleString()}</Typography>
                <Typography variant="body1" sx={{ fontSize: '1rem' }}><strong>Due Date:</strong> {selectedStudent.due_date.toDate().toLocaleString()}</Typography>
              </Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontSize: '1.25rem' }}>Liability Details</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontSize: '1rem' }}><strong>Liability:</strong> {selectedStudent.description}</Typography>
                <Typography variant="body1" sx={{ fontSize: '1rem' }}><strong>Quantity:</strong> {selectedStudent.equipments.qty}</Typography>
                <Typography variant="body1" sx={{ fontSize: '1rem' }}><strong>Status:</strong> {selectedStudent.status || 'Pending'}</Typography>
                <Typography variant="body1" sx={{ fontSize: '1rem' }}><strong>Amount Due:</strong> {selectedStudent.amountDue || 'N/A'}</Typography>
              </Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontSize: '1.25rem' }}>Equipment Details</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img src={selectedStudent.equipments.image} alt={selectedStudent.equipments.name} style={{ width: 100, height: 100, marginRight: 16, borderRadius: 8 }} />
                <Box>
                  <Typography variant="body1" sx={{ fontSize: '1rem' }}><strong>Name:</strong> {selectedStudent.equipments.name}</Typography>
                  <Typography variant="body1" sx={{ fontSize: '1rem' }}><strong>Capacity:</strong> {selectedStudent.equipments.capacity} {selectedStudent.equipments.unit}</Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#f0f0f0', p: 2 }}>
          <Button onClick={handleDialogClose} sx={{ backgroundColor: '#e0e0e0' }}>Close</Button>
          <Button onClick={() => handleSendReminder(selectedStudent)} color="primary" disabled={loading}>
            Send Reminder
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