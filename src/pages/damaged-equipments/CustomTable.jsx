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
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { getDamagedEquipments, getLiableBorrowers } from '../Query'; // Update the import path

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
  const [liableBorrowers, setLiableBorrowers] = React.useState([]);
  const [openRows, setOpenRows] = React.useState({});

  React.useEffect(() => {
    const unsubscribe = getDamagedEquipments(
      (equipments) => setDamagedEquipments(equipments),
      (error) => console.error('Error fetching damaged equipments:', error)
    );
  
    // Cleanup subscription on unmount
    return () => unsubscribe && unsubscribe();
  }, []);

  React.useEffect(() => {
    const unsubscribe = getLiableBorrowers(
      (borrowers) => setLiableBorrowers(borrowers),
      (error) => console.error('Error fetching liable borrowers:', error)
    );
    console.log('liableBorrowers:', liableBorrowers);
    // Cleanup subscription on unmount
    return () => unsubscribe && unsubscribe();
  }, []);
  
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRowClick = (rowId) => {
    setOpenRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  const getBorrowersForEquipment = (equipmentIds) => {
    return liableBorrowers.filter(borrower => equipmentIds.some(e => e.id === borrower.id)).map(borrower => ({
      ...borrower,
      qty: equipmentIds.find(e => e.id === borrower.id)?.qty || 0
    }));
  };

  return (
    <Box sx={{ height: 650 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <TableContainer component={Paper} style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <Table aria-label="table" stickyHeader>
          <TableHead>
            <TableRow style={{ backgroundColor: '#f5f5f5', position: 'sticky', top: 0, zIndex: 1 }}>
              <TableCell />
              <TableCell onClick={() => handleRequestSort('name')}>Equipment Name</TableCell>
              <TableCell onClick={() => handleRequestSort('unit')}>Capacity</TableCell>
              <TableCell align="center" onClick={() => handleRequestSort('stocks')}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(damagedEquipments, getComparator(order, orderBy)).map((row) => (
              <React.Fragment key={row.id}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => handleRowClick(row.id)}
                    >
                      {openRows[row.id] ? <UpOutlined /> : <DownOutlined />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.capacity}{row.unit}</TableCell>
                  <TableCell align="center">{row.total_qty}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={openRows[row.id]} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                          Borrowers
                        </Typography>
                        <TableContainer component={Paper} sx={{ maxHeight: '450px', overflowY: 'auto' }}>
                          <Table size="small" aria-label="borrowers" sx={{ border: '1px solid #ddd' }}>
                            <TableHead>
                              <TableRow
                                  style={{
                                    backgroundColor: "#f5f5f5",
                                    position: "sticky", // Make the header sticky
                                    top: 0,             // Stick to the top of the container
                                    zIndex: 1,          // Ensure it's above the body
                                  }}
                                >
                                <TableCell>Date</TableCell>
                                <TableCell>Replaced By</TableCell>
                                <TableCell>Borrower Id</TableCell>
                                <TableCell align='center'>Replaced</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {getBorrowersForEquipment(row.id_list).map((borrower) => (
                                <TableRow key={borrower.id}>
                                  <TableCell>{new Date(borrower.date.seconds * 1000).toLocaleDateString()}</TableCell>
                                  <TableCell>{borrower.borrower}</TableCell>
                                  <TableCell>{borrower.studentID}</TableCell>
                                  <TableCell align='center'>{borrower.qty}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
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
