require('dotenv').config();
console.log("ENV PATH:", __dirname + "/.env");
console.log("JWT_SECRET =", process.env.JWT_SECRET);


const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
readdirSync('./routes')
    .filter(route => route !== 'auth.js')
    .map(route => app.use('/api/v1', require('./routes/' + route)));

// Default route
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running');
});

const server = () => {
    db();
    app.listen(PORT, () => {
        console.log('listening to port:', PORT);
    });
};

server();
