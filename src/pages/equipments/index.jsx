import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

// project import
import CustomTab from './CustomTab';

// ==============================|| SAMPLE PAGE ||============================== //

export default function Equipments() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5" className="equipments-title">Equipments</Typography>
      </Grid>
      <Box sx={{ mt: 4 }}> {/* Add margin-top to create space */}
        <CustomTab />
      </Box>
    </Container>
  );
}