// Import React and Material-UI components
import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// 404 Page Component
export default function PageNotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        color: '#333',
      }}
    >
      <Typography variant="h1" color="error" sx={{ fontWeight: 'bold', fontSize: '6rem' }}>
        404
      </Typography>
      <Typography variant="h5" color="textSecondary" sx={{ mb: 3 }}>
        Sorry, the page you're looking for doesn't exist.
      </Typography>
      <Button variant="outlined" component={Link} to="/" color="primary">
        Go to Homepage
      </Button>
    </Box>
  );
}
