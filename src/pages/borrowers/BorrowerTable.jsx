// Required imports
import React, { useState } from "react";
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
} from "@mui/material";

const BorrowerTable = () => {
  // Sample data for borrowers
  const borrowers = [
    { id: 1, name: "John Doe", course: "BS Chemistry", equipment: [ { name: "Microscope", quantity: 1 }, { name: "Flask", quantity: 2 } ], date: "2024-12-11" },
    { id: 2, name: "Jane Smith", course: "BS Biology", equipment: [ { name: "Beakers", quantity: 5 }, { name: "Test Tubes", quantity: 10 } ], date: "2024-12-10" },
    { id: 3, name: "Alex Johnson", course: "BS Physics", equipment: [ { name: "Bunsen Burner", quantity: 2 }, { name: "Graduated Cylinder", quantity: 3 } ], date: "2024-12-09" },
    { id: 4, name: "Emily Davis", course: "BS Microbiology", equipment: [ { name: "Petri Dish", quantity: 10 }, { name: "Test Tubes", quantity: 15 } ], date: "2024-12-08" },
    { id: 5, name: "Michael Brown", course: "BS Biochemistry", equipment: [ { name: "Flask", quantity: 4 }, { name: "Microscope", quantity: 1 } ], date: "2024-12-07" },
    { id: 6, name: "Sarah Wilson", course: "BS Environmental Science", equipment: [ { name: "Thermometer", quantity: 3 }, { name: "Beakers", quantity: 6 } ], date: "2024-12-06" },
    { id: 7, name: "David Martinez", course: "BS Marine Biology", equipment: [ { name: "Aquarium", quantity: 1 }, { name: "PH Meter", quantity: 2 } ], date: "2024-12-05" },
    { id: 8, name: "Sophia Hernandez", course: "BS Botany", equipment: [ { name: "Flask", quantity: 2 }, { name: "Forceps", quantity: 5 } ], date: "2024-12-04" },
    { id: 9, name: "James Lee", course: "BS Zoology", equipment: [ { name: "Cage", quantity: 3 }, { name: "Dissecting Kit", quantity: 2 } ], date: "2024-12-03" },
    { id: 10, name: "Anna Taylor", course: "BS Nutrition", equipment: [ { name: "Weighing Scale", quantity: 1 }, { name: "Measuring Spoon", quantity: 10 } ], date: "2024-12-02" },
    { id: 11, name: "Lucas Walker", course: "BS Pharmacy", equipment: [ { name: "Mortar and Pestle", quantity: 1 }, { name: "Beakers", quantity: 4 } ], date: "2024-12-01" },
    { id: 12, name: "Emma Green", course: "BS Chemistry", equipment: [ { name: "Test Tubes", quantity: 20 }, { name: "Reagent Bottles", quantity: 10 } ], date: "2024-11-30" },
    { id: 13, name: "Ethan Scott", course: "BS Biology", equipment: [ { name: "Microscope", quantity: 2 }, { name: "Slides", quantity: 50 } ], date: "2024-11-29" },
    { id: 14, name: "Olivia Carter", course: "BS Physics", equipment: [ { name: "Thermometer", quantity: 5 }, { name: "Graduated Cylinder", quantity: 2 } ], date: "2024-11-28" },
    { id: 15, name: "Noah Phillips", course: "BS Microbiology", equipment: [ { name: "Petri Dish", quantity: 8 }, { name: "Incubator", quantity: 1 } ], date: "2024-11-27" },
    { id: 16, name: "Isabella Adams", course: "BS Biochemistry", equipment: [ { name: "Pipette", quantity: 10 }, { name: "Flask", quantity: 3 } ], date: "2024-11-26" },
    { id: 17, name: "Mason Collins", course: "BS Environmental Science", equipment: [ { name: "PH Meter", quantity: 1 }, { name: "Beakers", quantity: 7 } ], date: "2024-11-25" },
    { id: 18, name: "Ava White", course: "BS Marine Biology", equipment: [ { name: "Aquarium", quantity: 2 }, { name: "Net", quantity: 1 } ], date: "2024-11-24" },
    { id: 19, name: "Logan Hill", course: "BS Botany", equipment: [ { name: "Forceps", quantity: 4 }, { name: "Magnifying Glass", quantity: 2 } ], date: "2024-11-23" },
    { id: 20, name: "Mia Lewis", course: "BS Zoology", equipment: [ { name: "Cage", quantity: 1 }, { name: "Dissecting Kit", quantity: 3 } ], date: "2024-11-22" },
  ];

  // State to manage the selected borrower and dialog visibility
  const [selectedBorrower, setSelectedBorrower] = useState(null);

  // Handle row click
  const handleRowClick = (borrower) => {
    setSelectedBorrower(borrower);
  };

  // Close dialog
  const handleClose = () => {
    setSelectedBorrower(null);
  };

  return (
    <div>
      <TableContainer
            component={Paper}
            style={{
                // margin: "20px",
                // borderRadius: "8px",
                // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                maxHeight: "680px", // Set a maximum height to allow scrolling
                overflowY: "auto",  // Enables vertical scrolling for the body
            }}
            >
            <Table>
                <TableHead>
                <TableRow
                    style={{
                    backgroundColor: "#f5f5f5",
                    position: "sticky", // Make the header sticky
                    top: 0,             // Stick to the top of the container
                    zIndex: 1,          // Ensure it's above the body
                    }}
                >
                    <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Course</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Equipment</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Date</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {borrowers.map((borrower) => (
                    <TableRow
                    key={borrower.id}
                    hover
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(borrower)}
                    >
                    <TableCell>{borrower.name}</TableCell>
                    <TableCell>{borrower.course}</TableCell>
                    <TableCell>
                        {borrower.equipment.map((eq) => eq.name).join(", ")}
                    </TableCell>
                    <TableCell>{borrower.date}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>


      {/* Dialog for Invoice */}
      {selectedBorrower && (
        <Dialog open={!!selectedBorrower} onClose={handleClose} fullWidth>
          <DialogTitle style={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Invoice</DialogTitle>
          <DialogContent style={{ padding: "20px" }}>
            <Box>
              <Typography variant="h6" gutterBottom style={{ marginBottom: "10px" }}>
                Borrower Details
              </Typography>
              <Divider />
              <Box marginY={2}>
                <Typography style={{ marginBottom: "10px" }}>
                  <strong>Name:</strong> {selectedBorrower.name}
                </Typography>
                <Typography style={{ marginBottom: "10px" }}>
                  <strong>Course:</strong> {selectedBorrower.course}
                </Typography>
                <Typography style={{ marginBottom: "10px" }}>
                  <strong>Date:</strong> {selectedBorrower.date}
                </Typography>
                <Typography>
                  <strong>Equipment:</strong>
                </Typography>
                <TableContainer>
                  <Table size="small" style={{ marginTop: "10px" }}>
                    <TableHead>
                      <TableRow style={{ backgroundColor: "#eaeaea" }}>
                        <TableCell style={{ fontWeight: "bold" }}>Item</TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedBorrower.equipment.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Divider />
              <Box marginTop={2}>
                <Typography variant="body1" color="textSecondary" style={{ marginTop: "10px" }}>
                  Please ensure that the borrower follows all ChemLab equipment
                  handling guidelines. Contact the borrower if additional
                  verification is required.
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions style={{ backgroundColor: "#f5f5f5" }}>
            <Button onClick={handleClose} color="primary">Close</Button>
            <Button
              onClick={() => alert("Generating Invoice PDF...")}
              color="secondary"
            >
              Generate Invoice
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default BorrowerTable;
