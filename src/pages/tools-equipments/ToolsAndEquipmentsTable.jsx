import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// project import
import { fetchAllTools, updateTool, deleteTool } from 'pages/TE_Backend';
import { headCells } from './constants';

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

function TE_TableHead({ order, orderBy }) {
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

export default function TE_Table({ refresh, catValue, searchValue }) {
  const order = 'asc';
  const orderBy = 'no';
  const [tools, setTools] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useEffect triggered with refresh:', refresh);
    const fetchData = async () => {
      try {
        const fetchedTools = await fetchAllTools();
        setTools(fetchedTools);
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const handleEditClick = (item) => {
    console.log('Editing item:', item); // Debugging
    setSelectedItem(item);
    setOpen(true);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // Call the Firestore delete function
      await deleteTool(itemToDelete.id);
  
      // Update the local state to remove the deleted item from the tools array
      setTools((prevData) => prevData.filter((tool) => tool.id !== itemToDelete.id));
  
      // Close the delete confirmation dialog
      setDeleteDialogOpen(false);
      setItemToDelete(null);
  
      console.log(`Tool with ID ${itemToDelete.id} has been deleted`);
    } catch (error) {
      console.error('Error deleting tool:', error);
      // Handle any errors that occur during the deletion process
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleSave = async () => {
    if (selectedItem) {
      console.log('Saving item:', selectedItem); // Debugging
      await updateTool(selectedItem.id, selectedItem); // Call updateTool with the selected item's ID and updated data
      setTools((prevData) =>
        prevData.map((tool) => (tool.id === selectedItem.id ? selectedItem : tool))
      );
      handleClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Changing field:', name, 'to:', value); // Debugging
    setSelectedItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const filteredRows = tools.filter(tool => 
    (catValue === 'All' || tool.category === catValue) &&
    (tool.name?.toLowerCase().includes(searchValue.toLowerCase()) || 
     tool.category?.toLowerCase().includes(searchValue.toLowerCase()))
  );

  return (
    <Box>
      {loading ? (
        <p>Loading...</p>
      ) : (
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
            <TE_TableHead order={order} orderBy={orderBy} />
            <TableBody>
              {stableSort(filteredRows, getComparator(order, orderBy)).map((row, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    tabIndex={-1}
                    key={row.id}
                  >
                    <TableCell align='left'>{row.name}</TableCell>
                    <TableCell align="center">{row.capacity} {row.unit}</TableCell>
                    <TableCell align='center'>{row.good_quantity}/{row.quantity}</TableCell>
                    <TableCell align='center'>{row.damage_quantity}/{row.quantity}</TableCell>
                    <TableCell align='center'>{row.current_quantity}/{row.quantity}</TableCell>
                    <TableCell align="center">{row.category}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" size="large" onClick={() => handleEditClick(row)}>
                        <EditOutlined />
                      </IconButton>
                      <IconButton color="error" size="large" onClick={() => handleDeleteClick(row)}>
                        <DeleteOutlined />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Tool/Equipment</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Item"
            name="name"
            value={selectedItem?.name || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Capacity"
            name="capacity"
            type='number'
            value={selectedItem?.capacity || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Unit"
            name="unit"
            value={selectedItem?.unit || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Total Quantity"
            name="quantity"
            type='number'
            value={selectedItem?.quantity || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Category"
            name="category"
            select
            value={selectedItem?.category || ''}
            onChange={handleChange}
            fullWidth
            SelectProps={{ native: true }}
            helperText="Please select the category"
          >
            <option value="glassware">Glassware</option>
            <option value="plasticware">Plasticware</option>
            <option value="metalware">Metalware</option>
            <option value="heating">Heating</option>
            <option value="measuring">Measuring</option>
            <option value="container">Container</option>
            <option value="separator">Separation Equipment</option>
            <option value="mixing">Mixing & Stirring</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button 
          onClick={handleDeleteConfirm} 
          color="error" 
          sx={{ color: 'rgba(255, 0, 0, 0.7)' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

TE_TableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

TE_Table.propTypes = {
  refresh: PropTypes.bool.isRequired,
  catValue: PropTypes.string.isRequired,
  searchValue: PropTypes.string.isRequired,
};
