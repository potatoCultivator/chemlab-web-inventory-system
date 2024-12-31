import React from 'react';
import { Grid, Typography, TextField, Button, Card, CardContent, Divider, Box } from '@mui/material';
import MainCard from 'components/MainCard'; // Assuming MainCard is part of Berry template components

const InvoiceForm = () => {
  return (
    <MainCard title="Invoice Form">
      <CardContent>
        <Grid container spacing={3}>
          {/* Borrower Information */}
          <Grid item xs={12}>
            <Typography variant="h6">Borrower Information</Typography>
            <Divider />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Borrower Name" defaultValue="blah blah" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Borrower ID" defaultValue="0fXKGlajQiKcMzLWjZ7V" />
          </Grid>

          {/* Issue Details */}
          <Grid item xs={12}>
            <Typography variant="h6">Issue Details</Typography>
            <Divider />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Date Issued" defaultValue="December 30, 2024, 5:18:39 PM UTC+8" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Due Date" defaultValue="December 30, 2024, 5:19:43 PM UTC+8" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Issue ID" defaultValue="bkadfsjfks" />
          </Grid>

          {/* Equipment Details */}
          <Grid item xs={12}>
            <Typography variant="h6">Equipment Details</Typography>
            <Divider />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Equipment Name" defaultValue="beaker" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Quantity" defaultValue="5" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Capacity" defaultValue="20" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Unit" defaultValue="ml" />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              defaultValue="fdgufdshvjdzbvsdlgvdsyvdsuidsdzhfs"
            />
          </Grid>

          {/* Additional Details */}
          <Grid item xs={12}>
            <Typography variant="h6">Additional Details</Typography>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Replaced" defaultValue="false" />
          </Grid>

          {/* Actions */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="contained" color="primary">
                Save
              </Button>
              <Button variant="outlined" color="secondary">
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
};

export default InvoiceForm;
