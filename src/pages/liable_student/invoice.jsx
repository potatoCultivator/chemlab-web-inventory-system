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
    <Card sx={{ p: 3, width: '210mm', minHeight: '297mm', margin: 'auto', boxShadow: 'none', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '25.4mm 19.05mm' }}>
      <CardContent>
        {/* Invoice Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold">Invoice #bkadfsjfks</Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Borrower Information */}
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              <UserOutlined /> Borrower:
            </Typography>
            <Typography>Name: John Doe</Typography>
            <Typography>ID: 0fXKGlajQiKcMzLWjZ7V</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              <ClockCircleOutlined /> Issue Details:
            </Typography>
            <Typography>Date Issued: December 30, 2024, 5:18:39 PM UTC+8</Typography>
            <Typography>Due Date: December 30, 2024, 5:19:43 PM UTC+8</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

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
        <Box mt={4} p={2} sx={{ backgroundColor: '#e0e0e0', borderRadius: 1 }}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="subtitle1" fontWeight="bold">Total Quantity:</Typography>
            <Typography variant="subtitle1">5</Typography>
          </Box>
          <Divider />
        </Box>

        {/* Terms and Conditions */}
        <Box mt={4}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Terms and Conditions:</Typography>
          <Typography variant="body2">
            Please ensure that the equipment is returned in good condition by the due date. For any issues, contact support@chemlab.com.
          </Typography>
        </Box>
      </CardContent>

      {/* Signature Section */}
      <Box mt={4} display="flex" justifyContent="space-between" sx={{ p: 3 }}>
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">Borrower's Signature:</Typography>
          <Box mt={2} sx={{ borderBottom: '1px solid #000', width: '200px' }}></Box>
        </Box>
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">Issuer's Signature:</Typography>
          <Box mt={2} sx={{ borderBottom: '1px solid #000', width: '200px' }}></Box>
        </Box>
      </Box>
    </Card>
  );
};

export default InvoiceForm;
