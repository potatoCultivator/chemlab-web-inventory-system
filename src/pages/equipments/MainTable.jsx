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
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { UpOutlined, DownOutlined, DeleteOutlined } from '@ant-design/icons';
import Grid from '@mui/material/Grid';
import EquipmentForm from './EquipmentForm'; // Import the EquipmentForm component
import CustomButton from './CustomButton copy';
import { TableSortLabel, TablePagination, TextField } from '@mui/material';
import Tooltip from '@mui/material/Tooltip'; // Import Tooltip

// Database
import { getAllEquipment, deleteEquipment, updateLastHistoryEntry, deleteLastHistoryEntry } from 'pages/Query';

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
  const { row, onDelete } = props;
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [editedHistory, setEditedHistory] = React.useState([...row.history]);
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false); // State to manage error dialog visibility
  const [errorMessage, setErrorMessage] = React.useState(''); // State to manage error message
  const [confirmHistoryDialogOpen, setConfirmHistoryDialogOpen] = React.useState(false); // State to manage confirmation dialog visibility for history
  const [historyIndexToDelete, setHistoryIndexToDelete] = React.useState(null); // State to store the index of the history to be deleted

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    setEditing(false);
    const lastHistoryEntry = editedHistory[editedHistory.length - 1];
    // if (lastHistoryEntry.addedStock < row.stocks) {
    //   setErrorMessage('Cannot save because the added stock value is greater than the current stock.');
    //   setErrorDialogOpen(true);
    //   return;
    // }
    try {
      console.log(lastHistoryEntry);
      await updateLastHistoryEntry(row.id, lastHistoryEntry);
      console.log("Last history entry updated successfully!");
    } catch (error) {
      console.error("Error updating last history entry:", error);
    }
  };

  const handleCancelClick = () => {
    setEditing(false);
    setEditedHistory([...row.history]);
  };

  const handleHistoryChange = (index, value) => {
    const updatedHistory = [...editedHistory];
    const positiveValue = value >= 1 ? value : updatedHistory[index].addedStock; // Ensure the value is not negative
    updatedHistory[index].addedStock = positiveValue;
    setEditedHistory(updatedHistory);
  };

  const handleDeleteHistory = async (index) => {
    const lastHistoryEntry = editedHistory[index];
    if (row.stocks < lastHistoryEntry.addedStock) {
      setErrorMessage('Cannot delete because the added stock value is greater than the current stock.');
      setErrorDialogOpen(true);
      return;
    }
    setHistoryIndexToDelete(index);
    setConfirmHistoryDialogOpen(true);
  };

  const confirmDeleteHistory = async () => {
    const index = historyIndexToDelete;
    const lastHistoryEntry = editedHistory[index];
    const updatedHistory = editedHistory.filter((_, i) => i !== index);
    setEditedHistory(updatedHistory);
    await deleteLastHistoryEntry(row.id);
    row.stocks -= lastHistoryEntry.addedStock;
    row.total -= lastHistoryEntry.addedStock;
    setConfirmHistoryDialogOpen(false);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' }, '&:hover': { backgroundColor: '#f5f5f5' } }}>
        <TableCell>
          <Tooltip title={open ? "Collapse" : "Expand"} arrow>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <UpOutlined /> : <DownOutlined />}
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}{' '}{row.unit !== 'pcs' && `${row.capacity}${row.unit}`}
        </TableCell>
        <TableCell>{row.category}</TableCell>
        {/* <TableCell>{row.unit !== 'pcs' && `${row.capacity}`}{row.unit}</TableCell> */}
        <TableCell align="right">{row.stocks}</TableCell>
        <TableCell align="right">{row.total}</TableCell>
        <TableCell align="right">
          <Tooltip title="Delete" arrow>
            <IconButton aria-label="delete" size="small" onClick={() => onDelete(row.id)} sx={{ color: 'error.main' }}>
              <DeleteOutlined />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
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
                          {editing && <TableCell align='right'>Actions</TableCell>}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {editedHistory.map((historyRow, index) => {
                          const date = historyRow.date.toDate();
                          const isLastRow = index === editedHistory.length - 1;
                          return (
                            <TableRow key={historyRow.date.toMillis()} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                              <TableCell component="th" scope="row">
                                {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </TableCell>
                              <TableCell>
                                {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </TableCell>
                              <TableCell align='center'>
                                {historyRow.addedBy}
                              </TableCell>
                              <TableCell align='right'>
                                {editing && isLastRow ? (
                                  <TextField
                                    type="number"
                                    value={historyRow.addedStock}
                                    onChange={(e) => handleHistoryChange(index, e.target.value)}
                                    fullWidth
                                  />
                                ) : (
                                  historyRow.addedStock
                                )}
                              </TableCell>
                              {editing && isLastRow && (
                                <TableCell align='right'>
                                  <Tooltip title="Delete History" arrow>
                                    <IconButton aria-label="delete" size="small" onClick={() => handleDeleteHistory(index)} sx={{ color: 'error.main' }}>
                                      <DeleteOutlined />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {editing ? (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button onClick={handleCancelClick} color="primary" sx={{ mr: 2 }}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveClick} color="primary" variant="contained">
                        Save
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button onClick={handleEditClick} color="primary" variant="contained">
                        Edit
                      </Button>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Dialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
      >
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmHistoryDialogOpen}
        onClose={() => setConfirmHistoryDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this history entry?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmHistoryDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteHistory} sx={{ color: 'error.main' }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
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
  onDelete: PropTypes.func.isRequired,
};

export default function MainTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [dialogOpen, setDialogOpen] = React.useState(false); // State to manage dialog visibility
  const [rows, setRows] = React.useState([]); // State to store fetched equipment data
  const [page, setPage] = React.useState(0); // State to manage current page
  const [rowsPerPage, setRowsPerPage] = React.useState(10); // State to manage rows per page
  const [searchQuery, setSearchQuery] = React.useState(''); // State to manage search query
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false); // State to manage confirmation dialog visibility
  const [deleteId, setDeleteId] = React.useState(null); // State to store the id of the equipment to be deleted
  const [loading, setLoading] = React.useState(false); // State to manage loading state
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen size is small or below

  React.useEffect(() => {
    const unsubscribe = getAllEquipment(
      (equipment) => {
        setRows(equipment);
      },
      (error) => {
        console.error("Error fetching equipment: ", error);
      }
    );

    // Ensure unsubscribe is a function
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true); // Set loading state to true
    try {
      await deleteEquipment(deleteId);
      setRows((prevRows) => prevRows.filter((row) => row.id !== deleteId));
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error("Error deleting equipment: ", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: 0 }} >
      <Box sx={{ height: 769 }}> {/* Added Box with height 400 */}
        <Grid container spacing={2} alignItems="center" mb={2}>
          <Grid item xs={8} sm={8} display="flex" justifyContent={{ xs: 'flex-end', sm: 'flex-end' }} mt={{ xs: 2, sm: 0 }}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              // sx={{ mb: { xs: 0, sm: 2 } }} // Remove bottom margin on mobile
            />
          </Grid>
          <Grid item xs={4} sm={4} display="</Grid>flex" justifyContent={{ xs: 'flex-end', sm: 'flex-end' }} mt={{ xs: 2, sm: 0 }}>
            <CustomButton type="add" variant="contained" color="primary" onClick={handleDialogOpen}>
              Add
            </CustomButton>
          </Grid>
        </Grid>
        
        <TableContainer
          component={Paper}
          style={{
            maxHeight: "660px", // Set a maximum height to allow scrolling
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
                    Equipment
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
                {/* <TableCell sortDirection={orderBy === 'unit' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'unit'}
                    direction={orderBy === 'unit' ? order : 'asc'}
                    onClick={() => handleRequestSort('unit')}
                  >
                    Unit
                  </TableSortLabel>
                </TableCell> */}
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
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(filteredRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <Row key={row.id} row={row} onDelete={handleDelete} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          maxWidth={isMobile ? 'xs' : 'lg'} // Change the maxWidth to 'lg' for larger width
          fullWidth
          sx={{ 
            '& .MuiDialog-paper': { 
              width: isMobile ? '100%' : '50%', 
              maxWidth: 'none',
              '@media (min-width: 600px)': { width: '75%' }, // Adjust width for medium screens
              '@media (min-width: 960px)': { width: '50%' }, // Adjust width for large screens
              '@media (min-width: 1280px)': { width: '40%' } // Adjust width for extra large screens
            } 
          }} 
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
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this equipment?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDelete} sx={{ color: 'error.main' }} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Confirm'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}