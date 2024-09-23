import React, { useState, useEffect } from 'react';
// material-ui
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';
import ToolsAndEquipmentsTable from './ToolsAndEquipmentsTable';
import ProcessTab from './ProcessTab';
import AddItemDialog from './AddItemDialog';

// ==============================|| SAMPLE PAGE ||============================== //

export default function ToolsAndEquipments() {
  const [refreshProcessTab, setRefreshProcessTab] = useState(false);

  useEffect(() => {
    document.title = "Tools and Equipments • ChemLab ";
  }, []);

  const handleRefreshProcessTab = () => {
    console.log('Toggling refreshProcessTab state');
    setRefreshProcessTab(prev => !prev);
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Tools and Equipment</Typography>
          <AddItemDialog onDone={handleRefreshProcessTab} />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <ProcessTab refresh={refreshProcessTab} />
      </Grid>
    </Grid>
  );
}