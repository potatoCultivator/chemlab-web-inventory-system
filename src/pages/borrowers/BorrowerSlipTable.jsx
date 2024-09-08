import React from 'react';
import { List, Box } from '@mui/material';

// project import
import BorrowerSlip from './BorrowerSlip';

const avatarSX = {
  width: 56,
  height: 56,
  fontSize: '1.5rem'
};

const actionSX = {
  right: 0
};

export default function BorrowerSlipTable() {
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
        <BorrowerSlip />
        <BorrowerSlip />
        <BorrowerSlip />
        <BorrowerSlip />
        <BorrowerSlip />
        <BorrowerSlip />
        <BorrowerSlip />
        <BorrowerSlip />
        <BorrowerSlip />
      </List>
    </Box>
  );
}