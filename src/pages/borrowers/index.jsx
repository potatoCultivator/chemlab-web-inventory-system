import React, { useEffect } from 'react';
// material-ui
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// project import
import MainCard from 'components/MainCard';
import BorrowerSlipTable from './BorrowerSlipTable';
// import Button from 'themes/overrides/Button';

// ==============================|| SAMPLE PAGE ||============================== //

export default function Borrowers() {
  useEffect(() => {
    document.title = "Borrowers • ChemLab ";
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Borrowers</Typography>
          <Button variant='outlined' color='primary'>History</Button>
        </Box>
      </Grid>

      {/* row 2 */}
      <Grid item xs={12} sm={6}>
        <MainCard title='To Borrow'>
          <BorrowerSlipTable status={'approved'}/>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={6}>
        <MainCard title='To Return'>
          <BorrowerSlipTable status={'pending return'}/>
        </MainCard>
      </Grid>
      
    </Grid>
  );
}