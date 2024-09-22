import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project import
import BorrowersChart from './BorrowersChart';

// sales report status
const status = [
  {
    value: 'week',
    label: 'This Week'
  },
  {
    value: 'month',
    label: 'This Month'
  }
];

// ==============================|| DEFAULT - SALES REPORT ||============================== //

export default function BorrowersReport() {
  const [value, setValue] = useState('week');

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Borrowers Report</Typography>
        </Grid>
        <Grid item>
          <TextField
            id="standard-select-currency"
            size="small"
            select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.875rem' } }}
          >
            {status.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <BorrowersChart />
    </>
  );
}
