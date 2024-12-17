import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

// project import
import CustomTab from './CustomTab';
import MainCard from 'components/MainCard';
import AccountableList from './AccountableList';
import FulfillList from './FulfillList';

// ==============================|| SAMPLE PAGE ||============================== //

export default function Borrowers() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Borrowers
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* CustomTab on the left side */}
        <Grid item xs={12} md={8}>
          <CustomTab />
        </Grid>
        {/* Two MainCard components on the right side */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <MainCard>
                <Typography variant="h6" gutterBottom>
                  Fulfill List
                </Typography>
                <FulfillList />
              </MainCard>
            </Grid>
            <Grid item xs={12}>
              <MainCard>
                <Typography variant="h6" gutterBottom>
                  Accountable List
                </Typography>
                <AccountableList />
              </MainCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}