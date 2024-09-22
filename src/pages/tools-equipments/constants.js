// Use In processtab.jsx
const category = [
    {
        value: 'all',
        label: 'All',
      },
    {
      value: 'glassware',
      label: 'Glassware',
    },
    {
      value: 'plasticware',
      label: 'Plasticware',
    },
    {
      value: 'metalware',
      label: 'Metalware',
    },
    {
      value: 'heating',
      label: 'Heating',
    },
    {
      value: 'measuring',
      label: 'Measuring',
    },
    {
      value: 'container',
      label: 'Container',
    },
    {
      value: 'separator',
      label: 'Separation Equipment',
    },
    {
      value: 'mixing',
      label: 'Mixing & Stirring',
    }
  ];

// Use in ToolasAndEquipmentsTable.jsx
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
        label: 'Edit / Delete'
      }
  ];

  // use for BorrowTable and ReturnTable
  const borow_return_headCells = [
    {
      id: 'tracking_no',
      align: 'left',
      disablePadding: false,
      label: 'Tracking No.'
    },
    {
      id: 'item',
      align: 'left',
      disablePadding: true,
      label: 'Item'
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
      id: 'condition',
      align: 'right',
      disablePadding: false,
      label: 'Condition'
    }
  ];

  // mock data for borrow/return table
  function createData(tracking_no, name, quantity, status, condition) {
    return { tracking_no, name, quantity, status, condition };
  }
  
  const rows = [
    createData(84564564, 'Beaker', 40, 0, 'Good'), // Approved
    createData(98764564, 'Microscope', 10, 1, 'Bad'), // Pending
    createData(98756325, 'Test Tube', 355, 0, 'Good'), // Approved
    createData(98652366, 'Bunsen Burner', 50, 1, 'Bad'), // Pending
    createData(13286564, 'Pipette', 100, 0, 'Good'), // Approved
    createData(86739658, 'Graduated Cylinder', 99, 0, 'Good'), // Approved
    createData(13256498, 'Flask', 125, 1, 'Bad'), // Pending
    createData(98753263, 'Petri Dish', 89, 0, 'Good'), // Approved
    createData(98753275, 'Centrifuge', 5, 1, 'Bad'), // Pending
    createData(98753291, 'Thermometer', 100, 0, 'Good') // Approved
  ];
  
  export { category, headCells, borow_return_headCells, rows };