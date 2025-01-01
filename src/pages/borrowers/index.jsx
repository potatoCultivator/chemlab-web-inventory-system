import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';

// project import
// import CustomTab from './CustomTab';
import ScheduleTable from './ScheduleTable';
import MainCard from 'components/MainCard';
import BorrowerList from './BorrowerList';
import Borrower_Return_List from './Borrower_Return_List';
import InvoiceForm from './InvoiceForm';

import { useState } from 'react';

// ==============================|| SAMPLE PAGE ||============================== //

export default function Borrowers() {
  const [showBorrowerList, setShowBorrowerList] = useState(true);

  return (
    <>
      {/* row 1 */}
      {/* <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5" className="Borrowers-title">Borrowers</Typography>
      </Grid>
      <Box sx={{ mt: 2 }} /> */}

      <Grid container rowSpacing={4.5} columnSpacing={1}>
        <Grid item xs={12} md={6}>
          <MainCard>
          <Button onClick={() => setShowBorrowerList(!showBorrowerList)}>
            {showBorrowerList ? 'switch to return' : 'switch to borrow'}
          </Button>
            {showBorrowerList ? <BorrowerList /> : <Borrower_Return_List />}
          </MainCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <MainCard>
            <ScheduleTable />
          </MainCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <MainCard>
            <InvoiceForm />
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
}