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
    categories:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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

const initialSeries = [
    {
    name: 'Borrowed Items',
    data: [180, 90, 135, 114, 120, 145, 160] // Added data for Sunday
  },
  {
    name: 'Returned Items',
    data: [120, 45, 78, 150, 168, 99, 110] // Added data for Sunday
  }
];

// ==============================|| SALES COLUMN CHART ||============================== //

export default function BorrowersChart() {
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

  const [series, setSeries] = useState(initialSeries);

  const handleLegendChange = (event) => {
    setLegend({ ...legend, [event.target.name]: event.target.checked });
  };

  const xsDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [options, setOptions] = useState(columnChartOptions);

  useEffect(() => {
    if (borrowedItem && returnedItem) {
      setSeries(initialSeries);
    } else if (borrowedItem) {
      setSeries([
        {
          name: 'Borrowed Items',
          data: [181, 90, 135, 114, 120, 145]
        }
      ]);
    } else if (returnedItem) {
      setSeries([
        {
          name: 'Returned Items',
          data: [120, 45, 78, 150, 168, 99]
        }
      ]);
    } else {
      setSeries([]);
    }
  }, [borrowedItem, returnedItem]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: !(borrowedItem && returnedItem) && returnedItem ? [primaryMain] : [warning, primaryMain],
      xaxis: {
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
  }, [primary, secondary, line, warning, primaryMain, successDark, borrowedItem, returnedItem, xsDown]);

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
