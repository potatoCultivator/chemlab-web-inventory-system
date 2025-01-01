import React, { Component } from 'react';
import {
    Box,
    TextField,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import Borrower_Return from './Borrower_Return';
import { get_Sched } from '../Query';

class BorrowerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            selectedSchedule: '',
            selectedScheduleSubject: '',
            schedules: [],
            borrowers: [],
            equipments: []
        };
    }

    componentDidMount() {
        get_Sched(
            (schedules) => {
                console.log('Schedules fetched:', schedules);
                this.setState({ schedules });
            },
            (error) => {
                console.error('Error fetching schedules:', error);
                alert('Failed to load schedules. Please try again later.');
            }
        );
    }

    handleSearchChange = (event) => {
        this.setState({ searchQuery: event.target.value });
    };

    handleScheduleChange = (event) => {
        const selectedSchedule = event.target.value;
        const selectedScheduleObj = this.state.schedules.find(schedule => schedule.id === selectedSchedule);
        
        if (selectedScheduleObj) {
            console.log('Selected schedule:', selectedScheduleObj);
            this.setState({ 
                selectedSchedule,
                selectedScheduleSubject: selectedScheduleObj.subject,
                borrowers: selectedScheduleObj.borrowers,
                equipments: selectedScheduleObj.equipments || [] // Ensure fallback to empty array
            });
        } else {
            this.setState({ 
                selectedSchedule,
                selectedScheduleSubject: '',
                borrowers: [],
                equipments: []
            });
        }
        console.log('Selected schedule ID:', selectedSchedule);
        console.log('Equipments:', selectedScheduleObj?.equipments);

    };
    

    handleBorrowerApproved = (borrowerID) => {
        this.setState((prevState) => ({
            borrowers: prevState.borrowers.filter(borrower => borrower.userID !== borrowerID)
        }));
    };

    render() {
        const { searchQuery, borrowers, schedules, selectedSchedule, selectedScheduleSubject, equipments } = this.state;
        const filteredBorrowers = borrowers.filter((borrower) =>
            borrower.name && borrower.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <>
            <Box
            sx={{
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            zIndex: 1,
            width: '100%',
            padding: 2,
            marginBottom: 2
            }}
            >
            <Typography variant="h5" sx={{ marginBottom: 1 }}>
            Borrowers List
            </Typography>

            <Box sx={{ width: '100%' }}>
            <Typography variant="h6">Equipments</Typography>
            <TableContainer component={Paper}>
                <Table>
                <TableHead>
                <TableRow>
                <TableCell>Equipment</TableCell>
                <TableCell align='center'>Quantity</TableCell>
                <TableCell align='center'>Borrowers</TableCell>
                <TableCell align='center'>Total</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {equipments.map((equipment, index) => (
                <TableRow key={index}>
                    <TableCell>{`${equipment.name} ${equipment.capacity}${equipment.unit}`}</TableCell>
                    <TableCell align='center'>{equipment.qty}</TableCell>
                    <TableCell align='center'>{filteredBorrowers.filter(borrower => borrower.status === 'pending').length}</TableCell>
                    <TableCell align='center'>{equipment.qty * filteredBorrowers.filter(borrower => borrower.status === 'pending').length}</TableCell>
                </TableRow>
                ))}
                </TableBody>
                </Table>
            </TableContainer>
            </Box>

            <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel id="schedule-select-label">Select Schedule</InputLabel>
            <Select
                labelId="schedule-select-label"
                value={selectedSchedule}
                onChange={this.handleScheduleChange}
                label="Select Schedule"
            >
                {schedules.length === 0 ? (
                <MenuItem value="">
                <em>No Subject</em>
                </MenuItem>
                ) : (
                schedules.map((schedule) => (
                <MenuItem key={schedule.id} value={schedule.id}>
                {schedule.subject}
                </MenuItem>
                ))
                )}
            </Select>
            </FormControl>
            <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={this.handleSearchChange}
            fullWidth
            sx={{ marginTop: 2 }}
            />
            </Box>
            <Box
            sx={{
            height: 'calc(100vh - 500px)', // Adjusts dynamically to screen height
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 2
            }}
            >
            {filteredBorrowers.filter(borrower => borrower.status === 'pending return').length === 0 ? (
            <Typography variant="h6">No borrowers</Typography>
            ) : (
            filteredBorrowers
                .filter(borrower => borrower.status === 'pending return')
                .map((borrower, index) => (
                <Box key={index} sx={{ width: '100%' }}>
                <Borrower_Return 
                schedID={selectedSchedule} 
                userID={borrower.userId} 
                name={borrower.name}
                equipments={equipments}
                subject={selectedScheduleSubject} 
                onApprove={() => this.handleBorrowerApproved(borrower.userID)}
                />
                </Box>
                ))
            )}
            </Box>
            </>
        );
    }
}

export default BorrowerList;