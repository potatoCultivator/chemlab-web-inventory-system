import React from 'react';
import { List, Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

// project import
import BorrowerSlip from './BorrowerSlip';

// database imports
import { fetchAllBorrowers } from 'pages/TE_Backend';

const avatarSX = {
  width: 56,
  height: 56,
  fontSize: '1.5rem'
};

const actionSX = {
  right: 0
};

export default function BorrowerSlipTable({ status }) {
  const [borrowers, setBorrowers] = useState([]);

  useEffect(() => {
    // Set up the listener and get the unsubscribe function
    const unsubscribe = fetchAllBorrowers(setBorrowers);

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  // Ensure borrowers is defined and is an array before filtering
  const approvedBorrowers = Array.isArray(borrowers) ? borrowers.filter(borrower => borrower.isApproved === status) : [];

  // Define the height based on whether there are approved borrowers or not and if the status is 'admin approved'
  const boxHeight = status === 'admin approved' && approvedBorrowers.length === 0 ? 'auto' : '655px';
  const overflowY = status === 'admin approved' && approvedBorrowers.length === 0 ? 'visible' : 'auto';

  return (
    <Box sx={{ height: boxHeight, overflowY: overflowY }}>
      {approvedBorrowers.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 2 }}>
          No borrower slips found.
        </Typography>
      ) : (
        <List
          component="nav"
          sx={{
            px: 0,
            py: 0,
            '& .MuiListItemButton-root': {
              py: 1.5,
              '& .MuiAvatar-root': avatarSX,
              '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
            }
          }}
        >
          {approvedBorrowers.map(borrower => (
            <BorrowerSlip borrower={borrower} status={status} key={borrower.id} />
          ))}
        </List>
      )}
    </Box>
  );
}