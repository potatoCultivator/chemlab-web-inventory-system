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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import Grid from '@mui/material/Grid';
import EquipmentForm from './EquipmentForm'; // Import the EquipmentForm component
import CustomButton from './CustomButton copy';
import { TableSortLabel } from '@mui/material';

// Database
import { getAllEquipment } from 'pages/Query';

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
          {row.name}
        </TableCell>
        <TableCell>{row.category}</TableCell>
        <TableCell>{row.unit}</TableCell>
        <TableCell align="right">{row.stocks}</TableCell>
        <TableCell align="right">{row.total}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, maxWidth: '100%', marginLeft: 'auto', marginRight: 'auto', padding: '16px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom component="div" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    Image
                  </Typography>
                  <img 
                    src={row.image} 
                    alt={row.name} 
                    style={{
                      width: '100%', 
                      maxWidth: '450px', // Set a maximum width
                      height: '450px',   // Match height to width for square
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      display: 'block', // Ensures proper alignment
                      margin: '0 auto' // Centers the image horizontally
                    }} 
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom component="div" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    History
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: '450px', overflowY: 'auto' }}>
                    <Table size="small" aria-label="history" sx={{ border: '1px solid #ddd' }}>
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
                          <TableCell>Time</TableCell>
                          <TableCell align='center'>Added By</TableCell>
                          <TableCell align='right'>Added Stock</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.history.map((historyRow) => {
                          const date = historyRow.date.toDate();
                          return (
                            <TableRow key={historyRow.date.toMillis()} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                              <TableCell component="th" scope="row">
                                {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </TableCell>
                              <TableCell>
                                {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </TableCell>
                              <TableCell align='center'>{historyRow.addedBy}</TableCell>
                              <TableCell align='right'>{historyRow.addedStock}</TableCell>
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
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    stocks: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired, // Added image prop type
    history: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.object.isRequired, // Firestore Timestamp
        addedBy: PropTypes.string.isRequired,
        addedStock: PropTypes.number.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default function MainTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [dialogOpen, setDialogOpen] = React.useState(false); // State to manage dialog visibility
  const [rows, setRows] = React.useState([]); // State to store fetched equipment data
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen size is small or below

  React.useEffect(() => {
    async function fetchData() {
      const equipment = await getAllEquipment();
      setRows(equipment);
    }
    fetchData();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Main Table</Typography>
        <CustomButton type="add" variant="contained" color="primary" onClick={handleDialogOpen}>
          Add
        </CustomButton>
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
              <TableCell sortDirection={orderBy === 'name' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Equipment Name
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'category' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'category'}
                  direction={orderBy === 'category' ? order : 'asc'}
                  onClick={() => handleRequestSort('category')}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'unit' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'unit'}
                  direction={orderBy === 'unit' ? order : 'asc'}
                  onClick={() => handleRequestSort('unit')}
                >
                  Unit
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sortDirection={orderBy === 'stocks' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'stocks'}
                  direction={orderBy === 'stocks' ? order : 'asc'}
                  onClick={() => handleRequestSort('stocks')}
                >
                  Stocks
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sortDirection={orderBy === 'total' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'total'}
                  direction={orderBy === 'total' ? order : 'asc'}
                  onClick={() => handleRequestSort('total')}
                >
                  Total
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row) => (
              <Row key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth={isMobile ? 'xs' : 'md'} // Change the maxWidth based on screen size
        fullWidth
        sx={{ '& .MuiDialog-paper': { width: isMobile ? '100%' : '30%', maxWidth: 'none' } }} // Custom width based on screen size
      >
        <DialogTitle>Add New Equipment</DialogTitle>
        <DialogContent>
          <EquipmentForm onClose={handleDialogClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}