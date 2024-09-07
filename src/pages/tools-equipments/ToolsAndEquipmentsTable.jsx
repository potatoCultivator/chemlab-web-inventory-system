import PropTypes from 'prop-types';
// material-ui
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
import { useEffect } from 'react';

// project import
import { rows, headCells } from './constant';


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

// ==============================|| ORDER TABLE ||============================== //

export default function TE_Table({refresh, catValue}) {
  const order = 'asc';
  const orderBy = 'no';

  // Filter rows to include only glassware category
  const filteredRows = catValue === 'all' ? rows : rows.filter(row => row.category === catValue);

  useEffect(() => {
    // This effect will run every time the `refresh` prop changes
    console.log('TE_Table re-rendered due to refresh prop change');
  }, [refresh]);

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
          <TE_TableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(filteredRows, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row.no}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    <Link color="secondary"> {row.no}</Link>
                  </TableCell>
                  <TableCell align='left'>{row.item}</TableCell>
                  <TableCell align="center">{row.capacity} {row.unit}</TableCell>
                  <TableCell align='center'>{row.currentQuantity}/{row.totalQuantity}</TableCell>
                  <TableCell align="center">{row.category}</TableCell>
                  <TableCell align="center">{row.date}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" size="large">
                      <EditOutlined />
                    </IconButton>
                    <IconButton color="secondary" size="large">
                      <DeleteOutlined />
                    </IconButton>
                </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

TE_TableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };
