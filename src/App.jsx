// App.jsx
import React from "react";
import { Layout, theme } from "antd";
import CustomHeader from "./Components/Header/Header";
import Sidebar from "./Components/Sidebar/Sidebar";
import TinhKEI from "./Components/Content/TinhKEI";
import Dexuattukhoa from "./Components/Content/Dexuattukhoa";
import CompressPDF from "./Components/Content/CompressPDF";

const { Content } = Layout;

export default function App() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [selectedNav, setSelectedNav] = React.useState("1");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const renderContent = () => {
    switch (selectedNav) {
      case "1":
        return (
          <h1>CHÀO MỪNG BẠN ĐẾN VỚI HỆ THỐNG TOOL CỦA HAPPYBOOK TRAVEL</h1>
        );
      case "1-1":
        return <CompressPDF />;
      case "2-1":
        return <Dexuattukhoa />;
      case "2-2":
        return <TinhKEI />;
      default:
        return <h1>Select a navigation item</h1>;
    }
  };

  return (
    <Layout>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        setSelectedNav={setSelectedNav}
      />
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
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}
