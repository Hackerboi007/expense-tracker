const mongoose = require('mongoose');
const IncomeSchema= require("../models/IncomeModel")

exports.addIncome = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized, no user info' });
    }

    const {title, amount, category, description, date}  = req.body

    const income = IncomeSchema({
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
        await income.save()
        res.status(200).json({message: 'Income Added'})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }

    console.log(income)
}

exports.getIncomes = async (req, res) =>{
    try {
        const incomes = await IncomeSchema.find({ userId: req.user }).sort({createdAt: -1})
        res.status(200).json(incomes)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

exports.deleteIncome = async (req, res) =>{
    const {id} = req.params;
    try {
        const income = await IncomeSchema.findById(id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        if (income.userId.toString() !== req.user) {
            return res.status(401).json({ message: 'Unauthorized action' });
        }
        await IncomeSchema.findByIdAndDelete(id);
        res.status(200).json({message: 'Income Deleted'});
    } catch (err) {
        res.status(500).json({message: 'Server Error'});
    }
}
