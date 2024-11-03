import React from 'react';
import { Layout, theme } from 'antd';
import CustomHeader from './Components/Header/Header';
import Sidebar from './Components/Sidebar/Sidebar';
import DirectoryTree from './Components/Content/DirectoryTree';
import TinhKEI from './Components/Content/TinhKEI';
import Dexuattukhoa from './Components/Content/Dexuattukhoa';

const { Content } = Layout;

export default function App() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [selectedNav, setSelectedNav] = React.useState('1');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const renderContent = () => {
    switch (selectedNav) {
      case '1':
        return <h1>Welcome to Nav 1</h1>;
      case '2-1':
        return <Dexuattukhoa />;
      case '2-2':
        return <TinhKEI />;
      case '4':
        return <DirectoryTree />;
      default:
        return <h1>Select a navigation item</h1>;
    }
  };

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} setSelectedNav={setSelectedNav} />
      <Layout>
        <CustomHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderContent()}
          {/* {renderContent()} */}
        </Content>
      </Layout>
    </Layout>
  );
}

