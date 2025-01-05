import { useEffect, useState } from 'react';
// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import BorrowersReport from './BorrowersReport';
import EquipmentSummary from './EquipmentSummary';
import TotalEquipmentBorrowed from './Cards/TotalEquipmentBorrowed';
import TotalReplacedEquipment from './Cards/TotalReplacedEquipment';
import TotalDamageEquipment from './Cards/TotalDamageEquipment';
import DistinctEquipment from './Cards/DistinctEquipment';
import TotalGrowthBarChart from './TotalGrowthBarChart';


// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  return (
    <>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* <Grid item xs={12} md={6} lg={6} className="total-borrowers">
            <EquipmentSummary />
        </Grid> */}
        {/* row 1 */}        
        <Grid item xs={12} sm={6} md={4} lg={3} className="total-bad-condition" >
          <DistinctEquipment />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} className="total-bad-condition" >
          <TotalEquipmentBorrowed />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} className="total-bad-condition" >
          <TotalReplacedEquipment />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} className="total-bad-condition" >
          <TotalDamageEquipment />
        </Grid>
        
        
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

        {/* row 2 */}
        <Grid item xs={12} md={6} lg={6} className="recent-borrowed">
          <MainCard title="Recent Borrowed Equipment">
            <EquipmentSummary />
          </MainCard>
        </Grid>

        {/* row 4 */}
        <Grid item xs={12} md={6} lg={6} className="borrowers-report" >
          <TotalGrowthBarChart />
        </Grid>
      </Grid>
    </>
  );
}