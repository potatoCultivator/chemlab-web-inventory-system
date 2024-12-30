import React from 'react';
import {
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import MainCard from 'components/MainCard';

const OrderDetails = () => {
    const orderDetails = {
        client: {
            name: 'Sophia Hale',
            phone: '070 123 4567',
            email: 'example@gmail.com',
        },
        payment: {
            method: 'Credit Card',
            transactionId: '000001-TXT',
            amount: '$2950',
        },
        shipping: {
            method: 'Carrier',
            tracking: 'FK0123456',
            date: '12.15.2018',
        },
        billingAddress: {
            firstName: 'Joseph',
            lastName: 'William',
            address: '4988 Joanne Lane Street',
            city: 'Boston',
            state: 'Massachusetts',
            zip: '02110',
            phone: '+1 (070) 123-4567',
        },
        shippingAddress: {
            firstName: 'Sara',
            lastName: 'Souden',
            address: '4988 Joanne Lane Street',
            city: 'Boston',
            state: 'Massachusetts',
            zip: '02110',
            phone: '+1 (070) 123-4567',
        },
        items: [
            { description: 'Logo Design', quantity: 6, amount: 200, total: 1200 },
            { description: 'Landing Page', quantity: 7, amount: 100, total: 700 },
            { description: 'Admin Template', quantity: 5, amount: 150, total: 750 },
        ],
        summary: {
            subTotal: 4750,
            tax: 97,
            discount: 45,
            total: 4827,
        },
    };

    return (
        <MainCard>
            <Typography variant="h4" gutterBottom>
                Order Details
            </Typography>

            {/* Client Information */}
            <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6}>
                    <MainCard title="Client">
                        <Typography>{orderDetails.client.name}</Typography>
                        <Typography>{orderDetails.client.phone}</Typography>
                        <Typography>{orderDetails.client.email}</Typography>
                    </MainCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <MainCard title="Order Info">
                        <Typography>Placed on: 12.07.2018</Typography>
                        <Typography>Fulfillment Status: Delivered</Typography>
                        <Typography>Payment Status: Paid</Typography>
                    </MainCard>
                </Grid>
            </Grid>

            {/* Payment and Shipping */}
            <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6}>
                    <MainCard title="Payment Method">
                        <Typography>Method: {orderDetails.payment.method}</Typography>
                        <Typography>Transaction ID: {orderDetails.payment.transactionId}</Typography>
                        <Typography>Amount: {orderDetails.payment.amount}</Typography>
                    </MainCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <MainCard title="Shipping Method">
                        <Typography>Method: {orderDetails.shipping.method}</Typography>
                        <Typography>Tracking #: {orderDetails.shipping.tracking}</Typography>
                        <Typography>Date: {orderDetails.shipping.date}</Typography>
                    </MainCard>
                </Grid>
            </Grid>

            {/* Billing and Shipping Address */}
            <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6}>
                    <MainCard title="Billing Address">
                        <Typography>
                            {orderDetails.billingAddress.firstName} {orderDetails.billingAddress.lastName}
                        </Typography>
                        <Typography>{orderDetails.billingAddress.address}</Typography>
                        <Typography>{orderDetails.billingAddress.city}, {orderDetails.billingAddress.state}</Typography>
                        <Typography>ZIP: {orderDetails.billingAddress.zip}</Typography>
                        <Typography>{orderDetails.billingAddress.phone}</Typography>
                    </MainCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <MainCard title="Shipping Address">
                        <Typography>
                            {orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}
                        </Typography>
                        <Typography>{orderDetails.shippingAddress.address}</Typography>
                        <Typography>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}</Typography>
                        <Typography>ZIP: {orderDetails.shippingAddress.zip}</Typography>
                        <Typography>{orderDetails.shippingAddress.phone}</Typography>
                    </MainCard>
                </Grid>
            </Grid>

            {/* Items Table */}
            <TableContainer component={Paper} mb={2}>
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
                        {orderDetails.items.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>${item.amount}</TableCell>
                                <TableCell>${item.total}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Summary */}
            <MainCard title="Order Summary">
                <Grid container>
                    <Grid item xs={6}>
                        <Typography>Sub Total:</Typography>
                        <Typography>Tax (10%):</Typography>
                        <Typography>Discount (5%):</Typography>
                        <Typography>Total:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography>${orderDetails.summary.subTotal}</Typography>
                        <Typography>${orderDetails.summary.tax}</Typography>
                        <Typography>${orderDetails.summary.discount}</Typography>
                        <Typography>${orderDetails.summary.total}</Typography>
                    </Grid>
                </Grid>
            </MainCard>
        </MainCard>
    );
};

export default OrderDetails;
