// material-ui
// import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import LiableStudentsPage from './liablestudentpage';
import OrderDetails from './SampleDialog';

// ==============================|| SAMPLE PAGE ||============================== //

export default function LiableStudent() {
  return (
    <>
        {/* <OrderDetails /> */}
        <MainCard title="Sample Card">
        <   LiableStudentsPage />
        </MainCard>
    </>
  );
}
