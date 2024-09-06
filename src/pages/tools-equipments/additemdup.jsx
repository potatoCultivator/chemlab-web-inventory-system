import React from 'react'
import { Card, CardContent, Typography, Grid, TextField, Button, Snackbar } from '@mui/material'
import { useState } from 'react'

function AddItem() {
  const [item, setItem] = React.useState({
    name: '',
    capacity: '',
    quantity: '',
    category: '',
    condition: '',
    date: ''
  });

  const [loading, setLoading] = useState(false);

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [church, setChurch] = useState('None');
  const [academicStat, setAcademicStat] = useState('Elementary');
  const [status, setStatus] = useState('Unpaid');
  const [registration, setRegistration] = useState('Unpaid');

  const handleAddItem = () => {
    console.log(item);
  }

  const isRegisterDisabled = () => {
    return (
      firstname === '' ||
      lastname === '' ||
      church === '' ||
      academicStat === '' ||
      status === ''
    );
  };

  return (
    <Card sx={{ maxWidth: "100wh", padding: '1em' }}>
      <CardContent>
        <Typography variant="h4" component="div" gutterBottom>
          Edit Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField fullWidth label="Firstname" variant="outlined" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Lastname" variant="outlined" value={lastname} onChange={(e) => setLastname(e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <TextField
                  fullWidth
                  label="Church"
                  variant="outlined"
                  select
                  value={church} // set default value to 'kg'
                  onChange={(e) => {
                    console.log(e.target.value); // Add this line
                    setChurch(e.target.value);
                  }}
                  SelectProps={{ native: true }}
                >
                  <option value='None'>None</option>
                  <option value='Grace Baptist Church'>Grace Baptist Church</option>
                  <option value='Christ Baptist Church'>Christ Baptist Church</option>
                  <option value='Christ Baptist Church Albuera'>Christ Baptist Church Albuera</option>
              </TextField>
          </Grid> 
          
          <Grid item xs={6}>
            <TextField
                  fullWidth
                  label="Academic Status"
                  variant="outlined"
                  select
                  value={academicStat} // set default value to 'kg'
                  onChange={(e) => {
                    console.log(e.target.value); // Add this line
                    setAcademicStat(e.target.value);
                  }}
                  SelectProps={{ native: true }}
                >
                  <option value='Elementary'>Elementary</option>
                  <option value='HighSchool'>HighSchool</option>
                  <option value='College'>College</option>
                  <option value='Young Prof'>Young Prof</option>
              </TextField>
          </Grid> 

          <Grid item xs={6}>
              <TextField
                fullWidth
                label="Status"
                variant="outlined"
                select
                value={status}
                onChange={(e) => {
                  console.log(e.target.value); // Add this line
                  setStatus(e.target.value);
                }}
                SelectProps={{ native: true }}
              >
                <option value='Unpaid'>Unpaid</option>
                <option value='Paid'>Paid</option>
              </TextField>
          </Grid> 
          
         
          
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              sx={{ bgcolor: 'success.dark' }} 
              fullWidth 
              onClick={handleAddItem}
              disabled={loading || isRegisterDisabled()} // Add this line
            >
              {loading ? 'Uploading...' : 'Register'}
            </Button>
          </Grid>
        </Grid>

        {/* {showPopup && (
        <Snackbar open={showPopup} autoHideDuration={6000} onClose={hidePopup}>
          <Alert onClose={hidePopup} severity={messageType} sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      )} */}
      </CardContent>
    </Card>
  )
}

export default AddItem