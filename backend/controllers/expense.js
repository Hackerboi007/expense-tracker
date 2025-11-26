const ExpenseSchema = require("../models/ExpenseModel")


const mongoose = require('mongoose');

exports.addExpense = async (req, res) => {
    const {title, amount, category, description, date}  = req.body

    const expense = ExpenseSchema({
        title,
        amount,
        category,
        description,
        date,
        userId: mongoose.Types.ObjectId(req.user)
    })

    try {
        if(!title || !category || !description || !date){
            return res.status(400).json({message: 'All fields are required!'})
        }
        const amt = Number(amount);
        if(amt <= 0 || isNaN(amt)){
            return res.status(400).json({message: 'Amount must be a positive number!'})
        }
        await expense.save()
        res.status(200).json({message: 'Expense Added'})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }

    console.log(expense)
}

exports.getExpense = async (req, res) =>{
    try {
        const expenses = await ExpenseSchema.find({ userId: req.user }).sort({createdAt: -1})
        res.status(200).json(expenses)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

exports.deleteExpense = async (req, res) =>{
    const {id} = req.params;
    try {
        const expense = await ExpenseSchema.findById(id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        if (expense.userId.toString() !== req.user) {
            return res.status(401).json({ message: 'Unauthorized action' });
        }
        await ExpenseSchema.findByIdAndDelete(id);
        res.status(200).json({message: 'Expense Deleted'});
    } catch (err) {
        res.status(500).json({message: 'Server Error'});
    }
}

