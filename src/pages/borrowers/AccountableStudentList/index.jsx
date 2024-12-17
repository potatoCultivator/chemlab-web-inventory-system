import React, { useState } from 'react';
import { Divider, Tooltip, Zoom, Box, TextField } from '@mui/material';
import CustomDialog from './CustomDialog';
import LoadingDialog from './LoadingDialog';
import RejectDialog from './RejectDialog';
import Item from './Item';

const initialRegistrants = [
  { name: 'John Doe', age: 25, gender: 'Male', church: 'Grace Fellowship', sector: 'Sector 1', team: 'Alpha', representative: 'Alice Johnson' },
  { name: 'Jane Smith', age: 30, gender: 'Female', church: 'Faith Community', sector: 'Sector 2', team: 'Beta', representative: 'Bob Brown' },
  { name: 'Michael Brown', age: 22, gender: 'Male', church: 'Life Church', sector: 'Sector 3', team: 'Alpha', representative: 'Charlie Davis' },
  { name: 'Emily Davis', age: 28, gender: 'Female', church: 'Hope Chapel', sector: 'Sector 4', team: 'Gamma', representative: 'Diana Evans' },
  { name: 'Chris Johnson', age: 35, gender: 'Male', church: 'Faith Community', sector: 'Sector 5', team: 'Delta', representative: 'Ethan Foster' },
  { name: 'Anna Wilson', age: 27, gender: 'Female', church: 'Grace Fellowship', sector: 'Sector 6', team: 'Alpha', representative: 'Fiona Green' },
  { name: 'James Taylor', age: 24, gender: 'Male', church: 'Life Church', sector: 'Sector 7', team: 'Gamma', representative: 'George Harris' },
  { name: 'Laura Lee', age: 29, gender: 'Female', church: 'Hope Chapel', sector: 'Sector 8', team: 'Beta', representative: 'Hannah White' },
  { name: 'David Miller', age: 32, gender: 'Male', church: 'Grace Fellowship', sector: 'Sector 9', team: 'Delta', representative: 'Ivy King' },
  { name: 'Sophia Anderson', age: 26, gender: 'Female', church: 'Faith Community', sector: 'Sector 10', team: 'Alpha', representative: 'Jack Lee' },
  { name: 'William Johnson', age: 31, gender: 'Male', church: 'Grace Fellowship', sector: 'Sector 11', team: 'Alpha', representative: 'Karen Smith' },
  { name: 'Olivia Brown', age: 23, gender: 'Female', church: 'Faith Community', sector: 'Sector 12', team: 'Beta', representative: 'Liam Johnson' },
  { name: 'Noah Davis', age: 21, gender: 'Male', church: 'Life Church', sector: 'Sector 13', team: 'Alpha', representative: 'Mia Brown' },
  { name: 'Emma Wilson', age: 28, gender: 'Female', church: 'Hope Chapel', sector: 'Sector 14', team: 'Gamma', representative: 'Nathan Davis' },
  { name: 'Liam Taylor', age: 34, gender: 'Male', church: 'Faith Community', sector: 'Sector 15', team: 'Delta', representative: 'Olivia Wilson' },
  { name: 'Ava Lee', age: 22, gender: 'Female', church: 'Grace Fellowship', sector: 'Sector 16', team: 'Alpha', representative: 'Sophia Taylor' },
  { name: 'Isabella Miller', age: 27, gender: 'Female', church: 'Life Church', sector: 'Sector 17', team: 'Gamma', representative: 'James Lee' },
  { name: 'Mason Anderson', age: 33, gender: 'Male', church: 'Hope Chapel', sector: 'Sector 18', team: 'Beta', representative: 'Emily Miller' },
  { name: 'Lucas Johnson', age: 25, gender: 'Male', church: 'Grace Fellowship', sector: 'Sector 19', team: 'Delta', representative: 'Michael Anderson' },
  { name: 'Amelia Smith', age: 29, gender: 'Female', church: 'Faith Community', sector: 'Sector 20', team: 'Alpha', representative: 'David Johnson' },
];

const AccountableStudents = () => {
  const [dialogState, setDialogState] = useState({ main: false, loading: false, reject: false });
  const [selectedRegistrant, setSelectedRegistrant] = useState({ name: '', church: '', sector: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDialog = (dialogType, value, registrant = {}) => {
    setDialogState((prevState) => ({ ...prevState, [dialogType]: value }));
    if (value && registrant.name) {
      setSelectedRegistrant(registrant);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredRegistrants = initialRegistrants.filter((registrant) =>
    registrant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    registrant.church.toLowerCase().includes(searchQuery.toLowerCase()) ||
    registrant.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const items = filteredRegistrants.map((registrant, index) => (
    <React.Fragment key={index}>
      <Tooltip title="Click to view details" arrow TransitionComponent={Zoom} placement="right">
        <Item
          onClick={() => toggleDialog('main', true, registrant)}
          name={registrant.name}
          church={registrant.church}
          sector={registrant.sector}
        />
      </Tooltip>
      <Divider sx={{ backgroundColor: 'transparent', borderColor: 'transparent' }} />
    </React.Fragment>
  ));

  return (
    <>
      <Box sx={{ height: 605, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
        <Box sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1, width: '100%', padding: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ marginBottom: 2, width: '100%' }}
          />
        </Box>
        {items}
      </Box>
      <CustomDialog
        open={dialogState.main}
        onClose={() => toggleDialog('main', false)}
        name={selectedRegistrant.name}
        church={selectedRegistrant.church}
        sector={selectedRegistrant.sector}
      />
      <LoadingDialog open={dialogState.loading} />
      <RejectDialog open={dialogState.reject} onClose={() => toggleDialog('reject', false)} />
    </>
  );
};

export default AccountableStudents;