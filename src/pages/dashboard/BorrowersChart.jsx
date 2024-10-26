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
import { format, getMonth, getYear, getWeekOfMonth, getDay } from 'date-fns';

// project import
import MainCard from 'components/MainCard';

// third-party
import ReactApexChart from 'react-apexcharts';

// firebase
import { fetchChartData } from 'pages/TE_Backend';
import { get } from 'lodash';

function getWeeksInCurrentMonth() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  let weeks = [];
  let currentWeek = [];

  for (let day = new Date(startOfMonth); day <= endOfMonth; day.setDate(day.getDate() + 1)) {
    currentWeek.push(new Date(day));
    if (day.getDay() === 6 || day.getDate() === endOfMonth.getDate()) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  }

  return weeks;
}

// Get all weeks in the current month
const weeksInCurrentMonth = getWeeksInCurrentMonth();

// Get the current date
const now = new Date();

// Find the current week
const currentWeek = weeksInCurrentMonth.find(week => 
  week.some(day => 
    day.getDate() === now.getDate()
  )
);

// Display the days of the current week
if (currentWeek) {
  console.log('Current week days:');
  currentWeek.forEach(day => {
    console.log(day.toDateString());
  });
} else {
  console.log('Current week not found.');
}

const month = weeksInCurrentMonth.map((_, i) => `Week ${i + 1}`);
const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
      data: [] 
    },
    {
      name: 'Returned Items',
      data: []
    }
  ],
  monthly: [
    {
      name: 'Borrowed Items',
      data: []
    },
    {
      name: 'Returned Items',
      data: []
    }
  ]
};

// ==============================|| SALES COLUMN CHART ||============================== //

export default function BorrowersChart({ isWeekly }) {
  const [borrowedData, setBorrowedData] = useState([]);
  const [returnedData, setReturnedData] = useState([]);
  const [series, setSeries] = useState(isWeekly ? initialSeries.weekly : initialSeries.monthly);
  const [options, setOptions] = useState(columnChartOptions);
  const [loading, setLoading] = useState(true); // Add loading state

  const theme = useTheme();
  const xsDown = useMediaQuery(theme.breakpoints.down('sm'));

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

  useEffect(() => {
    // Set up the listener and get the unsubscribe function for borrowed items
    const unsubscribeBorrowed = fetchChartData(setBorrowedData, 'borrowed');
    // Set up the listener and get the unsubscribe function for returned items
    const unsubscribeReturned = fetchChartData(setReturnedData, 'returned');
    return () => {
      unsubscribeBorrowed;
      unsubscribeReturned;
    };
  }, []);

  useEffect(() => {
    const getWeekData = (data) => {
      const weekData = Array(7).fill(0); // Initialize an array with 7 elements, one for each day of the week
      const now = new Date();
    
      if (Array.isArray(data)) {
        data.forEach(item => {
          let itemDate;
          if (item.date.toDate) {
            itemDate = item.date.toDate(); // Convert Firebase Timestamp to JavaScript Date
          } else {
            itemDate = new Date(item.date); // Assume it's already a Date object or a string
          }
          const itemYear = getYear(itemDate);
          const itemMonth = getMonth(itemDate) + 1; // getMonth returns 0-based month
          const itemWeekOfMonth = getWeekOfMonth(itemDate);
          const itemDayOfWeek = getDay(itemDate); // Get the day of the week (0-6)
    
          console.log(`Item Date: ${itemDate.toDateString()}, Day of Week: ${itemDayOfWeek}`);
    
          if (itemYear === getYear(now) && itemMonth === (getMonth(now) + 1) && itemWeekOfMonth === getWeekOfMonth(now)) {
            weekData[itemDayOfWeek] += item.count; // Use the day of the week as the index
            console.log('Week data:', itemDate.toDateString());
          }
        });
      }
    
      console.log('Week data:', weekData);
      return weekData;
    };

    const getMonthData = (data) => {
      const monthData = Array(weeksInCurrentMonth.length).fill(0); // Initialize an array with elements for each week of the month
      const now = new Date();

      if (Array.isArray(data)) {
        data.forEach(item => {
          let itemDate;
          if (item.date.toDate) {
            itemDate = item.date.toDate(); // Convert Firebase Timestamp to JavaScript Date
          } else {
            itemDate = new Date(item.date); // Assume it's already a Date object or a string
          }
          const itemYear = getYear(itemDate);
          const itemMonth = getMonth(itemDate) + 1; // getMonth returns 0-based month
          const itemWeekOfMonth = getWeekOfMonth(itemDate);

          console.log(`Item Date: ${itemDate.toDateString()}, Week of Month: ${itemWeekOfMonth}`);

          if (itemYear === getYear(now) && itemMonth === (getMonth(now) + 1)) {
            monthData[itemWeekOfMonth - 1] += item.count; // Use the week of the month as the index
            console.log('Month data:', itemDate.toDateString());
          }
        });
      }

      console.log('Month data:', monthData);
      return monthData;
    };
    
    if (isWeekly) {
      initialSeries.weekly[0].data = getWeekData(borrowedData);
      initialSeries.weekly[1].data = getWeekData(returnedData);
      console.log('Weekly series:', initialSeries.weekly);
    } else {
      initialSeries.monthly[0].data = getMonthData(borrowedData);
      initialSeries.monthly[1].data = getMonthData(returnedData);
    }

    if (borrowedItem && returnedItem) {
      setSeries(isWeekly ? initialSeries.weekly : initialSeries.monthly);
    } else if (borrowedItem) {
      setSeries([
        {
          name: 'Borrowed Items',
          data: isWeekly ? initialSeries.weekly[0].data : initialSeries.monthly[0].data
        }
      ]);
    } else if (returnedItem) {
      setSeries([
        {
          name: 'Returned Items',
          data: isWeekly ? initialSeries.weekly[1].data : initialSeries.monthly[1].data
        }
      ]);
    } else {
      setSeries([]);
    }

    setLoading(false); // Update loading state
  }, [borrowedItem, returnedItem, isWeekly, borrowedData, returnedData]);

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

  const handleLegendChange = (event) => {
    setLegend({ ...legend, [event.target.name]: event.target.checked });
  };

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
          {loading ? (
            <Typography variant="h6" color="secondary">
              Loading data...
            </Typography>
          ) : (
            <ReactApexChart options={options} series={series} type="bar" height={360} />
          )}
        </Box>
      </Box>
    </MainCard>
  );
}