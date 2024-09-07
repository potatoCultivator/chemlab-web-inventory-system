import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
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
import { fetchAllTools } from 'pages/TE_Backend';
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

export default function TE_Table({ refresh, catValue }) {
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
    setSelectedItem(item);
    setOpen(true);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setTools((prevData) => prevData.filter((tool) => tool.no !== itemToDelete.no));
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleSave = () => {
    setTools((prevData) =>
      prevData.map((tool) => (tool.no === selectedItem.no ? selectedItem : tool))
    );
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const filteredRows = catValue === 'all' ? tools : tools.filter(tool => tool.category === catValue);

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
                    <TableCell align='center'>{row.quantity}/{row.quantity}</TableCell>
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
            name="item"
            value={selectedItem?.name || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Capacity"
            name="capacity"
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
            label="Current Quantity"
            name="currentQuantity"
            value={selectedItem?.currentQuantity || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Total Quantity"
            name="totalQuantity"
            value={selectedItem?.totalQuantity || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Category"
            name="category"
            value={selectedItem?.category || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Date"
            name="date"
            value={selectedItem?.date || ''}
            onChange={handleChange}
            fullWidth
          />
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
