import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';

// third-party
import ReactApexChart from 'react-apexcharts';

// firebase
import { fetchChartData_borrowed } from 'pages/TE_Backend';

function getWeeksInCurrentMonth() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  let weeks = [];
  let currentWeek = [];

  for (let day = startOfMonth; day <= endOfMonth; day.setDate(day.getDate() + 1)) {
    currentWeek.push(new Date(day));
    if (day.getDay() === 6 || day.getDate() === endOfMonth.getDate()) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  return weeks.length;
}

// console.log(getWeeksInCurrentMonth()); 
const month = [];

for (let i = 0; i < getWeeksInCurrentMonth(); i++) {
  console.log(`Week ${i + 1}`);
  month.push(`Week ${i + 1}`);
}

const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// chart options
const columnChartOptions = {
  chart: {
    type: 'bar',
    height: 430,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '30%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 8,
    colors: ['transparent']
  },
  xaxis: {
    categories: week, // Default to weekly categories
  },
  yaxis: {
    title: {
      text: '$ (thousands)'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter(val) {
        return `$ ${val} thousands`;
      }
    }
  },
  legend: {
    show: false
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        yaxis: {
          show: false
        }
      }
    }
  ]
};

const initialSeries = {
  weekly: [
    {
      name: 'Borrowed Items',
      data: [180, 90, 135, 114, 120, 145, 160] // Added data for Sunday
    },
    {
      name: 'Returned Items',
      data: [120, 45, 78, 150, 168, 99, 110] // Added data for Sunday
    }
  ],
  monthly: [
    {
      name: 'Borrowed Items',
      data: [720, 360, 540, 456] // Monthly data
    },
    {
      name: 'Returned Items',
      data: [480, 180, 312, 600] // Monthly data
    }
  ]
};

// ==============================|| SALES COLUMN CHART ||============================== //

export default function BorrowersChart({ isWeekly }) {
  const [borrowedData, setBorrowedData] = useState([]);

  useEffect(() => {
    // Set up the listener and get the unsubscribe function
    const unsubscribe = fetchChartData_borrowed(setBorrowedData);

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  console.log(borrowedData);

  const theme = useTheme();

  const [legend, setLegend] = useState({
    borrowedItem: true,
    returnedItem: true
  });

  const { borrowedItem, returnedItem } = legend;

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const warning = theme.palette.warning.main;
  const primaryMain = theme.palette.primary.main;
  const successDark = theme.palette.success.dark;

  const [series, setSeries] = useState(isWeekly ? initialSeries.weekly : initialSeries.monthly);

  const handleLegendChange = (event) => {
    setLegend({ ...legend, [event.target.name]: event.target.checked });
  };

  const xsDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [options, setOptions] = useState(columnChartOptions);

  useEffect(() => {
    if (borrowedItem && returnedItem) {
      setSeries(isWeekly ? initialSeries.weekly : initialSeries.monthly);
    } else if (borrowedItem) {
      setSeries([
        {
          name: 'Borrowed Items',
          data: isWeekly ? [180, 90, 135, 114, 120, 145, 160] : [720, 360, 540, 456]
        }
      ]);
    } else if (returnedItem) {
      setSeries([
        {
          name: 'Returned Items',
          data: isWeekly ? [120, 45, 78, 150, 168, 99, 110] : [480, 180, 312, 600]
        }
      ]);
    } else {
      setSeries([]);
    }
  }, [borrowedItem, returnedItem, isWeekly]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: !(borrowedItem && returnedItem) && returnedItem ? [primaryMain] : [warning, primaryMain],
      xaxis: {
        categories: isWeekly ? week : month,
        labels: {
          style: {
            colors: [secondary, secondary, secondary, secondary, secondary, secondary]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      plotOptions: {
        bar: {
          columnWidth: xsDown ? '60%' : '30%'
        }
      }
    }));
  }, [primary, secondary, line, warning, primaryMain, successDark, borrowedItem, returnedItem, xsDown, isWeekly]);

  return (
    <MainCard sx={{ mt: 1 }} content={false}>
      <Box sx={{ p: 2.5, pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={1.5}>
            <Typography variant="h6" color="secondary">
              Total Borrowers:
            </Typography>
            <Typography variant="h4">156</Typography>
          </Stack>
          <FormControl component="fieldset">
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox color="warning" checked={borrowedItem} onChange={handleLegendChange} name="borrowedItem" />}
                label="Borrowed Items"
              />
              <FormControlLabel control={<Checkbox checked={returnedItem} onChange={handleLegendChange} name="returnedItem" />} label="Returned Items" />
            </FormGroup>
          </FormControl>
        </Stack>
        <Box id="chart" sx={{ bgcolor: 'transparent' }}>
          <ReactApexChart options={options} series={series} type="bar" height={360} />
        </Box>
      </Box>
    </MainCard>
  );
}