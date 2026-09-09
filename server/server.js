const path = require('path');
const express = require('express');
const cors = require('cors');
// 1. Load variables first at the very top
require('dotenv').config(); 

const connectDB = require('./config/db');
const app = express();

// 2. Connect to the database using your helper function
connectDB();

// Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Serve property upload images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/deals',   require('./routes/dealsRoute'));
app.use('/api/clients', require('./routes/clientRoute'));

// Serve frontend static build in production
if (process.env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '../client/build');
    app.use(express.static(buildPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
}

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;