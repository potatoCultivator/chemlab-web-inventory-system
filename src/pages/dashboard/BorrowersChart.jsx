import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import ReactApexChart from 'react-apexcharts';
import { fetchChartData } from 'pages/TE_Backend';
import { get } from 'lodash';
import { startOfWeek, endOfWeek, isSameWeek, isSameMonth, getDay, getYear, getMonth, getWeekOfMonth } from 'date-fns';

// chart options
const columnChartOptions = {
  chart: { type: 'bar', height: 430, toolbar: { show: false } },
  plotOptions: { bar: { columnWidth: '30%', borderRadius: 4 } },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 8, colors: ['transparent'] },
  xaxis: { categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
  fill: { opacity: 1 },
  tooltip: { y: { formatter: val => `${val}` } },
  legend: { show: false },
  responsive: [{ breakpoint: 600, options: { yaxis: { show: false } } }]
};

const initialSeries = {
  weekly: [{ name: 'Borrowed Items', data: [] }, { name: 'Returned Items', data: [] }],
  monthly: [{ name: 'Borrowed Items', data: [] }, { name: 'Returned Items', data: [] }]
};

// ==============================|| BORROWERS CHART ||============================== //
export default function BorrowersChart({ isWeekly }) {
  const [borrowedData, setBorrowedData] = useState([]);
  const [returnedData, setReturnedData] = useState([]);
  const [series, setSeries] = useState(isWeekly ? initialSeries.weekly : initialSeries.monthly);
  const [options, setOptions] = useState(columnChartOptions);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const [legend, setLegend] = useState({ borrowedItem: true, returnedItem: true });
  const { borrowedItem, returnedItem } = legend;

  useEffect(() => {
    const unsubscribeBorrowed = fetchChartData((data) => {
      setBorrowedData(data);
      setLoading(false);
    }, 'borrowed');
    
    const unsubscribeReturned = fetchChartData((data) => {
      setReturnedData(data);
      setLoading(false);
    }, 'returned');

    return () => {
      if (typeof unsubscribeBorrowed === 'function') unsubscribeBorrowed();
      if (typeof unsubscribeReturned === 'function') unsubscribeReturned();
    };
  }, []);

  // // Process data for weekly/monthly charts
  // const processData = (data, isWeekly) => {
  //   const now = new Date();
  //   if (isWeekly) {
  //     const weekData = Array(7).fill(0);
  //     data.forEach(item => {
  //       const itemDate = item.date.toDate ? item.date.toDate() : new Date(item.date);
  //       const itemDayOfWeek = getDay(itemDate);
  //       if (getYear(itemDate) === getYear(now) && getMonth(itemDate) + 1 === getMonth(now) + 1) {
  //         weekData[itemDayOfWeek] += item.count;
  //       }
  //     });
  //     return weekData;
  //   } else {
  //     const monthData = Array(5).fill(0); // Assuming max 5 weeks in a month
  //     data.forEach(item => {
  //       const itemDate = item.date.toDate ? item.date.toDate() : new Date(item.date);
  //       const itemWeekOfMonth = getWeekOfMonth(itemDate);
  //       if (getYear(itemDate) === getYear(now) && getMonth(itemDate) + 1 === getMonth(now) + 1) {
  //         monthData[itemWeekOfMonth - 1] += item.count;
  //       }
  //     });
  //     return monthData;
  //   }
  // };

  const processData = (data, isWeekly) => {
    const now = new Date();
  
    if (isWeekly) {
      // Define the start and end dates for the current week
      const weekStart = startOfWeek(now, { weekStartsOn: 0 }); // Change to 1 if you want the week to start on Monday
      const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
  
      const weekData = Array(7).fill(0);
  
      data.forEach(item => {
        const itemDate = item.date.toDate ? item.date.toDate() : new Date(item.date);
  
        // Check if the item's date falls within the current week
        if (itemDate >= weekStart && itemDate <= weekEnd) {
          const itemDayOfWeek = getDay(itemDate);
          weekData[itemDayOfWeek] += item.count;
        }
      });
  
      return weekData;
    } else {
      // For monthly data, continue as usual
      const monthData = Array(5).fill(0);
  
      data.forEach(item => {
        const itemDate = item.date.toDate ? item.date.toDate() : new Date(item.date);
        const itemWeekOfMonth = getWeekOfMonth(itemDate);
  
        // Check if item falls within the current year and month
        if (getYear(itemDate) === getYear(now) && getMonth(itemDate) === getMonth(now)) {
          monthData[itemWeekOfMonth - 1] += item.count;
        }
      });
  
      return monthData;
    }
  };
  useEffect(() => {
    const newSeries = isWeekly
      ? [
          { name: 'Borrowed Items', data: processData(borrowedData, true) },
          { name: 'Returned Items', data: processData(returnedData, true) }
        ]
      : [
          { name: 'Borrowed Items', data: processData(borrowedData, false) },
          { name: 'Returned Items', data: processData(returnedData, false) }
        ];

    setSeries(() => {
      if (borrowedItem && returnedItem) return newSeries;
      if (borrowedItem) return [newSeries[0]];
      if (returnedItem) return [newSeries[1]];
      return [];
    });
  }, [borrowedData, returnedData, borrowedItem, returnedItem, isWeekly]);

  useEffect(() => {
    setOptions(prevState => ({
      ...prevState,
      colors: !(borrowedItem && returnedItem) && returnedItem ? [theme.palette.primary.main] : [theme.palette.warning.main, theme.palette.primary.main],
      xaxis: {
        categories: isWeekly ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
      },
      grid: { borderColor: theme.palette.divider },
    }));
  }, [theme, borrowedItem, returnedItem, isWeekly]);

  const handleLegendChange = (event) => {
    setLegend({ ...legend, [event.target.name]: event.target.checked });
  };

  return (
    <Box sx={{ bgcolor: 'transparent' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack spacing={1.5}>
          <Typography variant="h6" color="secondary">Total Borrowers:</Typography>
          <Typography variant="h4">156</Typography>
        </Stack>
        <FormControl component="fieldset">
          <FormGroup row>
            <FormControlLabel control={<Checkbox color="warning" checked={borrowedItem} onChange={handleLegendChange} name="borrowedItem" />} label="Borrowed Items" />
            <FormControlLabel control={<Checkbox checked={returnedItem} onChange={handleLegendChange} name="returnedItem" />} label="Returned Items" />
          </FormGroup>
        </FormControl>
      </Stack>
      <Box id="chart" sx={{ bgcolor: 'transparent' }}>
        {loading ? (
          <Typography variant="h6" color="secondary">Loading data...</Typography>
        ) : (
          <ReactApexChart options={options} series={series} type="bar" height={360} />
        )}
      </Box>
    </Box>
  );
}
