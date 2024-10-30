import React, { useEffect, useState } from 'react';
// material-ui
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// project import
import MainCard from 'components/MainCard';
import BorrowerSlipTable from './BorrowerSlipTable';

// ==============================|| SAMPLE PAGE ||============================== //

export default function Borrowers() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.title = "Borrowers • ChemLab ";
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Borrowers</Typography>
          <Button variant='outlined' color='primary' onClick={handleClickOpen}>
            Current Borrowers
          </Button>
        </Box>
      </Grid>

      {/* <ParentComponent /> */}

      {/* row 2 */}
      <Grid item xs={12} sm={6}>
        <MainCard>
          <Typography variant="h4" align="center" sx={{ margin: 1 }}>
            To Borrow
          </Typography>
          <BorrowerSlipTable status={'approved'}/>
        </MainCard>
      </Grid>
      <Grid item xs={12} sm={6}>
        <MainCard>
          <Typography variant="h4" align="center" sx={{ margin: 1 }}>
          To Return
          </Typography>
          <BorrowerSlipTable status={'pending return'}/>
        </MainCard>
      </Grid> 

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Current Borrowers</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <BorrowerSlipTable status={'admin approved'}/>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}