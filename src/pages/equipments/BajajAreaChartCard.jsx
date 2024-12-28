import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import chartData from './chart-data/bajaj-area-chart';

// ===========================|| CHEMISTRY LAB - EQUIPMENT AREA CHART CARD ||=========================== //

const ChemistryLabAreaChartCard = () => {
  const theme = useTheme();
  const orangeDark = theme.palette.secondary[800];

  React.useEffect(() => {
    const newSupportChart = {
      ...chartData.options,
      colors: [orangeDark],
      tooltip: { theme: 'light' },
    };
    ApexCharts.exec('equipment-chart', 'updateOptions', newSupportChart);
  }, [orangeDark]);

  return (
    <Card sx={{ bgcolor: 'secondary.light' }}>
      <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle1" sx={{ color: 'secondary.dark' }}>
                Chemistry Lab Equipment
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" sx={{ color: 'grey.800' }}>
                300 Units
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ color: 'grey.800' }}>
            5% Increase in Available Equipment
          </Typography>
        </Grid>
      </Grid>
      <Chart {...chartData} />
    </Card>
  );
};

export default ChemistryLabAreaChartCard;
