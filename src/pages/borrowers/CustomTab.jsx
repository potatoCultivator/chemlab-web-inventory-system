import * as React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Box, Chip, Grid, TextField } from '@mui/material';
import { alpha } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Project Imports
import MainCard from 'components/MainCard';
import BorrowerTable from './BorrowerTable';

// Function
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function CustomTab() {
  const [value, setValue] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        <MainCard>
          <Box>
            <Tabs value={value} onChange={handleChange} TabIndicatorProps={{ style: { backgroundColor: 'black' } }}>
              <Tab
                disableRipple
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'transparent',
                    color: 'inherit',
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: 'inherit',
                  },
                }}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <span style={{ color: value === 0 ? 'black' : theme.palette.secondary.main }}>All</span>
                    <Chip
                      label={10} 
                      size="small"
                      style={{
                        backgroundColor: value === 0 ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.2),
                        color: value === 0 ? 'white' : theme.palette.primary.dark,
                      }}
                    />
                  </Box>
                }
                {...a11yProps(0)}
              />
              <Tab
                disableRipple
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <span style={{ color: value === 1 ? 'black' : theme.palette.secondary.main }}>Borrowed</span>
                    <Chip
                      label={5} 
                      size="small"
                      style={{
                        backgroundColor: value === 1 ? theme.palette.success.main : alpha(theme.palette.success.main, 0.2),
                        color: value === 1 ? 'white' : theme.palette.success.dark,
                      }}
                    />
                  </Box>
                }
                {...a11yProps(1)}
              />
              <Tab
                disableRipple
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <span style={{ color: value === 2 ? 'black' : theme.palette.secondary.main }}>Returned</span>
                    <Chip
                      label={7} 
                      size="small"
                      style={{
                        backgroundColor: value === 2 ? theme.palette.error.main : alpha(theme.palette.error.main, 0.2),
                        color: value === 2 ? 'white' : theme.palette.error.dark,
                      }}
                    />
                  </Box>
                }
                {...a11yProps(2)}
              />
              {!isMobile && (
                <Box sx={{ flexGrow: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginLeft: 'auto' }}>
                  <TextField
                    size="small"
                    placeholder="Search..."
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </Box>
              )}
            </Tabs>
          </Box>
        </MainCard>

        {isMobile && (
          <MainCard>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <TextField
                  size="small"
                  placeholder="Search..."
                  onChange={(e) => handleSearchChange(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </MainCard>
        )}

        <MainCard>
          {searchValue ? (
            <BorrowerTable />
          ) : (
            <>
              <CustomTabPanel value={value} index={0}>
                <BorrowerTable />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <BorrowerTable title={'Replaced Equipments'}/>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <BorrowerTable title={'Damaged Equipments'}/>
              </CustomTabPanel>
            </>
          )}
        </MainCard>
      </Box>
    </Box>
  );
}