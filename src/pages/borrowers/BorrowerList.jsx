import React, { Component } from 'react';
import {
    Box,
    TextField,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import Borrower from './Borrower';
import { get_ID_Name_Sched } from '../Query';

class BorrowerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            selectedSchedule: '',
            selectedScheduleSubject: '',
            schedules: [],
            borrowers: []
        };
    }

    componentDidMount() {
        get_ID_Name_Sched(
            (schedules) => {
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
            this.setState({ 
                selectedSchedule,
                selectedScheduleSubject: selectedScheduleObj.subject,
                borrowers: selectedScheduleObj.borrowers 
            });
        } else {
            this.setState({ 
                selectedSchedule,
                selectedScheduleSubject: '',
                borrowers: [] 
            });
        }
    };

    handleBorrowerApproved = (borrowerID) => {
        this.setState((prevState) => ({
            borrowers: prevState.borrowers.filter(borrower => borrower.userID !== borrowerID)
        }));
    };

    render() {
        const { searchQuery, borrowers, schedules, selectedSchedule, selectedScheduleSubject } = this.state;
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
                <TextField
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={this.handleSearchChange}
                fullWidth
                />
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
            </Box>
            <Box
                sx={{
                height: 'calc(100vh - 200px)', // Adjusts dynamically to screen height
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 2
                }}
            >
                {filteredBorrowers
                .filter(borrower => borrower.status !== 'approved')
                .map((borrower, index) => (
                    <Box key={index} sx={{ width: '100%' }}>
                    <Borrower 
                        schedID={selectedSchedule} 
                        id={borrower.userID} 
                        name={borrower.name} 
                        subject={selectedScheduleSubject} 
                        onApprove={() => this.handleBorrowerApproved(borrower.userID)}
                    />
                    </Box>
                ))}
            </Box>
            </>
        );
    }
}

export default BorrowerList;
