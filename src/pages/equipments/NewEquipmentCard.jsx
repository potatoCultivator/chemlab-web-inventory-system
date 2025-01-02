import PropTypes from 'prop-types';
import React from 'react';

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
                    <Grid item>
                      <MoreOutlined
                        style={{
                          fontSize: '1.5rem',
                          color: '#90caf9',
                          cursor: 'pointer'
                        }}
                        onClick={handleClick}
                      />
                      <Menu
                        id="menu-equipment-card"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        variant="selectedMenu"
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right'
                        }}
                      >
                        <MenuItem onClick={handleClose}>Today</MenuItem>
                        <MenuItem onClick={handleClose}>This Week</MenuItem>
                        <MenuItem onClick={handleClose}>This Month</MenuItem>
                      </Menu>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ pt: '16px !important' }}>
                  <BajajAreaChartCard />
                </Grid>
                <Grid item xs={12}>
                  {equipments.slice(0, 8).map((equipment, index) => (
                    <React.Fragment key={index}>
                      <Grid container direction="column">
                        <Grid item>
                          <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                              <Typography variant="subtitle1" color="inherit">
                                {equipment.name}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                  <Typography variant="subtitle1" color="inherit">
                                    {equipment.total}
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
              <Button size="small" disableElevation>
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
