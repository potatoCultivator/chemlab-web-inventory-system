import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// project import
// import CustomTab from './CustomTab';
import HistoryTable from './HistoryTable';
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

export default function History() {
  return (
    <>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        {/* <Typography variant="h5" className="History-title">History</Typography> */}
      </Grid>
      <Box sx={{ mt: 4 }}> {/* Add margin-top to create space */}
        {/* <CustomTab /> */}
      </Box>
      <MainCard>
          <HistoryTable />
      </MainCard>
    </>
  );
}