const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');  
const connectDb = require("./config/db");
dotenv.config();
connectDb();




const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');


const corsOptions = {
  origin: ['http://localhost:5173', 'https://redologin.netlify.app', "http://localhost:4000"],
  credentials: true,
  optionsSuccessStatus: 200
};

//



const app = express();

// Middleware
app.use(express.json());
app.use(cors(corsOptions));  

app.use("/",express.static("dist"));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});