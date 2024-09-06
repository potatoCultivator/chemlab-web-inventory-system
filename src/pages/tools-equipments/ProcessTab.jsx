import * as React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Box, Chip } from '@mui/material';
import { alpha } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';

// Project Imports
import MainCard from 'components/MainCard';
import ToolsAndEquipmentsTable from './ToolsAndEquipmentsTable';
import { category } from './constant';

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

export default function SortingTab() {
  const [value, setValue] = useState(0);
  const [catValue, setCatValue] = useState('all');
  const [returned, setReturned] = useState(0);
  const [borrowed, setRorrowed] = useState(0);
  const theme = useTheme();

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
                      label={returned + borrowed}
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
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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
            </Tabs>
          </Box>
        </MainCard>
        <MainCard>
          <CustomTabPanel value={value} index={0}>
            <ToolsAndEquipmentsTable catValue={catValue}/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <ToolsAndEquipmentsTable />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <ToolsAndEquipmentsTable />
          </CustomTabPanel>
        </MainCard>
      </Box>
    </Box>
  );
}