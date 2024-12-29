import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';

// project import
// import CustomTab from './CustomTab';
import ScheduleTable from './ScheduleTable';
import MainCard from 'components/MainCard';
import AccountableList from './AccountableList';
import FulfillList from './FulfillList';

// ==============================|| SAMPLE PAGE ||============================== //

export default function Borrowers() {
  return (
    <>
      {/* row 1 */}
      {/* <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5" className="Borrowers-title">Borrowers</Typography>
      </Grid>
      <Box sx={{ mt: 2 }} /> */}

      <Grid container rowSpacing={4.5} columnSpacing={1}>
        {/* CustomTab on the left side */}
        <Grid item xs={12} md={6}>
          <MainCard>
            <ScheduleTable />
          </MainCard>
        </Grid>
        {/* Two MainCard components on the right side */}
        <Grid item xs={12} md={3}>
            <Grid item xs={12}>
              <MainCard >
                <FulfillList />
              </MainCard>
            </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid item xs={12}>
              <MainCard >
                <AccountableList />
              </MainCard>
            </Grid>
        </Grid>
      </Grid>
    </>
  );
}