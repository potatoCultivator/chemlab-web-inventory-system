import * as React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Box, Chip, Grid } from '@mui/material';
import { alpha } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';

// Project Imports
import MainCard from 'components/MainCard';
import ToolsAndEquipmentsTable from './ToolsAndEquipmentsTable';
import ReturnTable from './ReturnTable';
import BorrowTable from './BorrowTable';
import { category } from './constants';
import Search from './Search';
import SummaryTable from './SummaryTable';

import { countRows, fetchBorrowerEquipmentDetails,
  fetchBorrowerEquipmentDetails_Returned  } from 'pages/TE_Backend';

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

export default function ProcessTab({ refresh }) {
  const [value, setValue] = useState(0);
  const [catValue, setCatValue] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [refreshTable, setRefreshTable] = useState(refresh);
  const [returned, setReturned] = useState(0);
  const [borrowed, setBorrowed] = useState(0);
  const [count, setCount] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchRowCount = async () => {
      console.log('ProcessTab re-rendered due to refresh prop change:', refresh);
      setRefreshTable(prev => !prev); 
      try {
        await countRows(setCount); // Pass setCount to countRows
      } catch (error) {
        console.error('Error fetching tools:', error);
      }
    };
    fetchRowCount();
  }, [refresh]);

  useEffect(() => {
    // This effect will run every time the `count` state changes
    console.log('Count state changed:', count);
    // Add any logic needed to handle the count change
  }, [count]);

  useEffect(() => {
    // Automatically switch to 'All' tab when searchValue is empty
    if (!searchValue) {
      setValue(0);
    }
  }, [searchValue]);
  
  useEffect(() => {
    const getEquipmentDetails = async () => {
      try {
        const details_borrowed = await fetchBorrowerEquipmentDetails();
        const details_returned = await fetchBorrowerEquipmentDetails_Returned();
        let cnt = 0;
        let cnt_ret = 0;
        details_returned.forEach((item) => {
          cnt_ret += item.good_quantity;
        });

        details_borrowed.forEach((item) => {
          cnt += item.good_quantity;
        });
        setBorrowed(cnt);
        setReturned(cnt_ret);
        // setRecentBorrowed(details);
      } catch (error) {
        console.error('Error fetching equipment details:', error);
        // setError(error);
      } 
    };
    getEquipmentDetails();
  }, []);

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
                      label={count}
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
                    <span style={{ color: value === 1 ? 'black' : theme.palette.secondary.main }}>returned</span>
                    <Chip
                      label={returned}
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
                    <span style={{ color: value === 2 ? 'black' : theme.palette.secondary.main }}>borrowed</span>
                    <Chip
                      label={borrowed}
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

              {/* Category */}
              {!isMobile && (
                <>
                  <Box sx={{ flexGrow: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginLeft: 'auto' }}>
                    <Search handleSearchChange={handleSearchChange} />
                  </Box>
                  <Box sx={{ flexGrow: 0.01, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <TextField
                      id="standard-select-currency"
                      size="small"
                      select
                      value={catValue}
                      onChange={(e) => setCatValue(e.target.value)}
                      sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.875rem' } }}
                    >
                      {category.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </>
              )}
            </Tabs>
          </Box>
        </MainCard>

        {isMobile && (
          <MainCard>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Search handleSearchChange={handleSearchChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="standard-select-currency"
                  size="small"
                  select
                  value={catValue}
                  onChange={(e) => setCatValue(e.target.value)}
                  sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.875rem' } }}
                  fullWidth
                >
                  {category.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </MainCard>
        )}

        <MainCard>
          {searchValue ? (
            <ToolsAndEquipmentsTable refresh={refreshTable} catValue={catValue} searchValue={searchValue} />
          ) : (
            <>
              <CustomTabPanel value={value} index={0}>
                <ToolsAndEquipmentsTable refresh={refreshTable} catValue={catValue} searchValue={searchValue} />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <SummaryTable status={'returned'}/>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <SummaryTable status={'admin approved'} />
              </CustomTabPanel>
            </>
          )}
        </MainCard>
      </Box>
    </Box>
  );
}