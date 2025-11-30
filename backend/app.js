require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');

const app = express();

const PORT = process.env.PORT || 5000;

// --------------------------------------------
// FIXED CORS FOR VERCEL FRONTEND
// --------------------------------------------
app.use(cors({
    origin: ["https://expense-tracker-brown-seven.vercel.app"],  // your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Parse JSON
app.use(express.json());

// --------------------------------------------
// ROUTES
// --------------------------------------------

// Auth routes
app.use('/api/v1/auth', require('./routes/auth'));

// Automatically load other routes
readdirSync('./routes')
    .filter(route => route !== 'auth.js')
    .map(route =>
        app.use('/api/v1', require('./routes/' + route))
    );

// Default route
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running...');
});

// --------------------------------------------
// START SERVER
// --------------------------------------------
const server = () => {
    db();
    app.listen(PORT, () => {
        console.log('Backend running on port:', PORT);
    });
};

server();
