const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;
