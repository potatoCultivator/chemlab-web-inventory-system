import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project import
import Drawer from './Drawer';
import Header from './Header';
import navigation from 'menu-items';
import Loader from 'components/Loader';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import CustomButton from 'pages/equipments/CustomButton';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
  const location = useLocation();

  useEffect(() => {
    handlerDrawerOpen(!downXL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  // Find the current navigation item based on the location
  const currentNavItem = navigation.children?.find(
    (item) => item.url === location.pathname
  );

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header />
      <Drawer />
      <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Breadcrumbs navigation={navigation} title />
          {currentNavItem?.showButton && (
            <CustomButton type="add" variant="contained" color="primary">
              Add
            </CustomButton>
          )}
        </Box>
        <Outlet />
      </Box>
    </Box>
  );
}