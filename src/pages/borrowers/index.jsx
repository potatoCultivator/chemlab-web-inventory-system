import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
// import CustomTab from './CustomTab';
import BorrowerTable from './BorrowerTable';

// ==============================|| SAMPLE PAGE ||============================== //

export default function Borrowers() {
  return (
    <>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5" className="Borrowers-title">Borrowers</Typography>
      </Grid>
      <Box sx={{ mt: 4 }}> {/* Add margin-top to create space */}
        {/* <CustomTab /> */}
        <BorrowerTable />
      </Box>
    </>
  );
}