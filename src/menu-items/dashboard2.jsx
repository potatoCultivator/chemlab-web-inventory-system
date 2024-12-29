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

const dashboard2 = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'borrowers',
      title: 'Borrowers',
      type: 'item',
      url: '/borrowers',
      icon: icons.ReadOutlined,
      breadcrumbs: true
    },
    {
      id: 'teachers',
      title: 'Teachers',
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

export default dashboard2;