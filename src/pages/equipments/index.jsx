import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';

// project import
import MainTable from './MainTable';
import MainCard from 'components/MainCard';
import TotalCards from './TotalCard';
import PopularCard from './PopularCard';

// ==============================|| SAMPLE PAGE ||============================== //

export default function Equipments() {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TotalCards />
        </Grid>
        <Grid item xs={12} sm={8}>
          <MainCard title="List of Equipments">
            <MainTable />
          </MainCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <PopularCard />
        </Grid>
      </Grid>
    </>
  );
}