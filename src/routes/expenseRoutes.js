const express = require('express');
const { query, body, param } = require('express-validator');
const { 
    addExpense, 
    getExpenses, 
    getExpenseById, 
    updateExpense, 
    deleteExpense,
    getMonthlyReport,
    getCategoryReport
} = require('../controllers/expenseController');
const protect = require('../middlewares/authMiddleware');
const validationResultMiddleware = require('../middlewares/validationMiddleware');

const router = express.Router();

router.use(protect);

const expenseValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('amount').isNumeric().toFloat().isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('date').isDate().withMessage('Date must be a valid date format (YYYY-MM-DD)'),
    validationResultMiddleware
];

router.route('/expenses')
    .get(getExpenses)
    .post(expenseValidation, addExpense);

router.route('/expenses/:id')
    .get(
        param('id').isMongoId().withMessage('Invalid expense ID'),
        validationResultMiddleware, 
        getExpenseById
    )
    .put(expenseValidation, updateExpense)
    .delete(
        param('id').isMongoId().withMessage('Invalid expense ID'),
        validationResultMiddleware,
        deleteExpense
    );

router.get('/reports/monthly', 
    [
        query('month').isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
        query('year').isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year'),
        validationResultMiddleware
    ], 
    getMonthlyReport
);

router.get('/reports/category', 
    [
        query('category').notEmpty().withMessage('Category is required'),
        validationResultMiddleware
    ], 
    getCategoryReport
);

module.exports = router;
