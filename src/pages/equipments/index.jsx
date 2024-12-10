// project import
import MainTable from './MainTable';
import CustomTab from './CustomTab';

// ==============================|| SAMPLE PAGE ||============================== //

export default function Equipments() {
  return (
    <>
      {/* <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary">
          Add
        </Button>
      </Box> */}
        <CustomTab />
        <MainTable />
    </>
    // <MainCard title="Equipments">
    //     <MainTable />
    // </MainCard>
  );
}