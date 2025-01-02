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

// project imports
import BajajAreaChartCard from './BajajAreaChartCard'; // Replace with a chart component showing inventory trends.
import MainCard from 'components/MainCard';

// ant design icons
import { RightOutlined, MoreOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';

// ==============================|| CHEMISTRY LAB - EQUIPMENT CARD ||============================== //

const ChemistryLabInventoryCard = ({ isLoading }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

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
                <Grid container direction="column">
                  <Grid item>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Bunsen Burner
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              5 Units
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '5px',
                                bgcolor: 'success.light',
                                color: 'success.dark',
                                ml: 2
                              }}
                            >
                              <UpOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                      Restocked by 2 Units
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                {/* <Grid container direction="column">
                  <Grid item>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Laboratory Glassware (Beakers, Flasks)
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              12 Pieces
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '5px',
                                bgcolor: 'orange.light',
                                color: 'orange.dark',
                                marginLeft: 1.875
                              }}
                            >
                              <DownOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" sx={{ color: 'orange.dark' }}>
                      Decreased by 4 Pieces
                    </Typography>
                  </Grid>
                </Grid> */}
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Test Tubes
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              30 Pieces
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '5px',
                                bgcolor: 'success.light',
                                color: 'success.dark',
                                ml: 2
                              }}
                            >
                              <UpOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                      Restocked by 10 Pieces
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Pipettes
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              15 Pieces
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '5px',
                                bgcolor: 'orange.light',
                                color: 'orange.dark',
                                marginLeft: 1.875
                              }}
                            >
                              <DownOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" sx={{ color: 'orange.dark' }}>
                      Decreased by 5 Pieces
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Safety Goggles
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              20 Pieces
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '5px',
                                bgcolor: 'success.light',
                                color: 'success.dark',
                                ml: 2
                              }}
                            >
                              <UpOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                      Restocked by 5 Pieces
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          pH Meter
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              3 Units
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '5px',
                                bgcolor: 'success.light',
                                color: 'success.dark',
                                ml: 2
                              }}
                            >
                              <UpOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                      Restocked by 1 Unit
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Thermometer
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              10 Units
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '5px',
                                bgcolor: 'orange.light',
                                color: 'orange.dark',
                                marginLeft: 1.875
                              }}
                            >
                              <DownOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" sx={{ color: 'orange.dark' }}>
                      Decreased by 2 Units
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Weighing Scale
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              2 Units
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '5px',
                                bgcolor: 'success.light',
                                color: 'success.dark',
                                ml: 2
                              }}
                            >
                              <UpOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                      Restocked by 1 Unit
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Microscope
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              4 Units
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '5px',
                                bgcolor: 'orange.light',
                                color: 'orange.dark',
                                marginLeft: 1.875
                              }}
                            >
                              <DownOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" sx={{ color: 'orange.dark' }}>
                      Decreased by 1 Unit
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation>
              View All
              <RightOutlined style={{ fontSize: '1rem', marginLeft: 8 }} />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
};

ChemistryLabInventoryCard.propTypes = {
  isLoading: PropTypes.bool
};

export default ChemistryLabInventoryCard;
