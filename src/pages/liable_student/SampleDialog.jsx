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
import {
    UserOutlined,
    ExperimentOutlined,
    CalendarOutlined,
    HomeOutlined,
    DollarOutlined,
    MailOutlined,
    PhoneOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';

const LiableStudentDetails = () => {
    const studentDetails = {
        student: {
            name: 'John Doe',
            studentID: '2024-001',
            email: 'johndoe@example.com',
            phone: '070 123 4567',
        },
        equipment: [
            { name: 'Beaker', quantity: 5, unit: 'ml', amount: 50, total: 250 },
            { name: 'Test Tube', quantity: 10, unit: 'pcs', amount: 10, total: 100 },
            { name: 'Bunsen Burner', quantity: 2, unit: 'pcs', amount: 150, total: 300 },
        ],
        summary: {
            subTotal: 650,
            tax: 65,
            total: 715,
        },
        issueDetails: {
            dateIssued: '12.01.2024',
            dueDate: '12.15.2024',
            status: 'Pending',
        },
        address: {
            address: '1234 Elm Street',
            city: 'Boston',
            state: 'Massachusetts',
            zip: '02110',
        },
    };

    return (
        <MainCard>
            <Typography variant="h4" gutterBottom>
                Chemistry Lab - Liable Student Details
            </Typography>

            {/* Student Information */}
            <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6}>
                    <MainCard 
                        title={<><UserOutlined /> Student Information</>} 
                        style={{ backgroundColor: '#f0f0f0' }}
                    >
                        <Typography><UserOutlined /> Name: {studentDetails.student.name}</Typography>
                        <Typography><MailOutlined /> Student ID: {studentDetails.student.studentID}</Typography>
                        <Typography><MailOutlined /> Email: {studentDetails.student.email}</Typography>
                        <Typography><PhoneOutlined /> Phone: {studentDetails.student.phone}</Typography>
                    </MainCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <MainCard 
                        title={<><CalendarOutlined /> Equipment Issue Details</>} 
                        style={{ backgroundColor: '#f0f0f0' }}
                    >
                        <Typography><CalendarOutlined /> Date Issued: {studentDetails.issueDetails.dateIssued}</Typography>
                        <Typography><CalendarOutlined /> Due Date: {studentDetails.issueDetails.dueDate}</Typography>
                        <Typography><ExperimentOutlined /> Status: {studentDetails.issueDetails.status}</Typography>
                    </MainCard>
                </Grid>
            </Grid>

            {/* Equipment Details */}
            <TableContainer component={Paper} mb={2}>
                <Table>
                    <TableHead style={{ backgroundColor: '#e0e0e0' }}>
                        <TableRow>
                            <TableCell>Equipment</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Unit Price</TableCell>
                            <TableCell>Total Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {studentDetails.equipment.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>${item.amount}</TableCell>
                                <TableCell>${item.total}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Summary */}
            <MainCard 
                title={<><DollarOutlined /> Payment Summary</>} 
                style={{ backgroundColor: '#f0f0f0' }}
            >
                <Grid container>
                    <Grid item xs={6}>
                        <Typography>Sub Total:</Typography>
                        <Typography>Tax (10%):</Typography>
                        <Typography>Total Amount Due:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography>${studentDetails.summary.subTotal}</Typography>
                        <Typography>${studentDetails.summary.tax}</Typography>
                        <Typography>${studentDetails.summary.total}</Typography>
                    </Grid>
                </Grid>
            </MainCard>

            {/* Address */}
            <Grid container spacing={2} mt={2}>
                <Grid item xs={12}>
                    <MainCard 
                        title={<><HomeOutlined /> Student Address</>} 
                        style={{ backgroundColor: '#f0f0f0' }}
                    >
                        <Typography>{studentDetails.address.address}</Typography>
                        <Typography>{studentDetails.address.city}, {studentDetails.address.state}</Typography>
                        <Typography>ZIP: {studentDetails.address.zip}</Typography>
                    </MainCard>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default LiableStudentDetails;
