const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');  
const authRoutes = require('./routes/authroutes');
const userRoutes = require('./routes/userRoutes');
const connectDb = require("./config/db");


const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};




connectDb();

const app = express();

// Middleware
app.use(express.json());
app.use(cors(corsOptions));  

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});