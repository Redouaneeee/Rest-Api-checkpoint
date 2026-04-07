const User = require('../models/User');

// ============================================
// GET ALL USERS
// ============================================
const getAllUsers = async (req, res) => {
    try {
        
        const users = await User.find().select('-password');
        
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
};

// ============================================
// GET USER BY ID
// ============================================
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        
       
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        
        // Handle invalid ID format
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// CREATE USER (Protected)
// ============================================
const createUser = async (req, res) => {
    try {
        const { name, email, password, age } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }
        
      
        const user = new User({
            name,
            email,
            password,  
            age
        });
        
        await user.save();
        
        
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: userResponse
        });
        
    } catch (error) {
        console.error('Error creating user:', error); 
        
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ============================================
// UPDATE USER BY ID
// ============================================
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
       
        if (updates.password) {
            delete updates.password;
        }
        
        // Find user by ID and update
        const updatedUser = await User.findByIdAndUpdate(
            id,
            updates,
            { 
                new: true,           // Return updated document
                runValidators: true  // Run schema validations
            }
        ).select('-password');  // Exclude password from response
        
        // Check if user exists
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
};

// ============================================
// DELETE USER BY ID
// ============================================
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find user by ID and delete
        const deletedUser = await User.findByIdAndDelete(id);
        
        // Check if user exists
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Remove password from response
        const userResponse = deletedUser.toObject();
        delete userResponse.password;
        
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: userResponse
        });
        
    } catch (error) {
        console.error('Error deleting user:', error);
        
        // Handle invalid ID format
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};