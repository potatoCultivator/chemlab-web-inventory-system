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
    TextField,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllBorrowers } from "pages/Query"; // Replace with your actual query function

const HistoryTable = () => {
    const [borrowers, setBorrowers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

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

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setPage(0);
    };

    const filteredBorrowers = borrowers.filter((borrower) =>
        borrower.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box height="525px" overflow="hidden">
            <TextField
                label="Search by Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchOutlined />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClearSearch}>
                                <CloseCircleOutlined />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
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
                        {filteredBorrowers
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
                count={filteredBorrowers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
};

export default HistoryTable;
