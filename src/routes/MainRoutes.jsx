import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
// import { element } from 'prop-types';

// Lazy load components
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
// const ToolsAndEquipment = Loadable(lazy(() => import('pages/tools-equipments/index')));
const Equipments = Loadable(lazy(() => import('pages/equipments/index')));
const Borrowers = Loadable(lazy(() => import('pages/borrowers/index')));
const Instructors = Loadable(lazy(() => import('pages/instructors/index')));
const History = Loadable(lazy(() => import('pages/history/index')));
const ViewProfile = Loadable(lazy(() => import('pages/admin-profile/UserProfile')));
const EditProfile = Loadable(lazy(() => import('pages/admin-profile/EditProfile')));
const DamagedEquipments = Loadable(lazy(() => import('pages/damaged-equipments/index')));
const ReplacedEquipments = Loadable(lazy(() => import('pages/replaced-equipments/index')));
const LiableStudents = Loadable(lazy(() => import('pages/liable_student/index')));
const CompensatingStudents = Loadable(lazy(() => import('pages/compensating_student/index')));

// render - sample page
// const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

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
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'equipments',
      element: <Equipments />
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
      path: 'admin-profile',
      element: <ViewProfile />
    },
    {
      path: 'edit-profile',
      element: <EditProfile />
    },
    {
      path: 'damaged-equipments',
      element: <DamagedEquipments />
    },
    {
      path: 'replaced-equipments',
      element: <ReplacedEquipments />
    },
    {
      path: 'liablestudents',
      element: <LiableStudents />
    },
    {
      path: 'compenstudents',
      element: <CompensatingStudents />
    }
  ]
};

export default MainRoutes;