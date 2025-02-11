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

// project imports
import MainCard from 'components/MainCard';
// import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// assets
// import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { SafetyCertificateOutlined } from '@ant-design/icons';

import { getTotalReplacedEquipmentQty } from '../../Query'

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: '#F57C00', // Vibrant orange
    color: '#FFE0B2',          // Soft peach
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 210,
      height: 210,
      background: `linear-gradient(210.04deg, #FFB74D -50.94%, rgba(255, 183, 77, 0) 83.49%)`, // Gradient orange
      borderRadius: '50%',
      top: -30,
      right: -180
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      width: 210,
      height: 210,
      background: `linear-gradient(140.9deg, #FFB74D -14.02%, rgba(255, 183, 77, 0) 77.58%)`, // Gradient orange
      borderRadius: '50%',
      top: -160,
      right: -130
    }
  }));
  

// ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

const TotalReplacedEquipment = ({ isLoading }) => {
  const theme = useTheme();
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    const handleSuccess = (data) => {
      setCount(data);
    };

    const handleError = (error) => {
      console.error('Error fetching damaged equipment counts: ', error);
    };

    const unsubscribe = getTotalReplacedEquipmentQty(handleSuccess, handleError);
    if (typeof unsubscribe !== 'function') {
      console.error('Expected a function for unsubscribe, but got:', typeof unsubscribe);
      return () => {};
    }

    return () => {
      unsubscribe();
    };
  }, []);

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
                      bgcolor: '#E65100',
                      color: '#FFE0B2'
                    }}
                  >
                    <SafetyCertificateOutlined fontSize="inherit" />
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
                        Replaced Equipment
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

TotalReplacedEquipment.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalReplacedEquipment;