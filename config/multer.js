// config/multer.js
const multer = require('multer');

// Cấu hình Multer để xử lý tệp tải lên
const storage = multer.memoryStorage(); // Lưu trữ tệp trong bộ nhớ (để upload lên Cloudinary)
const upload = multer({ storage: storage });

module.exports = upload;
