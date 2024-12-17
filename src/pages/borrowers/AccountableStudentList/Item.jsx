import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Box } from '@mui/material';

const Item = ({ onClick, name = '', church, sector }) => {
  return (
    <ListItem
      button
      onClick={onClick}
      sx={{
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.05)', boxShadow: 3 },
        borderRadius: '12px',
        boxShadow: 1,
        width: '100%',
        marginBottom: '10px',
        padding: '10px',
      }}
    >
      <ListItemAvatar sx={{ marginRight: '16px' }}>
        <Avatar sx={{ backgroundColor: '#00796b', color: '#ffffff', width: 56, height: 56, fontSize: '1rem' }}>
          {name.charAt(0)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        sx={{ paddingLeft: '8px' }}
        primary={
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'medium' }}>
            {name}
          </Typography>
        }
        secondary={
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" flexDirection="column">
              <Typography variant="body2" color="textSecondary">
                Sector: {sector}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ minWidth: '120px', textAlign: 'right', fontWeight: 'bold' }}
            >
              {church}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );
};

Item.propTypes = {
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  church: PropTypes.string.isRequired,
  sector: PropTypes.string.isRequired,
};

export default Item;