// material-ui
// import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import LiableStudentsPage from './liablestudentpage';
import OrderDetails from './SampleDialog';
import Invoice from './invoice';

// ==============================|| SAMPLE PAGE ||============================== //

export default function LiableStudent() {
    return (
        <>
            <OrderDetails />
            <Invoice />
            <MainCard title="Sample Card">
                <LiableStudentsPage />
            </MainCard>
        </>
    );
}
