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
import { getAllAddedStocks } from "pages/Query"; // Replace with your actual query function

const AddedStockHistory = () => {
    const [stocks, setStocks] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const unsubscribe = getAllAddedStocks(
            (data) => {
                console.log("Fetched data: ", data); // Log fetched data
                setStocks(data);
            },
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

    const filteredStocks = stocks
    .filter((stock) => stock.name?.toLowerCase().includes(searchQuery.toLowerCase())) // Filtering by name
    .map((stock) => {
        return {
            ...stock,
            addedTime: new Date(stock.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), // Ensure valid date
        };
    });

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
                            <TableCell style={{ fontWeight: "bold" }}>equipment</TableCell>
                            <TableCell align="center" style={{ fontWeight: "bold" }}>Date Added</TableCell>
                            <TableCell align="center" style={{ fontWeight: "bold" }}>Time Added</TableCell>
                            <TableCell align="center" style={{ fontWeight: "bold" }}>Added By</TableCell>
                            <TableCell align="center" style={{ fontWeight: "bold" }}>Added Stock</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStocks
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((stock) => (
                                <TableRow key={stock.id} hover>
                                    <TableCell>
                                        {stock.name}
                                        {stock.unit !== 'pcs' && ` ${stock.capacity}${stock.unit}`}
                                    </TableCell>
                                    <TableCell align="center">
                                        {new Date(stock.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </TableCell>
                                    <TableCell align="center">{stock.addedTime}</TableCell>
                                    <TableCell align="center">{stock.addedBy}</TableCell>
                                    <TableCell align="center">{stock.addedStock}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredStocks.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
};

export default AddedStockHistory;
