const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose.connect('mongodb+srv://kavya:kavya@cluster0.5mosqx1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Define a schema and model for expenses
const expenseSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    date: { type: Date, default: Date.now }
});

const Expense = mongoose.model('Expense', expenseSchema);

// API endpoints
app.post('/api/expenses', async (req, res) => {
    try {
        const { description, amount } = req.body;
        const newExpense = new Expense({ description, amount });
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
