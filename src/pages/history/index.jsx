import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// project import
// import CustomTab from './CustomTab';
import HistoryTable from './HistoryTable';
import MainCard from 'components/MainCard';
import AddedStockHistory from './AddedStockHistory';

// ==============================|| SAMPLE PAGE ||============================== //

export default function History() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <MainCard title="Borrowers">
          <HistoryTable />
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <MainCard title="Added Stocks">
          <AddedStockHistory />
        </MainCard>
      </Grid>
    </Grid>
  );
}