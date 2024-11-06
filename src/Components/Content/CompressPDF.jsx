import React, { useState, useEffect } from "react";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Upload, message, Progress } from "antd";
import axios from "axios";

export default function CompressPDF() {
  const [fileList, setFileList] = useState([]);
  const [compressedFiles, setCompressedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    // Thiết lập kết nối SSE để nhận tiến trình nén
    const eventSource = new EventSource(
      "http://localhost:4000/compress/progress"
    );

    eventSource.onmessage = (event) => {
      setUploadProgress(Number(event.data)); // Cập nhật tiến trình nén từ server
    };

    // Cleanup khi component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  const handleChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-2);
    setFileList(newFileList);
  };

  const handleCompress = async (file) => {
    const formData = new FormData();
    formData.append("file", file.originFileObj);

    try {
      const response = await axios.post(
        "http://localhost:4000/compress",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const fileUrl = URL.createObjectURL(blob);
        setCompressedFiles([
          {
            uid: "-1",
            name: `compressed_${file.name}`,
            status: "done",
            url: fileUrl,
          },
        ]);
        setUploadProgress(0);
      } else {
        message.error("Failed to compress PDF");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred during compression");
      setUploadProgress(0);
    }
  };

  const props = {
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf";
      if (!isPDF) {
        message.error(`${file.name} is not a PDF file`);
      }
      return isPDF || Upload.LIST_IGNORE;
    },
    onChange: handleChange,
    multiple: false,
  };

  return (
    <div>
      <Upload {...props} fileList={fileList}>
        <Button icon={<UploadOutlined />}>Upload PDF</Button>
      </Upload>
      {fileList.map((file) => (
        <div key={file.uid} style={{ marginTop: "10px" }}>
          <Button onClick={() => handleCompress(file)}>
            Compress {file.name}
          </Button>
          <Progress
            percent={uploadProgress}
            type="line"
            style={{ marginTop: "10px" }}
          />
        </div>
      ))}
      {compressedFiles.map((file) => (
        <div key={file.uid} style={{ marginTop: "10px" }}>
          <a href={file.url} download={file.name}>
            <Button icon={<DownloadOutlined />}>Download {file.name}</Button>
          </a>
        </div>
      ))}
    </div>
  );
}
