import React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';
import chartData from './chart-data/bajaj-area-chart';
import { fetchDeletedAndNotDeletedEquipments } from 'pages/Query';

const ChemistryLabAreaChartCard = () => {
  const theme = useTheme();
  const orangeDark = theme.palette.secondary[800];
  const [equipments, setEquipments] = React.useState([]);

  React.useEffect(() => {
    const fetchData = () => {
      fetchDeletedAndNotDeletedEquipments(
        (response) => {
          setEquipments(response);
        },
        (error) => {
          console.error('Error fetching equipments:', error);
        }
      );
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  React.useEffect(() => {
    const newSupportChart = {
      ...chartData.options,
      colors: [orangeDark],
      tooltip: { theme: 'light' },
    };
    ApexCharts.exec('equipment-chart', 'updateOptions', newSupportChart);
  }, [orangeDark]);

  const currentMonth = new Date().getMonth();
  const currentMonthEquipments = equipments.filter(equipment => {
    const equipmentMonth = new Date(equipment.dateAdded.seconds * 1000).getMonth();
    return equipmentMonth === currentMonth;
  });

  const newAdded = currentMonthEquipments.reduce((sum, equipment) => {
    const lastHistory = equipment.history[equipment.history.length - 1];
    return sum + (lastHistory ? Number(lastHistory.addedStock) : 0);
  }, 0);

  // Calculate all stock before this month
  const previousEquipments = equipments.filter(equipment => {
    const equipmentMonth = new Date(equipment.dateAdded.seconds * 1000).getMonth();
    return equipmentMonth !== currentMonth;
  });

  const previousStock = previousEquipments.reduce((sum, equipment) => sum + Number(equipment.stocks), 0);

  const percentageIncrease = previousStock === 0 ? 100 : (newAdded / previousStock) * 100;

  console.log(percentageIncrease);



  return (
    <Card sx={{ bgcolor: 'secondary.light' }}>
      <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle1" sx={{ color: 'secondary.dark' }}>
                Inventory Summary
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" sx={{ color: 'grey.800' }}>
                {/* {newAdded} Stocks */}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ color: 'grey.800' }}>
            {percentageIncrease.toFixed(0)}% Increase in Equipment This Month
          </Typography>
        </Grid>
      </Grid>
      <Chart {...chartData} />
    </Card>
  );
};

export default ChemistryLabAreaChartCard;