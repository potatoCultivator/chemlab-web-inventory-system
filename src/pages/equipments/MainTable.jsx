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
import Paper from '@mui/material/Paper';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

function createData(name, type, manufacturer, model, price) {
  return {
    name,
    type,
    manufacturer,
    model,
    price,
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
        <TableCell>{row.manufacturer}</TableCell>
        <TableCell>{row.model}</TableCell>
        <TableCell align="right">{row.price}</TableCell>
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
    manufacturer: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
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
  createData('Beaker', 'Glassware', 'Pyrex', '1000ml', 10),
  createData('Burette', 'Glassware', 'Kimble', '50ml', 15),
  createData('Pipette', 'Glassware', 'Eppendorf', '10ml', 5),
  createData('Centrifuge', 'Equipment', 'Eppendorf', '5424', 2000),
  createData('Spectrophotometer', 'Equipment', 'Thermo Fisher', 'Genesys 10S', 5000),
  createData('Flask', 'Glassware', 'Corning', '500ml', 8),
  createData('Test Tube', 'Glassware', 'Kimble', '15ml', 2),
  createData('Microscope', 'Equipment', 'Olympus', 'CX23', 1500),
  createData('Balance', 'Equipment', 'Mettler Toledo', 'MS204S', 3000),
  createData('pH Meter', 'Equipment', 'Hanna', 'HI98103', 50),
];

export default function MainTable() {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 540 }}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Equipment Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Manufacturer</TableCell>
            <TableCell>Model</TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}