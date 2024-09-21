import React from 'react';
import { List, Box } from '@mui/material';
import { useEffect, useState } from 'react';

// project import
import BorrowerSlip from './BorrowerSlip';

//database imports
import { fetchAllBorrowers } from 'pages/TE_Backend';

const avatarSX = {
  width: 56,
  height: 56,
  fontSize: '1.5rem'
};

const actionSX = {
  right: 0
};

export default function BorrowerSlipTable({ status}) {
  const [borrowers, setBorrowers] = useState([]);

  useEffect(() => {
    // Set up the listener and get the unsubscribe function
    const unsubscribe = fetchAllBorrowers(setBorrowers);

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  // Ensure borrowers is defined and is an array before filtering
  const approvedBorrowers = Array.isArray(borrowers) ? borrowers.filter(borrower => borrower.isApproved === status) : [];

  return (
    <Box sx={{ height: '655px', overflowY: 'auto' }}> {/* Set a fixed height and make it scrollable */}
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
          <BorrowerSlip borrower={borrower} key={borrower.id} />
        ))}
      </List>
    </Box>
  );
}