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

export default function BorrowerSlipTable() {
  const [borrowers, setBorrowers] = useState([]);

  useEffect(() => {
    const fetchBorrowers = async () => {
      const res = await fetchAllBorrowers();
      console.log(res);
      setBorrowers(res);
    };
    fetchBorrowers();
  }, []);
    

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
        {borrowers.map((borrower) => (
          <BorrowerSlip  borrower={borrower} />
        ))}
      </List>
    </Box>
  );
}