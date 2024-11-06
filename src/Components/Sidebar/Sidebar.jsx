// Sidebar.jsx
import React from "react";
import { Layout, Menu } from "antd";
import {
  FormOutlined,
  LineChartOutlined,
  FunctionOutlined,
  FolderOpenOutlined,
  FileZipOutlined,
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
          {
            key: "1",
            icon: <FolderOpenOutlined />,
            label: "TIỆN ÍCH TÀI LIỆU",
            children: [
              {
                key: "1-1",
                icon: <FileZipOutlined />,
                label: "NÉN FILE PDF",
              },
            ],
          },
          {
            key: "2",
            icon: <LineChartOutlined />,
            label: "TOOL MARKETING",
            children: [
              {
                key: "2-1",
                icon: <FormOutlined />,
                label: "MẬT ĐỘ & ĐỀ XUẤT TỪ KHÓA",
              },
              {
                key: "2-2",
                icon: <FunctionOutlined />,
                label: "TÍNH CHỈ SỐ KEI",
              },
            ],
          },
        ]}
      />
    </Sider>
  );
}
