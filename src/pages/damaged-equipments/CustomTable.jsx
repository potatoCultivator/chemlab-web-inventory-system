import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { getDamagedEquipments } from 'pages/Query';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
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

export default function CustomTable({ title }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [damagedEquipments, setDamagedEquipments] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = getDamagedEquipments(
      (equipments = []) => {
        setDamagedEquipments(Array.isArray(equipments) ? equipments : []);
      },
      (error) => console.error('Error fetching damaged equipments:', error)
    );

    return () => unsubscribe && unsubscribe();
  }, []);

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
      <TableContainer component={Paper} style={{ maxHeight: '700px', overflowY: 'auto' }}>
        <Table aria-label="table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#f5f5f5', position: 'sticky', top: 0, zIndex: 1 }}>
              <TableCell onClick={() => handleRequestSort('name')}>Equipment Name</TableCell>
              <TableCell onClick={() => handleRequestSort('capacity')}>Capacity</TableCell>
              <TableCell align="right" onClick={() => handleRequestSort('qty')}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(
              damagedEquipments.flatMap((row) => row.equipments), // Flatten the array
              getComparator(order, orderBy)
            ).map((equipment) => (
              <TableRow key={equipment.id}>
                <TableCell>{equipment.name}</TableCell>
                <TableCell>{equipment.capacity} {equipment.unit}</TableCell>
                <TableCell align="right">{equipment.qty}</TableCell>
              </TableRow>
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
