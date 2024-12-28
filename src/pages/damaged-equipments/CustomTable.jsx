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

function createData(name, type, unit, stocks, total, history) {
  return {
    name,
    type,
    unit,
    stocks,
    total,
    history,
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
  const { row, title } = props;
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
        <TableCell>{row.unit}</TableCell>
        <TableCell align="right">{row.stocks}</TableCell>
        <TableCell align="right">{row.total}</TableCell>
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
                    <TableCell align='center'>Caused by</TableCell>
                    <TableCell align='right'>Damaged</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell align='center'>{historyRow.addedBy}</TableCell>
                      <TableCell align='right'>{historyRow.addedStock}</TableCell>
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
    unit: PropTypes.string.isRequired,
    stocks: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        addedBy: PropTypes.string.isRequired,
        addedStock: PropTypes.number.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
};

const rows = [
  createData('Beaker', 'Glassware', '1000ml', 8, 10, [
    { date: '2021-05-01', addedBy: 'John Doe', addedStock: 10 },
    { date: '2021-06-15', addedBy: 'Jane Smith', addedStock: 5 },
  ]),
  createData('Burette', 'Glassware', '50ml', 12, 15, [
    { date: '2021-05-01', addedBy: 'John Doe', addedStock: 10 },
    { date: '2021-06-15', addedBy: 'Jane Smith', addedStock: 5 },
  ]),
  createData('Pipette', 'Glassware', '10ml', 4, 5, [
    { date: '2021-05-01', addedBy: 'John Doe', addedStock: 10 },
    { date: '2021-06-15', addedBy: 'Jane Smith', addedStock: 5 },
  ]),
  createData('Centrifuge', 'Equipment', '5424', 1800, 2000, [
    { date: '2021-05-01', addedBy: 'John Doe', addedStock: 10 },
    { date: '2021-06-15', addedBy: 'Jane Smith', addedStock: 5 },
  ]),
  createData('Spectrophotometer', 'Equipment', 'Genesys 10S', 4500, 5000, [
    { date: '2021-05-01', addedBy: 'John Doe', addedStock: 10 },
    { date: '2021-06-15', addedBy: 'Jane Smith', addedStock: 5 },
  ]),
  createData('Flask', 'Glassware', '500ml', 7, 8, [
    { date: '2021-05-01', addedBy: 'John Doe', addedStock: 10 },
    { date: '2021-06-15', addedBy: 'Jane Smith', addedStock: 5 },
  ]),
  createData('Test Tube', 'Glassware', '15ml', 1, 2, [
    { date: '2021-05-01', addedBy: 'John Doe', addedStock: 10 },
    { date: '2021-06-15', addedBy: 'Jane Smith', addedStock: 5 },
  ]),
  createData('Microscope', 'Equipment', 'CX23', 1400, 1500, [
    { date: '2021-05-01', addedBy: 'John Doe', addedStock: 10 },
    { date: '2021-06-15', addedBy: 'Jane Smith', addedStock: 5 },
  ]),
  createData('Balance', 'Equipment', 'MS204S', 2800, 3000, [
    { date: '2021-05-01', addedBy: 'John Doe', addedStock: 10 },
    { date: '2021-06-15', addedBy: 'Jane Smith', addedStock: 5 },
  ]),
  createData('pH Meter', 'Equipment', 'HI98103', 45, 50, [
    { date: '2021-05-01', addedBy: 'John Doe', addedStock: 10 },
    { date: '2021-06-15', addedBy: 'Jane Smith', addedStock: 5 },
  ]),
];

export default function CustomTable({ title }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');

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
                // margin: "20px",
                // borderRadius: "8px",
                // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
              <TableCell onClick={() => handleRequestSort('name')}>Equipment Name</TableCell>
              <TableCell onClick={() => handleRequestSort('type')}>Type</TableCell>
              <TableCell onClick={() => handleRequestSort('unit')}>Unit</TableCell>
              <TableCell align="right" onClick={() => handleRequestSort('stocks')}>Stocks</TableCell>
              <TableCell align="right" onClick={() => handleRequestSort('total')}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row) => (
              <Row key={row.name} row={row} title={title} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

CustomTable.propTypes = {
  title: PropTypes.string.isRequired,
};