import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  Box,
} from '@mui/material';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  HomeOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';

const InvoiceForm = () => {
  return (
    <Card>
      <CardContent>
        {/* Invoice Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Invoice #bkadfsjfks</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Borrower Information */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              <UserOutlined /> Borrower:
            </Typography>
            <Typography>blah blah</Typography>
            <Typography>ID: 0fXKGlajQiKcMzLWjZ7V</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              <ClockCircleOutlined /> Issue Details:
            </Typography>
            <Typography>Date Issued: December 30, 2024, 5:18:39 PM UTC+8</Typography>
            <Typography>Due Date: December 30, 2024, 5:19:43 PM UTC+8</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Equipment Details Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Equipment Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Replaced</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Beaker</TableCell>
              <TableCell>5</TableCell>
              <TableCell>20</TableCell>
              <TableCell>ml</TableCell>
              <TableCell>fdgufdshvjdzbvsdlgvdsyvdsuidsdzhfs</TableCell>
              <TableCell>false</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Summary */}
        <Box mt={3} p={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Total Quantity:</Typography>
            <Typography>5</Typography>
          </Box>
          <Divider />
        </Box>

        {/* Terms and Conditions */}
        <Box mt={3}>
          <Typography variant="subtitle2" fontWeight="bold">Terms and Conditions:</Typography>
          <Typography variant="body2">
            Please ensure that the equipment is returned in good condition by the due date. For any issues, contact support@chemlab.com.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
