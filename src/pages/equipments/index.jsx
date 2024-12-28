import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';

// project import
import MainTable from './MainTable';
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

export default function Equipments() {
  return (
    <>
      {/* row 1 */}
      {/* <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5" className="equipments-title">Equipments</Typography>
      </Grid> */}
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid item xs={12}>
          <MainCard title="List of Equipments">
            <MainTable />
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
}