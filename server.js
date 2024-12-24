const express = require('express');
const app = express();
const PORT = 3000;

const fs = require('fs');
const path = require('path');

// Middleware để xử lý file tĩnh
app.use(express.static('public'));
app.use(express.json());

// import danh sách route
const routesDir = path.join(__dirname, 'routes');
fs.readdirSync(routesDir).forEach((file) => {
    const filePath = path.join(routesDir, file);

    // Chỉ xử lý các file JavaScript
    if (file.endsWith('.js')) {
        const routePath = `/${file.replace('.js', '').toLowerCase()}`; // Tự động tạo route path từ tên file
        const route = require(filePath); // Import route file

        app.use(routePath, route); // Áp dụng route vào app
        console.log(`Loaded route: ${routePath}`);
    }
});

// Route cơ bản
app.get('/', (req, res) => {
    res.send('Hello, Node.js!');
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
