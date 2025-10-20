const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use('/api', authRoutes);

app.use('/api', expenseRoutes);

app.use((req, res, next) => {
    res.status(404);
    const error = new Error(`Not Found - ${req.originalUrl}`);
    next(error);
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(
        `Server running on port ${PORT}`
    )
);
