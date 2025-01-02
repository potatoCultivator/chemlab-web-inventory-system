// assets
import { HistoryOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';

// icons
const icons = {
    HistoryOutlined,
    WarningOutlined,
    CheckCircleOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard2 = {
    id: 'records',
    title: 'Records',
    type: 'group',
    children: [
        {
            id: 'liable-students',
            title: 'Liability Records',
            type: 'item',
            url: '/liablestudents',
            icon: icons.WarningOutlined,
            breadcrumbs: true
        },
        {
            id: 'history',
            title: 'History',
            type: 'item',
            url: '/history',
            icon: icons.HistoryOutlined,
            breadcrumbs: true
        },
    ]
};

export default dashboard2;