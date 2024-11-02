import React, { useState } from 'react';
import { Button, Table, Upload, Dropdown, Menu } from 'antd';
import { UploadOutlined, DownOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import 'antd/dist/reset.css';

const Toolcodehappybook = () => {
  const [data, setData] = useState([]);
  const [sortAscending, setSortAscending] = useState(true);
  const [isExportVisible, setIsExportVisible] = useState(false);

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const tableData = jsonData.slice(1).map((row, index) => ({
        key: index,
        keyword: row[0],
        searchVolume: row[1],
        numOfResults: row[2],
        kei: row[2] ? ((row[1] * row[1]) / row[2]).toFixed(2) : 0,
        rating: row[2] ? ((row[1] * row[1]) / row[2]) > 100 ? 'Cao' : ((row[1] * row[1]) / row[2]) > 10 ? 'Trung bình' : 'Thấp' : 'Thấp'
      }));
      setData(tableData);
    };
    reader.readAsBinaryString(file);
    return false;
  };

  const handleSort = () => {
    const sortedData = [...data].sort((a, b) => sortAscending ? a.kei - b.kei : b.kei - a.kei);
    setData(sortedData);
    setSortAscending(!sortAscending);
  };

  const exportToCSV = () => {
    const csvContent = data.map(row => {
      return `${row.keyword},${row.kei},${row.rating}`;
    }).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'export.csv';
    link.click();
  };

  const exportToXLSX = () => {
    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      ['Keyword', 'KEI', 'Keyword Rating'],
      ...data.map(row => [row.keyword, row.kei, row.rating])
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'KEI Data');
    XLSX.writeFile(workbook, 'export.xlsx');
  };

  const columns = [
    {
      title: 'Keyword',
      dataIndex: 'keyword',
      key: 'keyword',
    },
    {
      title: (
        <div onClick={handleSort} style={{ cursor: 'pointer' }}>
          KEI {sortAscending ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        </div>
      ),
      dataIndex: 'kei',
      key: 'kei',
    },
    {
      title: 'Keyword Rating',
      dataIndex: 'rating',
      key: 'rating',
    },
  ];

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={exportToCSV}>Xuất CSV</Menu.Item>
      <Menu.Item key="2" onClick={exportToXLSX}>Xuất XLSX</Menu.Item>
    </Menu>
  );

  return (
    <div className="container">
      <h2 className="mb-4">KEI Calculator</h2>
      <Upload beforeUpload={handleFileUpload} showUploadList={false}>
        <Button icon={<UploadOutlined />}>Tải lên file</Button>
      </Upload>
      <Dropdown overlay={menu} visible={isExportVisible} onVisibleChange={setIsExportVisible}>
        <Button className="mt-3">Xuất File <DownOutlined /></Button>
      </Dropdown>
      <Table className="mt-3" columns={columns} dataSource={data} pagination={false} />
    </div>
  );
};

export default Toolcodehappybook;
