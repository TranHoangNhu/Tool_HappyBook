import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import style của QuillJS
import { Button } from "antd"; // Sử dụng nút của Ant Design
import { CodeOutlined, EditOutlined } from "@ant-design/icons"; // Import các icon

export default function Dexuattukhoa() {
  const [content, setContent] = useState("<p>Nhập nội dung tại đây...</p>");
  const [isCodeView, setIsCodeView] = useState(false);
  const quillRef = useRef(null);

  // Thay đổi trạng thái editor
  const handleToggleCodeView = () => {
    setIsCodeView((prev) => !prev);
  };

  return (
    <div className="container">
      <h1 className="mb-4">ĐỀ XUẤT VÀ TÍNH MẬT ĐỘ TỪ KHÓA</h1>
      {!isCodeView ? (
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          theme="snow"
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }], // Header với các cấp độ khác nhau
              [{ font: [] }], // Font để lựa chọn phông chữ
              ["bold", "italic", "underline", "strike"], // Các nút định dạng văn bản
              [{ list: "ordered" }, { list: "bullet" }], // Danh sách sắp xếp
              [{ align: [] }], // Căn lề: trái, giữa, phải, justify
              ["link", "image", "video"], // Liên kết, hình ảnh, video
              ["code-block"], // Chèn đoạn mã code
              [{ color: [] }, { background: [] }], // Màu văn bản và nền văn bản
              ["clean"], // Nút xóa định dạng
            ],
          }}
          style={{ height: 500 }}
        />
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", height: 500, padding: "10px" }}
        />
      )}
      <div className="mt-4">
        <Button
          type="primary"
          onClick={handleToggleCodeView}
          icon={isCodeView ? <EditOutlined /> : <CodeOutlined />}
          className="mr-2"
        >
          {isCodeView ? "Visual Editor" : "Show Code"}
        </Button>
      </div>
    </div>
  );
}
