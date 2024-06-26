import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseTracker = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    // Fetch expenses from the backend when the component mounts
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/expenses');
                setTransactions(response.data);
                const totalBalance = response.data.reduce((acc, transaction) => acc + transaction.amount, 0);
                setBalance(totalBalance);
            } catch (err) {
                console.error('Error fetching expenses:', err);
            }
        };

        fetchExpenses();
    }, []);

    const addExpense = async () => {
        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/expenses', {
                description,
                amount: parsedAmount
            });

            const newExpense = response.data;
            // Update balance and transactions with the new expense
            setBalance(prevBalance => prevBalance + parsedAmount);
            setTransactions(prevTransactions => [...prevTransactions, newExpense]);

            // Clear form
            setDescription('');
            setAmount('');
        } catch (err) {
            console.error('Error adding expense:', err);
        }
    };

    return (
        <div className="container">
            <h1>Expense Tracker</h1>
            <div className="balance">
                <h2>
                    Balance: $
                    <span id="balance">{balance.toFixed(2)}</span>
                </h2>
            </div>
            <div className="transactions">
                <h2>Transactions</h2>
                <ul>
                    {transactions.map((transaction, index) => (
                        <li key={index}>
                            {`${transaction.description}: $${transaction.amount.toFixed(2)}`}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="add-expense">
                <h2>Add Expense</h2>
                <form>
                    <label htmlFor="description">Description:</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    />
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        id="amount"
                        step="0.01"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        required
                    />
                    <button type="button" onClick={addExpense}>Add Expense</button>
                </form>
            </div>
        </div>
    );
};

export default ExpenseTracker;
