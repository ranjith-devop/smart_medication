const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { generateOTP, sendMobileOTP, sendEmailOTP } = require('../services/otpService');
const { OAuth2Client } = require('google-auth-library');

// We need a Google Client ID for backend verification
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Send OTP to Mobile
// @route   POST /api/auth/send-otp-mobile
// @access  Public
const sendMobileOtp = async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }

    try {
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes

        // Find user or create temporary record (upsert)
        let user = await User.findOne({ phoneNumber });

        if (!user) {
            user = new User({ phoneNumber });
        }

        user.otp = { code: otp, expiresAt };
        await user.save();

        await sendMobileOTP(phoneNumber, otp);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify Mobile OTP
// @route   POST /api/auth/verify-otp-mobile
// @access  Public
const verifyMobileOtp = async (req, res) => {
    const { phoneNumber, otp } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });

        if (!user || !user.otp || user.otp.code !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otp.expiresAt < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // OTP Valid
        user.isPhoneVerified = true;
        user.otp = undefined; // Clear OTP
        await user.save();

        // If user already has a name/password set (existing user), log them in
        // If not, return a flag telling frontend to redirect to "Finish Registration"
        const isNewUser = !user.name || !user.password;

        if (isNewUser) {
            res.status(200).json({
                message: 'OTP Verified',
                isNewUser: true,
                _id: user._id
            });
        } else {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Send OTP to Email
// @route   POST /api/auth/send-otp-email
// @access  Public
const sendEmailOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email });
        }

        user.otp = { code: otp, expiresAt };
        await user.save();

        await sendEmailOTP(email, otp);

        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify Email OTP
// @route   POST /api/auth/verify-otp-email
// @access  Public
const verifyEmailOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !user.otp || user.otp.code !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otp.expiresAt < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        user.isEmailVerified = true;
        user.otp = undefined;
        await user.save();

        const isNewUser = !user.name || !user.password;

        if (isNewUser) {
            res.status(200).json({
                message: 'OTP Verified',
                isNewUser: true,
                _id: user._id
            });
        } else {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Complete Registration (Set Name/Password)
// @route   POST /api/auth/register-finish
// @access  Public (but requires userId)
const finishRegistration = async (req, res) => {
    const { userId, name, password, role } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name;
        user.password = password; // Will be hashed by pre-save hook
        if (role) user.role = role;

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Google Auth
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
    const { idToken } = req.body;

    // In a real app, verify the token. 
    // For now, we simulate trusting the frontend payload if mock
    // const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    // const { name, email, sub: googleId } = ticket.getPayload();

    // MOCK IMPLEMENTATION FOR NOW (Since we don't have a real Google Client ID yet)
    // The frontend should send { email, name, googleId } for this mock to work
    // In production, NEVER trust the body like this without verifying the token
    const { email, name, googleId } = req.body;

    try {
        let user = await User.findOne({ googleId });

        if (!user) {
            // Check if email exists to link accounts? 
            user = await User.findOne({ email });
            if (user) {
                user.googleId = googleId;
            } else {
                user = new User({ email, name, googleId, isEmailVerified: true });
            }
        }

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Login with Password
// @route   POST /api/auth/login
// @access  Public
const loginWithPassword = async (req, res) => {
    const { identifier, password } = req.body; // identifier can be phone or email

    if (!identifier || !password) {
        return res.status(400).json({ message: 'Please provide identifier and password' });
    }

    try {
        // Find user by phone or email
        let user = await User.findOne({
            $or: [
                { phoneNumber: identifier },
                { email: identifier }
            ]
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if user has set a password
        if (!user.password) {
            return res.status(400).json({
                message: 'Please complete registration first',
                requiresRegistration: true
            });
        }

        // Verify password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Return user data with token
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Request Password Reset (Send OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { identifier, method } = req.body; // identifier: phone or email, method: 'MOBILE' or 'EMAIL'

    if (!identifier || !method) {
        return res.status(400).json({ message: 'Identifier and method are required' });
    }

    try {
        // Find user by phone or email
        let user;
        if (method === 'MOBILE') {
            user = await User.findOne({ phoneNumber: identifier });
        } else {
            user = await User.findOne({ email: identifier });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes

        user.otp = { code: otp, expiresAt };
        await user.save();

        // Send OTP
        if (method === 'MOBILE') {
            await sendMobileOTP(identifier, otp);
        } else {
            await sendEmailOTP(identifier, otp);
        }

        res.status(200).json({
            message: 'Password reset OTP sent successfully',
            userId: user._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { identifier, otp, newPassword, method } = req.body;

    if (!identifier || !otp || !newPassword || !method) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Find user
        let user;
        if (method === 'MOBILE') {
            user = await User.findOne({ phoneNumber: identifier });
        } else {
            user = await User.findOne({ email: identifier });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify OTP
        if (!user.otp || user.otp.code !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otp.expiresAt < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Update password
        user.password = newPassword; // Will be hashed by pre-save hook
        user.otp = undefined; // Clear OTP
        await user.save();

        res.status(200).json({
            message: 'Password reset successfully',
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    sendMobileOtp,
    verifyMobileOtp,
    sendEmailOtp,
    verifyEmailOtp,
    finishRegistration,
    googleAuth,
    loginWithPassword,
    forgotPassword,
    resetPassword
};
