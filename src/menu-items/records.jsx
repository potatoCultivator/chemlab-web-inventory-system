// assets
import { DashboardOutlined, ToolOutlined, ExperimentOutlined, UserOutlined, ReadOutlined, HistoryOutlined, FileTextOutlined } from '@ant-design/icons';

// icons
const icons = {
    DashboardOutlined,
    ToolOutlined,
    ExperimentOutlined,
    UserOutlined,
    ReadOutlined,
    HistoryOutlined,
    FileTextOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard2 = {
    id: 'records',
    title: 'Records',
    type: 'group',
    children: [
        // {
        //     id: 'invoice',
        //     title: 'Invoice',
        //     type: 'item',
        //     url: '/invoice',
        //     icon: icons.FileTextOutlined,
        //     breadcrumbs: true
        // },
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