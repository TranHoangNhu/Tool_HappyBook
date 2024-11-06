const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors()); // Bật CORS để cho phép truy cập từ frontend

const upload = multer({ dest: "uploads/" });
let progress = 0; // Biến lưu tiến trình

// Endpoint SSE để gửi tiến trình nén cho client
app.get("/compress/progress", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendProgress = () => {
    res.write(`data: ${progress}\n\n`);
  };

  const intervalId = setInterval(sendProgress, 500); // Gửi tiến trình mỗi 0.5s

  // Cleanup khi kết nối đóng
  req.on("close", () => {
    clearInterval(intervalId);
  });
});

app.post("/compress", upload.single("file"), async (req, res) => {
  if (!req.file) {
    console.error("No file uploaded");
    return res.status(400).send("No file uploaded");
  }

  const inputPath = req.file.path;
  const outputPath = path.resolve(
    "uploads",
    `compressed_${req.file.originalname.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`
  );

  try {
    // Lệnh Ghostscript nén file PDF
    const command = `"C:/Program Files/gs/gs10.04.0/bin/gswin64c.exe" -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;
    console.log("Running command:", command);

    // Giả lập tiến trình nén
    progress = 0;
    const interval = setInterval(() => {
      if (progress < 100) {
        progress += 20; // Cập nhật tiến trình (tăng 20% mỗi 0.5 giây)
      } else {
        clearInterval(interval);
      }
    }, 500);

    // Thực thi lệnh Ghostscript
    exec(command, (error, stdout, stderr) => {
      clearInterval(interval); // Dừng giả lập tiến trình khi hoàn tất

      if (error) {
        console.error("Error during PDF compression:", error);
        console.error("stderr:", stderr);
        progress = 0; // Đặt lại tiến trình khi có lỗi
        return res.status(500).send(`Error compressing PDF: ${stderr}`);
      }

      console.log("stdout:", stdout);
      console.log("Compression finished, checking output...");

      // Kiểm tra sự tồn tại của file nén
      fs.access(outputPath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error("Compressed file not found:", outputPath);
          return res.status(404).send("Compressed file not found");
        }

        // Gửi file nén cho client
        res.download(outputPath, (err) => {
          if (err) {
            console.error("Error during download:", err);
            return res.status(500).send("Error downloading compressed PDF");
          }

          // Xóa các file tạm
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
          progress = 0; // Đặt lại tiến trình sau khi hoàn tất
        });
      });
    });
  } catch (error) {
    console.error("Error during PDF compression:", error);
    res.status(500).send("Error compressing PDF");
  }
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
