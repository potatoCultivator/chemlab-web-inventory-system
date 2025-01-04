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
import { TagsOutlined } from '@ant-design/icons';
import { getEquipmentsCounts } from '../../Query'

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: '#6D4C41', // Warm brown
    color: '#D7CCC8',          // Light taupe
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 210,
      height: 210,
      background: `linear-gradient(210.04deg, #A1887F -50.94%, rgba(193, 161, 143, 0) 83.49%)`, // Gradient brown
      borderRadius: '50%',
      top: -30,
      right: -180
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      width: 210,
      height: 210,
      background: `linear-gradient(140.9deg, #A1887F -14.02%, rgba(193, 161, 143, 0) 77.58%)`, // Gradient brown
      borderRadius: '50%',
      top: -160,
      right: -130
    }
  }));
  

// ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

const DistinctEquipment = ({ isLoading }) => {
  const theme = useTheme();
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    const handleSuccess = (data) => {
      setCount(data.totalEquipments); // Assuming you want to display totalEquipments
    };

    const handleError = (error) => {
      console.error("Error fetching equipment counts: ", error);
    };

    const unsubscribe = getEquipmentsCounts(handleSuccess, handleError);

    // Cleanup function to unsubscribe from the snapshot listener when the component unmounts
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
                      bgcolor: '#B87333',
                      color: '#6D4C41'
                    }}
                  >
                    <TagsOutlined fontSize="inherit" />
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
                      Distinct Equipments
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

DistinctEquipment.propTypes = {
  isLoading: PropTypes.bool
};

export default DistinctEquipment;