const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const User = require('./models/User');


dotenv.config();

connectDb()


const app = express();

app.use(express.json());

// ============================================
// 1. GET ROUTE - RETURN ALL USERS
// ============================================
app.get('/api/users', async (req, res) => {
    try {
  
        const users = await User.find();
        
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// ============================================
// 2. POST ROUTE - ADD A NEW USER
// ============================================
app.post('/api/users', async (req, res) => {
    try {
       
        const { name, email, password, age } = req.body;
        
       
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        
      
        const newUser = new User({
            name,
            email,
            password,
            age
        });
        
       
        const savedUser = await newUser.save();
        
       
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: savedUser
        });
    } catch (error) {
        console.error('Error creating user:', error);
        
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// ============================================
// 3. PUT ROUTE - EDIT A USER BY ID
// ============================================
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true })
        
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error);
            res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});
// ============================================
// 4. DELETE ROUTE - REMOVE A USER BY ID
// ============================================
app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        
        const deletedUser = await User.findByIdAndDelete(id);
        
        
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
       
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: deletedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});


app.listen(4000, () => {
  console.log("listenning on port 4000")
})