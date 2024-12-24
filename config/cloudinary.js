// config/cloudinary.js
const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary bằng API key và secret từ bảng điều khiển của bạn
cloudinary.config({
  cloud_name: 'do5twr1ut',     // Thay bằng cloud name của bạn
  api_key: '237859531426654',          // Thay bằng API Key của bạn
  api_secret: 'rDv7K7fpQwopqi102FYmMQ-r-KE'     // Thay bằng API Secret của bạn
});

module.exports = cloudinary;
