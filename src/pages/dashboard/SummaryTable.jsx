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
import { useEffect, useState } from 'react';

// project import
import Dot from 'components/@extended/Dot';
import { borow_return_headCells } from './constants';

import { fetchAllBorrowers } from 'pages/TE_Backend';

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

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {borow_return_headCells.map((headCell) => (
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

function OrderStatus({ status }) {
  let color;
  let title;

  switch (status) {
    case 'approved':
      color = 'warning';
      title = 'Pending';
      break;
    case 'approved_admin':
      color = 'success';
      title = 'Approved';
      break;
    case 'declined':
      color = 'error';
      title = 'Declined';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

// ==============================|| ORDER TABLE ||============================== //

export default function SummaryTable() {
  const order = 'asc';
  const orderBy = 'tracking_no';
  const [borrowers, setBorrowers] = useState([]);

  useEffect(() => {
    // Set up the listener and get the unsubscribe function
    const unsubscribe = fetchAllBorrowers(setBorrowers);

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  // Ensure borrowers is defined and is an array before using flatMap
  const approvedBorrowers = Array.isArray(borrowers) 
    ? borrowers.filter(borrower => borrower.isApproved === 'approved' || borrower.isApproved === 'approved_admin') 
    : [];

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
            {approvedBorrowers.length > 0 && approvedBorrowers.flatMap(borrower => 
              borrower.equipmentDetails.map(equipment => ({
                ...equipment,
                borrower: borrower.borrowername,
                isApproved: borrower.isApproved
              }))
            ).sort((a, b) => getComparator(order, orderBy)(a, b)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row.id}
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.borrower}</TableCell>
                  <TableCell align="right">{row.current_quantity}{row.unit}</TableCell>
                  <TableCell><OrderStatus status={row.isApproved} /></TableCell>
                  <TableCell align="right">{row.condition}</TableCell>
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

OrderStatus.propTypes = { status: PropTypes.string };