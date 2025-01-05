import React, { useEffect } from 'react';
// material-ui
// import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';
import InstructorRegistration from './InstructorRegistration';
import InstructorTable from './InstructorTable';

// ==============================|| SAMPLE PAGE ||============================== //

export default function Instructors() {
    useEffect(() => {
      document.title = "Instructors • ChemLab ";
    }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}  md={8}>
        <MainCard title="List" content={InstructorTable} >
          <InstructorTable />
        </MainCard>
      </Grid>
      <Grid item xs={12}  md={4}>
        <MainCard title="Teacher Registration" content={InstructorRegistration} >
          <InstructorRegistration />
        </MainCard>
      </Grid>
    </Grid>
  );
}