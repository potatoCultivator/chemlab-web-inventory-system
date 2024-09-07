// assets
import { DashboardOutlined, ToolOutlined, ExperimentOutlined, UserOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  ToolOutlined,
  ExperimentOutlined,
  UserOutlined
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
    }
    ,
    {
      id: 'borrowers',
      title: 'Borrowers',
      type: 'item',
      url: '/borrowers',
      icon: icons.UserOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
