// material-ui
import Grid from '@mui/material/Grid';

// project import
import MainCard from 'components/MainCard';
import LiableStudentsPage from './liablestudentpage';
import TotalLiableStudent from './TotalLiableStudent';
import Pending from './Pending';
import Settled from './Settled';

// ==============================|| SAMPLE PAGE ||============================== //

export default function LiableStudent() {
    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <TotalLiableStudent />
            </Grid>
            <Grid item xs={4}>
                <Pending />
            </Grid>
            <Grid item xs={4}>
                <Settled />
            </Grid>
            <Grid item xs={12}>
                <MainCard>
                    <LiableStudentsPage />
                </MainCard>
            </Grid>
        </Grid>
    );
}
