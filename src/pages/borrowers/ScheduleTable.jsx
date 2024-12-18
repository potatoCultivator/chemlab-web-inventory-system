import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
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

function createData(subject, schedule, instructor, invoice, students) {
  return {
    subject,
    schedule,
    instructor,
    invoice,
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
                    Invoice of Equipments Issued
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: '450px', overflowY: 'auto' }}>
                    <Table size="small" aria-label="invoice" sx={{ border: '1px solid #ddd' }}>
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
                        {row.invoice.map((item) => (
                          <TableRow key={item.equipment} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                            <TableCell component="th" scope="row">
                              {item.equipment}
                            </TableCell>
                            <TableCell align='right'>{item.quantity}</TableCell>
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
                        {row.students.map((student) => (
                          <TableRow key={student.name} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                            <TableCell component="th" scope="row">
                              {student.name}
                            </TableCell>
                            <TableCell align='right'>{student.borrowTime}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
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
    invoice: PropTypes.arrayOf(
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

const rows = [
  createData('Mathematics', { start: '10:00 AM', end: '11:00 AM' }, 'Dr. John Doe', [
    { equipment: 'Calculator', quantity: 10 },
    { equipment: 'Notebook', quantity: 20 },
  ], [
    { name: 'Alice', borrowTime: '10:05 AM' },
    { name: 'Bob', borrowTime: '10:10 AM' },
    { name: 'Alice', borrowTime: '10:05 AM' },
    { name: 'Bob', borrowTime: '10:10 AM' },
    { name: 'Alice', borrowTime: '10:05 AM' },
    { name: 'Bob', borrowTime: '10:10 AM' },
    { name: 'Alice', borrowTime: '10:05 AM' },
    { name: 'Bob', borrowTime: '10:10 AM' },
    { name: 'Alice', borrowTime: '10:05 AM' },
    { name: 'Bob', borrowTime: '10:10 AM' },
    { name: 'Alice', borrowTime: '10:05 AM' },
    { name: 'Bob', borrowTime: '10:10 AM' },
    { name: 'Alice', borrowTime: '10:05 AM' },
    { name: 'Bob', borrowTime: '10:10 AM' },
  ]),
  createData('Physics', { start: '11:00 AM', end: '12:00 PM' }, 'Dr. Jane Smith', [
    { equipment: 'Lab Coat', quantity: 15 },
    { equipment: 'Goggles', quantity: 15 },
  ], [
    { name: 'Charlie', borrowTime: '11:05 AM' },
    { name: 'David', borrowTime: '11:10 AM' },
  ]),
  createData('Chemistry', { start: '12:00 PM', end: '01:00 PM' }, 'Dr. Emily Johnson', [
    { equipment: 'Beaker', quantity: 20 },
    { equipment: 'Test Tube', quantity: 30 },
  ], [
    { name: 'Eve', borrowTime: '12:05 PM' },
    { name: 'Frank', borrowTime: '12:10 PM' },
  ]),
  createData('Biology', { start: '01:00 PM', end: '02:00 PM' }, 'Dr. Michael Brown', [
    { equipment: 'Microscope', quantity: 10 },
    { equipment: 'Slides', quantity: 50 },
  ], [
    { name: 'Grace', borrowTime: '01:05 PM' },
    { name: 'Heidi', borrowTime: '01:10 PM' },
  ]),
  createData('History', { start: '02:00 PM', end: '03:00 PM' }, 'Dr. Sarah Davis', [
    { equipment: 'Textbook', quantity: 25 },
    { equipment: 'Map', quantity: 10 },
  ], [
    { name: 'Ivan', borrowTime: '02:05 PM' },
    { name: 'Judy', borrowTime: '02:10 PM' },
  ]),
  createData('Geography', { start: '03:00 PM', end: '04:00 PM' }, 'Dr. William Clark', [
    { equipment: 'Globe', quantity: 5 },
    { equipment: 'Atlas', quantity: 10 },
  ], [
    { name: 'Kevin', borrowTime: '03:05 PM' },
    { name: 'Laura', borrowTime: '03:10 PM' },
  ]),
  createData('English', { start: '04:00 PM', end: '05:00 PM' }, 'Dr. Nancy White', [
    { equipment: 'Dictionary', quantity: 15 },
    { equipment: 'Thesaurus', quantity: 10 },
  ], [
    { name: 'Mallory', borrowTime: '04:05 PM' },
    { name: 'Nathan', borrowTime: '04:10 PM' },
  ]),
  createData('Art', { start: '05:00 PM', end: '06:00 PM' }, 'Dr. Olivia Green', [
    { equipment: 'Paintbrush', quantity: 20 },
    { equipment: 'Canvas', quantity: 15 },
  ], [
    { name: 'Oscar', borrowTime: '05:05 PM' },
    { name: 'Pam', borrowTime: '05:10 PM' },
  ]),
  createData('Music', { start: '06:00 PM', end: '07:00 PM' }, 'Dr. Paul Black', [
    { equipment: 'Guitar', quantity: 10 },
    { equipment: 'Piano', quantity: 5 },
  ], [
    { name: 'Quincy', borrowTime: '06:05 PM' },
    { name: 'Rachel', borrowTime: '06:10 PM' },
  ]),
  createData('Physical Education', { start: '07:00 PM', end: '08:00 PM' }, 'Dr. Robert Brown', [
    { equipment: 'Basketball', quantity: 15 },
    { equipment: 'Soccer Ball', quantity: 20 },
  ], [
    { name: 'Steve', borrowTime: '07:05 PM' },
    { name: 'Tina', borrowTime: '07:10 PM' },
  ]),
  createData('Computer Science', { start: '08:00 AM', end: '09:00 AM' }, 'Dr. Susan Blue', [
    { equipment: 'Laptop', quantity: 10 },
    { equipment: 'Mouse', quantity: 20 },
  ], [
    { name: 'Uma', borrowTime: '08:05 AM' },
    { name: 'Victor', borrowTime: '08:10 AM' },
  ]),
  createData('Economics', { start: '09:00 AM', end: '10:00 AM' }, 'Dr. Thomas Gray', [
    { equipment: 'Calculator', quantity: 15 },
    { equipment: 'Notebook', quantity: 25 },
  ], [
    { name: 'Wendy', borrowTime: '09:05 AM' },
    { name: 'Xander', borrowTime: '09:10 AM' },
  ]),
  createData('Philosophy', { start: '10:00 AM', end: '11:00 AM' }, 'Dr. Ursula Red', [
    { equipment: 'Book', quantity: 20 },
    { equipment: 'Notebook', quantity: 30 },
  ], [
    { name: 'Yara', borrowTime: '10:05 AM' },
    { name: 'Zane', borrowTime: '10:10 AM' },
  ]),
  createData('Sociology', { start: '11:00 AM', end: '12:00 PM' }, 'Dr. Victor White', [
    { equipment: 'Survey Form', quantity: 25 },
    { equipment: 'Pen', quantity: 50 },
  ], [
    { name: 'Alice', borrowTime: '11:05 AM' },
    { name: 'Bob', borrowTime: '11:10 AM' },
  ]),
  createData('Psychology', { start: '12:00 PM', end: '01:00 PM' }, 'Dr. Wendy Black', [
    { equipment: 'Notebook', quantity: 20 },
    { equipment: 'Pen', quantity: 30 },
  ], [
    { name: 'Charlie', borrowTime: '12:05 PM' },
    { name: 'David', borrowTime: '12:10 PM' },
  ]),
  createData('Political Science', { start: '01:00 PM', end: '02:00 PM' }, 'Dr. Xavier Green', [
    { equipment: 'Book', quantity: 15 },
    { equipment: 'Notebook', quantity: 25 },
  ], [
    { name: 'Eve', borrowTime: '01:05 PM' },
    { name: 'Frank', borrowTime: '01:10 PM' },
  ]),
  createData('Anthropology', { start: '02:00 PM', end: '03:00 PM' }, 'Dr. Yvonne Yellow', [
    { equipment: 'Book', quantity: 20 },
    { equipment: 'Notebook', quantity: 30 },
  ], [
    { name: 'Grace', borrowTime: '02:05 PM' },
    { name: 'Heidi', borrowTime: '02:10 PM' },
  ]),
  createData('Linguistics', { start: '03:00 PM', end: '04:00 PM' }, 'Dr. Zachary Brown', [
    { equipment: 'Dictionary', quantity: 10 },
    { equipment: 'Thesaurus', quantity: 15 },
  ], [
    { name: 'Ivan', borrowTime: '03:05 PM' },
    { name: 'Judy', borrowTime: '03:10 PM' },
  ]),
  createData('Literature', { start: '04:00 PM', end: '05:00 PM' }, 'Dr. Amy White', [
    { equipment: 'Book', quantity: 25 },
    { equipment: 'Notebook', quantity: 35 },
  ], [
    { name: 'Kevin', borrowTime: '04:05 PM' },
    { name: 'Laura', borrowTime: '04:10 PM' },
  ]),
  createData('Astronomy', { start: '05:00 PM', end: '06:00 PM' }, 'Dr. Brian Black', [
    { equipment: 'Telescope', quantity: 5 },
    { equipment: 'Star Chart', quantity: 10 },
  ], [
    { name: 'Mallory', borrowTime: '05:05 PM' },
    { name: 'Nathan', borrowTime: '05:10 PM' },
  ]),
  createData('Geology', { start: '06:00 PM', end: '07:00 PM' }, 'Dr. Carol Green', [
    { equipment: 'Rock Sample', quantity: 20 },
    { equipment: 'Notebook', quantity: 25 },
  ], [
    { name: 'Oscar', borrowTime: '06:05 PM' },
    { name: 'Pam', borrowTime: '06:10 PM' },
  ]),
  createData('Environmental Science', { start: '07:00 PM', end: '08:00 PM' }, 'Dr. David Blue', [
    { equipment: 'Test Kit', quantity: 10 },
    { equipment: 'Notebook', quantity: 20 },
  ], [
    { name: 'Quincy', borrowTime: '07:05 PM' },
    { name: 'Rachel', borrowTime: '07:10 PM' },
  ]),
  createData('Statistics', { start: '08:00 AM', end: '09:00 AM' }, 'Dr. Emily Red', [
    { equipment: 'Calculator', quantity: 15 },
    { equipment: 'Notebook', quantity: 25 },
  ], [
    { name: 'Steve', borrowTime: '08:05 AM' },
    { name: 'Tina', borrowTime: '08:10 AM' },
  ]),
  createData('Engineering', { start: '09:00 AM', end: '10:00 AM' }, 'Dr. Frank Gray', [
    { equipment: 'Toolkit', quantity: 10 },
    { equipment: 'Notebook', quantity: 20 },
  ], [
    { name: 'Uma', borrowTime: '09:05 AM' },
    { name: 'Victor', borrowTime: '09:10 AM' },
  ]),
  createData('Medicine', { start: '10:00 AM', end: '11:00 AM' }, 'Dr. Grace White', [
    { equipment: 'Stethoscope', quantity: 10 },
    { equipment: 'Notebook', quantity: 20 },
  ], [
    { name: 'Wendy', borrowTime: '10:05 AM' },
    { name: 'Xander', borrowTime: '10:10 AM' },
  ]),
  createData('Nursing', { start: '11:00 AM', end: '12:00 PM' }, 'Dr. Henry Black', [
    { equipment: 'Syringe', quantity: 20 },
    { equipment: 'Notebook', quantity: 30 },
  ], [
    { name: 'Yara', borrowTime: '11:05 AM' },
    { name: 'Zane', borrowTime: '11:10 AM' },
  ]),
  createData('Dentistry', { start: '12:00 PM', end: '01:00 PM' }, 'Dr. Irene Green', [
    { equipment: 'Dental Kit', quantity: 10 },
    { equipment: 'Notebook', quantity: 20 },
  ], [
    { name: 'Alice', borrowTime: '12:05 PM' },
    { name: 'Bob', borrowTime: '12:10 PM' },
  ]),
  createData('Pharmacy', { start: '01:00 PM', end: '02:00 PM' }, 'Dr. Jack Blue', [
    { equipment: 'Mortar and Pestle', quantity: 10 },
    { equipment: 'Notebook', quantity: 20 },
  ], [
    { name: 'Charlie', borrowTime: '01:05 PM' },
    { name: 'David', borrowTime: '01:10 PM' },
  ]),
  createData('Veterinary Medicine', { start: '02:00 PM', end: '03:00 PM' }, 'Dr. Karen Red', [
    { equipment: 'Surgical Kit', quantity: 5 },
    { equipment: 'Notebook', quantity: 10 },
  ], [
    { name: 'Eve', borrowTime: '02:05 PM' },
    { name: 'Frank', borrowTime: '02:10 PM' },
  ]),
  createData('Law', { start: '03:00 PM', end: '04:00 PM' }, 'Dr. Larry White', [
    { equipment: 'Law Book', quantity: 20 },
    { equipment: 'Notebook', quantity: 30 },
  ], [
    { name: 'Grace', borrowTime: '03:05 PM' },
    { name: 'Heidi', borrowTime: '03:10 PM' },
  ]),
  createData('Business Administration', { start: '04:00 PM', end: '05:00 PM' }, 'Dr. Michael Black', [
    { equipment: 'Calculator', quantity: 15 },
    { equipment: 'Notebook', quantity: 25 },
  ], [
    { name: 'Ivan', borrowTime: '04:05 PM' },
    { name: 'Judy', borrowTime: '04:10 PM' },
  ]),
  createData('Marketing', { start: '05:00 PM', end: '06:00 PM' }, 'Dr. Nancy Green', [
    { equipment: 'Flyer', quantity: 50 },
    { equipment: 'Notebook', quantity: 20 },
  ], [
    { name: 'Kevin', borrowTime: '05:05 PM' },
    { name: 'Laura', borrowTime: '05:10 PM' },
  ]),
  createData('Finance', { start: '06:00 PM', end: '07:00 PM' }, 'Dr. Olivia Blue', [
    { equipment: 'Calculator', quantity: 20 },
    { equipment: 'Notebook', quantity: 30 },
  ], [
    { name: 'Mallory', borrowTime: '06:05 PM' },
    { name: 'Nathan', borrowTime: '06:10 PM' },
  ]),
  createData('Accounting', { start: '07:00 PM', end: '08:00 PM' }, 'Dr. Paul Red', [
    { equipment: 'Ledger', quantity: 10 },
    { equipment: 'Notebook', quantity: 20 },
  ], [
    { name: 'Oscar', borrowTime: '07:05 PM' },
    { name: 'Pam', borrowTime: '07:10 PM' },
  ]),
  createData('Human Resources', { start: '08:00 AM', end: '09:00 AM' }, 'Dr. Quincy White', [
    { equipment: 'Form', quantity: 25 },
    { equipment: 'Notebook', quantity: 30 },
  ], [
    { name: 'Quincy', borrowTime: '08:05 AM' },
    { name: 'Rachel', borrowTime: '08:10 AM' },
  ]),
  createData('Operations Management', { start: '09:00 AM', end: '10:00 AM' }, 'Dr. Robert Black', [
    { equipment: 'Toolkit', quantity: 10 },
    { equipment: 'Notebook', quantity: 20 },
  ], [
    { name: 'Steve', borrowTime: '09:05 AM' },
    { name: 'Tina', borrowTime: '09:10 AM' },
  ]),
  createData('Supply Chain Management', { start: '10:00 AM', end: '11:00 AM' }, 'Dr. Susan Green', [
    { equipment: 'Form', quantity: 20 },
    { equipment: 'Notebook', quantity: 30 },
  ], [
    { name: 'Uma', borrowTime: '10:05 AM' },
    { name: 'Victor', borrowTime: '10:10 AM' },
  ]),
  createData('Information Technology', { start: '11:00 AM', end: '12:00 PM' }, 'Dr. Thomas Blue', [
    { equipment: 'Laptop', quantity: 10 },
    { equipment: 'Mouse', quantity: 20 },
  ], [
    { name: 'Wendy', borrowTime: '11:05 AM' },
    { name: 'Xander', borrowTime: '11:10 AM' },
  ]),
  createData('Cybersecurity', { start: '12:00 PM', end: '01:00 PM' }, 'Dr. Ursula Red', [
    { equipment: 'Firewall', quantity: 5 },
    { equipment: 'Notebook', quantity: 10 },
  ], [
    { name: 'Yara', borrowTime: '12:05 PM' },
    { name: 'Zane', borrowTime: '12:10 PM' },
  ]),
  createData('Data Science', { start: '01:00 PM', end: '02:00 PM' }, 'Dr. Victor White', [
    { equipment: 'Laptop', quantity: 10 },
    { equipment: 'Notebook', quantity: 20 },
  ], [
    { name: 'Alice', borrowTime: '01:05 PM' },
    { name: 'Bob', borrowTime: '01:10 PM' },
  ]),
  createData('Artificial Intelligence', { start: '02:00 PM', end: '03:00 PM' }, 'Dr. Wendy Black', [
    { equipment: 'Robot', quantity: 5 },
    { equipment: 'Notebook', quantity: 10 },
  ], [
    { name: 'Charlie', borrowTime: '02:05 PM' },
    { name: 'David', borrowTime: '02:10 PM' },
  ]),
];


export default function ScheduleTable({ title }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('subject');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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