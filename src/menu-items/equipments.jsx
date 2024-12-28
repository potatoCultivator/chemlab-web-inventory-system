// assets
import { ExperimentOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';

// icons
const icons = {
  ExperimentOutlined,
  CloseCircleOutlined,
  SyncOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const equipments = {
  id: 'equipments',
  title: 'Equipments',
  type: 'group',
  children: [
    {
      id: 'list',
      title: 'List of Equipments',
      type: 'item',
      url: '/equipments',
      icon: icons.ExperimentOutlined,
      breadcrumbs: true,
    },
    {
      id: 'damaged-equipments',
      title: 'Damaged Equipments',
      type: 'item',
      url: '/damaged-equipments',
      icon: icons.CloseCircleOutlined,
      breadcrumbs: true,
    },
    {
      id: 'replaced-equipments',
      title: 'Replaced Equipments',
      type: 'item',
      url: '/replaced-equipments',
      icon: icons.SyncOutlined,
      breadcrumbs: true,
    }
  ]
};

export default equipments;
