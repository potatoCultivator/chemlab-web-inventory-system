import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import CustomTab from './CustomTab';
import MainCard from 'components/MainCard';
import AccountableList from './AccountableList';
import FulfillList from './FulfillList';

// ==============================|| SAMPLE PAGE ||============================== //

export default function Borrowers() {
  return (
    <>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5" className="Borrowers-title">Borrowers</Typography>
      </Grid>
      <Box sx={{ mt: 2 }} />
      <Grid container spacing={2}>
        {/* CustomTab on the left side */}
        <Grid item xs={12} md={8}>
          <CustomTab />
        </Grid>
        {/* Two MainCard components on the right side */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MainCard title={'Fulfillment'}>
                <FulfillList />
              </MainCard>
            </Grid>
            <Grid item xs={12}>
              <MainCard title={'Accountable'}>
                <AccountableList />
              </MainCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}