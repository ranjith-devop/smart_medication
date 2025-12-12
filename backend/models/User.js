const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: false, // Name might not be available initially during OTP auth
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // Allows null/undefined to be unique (for phone-only users)
    },
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true, // Allows null/undefined to be unique (for email/google-only users)
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    password: {
        type: String,
        required: false, // Optional if using Google Auth
    },
    role: {
        type: String,
        enum: ['doctor', 'patient', 'admin', 'caregiver'],
        default: 'patient',
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    },
    // Temporary fields for OTP (In a real app, you might store this in Redis or a separate collection)
    otp: {
        code: String,
        expiresAt: Date,
    }
}, {
    timestamps: true,
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
