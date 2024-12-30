import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, Divider, Box } from '@mui/material';
import { CheckCircleOutlined, ClockCircleOutlined, InfoCircleOutlined, HomeOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const Invoice = () => {
  return (
    <Card>
      <CardContent>
        {/* Invoice Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Invoice #125863478945</Typography> 
          {/* <img src="/logo.png" alt="ChemLab Logo" style={{ height: 40 }} /> */}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Company and Customer Info */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold"><HomeOutlined /> ChemLab Inc.</Typography>
            <Typography>1234 Science Park, Cambridge,</Typography>
            <Typography>Massachusetts, 02139</Typography>
            <Typography>info@chemlab.com</Typography>
            <Typography>(+1) 617-555-1234</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight="bold"><UserOutlined /> Customer:</Typography>
            <Typography>Jane Smith</Typography>
            <Typography>5678 Research Blvd, Austin,</Typography>
            <Typography>Texas, 78759</Typography>
            <Typography>jane.smith@research.com</Typography>
            <Typography>(+1) 512-555-5678</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight="bold"><ShoppingCartOutlined /> Order Details:</Typography>
            <Typography>Date: November 14</Typography>
            <Typography>
              Status: <ClockCircleOutlined style={{ color: 'orange' }} /> Pending
            </Typography>
            <Typography>Order ID: #146859</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">Chemical Reagents</Typography>
                <Typography variant="body2">Various high-purity chemicals for lab use</Typography>
              </TableCell>
              <TableCell>10</TableCell>
              <TableCell>$50.00</TableCell>
              <TableCell>$500.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">Lab Equipment</Typography>
                <Typography variant="body2">Beakers, flasks, and other glassware</Typography>
              </TableCell>
              <TableCell>15</TableCell>
              <TableCell>$30.00</TableCell>
              <TableCell>$450.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">Safety Gear</Typography>
                <Typography variant="body2">Gloves, goggles, and lab coats</Typography>
              </TableCell>
              <TableCell>20</TableCell>
              <TableCell>$20.00</TableCell>
              <TableCell>$400.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Summary */}
        <Box mt={3} p={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Sub Total:</Typography>
            <Typography>$1350.00</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Tax (10%):</Typography>
            <Typography>$135.00</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Discount (5%):</Typography>
            <Typography>-$67.50</Typography>
          </Box>
          <Divider />
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography fontWeight="bold">Total:</Typography>
            <Typography fontWeight="bold">$1417.50</Typography>
          </Box>
        </Box>

        {/* Terms and Conditions */}
        <Box mt={3}>
          <Typography variant="subtitle2" fontWeight="bold">Terms and Conditions:</Typography>
          <Typography variant="body2">
            All sales are final. Please review your order carefully before submitting. For any issues, contact support@chemlab.com.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Invoice;
