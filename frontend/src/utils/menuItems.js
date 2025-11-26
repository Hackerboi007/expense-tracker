import {dashboard, expenses, transactions, trend} from '../utils/Icons'

export const menuItems = [
    {
        id: 1,
        title: 'Dashboard',
        icon: dashboard,
        link: '/'
    },
    {
        id: 2,
        title: "View Transactions",
        icon: transactions,
        link: '/',
    },
    {
        id: 3,
        title: "Incomes",
        icon: trend,
        link: "/",
    },
    {
        id: 4,
        title: "Expenses",
        icon: expenses,
        link: "/",
    },
]
