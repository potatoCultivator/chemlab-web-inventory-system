import React from 'react'
import { Card, CardContent, Typography, Grid, TextField, Button, Snackbar } from '@mui/material'
import { useState } from 'react'

function AddItem() {
  const [item, setItem] = React.useState({
    name: '',
    capacity: '',
    unit: '',
    quantity: '',
    category: '',
    condition: '',
    date: ''
  });

  return (
    <Card sx={{ maxWidth: "100wh", padding: '1em' }}>
      <CardContent>
        <Typography variant="h4" component="div" gutterBottom>
          Add Tool/Equipment
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField 
            fullWidth 
            label="Tools/Equipment" 
            variant="outlined" 
            value={item.name} 
            onChange={(e) => setItem.name(e.target.value)} />
          </Grid>

          <Grid item xs={6}>
            <TextField 
            fullWidth 
            label="Quantity" 
            variant="outlined" 
            value={item.quantity}
             onChange={(e) => setItem.quantity(e.target.value)} />
          </Grid>
          
          <Grid item xs={6}>
            <TextField 
            fullWidth 
            label="Capacity" 
            variant="outlined" 
            value={item.capacity}
             onChange={(e) => setItem.capacity(e.target.value)} />
          </Grid>

          <Grid item xs={6}>
            <TextField 
            fullWidth 
            label="" 
            variant="outlined" 
            select
            value={item.unit}
            onChange={(e) => setItem.unit(e.target.value)}
            SelectProps={{ native: true }}
            helperText="unit of measurement">
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="L">L</option>
                <option value="mL">mL</option>
            </TextField>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AddItem