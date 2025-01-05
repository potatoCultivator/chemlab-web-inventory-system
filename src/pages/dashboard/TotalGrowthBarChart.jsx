import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'components/MainCard';

// chart data
import chartData from './total-growth-bar-chart';

import { fetchEquipmentsForChart, getEquipmentsList } from 'pages/Query';

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading }) => {
  const theme = useTheme();
  const [equipments, setEquipments] = React.useState([]);
  const [borrowedEquipments, setBorrowedEquipments] = React.useState([]);
  const [series, setSeries] = React.useState([]);

  // Fetch equipment list
  React.useEffect(() => {
    const handleSuccess = (data) => setEquipments(data);
    const handleError = (error) => console.error('Error fetching equipment counts: ', error);
    const unsubscribe = getEquipmentsList(handleSuccess, handleError) || (() => {});
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Fetch borrowed equipment list
  React.useEffect(() => {
    const handleSuccess = (data) => setBorrowedEquipments(data);
    const handleError = (error) => console.error('Error fetching borrowed equipment: ', error);
    const unsubscribe = fetchEquipmentsForChart(handleSuccess, handleError) || (() => {});
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Update series state
  React.useEffect(() => {
    const equipmentNames = equipments.map((equipment) => equipment.name);
    const filteredBorrowedEquipments = borrowedEquipments.filter((borrowed) =>
      equipmentNames.includes(borrowed.name)
    );

    const equipmentSeries = [
      { name: 'Stocks', data: equipments.map((equipment) => equipment.stocks) },
      { name: 'Borrowed', data: equipments.map((equipment) => {
          const borrowed = filteredBorrowedEquipments.find((b) => b.name === equipment.name);
          return borrowed ? borrowed.stocks : 0;
        })
      }
    ];
    setSeries(equipmentSeries);
  }, [equipments, borrowedEquipments]);

  // Theme configuration
  const { primary } = theme.palette.text;
  const divider = theme.palette.divider;
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;

  // Update chart options
  React.useEffect(() => {
    const newChartData = {
      ...chartData.options,
      colors: [primary200, primaryDark, secondaryMain, secondaryLight],
      xaxis: {
        categories: equipments.map((equipment) => equipment.name),
        labels: {
          style: { colors: Array(equipments.length).fill(primary) }
        }
      },
      yaxis: {
        labels: { style: { colors: [primary] } }
      },
      grid: { borderColor: divider },
      tooltip: { theme: 'light' },
      legend: { labels: { colors: grey500 } }
    };

    // Update chart only when not loading
    if (!isLoading) {
      ApexCharts.exec('bar-chart', 'updateOptions', newChartData);
    }
  }, [primary200, primaryDark, secondaryMain, secondaryLight, primary, divider, isLoading, grey500, equipments]);

  // Render
  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <MainCard>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="h4" component="div">
                        Equipment Inventory Overview
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" color="textSecondary">
                        A detailed view of the current stock and borrowed equipment.
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                '& .apexcharts-menu.apexcharts-menu-open': {
                  bgcolor: 'background.paper'
                }
              }}
            >
              {/* Use the series state */}
              <Chart {...chartData} series={series} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
