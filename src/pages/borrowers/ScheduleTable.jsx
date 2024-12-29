import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { TableSortLabel } from '@mui/material';
// import Dialog, { DialogContent, DialogTitle, DialogActions } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

// project import
import { getAllSchedule } from 'pages/Query';

function createData(subject, schedule, instructor, equipments, students) {
  return {
    subject,
    schedule,
    instructor,
    equipments,
    students,
  };
}

function descendingComparator(a, b, orderBy) {
  if (orderBy === 'schedule') {
    if (b.schedule.start < a.schedule.start) {
      return -1;
    }
    if (b.schedule.start > a.schedule.start) {
      return 1;
    }
    return 0;
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState(null);

  const handleStudentClick = (student) => {
    console.log(student);
    setSelectedStudent(student);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedStudent(null);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' }, '&:hover': { backgroundColor: '#f5f5f5' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <UpOutlined /> : <DownOutlined />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.subject}
        </TableCell>
        <TableCell>{row.schedule.start} - {row.schedule.end}</TableCell>
        <TableCell>{row.instructor}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, padding: 0, maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom component="div" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    List of Equipments Issued
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: '450px', overflowY: 'auto' }}>
                    <Table size="small" aria-label="equipments" sx={{ border: '1px solid #ddd' }}>
                      <TableHead>
                        <TableRow
                          style={{
                            backgroundColor: "#f5f5f5",
                            position: "sticky", // Make the header sticky
                            top: 0,             // Stick to the top of the container
                            zIndex: 1,          // Ensure it's above the body
                          }}
                        >
                          <TableCell>Equipment</TableCell>
                          <TableCell align='right'>Quantity</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.equipments.map((item) => (
                          <TableRow key={item.equipment} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                            <TableCell component="th" scope="row">
                              {item.name}
                            </TableCell>
                            <TableCell align='right'>{item.qty}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom component="div" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    Students Borrowing Equipments
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: '450px', overflowY: 'auto' }}>
                    <Table size="small" aria-label="students" sx={{ border: '1px solid #ddd' }}>
                      <TableHead>
                        <TableRow
                          style={{
                            backgroundColor: "#f5f5f5",
                            position: "sticky", // Make the header sticky
                            top: 0,             // Stick to the top of the container
                            zIndex: 1,          // Ensure it's above the body
                          }}
                        >
                          <TableCell>Student</TableCell>
                          <TableCell align='right'>Borrow Time</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                          {row.students.map((student) => {
                            const date = student.borrowTime ? student.borrowTime.toDate() : new Date();
                            return (
                              <TableRow key={student.name} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}  onClick={() => handleStudentClick(student)}>
                                <TableCell component="th" scope="row">
                                  {student.name}
                                </TableCell>
                                <TableCell align='right'>{date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Student Details</DialogTitle>
        <DialogContent dividers>
          {selectedStudent && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedStudent.name}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Borrow Time:
                  </Typography>
                  <Typography variant="body1">
                    {selectedStudent.borrowTime.toDate().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Status:
                  </Typography>
                  <Typography variant="body1">
                    {selectedStudent.status}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Additional Information:
                  </Typography>
                  <Typography variant="body1">
                    {/* Add any additional information here */}
                    No additional information available.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    subject: PropTypes.string.isRequired,
    schedule: PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    }).isRequired,
    instructor: PropTypes.string.isRequired,
    equipments: PropTypes.arrayOf(
      PropTypes.shape({
        equipment: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
      }),
    ).isRequired,
    students: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        borrowTime: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default function ScheduleTable({ title }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('subject');
  const [rows, setRows] = useState([]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    async function fetchScheduleData() {
      try {
        const data = await getAllSchedule();
  
        const scheduleList = data.map((sched) => {
          const startDate = sched.start.toDate();
          const endDate = sched.end.toDate();
  
          return createData(
            sched.subject,
            {
              start: startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              end: endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            },
            sched.teacher,
            sched.equipments,
            sched.borrowers
          );
        });
  
        setRows(scheduleList);
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      }
    }
  
    fetchScheduleData();
  }, []);
  
  // function createData(subject, schedule, instructor, equipments, students) {
  //   return {
  //     subject,
  //     schedule,
  //     instructor,
  //     equipments,
  //     students,
  //   };
  // }
  
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <TableContainer
        component={Paper}
        style={{
          maxHeight: "615px", // Set a maximum height to allow scrolling
          overflowY: "auto",  // Enables vertical scrolling for the body
        }}
      >
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow
              style={{
                backgroundColor: "#f5f5f5",
                position: "sticky", // Make the header sticky
                top: 0,             // Stick to the top of the container
                zIndex: 1,          // Ensure it's above the body
              }}
            >
              <TableCell />
              <TableCell sortDirection={orderBy === 'subject' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'subject'}
                  direction={orderBy === 'subject' ? order : 'asc'}
                  onClick={() => handleRequestSort('subject')}
                >
                  Subject
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'schedule' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'schedule'}
                  direction={orderBy === 'schedule' ? order : 'asc'}
                  onClick={() => handleRequestSort('schedule')}
                >
                  Schedule
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'instructor' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'instructor'}
                  direction={orderBy === 'instructor' ? order : 'asc'}
                  onClick={() => handleRequestSort('instructor')}
                >
                  Instructor
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row) => (
              <Row key={row.subject} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

ScheduleTable.propTypes = {
  title: PropTypes.string.isRequired,
};