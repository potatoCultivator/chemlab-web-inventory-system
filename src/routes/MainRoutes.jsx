import { lazy } from 'react';
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import ProtectedRoute from 'components/ProtectedRoute';

// Lazy load components
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const ToolsAndEquipment = Loadable(lazy(() => import('pages/tools-equipments/index')));
const Borrowers = Loadable(lazy(() => import('pages/borrowers/index')));
const Instructors = Loadable(lazy(() => import('pages/instructors/index')));
const History = Loadable(lazy(() => import('pages/history/index')));

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
      element: <ProtectedRoute element={<ToolsAndEquipment />} /> // Protect this route
    },
    {
      path: 'borrowers',
      element: <ProtectedRoute element={<Borrowers />} /> // Protect this route
    },
    {
      path: 'instructors',
      element: <ProtectedRoute element={<Instructors />} /> // Protect this route
    },
    {
      path: 'history',
      element: <ProtectedRoute element={<History />} /> // Protect this route
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    }
  ]
};

export default MainRoutes;
