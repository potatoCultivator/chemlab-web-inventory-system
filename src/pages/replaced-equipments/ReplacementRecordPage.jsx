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
import { SearchOutlined, EyeOutlined, ClearOutlined } from '@ant-design/icons';
import { getReplacementRecords } from 'pages/Query';  // Assuming function to fetch data

const ReplacementRecordsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewDetails, setViewDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const unsubscribe = getReplacementRecords(
      (data) => setRecords(data),
      (error) => {
        setSnackbarMessage('Failed to fetch replacement records');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleClearSearch = () => setSearchQuery('');

  const handleFilterChange = (e) => setFilterStatus(e.target.value);

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setViewDetails(true);
  };

  const handleReturnToTable = () => {
    setViewDetails(false);
    setSelectedRecord(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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

  const filteredRecords = records.filter((record) => {
    return (
      record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus === 'All' || record.status === filterStatus)
    );
  });

  return (
    <Box sx={{ p: 4, backgroundColor: 'transparent', minHeight: '100vh' }}>
      {!viewDetails && (
        <>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
            Replacement/Compensation Records
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4, color: '#666' }}>
            Manage and track student replacement or compensation records for lost, damaged, or unreturned items.
          </Typography>
        </>
      )}

      {!viewDetails && (
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
            <MenuItem value="Resolved">Resolved</MenuItem>
            <MenuItem value="Compensated">Compensated</MenuItem>
          </Select>
        </Box>
      )}

      {viewDetails ? (
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
          {/* Render detailed replacement/compensation view here */}
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1, mb: 4 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#e0e0e0' }}>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Replacement Type</TableCell>
                <TableCell>Date of Replacement</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.studentName}</TableCell>
                  <TableCell>{record.itemName}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.status}
                      color={record.status === 'Compensated' ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{record.replacementType}</TableCell>
                  <TableCell>{formatDate(record.dateOfReplacement)}</TableCell>
                  <TableCell>{formatDate(record.dueDate)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(record)}
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

export default ReplacementRecordsPage;
