const Expense = require('../models/Expense');
const mongoose = require('mongoose');

const addExpense = async (req, res, next) => {
    try {
        const { title, amount, category, date } = req.body;
        
        const expense = await Expense.create({
            userId: req.userId,
            title,
            amount,
            category,
            date
        });

        res.status(201).json({
            message: 'Expense added successfully',
            id: expense._id
        });
    } catch (error) {
        next(error);
    }
};

const getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
        
        const formattedExpenses = expenses.map(e => ({
            id: e._id,
            title: e.title,
            amount: e.amount,
            category: e.category,
            date: e.date.toISOString().split('T')[0]
        }));
        
        res.json(formattedExpenses);
    } catch (error) {
        next(error);
    }
};

const getExpenseById = async (req, res, next) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, userId: req.userId });

        if (!expense) {
            res.status(404);
            throw new Error('Expense not found');
        }

        res.json({
            id: expense._id,
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            date: expense.date.toISOString().split('T')[0]
        });
    } catch (error) {
        if (error instanceof mongoose.CastError && error.path === '_id') {
            res.status(404);
            error.message = 'Expense not found';
        }
        next(error);
    }
};

const updateExpense = async (req, res, next) => {
    try {
        const { title, amount, category, date } = req.body;
        
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { title, amount, category, date },
            { new: true, runValidators: true }
        );

        if (!expense) {
            res.status(404);
            throw new Error('Expense not found or unauthorized');
        }

        res.json({ message: 'Expense updated successfully' });
    } catch (error) {
        if (error instanceof mongoose.CastError && error.path === '_id') {
            res.status(404);
            error.message = 'Expense not found or unauthorized';
        }
        next(error);
    }
};

const deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });

        if (!expense) {
            res.status(404);
            throw new Error('Expense not found or unauthorized');
        }

        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        if (error instanceof mongoose.CastError && error.path === '_id') {
            res.status(404);
            error.message = 'Expense not found or unauthorized';
        }
        next(error);
    }
};

const getMonthlyReport = async (req, res, next) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            res.status(400);
            throw new Error('Month and year query parameters are required');
        }

        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0);

        const pipeline = [
            {
                $match: {
                    userId: req.userId,
                    date: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: '$category',
                    totalCategoryAmount: { $sum: '$amount' }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalCategoryAmount' },
                    categories: { $push: { k: '$_id', v: '$totalCategoryAmount' } }
                }
            },
            {
                $project: {
                    _id: 0,
                    total: 1,
                    categories: { $arrayToObject: '$categories' }
                }
            }
        ];

        const report = await Expense.aggregate(pipeline);

        const responseData = report[0] || { total: 0, categories: {} };

        res.json(responseData);
    } catch (error) {
        next(error);
    }
};

const getCategoryReport = async (req, res, next) => {
    try {
        const { category } = req.query;

        if (!category) {
            res.status(400);
            throw new Error('Category query parameter is required');
        }
        
        const expenses = await Expense.find({ userId: req.userId, category }).sort({ date: -1 });
        
        const formattedExpenses = expenses.map(e => ({
            id: e._id,
            title: e.title,
            amount: e.amount,
            category: e.category,
            date: e.date.toISOString().split('T')[0]
        }));
        
        res.json(formattedExpenses);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
    getMonthlyReport,
    getCategoryReport
};
