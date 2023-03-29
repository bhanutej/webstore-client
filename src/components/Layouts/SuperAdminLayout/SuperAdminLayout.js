import {
  FileOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../../NavBar/NavBar';
import "./SuperAdminLayout.css";

const { Content, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('Dashboard', '1', <PieChartOutlined />),
  getItem('Users', '2', <UserOutlined />),
  getItem('News Letters', '3', <FileOutlined />),
  getItem('Enquires', '4', <FileOutlined />),
];
export const SuperAdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
      id="components-layout-demo-side"
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout className="site-layout">
        <Navbar />
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};