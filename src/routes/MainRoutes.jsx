import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import { element } from 'prop-types';

// Lazy load components
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const ToolsAndEquipment = Loadable(lazy(() => import('pages/tools-equipments/index')));
const Borrowers = Loadable(lazy(() => import('pages/borrowers/index')));
const Instructors = Loadable(lazy(() => import('pages/instructors/index')));
const History = Loadable(lazy(() => import('pages/history/index')));
const ViewProfile = Loadable(lazy(() => import('pages/admin-profile/UserProfile')));
const EditProfile = Loadable(lazy(() => import('pages/admin-profile/EditProfile')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'tools-equipments',
      element: <ToolsAndEquipment />
    },
    {
      path: 'borrowers',
      element: <Borrowers />
    },
    {
      path: 'instructors',
      element: <Instructors />
    },
    {
      path: 'history',
      element: <History />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'admin-profile',
      element: <ViewProfile />
    },
    {
      path: 'edit-profile',
      element: <EditProfile />
    },
  ]
};

export default MainRoutes;