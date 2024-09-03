const nodemailer = require("nodemailer");

// Create a transporter object using Gmail's SMTP transport
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send a password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `http://localhost:3000/auth/reset-password/reset/${resetToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email, // Use the dynamic recipient email address
    subject: "Password Reset Request",
    text: `You requested a password reset. Click the following link to reset your password: ${resetUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

// Function to send a verification code email
const sendVerificationCodeEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
  };
  console.log(code)
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification code email:", error);
    throw error; // Optionally re-throw the error to handle it further up the chain
  }
};

// Export functions
module.exports = { sendPasswordResetEmail, sendVerificationCodeEmail };
