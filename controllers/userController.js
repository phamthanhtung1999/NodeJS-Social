const User = require('../models/User'); // Lấy danh sách tất cả users
const { validate } = require('../config/validate');
const { body } = require('express-validator');
const { formatApiResponse } = require('../helpers/formatApiResponse');

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll(); // Lấy tất cả bản ghi
        res.json(formatApiResponse(users, 1));
    } catch (err) {
        res.status(500).json(formatApiResponse({ message: err.message }, 0));
    }
};

// Lấy thông tin user theo ID
const getUserById = async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
        const user = await User.findByPk(userId); // Lấy bản ghi theo ID
        if (!user) {
            return res.status(404).json(formatApiResponse({ message: 'User not found' }, 0));
        }
        res.json(formatApiResponse(user, 1));
    } catch (err) {
        res.status(500).json(formatApiResponse({ message: err.message }, 0));
    }
};

const getMe = async (req, res) => {
    try {
        console.log(req.user);
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json(formatApiResponse({ message: 'User not found' }, 0));
        }
        res.json(formatApiResponse(user, 1));
    } catch (err) {
        res.status(500).json(formatApiResponse({ message: err.message }, 0));
    }
};

const createUser = async (req, res) => {
    try {
        validate([
            body('name').notEmpty().withMessage('Name is required'),
            body('name').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
            body('email').notEmpty().withMessage('Email is required'),
            body('email').isEmail().withMessage('Email is not valid'),
            body('password').notEmpty().withMessage('Password is required'),
            body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        ])(req, res, async() => {
            const { name, email, password } = req.body;

            // Kiểm tra email đã tồn tại trong database chưa
            const existingUser = await User.findOne({ where: { email } });

            if (existingUser) {
                return res.status(400).json(formatApiResponse({ message: 'Email is already taken' }, 0));
            }

            // Nếu email chưa tồn tại, tạo mới user
            try {
                const user = await User.create({ name, email, password });
                res.status(201).json(formatApiResponse(user, 1));
            } catch (err) {
                res.status(400).json(formatApiResponse({ message: err.message }, 0));
            }
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(formatApiResponse({ message: err.message }, 0));
    }
}

const editUser = async (req, res) => {
    try {
        validate([
            body('name').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
            body('email').optional().isEmail().withMessage('Email is not valid'),
            body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        ])(req, res, async () => {
            const userId = parseInt(req.params.id);
            const { name, email, password } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json(formatApiResponse({ message: 'User not found' }, 0));
            }

            if (email && email !== user.email) {
                const existingUser = await User.findOne({ where: { email } });
                if (existingUser) {
                    return res.status(400).json(formatApiResponse({ message: 'Email is already taken' }, 0));
                }
            }

            try {
                const updatedUser = await user.update({ name, email, password });
                res.json(formatApiResponse(updatedUser, 1));
            } catch (err) {
                res.status(400).json(formatApiResponse({ message: err.message }, 0));
            }
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(formatApiResponse({ message: err.message }, 0));
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        // Kiểm tra user có tồn tại không
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json(formatApiResponse({ message: 'User not found' }, 0));
        }

        // Xóa user
        try {
            await user.destroy(); // Phương thức destroy sẽ xóa bản ghi khỏi database
            res.status(200).json(formatApiResponse({ message: 'User deleted successfully' }, 1));
        } catch (err) {
            res.status(500).json(formatApiResponse({ message: 'Failed to delete user' }, 0));
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(formatApiResponse({ message: err.message }, 0));
    }
};

module.exports = { getUsers, getUserById, createUser, editUser, deleteUser, getMe };
