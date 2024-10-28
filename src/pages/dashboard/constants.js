const headCells = [
    {
      id: 'item',
      align: 'left',
      disablePadding: true,
      label: 'Item'
    },
    {
      id: 'capacity',
      align: 'center',
      disablePadding: false,
      label: 'Capacity'
    },
    {
      id: 'quantity',
      align: 'center',
      disablePadding: false,
      label: 'Quantity'
    },
    {
        id: 'category',
        align: 'center',
        disablePadding: false,
        label: 'Category'
      },
      {
        id: 'action',
        align: 'right',
        disablePadding: false,
        label: 'Edit/Delete'
      }
  ];

  const borow_return_headCells = [
    {
      id: 'item',
      align: 'left',
      disablePadding: true,
      label: 'Item'
    },
    {
      id: 'borrower',
      align: 'left',
      disablePadding: true,
      label: 'borrower'
    },
    {
      id: 'quantity',
      align: 'right',
      disablePadding: false,
      label: 'Quantity'
    },
    {
      id: 'status',
      align: 'left',
      disablePadding: false,
      label: 'Status'
    },
    {
      id: 'capacity',
      align: 'center',
      disablePadding: false,
      label: 'Capacity'
    }
  ];

    // mock data for borrow/return table
function createData(tracking_no, name, borrower, quantity, status, condition) {
  return { tracking_no, name, borrower, quantity, status, condition };
}

const rows = [
  createData(84564564, 'Beaker', 'John Doe', 40, 'approved', 'Good'),
  createData(98764564, 'Microscope', 'Jane Smith', 10, 'pending', 'Bad'),
  createData(98756325, 'Test Tube', 'Alice Johnson', 355, 'approved', 'Good'),
  createData(98652366, 'Bunsen Burner', 'Bob Williams', 50, 'pending', 'Bad'),
  createData(13286564, 'Pipette', 'Chris Evans', 100, 'approved', 'Good'),
  createData(86739658, 'Graduated Cylinder', 'David Lee', 99, 'approved', 'Good'),
  createData(13256498, 'Flask', 'Eve Thompson', 125, 'pending', 'Bad'),
  createData(98753263, 'Petri Dish', 'Frank Wright', 89, 'approved', 'Good'),
  createData(98753275, 'Centrifuge', 'Grace Kim', 5, 'pending', 'Bad'),
  createData(98753291, 'Thermometer', 'Hank Miller', 100, 'approved', 'Good')
];

    export { headCells, borow_return_headCells, rows };