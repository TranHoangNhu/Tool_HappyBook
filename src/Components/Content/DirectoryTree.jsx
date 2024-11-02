// DirectoryTree.jsx
import React from "react";
import { Tree } from "antd";

const directoryData = [
  {
    title: "Main Folder",
    key: "0-0",
    children: [
      {
        title: "Sub Folder 1",
        key: "0-0-0",
        children: [
          { title: "File 1", key: "0-0-0-0" },
          { title: "File 2", key: "0-0-0-1" },
        ],
      },
      {
        title: "Sub Folder 2",
        key: "0-0-1",
        children: [
          { title: "File 3", key: "0-0-1-0" },
          { title: "File 4", key: "0-0-1-1" },
        ],
      },
    ],
  },
  {
    title: "KEI Calculator",
    key: "1-0",
    children: [
      { title: "Keyword Density", key: "1-0-0" },
      { title: "KEI Calculator", key: "1-0-1" },
    ],
  },
];

export default function DirectoryTree() {
  return <Tree showIcon defaultExpandAll treeData={directoryData} />;
}
