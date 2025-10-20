const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const protect = require('../middlewares/authMiddleware');
const validationResultMiddleware = require('../middlewares/validationMiddleware');

const router = express.Router();

const authValidation = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validationResultMiddleware
];

router.post('/register', authValidation, registerUser);
router.post('/login', authValidation, loginUser);
router.post('/logout', protect, logoutUser);

module.exports = router;
