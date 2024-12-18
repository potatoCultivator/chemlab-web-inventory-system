// assets
import { DashboardOutlined, ToolOutlined, ExperimentOutlined, UserOutlined, ReadOutlined, HistoryOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  ToolOutlined,
  ExperimentOutlined,
  UserOutlined,
  ReadOutlined,
  HistoryOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: true
      
    },
    {
      id: 'equipments',
      title: 'Equipments',
      type: 'item',
      url: '/equipments',
      icon: icons.ExperimentOutlined,
      breadcrumbs: true,
    },
    {
      id: 'borrowers',
      title: 'Borrowers',
      type: 'item',
      url: '/borrowers',
      icon: icons.ReadOutlined,
      breadcrumbs: true
    },
    {
      id: 'instructors',
      title: 'Instructors',
      type: 'item',
      url: '/instructors',
      icon: icons.UserOutlined,
      breadcrumbs: true
    },
    {
      id: 'history',
      title: 'History',
      type: 'item',
      url: '/history',
      icon: icons.HistoryOutlined,
      breadcrumbs: true
    }
  ]
};

export default dashboard;