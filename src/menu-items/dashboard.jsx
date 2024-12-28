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
  ]
};

export default dashboard;