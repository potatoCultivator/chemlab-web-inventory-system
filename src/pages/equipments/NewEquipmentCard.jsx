import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard'; // Replace with a chart component showing inventory trends.
import MainCard from 'components/MainCard';

import { fetchDeletedAndNotDeletedEquipments } from 'pages/Query';

// ant design icons
import { RightOutlined, MoreOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { Box } from '@mui/system';

// ==============================|| CHEMISTRY LAB - EQUIPMENT CARD ||============================== //

const ChemistryLabInventoryCard = ({ isLoading }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [equipments, setEquipments] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = () => {
      fetchDeletedAndNotDeletedEquipments(
        (response) => {
          setEquipments(response);
        },
        (error) => {
          console.error('Error fetching equipments:', error);
        }
      );
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleViewAllClick = () => {
    navigate('/history');
  };

  const sortedEquipments = equipments.sort((a, b) => {
    const dateA = a.deleted ? a.dateDeleted.toDate() : a.dateAdded.toDate();
    const dateB = b.deleted ? b.dateDeleted.toDate() : b.dateAdded.toDate();
    return dateB - dateA; // Sort in descending order
  });

  return (
    <>
      {isLoading ? (
        // <SkeletonPopularCard />
        <> </>
      ) : (
        <MainCard content={false}>
          <Box sx={{ height: 855 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container alignContent="center" justifyContent="space-between">
                    <Grid item>
                      <Typography variant="h4">Chemistry Lab Equipment</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ pt: '16px !important' }}>
                  <BajajAreaChartCard />
                </Grid>
                <Grid item xs={12}>
                  {sortedEquipments.slice(0, 8).map((equipment, index) => (
                    <React.Fragment key={index}>
                      <Grid container direction="column">
                        <Grid item>
                          <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                              <Typography variant="subtitle1" color="inherit">
                                {equipment.name}{' '}
                                {equipment.unit !== 'pcs' && `${equipment.capacity}${equipment.unit}`}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                  <Typography variant="subtitle1" color="inherit">
                                    {equipment.deleted
                                      ? equipment.dateDeleted.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                      : equipment.dateAdded.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Avatar
                                    variant="rounded"
                                    sx={{
                                      width: 16,
                                      height: 16,
                                      borderRadius: '5px',
                                      bgcolor: equipment.deleted ? '#FFA500' : 'success.light',
                                      color: equipment.deleted ? '#E65100' : 'success.dark',
                                      ml: 2
                                    }}
                                  >
                                    {equipment.deleted ? (
                                      <DownOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />
                                    ) : (
                                      <UpOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />
                                    )}
                                  </Avatar>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Typography variant="subtitle2" sx={{ color: equipment.deleted ? '#E65100' : 'success.dark' }}>
                            {equipment.deleted ? `Deleted` : `Added`}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Divider sx={{ my: 1.5 }} />
                    </React.Fragment>
                  ))}
                </Grid>
              </Grid>
            </CardContent>
            <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
              <Button size="small" disableElevation onClick={handleViewAllClick}>
                View All
                <RightOutlined style={{ fontSize: '1rem', marginLeft: 8 }} />
              </Button>
            </CardActions>
          </Box>
        </MainCard>
      )}
    </>
  );
};

ChemistryLabInventoryCard.propTypes = {
  isLoading: PropTypes.bool
};

export default ChemistryLabInventoryCard;
