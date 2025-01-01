// assets
import { DashboardOutlined, ToolOutlined, ExperimentOutlined, UserOutlined, ReadOutlined, HistoryOutlined, WarningOutlined, DollarOutlined } from '@ant-design/icons';

// icons
const icons = {
    DashboardOutlined,
    ToolOutlined,
    ExperimentOutlined,
    UserOutlined,
    ReadOutlined,
    HistoryOutlined,
    WarningOutlined,
    DollarOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const borrowers = {
    id: 'borrowers',
    title: 'Borrowers',
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
            id: 'liable-students',
            title: 'Liability Records',
            type: 'item',
            url: '/liablestudents',
            icon: icons.WarningOutlined,
            breadcrumbs: true
        },
   ]
};

export default borrowers;