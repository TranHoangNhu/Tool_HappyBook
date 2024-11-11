import React, { useState, useEffect } from "react";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Upload, message, Progress, Slider } from "antd";
import axios from "axios";

export default function CompressPDF() {
  const [fileList, setFileList] = useState([]);
  const [compressedFiles, setCompressedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);

  // State variables for adjusting scale and image quality
  const [scale, setScale] = useState(1000);
  const [imageQuality, setImageQuality] = useState(75);

  useEffect(() => {
    let eventSource;
    if (isCompressing) {
      eventSource = new EventSource("https://api.happybook.com.vn/progress.php");

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.totalPages) {
            setTotalPages(data.totalPages);
            setUploadProgress(
              data.totalPages > 0
                ? Math.round((data.completedPages / data.totalPages) * 100)
                : 0
            );
          }
        } catch (error) {
          console.error("Error parsing progress data:", error);
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
      };
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [isCompressing]);

  const handleChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-2);
    setFileList(newFileList);
  };

  const handleCompress = async (file) => {
    setIsCompressing(true);
    setUploadProgress(0);
    setTotalPages(0);
    const formData = new FormData();
    formData.append("file", file.originFileObj);
    formData.append("scale", scale);
    formData.append("imageQuality", imageQuality);

    try {
      const response = await axios.post(
        "https://api.happybook.com.vn/compress.php",
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
        setUploadProgress(100);
        setTotalPages(0);
        message.success("Compression completed successfully");
      } else {
        message.error("Failed to compress PDF");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred during compression");
      setUploadProgress(0);
      setTotalPages(0);
    } finally {
      setIsCompressing(false);
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
        <h3>Scale: {scale}</h3>
        <Slider
          min={10}
          max={2000}
          value={scale}
          onChange={setScale}
          marks={{
            10: "10",
            500: "500",
            1000: "1000 (default)",
            1500: "1500",
            2000: "2000",
          }}
        />

        <h3>Image Quality: {imageQuality}</h3>
        <Slider
          min={0}
          max={100}
          value={imageQuality}
          onChange={setImageQuality}
          marks={{ 0: "0%", 50: "50%", 75: "75% (default)", 100: "100%" }}
        />
      </div>

      {fileList.map((file) => (
        <div key={file.uid} style={{ marginTop: "20px" }}>
          <Button onClick={() => handleCompress(file)} disabled={isCompressing}>
            {isCompressing ? "Compressing..." : `Compress ${file.name}`}
          </Button>
          <Progress
            percent={uploadProgress}
            type="line"
            style={{ marginTop: "10px" }}
            status={
              uploadProgress === 100
                ? "success"
                : isCompressing
                ? "active"
                : "normal"
            }
          />
          {totalPages > 0 && (
            <p>
              Processing {uploadProgress}% of {totalPages} pages
            </p>
          )}
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
