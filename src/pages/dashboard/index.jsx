import { useEffect, useState } from 'react';
// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import ToolAnalytics from 'components/cards/statistics/ToolAnalytics';
import SummaryTable from './SummaryTable';
import BorrowersReport from './BorrowersReport';

// Firebase
import { 
        fetchAdminApprovedBorrowersCount, 
        addAdminApprovedBorrowersListener,
        fetchBorrowerEquipmentDetails,
        fetchBorrowerEquipmentDetails_Returned,
        fetchChartData } from '../TE_Backend';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [run, setRun] = useState(true);
  const [borrowersCount, setBorrowersCount] = useState(0);
  const [ recentBorrowed, setRecentBorrowed ] = useState(0);
  const [ returnedEquipment, setReturnedEquipment ] = useState([]);

  const [borrowedData, setBorrowedData] = useState([]);
  const [returnedData, setReturnedData] = useState([]);

  useEffect(() => {
    const unsubscribeBorrowed = fetchChartData((data) => {
      setBorrowedData(data);
      setLoading(false);
    }, 'borrowed');
    
    const unsubscribeReturned = fetchChartData((data) => {
      setReturnedData(data);
      setLoading(false);
    }, 'returned');

    return () => {
      if (typeof unsubscribeBorrowed === 'function') unsubscribeBorrowed();
      if (typeof unsubscribeReturned === 'function') unsubscribeReturned();
    };
  }, []);

  const processData = (data) => {
    let count = 0;

    data.forEach(item => {
      count += item.count;
    })
    
    return count;
  }

  useEffect(() => {
    const getCount = async () => {
      try {
        const count = await fetchAdminApprovedBorrowersCount();
        console.log(count);
        setBorrowersCount(count);
      } catch (error) {
        console.error(error);
      }
    };
    getCount();

    const unsubscribe = addAdminApprovedBorrowersListener((count) => {
      setBorrowersCount(count);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getEquipmentDetails = async () => {
      try {
        const details = await fetchBorrowerEquipmentDetails();
        let cnt = 0;
        details.forEach((item) => {
          cnt = cnt + item.good_quantity;
        });
        setRecentBorrowed(cnt);
        // setRecentBorrowed(details);
      } catch (error) {
        console.error('Error fetching equipment details:', error);
        // setError(error);
      } 
    };
    getEquipmentDetails();
  }, []);

  useEffect(() => {
    const getEquipmentDetails = async () => {
      try {
        const details = await fetchBorrowerEquipmentDetails_Returned();
        setReturnedEquipment(details);
      } catch (error) {
        console.error('Error fetching equipment details:', error);
        // setError(error);
      } 
    }
    getEquipmentDetails();
  }, []);

  console.log("record count:" + recentBorrowed.length);
  console.log(recentBorrowed);

  useEffect(() => {
    document.title = "ChemLab IMS";
    // Delay the tour start to ensure all elements are rendered
    setTimeout(() => setRun(true), 500); // 500ms delay
  }, []);
  

  return (
    <>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* row 1 */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography variant="h5" className="dashboard-title">Dashboard</Typography>
        </Grid>
        
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={4} lg={3} className="total-borrowed">
          <ToolAnalytics 
            title="Borrowed Tools/Equipments" 
            count={processData(borrowedData)}
            className="total-borrowed"
            percentage={59.3} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} className="total-returned">
          <ToolAnalytics 
            title="Returned Tools/Equipments" 
            count={processData(returnedData)}
            className="total-returned"
            percentage={59.3} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} className="total-good-condition">
          <ToolAnalytics 
            title="Current Borrowers" 
            count={borrowersCount}
            className="total-good-condition"
            percentage={59.3} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} className="total-bad-condition" >
          <ToolAnalytics 
            title="Recent Borrowed Equipment" 
            count={recentBorrowed} 
            className="total-bad-condition"
            percentage={59.3} 
          />
        </Grid>
        
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

        {/* row 2 */}
        <Grid item xs={12} md={6} lg={6} className="recent-borrowed">
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5" className="recent-borrowed">
                Summary Table
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