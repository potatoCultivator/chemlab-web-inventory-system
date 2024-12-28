// assets
import { DatabaseOutlined, WarningOutlined } from '@ant-design/icons';

// icons
const icons = {
  DatabaseOutlined,
  WarningOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'equipments',
  title: 'Equipments',
  type: 'group',
  children: [
    {
      id: 'list',
      title: 'List of Equipments',
      type: 'item',
      url: '/equipments',
      icon: icons.DatabaseOutlined,
      breadcrumbs: true,
    },
    {
      id: 'damaged-equipments',
      title: 'Damaged Equipments',
      type: 'item',
      url: '/damaged-equipments',
      icon: icons.WarningOutlined,
      breadcrumbs: true,
    },
  ]
};

export default pages;
