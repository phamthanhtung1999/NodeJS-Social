const Auth = require('../models/Auth'); // Lấy danh sách tất cả users
const moment = require('moment');
const { validate } = require('../config/validate');
const { body } = require('express-validator');
const { formatApiResponse } = require('../helpers/formatApiResponse'); // Import formatApiResponse

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.SECRET_KEY;

const register = async (req, res) => {
    try {
        validate([
            body('name').notEmpty().withMessage('Name is required'),
            body('name').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
            body('email').notEmpty().withMessage('Email is required'),
            body('email').isEmail().withMessage('Invalid email format'),
            body('password').notEmpty().withMessage('Password is required'),
            body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        ])(req, res, async () => {
            const { name, email, password } = req.body;
            const created_at = moment().format();

            // Check if email already exists in the database
            const existingUser = await Auth.findOne({ where: { email } });

            if (existingUser) {
                return res.status(400).json(formatApiResponse({ message: 'Email is already taken' }, 0));
            }

            // If email does not exist, create a new user
            try {
                const user = await Auth.create({ name, email, password, created_at });
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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Auth.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json(formatApiResponse({ message: 'Email does not exist!' }, 0));
        }

        // Compare user-entered password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json(formatApiResponse({ message: 'Incorrect password!' }, 0));
        }

        // Generate token after successful authentication
        const token = jwt.sign(
            { id: user.id, email: user.email },
            SECRET_KEY,
            { expiresIn: '1h' } // Expires in 1 hour
        );

        res.json(formatApiResponse({ token }, 1));
    } catch (err) {
        res.status(500).json(formatApiResponse({ message: 'An error occurred!' }, 0));
    }
}

module.exports = { register, login };
