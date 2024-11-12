import React, { useState } from "react";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Upload, message, Progress, Slider } from "antd";
import jsPDF from "jspdf";
import * as pdfjsLib from "pdfjs-dist/webpack";

// Cấu hình worker cho pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";

export default function CompressPDF() {
  const formatFileSize = (size) => {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
    else return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const [fileList, setFileList] = useState([]);
  const [compressedFiles, setCompressedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);

  // State variables for adjusting scale and image quality
  const [scale, setScale] = useState(90);
  const [imageQuality, setImageQuality] = useState(100);

  const handleChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    setFileList(newFileList);
  };

  const handleCompress = async (file) => {
    setIsCompressing(true);
    setUploadProgress(0);
    setTotalPages(0);

    const reader = new FileReader();
    reader.onload = async function (event) {
      const typedarray = new Uint8Array(event.target.result);

      pdfjsLib.getDocument(typedarray).promise.then(async function (pdf) {
        const total = pdf.numPages;
        setTotalPages(total);

        let pdfDoc;
        for (let i = 1; i <= total; i++) {
          const page = await pdf.getPage(i);
                    const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          // Adjust canvas size based on the longest dimension and keep aspect ratio
                    const adjustedScale = scale / 100;
          const adjustedViewport = page.getViewport({ scale: adjustedScale });

          canvas.height = adjustedViewport.height;
          canvas.width = adjustedViewport.width;

          await page.render({
            canvasContext: context,
            viewport: adjustedViewport,
          }).promise;

          const imgData = canvas.toDataURL("image/jpeg", imageQuality / 100);

          const orientation =
            adjustedViewport.width > adjustedViewport.height
              ? "landscape"
              : "portrait";
          if (i === 1) {
            pdfDoc = new jsPDF({
              orientation: orientation,
              unit: "mm",
              format: [adjustedViewport.width, adjustedViewport.height],
            });
          } else {
            pdfDoc.addPage(
              [adjustedViewport.width, adjustedViewport.height],
              orientation
            );
          }

          pdfDoc.addImage(
            imgData,
            "JPEG",
            0,
            0,
            adjustedViewport.width,
            adjustedViewport.height
          );
          setUploadProgress(Math.round((i / total) * 100));
        }

        // Sau khi hoàn tất phân tích, nén và tải về PDF mới
        const blob = pdfDoc.output("blob");
        const fileUrl = URL.createObjectURL(blob);
        setCompressedFiles([
          {
            uid: "-1",
            name: `compressed_${file.name}`,
            status: "done",
            url: fileUrl,
            size: blob.size,
          },
        ]);
        setUploadProgress(100);
        message.success("Nén thành công");
      });
    };

    reader.readAsArrayBuffer(file.originFileObj);
    setIsCompressing(false);
  };

  const props = {
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf";
      if (!isPDF) {
        message.error(`${file.name} không phải là tệp PDF`);
      }
      return isPDF || Upload.LIST_IGNORE;
    },
    onChange: handleChange,
    multiple: false,
  };

  return (
    <div>
      <Upload {...props} fileList={fileList}>
        <Button icon={<UploadOutlined />}>Tải lên PDF</Button>
      </Upload>

      <div style={{ marginTop: "20px" }}>
        <h3>Tỉ lệ thu nhỏ (1-100%): {scale}%</h3>
        <span>
          <input
            type="number"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            min={1} max={100}
            style={{ marginLeft: "10px", padding: "5px", fontSize: "1.2rem" }}
          />
          &nbsp;%
        </span>
        <Slider
          min={1}
          max={100}
          value={scale} onChange={setScale} marks={{
            1: "1%",
            25: "25%",
            50: "50%",
            75: "75%",
            100: "100%"
          }}
        />

        <h3>Chất lượng hình ảnh: {imageQuality}&nbsp;DPI</h3>
        <span>
          <input
            type="number"
            value={imageQuality}
            onChange={(e) => setImageQuality(Number(e.target.value))}
            min={50}
            max={300}
            style={{ marginLeft: "10px", padding: "5px", fontSize: "1.2rem" }}
          />
          &nbsp;DPI
        </span>
        <Slider
          min={50}
          max={300}
          value={imageQuality}
          onChange={setImageQuality}
          marks={{ 50: "10%", 100: "50%", 200: "75% (default)", 300: "100%" }}
        />
      </div>

      {fileList.map((file) => (
        <div key={file.uid} style={{ marginTop: "20px" }}>
          <Button onClick={() => handleCompress(file)} disabled={isCompressing}>
            {isCompressing ? "Đang nén..." : `Nén ${file.name}`}
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
            <Button icon={<DownloadOutlined />}>Tải xuống {file.name}</Button>
          </a>
          <div style={{ marginLeft: "10px", display: "inline-block" }}>
            Kích thước sau khi nén: {formatFileSize(file.size)}
          </div>
        </div>
      ))}
    </div>
  );
}
