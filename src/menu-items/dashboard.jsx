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
      breadcrumbs: false
    },
    {
      id: 'tools-equipments',
      title: 'Tools and Equipments',
      type: 'item',
      url: '/tools-equipments',
      icon: icons.ExperimentOutlined,
      breadcrumbs: false
    },
    {
      id: 'borrowers',
      title: 'Borrowers',
      type: 'item',
      url: '/borrowers',
      icon: icons.ReadOutlined,
      breadcrumbs: false
    },
    {
      id: 'instructors',
      title: 'Instructors',
      type: 'item',
      url: '/instructors',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'history',
      title: 'History',
      type: 'item',
      url: '/history',
      icon: icons.HistoryOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;