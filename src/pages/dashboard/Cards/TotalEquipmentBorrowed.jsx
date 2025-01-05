import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { FilterOutlined } from '@ant-design/icons';

// project imports
import MainCard from 'components/MainCard';
// import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// assets
// import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { TableOutlined } from '@ant-design/icons';

import { get_Sched } from '../../Query'

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: '#1E88E5', // Example: new dark blue
  color: '#BBDEFB',          // Example: new light blue
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, #90CAF9 -50.94%, rgba(144, 202, 249, 0) 83.49%)`, // Example gradient
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, #90CAF9 -14.02%, rgba(144, 202, 249, 0) 77.58%)`, // Example gradient
    borderRadius: '50%',
    top: -160,
    right: -130
  }
  }));
  

// ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

const TotalEquipmentBorrowed = ({ isLoading }) => {
  const theme = useTheme();
  const [schedule, setSchedule] = React.useState([]);
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    const handleSuccess = (data) => {
      setSchedule(data);
    };

    const handleError = (error) => {
      console.error('Error fetching schedule: ', error);
    };

    const unsubscribe = get_Sched(handleSuccess, handleError);
    if (typeof unsubscribe !== 'function') {
      console.error('Expected a function for unsubscribe, but got:', typeof unsubscribe);
      return () => {};
    }

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const getTotal = () => {
      let total = 0;
      for (let i = 0; i < schedule.length; i++) {
        for (let j = 0; j < schedule[i].equipments.length; j++) {
          for (let k = 0; k < schedule[i].borrowers.length; k++) {
            if (schedule[i].borrowers[k].status === 'approved' || schedule[i].borrowers[k].status === 'pending return') {
              total += schedule[i].equipments[j].qty;
            }
          }
        }
      }
      setCount(total);
    };

    getTotal();
  }, [schedule]);


  return (
  <>
    {isLoading ? (
    // <TotalIncomeCard />
    <> </>
    ) : (
    <CardWrapper border={false} content={false}>
      <Box sx={{ p: 2 }}>
      <List sx={{ py: 0 }}>
        <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
        <ListItemAvatar>
          <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.largeAvatar,
            bgcolor: '#FFFFFF',
            color: '#1E88E5'
          }}
          >
          <FilterOutlined fontSize="inherit" />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          sx={{ py: 0, my: 0.45 }}
          primary={
          <Typography variant="h4" sx={{ color: '#fff' }}>
            {count}
          </Typography>
          }
          secondary={
          <Typography variant="subtitle2" sx={{ color: '#fff', mt: 0.25 }}>
             Borrowed Equipments
          </Typography>
          }
        />
        </ListItem>
      </List>
      </Box>
    </CardWrapper>
    )}
  </>
  );
};

TotalEquipmentBorrowed.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalEquipmentBorrowed;