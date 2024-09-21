import PropTypes from 'prop-types';
// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { NumericFormat } from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';

function createData(tracking_no, name, position, department, email) {
  return { tracking_no, name, position, department, email };
}

const rows = [
  createData(1, 'Dr. John Smith', 'Professor', 'Computer Science', 'jsmith@university.edu'),
  createData(2, 'Dr. Emily Watson', 'Associate Professor', 'Mathematics', 'ewatson@university.edu'),
  createData(3, 'Dr. Michael Johnson', 'Assistant Professor', 'Physics', 'mjohnson@university.edu'),
  createData(4, 'Dr. Sarah Davis', 'Lecturer', 'Biology', 'sdavis@university.edu'),
  createData(5, 'Dr. Olivia Brown', 'Professor', 'Chemistry', 'obrown@university.edu'),
  createData(6, 'Dr. Robert Lee', 'Assistant Professor', 'History', 'rlee@university.edu'),
  createData(7, 'Dr. Sophia Martinez', 'Associate Professor', 'Philosophy', 'smartinez@university.edu'),
  createData(8, 'Dr. William Clark', 'Lecturer', 'Political Science', 'wclark@university.edu'),
  createData(9, 'Dr. Isabella Garcia', 'Professor', 'Economics', 'igarcia@university.edu'),
  createData(10, 'Dr. James Miller', 'Lecturer', 'Engineering', 'jmiller@university.edu')
];


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'Instructor'
  },
  {
    id: 'position',
    align: 'left',
    disablePadding: false,
    label: 'Position'
  },
  {
    id: 'department',
    align: 'left',
    disablePadding: false,
    label: 'Department'
  },
  {
    id: 'email',
    align: 'center',
    disablePadding: false,
    label: 'Email'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// ==============================|| ORDER TABLE ||============================== //

export default function InstructorTable() {
  const order = 'asc';
  const orderBy = 'tracking_no';

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row.tracking_no}
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="left">{row.position}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell align="center">{row.email}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };
