const crypto = require('crypto');
// In a real app, you would use Twilio or generic SMS providers
// and Nodemailer or SendGrid for emails.

const generateOTP = () => {
    // Generates a 6 digit numeric OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendMobileOTP = async (phoneNumber, otp) => {
    console.log(`\n================================`);
    console.log(`[MOCK SMS] To: ${phoneNumber}`);
    console.log(`[MOCK SMS] Code: ${otp}`);
    console.log(`================================\n`);
    // Return true to simulate success
    return true;
};

const sendEmailOTP = async (email, otp) => {
    console.log(`\n================================`);
    console.log(`[MOCK EMAIL] To: ${email}`);
    console.log(`[MOCK EMAIL] Subject: Your SmartMeds Verification Code`);
    console.log(`[MOCK EMAIL] Code: ${otp}`);
    console.log(`================================\n`);
    // Return true to simulate success
    return true;
};

module.exports = {
    generateOTP,
    sendMobileOTP,
    sendEmailOTP
};
