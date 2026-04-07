const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
    },
    
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false 
    },
    
    age: {
        type: Number,
        min: [0, 'Age cannot be negative'],
        max: [120, 'Age cannot be more than 120']
    }
});


module.exports = mongoose.model('User', userSchema);