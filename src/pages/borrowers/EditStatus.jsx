import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import { EditOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

export default function EditStatus({ onSave, initialEquipment }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [goodQuantity, setGoodQuantity] = React.useState(initialEquipment.good_quantity);
  const [damagedQuantity, setDamagedQuantity] = React.useState(initialEquipment.damaged_quantity);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
  };

  const handleSave = () => {
    setLoading(true);
    const updatedEquipment = {
      ...initialEquipment,
      good_quantity: parseInt(goodQuantity, 10),
      damaged_quantity: parseInt(damagedQuantity, 10)
    };
    console.log('Updated Equipment:', updatedEquipment); // Debugging statement
    onSave(updatedEquipment);
    setLoading(false);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton color="primary" size="large" onClick={handleClickOpen}>
        <EditOutlined />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            border: 'none',
            boxShadow: 'none',
            backgroundColor: '#fff'
          }
        }}
      >
        <DialogTitle>Edit Status</DialogTitle>
        <Box mt={0.5} />
        <DialogContent>
          {loading ? (
            <Grid container justifyContent="center" alignItems="center" style={{ height: '100px' }}>
              <CircularProgress />
              <p>Please wait...</p>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Good Quantity"
                  variant="outlined"
                  type="number"
                  value={goodQuantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value >= 0) {
                      setGoodQuantity(value);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Damaged Quantity"
                  variant="outlined"
                  type="number"
                  value={damagedQuantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value >= 0) {
                      setDamagedQuantity(value);
                    }
                  }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button aria-hidden="true" onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button aria-hidden="true" onClick={handleSave} disabled={loading}>Done</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

EditStatus.propTypes = {
  onSave: PropTypes.func.isRequired,
  initialEquipment: PropTypes.shape({
    capacity: PropTypes.number,
    condition: PropTypes.string,
    good_quantity: PropTypes.number,
    id: PropTypes.string,
    name: PropTypes.string,
    unit: PropTypes.string
  }).isRequired
};