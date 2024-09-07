// material-ui
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';
import ToolsAndEquipmentsTable from './ToolsAndEquipmentsTable';
import ProcessTab from './ProcessTab';
import AddItem from './AddItem';
import AddItemDialog from './AddItemDialog';

// ==============================|| SAMPLE PAGE ||============================== //

export default function ToolsAndEquipments() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
    {/* row 1 */}
    <Grid item xs={12} sx={{ mb: -2.25 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Tools and Equipments</Typography>
        <AddItemDialog />
      </Box>
    </Grid>
    <Grid item xs={12}>
      <ProcessTab />
    </Grid>
    <Grid item xs={12}>
      <Button variant="contained" color="primary">
        Add Tool/Equipment
      </Button>
    </Grid>
    <Grid item xs={12} md={7} lg={8}>
      <MainCard sx={{ mt: 2 }} content={false}>
        <ProcessTab />
      </MainCard>
    </Grid>
    <Grid item xs={12} md={5} lg={4}>
        <AddItem />
    </Grid>
    
    <MainCard title="Tools and Equipments">
      <ToolsAndEquipmentsTable />
    </MainCard>
   </Grid>
  );
}
