import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  Paper,
} from '@mui/material';
import { SearchOutlined, EyeOutlined, ClearOutlined } from '@ant-design/icons';
import { getInvoices } from 'pages/Query'; // Assuming function to fetch data

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
    const unsubscribe = getInvoices(
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
      (record.borrower && record.borrower.toLowerCase().includes(searchQuery.toLowerCase())) &&
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
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: 1,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Select
            value={filterStatus}
            onChange={handleFilterChange}
            displayEmpty
            sx={{
              width: 150,
              backgroundColor: '#ffffff',
              borderRadius: 1,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
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
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              Return to List
            </Button>
          </Box>
          {/* Render detailed replacement/compensation view here */}
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 2,
            pt: 2,
          }}
        >
          {filteredRecords.map((record) => (
            <Card
              key={record.id}
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-5px)',
                  transition: 'all 0.3s ease',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {record.borrower}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Item: {record.equipments[0].name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Replacement Type: {record.replacement}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Date of Replacement: {formatDate(record.dateOfReplacement)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Due Date: {formatDate(record.dueDate)}
                </Typography>
                <Chip
                  label={record.status}
                  color={record.status === 'Compensated' ? 'success' : 'warning'}
                  variant="filled"
                  sx={{
                    mt: 2,
                    fontWeight: 'bold',
                    backgroundColor: record.status === 'Compensated' ? '#4caf50' : '#ff9800',
                    color: 'white',
                  }}
                />
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Tooltip title="View Details">
                  <IconButton
                    size="small"
                    onClick={() => handleViewDetails(record)}
                    sx={{
                      color: '#2196f3',
                      '&:hover': {
                        color: '#0d47a1',
                        transform: 'scale(1.1)',
                        transition: 'all 0.3s ease',
                      },
                    }}
                  >
                    <EyeOutlined style={{ fontSize: '20px' }} />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          ))}
        </Box>
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
