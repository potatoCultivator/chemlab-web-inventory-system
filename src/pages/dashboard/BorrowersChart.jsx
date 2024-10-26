import { useEffect, useState } from 'react';
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
import MainCard from 'components/MainCard';
import ReactApexChart from 'react-apexcharts';
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

const weeksInCurrentMonth = getWeeksInCurrentMonth();
const month = weeksInCurrentMonth.map((_, i) => `Week ${i + 1}`);
const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const columnChartOptions = {
  chart: { type: 'bar', height: 430, toolbar: { show: false } },
  plotOptions: { bar: { columnWidth: '30%', borderRadius: 4 } },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 8, colors: ['transparent'] },
  xaxis: { categories: week },
  yaxis: { title: { text: '$ (thousands)' } },
  fill: { opacity: 1 },
  tooltip: { y: { formatter: val => `$ ${val} thousands` } },
  legend: { show: false },
  responsive: [{ breakpoint: 600, options: { yaxis: { show: false } } }]
};

const initialSeries = {
  weekly: [{ name: 'Borrowed Items', data: [] }, { name: 'Returned Items', data: [] }],
  monthly: [{ name: 'Borrowed Items', data: [] }, { name: 'Returned Items', data: [] }]
};

export default function BorrowersChart({ isWeekly }) {
  const [borrowedData, setBorrowedData] = useState([]);
  const [returnedData, setReturnedData] = useState([]);
  const [series, setSeries] = useState(isWeekly ? initialSeries.weekly : initialSeries.monthly);
  const [options, setOptions] = useState(columnChartOptions);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const xsDown = useMediaQuery(theme.breakpoints.down('sm'));

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
  
    // Check if unsubscribe functions are provided and are functions
    return () => {
      if (typeof unsubscribeBorrowed === 'function') unsubscribeBorrowed();
      if (typeof unsubscribeReturned === 'function') unsubscribeReturned();
    };
  }, []);
  

  const getWeekData = (data) => {
    const weekData = Array(7).fill(0);
    const now = new Date();
    if (Array.isArray(data)) {
      data.forEach(item => {
        let itemDate = item.date.toDate ? item.date.toDate() : new Date(item.date);
        const itemYear = getYear(itemDate);
        const itemMonth = getMonth(itemDate) + 1;
        const itemWeekOfMonth = getWeekOfMonth(itemDate);
        const itemDayOfWeek = getDay(itemDate);
        if (itemYear === getYear(now) && itemMonth === (getMonth(now) + 1) && itemWeekOfMonth === getWeekOfMonth(now)) {
          weekData[itemDayOfWeek] += item.count;
        }
      });
    }
    return weekData;
  };

  const getMonthData = (data) => {
    const monthData = Array(weeksInCurrentMonth.length).fill(0);
    const now = new Date();
    if (Array.isArray(data)) {
      data.forEach(item => {
        let itemDate = item.date.toDate ? item.date.toDate() : new Date(item.date);
        const itemYear = getYear(itemDate);
        const itemMonth = getMonth(itemDate) + 1;
        const itemWeekOfMonth = getWeekOfMonth(itemDate);
        if (itemYear === getYear(now) && itemMonth === (getMonth(now) + 1)) {
          monthData[itemWeekOfMonth - 1] += item.count;
        }
      });
    }
    return monthData;
  };

  useEffect(() => {
    const newSeries = isWeekly
      ? [
          { name: 'Borrowed Items', data: getWeekData(borrowedData) },
          { name: 'Returned Items', data: getWeekData(returnedData) }
        ]
      : [
          { name: 'Borrowed Items', data: getMonthData(borrowedData) },
          { name: 'Returned Items', data: getMonthData(returnedData) }
        ];

    setSeries(() => {
      if (borrowedItem && returnedItem) return newSeries;
      if (borrowedItem) return [newSeries[0]];
      if (returnedItem) return [newSeries[1]];
      return [];
    });
    setLoading(false);
  }, [borrowedData, returnedData, borrowedItem, returnedItem, isWeekly]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: !(borrowedItem && returnedItem) && returnedItem ? [theme.palette.primary.main] : [theme.palette.warning.main, theme.palette.primary.main],
      xaxis: {
        categories: isWeekly ? week : month,
        labels: { style: { colors: Array(7).fill(theme.palette.text.secondary) } }
      },
      yaxis: { labels: { style: { colors: [theme.palette.text.secondary] } } },
      grid: { borderColor: theme.palette.divider },
      plotOptions: { bar: { columnWidth: xsDown ? '60%' : '30%' } }
    }));
  }, [theme, borrowedItem, returnedItem, xsDown, isWeekly]);

  const handleLegendChange = (event) => {
    setLegend({ ...legend, [event.target.name]: event.target.checked });
  };

  return (
    <MainCard sx={{ mt: 1 }} content={false}>
      <Box sx={{ p: 2.5, pb: 0 }}>
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
    </MainCard>
  );
}
