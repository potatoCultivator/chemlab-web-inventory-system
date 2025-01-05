// Required imports
import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Box,
} from "@mui/material";
import { getAllBorrowers } from "pages/Query"; // Replace with your actual query function

const HistoryTable = () => {
    const [borrowers, setBorrowers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const unsubscribe = getAllBorrowers(
            (data) => setBorrowers(data),
            (error) => {
                console.error(error);
            }
        );

        return () => unsubscribe();
    }, []);

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box height="525px" overflow="hidden">
            <TableContainer component={Paper} style={{ maxHeight: "100%", overflowY: "auto" }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                            <TableCell align="center" style={{ fontWeight: "bold" }}>Date Borrow</TableCell>
                            <TableCell align="center" style={{ fontWeight: "bold" }}>Time Borrow</TableCell>
                            <TableCell align="center" style={{ fontWeight: "bold" }}>Date Return</TableCell>
                            <TableCell align="center" style={{ fontWeight: "bold" }}>Time Return</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {borrowers
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((borrower) => {
                                const time_borrow = borrower.borrowedTime.toDate();
                                const time_return = borrower.date_returned.toDate();
                                return (
                                    <TableRow key={borrower.userId} hover>
                                        <TableCell>{borrower.name}</TableCell>
                                        <TableCell align="center">{time_borrow.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                                        <TableCell align="center">{time_borrow.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                        <TableCell align="center">{time_return.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                                        <TableCell align="center">{time_return.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={borrowers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
};

export default HistoryTable;
