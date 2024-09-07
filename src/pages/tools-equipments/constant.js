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
      id: 'no',
      align: 'left',
      disablePadding: true,
      label: 'No.'
    },
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
      id: 'date',
      align: 'center',
      disablePadding: false,
      label: 'Date'
    }
  ];

// Use in ToolasAndEquipmentsTable.jsx
  function createData(no, item, capacity, unit, currentQuantity, totalQuantity, date, category) {
    return { no, item, capacity, unit, currentQuantity, totalQuantity, date, category };
  }
  
  const rows = [
    // Glassware
    createData(1, 'Beaker', 50, 'ml', 10, 100, '2023-01-01', 'glassware'),
    createData(2, 'Test Tube', 20, 'ml', 50, 200, '2023-02-15', 'glassware'),
    createData(3, 'Flask', 75, 'ml', 20, 80, '2023-06-30', 'glassware'),
    createData(4, 'Graduated Cylinder', 25, 'ml', 25, 100, '2023-07-15', 'glassware'),
    createData(5, 'Petri Dish', 200, 'pcs', 100, 500, '2023-08-05', 'glassware'),
  
    // Plasticware
    createData(6, 'Plastic Beaker', 50, 'ml', 10, 100, '2023-01-01', 'plasticware'),
    createData(7, 'Plastic Test Tube', 20, 'ml', 50, 200, '2023-02-15', 'plasticware'),
    createData(8, 'Plastic Flask', 75, 'ml', 20, 80, '2023-06-30', 'plasticware'),
    createData(9, 'Plastic Graduated Cylinder', 25, 'ml', 25, 100, '2023-07-15', 'plasticware'),
    createData(10, 'Plastic Petri Dish', 200, 'pcs', 100, 500, '2023-08-05', 'plasticware'),
  
    // Metalware
    createData(11, 'Metal Beaker', 50, 'ml', 10, 100, '2023-01-01', 'metalware'),
    createData(12, 'Metal Test Tube', 20, 'ml', 50, 200, '2023-02-15', 'metalware'),
    createData(13, 'Metal Flask', 75, 'ml', 20, 80, '2023-06-30', 'metalware'),
    createData(14, 'Metal Graduated Cylinder', 25, 'ml', 25, 100, '2023-07-15', 'metalware'),
    createData(15, 'Metal Petri Dish', 200, 'pcs', 100, 500, '2023-08-05', 'metalware'),
  
    // Heating
    createData(16, 'Bunsen Burner', 5, 'pcs', 15, 50, '2023-03-10', 'heating'),
    createData(17, 'Hot Plate', 10, 'pcs', 5, 20, '2023-04-20', 'heating'),
    createData(18, 'Heating Mantle', 8, 'pcs', 4, 20, '2023-10-20', 'heating'),
    createData(19, 'Heat Gun', 12, 'pcs', 6, 24, '2023-11-15', 'heating'),
    createData(20, 'Infrared Heater', 7, 'pcs', 3, 14, '2023-12-01', 'heating'),
  
    // Measuring
    createData(21, 'Pipette', 100, 'ml', 30, 150, '2023-05-25', 'measuring'),
    createData(22, 'Thermometer', 15, 'pcs', 10, 40, '2023-09-10', 'measuring'),
    createData(23, 'Balance', 8, 'pcs', 4, 20, '2023-10-20', 'measuring'),
    createData(24, 'Measuring Cylinder', 50, 'ml', 20, 100, '2023-11-05', 'measuring'),
    createData(25, 'Measuring Spoon', 5, 'pcs', 25, 125, '2023-12-10', 'measuring'),
  
    // Container
    createData(26, 'Storage Box', 30, 'pcs', 15, 60, '2023-01-15', 'container'),
    createData(27, 'Sample Container', 50, 'pcs', 25, 100, '2023-02-20', 'container'),
    createData(28, 'Chemical Bottle', 100, 'ml', 50, 200, '2023-03-25', 'container'),
    createData(29, 'Reagent Bottle', 75, 'ml', 30, 120, '2023-04-30', 'container'),
    createData(30, 'Specimen Jar', 40, 'pcs', 20, 80, '2023-05-05', 'container'),
  
    // Separation Equipment
    createData(31, 'Centrifuge', 5, 'pcs', 2, 10, '2023-06-10', 'separator'),
    createData(32, 'Filter Paper', 100, 'pcs', 50, 200, '2023-07-20', 'separator'),
    createData(33, 'Separatory Funnel', 25, 'ml', 10, 40, '2023-08-25', 'separator'),
    createData(34, 'Distillation Apparatus', 10, 'pcs', 5, 20, '2023-09-30', 'separator'),
    createData(35, 'Chromatography Column', 15, 'pcs', 7, 28, '2023-10-05', 'separator'),
  
    // Mixing & Stirring
    createData(36, 'Magnetic Stirrer', 5, 'pcs', 3, 15, '2023-11-10', 'mixing'),
    createData(37, 'Vortex Mixer', 8, 'pcs', 4, 20, '2023-12-15', 'mixing'),
    createData(38, 'Overhead Stirrer', 10, 'pcs', 5, 25, '2023-01-20', 'mixing'),
    createData(39, 'Shaker', 12, 'pcs', 6, 30, '2023-02-25', 'mixing'),
    createData(40, 'Homogenizer', 7, 'pcs', 3, 15, '2023-03-30', 'mixing')
  ];

  export { category, headCells, rows };