// App.jsx
import React, { useState } from "react";
// import {
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   UploadOutlined,
//   UserOutlined,
//   VideoCameraOutlined,
//   FolderOutlined,
//   CalculatorOutlined,
// } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import CustomHeader from "./Components/Header/Header"; // Không cần phần mở rộng .jsx
import Sidebar from "./Components/Sidebar/Sidebar"; // Không cần phần mở rộng .jsx
import DirectoryTree from "./Components/Content/DirectoryTree";
import TinhKEI from "./Components/Content/TinhKEI";
import Dexuattukhoa from "./Components/Content/Dexuattukhoa";

const { Content } = Layout;

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <CustomHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* Nội dung chính */}
          <DirectoryTree />
          <TinhKEI />
          <Dexuattukhoa />
        </Content>
      </Layout>
    </Layout>
  );
}
