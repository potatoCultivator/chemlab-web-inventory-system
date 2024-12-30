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
} from '@mui/material';
import { SearchOutlined, CheckCircleOutlined, MailOutlined, EyeOutlined, ClearOutlined } from '@ant-design/icons';
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

  const handleMarkAsPaid = (student) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSnackbarMessage('Marked as Paid');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }, 1000);
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
    <Box sx={{ p: 3, backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Liable Students
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 4, color: '#666' }}>
        Manage and track students responsible for damaged, lost, or unreturned laboratory items.
      </Typography>

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
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
                <TableCell>{student.status || 'Pending'}</TableCell>
                <TableCell>{student.date_issued.toDate().toLocaleString()}</TableCell>
                <TableCell>{student.due_date.toDate().toLocaleString()}</TableCell>
                <TableCell>
                  <Tooltip title="Send Reminder">
                    <IconButton size="small" onClick={() => handleSendReminder(student)} disabled={loading}>
                      <MailOutlined style={{ fontSize: '20px', color: '#ff9800' }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Mark as Paid">
                    <IconButton size="small" onClick={() => handleMarkAsPaid(student)} disabled={loading}>
                      <CheckCircleOutlined style={{ fontSize: '20px', color: '#4caf50' }} />
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
        <DialogTitle sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Liability Details</DialogTitle>
        <DialogContent>
          {selectedStudent ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Borrower Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography><strong>Borrower:</strong> {selectedStudent.borrower}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Borrower ID:</strong> {selectedStudent.borrowerID}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Date Issued:</strong> {selectedStudent.date_issued.toDate().toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Due Date:</strong> {selectedStudent.due_date.toDate().toLocaleString()}</Typography>
                </Grid>
              </Grid>
              <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>Liability Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography><strong>Liability:</strong> {selectedStudent.description}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Quantity:</strong> {selectedStudent.equipments.qty}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Status:</strong> {selectedStudent.status || 'Pending'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Amount Due:</strong> {selectedStudent.amountDue || 'N/A'}</Typography>
                </Grid>
              </Grid>
              <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>Equipment Details</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <img src={selectedStudent.equipments.image} alt={selectedStudent.equipments.name} style={{ width: 100, height: 100, marginRight: 16, borderRadius: 8 }} />
                <Box>
                  <Typography><strong>Name:</strong> {selectedStudent.equipments.name}</Typography>
                  <Typography><strong>Capacity:</strong> {selectedStudent.equipments.capacity} {selectedStudent.equipments.unit}</Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#f0f0f0' }}>
          <Button onClick={handleDialogClose} sx={{ backgroundColor: '#e0e0e0' }}>Close</Button>
          <Button onClick={() => handleMarkAsPaid(selectedStudent)} color="success" disabled={loading}>
            Mark as Paid
          </Button>
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