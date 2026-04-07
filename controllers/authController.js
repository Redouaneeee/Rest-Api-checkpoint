const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ============================================
// HASH PASSWORD FUNCTION
// ============================================
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// ============================================
// COMPARE PASSWORD FUNCTION
// ============================================
const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

// ============================================
// GENERATE JWT TOKEN
// ============================================
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// ============================================
// REGISTER USER (Hash password here)
// ============================================
const register = async (req, res) => {
    try {
        const { name, email, password, age } = req.body;
        
       
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }
        
       
        const hashedPassword = await hashPassword(password);
        
       
        const user = new User({
            name,
            email,
            password: hashedPassword, 
            age
        });
        
        await user.save();
        
     
        const token = generateToken(user._id);
        
       
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: userResponse
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// LOGIN USER 
// ============================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }
        
        // Find user by email (include password field)
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Check if password matches using bcrypt compare
        const isPasswordMatch = await comparePassword(password, user.password);
        
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }
        
        const token = generateToken(user._id);
        
        
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: userResponse
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// GET CURRENT USER (Protected Route)
// ============================================
const getCurrentUser = async (req, res) => {
    try {
        
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            success: true,
            user
        });
        
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getCurrentUser,
    hashPassword,      
    comparePassword    
};