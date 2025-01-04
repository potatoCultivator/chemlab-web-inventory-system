import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

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
import { ThunderboltOutlined } from '@ant-design/icons';

import { getTotalDamagedEquipmentQty } from '../../Query';

// styles
const CardWrapper = styled(MainCard)(() => ({
    backgroundColor: '#6A1B9A', // Deep purple
    color: '#EDE7F6',          // Soft lavender
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 210,
      height: 210,
      background: `linear-gradient(210.04deg, #AB47BC -50.94%, rgba(171, 71, 188, 0) 83.49%)`, // Gradient magenta
      borderRadius: '50%',
      top: -30,
      right: -180
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      width: 210,
      height: 210,
      background: `linear-gradient(140.9deg, #AB47BC -14.02%, rgba(171, 71, 188, 0) 77.58%)`, // Gradient magenta
      borderRadius: '50%',
      top: -160,
      right: -130
    }
  }));
  

// ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

const TotalDamageEquipment = ({ isLoading }) => {
  const theme = useTheme();
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    const handleSuccess = (data) => {
      setCount(data);
    };

    const handleError = (error) => {
      console.error('Error fetching damaged equipment counts: ', error);
    };

    const unsubscribe = getTotalDamagedEquipmentQty(handleSuccess, handleError);
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
                      bgcolor: '#CE93D8',
                      color: '#6A1B9A'
                    }}
                  >
                    <ThunderboltOutlined fontSize="inherit" />
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
                      Damage Equipment
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

TotalDamageEquipment.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalDamageEquipment;