// material-ui
import Typography from '@mui/material/Typography';
import Grid from '@mui/system/Unstable_Grid';

// project import
import MainCard from 'components/MainCard';
import HistoryTable from './HistoryTable';

// ==============================|| SAMPLE PAGE ||============================== //

export default function History() {
  return (
    <>
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* row 1 */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography variant="h5" className="dashboard-title">History</Typography>
        </Grid>
        <Grid item xs={12}>
          <HistoryTable />
        </Grid>
      </Grid>
    </>
  );
}
