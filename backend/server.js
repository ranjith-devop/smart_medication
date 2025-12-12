const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cors());

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5001;

// Connect to database and start server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Failed to connect to DB:', error);
        process.exit(1);
    }
};

startServer();
