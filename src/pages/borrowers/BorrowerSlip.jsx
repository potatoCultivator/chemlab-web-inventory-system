import React from 'react';
import { ListItem, ListItemText, ListItemAvatar, Avatar, List } from '@mui/material';

const BorrowerSlip = ({ borrower }) => {
  if (!borrower) {
    return null; // Handle the case where borrower is undefined
  }

  return (
    <ListItem button>
      <ListItemAvatar>
        <Avatar>{borrower.borrowername.charAt(0)}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={borrower.borrowername}
        secondary={`Course: ${borrower.course}, Instructor: ${borrower.instructor}, Date: ${borrower.date.toDate().toLocaleString()}`}
      />
      <List>
        {borrower.equipmentDetails.map((equipment, eqIndex) => (
          <ListItem key={eqIndex}>
            <ListItemText
              primary={equipment.name}
              secondary={`Capacity: ${equipment.capacity} ${equipment.unit}, Current Quantity: ${equipment.current_quantity}`}
            />
          </ListItem>
        ))}
      </List>
    </ListItem>
  );
};

export default BorrowerSlip;