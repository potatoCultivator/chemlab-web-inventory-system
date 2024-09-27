import { useEffect, useState } from 'react';
// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// react-joyride
import Joyride from 'react-joyride';

// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import SummaryTable from './SummaryTable';
import BorrowersReport from './BorrowersReport';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [run, setRun] = useState(true);

  const steps = [
    {
      target: '.dashboard-title',
      content: 'This is the dashboard title. It provides an overview of the system.',
      placement: 'bottom'
    },
    {
      target: '.total-borrowed',
      content: 'This displays the total number of borrowed tools/equipment in the system.',
      placement: 'top'
    },
    {
      target: '.total-returned',
      content: 'Here you can see how many tools or equipment have been returned.',
      placement: 'top'
    },
    {
      target: '.total-good-condition',
      content: 'This shows the total number of tools or equipment in good condition.',
      placement: 'top'
    },
    {
      target: '.total-bad-condition',
      content: 'This displays the total number of tools or equipment in bad condition.',
      placement: 'top'
    },
    {
      target: '.recent-borrowed',
      content: 'This section displays the recently borrowed tools/equipment.',
      placement: 'top'
    },
    {
      target: '.summary-table',
      content: 'This table summarizes the borrowed tools/equipment.',
      placement: 'top'
    },
    {
      target: '.borrowers-report',
      content: 'This section provides a detailed report of all borrowers.',
      placement: 'top'
    }
    ,
    {
      target: '.sample',
      content: 'Sample',
      placement: 'bottom'
    }
  ];

  // useEffect(() => {
  //   document.title = "ChemLab IMS";
  //   // Delay the tour start to ensure all elements are rendered
  //   const timer = setTimeout(() => setRun(true), 1000); // Increased delay
  //   return () => clearTimeout(timer); // Cleanup on component unmount
  // }, []);

  useEffect(() => {
    document.title = "ChemLab IMS";
    // Delay the tour start to ensure all elements are rendered
    setTimeout(() => setRun(true), 500); // 500ms delay
  }, []);
  

  return (
    <>
      {/* Joyride Tour */}
      <Joyride
  steps={steps}
  run={run}
  continuous
  showProgress
  showSkipButton
  disableOverlay={false} // Enable overlay to focus attention on steps
  styles={{
    options: {
      zIndex: 10000,
      primaryColor: '#007bff', // Change the primary color of the tooltip
      textColor: '#fff', // Change text color in the tooltip
      beaconSize: 20, // Change the size of the beacon
      arrowColor: '#007bff', // Change arrow color
      backgroundColor: '#333', // Change tooltip background color
      overlayColor: 'rgba(0, 0, 0, 0.7)', // Change overlay color
      spotlightBorders: true, // Enable borders on the spotlight
      borderRadius: 8, // Change tooltip border radius
    },
    tooltip: {
      padding: '15px', // Adjust padding in the tooltip
      fontSize: '16px', // Change font size
    },
    buttonClose: {
      display: 'none', // Hide the close button if not needed
    },
  }}
/>

      
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* row 1 */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography variant="h5" className="dashboard-title">Dashboard</Typography>
        </Grid>
        
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={4} lg={3} className="total-borrowed">
          <AnalyticEcommerce 
            title="Total Borrowed Tools/Equipments" 
            count="30" 
            className="total-borrowed" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} className="total-returned">
          <AnalyticEcommerce 
            title="Total Returned Tools/Equipments" 
            count="49" 
            className="total-returned" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} className="total-good-condition">
          <AnalyticEcommerce 
            title="Total Good Condition Tools/Equipments" 
            count="300" 
            className="total-good-condition" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} className="total-bad-condition" >
          <AnalyticEcommerce 
            title="Total Bad Condition Tools/Equipments" 
            count="4" 
            className="total-bad-condition" 
          />
        </Grid>

        {/* row 2 */}
        <Grid item xs={12} md={6} lg={6} className="recent-borrowed">
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5" className="recent-borrowed">
                Recent Borrowed Tools/Equipments
              </Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            <SummaryTable />
          </MainCard>
        </Grid>

        {/* row 4 */}
        <Grid item xs={12} md={6} lg={6} className="borrowers-report" >
          <BorrowersReport className="borrowers-report" />
        </Grid>
      </Grid>
    </>
  );
}