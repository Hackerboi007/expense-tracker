const User = require('../models/UserModel');
const Income = require('../models/IncomeModel');
const Expense = require('../models/ExpenseModel');

exports.listUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { role, username, email } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (role) user.role = role;
        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();
        const result = user.toObject();
        delete result.password;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Prevent an admin from deleting themselves
        if (req.user && req.user.toString() === id.toString()) {
            return res.status(400).json({ message: 'Cannot delete yourself' });
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getUserTransactions = async (req, res) => {
    const { id } = req.params;
    try {
        const incomes = await Income.find({ userId: id }).sort({ createdAt: -1 });
        const expenses = await Expense.find({ userId: id }).sort({ createdAt: -1 });

        const incomeTotal = incomes.reduce((sum, it) => sum + (it.amount || 0), 0);
        const expenseTotal = expenses.reduce((sum, it) => sum + (it.amount || 0), 0);

        res.status(200).json({
            incomes,
            expenses,
            totals: {
                incomeTotal,
                expenseTotal,
                balance: incomeTotal - expenseTotal
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
