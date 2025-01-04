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

// Firebase
import { 
        fetchAdminApprovedBorrowersCount, 
        addAdminApprovedBorrowersListener,
        fetchBorrowerEquipmentDetails,
        // fetchBorrowerEquipmentDetails_Returned,
        fetchChartData } from '../TE_Backend';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  // const [run, setRun] = useState(true);
  const [borrowersCount, setBorrowersCount] = useState(0);
  const [ recentBorrowed, setRecentBorrowed ] = useState(0);
  // const [ returnedEquipment, setReturnedEquipment ] = useState([]);

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

  console.log("record count:" + recentBorrowed.length);
  console.log(recentBorrowed);

  useEffect(() => {
    document.title = "ChemLab IMS";
    // Delay the tour start to ensure all elements are rendered
    // setTimeout(() => setRun(true), 500); // 500ms delay
  }, []);
  

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