// Sidebar.jsx
import React from "react";
import { Layout, Menu } from "antd";
import {
  // UserOutlined,
  VideoCameraOutlined,
  // UploadOutlined,
  FolderOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

export default function Sidebar({ collapsed, setCollapsed, setSelectedNav }) {
  return (
    <Sider trigger={null} collapsible collapsed={collapsed} breakpoint="lg">
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        onClick={({ key }) => setSelectedNav(key)}
        items={[
          // {
          //   key: "1",
          //   icon: <UserOutlined />,
          //   label: "nav 1",
          // },
          {
            key: "2",
            icon: <VideoCameraOutlined />,
            label: "KEI & Keyword Density",
            children: [
              {
                key: "2-1",
                icon: <CalculatorOutlined />,
                label: "Keyword Density",
              },
              {
                key: "2-2",
                icon: <CalculatorOutlined />,
                label: "KEI Calculator",
              },
            ],
          },
          // {
          //   key: "3",
          //   icon: <UploadOutlined />,
          //   label: "nav 3",
          // },
          {
            key: "4",
            icon: <FolderOutlined />,
            label: "Directory Tree",
          },
        ]}
      />
    </Sider>
  );
}
