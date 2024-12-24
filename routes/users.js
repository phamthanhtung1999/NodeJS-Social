const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUsers, getUserById, createUser, editUser, deleteUser, getMe } = require('../controllers/userController');

// Định nghĩa API cho users
router.get('/', getUsers);           // Lấy danh sách users
router.get('/me',authMiddleware, getMe);
router.get('/:id', getUserById);     // Lấy thông tin user theo ID
router.post('/',authMiddleware, createUser);
router.put('/:id',authMiddleware, editUser);
router.delete('/:id',authMiddleware, deleteUser);

module.exports = router;
