// server.js - add hozzá ezt a middleware-t
const express = require('express');
var cors = require('cors');
const { users, saveUsers, idojaras, saveIdojaras } = require('./utils/store');

const userRoutes = require('./modules/users');
const idojarasRoutes = require('./modules/idojaras');

const app = express();

// DEBUG Middleware - minden kérés logolása
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Middleware-ek
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get('/', (_req, res) => {
    res.send('Pálinkás Andor 13.A - Bajai SZC Türr István Technikum - Szoftverfejlesztő');
});

app.use('/users', userRoutes);
app.use('/idojaras', idojarasRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Hiba történt:', err);
    res.status(500).json({ error: 'Szerver hiba' });
});

app.listen(3000, ()=>{
    console.log(`http://localhost:3000`);
});