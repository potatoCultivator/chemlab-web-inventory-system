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
                  <Table size="small" aria-label="invoice">
                    <TableHead>
                      <TableRow>
                        <TableCell>Equipment</TableCell>
                        <TableCell align='right'>Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.invoice.map((item) => (
                        <TableRow key={item.equipment}>
                          <TableCell component="th" scope="row">
                            {item.equipment}
                          </TableCell>
                          <TableCell align='right'>{item.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom component="div" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    Students Borrowing Equipments
                  </Typography>
                  <Table size="small" aria-label="students">
                    <TableHead>
                      <TableRow>
                        <TableCell>Student</TableCell>
                        <TableCell align='right'>Borrow Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.students.map((student) => (
                        <TableRow key={student.name}>
                          <TableCell component="th" scope="row">
                            {student.name}
                          </TableCell>
                          <TableCell align='right'>{student.borrowTime}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
          maxHeight: "700px", // Set a maximum height to allow scrolling
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