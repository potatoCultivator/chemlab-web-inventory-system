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

function createData(name, type, model, currentQuantity, totalQuantity) {
  return {
    name,
    type,
    model,
    currentQuantity,
    totalQuantity,
    history: [
      {
        date: '2021-05-01',
        addedBy: 'John Doe',
        quantity: 10,
      },
      {
        date: '2021-06-15',
        addedBy: 'Jane Smith',
        quantity: 5,
      },
    ],
  };
}

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
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
          {row.name}
        </TableCell>
        <TableCell>{row.type}</TableCell>
        <TableCell>{row.model}</TableCell>
        <TableCell align="right">{row.currentQuantity}</TableCell>
        <TableCell align="right">{row.totalQuantity}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, padding: 0, maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
              <Typography variant="h6" gutterBottom component="div" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                History
              </Typography>
              <Table size="small" aria-label="history">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align='center'>Added By</TableCell>
                    <TableCell align='right'>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell align='center'>{historyRow.addedBy}</TableCell>
                      <TableCell align='right'>{historyRow.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    currentQuantity: PropTypes.number.isRequired,
    totalQuantity: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        addedBy: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

const rows = [
  createData('Beaker', 'Glassware', '1000ml', 8, 10),
  createData('Burette', 'Glassware', '50ml', 12, 15),
  createData('Pipette', 'Glassware', '10ml', 4, 5),
  createData('Centrifuge', 'Equipment', '5424', 1800, 2000),
  createData('Spectrophotometer', 'Equipment', 'Genesys 10S', 4500, 5000),
  createData('Flask', 'Glassware', '500ml', 7, 8),
  createData('Test Tube', 'Glassware', '15ml', 1, 2),
  createData('Microscope', 'Equipment', 'CX23', 1400, 1500),
  createData('Balance', 'Equipment', 'MS204S', 2800, 3000),
  createData('pH Meter', 'Equipment', 'HI98103', 45, 50),
];

export default function MainTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <TableContainer sx={{ maxHeight: 540 }}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell onClick={() => handleRequestSort('name')}>Equipment Name</TableCell>
            <TableCell onClick={() => handleRequestSort('type')}>Type</TableCell>
            <TableCell onClick={() => handleRequestSort('model')}>Model</TableCell>
            <TableCell align="right" onClick={() => handleRequestSort('currentQuantity')}>Current Quantity</TableCell>
            <TableCell align="right" onClick={() => handleRequestSort('totalQuantity')}>Total Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stableSort(rows, getComparator(order, orderBy)).map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}