const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 4000;

// Sử dụng CORS để cho phép yêu cầu từ mọi nguồn
app.use(cors());

// Thiết lập nơi lưu trữ file được tải lên
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Giữ nguyên tên gốc của file mà không thêm dãy số phía trước
  },
});

const upload = multer({ storage });

// Endpoint xử lý upload
app.post("/upload", upload.single("upload"), (req, res) => {
  if (req.file) {
    res.status(200).json({
      url: `http://localhost:${PORT}/uploads/${req.file.filename}`,
    });
  } else {
    res.status(400).send("Upload failed");
  }
});

// Static route để phục vụ các file đã tải lên
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Khởi động máy chủ
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
