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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Divider,
    TablePagination,
} from "@mui/material";

import { fetchBorrowedEquipments } from "pages/Query";

const EquipmentSummary = () => {
    const [equipments, setEquipments] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        let isSubscribed = true;
    
        const getEquipmentDetails = async () => {
            try {
                const details = await fetchBorrowedEquipments();
    
                if (isSubscribed) {
                    // Sort the equipment details by name, capacity, and unit
                    const sortedDetails = details.sort((a, b) => {
                        if (a.name !== b.name) {
                            return a.name.localeCompare(b.name);
                        }
                        if (a.capacity !== b.capacity) {
                            return a.capacity - b.capacity;
                        }
                        return a.unit.localeCompare(b.unit);
                    });
    
                    // Combine redundant equipment
                    const combinedEquipments = sortedDetails.reduce((acc, item) => {
                        const existingItem = acc.find(equip =>
                            equip.name === item.name &&
                            equip.capacity === item.capacity &&
                            equip.unit === item.unit
                        );
    
                        if (existingItem) {
                            existingItem.qty += item.qty;
                        } else {
                            acc.push({ ...item });
                        }
                        return acc;
                    }, []);
    
                    setEquipments(combinedEquipments);
                }
            } catch (error) {
                console.error('Error fetching equipment details:', error);
            }
        };
    
        getEquipmentDetails();
    
        return () => {
            isSubscribed = false;
        };
    }, []);
    
    

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [selectedEquipment, setSelectedEquipment] = useState(null);

    const handleRowClick = (equipment) => {
        setSelectedEquipment(equipment);
    };

    const handleClose = () => {
        setSelectedEquipment(null);
    };

    return (
        <Box height="525px" overflow="hidden">
            <TableContainer
                component={Paper}
                style={{
                    maxHeight: "100%",
                    overflowY: "auto",
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow
                            style={{
                                backgroundColor: "#f5f5f5",
                                position: "sticky",
                                top: 0,
                                zIndex: 1,
                            }}
                        >
                            <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                            <TableCell align="center" style={{ fontWeight: "bold" }}>Total Borrowed</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {equipments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((equipment) => (
                            <TableRow
                                key={equipment.id}
                                hover
                                style={{ cursor: "pointer" }}
                                onClick={() => handleRowClick(equipment)}
                            >
                                <TableCell>{equipment.name}{' '}{equipment.unit !== 'pcs' && `${equipment.capacity}${equipment.unit}`}</TableCell>
                                <TableCell align="center">{equipment.qty}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={equipments.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {selectedEquipment && (
                <Dialog open={!!selectedEquipment} onClose={handleClose} fullWidth>
                    <DialogTitle style={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Equipment Details</DialogTitle>
                    <DialogContent style={{ padding: "20px" }}>
                        <Box>
                            <Typography variant="h6" gutterBottom style={{ marginBottom: "10px" }}>
                                Equipment Information
                            </Typography>
                            <Divider />
                            <Box marginY={2}>
                                <Typography style={{ marginBottom: "10px" }}>
                                    <strong>Name:</strong> {selectedEquipment.name}
                                </Typography>
                                <Typography style={{ marginBottom: "10px" }}>
                                    <strong>Capacity:</strong> {selectedEquipment.capacity}
                                </Typography>
                                <Typography style={{ marginBottom: "10px" }}>
                                    <strong>Unit:</strong> {selectedEquipment.unit}
                                </Typography>
                                <Typography style={{ marginBottom: "10px" }}>
                                    <strong>Quantity:</strong> {selectedEquipment.qty}
                                </Typography>
                            </Box>
                            <Divider />
                            <Box marginTop={2}>
                                <Typography variant="body1" color="textSecondary" style={{ marginTop: "10px" }}>
                                    Please ensure that the equipment is handled properly and returned in good condition.
                                </Typography>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions style={{ backgroundColor: "#f5f5f5" }}>
                        <Button onClick={handleClose} color="primary">Close</Button>
                        {/* <Button
                            onClick={() => alert("Generating Equipment Report...")}
                            color="secondary"
                        >
                            Generate Report
                        </Button> */}
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default EquipmentSummary;
