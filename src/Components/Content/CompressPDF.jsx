import React, { useState, useEffect } from "react";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Upload, message, Progress, Slider } from "antd";
import axios from "axios";

export default function CompressPDF() {
  const [fileList, setFileList] = useState([]);
  const [compressedFiles, setCompressedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0); // Số trang tổng cộng của PDF

  // Các state để tùy chỉnh nén
  const [colorImageDPI, setColorImageDPI] = useState(72);
  const [grayImageDPI, setGrayImageDPI] = useState(72);
  const [monoImageDPI, setMonoImageDPI] = useState(72);
  const [jpegQuality, setJpegQuality] = useState(80);

  useEffect(() => {
    let eventSource;
    if (fileList.length > 0) {
      // Thiết lập kết nối SSE để nhận tiến trình nén
      eventSource = new EventSource(
        "http://localhost:4000/compress/progress"
      );

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { completedPages, totalPages } = data;
          setTotalPages(totalPages);
          setUploadProgress(Math.round((completedPages / totalPages) * 100)); // Cập nhật tiến trình nén từ server
        } catch (error) {
          console.error("Error parsing progress data:", error);
        }
      };
    }

    // Cleanup khi component unmount
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [fileList]);

  const handleChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-2);
    setFileList(newFileList);
  };

  const handleCompress = async (file) => {
    const formData = new FormData();
    formData.append("file", file.originFileObj);
    formData.append("colorImageDPI", colorImageDPI);
    formData.append("grayImageDPI", grayImageDPI);
    formData.append("monoImageDPI", monoImageDPI);
    formData.append("jpegQuality", jpegQuality);

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
        setUploadProgress(100); // Đặt tiến trình thành 100% khi hoàn tất
        setTotalPages(0);
      } else {
        message.error("Failed to compress PDF");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred during compression");
      setUploadProgress(0);
      setTotalPages(0);
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
      <div style={{ marginTop: "20px" }}>
        <h3>Color Image DPI: {colorImageDPI}</h3>
        <Slider
          min={10}
          max={300}
          value={colorImageDPI}
          onChange={setColorImageDPI}
          marks={{ 10: "10 DPI", 30: "30 DPI (default)", 150: "150 DPI", 300: "300 DPI" }}
        />

        <h3>Gray Image DPI: {grayImageDPI}</h3>
        <Slider
          min={72}
          max={300}
          value={grayImageDPI}
          onChange={setGrayImageDPI}
          marks={{ 72: "72 DPI", 150: "150 DPI", 300: "300 DPI" }}
        />

        <h3>Monochrome Image DPI: {monoImageDPI}</h3>
        <Slider
          min={72}
          max={300}
          value={monoImageDPI}
          onChange={setMonoImageDPI}
          marks={{ 72: "72 DPI", 150: "150 DPI", 300: "300 DPI" }}
        />

        <h3>JPEG Quality: {jpegQuality}</h3>
        <Slider
          min={0}
          max={100}
          value={jpegQuality}
          onChange={setJpegQuality}
          marks={{ 0: "0%", 50: "50%", 100: "100%" }}
        />
      </div>

      {fileList.map((file) => (
        <div key={file.uid} style={{ marginTop: "20px" }}>
          <Button onClick={() => handleCompress(file)}>
            Compress {file.name}
          </Button>
          <Progress
            percent={uploadProgress}
            type="line"
            style={{ marginTop: "10px" }}
            status={uploadProgress === 100 ? "success" : "active"} // Cập nhật trạng thái khi hoàn thành
          />
          <p>
            {totalPages > 0 ? `Processing ${uploadProgress}% of ${totalPages} pages` : null}
          </p>
        </div>
      ))}
      {compressedFiles.map((file) => (
        <div key={file.uid} style={{ marginTop: "20px" }}>
          <a href={file.url} download={file.name}>
            <Button icon={<DownloadOutlined />}>Download {file.name}</Button>
          </a>
        </div>
      ))}
    </div>
  );
}
