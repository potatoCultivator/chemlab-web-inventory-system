import React, { useEffect } from 'react';
// material-ui
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';
import BorrowerSlipTable from './BorrowerSlipTable';

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
          <BorrowerSlipTable status={'approved_admin'}/>
        </MainCard>
      </Grid>
      
    </Grid>
  );
}