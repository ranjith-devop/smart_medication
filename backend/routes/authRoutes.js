const express = require('express');
const router = express.Router();
const {
    sendMobileOtp,
    verifyMobileOtp,
    sendEmailOtp,
    verifyEmailOtp,
    finishRegistration,
    googleAuth,
    loginWithPassword,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');

router.post('/send-otp-mobile', sendMobileOtp);
router.post('/verify-otp-mobile', verifyMobileOtp);
router.post('/send-otp-email', sendEmailOtp);
router.post('/verify-otp-email', verifyEmailOtp);
router.post('/register-finish', finishRegistration);
router.post('/google', googleAuth);
router.post('/login', loginWithPassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
